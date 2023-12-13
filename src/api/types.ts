export type Method = 'delivery' | 'pickup' | undefined;
export type PaymentProviders = 'jupiter' | 'authorize.net' | 'tilled';

export type Error = any;

export type Spicy = 'Medium' | 'Low' | 'High';

export type CouponType = 'percentage' | 'fixed';

export type PaymentMethod = 'both' | 'online' | 'pay-there' | 'saved-card' | 'new-card' | undefined;

export interface Availability {
  day: string;
  startDate: string;
  endDate: string;
  _id: string;
}

export interface CategoryAvailability extends Omit<Availability, '_id'> {
  enable: boolean;
}

export interface ICategory {
  _id: string;
  name: string;
  restaurantId: string;
  availability: CategoryAvailability[];
  categoryName: string;
  isAlcohol: boolean;
  isAvailableDaily: boolean;
  isCatering: boolean;
  location: string[];
  methodChosen: string;
  restaurant: string;
  sortOrder: number;
  source: string;
  status: string;
  subCategories: never[];
  taxRate: null;
  type: 'category';
}

export interface BillingParam {
  data: {
    _id: string;
    qty: number;
    modifiers: {
      product_id: string;
      product_name: string;
      price: number;
      sort: number;
      halfPrice: number;
      extraPrice: number;
      subModifiers: {
        restaurant: string;
        name: string;
        sortOrder: string;
        price: number;
        type: string;
        source: string;
      }[];
      defaultSelected: boolean;
      selectedParentValue: {
        label: string;
        value: string;
      };
      name: string;
      selectedModifier: {
        label: string;
        value: number;
      };
      parent: string;
      qty: number;
    }[];
    note: string;
  }[];
  tip: number;
  coupon: CouponCodeSuccessResponse | string | null;
  points: string | number;
  location: string;
  restaurant: string;
  method: Method;
  customer: string;
  address: DeliveryAddress | {} | null;
  deliveryMethod?: string;
  deliveryZoneId?: string;
}

export interface IMenuItem {
  _id: string;
  name: string;
  availability: Availability[];
  categories: ICategory[];
  description: string;
  imageUrl: string;
  isAlchohol: boolean;
  isAvailableDaily: boolean;
  isCombo: boolean;
  isPizza: boolean;
  isSuggested: boolean;
  method: string;
  modifiers: Modifiers;
  plu: string;
  price: number;
  subProducts: SubProduct[];
  glutenFree: boolean;
  loyaltyPoint: number;
  vegetarian: boolean;
}

export interface Modifier {
  subProducts: SubProduct[];
  name: string;
  isRequired: boolean;
  enableQtyUpdate: boolean;
  type: 'select' | 'radio' | 'checkbox';
  sortOrder: number;
  min: number;
  max: number;
  parentModifier: string;
  enableParentModifier: boolean;
}

export interface Modifiers {
  [key: string]: Modifier;
}

export interface SubProduct {
  product_id: string;
  product_name: string;
  price: number;
  sort: number;
  halfPrice: number;
  extraPrice: number;
  subModifiers: SubModifier[];
  defaultSelected: boolean;
  selectedParentValue: SelectedParentValue;
}

export interface SubModifier {
  restaurant: string;
  name: string;
  sortOrder: string;
  price: number;
  type: string;
  source: string;
}

export interface SelectedParentValue {
  label: string;
  value: string;
}

export type ResponseType<T = any> = {
  data: T;
  code: string;
  message?: string;
};

export type SearchRestaurantType = 'fav' | 'all';

export interface IRestaurant {
  _id: string;
  restaurant: {
    _id: string;
    name: string;
    email: string;
    logo: string;
    address: string;
  };
  count: number;
}

export interface BaseRestaurantCatAndMenu {
  locationId: string;
  method: Method;
}

export interface ParamRestaurantMenu {
  locationId: string;
  method: Method;
  categoryId: string;
  schedule?: any;
}

export interface ParamFindallLocation {
  restaurant: string;
}

export type UserActivationType = 'active' | 'inactive';

export interface ParamSignUp {
  status: UserActivationType;
  email: string;
  password: string;
  phone: number | string;
  name: string;
  role: string;
  loyalityPoints: number;
  birthday: string;
  anniversary: string;
  emailForCouponAndInfo: boolean;
  smsForCouponAndInfo: boolean;
  agreeTermsAndConditions: boolean;
}
export interface ParamLogin {
  email: String;
  password: String;
  restaurant?: string;
}
export interface ParamResetPassword {
  email: String;
}
export interface ParamVerifyOTP {
  email: String;
  otp: String;
  password: String;
}
export interface ParamUpdateProfile {
  userId: string;
  email: String;
  name: String;
  id: String;
  profilePicture: string;
  status: UserActivationType;
}
export interface ParamUpdateFCMToken {
  email: String;
  name: String;
  password: String;
  status: UserActivationType;
}

export interface CouponItem {
  _id: string;
  qty: number;
  modifiers: any[];
  note: string;
}

export interface CouponParams {
  coupon: string;
  location: string;
  items: CouponItem[];
  method: Method;
  loggedIn: boolean;
  customer: any;
}

export interface SuggestedItemsParams {
  suggested: boolean;
  restaurant: string;
  method: Method;
}
export interface Guest {
  name?: string;
  email?: string;
  phone?: number | string;
  note?: string;
}
export interface Item {
  _id: string;
  qty: number;
  modifiers: Modifier[];
  note: string;
}
export interface TaxDetails {
  appliedCoupon: any;
  serviceCharge: ServiceCharge;
  taxDetails: {
    name: string;
    amount: number;
    taxId: string;
  }[];
}
export interface MoreInfoData {
  Text?: 'TEXT';
  All?: 'OK';
  Spicy?: Spicy[];
}
export interface SelectedPaymentMethod {
  token: string;
  cardHolderName: string;
  expirationMonth: string;
  expirationYear: string;
  cardLogo: string;
  truncatedCardNumber: string;
  cvv: string;
  saveCard: boolean;
  billingAddress?: {
    zipCode: string;
  };
}

export interface DeliveryAddress {
  formatted_address: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  district: string;
  status: string;
  street: string;
  type: string;
}

export interface CreateOrderParams {
  customer: string;
  restaurant: string;
  location: string;
  scheduledOn: string;
  deliveryAddress: DeliveryAddress | null;
  loyalty: number;
  tip: number;
  deliveryFee: number;
  loyaltyDiscount: number;
  orderFee: number;
  guest: Guest | null;
  method: Method;
  orderTiming: 'now' | 'later';
  items: Item[];
  paymentMethod: PaymentMethod;
  taxDetails: TaxDetails;
  moreInfoData: MoreInfoData;
  selected_payment_method?: string | SelectedPaymentMethod | TilledPaymentResponse;
  gateway: string;
  deliveryMethod?: string;
  deliveryZoneId?: string;
  source: string;
}

export interface ServiceCharge {
  amount: number;
  name: string;
  taxId: string;
}

export interface LoyaltyPointRule {
  loyaltyPoints: number;
  loyaltyRules: {
    minSubtotal: number;
    minRedeemableAmount: number;
    pointsPerDollar: number;
    visitThreshold: number;
    rewardPoints: number;
  };
  allowLoyalityTransaction: boolean;
  isUseLoyaltyBalance: boolean;
}

export interface ResponseTypeCreateOrder {
  __typename: string;
  orderNum: string;
  customer: {
    name: string;
    email: string;
    phone: number;
    customerId: string;
  };
  notified: boolean;
  partner: string;
  restaurant: string;
  headers: {
    userAgent: string;
    customerIp: string;
  };
  storeUrl: string;
  items: {
    name: string;
    modifiers: any[];
    instruction: string;
    qty: number;
    price: number;
    taxId: string;
    plu: string;
    itemId: string;
    _id: string;
  }[];
  status: string;
  method: string;
  scheduledOn: string;
  payment: {
    taxDetails: {
      name: string;
      amount: number;
      taxId: string;
      _id: string;
    }[];
    subTotal: number;
    total: number;
    tax: number;
    tip: number;
    deliveryFee: number;
    orderFee: number;
    loyaltyDiscount: number;
    discount: number;
    ihdFee: number;
  };
  note: string;
  deliveryAddress: DeliveryAddress | {};
  location: string | Location;
  paymentStatus: string;
  paymentMethod: string;
  orderTiming: string;
  orderNowPickupDate: string;
  readByTablet: boolean;
  excludedFromReports: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Location {
  ordering: any;
  pickupDelivery: any;
  schedule: any;
  forwardPrint: boolean;
  ihdReadyTime: number;
  numberOfPrints: number;
  customPrepTimesEnabled: boolean;
  _id: string;
  resturant: string;
  deliverect_channel_name: string;
  deliverect_channel_link_id: string;
  status: boolean;
  enableTaxOnOrderFee: boolean;
  sortOrder: string;
  name: string;
  timezone: string;
  displayAddress: string;
  streetAddress: string;
  state: string;
  city: string;
  postal: string;
  address: string;
  latLng: number[];
  phone: number;
  email: string;
  print: boolean;
  smsAlertPhone: string;
  serviceCharge: boolean;
  serviceChargeTitle: string;
  serviceChargePercentage: number;
  txnReport: boolean;
  txnReportFrequency: string[];
  txnReportEmail: string;
  closeOfBusiness: boolean;
  closeOfBusinessEmail: string;
  orderEmail: string;
  cateringShop: boolean;
  macAddress: string;
  hoursOfOperation: HoursOfOperation[];
  walkupOrderingPaymentMethods: any[];
  enableIhd: boolean;
  ihdClientId: string;
  ihdClientSecret: string;
  ihdLocationId: string;
  externalLinkId: string;
  customPrepTimes: any[];
}

export interface HoursOfOperation {
  day: string;
  pickupTo: string;
  pickupFrom: string;
  deliveryTo: string;
  deliveryFrom: string;
}

export interface OrderHistoryParams {
  customerId: string;
  limit?: number;
  page?: number;
}

export interface RestaurantListParams {
  partner: string;
  customer?: string;
  category?: string;
}

export interface ScheduleParam {
  locationId: string;
  method: Method;
}

export interface ResponseChooseLocation {
  _id: string;
  name: string;
  timezone: string;
  displayAddress: string;
  streetAddress: string;
  state: string;
  city: string;
  postal: string;
  latLng: Array<number>;
  pickupDelivery: {
    enablePickup: boolean;
    pickupPrepTime: number;
    enableDelivery: boolean;
    deliveryReadyTime: number;
    geofencing: Array<{
      lat: number;
      lng: number;
    }>;
    deliveryRadius: number;
    deliveryReadyTimeDefault: number;
    pickupPrepTimeDefault: number;
    deliveryZones: {
      deliveryFee: number;
      minimumDeliveryAmount: number;
      deliveryFeeSetting: string;
      deliveryReadyTime: number;
      deliveryReadyTimeDefault: number;
      geofencing: {
        lat: number;
        lng: number;
      }[];
      _id: string;
    }[];
  };
  schedule: {
    delivery: {
      startTime: string;
      endTime: string;
    };
    pickup: any;
  };
  hoursOfOperation: Array<{
    day: string;
    pickupTo: string;
    pickupFrom: string;
    deliveryTo: string;
    deliveryFrom: string;
  }>;
  enableIhd: boolean;
  isClosedPickup: boolean;
  isClosedDelivery: boolean;
  willPickupOpenToday: boolean;
  willDeliveryOpenToday: boolean;
  allSchedules: Array<{
    delivery: {
      startTime: string;
      endTime: string;
    };
    pickup: {
      startTime: string;
      endTime: string;
    };
  }>;
}

export type ResponseGetProfile = {
  _id: string;
  email: string;
  status: string;
  role: string;
  permissions: Array<any>;
  authProvider: string;
  restaurant: string;
  customer: {
    _id: string;
    userId: string;
    name: string;
    role: string;
    email: string;
    phone: number;
    birthday: string;
    anniversary: string;
    address: Array<any>;
    customerGroup: string;
    status: string;
    restaurants: string[];
    paymentMethods: Array<any>;
    loyaltyPoints: number;
    smsForCouponAndInfo: boolean;
    emailForCouponAndInfo: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    profilePicture: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
  resetPasswordOTP: string;
};

export type ResponseGetGateway = {
  _id: string;
  name: PaymentProviders;
  gateway: PaymentProviders | '';
  subMerchantId: string;
  enableEnhancedSecurity: boolean;
  tilledPublishableKey: string;
  tilledAccountId: string;
};

export type ParamsAddCard = {
  token: string;
  cardHolderName: string;
  expirationMonth: string;
  expirationYear: string;
  cardLogo: string;
  truncatedCardNumber: string;
  cvv: string;
  customer: string;
  gateway: string;
  provider: PaymentProviders;
};

export interface Partner {
  partner: {
    _id: string;
    email: string;
    status: string;
    role: string;
    partner: {
      _id: string;
      userId: string;
      name: string;
      phone: string;
      headerLogo: string;
    };
  };
}

export interface ResponseHomeScreen {
  allRestaurants: Restaurant[];
  favourites: Favourite[];
  categories: Category[];
  partner: Partner;
  deleteAccountUrl: string;
}

export interface Restaurant {
  _id: string;
  userId: {
    _id: string;
    email: string;
    username: string;
    password: string;
    status: string;
    role: string;
    permissions: string[];
    authProvider: string;
    restaurant: string;
    partner: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  name: string;
  email: string;
  address: string;
  logo: string;
  logoLg: string;
  logoMd: string;
  logoXl: string;
  openlocation?: boolean;
  locationId: string;
  url: string;
}

export interface Category {
  _id: string;
  name: string;
  partner: string;
  restaurants: string[];
  image: string;
  sort: number;
  __v: number;
}

export interface Favourite {
  _id: string;
  partner: string;
  customer: string;
  restaurant: {
    _id: string;
    restaurant: {
      _id: string;
      name: string;
      email: string;
      address: string;
      logo: string;
      favImg?: string;
      showInPartnerApp: boolean;
    };
  };
}

export type MasonryImage = {
  id: string;
  uri: string;
  source: {
    uri: string;
  };
  dimensions: {
    width: number;
    height: number;
  };
  index: number;
  masonryDimensions: {
    width: number;
    height: number;
    gutter: number;
    margin: number;
  };
  column: number;
};
export interface ResponseBilling {
  subTotal: number;
  tax: number;
  taxDetails: Array<{
    name: string;
    amount: number;
    taxId: string;
  }>;
  total: number;
  serviceCharge: {
    amount: number;
    name: string;
    taxId: string;
  };
  appliedCoupon: any;
  tip: number;
  orderFee: number;
  deliveryFee: number;
  accumatedDeliveryFee: number;
  loyaltyDiscount: number;
  discount: number;
  pointsUsed: any;
  disableOrdering: boolean;
  ihdFee: number;
}

export type ResponseJupiterPayment = {
  success: boolean;
  status: string;
  message: string;
  data: {
    subMerchantId: string;
    token: string;
    cardHolderName: string;
    expirationMonth: string;
    expirationYear: string;
    cardLogo: string;
    truncatedCardNumber: string;
    cvv: string;
  };
  code: string;
  error: string;
};

export type RestaurantInDetail = {
  _id: string;
  userId: {
    _id: string;
  };
  partner: {
    _id: string;
    partner: {
      _id: string;
      url: string;
      name: string;
      privacy: string;
      terms: string;
    };
  };
  url: string;
  name: string;
  email: string;
  phone: string;
  logo: string;
  payment: PaymentMethod;
  privacy: string;
  terms: string;
  orderingApp: boolean;
  ordering: {
    orderNow: boolean;
    orderLater: boolean;
    orderForLaterDays: number;
    orderFutureTimeSameDay: boolean;
    orderFutureTimeDifferentDay: boolean;
    turnOffSameAndNextDayOrdering: boolean;
    nextActiveDate: string;
    allowTip: boolean;
    logoWhiteBackground: boolean;
    disableAmex: boolean;
    pickupPrepTime: number;
    pickupTitle: string;
    deliveryTitle: string;
    orderForLaterBtnText: string;
    notePlaceholderText: string;
    peakHours: number;
    maxOrdersPerHour: number;
    shopCloseTitle: string;
    shopCloseText: string;
    ageVerificationWarningMsg: string;
    hideSpecialInstruction: boolean;
    instructionText: string;
    hideExtraButtons: boolean;
    hideOrderUsualAndPopular: boolean;
    skipStep: boolean;
    dineInText: string;
    dineInTitle: string;
    skipStepMethod: boolean;
    skipStepTimeM: boolean;
    backgroundColor: string;
    applyServiceTax: boolean;
    allowLoyaltyTransaction: boolean;
    socialLogin: boolean;
    _id: string;
  };
  loyalty: {
    minSubtotal: number;
    minRedeemableAmount: number;
    pointsPerDollar: number;
    visitThreshold: number;
    rewardPoints: number;
  };
  homeLink: string;
  ihdFees: string;
  pop_up_alerts: {
    home_popup: {
      title: string;
      home_popup: boolean;
      message: string;
    };
    category_popup: {
      title: string;
      category_popup: boolean;
      message: string;
      note: string;
    };
    checkout_popup: {
      title: string;
      checkout_popup: boolean;
      message: string;
    };
  };
};

export type TilledPaymentResponse = {
  paymentMethod: {
    card: {
      brand: string;
      last4: string;
      checks: {
        cvc_check: string;
        address_line1_check: string;
        address_postal_code_check: string;
      };
      funding: string;
      exp_year: number;
      exp_month: number;
      holder_name: string;
      apple_pay: boolean;
    };
    ach_debit: any;
    eft_debit: any;
    chargeable: boolean;
    id: string;
    type: string;
    customer_id: any;
    nick_name: any;
    expires_at: string;
    billing_details: {
      name: string;
      address: {
        zip: string;
        country: string;
      };
    };
    metadata: any;
    created_at: string;
    updated_at: string;
  };
  saveCard: boolean;
  intent: {
    id: string;
    client_secret: string;
  };
};

export type CreateIntentTilledParams = {
  amount: number;
  gatewayId: string;
  partnerId: string;
};

export type CouponCodeSuccessResponse = {
  duration: {
    startDate: string;
    endDate: string;
  };
  _id: string;
  restaurant: string;
  status: boolean;
  couponName: string;
  couponCode: string;
  couponType: string;
  couponDiscount: number;
  subTotal: number;
  categories: string[];
  items: string[];
  location: string[];
  usesPerCoupon: string;
  usesPerCustomer: string;
  method: string;
  customerLogin: boolean;
  __v: number;
};

export type MasonryItemProps = {
  source: {
    uri: string;
  };
  resizeMethod: string;
  style: {
    width: number;
    height: number;
    margin: number;
    backgroundColor: string;
    borderRadius: number;
  };
  children: string;
};
