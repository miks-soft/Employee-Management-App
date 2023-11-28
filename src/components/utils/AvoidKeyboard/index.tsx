import { Platform } from 'react-native';

import AvoidKeyboardAndroid from './AvoidKeyboard.android';
import AvoidKeyboardIOS from './AvoidKeyboard.ios';

export default Platform.select({
  ios: AvoidKeyboardIOS,
  android: AvoidKeyboardAndroid,
}) as typeof AvoidKeyboardIOS;
