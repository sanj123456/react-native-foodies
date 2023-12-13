import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {Partner} from '../../api/types';
import {prettyPrint} from '../../utils/functions';

const initialState: Partner = {
  partner: {
    _id: '',
    email: '',
    status: '',
    role: '',
    partner: {
      _id: '',
      userId: '',
      name: '',
      phone: '',
      headerLogo: '',
    },
  },
};

export const partnerSlice = createSlice({
  name: 'partner',
  initialState,
  reducers: {
    setInit: (state, action) => {
      state.partner = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setInit} = partnerSlice.actions;
export const selectPartner = (state: Partner) => state;

export default partnerSlice.reducer;
