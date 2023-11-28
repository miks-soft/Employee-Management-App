import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { FieldError, H3, Header, LineInput, Loader } from '#ui-kit';

import { TapKeyboardDismissArea } from '#components';

import { colors } from '#styles';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  return (
    <View style={styles.container}>
      <TapKeyboardDismissArea />
      <Header
        containerStyle={styles.header}
        rightIcon={
          props.isLoading ? (
            <Loader />
          ) : (
            <TouchableOpacity onPress={props.onSetPassword}>
              <H3 color={colors.main.normal}>Сохранить</H3>
            </TouchableOpacity>
          )
        }
        title="Пароль"
        onPressLeft={() => props.navigation.goBack()}
      />
      <LineInput
        {...props.oldPasswordInputState}
        label="Старый пароль"
        onBlur={() => props.validateOldPassword()}
        onSubmitEditing={() =>
          props.newPasswordInputState.inputRef?.current?.focus()
        }
      />
      <FieldError style={styles.error}>
        {props.oldPasswordInputState.error}
      </FieldError>

      <LineInput
        {...props.newPasswordInputState}
        containerStyle={styles.input}
        label="Новый пароль"
        onBlur={() => {
          props.validateNewPassword();
          props.validateRepeatedNewPassword();
        }}
        onSubmitEditing={() =>
          props.repeatedNewPasswordInputState.inputRef?.current?.focus()
        }
      />
      <FieldError style={styles.error}>
        {props.newPasswordInputState.error}
      </FieldError>

      <LineInput
        {...props.repeatedNewPasswordInputState}
        containerStyle={styles.input}
        label="Повторите пароль"
        onBlur={() => props.validateRepeatedNewPassword()}
        onSubmitEditing={props.onSetPassword}
      />
      <FieldError style={styles.error}>
        {props.repeatedNewPasswordInputState.error}
      </FieldError>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 16,
  },
  input: {
    marginTop: 12,
  },
  error: {
    marginTop: 2,
    paddingHorizontal: 20,
  },
});

export default Layout;
