import React, { useEffect } from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import RNBootSplash from 'react-native-bootsplash';

import {
  Chat,
  RestorePasswordByEmail,
  RestorePasswordProcess,
  SignIn,
} from '#screens';

import { delay } from '#utils';

import { useSelector } from '#store';

import { DEFAULT_STACK_OPTIONS } from './config';
import StackMain from './Main';
import StackModals from './Modals';
import { AppParamList, AppRoutes } from './types';

const App = createStackNavigator<AppParamList>();

const AppStack = () => {
  const isSignedIn = useSelector(store => store.app.isSignedIn);

  const hideSplash = async () => {
    await delay(250);
    RNBootSplash.hide({
      duration: 500,
      fade: true,
    });
  };

  useEffect(() => {
    hideSplash();
  }, []);

  return (
    <App.Navigator
      initialRouteName={AppRoutes.SignIn}
      screenOptions={DEFAULT_STACK_OPTIONS}
    >
      {isSignedIn ? (
        <>
          <App.Screen
            component={StackMain}
            name={AppRoutes.StackMain}
            options={{
              animationTypeForReplace: 'pop',
            }}
          />
          <App.Screen
            component={Chat}
            name={AppRoutes.Chat}
          />
        </>
      ) : (
        <>
          <App.Screen
            component={SignIn}
            name={AppRoutes.SignIn}
          />
          <App.Screen
            component={RestorePasswordByEmail}
            name={AppRoutes.RestorePasswordByEmail}
          />
          <App.Screen
            component={RestorePasswordProcess}
            name={AppRoutes.RestorePasswordProcess}
          />
        </>
      )}

      <App.Screen
        component={StackModals}
        name={AppRoutes.StackModals}
        options={{
          headerShown: false,
          detachPreviousScreen: false,
          presentation: 'transparentModal',
          cardStyle: {
            backgroundColor: 'transparent',
          },
          cardStyleInterpolator: () => ({}),
        }}
      />
    </App.Navigator>
  );
};

export default AppStack;
