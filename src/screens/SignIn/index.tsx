import React, { useState } from 'react';
import { Keyboard } from 'react-native';

import * as Keychain from 'react-native-keychain';

import { AppScreenProps, AppRoutes } from '#navigation/types';

import { Query } from '#api';
import { useLoginMutation } from '#api/controllers/Auth';

import useErrorHandler from '#hooks/utils/useErrorHandler';
import useFormInputState, {
  FormInputState,
} from '#hooks/utils/useFormInputState';

import { isHaveErrors } from '#utils';

import { useDispatch, useSelector } from '#store';
import { AppActions } from '#store/slices/app';

import Layout from './layout';

type NavigationProps = AppScreenProps<AppRoutes.SignIn>;

const Container: React.FC<NavigationProps> = props => {
  const dispatch = useDispatch();

  const isFirstAppSignIn = useSelector(store => store.app.isFirstAppSignIn);

  const [isPasswordMasked, setIsPasswordMasked] = useState(true);
  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(!isFirstAppSignIn);

  const passwordInputState = useFormInputState('');
  const emailInputState = useFormInputState('');

  const [login, loginMeta] = useLoginMutation();

  const validateEmail = (email = emailInputState.value) => {
    const isError = !email;
    emailInputState.setError(isError ? 'Пожалуйста, введите логин' : '');
    return isError;
  };

  const validatePassword = (password = passwordInputState.value) => {
    const isError = !password;
    passwordInputState.setError(isError ? 'Пожалуйста, введите пароль' : '');
    return isError;
  };

  const onLogin = async () => {
    Keyboard.dismiss();

    if (isHaveErrors([validateEmail(), validatePassword()])) {
      return;
    }

    try {
      const response = await login({
        data: {
          email: emailInputState.value!,
          password: passwordInputState.value!,
        },
      }).unwrap();

      if (!response?.token) {
        return;
      }

      await Keychain.setGenericPassword(
        emailInputState.value!,
        response?.token,
      );

      dispatch(AppActions.setToken(response.token));
      dispatch(Query.util.resetApiState());
      dispatch(AppActions.setSignedIn(true));
      dispatch(AppActions.setIsFirstAppSignIn(false));
    } catch {}
  };

  useErrorHandler(errors => {
    passwordInputState.setError(errors.password);
    emailInputState.setError(errors.email);
  }, loginMeta);

  return (
    <Layout
      /**
       *Options
       */
      emailInputState={emailInputState}
      isFirstAppSignIn={isFirstAppSignIn}
      isLoading={loginMeta.isLoading}
      isPasswordMasked={isPasswordMasked}
      isPrivacyAgreed={isPrivacyAgreed}
      passwordInputState={passwordInputState}
      /**
       *Methods
       */
      onLogin={onLogin}
      setIsPasswordMasked={setIsPasswordMasked}
      setIsPrivacyAgreed={setIsPrivacyAgreed}
      validateEmail={validateEmail}
      validatePassword={validatePassword}
      {...props}
    />
  );
};

type PassingStates = {
  isPasswordMasked: boolean;
  isPrivacyAgreed: boolean;
};

type PassingProps = {
  passwordInputState: FormInputState;
  emailInputState: FormInputState;

  validateEmail: (value?: string) => {};
  validatePassword: (value?: string) => {};
  onLogin: () => void;
  isLoading: boolean;
  isFirstAppSignIn: boolean;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
