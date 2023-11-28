import { Alert, Linking } from 'react-native';

import * as Geolocation from 'expo-location';
import { LocationAccuracy } from 'expo-location';
import { isPointWithinRadius } from 'geolib';

import Crashlytics from '#services/Crashlytics';
import ToastManager from '#services/ToastManager';

import { BackgroundTasks } from '#config';

import Debug from '#utils/debug';

import { store } from '#store';
import { LocationActions } from '#store/slices/location';

class LocationWatcher {
  static async start(restart = false) {
    const tracker = store.getState().tracker;
    const isActive = store.getState().location.isActive!;

    if (!tracker.project) {
      return;
    }

    if (!restart ? isActive : false) {
      return;
    }

    if (restart) {
      try {
        await Geolocation.stopGeofencingAsync(BackgroundTasks.GEOFENCING);
      } catch {}
    }

    store.dispatch(LocationActions.setRegion(undefined));
    store.dispatch(LocationActions.setIsActive(true));

    try {
      Crashlytics.log('[LOCATION] start', `${restart}`);
      return Geolocation.startGeofencingAsync(BackgroundTasks.GEOFENCING, [
        {
          latitude: +tracker?.project!.lat,
          longitude: +tracker?.project!.lng,
          radius: +tracker?.project!.radius,
        },
      ]);
    } catch {}
  }

  static done() {
    store.dispatch(LocationActions.setIsActive(false));
    return Geolocation.stopGeofencingAsync(BackgroundTasks.GEOFENCING);
  }

  static end() {
    this.done();
  }

  static pause() {}

  static async requestPermissions() {
    const { status: foregroundStatus } =
      await Geolocation.requestForegroundPermissionsAsync();
    if (foregroundStatus === 'granted') {
      const { status: backgroundStatus } =
        await Geolocation.requestBackgroundPermissionsAsync();
      return backgroundStatus;
    }
  }

  static async requestPermissionWithFallbackAlert() {
    try {
      const status = await this.requestPermissions();

      if (status !== 'granted') {
        Alert.alert(
          'Внимание',
          'Для работы приложения необходимы разрешения на постоянное отслеживание геопозиции. Изменить их в настройках?',
          [
            {
              text: 'В настройки',
              onPress: () => Linking.openSettings(),
            },
            {
              text: 'Назад',
              onPress: () => {},
            },
          ],
        );
      }
      return status;
    } catch (e) {
      ToastManager.error('Произошла неожиданная ошибка');
    }
  }

  static async init() {
    const isActive = await Geolocation.hasStartedGeofencingAsync(
      BackgroundTasks.GEOFENCING,
    );

    Debug.notification(`Отслеживание геолокации активно ${isActive}`);

    store.dispatch(LocationActions.setIsActive(isActive));

    if (store.getState().location.shouldPersist && !isActive) {
      this.start();
    }
  }

  static async checkIsUserInProjectZone() {
    const project = store.getState().tracker.project;

    const currentPosition = await Geolocation.getCurrentPositionAsync({
      accuracy: LocationAccuracy.BestForNavigation,
      mayShowUserSettingsDialog: true,
    });

    return isPointWithinRadius(
      { longitude: project?.lng!, latitude: project?.lat! },
      {
        longitude: currentPosition.coords.longitude,
        latitude: currentPosition.coords.latitude,
      },
      project?.radius!,
    );
  }
}

export default LocationWatcher;
