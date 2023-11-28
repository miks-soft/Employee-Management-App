import React from 'react';
import { Keyboard } from 'react-native';

import { AppScreenProps, AppRoutes } from '#navigation/types';

import { useSendResetPasswordCodeMutation } from '#api/controllers/Auth';

import ToastManager from '#services/ToastManager';

import useErrorHandler from '#hooks/utils/useErrorHandler';
import useFormInputState, {
  FormInputState,
} from '#hooks/utils/useFormInputState';

import { isHaveErrors } from '#utils';

import Layout from './layout';

type NavigationProps = AppScreenProps<AppRoutes.RestorePasswordByEmail>;

const Container: React.FC<NavigationProps> = props => {
  const emailInputState = useFormInputState('');

  const [sendResetPasswordCode, sendResetPasswordCodeMeta] =
    useSendResetPasswordCodeMutation();

  const validateEmail = (email = emailInputState.value) => {
    const isError = !email;
    emailInputState.setError(isError ? 'Пожалуйста, введите логин' : '');
    return isError;
  };

  const onSendResetPasswordCode = async () => {
    Keyboard.dismiss();

    if (isHaveErrors([validateEmail()])) {
      return;
    }

    try {
      await sendResetPasswordCode({
        data: {
          email: emailInputState.value!,
        },
      }).unwrap();

      ToastManager(
        `Запрос на восстановление пароля отправлен на почту ${emailInputState.value}`,
      );

      props.navigation.navigate(AppRoutes.RestorePasswordProcess, {
        email: emailInputState.value!,
      });
    } catch {}
  };

  useErrorHandler(errors => {
    emailInputState.setError(errors.email);
  }, sendResetPasswordCodeMeta);

  return (
    <Layout
      /**
       *Options
       */
      emailInputState={emailInputState}
      isLoading={sendResetPasswordCodeMeta.isLoading}
      /**
       *Methods
       */
      onSendResetPasswordCode={onSendResetPasswordCode}
      validateEmail={validateEmail}
      {...props}
    />
  );
};

type PassingStates = {};

type PassingProps = {
  emailInputState: FormInputState;

  validateEmail: (value?: string) => {};
  onSendResetPasswordCode: () => void;
  isLoading: boolean;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
