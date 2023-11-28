import React, { useEffect } from 'react';
import {
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';

// eslint-disable-next-line no-restricted-imports
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { colors, hitSlop, shadow, withCustomAnimation } from '#styles';

export interface ICheckbox {
  onChange?: (invertedValue: boolean) => void;
  value: boolean;
  disabled: boolean;
  containerStyle: StyleProp<ViewStyle>;
}

const TRACK_SIZE = 32;
const THUMB_SIZE = 18;

const Checkbox: React.FC<Partial<ICheckbox>> = ({
  value = false,
  onChange,
  disabled = false,
  containerStyle = {},
}) => {
  const styles = getStyles(disabled);
  const toggleProgress = useSharedValue(0);

  useEffect(() => {
    toggleProgress.value = withCustomAnimation(value ? 1 : 0);
  }, [value]);

  const rIconContainer = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      toggleProgress.value,
      [0, 1],
      [colors.grayscale.__40, colors.main.normal],
    ),
  }));

  const rThumbStyle = useAnimatedStyle(() => ({
    left: interpolate(
      toggleProgress.value,
      [0, 1],
      [0, TRACK_SIZE - THUMB_SIZE],
    ),
  }));

  const rThumbCore = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      toggleProgress.value,
      [0, 1],
      [colors.grayscale.__40, colors.main.normal],
    ),
  }));

  return (
    <TouchableOpacity
      disabled={disabled || !onChange}
      hitSlop={hitSlop}
      style={[styles.box, containerStyle]}
      onPress={() => onChange && onChange(!value)}
    >
      <Animated.View style={[styles.iconContainer, rIconContainer]} />
      <Animated.View style={[styles.thumb, shadow, rThumbStyle]}>
        <Animated.View style={[styles.thumbCore, rThumbCore]} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const getStyles = (disable: boolean) =>
  StyleSheet.create({
    box: {
      justifyContent: 'center',
      alignItems: 'center',
      opacity: disable ? 0.25 : 1,
    },
    thumb: {
      width: 18,
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      left: 0,
      borderRadius: 8,
      backgroundColor: colors.grayscale.__80,
    },
    thumbCore: {
      width: 10,
      aspectRatio: 1,
      borderRadius: 6,
      backgroundColor: colors.grayscale.__60,
    },
    iconContainer: {
      height: 10,
      width: 32,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 6,
      backgroundColor: colors.main.normal,
    },
  });

export default React.memo(Checkbox);
