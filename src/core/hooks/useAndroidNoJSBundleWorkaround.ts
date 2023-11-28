import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import RNRestart from 'react-native-restart';

import * as Device from 'expo-device';

import { persistor, useSelector } from '#store';
import { ForegroundServiceActions } from '#store/slices/foregroundService';

const useAndroidNoJSBundleWorkaround = () => {
  const foregroundServiceState = useSelector(store => store.foregroundService);
  const dispatch = useDispatch();

  const processForceStop = async () => {
    if (foregroundServiceState.forceStopped) {
      dispatch(ForegroundServiceActions.reset());
      await persistor.flush();
      if (Device.osVersion === '10') {
        RNRestart.restart();
      }
    }
  };

  useEffect(() => {
    processForceStop();
  }, []);
};

export default useAndroidNoJSBundleWorkaround;
