import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import { ChatsList, ChatsSearch } from '#screens';

import { DEFAULT_STACK_OPTIONS } from '#navigation/config';

import { ChatsParamList, ChatsRoutes } from './types';

const Chats = createStackNavigator<ChatsParamList>();

const StackChats = () => {
  return (
    <Chats.Navigator
      initialRouteName={ChatsRoutes.List}
      screenOptions={DEFAULT_STACK_OPTIONS}
    >
      <Chats.Screen
        component={ChatsList}
        name={ChatsRoutes.List}
      />
      <Chats.Screen
        component={ChatsSearch}
        name={ChatsRoutes.Search}
      />
    </Chats.Navigator>
  );
};

export default StackChats;
