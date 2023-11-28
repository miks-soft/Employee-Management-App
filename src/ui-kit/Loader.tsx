import React from 'react';
import {
  ActivityIndicator,
  ActivityIndicatorProps,
  StyleSheet,
} from 'react-native';

import { colors, IS_IOS } from '#styles';

const ACTIVITY_INDICATOR_IOS_DEFAULT_COLOR = '#999999';

export interface ILoader extends ActivityIndicatorProps {
  fullscreen: boolean;
  inverted: boolean;
}

const Loader: React.FC<Partial<ILoader>> = props => {
  const { fullscreen = false, inverted = false, style } = props;

  const styles = getStyles({ fullscreen });

  return (
    <ActivityIndicator
      color={
        !inverted
          ? IS_IOS
            ? ACTIVITY_INDICATOR_IOS_DEFAULT_COLOR
            : colors.main.normal
          : colors.grayscale.__100
      }
      {...props}
      style={[styles.container, StyleSheet.flatten(style)]}
    />
  );
};

const getStyles = ({ fullscreen }: Pick<ILoader, 'fullscreen'>) =>
  StyleSheet.create({
    container: {
      flex: fullscreen ? 1 : 0,
      width: fullscreen ? '100%' : 'auto',
    },
  });

export default React.memo(Loader);
