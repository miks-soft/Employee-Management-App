/* eslint-disable react-native/no-unused-styles */
import React, { FC, ReactNode } from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';

// eslint-disable-next-line no-restricted-imports
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';

import { colors, shadow } from '#styles';

import Text from './Text';

export interface IButton {
  type: 'primary' | 'secondary';
  size: 'default' | 'small' | 'extra-small';
  fullwidth: boolean;
  isLoading: boolean;
  disabled: boolean;
  withAnimation: boolean;
  onPress: () => void;
  onLongPress: () => void;
  children: text | ReactNode;
  style: StyleProp<ViewStyle>;
  contentContainerStyle: StyleProp<ViewStyle>;
}

const Button: FC<Partial<IButton>> = ({
  children = 'Button',
  type = 'primary',
  size = 'default',
  fullwidth = true,
  isLoading = false,
  disabled = false,
  style = {},
  withAnimation = true,
  contentContainerStyle = {},
  onPress = () => {},
  onLongPress = () => {},
}) => {
  const styles = getStyles({ size, fullwidth, disabled });

  const content =
    typeof children === 'string' ? (
      <Text
        color={styles[type].color}
        weight={styles[type].weight}
      >
        {children}
      </Text>
    ) : (
      children
    );

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      disabled={disabled || isLoading}
      style={[
        styles.container,
        styles[type],
        shadow,
        StyleSheet.flatten(style),
      ]}
      onLongPress={onLongPress}
      onPress={onPress}
    >
      <Animated.View
        key={`${isLoading}`}
        entering={withAnimation ? FadeInUp : undefined}
        exiting={withAnimation ? FadeOutDown : undefined}
        style={[
          styles.contentContainer,
          StyleSheet.flatten(contentContainerStyle),
        ]}
      >
        {isLoading ? (
          <ActivityIndicator
            color={styles[type].color}
            style={styles.activityIndicator}
          />
        ) : (
          content
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const minHeightMap = {
  'extra-small': 32,
  small: 36,
  default: 42,
};

const paddingMap = {
  'extra-small': 4,
  small: 8,
  default: 12,
};

const getStyles = ({
  size,
  fullwidth,
  disabled,
}: Pick<IButton, 'size' | 'fullwidth' | 'disabled'>) =>
  StyleSheet.create({
    flex: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      width: fullwidth ? '100%' : 'auto',
      minHeight: minHeightMap[size],
      justifyContent: 'center',
      alignItems: 'center',
      padding: paddingMap[size],
      paddingHorizontal: 0,
      borderWidth: 1,
      borderRadius: 6,
    },
    contentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    activityIndicator: {
      minHeight: 20,
    },
    primary: {
      color: !disabled ? colors.grayscale.__100 : colors.grayscale.__0,
      weight: '700' as const,
      opacity: !disabled ? 1 : 0.6,
      borderColor: !disabled ? colors.main.normal : colors.main.light,
      backgroundColor: !disabled ? colors.main.normal : colors.main.light,
    },
    secondary: {
      color: !disabled ? colors.main.normal : colors.main.light,
      weight: '400' as const,
      opacity: !disabled ? 1 : 0.6,
      borderColor: !disabled ? colors.main.normal : colors.main.light,
      backgroundColor: colors.grayscale.__100,
    },
  });

export default React.memo(Button);
