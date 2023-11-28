import React from 'react';

import { UserRoutes, UserScreenProps } from '#navigation/Main/User/types';

import { useUpdateUserMutation } from '#api/controllers/User';

import ToastManager from '#services/ToastManager';

import useErrorHandler from '#hooks/utils/useErrorHandler';
import useFormInputState, {
  FormInputState,
} from '#hooks/utils/useFormInputState';

import Layout from './layout';

type NavigationProps = UserScreenProps<UserRoutes.UpdateName>;

const Container: React.FC<NavigationProps> = props => {
  const nameInputState = useFormInputState(props.route.params.defaultName);

  const [updateUser, updateUserMeta] = useUpdateUserMutation();

  const onUpdateUser = async () => {
    try {
      await updateUser({
        data: {
          name: nameInputState.value,
        },
      }).unwrap();

      ToastManager.success('Имя успешно изменено!');

      props.navigation.goBack();
    } catch {}
  };

  useErrorHandler(errors => {
    nameInputState.setError(errors.name);
  }, updateUserMeta);

  return (
    <Layout
      /**
       *Options
       */
      isLoading={updateUserMeta.isLoading}
      nameInputState={nameInputState}
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
  nameInputState: FormInputState;

  isLoading: boolean;
  onUpdateUser: () => {};
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
