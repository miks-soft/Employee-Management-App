import React, { ReactNode } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native';

import { colors } from '#styles';

export interface ILineWrapper {
  onPress?: () => void;
  children: ReactNode;
  haveBottomBorder: boolean;
  haveTopBorder: boolean;
  containerStyle: StyleProp<ViewStyle>;
  style: StyleProp<ViewStyle>;
}

const LineWrapper: React.FC<Partial<ILineWrapper>> = ({
  onPress = null,
  children,
  haveBottomBorder = true,
  haveTopBorder = false,
  style,
  containerStyle,
}) => {
  const styles = getStyles({
    haveBottomBorder,
    haveTopBorder,
  });

  return (
    <View style={[styles.borderedWrapper, StyleSheet.flatten(containerStyle)]}>
      <TouchableOpacity
        disabled={!onPress}
        style={[styles.option, StyleSheet.flatten(style)]}
        //@ts-expect-error
        onPress={onPress}
      >
        {children}
      </TouchableOpacity>
    </View>
  );
};

const getStyles = ({
  haveBottomBorder,
  haveTopBorder,
}: Pick<ILineWrapper, 'haveBottomBorder' | 'haveTopBorder'>) =>
  StyleSheet.create({
    option: {
      width: '100%',
      maxWidth: '100%',
      flexDirection: 'row',
      paddingVertical: 12,
      paddingHorizontal: 20,
    },
    borderedWrapper: {
      borderColor: colors.grayscale.__60,
      borderTopWidth: haveTopBorder ? 1 : 0,
      backgroundColor: colors.grayscale.__100,
      borderBottomWidth: haveBottomBorder ? 1 : 0,
    },
  });

export default LineWrapper;
