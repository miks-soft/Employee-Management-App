import notifee from '@notifee/react-native';

import * as Geolocation from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { debounce } from 'lodash';

import { ScheduleLinks } from '#navigation/Main/Schedule/linking';

import { WorktimeAPIRaw } from '#api/controllers/Worktime';

import Crashlytics from '#services/Crashlytics';
import NotificationManager from '#services/NotificationManager';

import { BackgroundTasks, SpecialNotificationIds } from '#config';
import { EnumTrackerStatus } from '#config/enums';

import { generateDeepLink } from '#utils';
import Debug from '#utils/debug';

import { reloadStore, store } from '#store';
import { LocationActions } from '#store/slices/location';

import Tracker from '.';

type GeofencingEvent = {
  eventType: Geolocation.GeofencingEventType;
  region: Geolocation.GeofencingRegionState;
};

type BackgroundTaskGeofencingEvent = {
  data: GeofencingEvent;
  error: { message: string };
};

//do not refactor this into location, will cause import cycles and result in strange consequences
class BackgroundWorker {
  static async handleGeofencingEvent({ data }: BackgroundTaskGeofencingEvent) {
    if (!data) {
      return;
    }

    await reloadStore();

    const tracker = store.getState().tracker;
    const isEnter = data?.eventType === Geolocation.GeofencingEventType.Enter;

    store.dispatch(LocationActions.setRegion(data?.region));

    if (isEnter) {
      Crashlytics.log('[LOCATION] Inside zone');

      Debug.notification('Пользователь в зоне проекта');

      let canStart = await WorktimeAPIRaw.canStart();

      Crashlytics.log('[LOCATION] can start', `${canStart}`);

      if (
        tracker.status !== EnumTrackerStatus.ACTIVE &&
        canStart?.data === true
      ) {
        Tracker.start();
      }

      NotificationManager.delete(SpecialNotificationIds.TRACKER_OUT_OF_ZONE);

      return;
    } else {
      Crashlytics.log('[LOCATION] Out of zone');

      Debug.notification('Пользователь не в зоне проекта');

      if (tracker.status === EnumTrackerStatus.ACTIVE) {
        Tracker.pause();

        NotificationManager.create({
          title: 'Employee Management App',
          id: SpecialNotificationIds.TRACKER_OUT_OF_ZONE,
          body: 'Вы покинули рабочее место, рабочий день будет поставлен на паузу',
          data: {
            link: generateDeepLink(
              (ScheduleLinks.TimeTracking as string)!.replace(
                ':id',
                tracker.project!.id,
              ),
            ),
          },
          android: {
            channelId: 'all',
            importance: 4,
          },
        });
      }
    }
  }

  static async startForegroundServiceTasks() {}

  static register() {
    if (!TaskManager.isTaskDefined(BackgroundTasks.GEOFENCING)) {
      TaskManager.defineTask(
        BackgroundTasks.GEOFENCING,
        //@ts-ignore
        debounce(this.handleGeofencingEvent),
      );
    }

    notifee.registerForegroundService(() => {
      return new Promise(() => {
        BackgroundWorker.startForegroundServiceTasks();
      });
    });
  }
}

export default BackgroundWorker;
