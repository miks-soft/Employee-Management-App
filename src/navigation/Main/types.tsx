import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

import { ChatsParamList } from './Chats/types';
import { ObjectParamList } from './Objects/types';
import { ScheduleParamList } from './Schedule/types';
import { TasksParamList } from './Tasks/types';
import { UserParamList } from './User/types';

export enum MainRoutes {
  User = 'TabUser',
  Objects = 'TabObjects',
  Schedule = 'TabSchedule',
  Tasks = 'TabTasks',
  Chats = 'TabChats',
}

export type MainParamList = {
  [MainRoutes.User]?: NavigatorScreenParams<UserParamList>;
  [MainRoutes.Objects]?: NavigatorScreenParams<ObjectParamList>;
  [MainRoutes.Schedule]?: NavigatorScreenParams<ScheduleParamList>;
  [MainRoutes.Tasks]?: NavigatorScreenParams<TasksParamList>;
  [MainRoutes.Chats]?: NavigatorScreenParams<ChatsParamList>;
};

export type MainScreenProps<RouteName extends MainRoutes> = StackScreenProps<
  MainParamList,
  RouteName
>;
