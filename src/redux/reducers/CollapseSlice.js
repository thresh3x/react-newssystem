import { createSlice } from '@reduxjs/toolkit';

export const collapseSlice = createSlice({
  name: 'collapsed',
  initialState: {
    isCollapsed: false,
  },
  reducers: {
    changeCollapsed: (state) => {
      state.isCollapsed = !state.isCollapsed
    },
  },
});

export const { changeCollapsed } = collapseSlice.actions

export default collapseSlice.reducer