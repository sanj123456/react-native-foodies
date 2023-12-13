import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {IsCommingfrom} from '../../types/navigationTypes';
export interface IUserMainTypeState {
  isComingFrom: IsCommingfrom;
}
const initialState: IUserMainTypeState = {
  isComingFrom: 'undefined',
};
export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setComingFrom: (state, action: PayloadAction<IUserMainTypeState>) => {
      state.isComingFrom = action.payload.isComingFrom;
    },
  },
});
export const {setComingFrom} = navigationSlice.actions;
export default navigationSlice.reducer;
