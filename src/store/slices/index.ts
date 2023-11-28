import { combineReducers } from '@reduxjs/toolkit';

import { Query } from '#api';

import app from './app';
import chats from './chats';
import foregroundService from './foregroundService';
import location from './location';
import pedometer from './pedometer';
import timer from './timer';
import tracker from './tracker';

export default combineReducers({
  app,
  chats,
  tracker,
  timer,
  location,
  pedometer,
  foregroundService,
  [Query.reducerPath]: Query.reducer,
});
