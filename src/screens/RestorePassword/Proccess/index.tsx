import React, { useState } from 'react';
import { Keyboard } from 'react-native';

import { AppScreenProps, AppRoutes } from '#navigation/types';

import { useResetPasswordMutation } from '#api/controllers/Auth';

import ToastManager from '#services/ToastManager';

import useErrorHandler from '#hooks/utils/useErrorHandler';
import useFormInputState, {
  FormInputState,
} from '#hooks/utils/useFormInputState';

import { isHaveErrors } from '#utils';

import Layout from './layout';

type NavigationProps = AppScreenProps<AppRoutes.RestorePasswordProcess>;

const Container: React.FC<NavigationProps> = props => {
  const codeInputState = useFormInputState('');
  const passwordInputState = useFormInputState('');
  const repeatedPasswordInputState = useFormInputState('');

  const [isPasswordMasked, setIsPasswordMasked] = useState(true);
  const [isRepeastPasswordMasked, setIsRepeatedPasswordMasked] = useState(true);

  const [resetPassword, resetPasswordMeta] = useResetPasswordMutation();

  const validateCode = (code = codeInputState.value) => {
    const isError = !code;
    codeInputState.setError(isError ? 'Пожалуйста, введите код' : '');
    return isError;
  };

  const validatePassword = (password = passwordInputState.value) => {
    const isError = !password;
    passwordInputState.setError(isError ? 'Пожалуйста, введите пароль' : '');
    return isError;
  };

  const validateRepeatedPassword = (
    password = passwordInputState.value,
    repeatedPassword = repeatedPasswordInputState.value,
  ) => {
    const isError = password !== repeatedPassword;
    repeatedPasswordInputState.setError(
      isError ? 'Пароли должны совпадать' : '',
    );
    return isError;
  };

  const onResetPassword = async () => {
    Keyboard.dismiss();

    if (
      isHaveErrors([
        validateCode(),
        validatePassword(),
        validateRepeatedPassword(),
      ])
    ) {
      return;
    }

    try {
      await resetPassword({
        data: {
          email: props.route.params.email,
          password: passwordInputState.value!,
          password_confirmation: repeatedPasswordInputState.value!,
          password_reset_code: codeInputState.value!,
        },
      }).unwrap();

      ToastManager('Пароль был успешно изменен');

      props.navigation.navigate(AppRoutes.SignIn);
    } catch {}
  };

  useErrorHandler(errors => {
    passwordInputState.setError(errors.password);
    codeInputState.setError(errors.password_reset_code);
    repeatedPasswordInputState.setError(errors.password_confirmation);
  }, resetPasswordMeta);

  return (
    <Layout
      /**
       *Options
       */
      codeInputState={codeInputState}
      isLoading={resetPasswordMeta.isLoading}
      isPasswordMasked={isPasswordMasked}
      isRepeatedPasswordMasked={isRepeastPasswordMasked}
      passwordInputState={passwordInputState}
      repeatedPasswordInputState={repeatedPasswordInputState}
      /**
       *Methods
       */
      onResetPassword={onResetPassword}
      setIsPasswordMasked={setIsPasswordMasked}
      setIsRepeatedPasswordMasked={setIsRepeatedPasswordMasked}
      validateCode={validateCode}
      validatePassword={validatePassword}
      validateRepeatedPassword={validateRepeatedPassword}
      {...props}
    />
  );
};

type PassingStates = {
  isPasswordMasked: boolean;
  isRepeatedPasswordMasked: boolean;
};

type PassingProps = {
  repeatedPasswordInputState: FormInputState;
  passwordInputState: FormInputState;
  codeInputState: FormInputState;
  isLoading: boolean;

  validateCode: (value?: string) => {};
  validatePassword: (value?: string) => {};
  validateRepeatedPassword: (value?: string) => {};
  onResetPassword: () => void;
};
export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
