import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

import { UIChat } from '#store/slices/chats';

import { MainParamList } from './Main/types';
import { ModalsParamList } from './Modals/types';

export enum AppRoutes {
  SignIn = 'SignIn',
  RestorePasswordByEmail = 'RestorePasswordByEmail',
  RestorePasswordProcess = 'RestorePasswordProcess',
  Chat = 'Chat',

  StackModals = 'Modals',
  StackMain = 'StackMain',
}

export type AppParamList = {
  [AppRoutes.SignIn]: undefined;
  [AppRoutes.StackModals]: NavigatorScreenParams<ModalsParamList>;
  [AppRoutes.RestorePasswordByEmail]: undefined;
  [AppRoutes.RestorePasswordProcess]: { email: string };
  [AppRoutes.StackMain]: NavigatorScreenParams<MainParamList>;
  [AppRoutes.Chat]: {
    id: string;
    default: Partial<UIChat> & { recepient: UIChat['recepient'] };
  };
};

export type AppScreenProps<RouteName extends AppRoutes> = StackScreenProps<
  AppParamList,
  RouteName
>;
