import {NativeStackScreenProps} from '@react-navigation/native-stack';
import moment from 'moment';
import React, {useCallback, useEffect, useReducer, useRef, useState} from 'react';
import {FlatList, Image, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {showMessage} from 'react-native-flash-message';
import {API_Auth, API_Cards, API_Ordering, LoyaltyPointRule, StatusCodes} from '../api';
import {BillingParam, CouponCodeSuccessResponse, CreateOrderParams, DeliveryAddress, Error, PaymentMethod, PaymentProviders, SelectedPaymentMethod} from '../api/types';
import {AddATip, CheckOutTaxItem, GuestUser, ListEmptyComponent, LoyaltyBalance, OrderDetailsItem, PaymentFormOrDetails, PrimaryButton, SelectableButton, SelectableButtonPayment, Separator, WhiteBox} from '../components';
import TaxFeesBlock from '../components/TaxFeesBlock';
import {ComponentMatrix, HIT_SLOP} from '../constants/constants';
import {images} from '../core';
import {updateQty, useAppSelector} from '../redux';
import {useAppDispatch} from '../redux/hooks';
import {resetState} from '../redux/modules/bagSlice';
import {setGateway} from '../redux/modules/gatewaySlice';
import {startLoading, stopLoading} from '../redux/modules/loading-slice';
import {setComingFrom} from '../redux/modules/navigationSlice';
import {colors, commonStyles, fonts, fontSize, ms, vs} from '../styles';
import {FormDataGuestUser, Item, MoreInfo, Payment, WhichForm} from '../types';
import {StackScreenRouteProp} from '../types/navigationTypes';
import {getMethodName, prettyPrint, showDangerMessage, showSuccessMessage} from '../utils/functions';
import {validateGuestInput} from '../utils/validator';
import {BagItem, Root} from './Bag';
import {menuStyles} from './Menu';
import {Dropdown} from 'react-native-element-dropdown';
import {useFocusEffect} from '@react-navigation/native';

const OrderCheckout: React.FC<NativeStackScreenProps<StackScreenRouteProp, 'OrderCheckout'>> = ({navigation, route}) => {
  const [isSignIn, setIsSignIn] = useState<WhichForm>('guestuser');
  const dispatch = useAppDispatch();
  const {items, restaurantId, locationId, method, deliveryAddress, locationAddress, restaurantIdForFavorite, deliveryMethod, deliveryZoneId, orderTiming, scheduledOn} = useAppSelector((state) => state.itemBag);
  const {user, accessToken} = useAppSelector((state) => state.profile);
  const gateway = useAppSelector((state) => state.gateway);
  const {
    restaurant: {
      ordering: {allowTip},
    },
  } = useAppSelector((state) => state.restaurant);
  const partner = useAppSelector((state) => state.partner);
  const {isLoading} = useAppSelector((state) => state.Loader);
  const [tip, setTip] = useState(0);
  const [tipPercentage, setTipPercentage] = useState(0);
  const [isUserGiveTip, setIsUserGiveTip] = useState(false);
  const [reload, setReload] = useState(false);
  const [suggestedItems, setSuggesedItem] = useState([]);
  const [moreInfoItems, setMoreInfoItems] = useState<MoreInfo[]>([]);
  const [moreInfoData, setMoreInfoData] = useState<any>({});
  const [paymentType, setPaymentType] = useState<Payment>('Pay there');
  const [validCoupon, setValidCoupon] = useState<string | null>(null);
  const [validCouponObject, setValidCouponObject] = useState<CouponCodeSuccessResponse | null>(null);
  // const [arrSpices, setArrSpices] = useState(SPICES);
  const [coupon, setCoupon] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(undefined);

  const [savedCards, setSavedCards] = useState<any[]>([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);

  const [guestData, setGuestdata] = useState<FormDataGuestUser>({
    email: user.email,
    name: user.customer.name,
    phone: user.customer.phone.toString(),
    note: '',
  });

  const [total, setTotal] = useState<Root>({
    subTotal: 0,
    tax: 0,
    taxDetails: [
      {name: 'General Tax', rate: 8, taxId: '63bc1483f75dfb94afecb532', amount: 0},
      {amount: 0, name: 'Service', taxId: 'SERVICE_TAX_ID'},
    ],
    total: 0,
    serviceCharge: {amount: 0, name: 'Service', taxId: 'SERVICE_TAX_ID'},
    appliedCoupon: null,
    tip: 0,
    orderFee: 0,
    deliveryFee: 0,
    accumatedDeliveryFee: 100,
    loyaltyDiscount: 0,
    discount: 0,
    pointsUsed: null,
    disableOrdering: false,
    ihdFee: 0,
  });

  const [loyaltyPointsState, dispatchLoyaltyPoints] = useReducer(
    (state: LoyaltyPointRule, action: any) => {
      if (action.loyaltyPoints) {
        return {
          ...state,
          loyaltyPoints: action.loyaltyPoints,
        };
      } else if (action.type === 'updateLoyaltyRules') {
        return {
          ...state,
          loyaltyRules: action.loyaltyRules,
          allowLoyalityTransaction: action.allowLoyalityTransaction,
        };
      } else if (action.type === 'useLoyaltyBalance') {
        return {
          ...state,
          isUseLoyaltyBalance: true,
        };
      } else if (action.type === 'removeLoyaltyBalance') {
        return {
          ...state,
          isUseLoyaltyBalance: false,
        };
      }
      return state;
    },
    {
      loyaltyPoints: 0,
      loyaltyRules: {minSubtotal: 0, minRedeemableAmount: 0, pointsPerDollar: 0, visitThreshold: 0, rewardPoints: 0},
      allowLoyalityTransaction: false,
      isUseLoyaltyBalance: false,
    },
  );

  const getData = (): any => {
    return items.map((item: Item) => ({
      _id: item.id,
      qty: item.quantity,
      description: item.description,
      modifiers: item.toppings.map((topping: any) => {
        if (topping?.selectedSubModifier) {
          return {
            ...topping,
            product_id: topping.id || topping.product_id,
            qty: item.quantity,
            selectedModifier: {label: topping?.selectedSubModifier?.label, value: topping?.selectedSubModifier?.value},
            selectedParentValue: {label: '', value: ''},
          };
        } else if (topping?.advancedPizzaOptions) {
          return {
            ...topping,
            subModifiers: [],
            product_id: topping.id || topping.product_id,
            selectedParentValue: {label: '', value: ''},
            selectedParentValues: [],
            side: String(topping?.side)?.toLowerCase(),
            size: String(topping?.size)?.toLowerCase(),
            sort: 0,
          };
        } else {
          return {
            product_id: topping.id || topping.product_id,
            product_name: topping?.product_name,
            price: topping.price,
            name: topping.name,
            qty: topping?.quantity,
            selectedParentValue: {label: '', value: ''},
          };
        }
      }),
      name: item.name,
      price: item.price,
      note: item.specialInstructionsText,
    }));
  };

  useEffect(() => {
    const controller = new AbortController();
    const init = async () => {
      try {
        const res = await Promise.allSettled([
          API_Ordering.suggested_items(
            {
              method: method,
              restaurant: restaurantId,
              suggested: true,
            },
            controller,
          ),
          API_Ordering.find_one_restaurant(restaurantId, controller),
          API_Auth.get_auth_profile(controller),
          API_Ordering.find_all_more_info(restaurantIdForFavorite, locationId, controller),
        ]);

        const [responseSuggestedItems, responseFindOneRestaurant, responseGetAuthProfile, responseFindAllMoreInfo] = res;
        if (responseFindAllMoreInfo.status === 'fulfilled') {
          setMoreInfoItems(responseFindAllMoreInfo.value.data);
        }

        if (responseSuggestedItems.status === 'fulfilled') {
          setSuggesedItem(responseSuggestedItems.value.data.data);
        }
        if (responseFindOneRestaurant.status === 'fulfilled' && responseFindOneRestaurant.value.code === StatusCodes.SUCCESS) {
          dispatchLoyaltyPoints({
            type: 'updateLoyaltyRules',
            loyaltyRules: responseFindOneRestaurant.value.data.loyalty,
            allowLoyalityTransaction: responseFindOneRestaurant.value.data.ordering.allowLoyaltyTransaction,
          });
          setPaymentMethod(responseFindOneRestaurant.value.data.payment);
          if (responseFindOneRestaurant.value.data.payment === 'online') {
            setPaymentType('New card');
          }
        }

        if (responseGetAuthProfile.status === 'fulfilled' && responseGetAuthProfile.value.code === StatusCodes.SUCCESS) {
          dispatchLoyaltyPoints({
            loyaltyPoints: responseGetAuthProfile.value.data?.customer?.loyaltyPoints,
          });
        }
      } catch (error: Error) {
        console.log({error});
      }
    };

    init();

    () => {
      controller.abort();
    };
  }, [reload, user]);

  useEffect(() => {
    const apiBilling = async () => {
      const billing_data: BillingParam = {
        data: getData(),
        tip: tip,
        points: loyaltyPointsState.isUseLoyaltyBalance ? String(loyaltyPointsState.loyaltyPoints) : '',
        location: locationId,
        restaurant: restaurantId,
        method: method,
        address: {},
        customer: user.customer._id,
        coupon: validCoupon ? validCouponObject : '' ?? '',
      };

      if (method === 'delivery') {
        billing_data.deliveryMethod = deliveryMethod;
        billing_data.deliveryZoneId = deliveryZoneId;
        billing_data.address = deliveryAddress;
      }
      try {
        console.log('billing_data', billing_data);
        const response = await API_Ordering.billing(billing_data);
        console.log('billing_data response', response);
        if (response.code === StatusCodes.SUCCESS) {
          setTotal(response.data);
        } else {
        }
      } catch (error: Error) {
        console.log({error});
      } finally {
      }
    };
    apiBilling();
  }, [tip, coupon, validCoupon, reload, items, loyaltyPointsState.isUseLoyaltyBalance]);

  useFocusEffect(
    useCallback(() => {
      if (items.length == 0) navigation.navigate('Home');
    }, [items]),
  );

  const getGateway = async () => {
    try {
      const responseGateway = await API_Ordering.gateway(locationId);

      if (responseGateway.code === StatusCodes.SUCCESS) {
        dispatch(setGateway(responseGateway.data));
      }

      if (responseGateway.data.gateway !== '') {
        fetchSavedCards(responseGateway.data.gateway);
      }
    } catch (error: Error) {
      console.log({error});
    }
  };
  useEffect(() => {
    getGateway();
  }, []);

  const fetchSavedCards = async (gateway: PaymentProviders) => {
    try {
      const response = await API_Cards.find_all_cards_customer(gateway);
      if (response.code === StatusCodes.SUCCESS) {
        setSavedCards(response.data);
      } else {
        setSavedCards([]);
      }
    } catch (error: Error) {
      console.log({error});
    }
  };

  useEffect(() => {
    if (accessToken) {
      setGuestdata({
        email: user.email,
        name: user.customer.name,
        phone: user.customer.phone.toString(),
        note: '',
      });
    } else {
      setGuestdata({
        email: '',
        name: '',
        phone: '',
        note: '',
      });
    }
  }, [accessToken]);

  const RenderItem = ({item, index, onPress = () => {}}: any) => {
    return (
      <Pressable
        style={[menuStyles.restaurantItemsWrapper, {marginTop: 24, marginHorizontal: 0}]}
        onPress={() => {
          onPress?.();
          navigation.navigate('OrderDetailPage', {
            item_id: item._id,
            isCommingFromBag: true,
          });
        }}>
        <View style={{width: 100}}>
          {item?.imageUrl ? (
            <>
              <FastImage style={{height: 70, width: 100, borderTopLeftRadius: 10}} source={{uri: item.imageUrl}} />
              <View style={commonStyles.center}>
                <Text style={[menuStyles.locationTextAdd]}>$ {item.price}</Text>
              </View>
            </>
          ) : (
            <View style={[{flex: 1, minHeight: 90, backgroundColor: '#F1F1F1', borderTopLeftRadius: 10, borderBottomLeftRadius: 10}, commonStyles.center]}>
              <Text style={[menuStyles.locationTextAdd]}>$ {item?.price}</Text>
            </View>
          )}
        </View>
        <View style={{flex: 1, marginHorizontal: ComponentMatrix.HORIZONTAL_16}}>
          <Text style={[menuStyles.locationTextAdd, {marginTop: vs(8)}]}>{item?.name}</Text>
          <Text numberOfLines={2} style={[menuStyles.itemTxt, {marginTop: vs(8)}]}>
            {item?.description}
          </Text>
        </View>
      </Pressable>
    );
  };

  const isValidPaymentMethodSelected = () => {
    if (paymentMethod === 'online') {
      if (paymentType === 'New card' || paymentType === 'Saved Card') {
        return true;
      }
      return false;
    } else if (paymentMethod === 'pay-there') {
      if (paymentType === 'Pay there') {
        return true;
      }
      return false;
    } else {
      return true;
    }
  };

  const getPlaceOrderParams = (savedCard: SelectedPaymentMethod | string | undefined = undefined) => {
    if (!isValidPaymentMethodSelected()) {
      showDangerMessage('Please select valid payment method.');
      return;
    }

    const params: Partial<CreateOrderParams> = {
      customer: '',
      deliveryAddress: null,
      deliveryFee: total.deliveryFee,
      guest: {},
      items: getData(),
      location: locationId,
      loyalty: 0,
      loyaltyDiscount: total.loyaltyDiscount,
      method: method,
      moreInfoData,
      orderFee: total.orderFee,
      restaurant: restaurantId,
      scheduledOn,
      taxDetails: {appliedCoupon: validCoupon, serviceCharge: total.serviceCharge, taxDetails: total.taxDetails},
      tip: tip,
      orderTiming,
      source: 'app',
    };

    if (method === 'delivery') {
      if (deliveryMethod === 'native') {
        params.deliveryZoneId = deliveryZoneId;
      }
      params.deliveryMethod = deliveryMethod;
      params.deliveryAddress = deliveryAddress;
    }

    const isValidGuest = validateGuestInput(isSignIn, guestData);

    if (accessToken.length) {
      params.customer = user.customer._id;
    } else if (isValidGuest && !accessToken.length) {
      params.guest = guestData;
    } else if (isSignIn === 'guestuser' && !isValidGuest) {
      return;
    }

    switch (paymentType) {
      case 'Pay there':
        params.paymentMethod = 'pay-there';

        break;
      case 'New card':
        params.paymentMethod = 'new-card';
        params.gateway = gateway._id;
        if (typeof savedCard !== 'string' && typeof savedCard !== 'undefined' && gateway.gateway === 'jupiter') {
          params.selected_payment_method = {
            token: savedCard.token,
            cardHolderName: savedCard.cardHolderName,
            expirationMonth: savedCard.expirationMonth,
            expirationYear: savedCard.expirationYear,
            cardLogo: savedCard.cardLogo,
            truncatedCardNumber: savedCard.truncatedCardNumber,
            cvv: savedCard.cvv,
            saveCard: savedCard.saveCard,
            billingAddress: {
              zipCode: '',
            },
          };
        } else if (gateway.gateway === 'tilled') {
          params.selected_payment_method = JSON.stringify(savedCard);
        }
        break;
      case 'Saved Card':
        params.paymentMethod = 'saved-card';
        params.selected_payment_method = savedCards[selectedCardIndex]._id;
        params.gateway = gateway._id;
        break;
    }
    return params;
  };

  const handlePlaceOrder = async (savedCards?: any) => {
    let params = getPlaceOrderParams(savedCards);
    console.log('handlePlaceOrder', isLoading, params);
    if (typeof params === 'undefined' || isLoading) {
      return;
    }

    try {
      dispatch(startLoading());

      const response = await API_Ordering.create_a_order(params as CreateOrderParams);
      console.log('create_a_order', response);
      if (response.code === StatusCodes.SUCCESS) {
        showMessage({
          message: 'Order placed successfully',
          type: 'success',
        });
        dispatch(resetState());
        // setTimeout(() => {
        getGateway();
        navigation.navigate('OrderSuccess', response.data);
        // }, 1850);
      }
    } catch (error: any) {
      console.log('handlePlaceOrder ==> ', {error});
      if (error?.message?.indexOf('aymentMethod is already associated') !== -1) showDangerMessage('This card has already been saved to your account.');
      else showDangerMessage(error?.message);
    } finally {
      dispatch(stopLoading());
    }
  };

  const applyCoupon = async () => {
    if (validCoupon) {
      setCoupon('');
      setValidCoupon(null);
    } else {
      try {
        if (coupon.length) {
          const response = await API_Ordering.couponValidCheck({
            coupon: coupon,
            location: locationId,
            items: getData(),
            method: method,
            loggedIn: accessToken.length > 0,
            customer: null,
          });

          if (response.code === StatusCodes.SUCCESS) {
            setValidCoupon(coupon);
            setValidCouponObject(response.data);
            showSuccessMessage('Coupon applied');
          }
        } else {
          showDangerMessage('Please enter coupon code.');
        }
      } catch (error: Error) {
        console.log({error});
        showDangerMessage(error?.message ?? 'Something went wrong, please try again later.');
        setCoupon('');
        setValidCoupon(null);
      } finally {
        setReload(!reload);
      }
    }
  };

  const scrollViewRef = useRef<ScrollView>(null);

  const _onContentSizeChange = () => {
    if (paymentType === 'New card') {
      scrollViewRef.current?.scrollToEnd({animated: true});
    }
  };

  const listOrderSummary = [
    {type: 'simple', title: 'Sub Total', price: total.subTotal},
    {
      type: 'TaxFees',
      data: {
        tax: total.tax,
        taxDetails: total.taxDetails,
        serviceCharge: total.serviceCharge,
        'Ordering Fee': total.orderFee,
        'Delivery Fee': total.deliveryFee,
        'ihd Fee': total.ihdFee,
      },
    },
    isUserGiveTip ? {type: 'simple', title: `Tip  ${tipPercentage ? `(${tipPercentage}%)` : '(Other) '}`, price: total.tip} : {disable: true, type: 'simple', title: '', price: 0},
    total.discount > 0 ? {type: 'simple', title: 'Coupon Discount', price: total.discount} : {disable: true, type: 'simple', title: '', price: 0},
    total.loyaltyDiscount > 0 ? {type: 'simple', title: 'Loyalty Discount', price: total.loyaltyDiscount, isMinus: true} : {disable: true, type: 'simple', title: '', price: 0},
    {type: 'simple', title: 'Total', price: total.total},
  ];

  // const _setArrSpices = (index: number) => {
  //   setArrSpices((oldArrSpices) => {
  //     return oldArrSpices.map((x, xi) => {
  //       if (index === xi) {
  //         return {
  //           ...x,
  //           isSelected: !x.isSelected,
  //         };
  //       }
  //       return x;
  //     });
  //   });
  // };

  const _onChangeValueOnItemCounter = (newValue: number, index: number) => {
    dispatch(
      updateQty({
        index: index,
        quantity: newValue,
      }),
    );
    setReload(!reload);
  };

  return (
    <View style={commonStyles.mainView}>
      <SafeAreaView style={{backgroundColor: colors.headerbg}} />
      <StatusBar barStyle={'light-content'} hidden={false} backgroundColor={colors.headerbg} />
      <View style={styles.headerView}>
        <View style={styles.leftViewMain}>
          <Pressable style={styles.leftView} onPress={() => navigation.goBack()} hitSlop={HIT_SLOP}>
            <Image style={styles.backIconStyles} source={images.icHeaderBack} />
          </Pressable>
        </View>
        <View style={styles.centerView}>
          <View style={{}}>
            <Text style={styles.txt}>Checkout</Text>
          </View>
        </View>
        <View style={[styles.rightViewMain]}></View>
      </View>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView ref={scrollViewRef} onContentSizeChange={_onContentSizeChange} showsVerticalScrollIndicator={false}>
          {accessToken === '' ? (
            <View style={[styles.guestDetailsWrapper]}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, paddingHorizontal: '3%', marginVertical: '4%'}}>
                <SelectableButton
                  title={'Sign in'}
                  selected={false}
                  onPress={() => {
                    dispatch(setComingFrom({isComingFrom: 'OrderCheckout'}));
                    navigation.navigate('SignIn');
                  }}
                />
                <SelectableButton
                  title={'Register'}
                  selected={false}
                  onPress={() => {
                    dispatch(setComingFrom({isComingFrom: 'OrderCheckout'}));
                    navigation.navigate('SignUp');
                  }}
                />
                <SelectableButton title={'Guest'} selected={isSignIn === 'guestuser'} onPress={() => setIsSignIn('guestuser')} />
              </View>
              {isSignIn === 'guestuser' && (
                <View style={{paddingHorizontal: '3%', marginVertical: '2%', paddingBottom: 10}}>
                  <Text style={{color: colors.darkBlackText, fontFamily: fonts.BGFlameBold, fontSize: fontSize.fs15}}>Guest Details</Text>
                  <GuestUser initData={guestData} onChangeValue={setGuestdata} />
                </View>
              )}
            </View>
          ) : (
            <View style={{marginHorizontal: '4%'}}>
              <Text style={styles.sectionHeader}>Personal Details</Text>
              <GuestUser onChangeValue={setGuestdata} initData={guestData} editable={!accessToken.length} />
            </View>
          )}
          {allowTip && (
            <AddATip
              tip={total.subTotal}
              onTipValue={(tip, tipPercentage, isUserGiveTip) => {
                setTip(tip);
                setTipPercentage(tipPercentage);
                setIsUserGiveTip(isUserGiveTip);
              }}
            />
          )}
          <View style={[styles.couponWrapper]}>
            <View style={{paddingHorizontal: '3%', marginVertical: '4%'}}>
              <Text style={styles.sectionHeader}>
                Apply Coupon <Text style={[styles.sectionHeader, {fontFamily: fonts.BGFlame, fontSize: fontSize.fs11}]}>(Have a coupon code?)</Text>
              </Text>
              <View style={{flexDirection: 'row', borderWidth: 1, marginTop: 10, borderColor: '#CDCDCD', borderRadius: 4, borderStyle: 'dashed', height: vs(40)}}>
                <TextInput
                  style={[
                    {fontFamily: fonts.BGFlame, fontSize: fontSize.fs13, flex: 1, height: '100%'},
                    commonStyles.removeMargin,
                    commonStyles.removePadding,
                    {
                      paddingHorizontal: ms(8),
                    },
                  ]}
                  placeholder="Enter a Coupon Code"
                  onChangeText={setCoupon}
                  value={coupon}
                  editable={validCoupon == null}
                />
                <Pressable onPress={applyCoupon} style={styles.btnApply}>
                  <Text style={{fontSize: fontSize.fs16, fontFamily: fonts.BGFlameBold, color: '#ffffff'}}>{validCoupon ? 'Remove' : 'Apply'}</Text>
                </Pressable>
              </View>
            </View>
          </View>
          {accessToken !== '' && loyaltyPointsState.allowLoyalityTransaction && (
            <LoyaltyBalance
              headerStyle={styles.sectionHeader}
              isUseLoyaltyBalance={loyaltyPointsState.isUseLoyaltyBalance}
              loyaltyState={loyaltyPointsState}
              onUse={() => {
                dispatchLoyaltyPoints({type: 'useLoyaltyBalance'});
              }}
              onRemove={() => {
                dispatchLoyaltyPoints({type: 'removeLoyaltyBalance'});
              }}
              subTotal={total.subTotal}
            />
          )}
          <WhiteBox style={{marginTop: 15}}>
            <Text style={styles.sectionHeader}>Order Details</Text>
            <OrderDetailsItem title="METHOD" val={getMethodName(method)} />
            <OrderDetailsItem title="LOCATION" val={method === 'delivery' ? (deliveryAddress as DeliveryAddress).formatted_address : locationAddress} />
            <OrderDetailsItem title="TIME" val={orderTiming === 'later' ? moment(scheduledOn).format('MMMM DD, YYYY HH:mm A') : `${moment().format('MMMM DD, YYYY HH:mm A')}\n Today - ASAP`} />
          </WhiteBox>
          <WhiteBox style={{marginTop: 15}}>
            <FlatList
              ListHeaderComponent={() => (items.length > 0 ? <Text style={styles.sectionHeader}>Order Summary</Text> : null)}
              renderItem={(props) => <BagItem {...props} onChangeValueOnItemCounter={(newValue: number) => _onChangeValueOnItemCounter(newValue, props.index)} />}
              data={items}
              ItemSeparatorComponent={() => <Separator />}
              ListEmptyComponent={<ListEmptyComponent>Your cart is empty</ListEmptyComponent>}
            />
            <FlatList data={listOrderSummary} renderItem={({item, index}) => (item.type === 'simple' ? <CheckOutTaxItem item={item} isMinus={item.isMinus} /> : <TaxFeesBlock data={item.data} />)} />
          </WhiteBox>
          {moreInfoItems.map((mi) => (
            <WhiteBox style={{marginTop: 15}}>
              <Text style={styles.sectionHeader}>{mi.title}</Text>
              {mi.subInfo.map((si) =>
                si.type == 'text' ? (
                  <>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={[styles.textInputTitle, {color: colors.secondaryRed}]}>{si.required && '*'}</Text>
                      <Text style={styles.textInputTitle}>{si.label}</Text>
                    </View>
                    <TextInput
                      placeholder={si.required ? '(Optional)' : '(Required)'}
                      style={[styles.txtNote]}
                      onChangeText={(txt) =>
                        setMoreInfoData((prevState: any) => ({
                          ...prevState,
                          [si.label]: txt,
                        }))
                      }
                    />
                  </>
                ) : si.type == 'checkbox' ? (
                  <>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={[styles.textInputTitle, {color: colors.secondaryRed}]}>{si.required && '*'}</Text>
                      <Text style={styles.textInputTitle}>{si.label}</Text>
                    </View>
                    <View style={{rowGap: vs(6), marginTop: vs(6)}}>
                      {si.options.map((o, index) => {
                        return (
                          <Pressable
                            style={{flexDirection: 'row', columnGap: ms(6)}}
                            onPress={() => {
                              const selected = moreInfoData[si.label] || [];
                              const sindex = selected.indexOf(o);
                              if (sindex === -1) {
                                selected.push(o);
                              } else {
                                selected.splice(sindex, 1);
                              }
                              setMoreInfoData((prevState: any) => ({
                                ...prevState,
                                [si.label]: selected,
                              }));
                            }}>
                            <Image source={moreInfoData[si.label] && moreInfoData[si.label].indexOf(o) !== -1 ? images.icCheck : images.icUncheck} />
                            <Text>{o}</Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </>
                ) : si.type == 'select' ? (
                  <>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={[styles.textInputTitle, {color: colors.secondaryRed}]}>{si.required && '*'}</Text>
                      <Text style={styles.textInputTitle}>{si.label}</Text>
                    </View>
                    <Dropdown
                      data={si.options.map((o) => ({label: o, value: o}))}
                      labelField="label"
                      valueField="value"
                      value={moreInfoData[si.label] || ''}
                      onChange={(item) => {
                        setMoreInfoData((prevState: any) => ({
                          ...prevState,
                          [si.label]: item.value,
                        }));
                      }}
                      style={styles.txtNote}
                      placeholder="Select"
                    />
                  </>
                ) : null,
              )}
            </WhiteBox>
          ))}
          {/* <WhiteBox style={{marginTop: 15}}>
            <Text style={styles.sectionHeader}>Add a note</Text>
            <TextInput placeholder="Note" style={[styles.txtNote]} />
          </WhiteBox> */}
          {/* <WhiteBox style={{marginTop: 15}}>
            <Text style={styles.sectionHeader}>Spices</Text>
            <View style={{rowGap: vs(6), marginTop: vs(6)}}>
              {arrSpices.map((spice_option, index) => {
                return (
                  <Pressable onPress={() => _setArrSpices(index)} style={{flexDirection: 'row', columnGap: ms(6)}}>
                    <Image source={spice_option.isSelected ? images.icCheck : images.icUncheck} />
                    <Text>{spice_option.title}</Text>
                  </Pressable>
                );
              })}
            </View>
          </WhiteBox> */}
          {0 < suggestedItems.length ? (
            <WhiteBox style={{marginTop: 15}}>
              <Text style={styles.sectionHeader}>Suggested Products</Text>
              <FlatList data={suggestedItems} renderItem={(props) => <RenderItem {...props} />} />
            </WhiteBox>
          ) : null}
          <WhiteBox style={{marginTop: 15}}>
            <View style={{flexDirection: 'row', flexWrap: 'wrap', columnGap: ms(5)}}>
              {(paymentMethod === 'pay-there' || paymentMethod === 'both') && <SelectableButtonPayment title={`Pay there`} onPress={() => setPaymentType('Pay there')} selected={paymentType === 'Pay there'} />}
              {(paymentMethod === 'online' || paymentMethod === 'both') && (
                <>
                  <SelectableButtonPayment title={`New card`} onPress={() => setPaymentType('New card')} selected={paymentType === 'New card'} />
                  <SelectableButtonPayment title={`Saved Card`} onPress={() => setPaymentType('Saved Card')} selected={paymentType === 'Saved Card'} />
                </>
              )}
            </View>
            <PaymentFormOrDetails
              restaurantPaymentAcceptType={paymentMethod}
              selectedPayType={paymentType}
              onDataChange={(data: any) => {
                if (paymentType === 'New card') {
                }
              }}
              onMessage={(event) => {
                const data = JSON.parse(event.nativeEvent.data);
                if (data.hasError && data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
                  const errors = data.errors.map((error: string) => (error?.indexOf('billing_details.address.zip') > -1 ? 'Zip must be shorter than or equal to 10 characters' : error)).join('\n');
                  showDangerMessage(errors);
                } else {
                  if (data.success) {
                    if (gateway.gateway === 'jupiter') {
                      handlePlaceOrder({...data.data, saveCard: data.saveCard});
                    } else if (gateway.gateway === 'tilled') {
                      let tillPaymentData = {
                        paymentMethod: data.data,
                        saveCard: data.saveCard,
                        intent: {
                          id: '',
                          client_secret: '',
                        },
                      };

                      const getIntentAndPlaceOrder = async () => {
                        try {
                          const intentParams = {
                            amount: total.total,
                            gatewayId: gateway._id,
                            partnerId: partner.partner.partner._id,
                          };
                          const intent = await API_Ordering.createIntentTilled(intentParams);

                          if (intent.code === StatusCodes.SUCCESS) {
                            tillPaymentData.intent = intent.data;
                          }
                          handlePlaceOrder(tillPaymentData);
                        } catch (error: Error) {
                          console.log({error});
                          showDangerMessage(error?.message ?? 'Error creating intent');
                        }
                      };
                      getIntentAndPlaceOrder();
                    }
                  } else {
                    showDangerMessage(data?.errorMessage ?? data?.message ?? 'Something went wrong');
                  }
                }
              }}
              savedCards={savedCards}
              onSavedCardChange={(_index) => {
                setSelectedCardIndex(_index);
              }}
              selectedIndex={selectedCardIndex}
              getGateway={getGateway}
            />
          </WhiteBox>
          {paymentType !== 'New card' ? (
            <PrimaryButton
              title="Place Order"
              bgColor={colors.headerbg}
              style={{marginHorizontal: ComponentMatrix.HORIZONTAL_16, width: undefined, marginVertical: vs(12), marginBottom: vs(8), marginTop: undefined}}
              onPress={() => handlePlaceOrder()}
              disabled={items.length === 0}
            />
          ) : (
            <View style={{height: 26}} />
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
export default OrderCheckout;

const styles = StyleSheet.create({
  sectionHeader: {color: '#777676', fontFamily: fonts.BGFlameBold, fontSize: fontSize.fs15},
  txtNote: {fontFamily: fonts.BGFlame, fontSize: fontSize.fs13, marginTop: vs(5), height: vs(40), borderRadius: ms(12), paddingLeft: ms(12), borderWidth: StyleSheet.hairlineWidth},
  keyOrderDetailsItem: {fontSize: fontSize.fs14, fontFamily: fonts.BGFlameBold, color: '#777676'},
  valOrderDetailsItem: {fontFamily: fonts.BGFlameBold, fontSize: fontSize.fs13, textAlign: 'right', color: '#343434'},
  linkBtn: {marginVertical: vs(10)},
  linkBtnText: {color: colors.headerbg, fontSize: fontSize.fs16, fontFamily: fonts.BGFlame},
  btnApply: {
    backgroundColor: colors.headerbg,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: ms(8),
  },
  headerView: {
    height: 100,
    backgroundColor: colors.headerbg,

    flexDirection: 'row',
    marginBottom: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'space-between',
  },
  leftViewMain: {width: '15%', justifyContent: 'center', alignItems: 'center'},
  leftView: {height: 30, width: 30},
  rightViewMain: {width: 40, justifyContent: 'center', alignItems: 'center', marginRight: 10},
  rightView: {height: 30, width: 30, marginRight: 50},
  centerView: {flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center'},
  txt: {color: colors.white, fontSize: fontSize.fs20, fontFamily: fonts.BGFlameBold},
  backIconStyles: {width: 20, height: 20, resizeMode: 'contain', alignSelf: 'center', top: 6},
  locationTextAdd: {color: '#343434', fontSize: fontSize.fs14, fontFamily: fonts.BGFlameBold},
  itemTxt: {fontSize: fontSize.fs13, fontFamily: fonts.BGFlameBold, color: '#777676'},
  restaurantItemsWrapper: {marginHorizontal: '4%', marginVertical: '1%', backgroundColor: colors.white, borderRadius: 10, ...commonStyles.shadowStyles, marginBottom: 10},
  textInput: {borderWidth: 1, borderColor: '#CDCDCD', borderRadius: 4, height: vs(38), paddingLeft: ms(10), marginTop: vs(10)},
  textInputNote: {borderWidth: 1, borderColor: '#CDCDCD', borderRadius: 4, height: 110, paddingLeft: 10, marginTop: 10},
  rightButtonWrapper: {backgroundColor: '#FFECEA', borderWidth: 1, borderColor: '#EFEFEF', paddingVertical: '6%', borderRadius: 10, width: '31%', paddingLeft: 3, paddingRight: 3},
  text: {fontSize: fontSize.fs18, color: colors.black, fontFamily: fonts.BGFlameBold},
  guestDetailsWrapper: {marginHorizontal: '4%', marginVertical: '1%', backgroundColor: colors.white, borderRadius: 10, ...commonStyles.shadowStyles, marginBottom: 10},
  couponWrapper: {marginHorizontal: '4%', marginVertical: '1%', backgroundColor: colors.white, borderRadius: 10, ...commonStyles.shadowStyles, marginBottom: 10},
  textInputTitle: {
    color: colors.darkBlackText,
    fontFamily: fonts.BGFlame,
    fontSize: fontSize.fs15,
    marginTop: vs(5),
  },
});
