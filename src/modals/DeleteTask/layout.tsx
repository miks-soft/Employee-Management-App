import React from 'react';
import { StyleSheet } from 'react-native';

import { LineButton, Text } from '#ui-kit';
import { H2 } from '#ui-kit/Text';

import { ModalWrapper } from '#components';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  return (
    <ModalWrapper
      visible={props.modal.visible}
      setVisible={props.modal.setVisible}
    >
      <H2 style={styles.title}>Подтвердите действие</H2>

      <Text style={styles.text}>
        Задача "{props.route.params.task.name}" будет удалена
      </Text>

      <LineButton
        haveTopBorder
        isLoading={props.isLoading}
        type="accept"
        onPress={props.onDelete}
      >
        Удалить задачу
      </LineButton>

      <LineButton
        type="reject"
        onPress={props.navigation.goBack}
      >
        отмена
      </LineButton>
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
