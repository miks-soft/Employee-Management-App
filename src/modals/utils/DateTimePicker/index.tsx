import React, { useState } from 'react';

import { ModalsRoutes, ModalsScreenProps } from '#navigation/Modals/types';

import useModal, { ModalController } from '#hooks/utils/useModal';

import Layout from './layout';

type NavigationProps = ModalsScreenProps<ModalsRoutes.DateTimePicker>;

const Container: React.FC<NavigationProps> = props => {
  const modal = useModal(true);
  const [date, setDate] = useState(props.route.params.pickerProps.date);

  return (
    <Layout
      /**
       *Options
       */
      date={date}
      modal={modal}
      /**
       *Methods
       */
      setDate={setDate}
      {...props}
    />
  );
};

type PassingStates = {
  date: Date;
};

type PassingProps = {
  modal: ModalController;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
