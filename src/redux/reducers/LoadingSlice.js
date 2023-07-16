import { createSlice } from '@reduxjs/toolkit';

export const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    isLoading: false,
  },
  reducers: {
    changeLoading: (state, payload) => {
      state.isLoading = payload.payload
    },
  },
});

export const { changeLoading } = loadingSlice.actions

export default loadingSlice.reducer