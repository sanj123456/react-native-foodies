import {API_KEYS} from '../constants/constants';
import {Method} from './types';

export const partner = API_KEYS.partner;

export const AuthUrls = {
  sign_up: '/partner-app/',
  login: '/partner-app/login',
  reset_password: '/partner-app/reset',
  verify_otp: '/partner-app/verify',
  get_profile: (id: string) => `/partner-app/profile/${id}`,
  get_auth_profile: (id: string) => `/auth/${id}`,
  update_profile: (id: string) => `/partner-app/update/${id}`,
  update_fcm_token: '/partner-app/update-fcm-token',
};

export const OrderUrls = {
  search: (query: string) => `/partner-app/ordering/search?partner=${partner}&_q=${query}`,
  schedule: (params: any) => `/ordering/schedule?${params}`,
  list_restaurants: (params: any) => `/partner-app/ordering/restaurants?${params}`,
  restaurant_categories: (params: any) => `/partner-app/ordering/categories?${params}`,
  restaurant_menu: (params: any) => `/partner-app/ordering/menu?${params}`,
  customer_usuals: (params: any) => `/partner-app/ordering/usuals?${params}`,
  popular_of_restaurant: (params: any) => `/partner-app/ordering/popular?${params}`,
  find_one_item: (id: string) => `/partner-app/ordering/item/${id}`,
  find_one_restaurant: (id: string) => `/partner-app/ordering/restaurant/${id}`,
  find_all_location: (params: any) => `/partner-app/ordering/locations?${params}`,
  order_history: (params: any) => `/partner-app/ordering/order/history?${params}`,
  check_delivery_availability: `/partner-app/ordering/check-delivery`,
  billing: `/partner-app/ordering/billing`,
  Get_User_Profiledata: (id: string) => `/partner-app/profile/${id}`,
  updateUserProfile: (id: string) => `/partner-app/update/${id}`,
  couponValidationCheck: '/partner-app/ordering/coupon',
  create_a_order: `/partner-app/ordering/order`,
  suggested_items: (params: any) => `/partner-app/ordering/items?${params}`,
  gateway: (locationId: string) => `/partner-app/ordering/gateway/${locationId}`,
  add_fav_restaurant: (restaurantId: string, customerId: string) => `/partner-app/ordering/fav-restaurant?restaurant=${restaurantId}&customer=${customerId}`,
  find_order_details: (id: string) => `/partner-app/ordering/order/${id}`,
  find_all_more_info: (restaurantId: string, locationId: string) => `/partner-app/ordering/more-info?restaurant%5B_id%5D=${restaurantId}&restaurant%5Bstatus%5D=active&location=${locationId}`,
  ordering_nearby: '/partner-app/ordering/nearby',
  ordering_available_dates: (locationId: string, method: Method) => `/partner-app/ordering/available-dates?locationId=${locationId}&method=${method}`,
  ordering_slots: (locationId: string, method: Method, date: string) => `/partner-app/ordering/slots?locationId=${locationId}&method=${method}&date=${date}`,
  createIntentTilled: '/partner-app/ordering/payment/create-intent',
};

export const CardsUrls = {
  find_all_cards_customer: (provider: string = 'jupiter') => `/partner-app/cards?provider=${provider}`,
  add_card: '/partner-app/cards',
};

export const GOOGLE_URLS = {
  AUTO_COMPLETE: 'https://maps.googleapis.com/maps/api/place/autocomplete/json',
};
