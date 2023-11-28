import React from 'react';
import { Keyboard } from 'react-native';

import { UserRoutes, UserScreenProps } from '#navigation/Main/User/types';

import {
  useGetCurrentUserQuery,
  useSetNewPasswordMutation,
} from '#api/controllers/Auth';

import ToastManager from '#services/ToastManager';

import useErrorHandler from '#hooks/utils/useErrorHandler';
import useFormInputState, {
  FormInputState,
} from '#hooks/utils/useFormInputState';

import { isHaveErrors } from '#utils';

import Layout from './layout';

type NavigationProps = UserScreenProps<UserRoutes.UpdatePassword>;

const Container: React.FC<NavigationProps> = props => {
  const oldPasswordInputState = useFormInputState('');
  const newPasswordInputState = useFormInputState('');
  const repeatedNewPasswordInputState = useFormInputState('');

  const currentUserQuery = useGetCurrentUserQuery();
  const [setNewPassword, setNewPasswordMeta] = useSetNewPasswordMutation();

  const validateOldPassword = (oldPassword = oldPasswordInputState.value) => {
    const isError = !!oldPassword?.length && oldPassword.length < 6;
    oldPasswordInputState.setError(
      isError ? 'Пароль должен быть длиннее 6 символов' : '',
    );
    return isError;
  };

  const validateNewPassword = (newPassword = newPasswordInputState.value) => {
    const isError = !!newPassword?.length && newPassword.length < 6;
    newPasswordInputState.setError(
      isError ? 'Пароль должен быть длиннее 6 символов' : '',
    );
    return isError;
  };

  const validateRepeatedNewPassword = (
    newPassword = newPasswordInputState.value,
    repeatedNewPassword = repeatedNewPasswordInputState.value,
  ) => {
    const isError =
      !!repeatedNewPassword && newPassword !== repeatedNewPassword;
    repeatedNewPasswordInputState.setError(
      isError ? 'Пароли должны совпадать' : '',
    );
    return isError;
  };

  const onSetPassword = async () => {
    Keyboard.dismiss();

    if (
      isHaveErrors([
        validateOldPassword(),
        validateNewPassword(),
        validateRepeatedNewPassword(),
      ])
    ) {
      return;
    }

    try {
      await setNewPassword({
        data: {
          old_password: oldPasswordInputState.value!,
          password: newPasswordInputState.value!,
          password_confirmation: repeatedNewPasswordInputState.value!,
          email: currentUserQuery.data?.email,
        },
      }).unwrap();

      ToastManager.success('Пароль успешно изменен!');

      props.navigation.goBack();
    } catch {}
  };

  useErrorHandler(errors => {
    oldPasswordInputState.setError(errors.old_password);
    newPasswordInputState.setError(errors.password);
    repeatedNewPasswordInputState.setError(errors.password_confirmation);
  }, setNewPasswordMeta);

  return (
    <Layout
      /**
       *Options
       */
      isLoading={setNewPasswordMeta.isLoading}
      newPasswordInputState={newPasswordInputState}
      oldPasswordInputState={oldPasswordInputState}
      /**
       *Methods
       */
      repeatedNewPasswordInputState={repeatedNewPasswordInputState}
      onSetPassword={onSetPassword}
      validateNewPassword={validateNewPassword}
      validateOldPassword={validateOldPassword}
      validateRepeatedNewPassword={validateRepeatedNewPassword}
      {...props}
    />
  );
};

type PassingStates = {};

type PassingProps = {
  oldPasswordInputState: FormInputState;
  newPasswordInputState: FormInputState;
  repeatedNewPasswordInputState: FormInputState;

  isLoading: boolean;
  onSetPassword: () => {};
  validateNewPassword: () => void;
  validateRepeatedNewPassword: () => void;
  validateOldPassword: () => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
