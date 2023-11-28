import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  android: {
    pendingSteps: 0,
    currentSteps: 0,
    isActive: false,
  },
};

const pedometerSlice = createSlice({
  name: 'pedometer',
  initialState,
  reducers: {
    setPendingSteps(state, action: PayloadAction<number>) {
      state.android.pendingSteps = action.payload;
    },

    setCurrentSteps(state, action: PayloadAction<number>) {
      state.android.currentSteps = action.payload;
    },

    setIsActive(state, action: PayloadAction<boolean>) {
      state.android.isActive = action.payload;
    },
  },
});

export default pedometerSlice.reducer;
export const PedometerActions = pedometerSlice.actions;
