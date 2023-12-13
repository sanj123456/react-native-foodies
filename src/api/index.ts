import {API_Auth} from './Auth';
import API_Cards from './Cards';
import {API_Ordering} from './Ordering';
import * as StatusCodes from './StatusCodes';
import AxiosInstance from './interceptor';
import {AuthUrls} from './url';
export type {
  IRestaurant,
  ICategory,
  Availability,
  BaseRestaurantCatAndMenu,
  CategoryAvailability,
  IMenuItem,
  Modifiers,
  ParamLogin,
  ParamResetPassword,
  ParamRestaurantMenu,
  ParamSignUp,
  ParamUpdateFCMToken,
  ParamUpdateProfile,
  ParamVerifyOTP,
  ResponseType,
  SelectedParentValue,
  SearchRestaurantType,
  SubModifier,
  SubProduct,
  UserActivationType,
  ParamFindallLocation,
  LoyaltyPointRule,
} from './types';

export {AuthUrls, API_Auth, API_Ordering, AxiosInstance, StatusCodes, API_Cards};
