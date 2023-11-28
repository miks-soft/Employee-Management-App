import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import { ObjectRead, ObjectsList, ObjectTrackedTime } from '#screens';

import { DEFAULT_STACK_OPTIONS } from '#navigation/config';

import { ObjectParamList, ObjectRoutes } from './types';

const _Object = createStackNavigator<ObjectParamList>();

const StackObject = () => {
  return (
    <_Object.Navigator
      initialRouteName={ObjectRoutes.List}
      screenOptions={DEFAULT_STACK_OPTIONS}
    >
      <_Object.Screen
        component={ObjectsList}
        name={ObjectRoutes.List}
      />
      <_Object.Screen
        component={ObjectRead}
        name={ObjectRoutes.Read}
      />
      <_Object.Screen
        component={ObjectTrackedTime}
        name={ObjectRoutes.TrackedTime}
      />
    </_Object.Navigator>
  );
};

export default StackObject;
