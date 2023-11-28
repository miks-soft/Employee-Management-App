import { useEffect } from 'react';
import { Alert } from 'react-native';

import Clipboard from '@react-native-clipboard/clipboard';
import crashlytics from '@react-native-firebase/crashlytics';

import * as Keychain from 'react-native-keychain';
import RNShake from 'react-native-shake';

import { __DEVELOPER__ } from '#config';

import { useSelector } from '#store';

const useListenShake = () => {
  const isSignedIn = useSelector(store => store.app.isSignedIn);

  const copyToken = async () => {
    const credentials = await Keychain.getGenericPassword();

    if (credentials && credentials.password) {
      Clipboard.setString(credentials?.password);
    }
  };

  useEffect(() => {
    __DEVELOPER__ &&
      RNShake.addListener(() => {
        Alert.alert('Отрпавить информацию посредством симуляции краша?', '', [
          {
            text: 'да',
            onPress: () => crashlytics().crash(),
          },
          {
            text: 'Назад',
            onPress: () => {},
          },
        ]);

        copyToken();
      });

    return RNShake.removeAllListeners;
  }, [isSignedIn]);
};

export default useListenShake;
