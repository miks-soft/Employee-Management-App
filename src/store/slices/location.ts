import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { GeofencingRegionState } from 'expo-location';

const initialState = {
  region: undefined as GeofencingRegionState | undefined,
  regionChangeTime: '',
  leaveTimeoutId: 0,
  isActive: false,
  shouldPersist: false,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setRegion(state, action: PayloadAction<GeofencingRegionState | undefined>) {
      state.region = action.payload;
      state.regionChangeTime = new Date().toISOString();
    },

    setLeaveTimeoutId(state, action: PayloadAction<number>) {
      state.leaveTimeoutId = action.payload;
    },

    setIsActive(state, action: PayloadAction<boolean>) {
      state.isActive = action.payload;
    },

    setShouldPersist(state, action: PayloadAction<boolean>) {
      state.shouldPersist = action.payload;
    },
  },
});

export default locationSlice.reducer;
export const LocationActions = locationSlice.actions;
