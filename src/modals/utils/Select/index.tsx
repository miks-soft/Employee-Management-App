import React, { useState } from 'react';

import { CompositeScreenProps } from '@react-navigation/native';

import { ModalsRoutes, ModalsScreenProps } from '#navigation/Modals/types';
import { AppRoutes, AppScreenProps } from '#navigation/types';

import useModal, { ModalController } from '#hooks/utils/useModal';

import Layout from './layout';

type NavigationProps = CompositeScreenProps<
  ModalsScreenProps<ModalsRoutes.Select>,
  AppScreenProps<AppRoutes>
>;

const Container: React.FC<NavigationProps> = props => {
  const modal = useModal(true);

  const [selectedItem, setSelectedItem] = useState<any>(
    props.route.params.defaultValue,
  );

  return (
    <Layout
      /**
       *Options
       */
      modal={modal}
      selectedItem={selectedItem}
      /**
       *Methods
       */
      setSelectedItem={setSelectedItem}
      {...props}
    />
  );
};

type PassingStates = {
  selectedItem: any;
};

type PassingProps = {
  modal: ModalController;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
