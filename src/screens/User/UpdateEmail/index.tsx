import React from 'react';

import { UserRoutes, UserScreenProps } from '#navigation/Main/User/types';

import { useUpdateUserMutation } from '#api/controllers/User';

import ToastManager from '#services/ToastManager';

import useErrorHandler from '#hooks/utils/useErrorHandler';
import useFormInputState, {
  FormInputState,
} from '#hooks/utils/useFormInputState';

import Layout from './layout';

type NavigationProps = UserScreenProps<UserRoutes.UpdateEmail>;

const Container: React.FC<NavigationProps> = props => {
  const emailInputState = useFormInputState(props.route.params.defaultEmail);

  const [updateUser, updateUserMeta] = useUpdateUserMutation();

  const onUpdateUser = async () => {
    try {
      await updateUser({
        data: {
          email: emailInputState.value,
        },
      }).unwrap();

      ToastManager.success('Почта успешно изменена!');

      props.navigation.goBack();
    } catch {}
  };

  useErrorHandler(errors => {
    emailInputState.setError(errors.email);
  }, updateUserMeta);

  return (
    <Layout
      /**
       *Options
       */
      emailInputState={emailInputState}
      isLoading={updateUserMeta.isLoading}
      /**
       *Methods
       */
      onUpdateUser={onUpdateUser}
      {...props}
    />
  );
};

type PassingStates = {};

type PassingProps = {
  emailInputState: FormInputState;

  isLoading: boolean;
  onUpdateUser: () => {};
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
