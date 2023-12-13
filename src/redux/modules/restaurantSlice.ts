import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {RestaurantInDetail} from '../../api/types';
export interface State {
  restaurant: RestaurantInDetail;
  isFavorite: boolean;
}
const initialState: State = {
  restaurant: {
    _id: '',
    userId: {
      _id: '',
    },
    partner: {
      _id: '',
      partner: {
        _id: '',
        url: '',
        name: '',
        privacy: '',
        terms: '',
      },
    },
    url: '',
    name: '',
    email: '',
    phone: '',
    logo: '',
    payment: '',
    privacy: '',
    terms: '',
    orderingApp: false,
    homeLink: '',
    ordering: {
      orderNow: false,
      orderLater: false,
      orderForLaterDays: 0,
      orderFutureTimeSameDay: false,
      orderFutureTimeDifferentDay: false,
      nextActiveDate: null,
      allowTip: false,
      disableAmex: false,
      pickupPrepTime: 0,
      pickupTitle: '',
      deliveryTitle: '',
      orderForLaterBtnText: '',
      notePlaceholderText: '',
      peakHours: 0,
      maxOrdersPerHour: 0,
      shopCloseTitle: '',
      shopCloseText: '',
      ageVerificationWarningMsg: '',
      hideSpecialInstruction: false,
      instructionText: '',
      hideExtraButtons: false,
      backgroundColor: '',
      allowLoyalityTransaction: false,
      socialLogin: false,
      _id: '',
    },
    loyalty: {
      minSubtotal: 0,
      minRedeemableAmount: 0,
      pointsPerDollar: 0,
      visitThreshold: 0,
      rewardPoints: 0,
    },
    ihdFees: '',
  },
  isFavorite: false,
};
export const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    setRestaurant: (state, action: PayloadAction<Partial<State>>) => {
      state.restaurant = initialState.restaurant;
      state.restaurant = {
        ...state.restaurant,
        ...action.payload.restaurant,
      };
    },
    setFavorite: (state, action: PayloadAction<boolean>) => {
      state.isFavorite = action.payload;
    },
  },
});
export const {setRestaurant, setFavorite} = restaurantSlice.actions;
export default restaurantSlice.reducer;
