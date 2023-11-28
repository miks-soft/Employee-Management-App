import React from 'react';
import { StyleSheet } from 'react-native';

import { isArray } from 'lodash';

import { colors } from '#styles';

import Text, { IText } from './Text';

export interface IFieldError {
  children: string;
  shouldRender: boolean;
  style: IText['style'];
}

const FieldError: React.FC<Partial<IFieldError>> = ({
  children = '',
  shouldRender = children,
  style = {},
}) => {
  return shouldRender ? (
    <Text
      color={colors.error}
      style={[styles.errorText, StyleSheet.flatten(style)]}
    >
      {isArray(children) ? children.join('\n') : children}
    </Text>
  ) : null;
};

const styles = StyleSheet.create({
  errorText: {
    alignSelf: 'flex-start',
  },
});

export default React.memo(FieldError);
