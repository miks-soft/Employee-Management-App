import React from 'react';
import { StyleSheet } from 'react-native';

import DatePicker from 'react-native-date-picker';

import { H2, LineButton } from '#ui-kit';

import { ModalWrapper } from '#components';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  return (
    <ModalWrapper
      contentContainerStyle={styles.modal}
      visible={props.modal.visible}
      setVisible={props.modal.setVisible}
    >
      <H2 style={styles.title}>{props.route.params?.title}</H2>

      <DatePicker
        {...props.route.params.pickerProps}
        date={props.date}
        locale="ru"
        textColor="black"
        onDateChange={props.setDate}
      />

      <LineButton
        haveTopBorder
        containerStyle={styles.button}
        onPress={() => {
          props.route.params.onConfirm &&
            props.route.params.onConfirm(props.date);
          props.modal.close();
        }}
      >
        Выбрать
      </LineButton>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    alignSelf: 'flex-start',
  },
  modal: {
    alignItems: 'center',
  },
  button: {
    width: '100%',
  },
});

export default Layout;
