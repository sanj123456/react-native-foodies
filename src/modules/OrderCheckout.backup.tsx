import {NativeStackScreenProps} from '@react-navigation/native-stack';
import moment from 'moment';
import React, {useEffect, useReducer, useRef, useState} from 'react';
import {FlatList, Image, Pressable, SafeAreaView, ScrollView, StyleProp, StyleSheet, Text, TextInput, PressableProps, View, ViewStyle} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {TextInputMask} from 'react-native-masked-text';
import {API_Auth, API_Cards, API_Ordering, LoyaltyPointRule, ParamSignUp, StatusCodes} from '../api';
import {BillingParam, CreateOrderParams} from '../api/types';
import {CheckOutTaxItem, FavoriteAndUnfavoriteButton, FieldInput, LoyaltyBalance, PaymentFormOrDetails, PrimaryButton, Separator, WhiteBox} from '../components';
import {images} from '../core';
import {useUserAsyncStorage} from '../hooks';
import {dispatch, setInitUser, updateQty, useAppSelector} from '../redux';
import {setGateway} from '../redux/modules/gatewaySlice';
import {colors, commonStyles, fontSize, fonts, ms, vs} from '../styles';
import {CardState, Item, Payment} from '../types';
import {StackScreenRouteProp} from '../types/navigationTypes';
import {showDangerMessage} from '../utils/functions';
import {validateName} from '../utils/validator';
import {BagItem, Root} from './Bag';
import {menuStyles} from './Menu';
import {HIT_SLOP} from '../constants/constants';

type WhichForm = 'signin' | 'signup' | 'guestuser';
interface I<T> {
  onChangeValue: (data: T) => void;
  initData?: T;
}
interface FormDataSign {
  password: string;
  email: string;
}
interface FormDataSignUp {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface FormDataGuestUser {
  name: string;
  email: string;
  phone: string;
  note: string;
}

const OrderCheckout: React.FC<NativeStackScreenProps<StackScreenRouteProp, 'OrderCheckout'>> = ({navigation, route}) => {
  const [isSignIn, setIsSignIn] = useState<WhichForm>('signin');
  const {
    itemBag: {items, restaurantId, locationId, method, locationAddress},
    profile: {user},
  } = useAppSelector((state) => state);
  const [tip, setTip] = useState(0);
  const [reload, setReload] = useState(false);
  const [suggestedItems, setSuggesedItem] = useState([]);
  const [paymentType, setPaymentType] = useState<Payment>('New card');
  const [validCoupon, setValidCoupon] = useState<string | null>(null);

  const [stateCardState, dispatchToCardState] = useReducer((state: CardState, action: any) => ({...state, ...action}), {
    name: '',
    sCardHolderName: '',
    sCardNumber: '',
    sExpiryDate: '',
    sCVV: '',
  });

  const [loyaltyPointsState, dispatchLoyaltyPoints] = useReducer(
    (state: LoyaltyPointRule, action: any) => {
      if (action.loyaltyPoints) {
        return {...state, loyaltyPoints: action.loyaltyPoints};
      } else if (action.type === 'updateLoyaltyRules') {
        return {...state, loyaltyRules: action.loyaltyRules};
      }
      return state;
    },
    {
      loyaltyPoints: 0,
      loyaltyRules: {
        minSubtotal: 0,
        minRedeemableAmount: 0,
        pointsPerDollar: 0,
        visitThreshold: 0,
        rewardPoints: 0,
      },
    },
  );

  const [total, setTotal] = useState<Root>({
    subTotal: 0,
    tax: 0,
    taxDetails: [
      {
        name: 'General Tax',
        rate: 8,
        taxId: '63bc1483f75dfb94afecb532',
        amount: 0,
      },
      {
        amount: 0,
        name: 'Service',
        taxId: 'SERVICE_TAX_ID',
      },
    ],
    total: 0,
    serviceCharge: {
      amount: 0,
      name: 'Service',
      taxId: 'SERVICE_TAX_ID',
    },
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

  const getData = (): any => {
    return items.map((item: Item) => ({
      _id: item.id,
      qty: item.quantity,
      description: item.description,
      modifiers: item.toppings.map((topping: any) => {
        if (topping?.selectedSubModifier) {
          return {
            product_id: topping.id,
            product_name: topping?.product_name,
            price: topping.price,
            name: topping.name,
            qty: item.quantity,
            selectedModifier: {
              label: topping?.selectedSubModifier?.label,
              value: topping?.selectedSubModifier?.value,
            },
            selectedParentValue: {label: '', value: ''},
          };
        } else if (topping?.advancedPizzaOptions) {
          return {
            advancedPizzaOptions: topping?.advancedPizzaOptions,
            enableParentModifier: topping?.enableParentModifier,
            defaultSelected: topping?.defaultSelected,
            name: topping?.name,
            product_name: topping?.product_name,
            price: topping?.price,
            extraPrice: topping?.extraPrice,
            halfPrice: topping?.halfPrice,
            subModifiers: [],
            product_id: topping.id,
            selectedParentValue: {label: '', value: ''},
            selectedParentValues: [],
            side: String(topping?.side)?.toLowerCase(),
            size: String(topping?.size)?.toLowerCase(),
            sort: 0,
          };
        } else {
          return {
            product_id: topping.id,
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
    const billing_data: BillingParam = {
      data: getData(),
      tip: tip,
      coupon: coupon,
      points: '',
      location: locationId,
      restaurant: restaurantId,
      method: method,
      address: {},
      customer: user.customer._id,
    };
    API_Ordering.billing(billing_data).then((res) => {
      if (res.code === StatusCodes.SUCCESS) {
        setTotal(res.data);
      }
    });
    API_Ordering.suggested_items({
      method: method,
      restaurant: restaurantId,
      suggested: true,
    }).then((response) => {
      if (response.code === StatusCodes.SUCCESS) {
      }
    });

    API_Ordering.find_one_restaurant(restaurantId)
      .then((response) => {
        const {code, data} = response;

        if (StatusCodes.SUCCESS == code) {
          dispatchLoyaltyPoints({
            type: 'updateLoyaltyRules',
            loyaltyRules: data.loyalty,
          });
        }
      })
      .catch((e) => {});

    API_Auth.get_auth_profile()
      .then(({data}) => {
        dispatchLoyaltyPoints({loyaltyPoints: data?.customer?.loyaltyPoints});
      })
      .catch((e) => {});
  }, [reload]);

  useEffect(() => {
    const getGateway = async () => {
      try {
        const {data, code} = await API_Ordering.gateway(locationId);
        if (code === StatusCodes.SUCCESS) {
          dispatch(setGateway(data));
          if (data.gateway !== '') {
            const response = await API_Cards.find_all_cards_customer(data.gateway);
            if (response.code === StatusCodes.SUCCESS) {
            }
          }
        }
      } catch (error) {
        console.log({error});
      }
    };
    getGateway();
  }, []);

  const [coupon, setCoupon] = useState('');

  const handleSignIn = () => {
    setIsSignIn('signin');
  };

  const handleSignUp = () => {
    setIsSignIn('signup');
  };

  const handleSGuestuser = () => {
    setIsSignIn('guestuser');
  };
  const {accessToken} = useAppSelector((state) => state.profile);
  const [signData, setSigndata] = useState<FormDataSign>({
    email: '',
    password: '',
  });
  const [registerData, setRegisterdata] = useState<FormDataSignUp>({
    email: '',
    name: '',
    password: '',
    phone: '',
  });
  const [guestData, setGuestdata] = useState<FormDataGuestUser>({
    email: user.email,
    name: user.customer.name,
    phone: user.customer.phone.toString(),
    note: '',
  });

  const arr_spices = 'High,Low,Medium'.split(',').map((spice) => ({title: spice, isSelected: false}));

  const [arrSpices, setArrSpices] = useState(arr_spices);

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
              <Image
                style={{
                  height: 70,
                  width: 100,
                  borderTopLeftRadius: 10,
                }}
                source={{uri: item.imageUrl}}
              />
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={[menuStyles.locationTextAdd]}>$ {item.price}</Text>
              </View>
            </>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 90,
                backgroundColor: '#F1F1F1',
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
              }}>
              <Text style={[menuStyles.locationTextAdd]}>$ {item?.price}</Text>
            </View>
          )}
        </View>
        <View
          style={{
            flex: 1,
            marginHorizontal: ms(16),
          }}>
          <Text style={[menuStyles.locationTextAdd, {marginTop: vs(8)}]}>{item?.name}</Text>
          <Text numberOfLines={2} style={[menuStyles.itemTxt, {marginTop: vs(8)}]}>
            {item?.description}
          </Text>
        </View>
      </Pressable>
    );
  };

  const renderForm = (isSignIn: WhichForm) => {
    switch (isSignIn) {
      case 'signin':
        return (
          <View
            style={{
              paddingHorizontal: '3%',
              marginVertical: '2%',
              paddingBottom: 10,
            }}>
            <Text
              style={{
                color: colors.darkBlackText,
                fontFamily: fonts.BGFlameBold,
                fontSize: fontSize.fs15,
              }}>
              Sign in
            </Text>
            <SignIn onChangeValue={setSigndata} />
          </View>
        );
      case 'signup':
        return (
          <View
            style={{
              paddingHorizontal: '3%',
              marginVertical: '2%',
              paddingBottom: 10,
            }}>
            <Text
              style={{
                color: colors.darkBlackText,
                fontFamily: fonts.BGFlameBold,
                fontSize: fontSize.fs15,
              }}>
              Register
            </Text>
            <SignUp onChangeValue={setRegisterdata} />
          </View>
        );
      case 'guestuser':
        return (
          <View
            style={{
              paddingHorizontal: '3%',
              marginVertical: '2%',
              paddingBottom: 10,
            }}>
            <Text
              style={{
                color: colors.darkBlackText,
                fontFamily: fonts.BGFlameBold,
                fontSize: fontSize.fs15,
              }}>
              Guest Details
            </Text>
            <GuestUser onChangeValue={setGuestdata} />
          </View>
        );
    }
  };

  return (
    <View style={commonStyles.mainView}>
      <SafeAreaView style={{backgroundColor: colors.white}} />
      <FavoriteAndUnfavoriteButton />
      <View style={orderCheckoutStyles.headerView}>
        <View style={orderCheckoutStyles.leftViewMain}>
          <Pressable style={orderCheckoutStyles.leftView} hitSlop={HIT_SLOP} onPress={() => navigation.goBack()}>
            <Image style={orderCheckoutStyles.backIconStyles} source={images.icHeaderBack} />
          </Pressable>
        </View>
        <View style={orderCheckoutStyles.centerView}>
          <View style={{}}>
            <Text style={orderCheckoutStyles.txt}>Checkout</Text>
          </View>
        </View>
        <View style={[orderCheckoutStyles.rightViewMain]}></View>
      </View>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView contentContainerStyle={{}} showsVerticalScrollIndicator={false}>
          {accessToken === '' ? (
            <View style={[orderCheckoutStyles.guestDetailsWrapper]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 20,
                  paddingHorizontal: '3%',
                  marginVertical: '4%',
                }}>
                <SelectableButton title={'Sign in'} selected={isSignIn === 'signin'} onPress={handleSignIn} />

                <SelectableButton title={'Register'} selected={isSignIn === 'signup'} onPress={handleSignUp} />
                <SelectableButton title={'Guest'} selected={isSignIn === 'guestuser'} onPress={handleSGuestuser} />
              </View>
              {renderForm(isSignIn)}
            </View>
          ) : (
            <View style={{marginHorizontal: '4%'}}>
              <Text style={styles.sectionHeader}>Personal Details</Text>
              <GuestUser onChangeValue={setGuestdata} initData={guestData} />
            </View>
          )}
          <AddATip
            tip={total.total}
            onTipValue={(tip) => {
              setTip(tip);
            }}
          />
          <View style={[orderCheckoutStyles.couponWrapper]}>
            <View style={{paddingHorizontal: '3%', marginVertical: '4%'}}>
              <Text style={styles.sectionHeader}>
                Apply Coupon{' '}
                <Text
                  style={[
                    styles.sectionHeader,
                    {
                      fontFamily: fonts.BGFlame,
                      fontSize: fontSize.fs11,
                    },
                  ]}>
                  (Have a coupon code?)
                </Text>
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  borderWidth: 1,
                  marginTop: 10,
                  borderColor: '#CDCDCD',
                  borderRadius: 4,
                  borderStyle: 'dashed',
                  height: vs(40),
                }}>
                <FieldInput inputViewStyles={orderCheckoutStyles.textInputCoupon} placeholder="Enter a Coupon Code" contentContainerStyle={{flex: 1}} onChangeText={setCoupon} value={coupon} />
                <Pressable
                  onPress={() => {
                    if (coupon.length) {
                      API_Ordering.couponValidCheck({
                        coupon: coupon,
                        location: locationId,
                        items: getData(),
                        method: method,
                        loggedIn: false,
                        customer: null,
                      })
                        .then(({data}) => {
                          setValidCoupon(coupon);

                          showMessage({
                            type: 'success',
                            message: data.message,
                          });
                        })
                        .catch((e) => {
                          setCoupon('');
                          setValidCoupon(null);
                          showMessage({
                            type: 'danger',
                            message: e.message,
                          });
                        });
                    } else {
                      showMessage({
                        type: 'danger',
                        message: 'Please enter coupon code.',
                      });
                    }
                  }}
                  style={{
                    backgroundColor: colors.headerbg,
                    justifyContent: 'center',
                    alignItems: 'center',

                    borderRadius: 10,
                    aspectRatio: 1.5,
                  }}>
                  <Text
                    style={{
                      fontSize: fontSize.fs16,
                      fontFamily: fonts.BGFlameBold,
                      color: '#ffffff',
                    }}>
                    Apply
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
          {accessToken !== '' && <LoyaltyBalance headerStyle={styles.sectionHeader} loyaltyState={loyaltyPointsState} onUse={() => {}} subTotal={total.subTotal} />}
          <WhiteBox style={{marginTop: 15}}>
            <Text style={styles.sectionHeader}>Order Details</Text>
            <OrderDetailsItem title="METHOD" val={method} />
            <OrderDetailsItem title="LOCATION" val={locationAddress} />
            <OrderDetailsItem title="TIME" val={`${moment().format('MMMM DD, YYYY HH:mm A')}\n Today - ASAP`} />
          </WhiteBox>
          <WhiteBox style={{marginTop: 15}}>
            <Text style={styles.sectionHeader}>Order Summary</Text>
            <FlatList
              renderItem={(props) => (
                <BagItem
                  {...props}
                  onChangeValueOnItemCounter={(newValue: number) => {
                    dispatch(
                      updateQty({
                        index: props.index,
                        quantity: newValue,
                      }),
                    );
                    setReload(!reload);
                  }}
                />
              )}
              data={items}
              ItemSeparatorComponent={() => <Separator />}
            />
            <FlatList
              data={[
                {title: 'Sub Total', price: total.subTotal},
                {title: 'Tax', price: total.tax},
                {title: 'Tip (15%)', price: total.tip},
                {title: 'Online Ordering', price: total.orderFee},
                {title: 'Coupon Discount', price: total.discount},
                {title: 'Total', price: total.total},
              ]}
              renderItem={({item, index}) => <CheckOutTaxItem item={item} />}
            />
          </WhiteBox>
          <WhiteBox style={{marginTop: 15}}>
            <Text style={styles.sectionHeader}>Add a note</Text>
            <TextInput placeholder="Note" style={[styles.txtNote]} />
          </WhiteBox>
          <WhiteBox style={{marginTop: 15}}>
            <Text style={styles.sectionHeader}>Spices</Text>
            <View style={{rowGap: vs(6), marginTop: vs(6)}}>
              {arrSpices.map((spice_option, index) => {
                return (
                  <Pressable
                    onPress={() => {
                      setArrSpices((oldArrSpices) => {
                        return oldArrSpices.map((x, xi) => {
                          if (index === xi) {
                            return {
                              ...x,
                              isSelected: !x.isSelected,
                            };
                          }
                          return x;
                        });
                      });
                    }}
                    style={{flexDirection: 'row', columnGap: ms(6)}}>
                    <Image source={spice_option.isSelected ? images.icCheck : images.icUncheck} />
                    <Text>{spice_option.title}</Text>
                  </Pressable>
                );
              })}
            </View>
          </WhiteBox>
          {0 < suggestedItems.length ? (
            <WhiteBox style={{marginTop: 15}}>
              <Text style={styles.sectionHeader}>Suggested Products</Text>
              <FlatList data={suggestedItems} renderItem={(props) => <RenderItem {...props} />} />
            </WhiteBox>
          ) : null}
          <WhiteBox style={{marginTop: 15}}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                columnGap: ms(5),
              }}>
              <SelectableButton
                title={`Pay there`}
                onPress={() => {
                  setPaymentType('Pay there');
                }}
                selected={paymentType === 'Pay there'}
                style={[
                  {
                    height: vs(42),
                    flex: 1,
                  },
                  commonStyles.removeMargin,
                  commonStyles.removePadding,
                  commonStyles.center,
                ]}
              />
              <SelectableButton
                title={`New card`}
                onPress={() => {
                  setPaymentType('New card');
                }}
                selected={paymentType === 'New card'}
                style={[
                  {
                    height: vs(42),
                    flex: 1,
                  },
                  commonStyles.removeMargin,
                  commonStyles.removePadding,
                  commonStyles.center,
                ]}
              />
              <SelectableButton
                title={`Saved Card`}
                onPress={() => {
                  setPaymentType('Saved Card');
                }}
                selected={paymentType === 'Saved Card'}
                style={[
                  {
                    height: vs(42),
                    flex: 1,
                  },
                  commonStyles.removeMargin,
                  commonStyles.removePadding,
                  commonStyles.center,
                ]}
              />
            </View>
            <PaymentFormOrDetails
              selectedPayType={paymentType}
              onDataChange={(data: any) => {
                if (paymentType === 'New card') {
                  dispatchToCardState(data);
                }
              }}
            />
          </WhiteBox>
          <PrimaryButton
            title="Place Order"
            bgColor={colors.headerbg}
            style={{
              marginHorizontal: ms(16),
              width: undefined,
              marginVertical: vs(12),
              marginBottom: vs(8),
              marginTop: undefined,
            }}
            onPress={() => {
              let isUserLogedIn = false;
              const validateGuestInput = () => {
                if (isSignIn !== 'guestuser') {
                  showDangerMessage('Please enter your guest details or do login');
                  return false;
                }

                const {name, email, phone} = guestData;

                if (!validateName(name)) {
                  showDangerMessage('Please enter your name.');
                  return false;
                }

                var emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                if (!emailRegex.test(email)) {
                  showDangerMessage('Please enter a valid email address.');
                  return false;
                }

                var phoneRegex = /^\d{10}$/;
                if (!phoneRegex.test(phone)) {
                  showDangerMessage('Please enter a valid 10-digit phone number.');
                  return false;
                }

                return true;
              };

              if (accessToken) {
                isUserLogedIn = true;
              }

              if (!isUserLogedIn && !validateGuestInput()) {
                return;
              }

              const getPaymentTypeParam = (
                _t: Payment,
              ): {
                paymentMethod: CreateOrderParams['paymentMethod'];
                orderTiming: CreateOrderParams['orderTiming'];
                selected_payment_method?: CreateOrderParams['selected_payment_method'];
              } => {
                switch (_t) {
                  case 'Pay there':
                    return {
                      paymentMethod: 'pay-there',
                      orderTiming: 'later',
                    };
                  case 'New card':
                    return {
                      paymentMethod: 'new-card',
                      orderTiming: 'now',
                      selected_payment_method: {},
                    };
                  case 'Saved Card':
                    return {
                      paymentMethod: 'new-card',
                      orderTiming: 'now',
                      selected_payment_method: {},
                    };
                }
              };

              const params = {
                customer: isUserLogedIn ? user.customer._id : '',
                deliveryAddress: method === 'pickup' ? null : locationAddress,
                deliveryFee: total.deliveryFee,
                guest: isUserLogedIn ? {} : guestData,
                items: getData(),
                location: locationId,
                loyalty: 0,
                loyaltyDiscount: total.loyaltyDiscount,
                method: method,
                moreInfoData: {},
                orderFee: total.orderFee,
                restaurant: restaurantId,
                scheduledOn: '',
                taxDetails: {
                  appliedCoupon: validCoupon,
                  serviceCharge: total.serviceCharge,
                  taxDetails: total.taxDetails,
                },
                tip: tip,
                ...getPaymentTypeParam(paymentType),
              };

              API_Ordering.create_a_order(params)
                .then((response) => {
                  const {data, code} = response;
                  if (code === StatusCodes.SUCCESS) {
                    showMessage({
                      message: 'Order placed successfully',
                      type: 'success',
                    });

                    setTimeout(() => {
                      navigation.navigate('OrderSuccess', data);
                    }, 1850);
                  }
                })
                .catch((e) => {
                  showDangerMessage(e?.message);
                });
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default OrderCheckout;

const styles = StyleSheet.create({
  sectionHeader: {
    color: '#777676',
    fontFamily: fonts.BGFlameBold,
    fontSize: fontSize.fs15,
  },
  txtNote: {
    fontFamily: fonts.BGFlame,
    fontSize: fontSize.fs13,
    marginTop: vs(5),
    height: vs(40),
    borderRadius: ms(12),
    paddingLeft: ms(12),
    borderWidth: StyleSheet.hairlineWidth,
  },
  keyOrderDetailsItem: {
    fontSize: fontSize.fs14,
    fontFamily: fonts.BGFlameBold,
    color: '#777676',
  },
  valOrderDetailsItem: {
    fontFamily: fonts.BGFlameBold,
    fontSize: fontSize.fs13,
    textAlign: 'right',
    color: '#343434',
  },
  linkBtn: {
    marginVertical: vs(10),
  },
  linkBtnText: {
    color: colors.headerbg,
    fontSize: fontSize.fs16,
    fontFamily: fonts.BGFlame,
  },
});
const SignIn = ({onChangeValue}: I<FormDataSign>) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const {setUserStorage, storageUser} = useUserAsyncStorage();
  const {restaurantId} = useAppSelector((state) => state.itemBag);

  useEffect(() => {
    onChangeValue({password, email});
  }, [password, email]);
  const isAllValidLogin = () => {
    if (email?.length === 0) {
      showMessage({
        message: 'Email is required',
        type: 'danger',
      });
      return false;
    } else if (password?.length === 0) {
      showMessage({
        message: 'Password is required',
        type: 'danger',
      });

      return false;
    }
    return true;
  };

  return (
    <>
      <FieldInput inputViewStyles={orderCheckoutStyles.textInput} placeholder="Email Address" onChangeText={setEmail} value={email} keyboardType="email-address" />
      <FieldInput inputViewStyles={orderCheckoutStyles.textInput} placeholder="Password" type="password" onChangeText={setPassword} value={password} />
      <Pressable
        onPress={() => {
          if (isAllValidLogin()) {
            API_Auth.login({
              email: email,
              password: password,
            })
              .then(({data}) => {
                const redux_user = {
                  user: data.user,
                  accessToken: data?.accessToken,
                };
                setUserStorage(redux_user);
                dispatch(setInitUser(redux_user));
              })
              .catch((e) => {
                showDangerMessage(e.message);
              });
          }
        }}
        style={{
          borderRadius: 8,
          paddingVertical: vs(10),
          paddingHorizontal: ms(16),
          backgroundColor: colors.headerbg,
          marginTop: vs(6),
          justifyContent: 'center',
          alignItems: 'center',
          width: '50%',
        }}>
        <Text
          style={{
            color: colors.white,
            fontSize: fontSize.fs16,
            fontFamily: fonts.BGFlameBold,
          }}>
          Sign in
        </Text>
      </Pressable>
    </>
  );
};

const SignUp = ({onChangeValue}: I<FormDataSignUp>) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const {setUserStorage, storageUser} = useUserAsyncStorage();

  const isAllValidSignUp = () => {
    if (name.length === 0) {
      showMessage({
        message: 'Name is required',
        type: 'danger',
      });
      return false;
    } else if (email.length === 0) {
      showMessage({
        message: 'Email is required',
        type: 'danger',
      });
      return false;
    } else if (phone.length === 0) {
      showMessage({
        message: 'Phone number is required',
        type: 'danger',
      });
      return false;
    } else if (password.length === 0) {
      showMessage({
        message: 'Password is required',
        type: 'danger',
      });

      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    const formData = {name, email, phone, password};
    onChangeValue(formData);
  }, [name, email, phone, password]);

  return (
    <>
      <FieldInput inputViewStyles={orderCheckoutStyles.textInput} placeholder="Name" onChangeText={setName} value={name} />
      <FieldInput inputViewStyles={orderCheckoutStyles.textInput} placeholder="Email Address" onChangeText={setEmail} value={email} keyboardType="email-address" />
      <FieldInput inputViewStyles={orderCheckoutStyles.textInput} placeholder="Phone" onChangeText={setPhone} value={phone} keyboardType="phone-pad" maxLength={10} />
      <FieldInput inputViewStyles={orderCheckoutStyles.textInput} placeholder="Password" type="password" onChangeText={setPassword} value={password} />
      <PrimaryButton
        title="Register"
        style={{
          width: '50%',
        }}
        onPress={() => {
          if (isAllValidSignUp()) {
            let paramSignUp: Partial<ParamSignUp> = {
              name: name,
              email: email,
              phone: phone,
              password: password,
              status: 'active',
            };
            API_Auth.sign_up(paramSignUp)
              .then((res) => {
                const {data, code} = res;

                if (StatusCodes.SUCCESS === code) {
                  const customer = {
                    _id: data?._doc?.userId,
                    userId: data?._doc?.userId,
                    email: data?.user?.email,
                    role: data?.user?.role,
                    status: data?.user?.status,
                    address: data?._doc?.address,
                    customerGroup: data?._doc?.customerGroup,
                    name: data?._doc?.name,
                    restaurants: data?._doc?.restaurants,
                    paymentMethods: data?._doc?.paymentMethods,
                    loyaltyPoints: data?._doc?.loyaltyPoints,
                    smsForCouponAndInfo: state?.b_reg_smsForCouponAndInfo,
                    emailForCouponAndInfo: state?.b_reg_emailForCouponAndInfo,
                    phone: state?.txt_reg_phone,
                    birthday: '01/01',
                    anniversary: '01/01',
                  };
                  const user = {
                    _id: data?.user?._id,
                    email: data?.user?.email,
                    password: data?.user?.password,
                    status: data?.user?.status,
                    role: data?.user?.role,

                    permissions: data?.user?.permissions,
                    authProvider: data?.user?.authProvider,
                    restaurant: 'restaurant',
                    customer: customer,
                  };
                  showMessage({
                    type: 'success',
                    message: 'Registered Successfully',
                  });

                  const redux_user = {
                    user: user,
                    accessToken: data?.accessToken,
                  };
                  setUserStorage(redux_user);

                  dispatch(setInitUser(redux_user));
                }
              })
              .catch((e) => {
                showMessage({
                  type: 'danger',
                  message: e?.message,
                });
              })
              .finally(() => {});
          }
        }}
        bgColor={colors.headerbg}
        addMargin={8}
      />
    </>
  );
};

const GuestUser = ({onChangeValue, initData}: I<FormDataGuestUser>) => {
  const [name, setName] = useState(initData?.name ?? '');
  const [email, setEmail] = useState(initData?.email ?? '');
  const [phone, setPhone] = useState(initData?.phone ?? '');
  const [note, setNote] = useState(initData?.note ?? '');

  useEffect(() => {
    if (initData?.name) {
      setName(initData?.name);
    }
    if (initData?.email) {
      setEmail(initData?.email);
    }
    if (initData?.phone) {
      setPhone(initData?.phone);
    }
    if (initData?.note) {
      setNote(initData?.note);
    }
  }, []);

  useEffect(() => {
    const formData = {name, email, phone, note};
    onChangeValue(formData);
  }, [name, email, phone, note]);

  return (
    <View style={{}}>
      <FieldInput inputViewStyles={orderCheckoutStyles.textInput} placeholder="Full Name" onChangeText={setName} value={name} />
      <FieldInput inputViewStyles={orderCheckoutStyles.textInput} placeholder="Email Address" onChangeText={setEmail} value={email} />
      <FieldInput inputViewStyles={orderCheckoutStyles.textInput} placeholder="Phone Number" onChangeText={setPhone} value={phone} />
      <FieldInput inputViewStyles={orderCheckoutStyles.textInputNote} placeholder="Add a Note" onChangeText={setNote} value={note} />
    </View>
  );
};

const AddATip = ({tip = 0, onTipValue = (tip: number) => {}}: {tip: number; onTipValue: (tip: number) => void}) => {
  const tips = [15, 18, 20];
  const [selectedTip, setNewTipIndex] = useState(-1);
  const [advancedTip, setAdvancedTip] = useState('');
  const moneyInput = useRef<TextInputMask>(null);
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    let _currentTip = 0;
    if (selectedTip < tips.length) {
      const percentage = (v, p) => {
        return (v * p) / 100;
      };

      _currentTip = percentage(tip, tips[selectedTip]);
    } else {
      _currentTip = 1;
    }
    onTipValue(_currentTip);
    setCurrentTip(_currentTip);
  }, [advancedTip, selectedTip]);

  return (
    <View style={[orderCheckoutStyles.couponWrapper]}>
      <View style={{paddingHorizontal: '3%', marginVertical: '4%'}}>
        <Text style={styles.sectionHeader}>Tip</Text>
        <View
          style={{
            flexDirection: 'row',
            columnGap: ms(5),
            marginTop: vs(8),
          }}>
          {tips.map((tip, index) => {
            return (
              <SelectableButton
                title={`${tip}%`}
                onPress={() => {
                  setNewTipIndex(index);
                }}
                selected={index === selectedTip}
                style={[
                  {
                    height: vs(42),
                    flex: 1,
                  },
                  commonStyles.removeMargin,
                  commonStyles.removePadding,
                  commonStyles.center,
                ]}
              />
            );
          })}
          <SelectableButton
            title={`other`}
            onPress={() => {
              setNewTipIndex(tips.length);
            }}
            selected={tips.length === selectedTip}
            style={[
              {
                height: vs(42),
                flex: 1,
              },
              commonStyles.removeMargin,
              commonStyles.removePadding,
              commonStyles.center,
            ]}
          />
        </View>
        {tips.length === selectedTip && (
          <TextInputMask
            type={'money'}
            options={{
              precision: 4,
              unit: '$',
              delimiter: '',
              separator: '',
            }}
            ref={moneyInput}
            onChangeText={(text, next) => {
              setAdvancedTip(text);
            }}
            style={{
              fontFamily: fonts.BGFlame,
              fontSize: fontSize.fs13,
              borderWidth: 1,
              borderColor: '#CDCDCD',
              borderRadius: 4,
              height: vs(42),
              paddingLeft: ms(10),
              marginTop: vs(11),
            }}
          />
        )}
      </View>
    </View>
  );
};

const SelectableButton = ({selected, onPress, title, style}: {selected: boolean; onPress: PressableProps['onPress']; title: string; style?: StyleProp<ViewStyle>}) => {
  return (
    <Pressable
      style={[
        orderCheckoutStyles.rightButtonWrapper,
        selected && {
          backgroundColor: colors.headerbg,
        },
        style,
      ]}
      onPress={onPress}>
      <Text
        style={{
          color: selected ? colors.white : colors.headerbg,
          textAlign: 'center',
          fontFamily: fonts.BGFlameBold,
          fontSize: fontSize.fs14,
        }}>
        {title}
      </Text>
    </Pressable>
  );
};

const OrderDetailsItem = ({title, val}: {title: string; val: any}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: vs(5),
      }}>
      <Text style={styles.keyOrderDetailsItem}>{title}</Text>
      <Text style={[styles.valOrderDetailsItem, {flex: 1, maxWidth: '70%'}]}>{val}</Text>
    </View>
  );
};
export const orderCheckoutStyles = StyleSheet.create({
  headerView: {
    height: 100,
    backgroundColor: colors.headerbg,

    flexDirection: 'row',
    marginBottom: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'space-between',
  },
  contentContainerStyle: {
    paddingHorizontal: 15,
    paddingVertical: 30,
  },
  leftViewMain: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftView: {
    height: 30,
    width: 30,
  },
  rightViewMain: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rightView: {
    height: 30,
    width: 30,
    marginRight: 50,
  },
  centerView: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    color: colors.white,
    fontSize: fontSize.fs20,
    fontFamily: fonts.BGFlameBold,
  },
  stepperActive: {
    height: 12,
    width: 34,
    borderRadius: 8,
    marginTop: 5,
  },
  stepperInActive: {
    height: 13,
    backgroundColor: '#F0F2F5',
    width: 38,
    borderRadius: 8,
    marginTop: 5,
  },
  headerRightText: {
    textAlign: 'center',
    paddingTop: 5,
    color: '#677A8E',
  },
  backIconStyles: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    alignSelf: 'center',
    top: 6,
  },
  rightIconStyles: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    alignSelf: 'center',
    top: 10,
  },
  deliveryTxt: {
    color: '#ABABAB',
    fontSize: fontSize.fs14,
    fontFamily: fonts.BGFlame,
  },
  locationText: {
    color: '#ABABAB',
    fontSize: fontSize.fs16,
    fontFamily: fonts.BGFlameBold,
  },
  locationTextAdd: {
    color: '#343434',
    fontSize: fontSize.fs14,
    fontWeight: '700',
  },
  itemTxt: {
    fontSize: fontSize.fs13,
    fontFamily: fonts.BGFlame,
    color: '#777676',
    fontWeight: '700',
  },
  addText: {
    color: colors.headerbg,
    fontSize: fontSize.fs16,
    fontFamily: fonts.BGFlameBold,
  },
  toppingsTxt: {
    fontSize: fontSize.fs15,
    fontFamily: fonts.BGFlame,
    color: colors.darkBlackText,
    fontWeight: '700',
  },
  locationIcon: {},
  locationWrapper: {
    marginHorizontal: '4%',
    marginVertical: '1%',
    backgroundColor: colors.white,
    borderRadius: 10,
    ...commonStyles.shadowStyles,
    paddingBottom: 10,
    marginTop: 10,
  },
  restaurantItemsWrapper: {
    marginHorizontal: '4%',
    marginVertical: '1%',
    backgroundColor: colors.white,
    borderRadius: 10,
    ...commonStyles.shadowStyles,
    marginBottom: 10,
  },
  searchIcon: {},
  filterIcon: {
    top: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#CDCDCD',
    borderRadius: 4,
    height: vs(38),
    paddingLeft: ms(10),
    marginTop: vs(10),
  },
  textInputCoupon: {},
  textInputNote: {
    borderWidth: 1,
    borderColor: '#CDCDCD',
    borderRadius: 4,
    height: 110,
    paddingLeft: 10,
    marginTop: 10,
  },
  icRestaurantStyle: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  buttonWrapper: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    ...commonStyles.shadowStyles,
    paddingVertical: '4%',
    borderRadius: 10,
    width: '48%',
  },
  buttonWrapper1: {
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 10,
    width: '31%',
    paddingLeft: 3,
    paddingRight: 3,
  },
  rightButtonWrapper: {
    backgroundColor: '#FFECEA',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    paddingVertical: '6%',
    borderRadius: 10,
    width: '31%',
    paddingLeft: 3,
    paddingRight: 3,
  },
  tipWrapper: {
    backgroundColor: colors.headerbg,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    ...commonStyles.shadowStyles,
    paddingVertical: '6%',
    borderRadius: 10,
    width: '20%',
  },
  tipWrapper1: {
    paddingVertical: '6%',
    borderRadius: 10,
    width: '15%',
  },
  dummyImage: {
    height: 240,
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  dropDownContainer: {
    backgroundColor: '#E3E3E3',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginTop: 8,
    borderRadius: 8,
    height: 60,
  },
  dropDownTitle: {
    fontFamily: fonts.BGFlame,
    fontSize: fontSize.fs14,
    lineHeight: 15,
    color: '#565656',
  },
  selectedText: {
    fontSize: fontSize.fs18,
    paddingLeft: 10,
    color: colors.black,
    fontFamily: fonts.BGFlameBold,
  },
  text: {
    fontSize: fontSize.fs18,
    color: colors.black,
    fontFamily: fonts.BGFlameBold,
  },
  dropDownIconStyle: {},
  editIcon: {},
  guestDetailsWrapper: {
    marginHorizontal: '4%',
    marginVertical: '1%',
    backgroundColor: colors.white,
    borderRadius: 10,
    ...commonStyles.shadowStyles,
    marginBottom: 10,
  },
  moreInfoWrapper: {
    marginHorizontal: '4%',
    marginVertical: '1%',
    backgroundColor: colors.white,
    borderRadius: 10,
    ...commonStyles.shadowStyles,
    marginBottom: 10,
  },
  rewardsWrapper: {
    marginHorizontal: '4%',
    marginVertical: '1%',
    backgroundColor: colors.white,
    borderRadius: 10,
    ...commonStyles.shadowStyles,
    marginBottom: 10,
  },
  couponWrapper: {
    marginHorizontal: '4%',
    marginVertical: '1%',
    backgroundColor: colors.white,
    borderRadius: 10,
    ...commonStyles.shadowStyles,
    marginBottom: 10,
  },
});
