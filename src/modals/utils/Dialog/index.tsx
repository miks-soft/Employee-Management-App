import React from 'react';

import { ModalsRoutes, ModalsScreenProps } from '#navigation/Modals/types';

import useModal, { ModalController } from '#hooks/utils/useModal';

import Layout from './layout';

type NavigationProps = ModalsScreenProps<ModalsRoutes.Dialog>;

const Container: React.FC<NavigationProps> = props => {
  const modal = useModal(true);

  return (
    <Layout
      /**
       *Options
       */
      modal={modal}
      /**
       *Methods
       */
      {...props}
    />
  );
};

type PassingStates = {};

type PassingProps = {
  modal: ModalController;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
