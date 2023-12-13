import {DeliveryAddress, Guest, Method} from '../api/types';

export type Payment = 'Pay there' | 'New card' | 'Saved Card';
export interface CardState {
  name: string;
  sCardHolderName: string;
  sCardNumber: string;
  sExpiryDate: string;
  sCVV: string;
}
export interface ToppingItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  product_name?: string;
  type: 'select' | 'radio' | 'checkbox';
}

export interface Item {
  id: string;
  name: string;
  description?: string;
  specialInstructionsText: string;
  price: number;
  quantity: number;
  toppings: ToppingItem[];
}

export interface BagState {
  items: Item[];
  restaurantId: string;
  restaurantIdForFavorite: string;
  locationId: string;
  method: Method;
  locationAddress: string;
  deliveryAddress: DeliveryAddress | {} | null;
  deliveryMethod: string;
  deliveryZoneId: string;
  scheduledOn: string;
  orderTiming: 'now' | 'later';
}

export interface DashboardState {
  allOrderData: {
    total: number;
    results: any[];
    stats: {
      prepared: number;
      delivered: number;
      pending: number;
      _id: null;
    };
  };
  isRefreshing: boolean;
  isLoadingMore: boolean;
  prepTime: {
    prepTime: {delivery: number; pickup: number};
    status: boolean | null;
    name: string;
    partnerLogo: string | null;
  };
  orderStats: {
    totalOrders: number;
    totalTip: number;
  };
  newNotifiedOrder: {
    orderId: string | null;
    orderNum: string | null;
    orderTiming: string | null;
  };
}
export interface GenericState {
  isLoading: boolean;
  noInternet: boolean;
  appStateVisible: 'inactive' | 'background' | 'active' | null;
  isNotificationModal: boolean;
  isOpenDatePicker: boolean;
  notificationAttention: {
    message: string;
    orderId: string;
    notificationId: string;
  } | null;
}

export type WhichForm = 'signin' | 'signup' | 'guestuser';
export interface I<T> {
  onChangeValue: (data: T) => void;
  initData?: T;
  editable?: boolean;
}
export interface FormDataGuestUser extends Required<Guest> {}

export type MoreInfo = {
  _id: string;
  restaurant: string;
  title: string;
  subInfo: SubInfo[];
  location: string[];
  createdAt: string;
  updatedAt: string;
};

export interface SubInfo {
  infoId: string;
  label: string;
  options: string[];
  type: string;
  required: boolean;
  _id: string;
}
