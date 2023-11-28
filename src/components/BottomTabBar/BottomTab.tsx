import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

// eslint-disable-next-line no-restricted-imports
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { Text, Icon, H5 } from '#ui-kit';
import { IconNames } from '#ui-kit/Icon';

import { colors, withCustomAnimation } from '#styles';

export type Tab = {
  iconName: IconNames;
  onPress: () => void;
  label: string;
  screenName: string;
  amount?: number;
};

type IBottomTab = Tab & {
  isFocus: boolean;
};

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const BottomTab: React.FC<Partial<IBottomTab>> = ({
  label = '',
  iconName,
  isFocus = false,
  onPress = () => {},
  amount = 0,
}) => {
  const animationProgress = useSharedValue(0);

  useEffect(() => {
    animationProgress.value = withCustomAnimation(isFocus ? 1 : 0);
  }, [isFocus]);

  const rBorderStyle = useAnimatedStyle(() => ({
    borderTopColor: interpolateColor(
      animationProgress.value,
      [0, 1],
      [colors.main.light, colors.main.normal],
    ),
  }));

  return (
    <AnimatedTouchableOpacity
      style={[styles.container, rBorderStyle]}
      onPress={onPress}
    >
      <View style={styles.iconWrapper}>
        {!!amount && (
          <View style={styles.indicator}>
            <H5
              color={colors.grayscale.__100}
              size={11}
            >
              {amount > 9 ? '9+' : amount}
            </H5>
          </View>
        )}
        <Icon
          color={isFocus ? colors.main.normal : colors.grayscale.__10}
          name={iconName}
        />
      </View>
      <Text
        color={isFocus ? colors.main.normal : colors.grayscale.__10}
        lineHeight={12}
        size={10}
        style={styles.label}
      >
        {label}
      </Text>
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    height: 16,
    width: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 2,
    top: -4,
    right: -6,
    borderRadius: 8,
    backgroundColor: colors.main.normal,
  },
  label: {
    marginTop: 4,
  },
});

export default BottomTab;
