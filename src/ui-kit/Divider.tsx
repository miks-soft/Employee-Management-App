import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { colors } from '#styles';

export interface IDivider {
  style: StyleProp<ViewStyle>;
}

const Divider: React.FC<Partial<IDivider>> = ({ style }) => {
  return <View style={[styles.container, StyleSheet.flatten(style)]} />;
};

const styles = StyleSheet.create({
  container: {
    height: 1,
    width: '100%',
    backgroundColor: colors.grayscale.__60,
  },
});

export default Divider;
