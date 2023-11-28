import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import {
  NotificationSettings,
  Profile,
  UpdateEmail,
  UpdateName,
  UpdatePassword,
  UpdatePhone,
  UserStatistics,
} from '#screens';

import { DEFAULT_STACK_OPTIONS } from '#navigation/config';

import { UserParamList, UserRoutes } from './types';

const User = createStackNavigator<UserParamList>();

const StackUser = () => {
  return (
    <User.Navigator
      initialRouteName={UserRoutes.Profile}
      screenOptions={DEFAULT_STACK_OPTIONS}
    >
      <User.Screen
        component={Profile}
        name={UserRoutes.Profile}
      />
      <User.Screen
        component={UpdateEmail}
        name={UserRoutes.UpdateEmail}
      />
      <User.Screen
        component={UpdateName}
        name={UserRoutes.UpdateName}
      />
      <User.Screen
        component={UpdatePhone}
        name={UserRoutes.UpdatePhone}
      />
      <User.Screen
        component={UpdatePassword}
        name={UserRoutes.UpdatePassword}
      />
      <User.Screen
        component={UserStatistics}
        name={UserRoutes.Statistics}
      />
      <User.Screen
        component={NotificationSettings}
        name={UserRoutes.NotificationSettings}
      />
    </User.Navigator>
  );
};

export default StackUser;
