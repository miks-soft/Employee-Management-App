import { Alert, Linking, PermissionsAndroid } from 'react-native';

import notifee, { EventType, Notification } from '@notifee/react-native';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

import Crashlytics from '#services/Crashlytics';
import ForegroundService from '#services/ForegroundService';
import LocationWatcher from '#services/LocationWatcher';
import Tracker from '#services/Tracker';
import AppActivity from '#services/Tracker/AppActivity';
import Pedometer from '#services/Tracker/Pedometer';

import { SilentPushTypes } from '#config';
import { EnumTrackerStatus } from '#config/enums';

import Debug from '#utils/debug';

import { IS_IOS } from '#styles';

import { reloadStore, store } from '#store';
import { LocationActions } from '#store/slices/location';
import { TrackerActions } from '#store/slices/tracker';

import { CollectDataPushPayload, StartLocationPushPayload } from './types';

const handleStartLocationPush = async (payload: StartLocationPushPayload) => {
  await reloadStore();

  store.dispatch(
    TrackerActions.setProject({ ...payload, id: payload.vacancy_id }),
  );
  store.dispatch(LocationActions.setShouldPersist(true));

  if (store.getState().tracker.status === EnumTrackerStatus.ACTIVE) {
    await Tracker.end();
    await Tracker.start();
  }

  if (store.getState().tracker.status === EnumTrackerStatus.PAUSED) {
    await Tracker.end();
  }

  Debug.notification('Пуш - старт отслеживания геопозиции');

  ForegroundService.start('Идет отслеживание месторасположения');
  LocationWatcher.start(true);
};

const handleStopLocationPush = async () => {
  await reloadStore();

  store.dispatch(LocationActions.setShouldPersist(false));

  try {
    await Tracker.end();
    !IS_IOS && LocationWatcher.done();
    ForegroundService.stop();
  } catch {}

  Debug.notification('Пуш - стоп отслеживания геопозиции');
};

const handleCollectDataPush = async (payload: CollectDataPushPayload) => {
  await reloadStore();

  const { tracker } = store.getState();

  Crashlytics.log('[STEPS][STORE] Tracker project', JSON.stringify(tracker));
  Crashlytics.log('[STEPS][PAYLOAD]', JSON.stringify(payload));

  Debug.notification(
    'Сбор шагов, текущий проект?:',
    `${payload.vacancy === tracker.project?.id}`,
  );

  if (!IS_IOS) {
    AppActivity.collect(
      +payload.steps_date_from * 1000,
      +payload.steps_date_to * 1000,
    );
  }

  Pedometer.collect(
    +payload.steps_date_from * 1000,
    +payload.steps_date_to * 1000,
  );
};

class NotificationManager {
  static async init() {
    if (IS_IOS) {
      await notifee.requestPermission();
    } else {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      await notifee.createChannel({
        id: 'all',
        name: 'Все уведомления',
        sound: 'default',
      });

      await notifee.createChannel({
        id: 'foreground',
        name: 'Сервис фоновой работы',
      });

      await notifee.createChannel({
        id: 'debug',
        name: 'Уведомления об отладке',
      });
    }

    notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS && detail.notification) {
        this.handleNotificationPress(detail.notification);
      }
    });
  }

  static registerBackgroundListener() {
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS && detail.notification) {
        this.handleNotificationPress(detail.notification);
      }
    });
  }

  static create(options: Notification, noSound = false) {
    return notifee.displayNotification({
      ...options,
      ios: {
        ...(noSound ? {} : { sound: 'default' }),
        ...options.ios,
      },
      android: {
        ...(noSound ? {} : { sound: 'default' }),
        channelId: 'all',
        smallIcon: 'ic_stat_name',
        ...options.android,
      },
    });
  }

  static delete(id: string) {
    return notifee.cancelDisplayedNotification(id);
  }

  static handleNotificationPress(notification: Notification) {
    if (notification?.data?.link) {
      Linking.openURL(notification?.data?.link as string);
    }
  }

  static handleNotification(message: FirebaseMessagingTypes.RemoteMessage) {
    if (!(message.notification?.body || message.notification?.title)) {
      return;
    }

    Crashlytics.log('[NOTIFICATION] ', `${JSON.stringify(message)}`);

    notifee.displayNotification({
      body: message.notification?.body,
      title: message.notification?.title,
      data: {
        link: message?.fcmOptions?.link || '',
      },
      ios: {
        sound: 'default',
      },
      android: {
        channelId: 'all',
        smallIcon: 'ic_stat_name',
        sound: 'default',
      },
    });
  }

  static handleSilentNotification(
    message: FirebaseMessagingTypes.RemoteMessage,
  ) {
    if (!(message.data && message.data?.type)) {
      return;
    }

    Crashlytics.log('[NOTIFICATION-SILENT] ', `${JSON.stringify(message)}`);

    if (message.data.type === SilentPushTypes.START_GEOLOCATION) {
      handleStartLocationPush(
        message.data as unknown as StartLocationPushPayload,
      );
    }

    if (message.data.type === SilentPushTypes.STOP_GEOLOCATION) {
      handleStopLocationPush();
    }

    if (message.data.type === SilentPushTypes.COLLECT_SERVICES_DATA) {
      handleCollectDataPush(message.data as unknown as CollectDataPushPayload);
    }
  }

  static async requestPermission() {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const batteryOptimizationEnabled =
          await notifee.isBatteryOptimizationEnabled();

        const powerManagerInfo = await notifee.getPowerManagerInfo();

        if (!batteryOptimizationEnabled) {
          resolve('granted');
          return;
        }

        const batteryRestrictionPromise = new Promise((_resolve, _reject) => {
          Alert.alert(
            'Работа приложения ограничена',
            'Для работы приложения необходимо отключить оптимизацию энергопотребления.',
            [
              {
                text: 'В настройки',
                onPress: () => {
                  _resolve('');
                  notifee.openBatteryOptimizationSettings();
                },
              },
              {
                text: 'Назад',
                onPress: () => {
                  _reject('');
                  resolve('');
                },
              },
            ],
            { cancelable: false },
          );
        });

        await batteryRestrictionPromise;

        if (!powerManagerInfo.activity) {
          resolve('granted');
          return;
        }

        Alert.alert(
          'Работа приложения ограничена',
          'Для работы приложения необходимо отключение менеджера энергопотребления.',
          [
            {
              text: 'В настройки',
              onPress: () => {
                notifee.openPowerManagerSettings();
                resolve('granted');
              },
            },
            {
              text: 'Назад',
              onPress: () => resolve(''),
            },
          ],
          { cancelable: false },
        );
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  }
}

export default NotificationManager;
