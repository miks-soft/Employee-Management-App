import { Platform } from 'react-native';

import PedometerAndroid from './Pedometer.android';
import PedometerIOS from './Pedometer.ios';

export default Platform.select({
  ios: PedometerIOS,
  android: PedometerAndroid,
}) as typeof PedometerAndroid;
