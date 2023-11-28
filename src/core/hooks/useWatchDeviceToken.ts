import { useEffect } from 'react';

import messaging from '@react-native-firebase/messaging';

import { useUpdateUserMutation } from '#api/controllers/User';

import Crashlytics from '#services/Crashlytics';

import Debug from '#utils/debug';

import { useSelector } from '#store';

export const useWatchDeviceToken = () => {
  const isSignedIn = useSelector(store => store.app.isSignedIn);

  const [updateUser] = useUpdateUserMutation();

  const updateDeviceToken = async () => {
    try {
      await messaging().registerDeviceForRemoteMessages();

      const token = await messaging().getToken();

      updateUser({
        data: {
          device_token: token,
        },
      }).unwrap();
    } catch (e) {
      Crashlytics.log('[ERROR] device token update error', JSON.stringify(e));
      Debug.notification(`Ошибка обновления токена устройства ${e}`);
    }
  };

  useEffect(() => {
    isSignedIn && updateDeviceToken();
  }, [isSignedIn]);
};

export default useWatchDeviceToken;
