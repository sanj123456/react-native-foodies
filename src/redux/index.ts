import {configureStore} from '@reduxjs/toolkit';
import profileSlice, {setInitUser} from './modules/profileSlice';
import bagReducer, {updateQty} from './modules/bagSlice';
import LoaderReducer from './modules/loading-slice';
import gatewayReducer from './modules/gatewaySlice';
import navigationReducer from './modules/navigationSlice';
import restaurantReducer from './modules/restaurantSlice';
import partnerReducer from './modules/partnerSlice';
import {useAppSelector} from './hooks';
import {prettyPrint} from '../utils/functions';

// const preloadedState = {
//   itemBag: {
//     items: [
//       {
//         description: 'Tuna.',
//         id: '63ca72c401e9e7c3172e3100',
//         name: 'TUNA',
//         price: 3000,
//         quantity: 2,
//         specialInstructionsText: '',
//         toppings: [
//           {
//             id: '63be47c63566a28bbf12e65b',
//             name: 'south indian test',
//             product_name: 'EXTRA CHUTNEY 22',
//             price: 0,
//             type: 'checkbox',
//             selectedSubModifier: {
//               value: '',
//               label: '',
//             },
//             quantity: 1,
//           },
//         ],
//       },
//     ],
//     restaurantId: '63bbf32d4363e42292c7e87f',
//     locationId: '63ca265cefbf76cf1e22ce88',
//     locationAddress: 'Ankur crossroad,Vijaynagar, Ahmedabad',
//     method: 'pickup',
//     deliveryAddress: '',
//   },
//   Loader: {
//     multiLoader: 0,
//     isLoading: false,
//   },
//   gateway: {
//     _id: '63bc07554363e42292c7fd18',
//     name: 'jupiter',
//     gateway: 'jupiter',
//     subMerchantId: '87476777505',
//     enableEnhancedSecurity: false,
//     tilledPublishableKey: 'pk_u18OFRnYyCXIDXo7tU8O6z0ASwDt3MKfjJZj0p09EEvy3gu41LNZvDzZMge5XvCnRbr0kezCHaY8ZUDoGcFx7lkAVdeEhD2KNgkb',
//   },
//   navigation: {
//     isComingFrom: 'OrderCheckout',
//   },
// };

const store = configureStore({
  reducer: {
    profile: profileSlice,
    itemBag: bagReducer,
    Loader: LoaderReducer,
    gateway: gatewayReducer,
    navigation: navigationReducer,
    restaurant: restaurantReducer,
    partner: partnerReducer,
  },
});
const dispatch = store.dispatch;
const getStore = store.getState;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// store.subscribe(() => {
//   prettyPrint(store.getState().partner);
// });

export {dispatch, getStore, useAppSelector, updateQty, setInitUser};
export default store;
