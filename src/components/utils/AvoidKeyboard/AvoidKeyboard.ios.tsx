import React from 'react';

import { useKeyboardHandler } from 'react-native-keyboard-controller';
// eslint-disable-next-line no-restricted-imports
import Animated, {
  interpolate,
  useAnimatedKeyboard,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { withCustomAnimation } from '#styles';

import { IAvoidKeyboard } from './types';

const AvoidKeyboard: React.FC<Partial<IAvoidKeyboard>> = ({
  children,
  style,
  offset = 0,
  mode = 'translate',
}) => {
  const height = useSharedValue(0);
  const progress = useSharedValue(0);
  const keyboard = useAnimatedKeyboard();

  useKeyboardHandler(
    {
      onStart: e => {
        'worklet';
        const willKeyboardAppear = e.progress === 1;
        progress.value = withCustomAnimation(+willKeyboardAppear);
      },
      onMove: e => {
        'worklet';
        const isOpening = keyboard.state.value === 1;

        if (isOpening) {
          height.value = e.height;
          progress.value = e.progress;
        }
      },
      onEnd: e => {
        'worklet';
        progress.value = e.progress;
        height.value = e.height;
      },
    },
    [],
  );

  const rStyle = useAnimatedStyle(() => {
    const interpolatedValue = interpolate(
      progress.value,
      [0, 1],
      [0, height.value - offset],
    );

    switch (mode) {
      case 'translate':
        return {
          transform: [
            {
              translateY: -interpolatedValue,
            },
          ],
        };
      case 'padding':
        return {
          paddingBottom: interpolatedValue,
        };
    }
  });

  return <Animated.View style={[rStyle, style]}>{children}</Animated.View>;
};
export default AvoidKeyboard;
