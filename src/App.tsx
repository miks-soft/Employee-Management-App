import React from 'react';
import { StyleSheet } from 'react-native';
import { Provider } from 'react-redux';

import { DefaultTheme, NavigationContainer } from '@react-navigation/native';

// eslint-disable-next-line no-restricted-imports
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableFreeze } from 'react-native-screens';

import { PersistGate } from 'redux-persist/integration/react';

import { ToastProvider } from '#components';

import { linking } from '#navigation/linking';

import { persistor, store } from '#store';

import AppMiddleware from './AppMiddleware';

enableFreeze(true);

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
      >
        <KeyboardProvider navigationBarTranslucent={true}>
          <NavigationContainer
            linking={linking}
            theme={{
              ...DefaultTheme,
              colors: {
                ...DefaultTheme.colors,
                background: 'transparent',
              },
            }}
          >
            <GestureHandlerRootView style={styles.container}>
              <SafeAreaProvider>
                <AppMiddleware />
                <ToastProvider />
              </SafeAreaProvider>
            </GestureHandlerRootView>
          </NavigationContainer>
        </KeyboardProvider>
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
