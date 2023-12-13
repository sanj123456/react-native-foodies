import axios from 'axios';
import {CurrentLocationData} from '../core/GlobalLocation';
import {getStore} from '../redux';
import {prettyPrint} from '../utils/functions';

import {makeQueryString} from './api-functions';
import AxiosInstance from './interceptor';
import {
  BaseRestaurantCatAndMenu,
  ICategory,
  IRestaurant,
  ParamRestaurantMenu,
  ResponseType,
  BillingParam,
  CouponParams,
  SuggestedItemsParams,
  CreateOrderParams,
  ResponseTypeCreateOrder,
  OrderHistoryParams,
  RestaurantListParams,
  ScheduleParam,
  ResponseChooseLocation,
  ResponseGetProfile,
  ResponseGetGateway,
  ResponseHomeScreen,
  ResponseBilling,
  RestaurantInDetail,
  Method,
  CreateIntentTilledParams,
  CouponCodeSuccessResponse,
} from './types';
import {OrderUrls, partner} from './url';

class Ordering {
  accessToken: string;
  userId: string;
  headers: {Authorization: string};

  constructor() {
    const {profile} = getStore();
    const {accessToken, user} = profile;
    this.accessToken = accessToken;
    this.userId = user.customer._id;

    this.headers = {
      Authorization: this.accessToken,
    };
  }

  init = () => {
    const {profile} = getStore();
    const {accessToken, user} = profile;
    this.accessToken = accessToken;
    this.userId = user.customer._id;

    this.headers = {
      Authorization: this.accessToken,
    };
  };

  schedule = (param: ScheduleParam): Promise<ResponseType> => {
    return AxiosInstance.get(OrderUrls.schedule(makeQueryString(param)));
  };

  list_top_restaurants = ({limit = 5}: Partial<RestaurantListParams>): Promise<ResponseType> => {
    const params: RestaurantListParams = {
      limit: limit,
      partner: partner,
      type: 'top',
    };

    const sParams = makeQueryString(params);

    return AxiosInstance.get(OrderUrls.list_restaurants(sParams));
  };
  list_fav_restaurants = ({limit = 5}: Partial<RestaurantListParams>): Promise<ResponseType> => {
    try {
      const params: RestaurantListParams = {
        limit: limit,
        partner: partner,
        type: 'fav',
        customer: this.userId,
      };

      const sParams = makeQueryString(params);
      return AxiosInstance.get(OrderUrls.list_restaurants(sParams));
    } catch (error) {
      console.log({error});
    }
  };
  list_all_restaurants = (p?: Partial<RestaurantListParams>): Promise<ResponseType> => {
    const params: RestaurantListParams = {
      partner: partner,
    };

    const sParams = makeQueryString(params);

    return AxiosInstance.get(OrderUrls.list_restaurants(sParams));
  };

  homeScreen = (p?: Partial<RestaurantListParams>): Promise<ResponseType<ResponseHomeScreen>> => {
    const params: RestaurantListParams = {
      partner: partner,
      ...p,
    };

    const sParams = makeQueryString(params);
    return AxiosInstance.get(OrderUrls.list_restaurants(sParams));
  };
  restaurant_categories = async (param: BaseRestaurantCatAndMenu): Promise<ResponseType> => {
    return await AxiosInstance.get(OrderUrls.restaurant_categories(makeQueryString(param)));
  };
  restaurant_menu = (param: ParamRestaurantMenu, controller?: AbortController): Promise<ResponseType> => {
    return AxiosInstance.get(OrderUrls.restaurant_menu(makeQueryString(param)), {
      signal: controller?.signal,
    });
  };
  customer_usuals = (param: {customerId: string; restaurant: string}): Promise<ResponseType> => {
    return AxiosInstance.get(OrderUrls.customer_usuals(makeQueryString(param)));
  };
  popular_of_restaurant = (param: {locationId: string}): Promise<ResponseType> => {
    return AxiosInstance.get(OrderUrls.popular_of_restaurant(makeQueryString(param)));
  };
  find_one_item = (id: string): Promise<ResponseType> => {
    return AxiosInstance.get(OrderUrls.find_one_item(id));
  };

  find_all_location = (param: {restaurant: string}): Promise<ResponseType<ResponseChooseLocation[]>> => {
    return AxiosInstance.get(OrderUrls.find_all_location(makeQueryString(param)));
  };
  billing = (param: BillingParam): Promise<ResponseType<ResponseBilling>> => {
    return AxiosInstance.post(OrderUrls.billing, param);
  };

  order_history = (param: OrderHistoryParams): Promise<ResponseType> => {
    return AxiosInstance.get(OrderUrls.order_history(makeQueryString(param)));
  };

  check_delivery_availability = (param: any): Promise<ResponseType> => {
    return AxiosInstance.post(OrderUrls.check_delivery_availability, param);
  };

  Get_User_Profiledata = (id: string): Promise<ResponseType<ResponseGetProfile>> => {
    this.init();
    return AxiosInstance.get(OrderUrls.Get_User_Profiledata(id), {
      headers: this.headers,
    });
  };

  updateUserProfile = (id: string, param: any): Promise<ResponseType> => {
    return AxiosInstance.patch(OrderUrls.updateUserProfile(id), param, {
      headers: this.headers,
    });
  };
  couponValidCheck = (param: CouponParams): Promise<ResponseType<CouponCodeSuccessResponse>> => {
    return AxiosInstance.post(OrderUrls.couponValidationCheck, param);
  };
  suggested_items = (params: SuggestedItemsParams, controller?: AbortController): Promise<ResponseType> => {
    return AxiosInstance.get(OrderUrls.suggested_items(makeQueryString(params)), {
      signal: controller?.signal,
    });
  };
  create_a_order = async (params: CreateOrderParams): Promise<ResponseType<ResponseTypeCreateOrder>> => {
    const response: any = await AxiosInstance.post<ResponseType<ResponseTypeCreateOrder>>(OrderUrls.create_a_order, params);
    return response;
  };
  find_one_restaurant = async (id: string, controller?: AbortController): Promise<ResponseType<RestaurantInDetail>> => {
    const response: any = await AxiosInstance.get<ResponseType<RestaurantInDetail>>(OrderUrls.find_one_restaurant(id), {
      signal: controller?.signal,
    });
    return response;
  };
  gateway = (id: string): Promise<ResponseType<ResponseGetGateway>> => {
    return AxiosInstance.get(OrderUrls.gateway(id));
  };
  find_order_details = (id: string): Promise<ResponseType<any>> => {
    return AxiosInstance.get(OrderUrls.find_order_details(id));
  };
  search = (query: string): Promise<ResponseType> => {
    return AxiosInstance.get(OrderUrls.search(query));
  };
  add_fav_restaurant = (params: {restaurantId: string; customerId: string}): Promise<ResponseType> => {
    this.init();
    return AxiosInstance.post(OrderUrls.add_fav_restaurant(params.restaurantId, params.customerId), {}, {headers: this.headers});
  };
  find_all_more_info = (restaurantId: string, locationId: string, controller?: AbortController): Promise<ResponseType> => {
    return AxiosInstance.get(OrderUrls.find_all_more_info(restaurantId, locationId), {
      signal: controller?.signal,
    });
  };
  ordering_nearby = (params: CurrentLocationData): Promise<ResponseType> => {
    return AxiosInstance.post(OrderUrls.ordering_nearby, params);
  };
  ordering_available_dates = (locationId: string, method: Method): Promise<ResponseType> => {
    return AxiosInstance.get(OrderUrls.ordering_available_dates(locationId, method));
  };
  ordering_slots = (locationId: string, method: Method, date: string): Promise<ResponseType> => {
    return AxiosInstance.get(OrderUrls.ordering_slots(locationId, method, date));
  };

  createIntentTilled = (params: CreateIntentTilledParams): Promise<ResponseType> => {
    return AxiosInstance.post(OrderUrls.createIntentTilled, params);
  };
}

const API_Ordering = new Ordering();
export {API_Ordering};
