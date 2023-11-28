import React, { ReactNode } from 'react';
import { Text, TextStyle, StyleSheet, StyleProp } from 'react-native';

import { colors } from '#styles';

export interface IText {
  weight: keyof typeof fontNameMap;
  italic: boolean;
  size: number;
  lineHeight: number;
  numberOfLines: number;
  color: string;
  selectable: boolean;
  underlined: boolean;
  textAlign: TextStyle['textAlign'];
  onPress: () => void;
  children: text | ReactNode;
  style: StyleProp<TextStyle>;
}

const _Text: React.FC<Partial<IText>> = ({
  size = 14,
  weight = '400',
  color = colors.grayscale.__0,
  italic = false,
  lineHeight = size + 6,
  numberOfLines = undefined,
  textAlign = 'auto',
  children,
  selectable = false,
  underlined = false,
  onPress = undefined,
  style = {},
}) => {
  const styles = getStyles({
    size,
    weight,
    color,
    lineHeight,
    textAlign,
    italic,
    underlined,
  });

  return (
    <Text
      numberOfLines={numberOfLines}
      selectable={selectable}
      style={[styles.text, StyleSheet.flatten(style)]}
      onPress={onPress}
    >
      {children}
    </Text>
  );
};

const fontNameMap = {
  '800': {
    regualar: 'OpenSans-ExtraBold',
    italic: 'OpenSans-ExtraBoldItalic',
  },
  '700': {
    regualar: 'OpenSans-Bold',
    italic: 'OpenSans-BoldItalic',
  },
  '600': {
    regualar: 'OpenSans-SemiBold',
    italic: 'OpenSans-SemiBoldItalic',
  },
  '500': {
    regualar: 'OpenSans-Medium',
    italic: 'OpenSans-MediumItalic',
  },
  '400': {
    regualar: 'OpenSans-Regular',
    italic: 'OpenSans-Italic',
  },
  '300': {
    regualar: 'OpenSans-Light',
    italic: 'OpenSans-LightItalic',
  },
};

const getStyles = ({
  size,
  weight,
  color,
  lineHeight,
  textAlign,
  italic,
  underlined,
}: Pick<
  IText,
  | 'size'
  | 'weight'
  | 'color'
  | 'lineHeight'
  | 'textAlign'
  | 'italic'
  | 'underlined'
>) =>
  StyleSheet.create({
    text: {
      color,
      fontSize: size,
      textAlign,
      fontFamily: italic
        ? fontNameMap[weight].italic
        : fontNameMap[weight].regualar,
      lineHeight,
      textDecorationLine: underlined ? 'underline' : undefined,
    },
  });

export const H1 = (props: Partial<IText>) => (
  <_Text
    size={24}
    weight="700"
    {...props}
  />
);

export const H2 = (props: Partial<IText>) => (
  <_Text
    size={20}
    weight="700"
    {...props}
  />
);

export const H3 = (props: Partial<IText>) => (
  <_Text
    size={16}
    weight="600"
    {...props}
  />
);

export const H4 = (props: Partial<IText>) => (
  <_Text
    size={14}
    {...props}
  />
);

export const H5 = (props: Partial<IText>) => (
  <_Text
    lineHeight={16}
    size={12}
    {...props}
  />
);

export default React.memo(_Text);
