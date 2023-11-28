import React, { ReactNode } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, IconNames, Text, H3, Loader } from '#ui-kit';

import { colors, hitSlop, shadow } from '#styles';

export interface IHeader {
  title: text;
  titleSize: number;
  leftIconName: IconNames;
  isLoading: boolean;
  leftIcon: ReactNode;
  rightIcon: ReactNode;
  hideLeftIcon: boolean;
  leftIconText: text;
  onPressLeft: () => void;
  paddingHorizontal: number;
  containerStyle: StyleProp<ViewStyle>;
}

const Header: React.FC<Partial<IHeader>> = ({
  title = '',
  titleSize = 16,
  leftIconName = 'chevron-left-marginless',
  leftIcon = null,
  rightIcon = null,
  hideLeftIcon = false,
  leftIconText = '',
  onPressLeft = () => {},
  paddingHorizontal = 20,
  isLoading = false,
  containerStyle,
}) => {
  const insets = useSafeAreaInsets();

  const styles = getStyles({
    paddingTop: insets.top,
    paddingHorizontal,
  });

  return (
    <View style={[styles.wrapper, shadow, containerStyle]}>
      <View style={styles.container}>
        <TouchableOpacity
          disabled={false}
          hitSlop={hitSlop}
          style={styles.title}
          onPress={onPressLeft}
        >
          {!hideLeftIcon && (
            <>
              {leftIconText && <Text>{leftIconText}</Text>}
              {leftIcon}
              {!leftIcon && leftIconName !== 'chevron-left-marginless' && (
                <Icon
                  color={colors.main.dark}
                  name={leftIconName}
                  size={24}
                />
              )}
              {!leftIcon && leftIconName === 'chevron-left-marginless' && (
                <Icon
                  color={colors.main.dark}
                  height={12}
                  name={leftIconName}
                  style={styles.chevron}
                  width={6}
                />
              )}
            </>
          )}

          <H3
            color={colors.main.dark}
            size={titleSize}
          >
            {title}
          </H3>
          {isLoading && <Loader />}
        </TouchableOpacity>

        <View style={styles.rightSide}>{rightIcon}</View>
      </View>
    </View>
  );
};

const getStyles = ({
  paddingTop,
  paddingHorizontal,
}: {
  paddingHorizontal: number;
  paddingTop: number;
}) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingHorizontal: paddingHorizontal,
    },
    wrapper: {
      flexDirection: 'column',
      zIndex: 100,
      paddingTop: paddingTop + 8,
      paddingBottom: 12,
      backgroundColor: colors.grayscale.__100,
    },
    title: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    rightSide: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginLeft: 'auto',
    },
    chevron: {
      aspectRatio: 6 / 12,
    },
  });

export default React.memo(Header);
