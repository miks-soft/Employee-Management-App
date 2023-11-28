import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native';

import { colors } from '#styles';

import Loader from './Loader';
import { H3 } from './Text';

export interface ILineButton {
  onPress: () => void;
  children: text;
  haveBottomBorder: boolean;
  haveTopBorder: boolean;
  isLoading: boolean;
  containerStyle: StyleProp<ViewStyle>;
  style: StyleProp<ViewStyle>;
  type: 'accept' | 'reject';
}

const typeToColorMap: { [key in ILineButton['type']]: string } = {
  accept: colors.main.normal,
  reject: colors.error,
};

const LineButton: React.FC<Partial<ILineButton>> = ({
  onPress = () => {},
  children,
  haveBottomBorder = true,
  haveTopBorder = false,
  style,
  containerStyle,
  isLoading = false,
  type = 'accept',
}) => {
  const styles = getStyles({
    haveBottomBorder,
    haveTopBorder,
  });

  return (
    <View style={[styles.borderedWrapper, StyleSheet.flatten(containerStyle)]}>
      <TouchableOpacity
        style={[styles.option, StyleSheet.flatten(style)]}
        onPress={onPress}
      >
        {isLoading ? (
          <Loader fullscreen />
        ) : (
          <H3
            color={typeToColorMap[type]}
            weight="600"
          >
            {children}
          </H3>
        )}
      </TouchableOpacity>
    </View>
  );
};

const getStyles = ({
  haveBottomBorder,
  haveTopBorder,
}: Pick<ILineButton, 'haveBottomBorder' | 'haveTopBorder'>) =>
  StyleSheet.create({
    option: {
      width: '100%',
      minHeight: 46,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 20,
      backgroundColor: colors.grayscale.__100,
    },
    borderedWrapper: {
      borderColor: colors.grayscale.__60,
      borderTopWidth: haveTopBorder ? 1 : 0,
      borderBottomWidth: haveBottomBorder ? 1 : 0,
    },
  });

export default LineButton;
