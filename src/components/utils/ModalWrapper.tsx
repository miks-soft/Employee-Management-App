import React, { ReactNode } from 'react';
import {
  View,
  ViewStyle,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

// eslint-disable-next-line no-restricted-imports
import { PanGestureHandler } from 'react-native-gesture-handler';
// eslint-disable-next-line no-restricted-imports
import Animated, {
  SlideInDown,
  FadeOut,
  SlideOutDown,
  FadeIn,
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '#ui-kit';

import {
  colors,
  withCustomAnimation,
  IS_IOS,
  SAFE_ZONE_BOTTOM,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  hitSlop,
} from '#styles';

import AvoidKeyboard from './AvoidKeyboard';
import FocusAwareStatusBar from './FocusAwareStatusBar';

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export interface IModalWrapper {
  visible: boolean;
  setVisible: (value: boolean) => void;
  contentContainerStyle: StyleProp<ViewStyle>;
  containerStyle: StyleProp<ViewStyle>;
  children: ReactNode;
  transparent: boolean;
  animatedIn: boolean;
  isSwipeable: boolean;
  style: StyleProp<ViewStyle>;
}

const ModalWrapper: React.FC<Partial<IModalWrapper>> = ({
  visible = false,
  animatedIn = true,
  setVisible = () => {},
  children,
  style = {},
  transparent = false,
  containerStyle = {},
  contentContainerStyle = {},
}) => {
  const insets = useSafeAreaInsets();
  const styles = getStyles(insets.bottom);
  const x = useSharedValue(0);
  const isClosing = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: event => {
      x.value = event.translationY / 1.5;
      if (x.value < 0) {
        x.value = 0;
      }
    },
    onEnd: event => {
      if (event.translationY > 100) {
        isClosing.value = 1;
        x.value = withCustomAnimation(1000);

        runOnJS(setVisible)(false);
        return;
      }
      x.value = withCustomAnimation(0);
    },
  });

  const rTranslation = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: x.value,
      },
    ],
  }));

  return (
    <>
      {visible && (
        <View style={[styles.modal, StyleSheet.flatten(style)]}>
          <PanGestureHandler
            activeOffsetY={[-15, 15]}
            onGestureEvent={gestureHandler}
          >
            <Animated.View style={[styles.modal, rTranslation]}>
              <AnimatedTouchableOpacity
                activeOpacity={1}
                entering={FadeIn}
                exiting={FadeOut}
                style={StyleSheet.absoluteFill}
                onPress={() => setVisible(false)}
              />
              <FocusAwareStatusBar barStyle="light-content" />

              <AvoidKeyboard
                offset={IS_IOS ? SAFE_ZONE_BOTTOM : 0}
                style={styles.avoidKeyboardContainer}
              >
                <Animated.View
                  entering={
                    animatedIn ? SlideInDown.springify().mass(0.5) : undefined
                  }
                  exiting={SlideOutDown.springify().stiffness(0)}
                  style={[styles.content, containerStyle]}
                >
                  {!transparent && (
                    <>
                      <View style={styles.shape} />
                      <TouchableOpacity
                        hitSlop={hitSlop}
                        style={styles.cross}
                        onPress={() => setVisible(false)}
                      >
                        <Icon
                          color={colors.grayscale.__0}
                          name="close"
                          size={20}
                        />
                      </TouchableOpacity>
                    </>
                  )}
                  <View style={[styles.innerContainer, contentContainerStyle]}>
                    {children}
                  </View>
                  <View style={styles.bottomOverlayContainer}>
                    <View style={styles.bottomOverlay} />
                  </View>
                </Animated.View>
              </AvoidKeyboard>
            </Animated.View>
          </PanGestureHandler>
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={[styles.backdrop, StyleSheet.absoluteFill]}
          />
        </View>
      )}
    </>
  );
};

const getStyles = (insetsBottom: number) =>
  StyleSheet.create({
    modal: {
      flex: 1,
      justifyContent: 'flex-end',
      zIndex: 100,
    },
    // eslint-disable-next-line react-native/no-color-literals
    backdrop: {
      zIndex: 0,
      backgroundColor: '#00000099',
    },
    avoidKeyboardContainer: {
      maxHeight: '90%',
      justifyContent: 'flex-end',
    },
    content: {
      maxHeight: '100%',
      paddingBottom: 20,
      backgroundColor: colors.grayscale.__100,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
    },
    innerContainer: {
      maxHeight: '100%',
      paddingTop: 22,
      paddingBottom: IS_IOS ? SAFE_ZONE_BOTTOM : insetsBottom,
      paddingHorizontal: 16,
    },
    bottomOverlayContainer: {
      height: 0,
      position: 'absolute',
      bottom: 0,
    },
    bottomOverlay: {
      height: SCREEN_HEIGHT,
      width: SCREEN_WIDTH,
      top: -1,
      backgroundColor: colors.grayscale.__100,
    },
    shape: {
      height: 1,
      width: 64,
      alignSelf: 'center',
      position: 'absolute',
      marginTop: 8,
      marginBottom: 0,
      borderRadius: 2,
      backgroundColor: colors.grayscale.__0,
    },
    cross: {
      position: 'absolute',
      zIndex: 2,
      top: 24,
      right: 16,
    },
  });

export default React.memo(ModalWrapper);
