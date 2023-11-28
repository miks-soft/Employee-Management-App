import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { EnumTrackerStatus } from '#config/enums';

import { DTOProjectVacancy } from '#generated/types';

const initialState = {
  project: undefined as DTOProjectVacancy | undefined,
  status: EnumTrackerStatus.READY,
  statusChangeTime: '',
};

const trackerSlice = createSlice({
  name: 'tracker',
  initialState,
  reducers: {
    setProject(state, action: PayloadAction<DTOProjectVacancy | undefined>) {
      state.project = action.payload;
    },

    setTrackerStatus(state, action: PayloadAction<EnumTrackerStatus>) {
      state.status = action.payload;
      state.statusChangeTime = new Date().toISOString();
    },
  },
});

export default trackerSlice.reducer;
export const TrackerActions = trackerSlice.actions;
