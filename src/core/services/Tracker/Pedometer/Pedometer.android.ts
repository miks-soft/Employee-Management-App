import {
  Alert,
  Linking,
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
} from 'react-native';

import { axiosBaseQuery } from '#api';

import Debug from '#utils/debug';

import { store } from '#store';
import { PedometerActions } from '#store/slices/pedometer';

const { SimplePedometer } = NativeModules;

const convertCurrentStepsToPendingSteps = () => {
  const { pendingSteps, currentSteps } = store.getState().pedometer.android;

  store.dispatch(PedometerActions.setCurrentSteps(0));
  store.dispatch(PedometerActions.setPendingSteps(pendingSteps + currentSteps));
};
class Pedometer {
  static start() {
    store.dispatch(PedometerActions.setCurrentSteps(0));
    store.dispatch(PedometerActions.setIsActive(true));

    const emitter = new NativeEventEmitter(SimplePedometer);

    emitter.addListener('onStepReceive', data => {
      const { pendingSteps } = store.getState().pedometer.android;
      store.dispatch(PedometerActions.setCurrentSteps(data.steps));

      Debug.notification(
        `Шаги, сессия: ${data.steps}, ожидающих отправления: ${pendingSteps}`,
        'steps',
      );
    });

    SimplePedometer.start();
  }

  static done() {
    store.dispatch(PedometerActions.setIsActive(false));

    const emitter = new NativeEventEmitter(SimplePedometer);

    emitter.removeAllListeners('onStepReceive');
    convertCurrentStepsToPendingSteps();
    SimplePedometer.stop();
  }

  static end() {
    this.done();
  }

  static pause() {
    this.done();
  }

  static async collect(
    fromDateISO: string | number,
    toDateISO: string | number,
  ) {
    convertCurrentStepsToPendingSteps();

    const { pendingSteps, isActive } = store.getState().pedometer.android;

    //workaroudn for be
    const { project } = store.getState().tracker;

    if (isActive) {
      this.done();
      this.start();
    }

    store.dispatch(PedometerActions.setPendingSteps(0));

    if (!pendingSteps) {
      return;
    }

    axiosBaseQuery({
      url: '/steps',
      method: 'post',
      data: {
        data: [
          {
            date_from: new Date(fromDateISO).toISOString().split('.')[0],
            date_to: new Date(toDateISO).toISOString().split('.')[0],
            count: pendingSteps,
            //workaround for be
            vacancy_id: project?.id,
            latitude: project?.lat,
            longitude: project?.lng,
          },
        ],
      },
    });
  }

  static async requestPermissionsWithFallbackAlert() {
    const permission = await this.requestPermissions();

    if (permission !== 'granted') {
      Alert.alert(
        'Внимание',
        'Для работы корректной работы приложения необходимо разрешение на считывание физической активности.',
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

    return permission;
  }

  static async requestPermissions() {
    const permissions = await PermissionsAndroid.request(
      'android.permission.ACTIVITY_RECOGNITION',
    );

    return permissions === 'granted' ? 'granted' : undefined;
  }
}

export default Pedometer;
