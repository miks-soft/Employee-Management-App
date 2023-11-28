import crashlytics from '@react-native-firebase/crashlytics';

import * as Device from 'expo-device';

import { store } from '#store';

import { DTOUser } from '#generated/types';

class Crashlytics {
  static async init() {
    const isSignedIn = store.getState().app.isSignedIn;

    this.log(
      'App inited',
      `Logged: ${isSignedIn}`,
      `Location: ${store.getState().location.isActive}`,
      `Location Should Persist: ${store.getState().location.shouldPersist}`,
      `Foreground Service: ${store.getState().foregroundService.isActive}`,
      `Tracker: ${store.getState().tracker.status}, ${
        store.getState().tracker.statusChangeTime
      }`,
    );

    this.addContext({ isSignedIn });

    this.addContext({
      device: Device.modelName,
      deviceOS: Device.osName,
      deviceOSVersion: Device.osVersion,
    });
  }

  static trackLogIn(user: DTOUser) {
    this.log('Login');
    crashlytics().setUserId(user.id!);
    this.addContext({ user, isSignedIn: true });
  }

  static trackLogOut() {
    this.log('Logout');
    crashlytics().setUserId('');
    this.addContext({ user: '', isSignedIn: false });
  }

  static log(...message: string[]) {
    crashlytics().log(message.join(' '));
  }

  static addContext(context: { [key in string]: any }) {
    Object.entries(context).map(([key, value]) => {
      crashlytics().setAttribute(key, JSON.stringify(value));
    });
  }
}

export default Crashlytics;
