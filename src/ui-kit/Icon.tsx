import React from 'react';
import { StyleSheet, StyleProp, ImageStyle } from 'react-native';

import { Image, ImageProps } from 'expo-image';

const iconsFiles = {
  /* PLOP_INJECT_KEY */
  search: require('../assets/icons/search.png'),
  send: require('../assets/icons/send.png'),
  'new-message': require('../assets/icons/new-message.png'),
  'plus-outlined': require('../assets/icons/plus-outlined.png'),
  'alarm-clock': require('../assets/icons/alarm-clock.png'),
  'calendar-event-check': require('../assets/icons/calendar-event-check.png'),
  'calendar-event': require('../assets/icons/calendar-event.png'),
  home: require('../assets/icons/home.png'),
  time: require('../assets/icons/time.png'),
  chat: require('../assets/icons/chat.png'),
  tasks: require('../assets/icons/tasks.png'),
  timer: require('../assets/icons/timer.png'),
  profile: require('../assets/icons/profile.png'),
  objects: require('../assets/icons/objects.png'),
  camera: require('../assets/icons/camera.png'),
  check: require('../assets/icons/check.png'),
  calendar: require('../assets/icons/calendar.png'),
  'chevron-right-marginless': require('../assets/icons/chevron-right-marginless.png'),
  'default-avatar': require('../assets/icons/default-avatar.png'),
  'chevron-left-marginless': require('../assets/icons/chevron-left-marginless.png'),
  'eye-closed': require('../assets/icons/eye-closed.png'),
  eye: require('../assets/icons/eye.png'),
  close: require('../assets/icons/close.png'),
  'arrow-right': require('../assets/icons/arrow-right.png'),
};

export type IconNames = keyof typeof iconsFiles;

interface IIcon {
  size: number;
  width: number;
  height: number;
  color: string;
  style: StyleProp<ImageStyle>;
  contentFit: ImageProps['contentFit'];
  name: IconNames;
}

const Icon: React.FC<Partial<IIcon>> = ({
  size = 24,
  width = size,
  height = size,
  color,
  name = 'close',
  style = {},
  contentFit = 'cover',
}) => {
  const styles = getStyles({
    width,
    height,
    color,
  });

  return (
    <Image
      contentFit={contentFit}
      source={iconsFiles[name]}
      style={[styles.icon, StyleSheet.flatten(style)]}
    />
  );
};

const getStyles = ({
  width,
  height,
  color,
}: Pick<Partial<IIcon>, 'width' | 'height' | 'color'>) =>
  StyleSheet.create({
    icon: {
      height,
      width,
      tintColor: color,
    },
  });

export default React.memo(Icon);
