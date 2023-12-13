import {PayloadAction, createSlice} from '@reduxjs/toolkit';

export interface Customer {
  _id: string; // data.user._id
  userId: string; // data.user.customer
  email: string; // data.user.email
  role: 'customer'; // data.user.role
  status: string; // data.user.status

  address: string[]; //data._doc.address
  customerGroup: string; //data._doc.customerGroup
  name: string; //data._doc.name
  restaurants: string[]; // data._doc.restaurants
  paymentMethods: string[]; // data._doc.paymentMethods
  loyaltyPoints: number; // data._doc.loyaltyPoints

  smsForCouponAndInfo: boolean;
  emailForCouponAndInfo: boolean;
  phone: number | string;
  birthday: string;
  anniversary: string;
}

export interface IUserMainTypeState {
  user: {
    _id: string; // _id
    email: string; // data.user.email
    password: string; // data.user.password
    status: string; // data.user.status
    role: 'customer'; // data.user.role

    permissions: string[]; // data.user.permissions
    authProvider: string; // data.user.authProvider
    restaurant: string;
    customer: Customer;
  };
  accessToken: string;
  restaurantUrl: string;
}

const initU: IUserMainTypeState['user'] = {
  _id: '',
  email: '',
  password: '',
  status: '',
  role: 'customer',
  permissions: [],
  authProvider: '',
  restaurant: '',
  customer: {
    _id: '',
    userId: '',
    name: '',
    role: 'customer',
    email: '',
    phone: '',
    birthday: '',
    anniversary: '',
    address: [],
    customerGroup: '',
    status: '',
    restaurants: [],
    paymentMethods: [],
    loyaltyPoints: 0,
    smsForCouponAndInfo: false,
    emailForCouponAndInfo: false,
  },
};

const initialState: IUserMainTypeState = {
  user: initU,
  accessToken: '',
  restaurantUrl: '',
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setInitUser: (state, action: PayloadAction<IUserMainTypeState>) => {
      state.user = {
        ...action.payload.user,
        customer: {
          ...state.user?.customer,
          ...action.payload?.user.customer,
        },
      };
      state.accessToken = action?.payload?.accessToken ?? '';
    },
    signOut: (state) => {
      state.user = initialState.user;
      state.accessToken = initialState.accessToken;
    },
    setRestaurantUrl: (state, action: PayloadAction<string>) => {
      state.restaurantUrl = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setInitUser, signOut, setRestaurantUrl} = profileSlice.actions;
export const selectUser = (state: IUserMainTypeState) => state;

export default profileSlice.reducer;
