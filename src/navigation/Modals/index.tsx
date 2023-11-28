import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import {
  Actions,
  DateTimePicker,
  DeleteTask,
  Dialog,
  Logout,
  Select,
  UpdateAvatar,
} from '#modals';

import { ModalsParamList, ModalsRoutes } from './types';

const Modals = createStackNavigator<ModalsParamList>();

const StackModals = () => {
  return (
    <Modals.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
      }}
    >
      <Modals.Screen
        component={Logout}
        name={ModalsRoutes.Logout}
      />
      <Modals.Screen
        component={DateTimePicker}
        name={ModalsRoutes.DateTimePicker}
      />
      <Modals.Screen
        component={Select}
        name={ModalsRoutes.Select}
      />
      <Modals.Screen
        component={UpdateAvatar}
        name={ModalsRoutes.UpdateAvatar}
      />
      <Modals.Screen
        component={Dialog}
        name={ModalsRoutes.Dialog}
      />
      <Modals.Screen
        component={DeleteTask}
        name={ModalsRoutes.DeleteTask}
      />
      <Modals.Screen
        component={Actions}
        name={ModalsRoutes.Actions}
      />
    </Modals.Navigator>
  );
};

export default StackModals;
