import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import AuthAPI from '#api/controllers/Auth';

const initialState = {
  permissionsRequested: false,
  isFirstAppSignIn: true,
  isSignedIn: false,
  tokenBackgoundWorkaround: '',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSignedIn(state, action: PayloadAction<boolean>) {
      state.isSignedIn = action.payload;
    },
    setToken(state, action: PayloadAction<string>) {
      state.tokenBackgoundWorkaround = action.payload;
    },
    setPermissionsRequested(state, action: PayloadAction<boolean>) {
      state.permissionsRequested = action.payload;
    },
    setIsFirstAppSignIn(state, action: PayloadAction<boolean>) {
      state.isFirstAppSignIn = action.payload;
    },
  },

  extraReducers: builder => {
    builder.addMatcher(AuthAPI.endpoints.logout.matchFulfilled, state => {
      state.isSignedIn = false;
    });
  },
});

export default appSlice.reducer;
export const AppActions = appSlice.actions;
