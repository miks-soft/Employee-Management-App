import {
  TypedUseSelectorHook,
  useDispatch as _useDispatch,
  useSelector as _useSelector,
} from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';

import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import getStoredState from 'redux-persist/es/getStoredState';

import { Query } from '#api';

import reducers from './slices';

export const persistConfig = {
  key: 'redux-persisted',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    })
      .concat(Query.middleware)
      .concat(
        createLogger({
          collapsed: true,
          predicate: () => process.env.NODE_ENV === 'development',
        }),
      ),
});

export const reloadStore = async () => {
  await persistor.flush();
  await getStoredState(persistConfig);
};

setupListeners(store.dispatch);

export const persistor = persistStore(store);

// persistor.purge();
// import * as Keychain from 'react-native-keychain';
// Keychain.resetGenericPassword();

// store.dispatch(Query.util.resetApiState());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = _useDispatch;
export const useSelector: TypedUseSelectorHook<RootState> = _useSelector;
