import notifee from '@notifee/react-native';

import { ScheduleLinks } from '#navigation/Main/Schedule/linking';

import { SpecialNotificationIds } from '#config';

import { generateDeepLink } from '#utils';

import { IS_IOS } from '#styles';

import { store } from '#store';
import { ForegroundServiceActions } from '#store/slices/foregroundService';

import Crashlytics from './Crashlytics';

class ForegroundService {
  static start(description = 'Идет учёт времени', force = true) {
    const project = store.getState().tracker.project;
    const currentIsActive = store.getState().foregroundService.isActive;
    const shouldStartForegroundService =
      !IS_IOS && project && (force || !currentIsActive);

    Crashlytics.log(
      '[FOREGROUND-SERVICE]',
      'project',
      JSON.stringify(project),
      'current is active',
      JSON.stringify(currentIsActive),
      'shuld start',
      JSON.stringify(shouldStartForegroundService),
    );

    if (shouldStartForegroundService) {
      store.dispatch(ForegroundServiceActions.setActive(true));

      notifee.displayNotification({
        id: SpecialNotificationIds.FOREGROUND_SERVICE,
        title: 'Employee Management App',
        body: description,
        data: {
          link: generateDeepLink(
            (ScheduleLinks.TimeTracking as string).replace(':id', project.id),
          ),
        },
        android: {
          ongoing: true,
          channelId: 'foreground',
          smallIcon: 'ic_stat_name',
          asForegroundService: true,
        },
      });
    }
  }

  static stop(force = false) {
    const { isActive, forceStopped } = store.getState().foregroundService;
    if (isActive && force) {
      store.dispatch(ForegroundServiceActions.setForceStopped(true));
      return;
    }

    if (!forceStopped) {
      store.dispatch(ForegroundServiceActions.setForceStopped(false));
    }

    store.dispatch(ForegroundServiceActions.setActive(false));
    notifee.cancelDisplayedNotification(
      SpecialNotificationIds.FOREGROUND_SERVICE,
    );
    return notifee.stopForegroundService();
  }
}

export default ForegroundService;
