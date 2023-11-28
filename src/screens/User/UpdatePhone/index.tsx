import React from 'react';

import { UserRoutes, UserScreenProps } from '#navigation/Main/User/types';

import { useUpdateUserMutation } from '#api/controllers/User';

import ToastManager from '#services/ToastManager';

import useErrorHandler from '#hooks/utils/useErrorHandler';
import useFormInputState, {
  FormInputState,
} from '#hooks/utils/useFormInputState';

import Layout from './layout';

type NavigationProps = UserScreenProps<UserRoutes.UpdatePhone>;

const Container: React.FC<NavigationProps> = props => {
  const phoneInputState = useFormInputState(props.route.params.defaultPhone);

  const [updateUser, updateUserMeta] = useUpdateUserMutation();

  const onUpdateUser = async () => {
    try {
      await updateUser({
        data: {
          phone: phoneInputState.value,
        },
      }).unwrap();

      ToastManager.success('Телефон успешно изменен!');

      props.navigation.goBack();
    } catch {}
  };

  useErrorHandler(errors => {
    phoneInputState.setError(errors.phone);
  }, updateUserMeta);

  return (
    <Layout
      /**
       *Options
       */
      isLoading={updateUserMeta.isLoading}
      phoneInputState={phoneInputState}
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
  phoneInputState: FormInputState;

  isLoading: boolean;
  onUpdateUser: () => {};
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
