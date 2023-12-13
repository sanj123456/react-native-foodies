import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  multiLoader: 0,
  isLoading: false,
};

const {actions, reducer} = createSlice({
  name: 'app_loader',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
      state.multiLoader++;
    },
    stopLoading(state) {
      if (--state.multiLoader <= 0) {
        state.isLoading = false;
      }
    },
  },
});

export const {startLoading, stopLoading} = actions;
export default reducer;
