import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  offset: 0,
  startDate: '',
  pauseOffset: 0,
  pauseStartDate: '',
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    setStartDate(state, action: PayloadAction<string>) {
      state.startDate = action.payload;
    },

    setOffset(state, action: PayloadAction<number>) {
      state.offset = action.payload;
    },

    setPauseStartDate(state, action: PayloadAction<string>) {
      state.pauseStartDate = action.payload;
    },

    setPauseOffset(state, action: PayloadAction<number>) {
      state.pauseOffset = action.payload;
    },
  },
});

export default timerSlice.reducer;
export const TimerActions = timerSlice.actions;
