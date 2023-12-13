import {NavigationProp} from '@react-navigation/native';
import {IRestaurant, Method, ResponseTypeCreateOrder, Restaurant} from '../api/types';

export type CommonNavigationProps = {
  navigation: NavigationProp<any, any>;
  route: any;
};

export type DrawerScreenRouteProp = {
  HomeNew: undefined;
  Home: undefined;
  Profile: undefined;
  OrderHistory: undefined;
  TermAndConditions: undefined;
  FAQs: undefined;
};

export type StackScreenRouteProp = {
  OnboardingScreen: undefined;
  AllListingsCategoriesScreens: {
    category_id: string;
    category_name: string;
  };
  AuthScreen: undefined;
  ForgotPassword: undefined;
  RememberMe: undefined;
  SignIn: undefined;
  SignUp: undefined;
  VerifyOTP: {
    email: string;
  };
  Home: undefined;
  Menu: {
    passedData: {
      locationId: string;
      restaurantId: string;
      method: Method;
      deliveryAddress?: string;
      schedule?: string;
    };
  };
  MapOfRestauntsNearOfUserScreen: undefined;
  Bag: undefined;
  OrderSummary: undefined;
  Payment: undefined;
  PaymentMethod: undefined;
  PaymentMethod1: undefined;
  OrderSuccess: ResponseTypeCreateOrder;
  OrderHistory: undefined;
  StartYourOrder: undefined;
  ChooseLocation: Restaurant;
  Profile: undefined;
  FavoriteRestaurantScreen: undefined;
  Drawer: undefined;
  OrderDetailPage: {
    item_id: string;
    isCommingFromBag: boolean;
  };
  OrderCheckout: {
    paymentData?: any;
  };
  AllRestaurants: undefined;
  GroceriesScreen: undefined;
  TermAndConditions: undefined;
  PrivacyPolicy: undefined;
  VGSWebView: undefined;
};

export type IsCommingfrom = keyof StackScreenRouteProp | DrawerScreenRouteProp | 'undefined';
