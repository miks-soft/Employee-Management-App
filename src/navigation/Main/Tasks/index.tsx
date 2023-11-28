import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import { TaskCalendar, TaskCRUD } from '#screens';

import { DEFAULT_STACK_OPTIONS } from '#navigation/config';

import { TasksParamList, TasksRoutes } from './types';

const Tasks = createStackNavigator<TasksParamList>();

const StackTasks = () => {
  return (
    <Tasks.Navigator
      initialRouteName={TasksRoutes.Calendar}
      screenOptions={DEFAULT_STACK_OPTIONS}
    >
      <Tasks.Screen
        component={TaskCalendar}
        name={TasksRoutes.Calendar}
      />
      <Tasks.Screen
        component={TaskCRUD}
        name={TasksRoutes.CRUD}
      />
    </Tasks.Navigator>
  );
};

export default StackTasks;
