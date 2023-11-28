import React from 'react';

import RootStack from '#navigation';

import useAndroidNoJSBundleWorkaround from '#hooks/useAndroidNoJSBundleWorkaround';
import useAppLifecycle from '#hooks/useAppLifecycle';
import useForegroundService from '#hooks/useForegroundService';
import useListenShake from '#hooks/useListenShake';
import { useSocketIO } from '#hooks/useSocketIO';
import useWatchDeviceToken from '#hooks/useWatchDeviceToken';
import useWatchUIBarsColors from '#hooks/useWatchUIBarsColors';

const AppMiddleware = () => {
  useAndroidNoJSBundleWorkaround();

  useAppLifecycle();

  useSocketIO();

  useWatchDeviceToken();

  useWatchUIBarsColors();

  useListenShake();

  useForegroundService();

  return <RootStack />;
};

export default AppMiddleware;
