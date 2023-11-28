import React from 'react';
import { StyleSheet } from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';

import { LineButton, Text } from '#ui-kit';
import { H2 } from '#ui-kit/Text';

import { ModalWrapper } from '#components';

import { AppParamList } from '#navigation/types';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  return (
    <ModalWrapper
      visible={props.modal.visible}
      setVisible={props.modal.setVisible}
    >
      <H2 style={styles.title}>{props.route.params.title}</H2>

      <Text style={styles.text}>{props.route.params.text}</Text>

      <LineButton
        haveTopBorder
        type="accept"
        {...props.route.params.confirmButtonProps}
        onPress={() => {
          props.route.params.confirmButtonProps.onPress &&
            props.route.params.confirmButtonProps.onPress(
              props.navigation as unknown as StackNavigationProp<AppParamList>,
              props.modal,
            );
        }}
      />

      <LineButton
        type="reject"
        {...props.route.params.declineButtonProps}
        onPress={() => {
          props.route.params.declineButtonProps.onPress &&
            props.route.params.declineButtonProps.onPress(
              props.navigation as unknown as StackNavigationProp<AppParamList>,
              props.modal,
            );
        }}
      />
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 12,
  },
  text: {
    marginBottom: 12,
  },
});

export default Layout;
