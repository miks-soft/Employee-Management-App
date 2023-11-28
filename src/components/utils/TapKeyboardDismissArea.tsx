import React from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';

const TapKeyboardDissmissArea = () => (
  <View
    style={StyleSheet.absoluteFill}
    onTouchStart={Keyboard.dismiss}
  />
);

export default TapKeyboardDissmissArea;
