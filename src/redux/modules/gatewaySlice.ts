import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {ResponseGetGateway} from '../../api/types';

const initialState: ResponseGetGateway = {
  _id: '',
  name: '',
  gateway: '',
  subMerchantId: '',
  enableEnhancedSecurity: false,
  tilledPublishableKey: '',
  tilledAccountId: '',
};

export const gatewaySlice = createSlice({
  name: 'gateway',
  initialState,
  reducers: {
    setGateway: (state: ResponseGetGateway, action: PayloadAction<ResponseGetGateway>) => {
      state._id = action.payload._id;
      state.name = action.payload.name;
      state.gateway = action.payload.gateway;
      state.subMerchantId = action.payload.subMerchantId;
      state.enableEnhancedSecurity = action.payload.enableEnhancedSecurity;
      state.tilledPublishableKey = action.payload.tilledPublishableKey;
      state.tilledAccountId = action.payload.tilledAccountId;
    },
    resetGateway: (state) => {
      state._id = initialState._id;
      state.name = initialState.name;
      state.gateway = initialState.gateway;
      state.subMerchantId = initialState.subMerchantId;
      state.enableEnhancedSecurity = initialState.enableEnhancedSecurity;
      state.tilledPublishableKey = initialState.tilledPublishableKey;
      state.tilledAccountId = initialState.tilledAccountId;
    },
  },
});

// Action creators are generated for each case reducer function
export const {resetGateway, setGateway} = gatewaySlice.actions;
export const selectUser = (state: ResponseGetGateway) => state;

export default gatewaySlice.reducer;
