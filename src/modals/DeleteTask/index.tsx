import React from 'react';

import { CompositeScreenProps } from '@react-navigation/native';

import { MainRoutes } from '#navigation/Main/types';
import { ModalsRoutes, ModalsScreenProps } from '#navigation/Modals/types';
import { AppRoutes, AppScreenProps } from '#navigation/types';

import { useDeleteTaskMutation } from '#api/controllers/Tasks';

import ToastManager from '#services/ToastManager';

import useErrorHandler from '#hooks/utils/useErrorHandler';
import useModal, { ModalController } from '#hooks/utils/useModal';

import Layout from './layout';

type NavigationProps = CompositeScreenProps<
  ModalsScreenProps<ModalsRoutes.DeleteTask>,
  AppScreenProps<AppRoutes>
>;

const Container: React.FC<NavigationProps> = props => {
  const modal = useModal(true);

  const [deleteTask, deleteTaskMeta] = useDeleteTaskMutation();

  const onDelete = async () => {
    try {
      await deleteTask({
        path: {
          id: props.route.params.task?.id!,
        },
      }).unwrap();

      ToastManager.success('Задача была успешно удалена');

      modal.closeWithoutGoBack();
      props.navigation.replace(AppRoutes.StackMain, {
        screen: MainRoutes.Tasks,
      });
    } catch {}
  };

  useErrorHandler(() => {}, deleteTaskMeta);

  return (
    <Layout
      /**
       *Options
       */
      isLoading={deleteTaskMeta.isLoading}
      modal={modal}
      /**
       *Methods
       */
      onDelete={onDelete}
      {...props}
    />
  );
};

type PassingStates = {};

type PassingProps = {
  modal: ModalController;
  isLoading: boolean;
  onDelete: () => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
