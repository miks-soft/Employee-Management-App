import * as React from 'react';
import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import { Toast } from 'react-hot-toast';
import { useToaster } from 'react-hot-toast/src/core/use-toaster';
// eslint-disable-next-line no-restricted-imports
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { Text } from '#ui-kit';

import { colors, withCustomAnimation } from '#styles';

const ToastItem = ({
  t,
  updateHeight,
  offset,
}: {
  t: Toast;
  updateHeight: (height: number) => void;
  offset: number;
}) => {
  const fadeAnim = useSharedValue(0.5);
  const posAnim = useSharedValue(100);

  useEffect(() => {
    fadeAnim.value = withCustomAnimation(t.visible ? 1 : 0);
  }, [t.visible]);

  useEffect(() => {
    posAnim.value = withCustomAnimation(-offset);
  }, [offset, t.visible]);

  const rStyle = useAnimatedStyle(() => ({
    zIndex: +t.visible * 100,
    opacity: fadeAnim.value,
    transform: [
      {
        translateY: posAnim.value,
      },
    ],
  }));

  return (
    <Animated.View style={[styles.toastWrapper, rStyle]}>
      <View
        key={t.id}
        style={styles.toast}
        onLayout={event => updateHeight(event.nativeEvent.layout.height)}
      >
        {typeof t.message === 'string' && (
          <Text style={styles.toastText}>{t.message}</Text>
        )}
      </View>
    </Animated.View>
  );
};

const ToastProvider = () => {
  const { toasts, handlers } = useToaster();
  return (
    <View
      pointerEvents="none"
      style={styles.provider}
    >
      {toasts.map(t => (
        <ToastItem
          key={t.id}
          offset={handlers.calculateOffset(t, {
            reverseOrder: false,
          })}
          t={t}
          updateHeight={(height: number) => handlers.updateHeight(t.id, height)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  provider: {
    position: 'absolute',
    right: 0,
    bottom: 100,
    left: 0,
  },
  toastWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
  },
  toast: {
    flexDirection: 'row',
    flexShrink: 1,
    alignItems: 'center',
    marginHorizontal: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: colors.grayscale.__0,
  },
  toastText: {
    color: colors.grayscale.__80,
    textAlign: 'center',
  },
});

export default ToastProvider;
