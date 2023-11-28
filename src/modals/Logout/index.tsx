import React from 'react';

import { CompositeScreenProps } from '@react-navigation/native';

import { ModalsRoutes, ModalsScreenProps } from '#navigation/Modals/types';
import { AppRoutes, AppScreenProps } from '#navigation/types';

import { useLogoutMutation } from '#api/controllers/Auth';

import LocationWatcher from '#services/LocationWatcher';
import Tracker from '#services/Tracker';

import useErrorHandler from '#hooks/utils/useErrorHandler';
import useModal, { ModalController } from '#hooks/utils/useModal';

import Layout from './layout';

type NavigationProps = CompositeScreenProps<
  ModalsScreenProps<ModalsRoutes.Logout>,
  AppScreenProps<AppRoutes>
>;

const Container: React.FC<NavigationProps> = props => {
  const modal = useModal(true);

  const [logout, logoutMeta] = useLogoutMutation();

  const onLogout = async () => {
    LocationWatcher.end();
    Tracker.end();
    logout();
    modal.close();
  };

  useErrorHandler(() => {}, logoutMeta);

  return (
    <Layout
      /**
       *Options
       */
      isLoading={logoutMeta.isLoading}
      modal={modal}
      /**
       *Methods
       */
      onLogout={onLogout}
      {...props}
    />
  );
};

type PassingStates = {};

type PassingProps = {
  modal: ModalController;
  isLoading: boolean;
  onLogout: () => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
