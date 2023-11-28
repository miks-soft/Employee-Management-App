/**
 * @format
 */

import {
  AppRegistry,
  Platform,
  StatusBar,
  UIManager,
  ScrollView,
  FlatList,
} from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import 'moment/locale/ru';
import moment from 'moment';

import BackgroundWorker from './src/core/services/Tracker/BackgroundWorkers';
import messaging from '@react-native-firebase/messaging';
import NotificationManager from '#services/NotificationManager';

moment.locale('ru');

BackgroundWorker.register();
NotificationManager.registerBackgroundListener();

messaging().registerDeviceForRemoteMessages();
messaging().onMessage(data => {
  NotificationManager.handleNotification(data);
  NotificationManager.handleSilentNotification(data);
});

messaging().setBackgroundMessageHandler(data => {
  NotificationManager.handleSilentNotification(data);
});

StatusBar.setBarStyle('dark-content');
if (Platform.OS === 'android') {
  StatusBar.setBackgroundColor('transparent');
  StatusBar.setTranslucent(true);

  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

ScrollView.defaultProps = {
  ...(ScrollView.defaultProps || {}),
  showsHorizontalScrollIndicator: false,
  showsVerticalScrollIndicator: false,
};

FlatList.defaultProps = {
  ...(FlatList.defaultProps || {}),
  showsHorizontalScrollIndicator: false,
  showsVerticalScrollIndicator: false,
};

AppRegistry.registerComponent(appName, () => App);
