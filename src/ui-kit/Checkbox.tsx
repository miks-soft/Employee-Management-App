import React, { useEffect } from 'react';
import {
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';

// eslint-disable-next-line no-restricted-imports
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { Icon } from '#ui-kit';

import { colors, withCustomAnimation } from '#styles';

export interface ICheckbox {
  onChange?: (invertedValue: boolean) => void;
  value: boolean;
  disabled: boolean;
  containerStyle: StyleProp<ViewStyle>;
  hitSlop: TouchableOpacity['props']['hitSlop'];
}

const Checkbox: React.FC<Partial<ICheckbox>> = ({
  value = false,
  onChange,
  disabled = false,
  containerStyle = {},
  hitSlop = {},
}) => {
  const styles = getStyles(disabled);
  const toggleProgress = useSharedValue(0);

  useEffect(() => {
    toggleProgress.value = withCustomAnimation(value ? 1 : 0);
  }, [value]);

  const rIconContainer = useAnimatedStyle(() => ({
    opacity: toggleProgress.value,
  }));

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || !onChange}
      hitSlop={hitSlop}
      style={[styles.box, containerStyle]}
      onPress={() => onChange && onChange(!value)}
    >
      <Animated.View style={[styles.iconContainer, rIconContainer]}>
        <Icon
          color={colors.grayscale.__100}
          name="check"
          size={20}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};
const getStyles = (disable: boolean) =>
  StyleSheet.create({
    box: {
      width: 20,
      aspectRatio: 1,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: disable ? 0.25 : 1,
      borderWidth: 1,
      borderColor: colors.main.normal,
      borderRadius: 4,
      backgroundColor: colors.grayscale.__100,
    },
    iconContainer: {
      height: '100%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.main.normal,
    },
  });

export default React.memo(Checkbox);
