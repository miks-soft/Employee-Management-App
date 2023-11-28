import React, { useState } from 'react';

import { CompositeScreenProps } from '@react-navigation/native';
import { DeepPartial } from '@reduxjs/toolkit';

import { TasksRoutes, TasksScreenProps } from '#navigation/Main/Tasks/types';
import { AppRoutes, AppScreenProps } from '#navigation/types';

import { useGetCurrentUserQuery } from '#api/controllers/Auth';
import { useGetEmployeeProjectsQuery } from '#api/controllers/Employee';
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from '#api/controllers/Tasks';

import ToastManager from '#services/ToastManager';

import { EnumTaskStatus } from '#config/enums';

import useErrorHandler from '#hooks/utils/useErrorHandler';

import { animateDecorator } from '#utils';

import { DTOProject } from '#generated/types';

import Layout from './layout';

type NavigationProps = CompositeScreenProps<
  TasksScreenProps<TasksRoutes.CRUD>,
  AppScreenProps<AppRoutes>
>;

const defaultStartDate = new Date();
defaultStartDate.setHours(10, 0, 0);
const defaultEndDate = new Date();
defaultEndDate.setHours(19, 0, 0);
const Container: React.FC<NavigationProps> = props => {
  const { editableTask } = props.route.params;

  const [selectedProject, setSelectedProject] = useState<
    DeepPartial<DTOProject> | undefined
  >(
    editableTask?.project_id
      ? {
          project_id: editableTask.project_id,
          project_title: editableTask.project_title,
          title: editableTask.project_title,
        }
      : undefined,
  );
  const [taskName, setTaskName] = useState(editableTask?.name || '');
  const [startDate, setStartDate] = useState(
    editableTask?.start_date
      ? new Date(editableTask?.start_date)
      : defaultStartDate,
  );
  const [status, setStatus] = useState(
    editableTask?.status || EnumTaskStatus.UNDONE,
  );
  const [endDate, setEndDate] = useState(
    editableTask?.end_date ? new Date(editableTask?.end_date) : defaultEndDate,
  );

  const currentUserQuery = useGetCurrentUserQuery();
  const employeeProjectsQuery = useGetEmployeeProjectsQuery({
    path: {
      employee: currentUserQuery.data?.id!,
    },
  });

  const [createTask, createTaskMeta] = useCreateTaskMutation();
  const [updateTask, updateTaskMeta] = useUpdateTaskMutation();

  const onUpdate = async () => {
    try {
      await updateTask({
        path: {
          id: editableTask?.id!,
        },
        data: {
          status: status,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          project_id: selectedProject?.project_id,
          name: taskName,
        },
      }).unwrap();

      ToastManager.success('Задача была успешно изменена');

      props.navigation.goBack();
    } catch {}
  };

  const onСreate = async () => {
    try {
      await createTask({
        data: {
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          project_id: selectedProject?.project_id!,
          name: taskName,
        },
      }).unwrap();

      ToastManager.success('Задача была успешно создана');

      props.navigation.goBack();
    } catch {}
  };

  useErrorHandler(() => {}, createTaskMeta);
  useErrorHandler(() => {}, updateTaskMeta);

  return (
    <Layout
      /**
       *Options
       */
      endDate={endDate}
      isCreating={createTaskMeta.isLoading}
      isUpdating={updateTaskMeta.isLoading}
      projects={employeeProjectsQuery.data}
      selectedProject={selectedProject}
      startDate={startDate}
      status={status}
      taskName={taskName}
      /**
       *Methods
       */
      onCreate={animateDecorator(onСreate)}
      onUpdate={animateDecorator(onUpdate)}
      setEndDate={setEndDate}
      setSelectedProject={setSelectedProject}
      setStartDate={setStartDate}
      setStatus={setStatus}
      setTaskName={setTaskName}
      {...props}
    />
  );
};

type PassingStates = {
  startDate: Date;
  endDate: Date;
  selectedProject?: DeepPartial<DTOProject>;
  taskName: string;
  status: EnumTaskStatus;
};

type PassingProps = {
  projects?: DTOProject[];
  isCreating: boolean;
  isUpdating: boolean;

  onCreate: () => void;
  onUpdate: () => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
