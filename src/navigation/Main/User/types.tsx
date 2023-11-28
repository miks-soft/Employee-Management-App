import { StackScreenProps } from '@react-navigation/stack';

export enum UserRoutes {
  Profile = 'Profile',
  UpdateName = 'UpdateName',
  UpdatePhone = 'UpdatePhone',
  UpdateEmail = 'UpdateEmail',
  UpdatePassword = 'UpdatePassword',
  Statistics = 'Statistics',
  NotificationSettings = 'NotificationSettings',
}

export type UserParamList = {
  [UserRoutes.Profile]: undefined;
  [UserRoutes.UpdateEmail]: {
    defaultEmail: string;
  };
  [UserRoutes.UpdateName]: {
    defaultName: string;
  };
  [UserRoutes.UpdatePhone]: {
    defaultPhone: string;
  };
  [UserRoutes.UpdatePassword]: undefined;
  [UserRoutes.Statistics]: undefined;
  [UserRoutes.NotificationSettings]: undefined;
};

export type UserScreenProps<RouteName extends UserRoutes> = StackScreenProps<
  UserParamList,
  RouteName
>;
