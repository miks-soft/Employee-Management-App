import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  isActive: false,
  forceStopped: false,
};

const foregroundserviceSlice = createSlice({
  name: 'foregroundService',
  initialState,
  reducers: {
    setActive(state, action: PayloadAction<boolean>) {
      state.isActive = action.payload;
    },

    setForceStopped(state, action: PayloadAction<boolean>) {
      state.forceStopped = action.payload;
    },

    reset() {
      return initialState;
    },
  },
});

export default foregroundserviceSlice.reducer;
export const ForegroundServiceActions = foregroundserviceSlice.actions;
