import { WorktimeAPIRaw } from '#api/controllers/Worktime';
import { RequestsWorktime } from '#api/controllers/Worktime/types';

import Crashlytics from '#services/Crashlytics';
import ForegroundService from '#services/ForegroundService';
import NotificationManager from '#services/NotificationManager';

import { EnumTrackerStatus } from '#config/enums';

import Debug from '#utils/debug';

import { IS_IOS } from '#styles';

import { persistor, reloadStore, store } from '#store';
import { AppActions } from '#store/slices/app';
import { TrackerActions } from '#store/slices/tracker';

import LocationWatcher from '../LocationWatcher';
import AppActivity from './AppActivity';
import Pedometer from './Pedometer';
import Timer from './Timer';

class Tracker {
  static async start(withAPI = true) {
    await reloadStore();
    Crashlytics.log('[TRACKING] starting: init');

    const project = store.getState().tracker.project;

    Crashlytics.log('[TRACKING] starting: request');
    const res = withAPI
      ? await WorktimeAPIRaw.start({
          data: { vacancy_id: project?.id! },
        })
      : undefined;

    Crashlytics.log('[TRACKING] starting: subservices');

    Timer.start();
    Pedometer.start();
    LocationWatcher.start(true);

    store.dispatch(TrackerActions.setTrackerStatus(EnumTrackerStatus.ACTIVE));

    await persistor.flush();

    ForegroundService.start('Идёт учет времени');
    Crashlytics.log('[TRACKING] Started');
    Debug.notification('Трекинг начат');

    return res;
  }

  static async end(withAPI = true) {
    await reloadStore();

    const res = withAPI ? await WorktimeAPIRaw.stop() : undefined;

    store.dispatch(TrackerActions.setTrackerStatus(EnumTrackerStatus.READY));

    if (store.getState().location.shouldPersist === false) {
      !IS_IOS && LocationWatcher.end();
      ForegroundService.stop();
    }

    Timer.end();
    Pedometer.end();

    Crashlytics.log('[TRACKING] End');

    await persistor.flush();

    Debug.notification('Трекинг окончен');
    return res;
  }

  static async pause(withAPI = true) {
    await reloadStore();

    const res = withAPI ? await WorktimeAPIRaw.pause() : undefined;

    store.dispatch(TrackerActions.setTrackerStatus(EnumTrackerStatus.PAUSED));

    Timer.pause();
    Pedometer.pause();

    Crashlytics.log('[TRACKING] Paused');

    await persistor.flush();

    Debug.notification('Пауза');
    return res;
  }

  static async requestPermissions() {
    store.dispatch(AppActions.setPermissionsRequested(true));
    Crashlytics.log('[PERMISSIONS] request permissions: permissions');
    const locationStatus =
      await LocationWatcher.requestPermissionWithFallbackAlert();
    const pedometerStatus =
      await Pedometer.requestPermissionsWithFallbackAlert();
    const batteryOptimizationRestrictionsDisabled =
      await NotificationManager.requestPermission();
    const haveAppUsagePermissions =
      await AppActivity.requestPermissionsWithAlertFallback();

    if (
      locationStatus !== 'granted' ||
      pedometerStatus !== 'granted' ||
      batteryOptimizationRestrictionsDisabled !== 'granted' ||
      !haveAppUsagePermissions
    ) {
      Crashlytics.log('[PERMISSIONS] starting: no permissions ');
      return false;
    }

    Crashlytics.log('[PERMISSIONS] request permissions: true ');

    return true;
  }

  static syncWithBE(
    worktimeTracks: RequestsWorktime['getTodayWorktime']['response'],
  ) {
    const latestWokrtime = worktimeTracks![0];

    let BEStatus = (latestWokrtime?.stop_type ?? 'active') as EnumTrackerStatus;

    if (!latestWokrtime) {
      Timer.reset();
      BEStatus = EnumTrackerStatus.READY;
    } else {
      Timer.set(
        BEStatus === EnumTrackerStatus.ACTIVE
          ? new Date(latestWokrtime.start_date!).toISOString()
          : '',
        worktimeTracks!
          .filter(el => el.stop_type)
          .reduce((acc, el) => acc + (el.count as unknown as number), 0) * 1000,
      );
    }

    const { status } = store.getState().tracker;

    if (status !== BEStatus) {
      const moveToFuncMap = {
        [EnumTrackerStatus.ACTIVE]: this.start,
        [EnumTrackerStatus.PAUSED]: this.pause,
        [EnumTrackerStatus.READY]: this.end,
      };

      moveToFuncMap[BEStatus](false);
    }
  }
}

export default Tracker;
