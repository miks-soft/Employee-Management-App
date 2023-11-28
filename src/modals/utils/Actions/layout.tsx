import React from 'react';
import { View, StyleSheet } from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';

import { LineButton } from '#ui-kit';
import Text, { H2 } from '#ui-kit/Text';

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

      {!!props.buttons.length &&
        props.buttons.map((el, index) => (
          <View
            key={index}
            style={styles.buttonContainer}
          >
            <LineButton
              {...el}
              onPress={() => {
                el.onPress &&
                  el.onPress(
                    props.navigation as unknown as StackNavigationProp<AppParamList>,
                    props.modal,
                  );
              }}
            />
          </View>
        ))}
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 12,
  },
  buttonContainer: {
    marginBottom: 12,
  },
  text: {
    marginBottom: 12,
  },
});

export default Layout;
