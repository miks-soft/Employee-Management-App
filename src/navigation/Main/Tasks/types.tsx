import { StackScreenProps } from '@react-navigation/stack';

import { DTOTask } from '#generated/types';

export enum TasksRoutes {
  Calendar = 'TasksCalendar',
  CRUD = 'TasksCRUD',
}

export type TasksParamList = {
  [TasksRoutes.Calendar]: undefined;
  [TasksRoutes.CRUD]: { editableTask?: DTOTask };
};

export type TasksScreenProps<RouteName extends TasksRoutes> = StackScreenProps<
  TasksParamList,
  RouteName
>;
