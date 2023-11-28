import { Dimensions, Platform, StyleSheet } from 'react-native';

// eslint-disable-next-line no-restricted-imports
import { withSpring } from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

const colors = {
  main: {
    dark: '#0D0C56',
    mediumDark: '#103887',
    normal: '#1199F0',
    mediumLight: '#63BCF5',
    light: '#DAEBFB',
  },
  success: '#68DA88',
  error: '#DD4A64',
  grayscale: {
    __0: '#31333B',
    __10: '#676973',
    __20: '#9599A9',
    __40: '#BBBCC3',
    __60: '#E5E5EA',
    __80: '#F7F8FA',
    __100: '#FEFEFE',
  },
  transparent: '#00000000',
};

const IS_IOS = Platform.OS === 'ios';

const hitSlop = {
  bottom: 16,
  left: 16,
  right: 16,
  top: 16,
};

const shadow = StyleSheet.create({
  style: {
    elevation: 3,
    shadowColor: colors.grayscale.__0,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    shadowRadius: 2.22,
    shadowOpacity: 0.22,
  },
}).style;

const withCustomAnimation = (toValue: number, cb?: () => void) => {
  'worklet';
  return withSpring(
    toValue,
    {
      stiffness: 100,
      mass: 0.1,
    },
    cb,
  );
};

const SAFE_ZONE_BOTTOM = IS_IOS ? 34 : 44;

export {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  colors,
  hitSlop,
  SAFE_ZONE_BOTTOM,
  withCustomAnimation,
  shadow,
  IS_IOS,
};
