import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useReducer, useRef, useState} from 'react';
import {FlatList, Image, Keyboard, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, Pressable, View} from 'react-native';
import {API_Auth, API_Ordering, ICategory, ParamSignUp, StatusCodes} from '../api';
import {BagButton, CheckInput, FieldInput, ListEmptyComponent, LocalDatePicker, PrimaryButton, withUser} from '../components';
import {images} from '../core';
import {useModal} from '../hooks';
import useUserAsyncStorage from '../hooks/useUserAsyncStorage';
import {dispatch} from '../redux';
import {useAppSelector} from '../redux/hooks';
import {setInitUser} from '../redux/modules/profileSlice';
import {colors, commonStyles, fontSize, fonts, ms, vs} from '../styles';
import {prettyPrintError} from '../utils/functions';
import {StackScreenRouteProp} from '../types/navigationTypes';
import {styles} from './OrderCheckout';
import OtpBox from './Otpbox';
import {ComponentMatrix, HIT_SLOP} from '../constants/constants';

interface StateLoginForm {
  email: string;
  password: string;
  fp_email: string;
  txt_reg_status: string;
  txt_reg_email: string;
  txt_reg_password: string;
  txt_reg_phone: string;
  txt_reg_name: string;
  txt_reg_role: string;
  txt_reg_loyalityPoints: string;
  txt_reg_restaurant: string;
  txt_reg_birthday: string;
  txt_reg_anniversary: string;
  b_reg_emailForCouponAndInfo: boolean;
  b_reg_smsForCouponAndInfo: boolean;
  b_reg_agreeTermsAndConditions: boolean;
  OPTpwd: string;
}
interface LoginFormAction {
  type:
    | 'changed_email'
    | 'changed_password'
    | 'changed_fp_email'
    | 'changed_txt_reg_status'
    | 'changed_txt_reg_email'
    | 'changed_txt_reg_password'
    | 'changed_txt_reg_phone'
    | 'changed_txt_reg_name'
    | 'changed_txt_reg_role'
    | 'changed_txt_reg_loyalityPoints'
    | 'changed_txt_reg_restaurant'
    | 'changed_txt_reg_birthday'
    | 'changed_txt_reg_anniversary'
    | 'changed_b_reg_emailForCouponAndInfo'
    | 'changed_b_reg_smsForCouponAndInfo'
    | 'changed_b_reg_agreeTermsAndConditions'
    | 'changed_verifyOTP_pwd';
  payload?: any;
}

const Menu: React.FC<NativeStackScreenProps<StackScreenRouteProp, 'Menu'>> = ({navigation, route}) => {
  const passedData = route?.params?.passedData;

  const [listCategories, setListCategories] = useState<Partial<ICategory>[]>([]);
  const [listMenuBasedOnCategory, setListMenuBasedOnCategory] = useState([]);
  const [selectedCatIndex, setSelectedCatIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [usuals, setUsuals] = useState([]);
  const [popularOfRestaurant, setPopularOfRestaurant] = useState([]);
  const [seconds, setSeconds] = useState(60);

  const {ModalContainer, toggleModal, visible, setVisible, messageRef: messageRefSigninModal} = useModal();
  const {ModalContainer: ModalPopularOfRestaurant, toggleModal: toggleModal2, visible: visible2, setVisible: setVisible2} = useModal();
  const {ModalContainer: LoginForm, toggleModal: toggleLoginModal, visible: visibleLoginForm, messageRef: messageRefLoginForm} = useModal();
  const {ModalContainer: ForgotPasswordForm, toggleModal: toggleForgotPasswordModal, visible: visibleForgotPasswordForm, messageRef: messageRefForgotPasswordForm} = useModal();
  const {ModalContainer: VarifyOtpForm, toggleModal: toggleVarifyOtpFormModal, visible: visibleVarifyOtpFormForm, messageRef: messageRefVarifyOtpFormForm} = useModal();
  const {ModalContainer: RegisterForm, toggleModal: toggleRegisterModal, visible: visibleRegisterForm, messageRef: messageRefRegisterForm} = useModal();
  const {setUserStorage} = useUserAsyncStorage();

  const reducer = (state: StateLoginForm, action: LoginFormAction) => {
    switch (action.type) {
      case 'changed_email':
        return {
          ...state,
          email: action.payload.email,
        };
      case 'changed_password':
        return {
          ...state,
          password: action.payload.password,
        };
      case 'changed_fp_email':
        return {
          ...state,

          fp_email: action.payload.email,
        };
      case 'changed_txt_reg_status':
        return {
          ...state,
          txt_reg_status: action.payload.txt_reg_status,
        };
      case 'changed_txt_reg_email':
        return {
          ...state,
          txt_reg_email: action.payload.txt_reg_email,
        };
      case 'changed_txt_reg_password':
        return {
          ...state,
          txt_reg_password: action.payload.txt_reg_password,
        };
      case 'changed_txt_reg_phone':
        return {
          ...state,
          txt_reg_phone: action.payload.txt_reg_phone,
        };
      case 'changed_txt_reg_name':
        return {
          ...state,
          txt_reg_name: action.payload.txt_reg_name,
        };
      case 'changed_txt_reg_role':
        return {
          ...state,
          txt_reg_role: action.payload.txt_reg_role,
        };
      case 'changed_txt_reg_loyalityPoints':
        return {
          ...state,
          txt_reg_loyalityPoints: action.payload.txt_reg_loyalityPoints,
        };
      case 'changed_txt_reg_restaurant':
        return {
          ...state,
          txt_reg_restaurant: action.payload.txt_reg_restaurant,
        };
      case 'changed_txt_reg_birthday':
        return {
          ...state,
          txt_reg_birthday: action.payload.txt_reg_birthday,
        };
      case 'changed_txt_reg_anniversary':
        return {
          ...state,
          txt_reg_anniversary: action.payload.txt_reg_anniversary,
        };
      case 'changed_b_reg_emailForCouponAndInfo':
        return {
          ...state,
          b_reg_emailForCouponAndInfo: !state.b_reg_emailForCouponAndInfo,
        };
      case 'changed_b_reg_smsForCouponAndInfo':
        return {
          ...state,
          b_reg_smsForCouponAndInfo: !state.b_reg_smsForCouponAndInfo,
        };
      case 'changed_b_reg_agreeTermsAndConditions':
        return {
          ...state,
          b_reg_agreeTermsAndConditions: !state.b_reg_agreeTermsAndConditions,
        };
      case 'changed_verifyOTP_pwd':
        return {
          ...state,
          OPTpwd: action.payload.OPTpwd,
        };
    }
  };

  const initialArg = {
    email: '',
    password: '',
    fp_email: '',
    txt_reg_status: '',
    txt_reg_email: '',
    txt_reg_password: '',
    txt_reg_phone: '',
    txt_reg_name: '',
    txt_reg_role: '',
    txt_reg_loyalityPoints: '',
    txt_reg_restaurant: '',
    txt_reg_birthday: '1/1',
    txt_reg_anniversary: '1/1',
    b_reg_emailForCouponAndInfo: true,
    b_reg_smsForCouponAndInfo: true,
    b_reg_agreeTermsAndConditions: true,
    OPTpwd: '',
  };
  const [state, dispatchLogin] = useReducer(reducer, initialArg);
  const handleInputChange = (text: string, type: LoginFormAction['type']) => {
    dispatchLogin({
      type: type,
      payload: {
        email: text,
        password: text,
        fp_email: text,
        txt_reg_status: text,
        txt_reg_email: text,
        txt_reg_password: text,
        txt_reg_phone: text,
        txt_reg_name: text,
        txt_reg_role: text,
        txt_reg_loyalityPoints: text,
        txt_reg_restaurant: text,
        txt_reg_birthday: text,
        txt_reg_anniversary: text,
        OPTpwd: text,
      },
    });
  };

  const {user, accessToken} = useAppSelector((state) => state.profile);
  const isUserLogedIn = user._id !== '';
  const box1 = useRef<any>(null);
  const box2 = useRef<any>(null);
  const box3 = useRef<any>(null);
  const box4 = useRef<any>(null);

  const reSetTimerOTP = useCallback(() => {
    setSeconds(60);
  }, []);

  const isAllValidLogin = () => {
    if (state.email?.length === 0) {
      messageRefLoginForm.current?.showMessage({
        message: 'Email is required',
        type: 'danger',
      });
      return false;
    } else if (state.password?.length === 0) {
      messageRefLoginForm.current?.showMessage({
        message: 'Password is required',
        type: 'danger',
      });

      return false;
    }
    return true;
  };

  const isAllValidSignUp = () => {
    if (state.txt_reg_name?.length === 0) {
      messageRefRegisterForm.current?.showMessage({
        message: 'Name is required',
        type: 'danger',
      });
      return false;
    } else if (state.txt_reg_email?.length === 0) {
      messageRefRegisterForm.current?.showMessage({
        message: 'Email is required',
        type: 'danger',
      });
      return false;
    } else if (state.txt_reg_phone?.length === 0) {
      messageRefRegisterForm.current?.showMessage({
        message: 'Phone number is required',
        type: 'danger',
      });
      return false;
    } else if (state.txt_reg_password?.length === 0) {
      messageRefRegisterForm.current?.showMessage({
        message: 'Password is required',
        type: 'danger',
      });
      return false;
    } else if (!state.b_reg_agreeTermsAndConditions) {
      messageRefRegisterForm.current?.showMessage({
        message: 'Please agree to our terms and conditions',
        type: 'danger',
      });
      return false;
    } else {
      return true;
    }
  };

  const isAllValidForgotPassowrd = () => {
    if (state.fp_email?.length === 0) {
      messageRefForgotPasswordForm.current?.showMessage({
        message: 'Email is required',
        type: 'danger',
      });

      return false;
    } else {
      return true;
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [seconds]);
  useEffect(() => {
    API_Ordering.restaurant_categories(passedData).then(({data}) => {
      setIsLoading(false);
      setListCategories(data.categories.map(({_id, categoryName}) => ({_id, categoryName})));

      if (data.categories.length) {
        setSelectedCatIndex(0);
      }
      API_Ordering.popular_of_restaurant({
        locationId: passedData?.locationId,
      })
        .then((res) => {
          const {code, data} = res;
          if (code === StatusCodes.SUCCESS) {
            setPopularOfRestaurant(data);
          }
        })
        .catch(prettyPrintError);
    });
  }, []);

  useEffect(() => {
    API_Ordering.customer_usuals({
      customerId: user.customer._id,
      restaurant: passedData?.restaurantId,
    })
      .then((res) => {
        const {code, data} = res;
        if (code === StatusCodes.SUCCESS) {
          setUsuals(data);
        }
      })
      .catch(prettyPrintError);
  }, [user._id]);

  useEffect(() => {
    if (selectedCatIndex >= 0) {
      const params = {
        ...passedData,
        categoryId: listCategories[selectedCatIndex]._id ?? '',
      };
      API_Ordering.restaurant_menu(params).then((res: any) => {
        setIsLoading(false);
        setListMenuBasedOnCategory(res.data.items);
      });
    }
  }, [selectedCatIndex]);

  const renderCategory = ({item, index}: any) => {
    return (
      <Pressable
        style={{
          marginHorizontal: 5,
        }}
        onPress={() => {
          setSelectedCatIndex(index);
        }}>
        {index === selectedCatIndex ? (
          <>
            <Text style={[menuStyles.locationText, {color: colors.headerbg}]}>{item?.categoryName}</Text>
            <View
              style={{
                height: 2,
                width: 15,
                backgroundColor: colors.headerbg,
                borderRadius: 2,
                marginTop: 10,
                alignSelf: 'center',
              }}
            />
          </>
        ) : (
          <Text
            style={{
              color: '#777676',
              fontSize: fontSize.fs16,
              fontFamily: fonts.BGFlame,
              fontWeight: 'normal',
            }}>
            {item?.categoryName}
          </Text>
        )}
      </Pressable>
    );
  };

  const renderItem = ({item, index, onPress = () => {}}: any) => {
    return (
      <Pressable
        style={[menuStyles.restaurantItemsWrapper, {marginTop: 24}]}
        onPress={() => {
          onPress?.();
          navigation.navigate('OrderDetailPage', {
            item_id: item._id,
            isCommingFromBag: false,
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
                  flex: 1,
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
              <Text style={[menuStyles.locationTextAdd]}>$ {item.price}</Text>
            </View>
          )}
        </View>
        <View
          style={{
            flex: 1,
            marginHorizontal: ComponentMatrix.HORIZONTAL_16,
          }}>
          <View style={{marginTop: vs(8), flexDirection: 'row'}}>
            <Text style={[menuStyles.locationTextAdd, {}]}>{item?.name}</Text>
            {item?.isCombo && (
              <View
                style={{
                  backgroundColor: '#fee6e0',
                  marginHorizontal: ms(5),
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: ms(5),
                  borderRadius: ms(5),
                }}>
                <Text
                  style={{
                    textTransform: 'uppercase',
                    fontSize: fontSize.fs11,
                    color: colors.CoralRed,
                    fontFamily: fonts.BGFlame,
                  }}>
                  Combo Meal
                </Text>
              </View>
            )}
          </View>
          <Text numberOfLines={2} style={[menuStyles.itemTxt, {marginTop: vs(8)}]}>
            {item?.description}
          </Text>
        </View>
      </Pressable>
    );
  };
  const addToFavorite = async () => {
    const customerId = user.customer._id;

    try {
      const response = await API_Ordering.add_fav_restaurant({
        customerId,
        restaurantId: passedData?.restaurantId,
      });

      if (response.code === StatusCodes.SUCCESS) {
      }
    } catch (error) {
      console.log({error});
    }
  };

  return (
    <View style={commonStyles.mainView}>
      <SafeAreaView style={{backgroundColor: colors.white}} />
      <View style={menuStyles.headerView}>
        <View style={menuStyles.leftViewMain}>
          <Pressable style={menuStyles.leftView} onPress={() => navigation.goBack()} hitSlop={HIT_SLOP}>
            <Image style={menuStyles.backIconStyles} source={images.icHeaderBack} />
          </Pressable>
        </View>
        <View style={menuStyles.centerView}>
          <Text style={menuStyles.txt}>Menu</Text>
        </View>
        <BagButton />
      </View>
      {isLoading === false ? (
        <SafeAreaView style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              width: '90%',
              alignSelf: 'center',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <Pressable
              onPress={() => {
                if (isUserLogedIn) {
                  toggleModal();
                } else {
                  toggleLoginModal();
                }
              }}
              style={[menuStyles.buttonWrapper, {}]}>
              <Text style={{color: colors.headerbg, textAlign: 'center'}}>My Usuals</Text>
            </Pressable>
            <Pressable onPress={toggleModal2} style={[menuStyles.buttonWrapper, {marginLeft: 0}]}>
              <Text style={{color: colors.headerbg, textAlign: 'center'}}>Popular</Text>
            </Pressable>
          </View>
          <FlatList
            horizontal
            data={listCategories}
            keyExtractor={(item: any, index) => item._id}
            renderItem={renderCategory}
            style={{
              marginTop: vs(15),
              flexGrow: 0,
            }}
            contentContainerStyle={{
              paddingHorizontal: vs(18),
              columnGap: vs(18),
            }}
          />
          <FlatList
            data={listMenuBasedOnCategory}
            renderItem={renderItem}
            contentContainerStyle={{
              flexGrow: 1,
            }}
            ListEmptyComponent={
              <ListEmptyComponent
                viewStyle={{
                  flexGrow: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                Currently no data here
              </ListEmptyComponent>
            }
          />
          {/* <AddToItemButtonWIthCheckout onPress={() => {}} /> */}
        </SafeAreaView>
      ) : null}
      <ModalContainer
        contentContainerStyle={{
          marginHorizontal: 0,
        }}
        visible={visible}
        onClose={() => {
          setVisible(!visible);
        }}
        messageRef={messageRefSigninModal}>
        <FlatList data={usuals} renderItem={renderItem} ListEmptyComponent={<ListEmptyComponent>{'No usuals found'}</ListEmptyComponent>} />
      </ModalContainer>

      <ModalPopularOfRestaurant
        contentContainerStyle={{
          marginHorizontal: 0,
        }}
        visible={visible2}
        onClose={() => {
          setVisible2(!visible2);
        }}>
        <FlatList
          data={popularOfRestaurant}
          renderItem={(props) =>
            renderItem({
              ...props,
              onPress: () => {
                setVisible2(false);
              },
            })
          }
          ListEmptyComponent={<ListEmptyComponent>{'No popular items found'}</ListEmptyComponent>}
        />
      </ModalPopularOfRestaurant>

      <LoginForm
        visible={visibleLoginForm}
        onClose={toggleLoginModal}
        contentContainerStyle={{
          marginHorizontal: 0,
        }}
        messageRef={messageRefLoginForm}>
        <Text
          style={{
            color: colors.darkBlackText,
            fontFamily: fonts.BGFlameBold,
            fontSize: fontSize.fs20,
          }}>
          Sign In
        </Text>
        <FieldInput
          inputViewStyles={styles.textInput}
          placeholder="Email Address"
          onChangeText={(text) => {
            handleInputChange(text, 'changed_email');
          }}
          value={state.email}
          keyboardType="email-address"
        />
        <FieldInput
          inputViewStyles={styles.textInput}
          placeholder="Password"
          type="password"
          onChangeText={(text) => {
            handleInputChange(text, 'changed_password');
          }}
          value={state.password}
        />
        <Pressable
          onPress={() => {
            toggleLoginModal();
            toggleForgotPasswordModal();
          }}
          style={[styles.linkBtn, {alignItems: 'flex-end', alignSelf: 'flex-end'}]}>
          <Text style={styles.linkBtnText}>Forgot Password ?</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            if (isAllValidLogin()) {
              API_Auth.login({
                email: state.email,
                password: state.password,
                restaurant: passedData?.restaurantId,
              })
                .then(({data}) => {
                  const redux_user = {
                    user: data.user,
                    accessToken: data?.accessToken,
                  };
                  setUserStorage(redux_user);
                  dispatch(setInitUser(redux_user));
                  messageRefLoginForm?.current?.showMessage({
                    type: 'success',
                    message: 'Sign in successfully',
                  });
                  setTimeout(() => {
                    toggleLoginModal();
                  }, 1850);
                })
                .catch((e) => {
                  messageRefLoginForm.current?.showMessage({
                    message: e?.message,
                    type: 'danger',
                  });
                });
            }
          }}
          style={{
            borderRadius: 8,
            paddingVertical: vs(10),
            paddingHorizontal: ms(16),
            alignSelf: 'center',
            backgroundColor: colors.headerbg,
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
        <Pressable
          onPress={() => {
            toggleLoginModal();
            toggleRegisterModal();
          }}
          style={[styles.linkBtn, {alignItems: 'center'}]}>
          <Text style={styles.linkBtnText}>Create Account</Text>
        </Pressable>
      </LoginForm>

      <ForgotPasswordForm
        visible={visibleForgotPasswordForm}
        onClose={toggleForgotPasswordModal}
        contentContainerStyle={{
          marginHorizontal: 0,
        }}
        messageRef={messageRefForgotPasswordForm}>
        <Text
          style={{
            color: colors.darkBlackText,
            fontFamily: fonts.BGFlameBold,
            fontSize: fontSize.fs20,
          }}>
          Forgot Password?
        </Text>
        <Text style={styles.subTitleText}>Enter the e-mail address associated with your account. If an account exists, we will send a reset password email.</Text>
        <FieldInput
          inputViewStyles={styles.textInput}
          placeholder="Email"
          onChangeText={(text) => {
            handleInputChange(text, 'changed_fp_email');
          }}
          value={state.fp_email}
          keyboardType="email-address"
        />
        <Pressable
          style={{
            borderRadius: 8,
            marginTop: vs(10),
            paddingVertical: vs(10),
            paddingHorizontal: ms(16),
            alignSelf: 'center',
            backgroundColor: colors.headerbg,
          }}
          onPress={() => {
            if (isAllValidForgotPassowrd()) {
              API_Auth.reset_password({
                email: state.fp_email,
              })
                .then((res) => {
                  const {code, data} = res;
                  if (code === StatusCodes.SUCCESS) {
                    toggleForgotPasswordModal();
                    toggleVarifyOtpFormModal();
                  }
                })
                .catch((e) => {
                  messageRefForgotPasswordForm.current?.showMessage({
                    message: e?.message,
                    type: 'danger',
                  });
                });
            }
          }}>
          <Text
            style={{
              color: colors.white,
              fontSize: fontSize.fs16,
              fontFamily: fonts.BGFlameBold,
            }}>
            CONTINUE
          </Text>
        </Pressable>
      </ForgotPasswordForm>

      <RegisterForm
        visible={visibleRegisterForm}
        onClose={toggleRegisterModal}
        contentContainerStyle={{
          marginHorizontal: 0,
        }}
        messageRef={messageRefRegisterForm}>
        <Text
          style={{
            color: colors.darkBlackText,
            fontFamily: fonts.BGFlameBold,
            fontSize: fontSize.fs20,
          }}>
          Register
        </Text>
        <ScrollView>
          <FieldInput
            inputViewStyles={styles.textInput}
            placeholder="Name"
            onChangeText={(text) => {
              handleInputChange(text, 'changed_txt_reg_name');
            }}
            value={state.txt_reg_name}
          />
          <FieldInput
            inputViewStyles={styles.textInput}
            placeholder="Email Address"
            onChangeText={(text) => {
              handleInputChange(text, 'changed_txt_reg_email');
            }}
            value={state.txt_reg_email}
            keyboardType="email-address"
          />
          <FieldInput
            inputViewStyles={styles.textInput}
            placeholder="Phone"
            onChangeText={(text) => {
              handleInputChange(text, 'changed_txt_reg_phone');
            }}
            value={state.txt_reg_phone}
            keyboardType="phone-pad"
            maxLength={10}
          />
          <FieldInput
            inputViewStyles={styles.textInput}
            placeholder="Password"
            type="password"
            onChangeText={(text) => {
              handleInputChange(text, 'changed_txt_reg_password');
            }}
            value={state.txt_reg_password}
          />

          <LocalDatePicker
            onChangeValue={(date) => {
              handleInputChange(date, 'changed_txt_reg_birthday');
            }}
            title={'Birthday'}
          />
          <LocalDatePicker
            onChangeValue={(date) => {
              handleInputChange(date, 'changed_txt_reg_anniversary');
            }}
            title={'Anniversary'}
          />
          <CheckInput
            title={'Sign up for SMS coupons and info'}
            onChangeValue={(nextIsChecked: boolean) => {
              dispatch({type: 'changed_b_reg_smsForCouponAndInfo'});
            }}
            initValue={state.b_reg_smsForCouponAndInfo}
          />
          <CheckInput
            title={'Sign up for Email coupons and info'}
            onChangeValue={(nextIsChecked: boolean) => {
              dispatch({type: 'changed_b_reg_emailForCouponAndInfo'});
            }}
            initValue={state.b_reg_emailForCouponAndInfo}
          />
          <CheckInput
            title={'I agree to terms and conditions'}
            onChangeValue={(nextIsChecked: boolean) => {
              dispatch({type: 'changed_b_reg_agreeTermsAndConditions'});
            }}
            initValue={state.b_reg_agreeTermsAndConditions}
          />
          <PrimaryButton
            title="Register"
            onPress={() => {
              if (isAllValidSignUp()) {
                let paramSignUp: ParamSignUp = {
                  email: state.txt_reg_email,
                  name: state.txt_reg_name,
                  password: state.txt_reg_password,
                  status: 'active',
                  phone: state.txt_reg_phone,
                  restaurant: passedData?.restaurantId,

                  emailForCouponAndInfo: state.b_reg_emailForCouponAndInfo,
                  smsForCouponAndInfo: state.b_reg_smsForCouponAndInfo,
                  agreeTermsAndConditions: state.b_reg_agreeTermsAndConditions,
                  role: 'customer',
                  loyalityPoints: 0,
                  birthday: '01/01',
                  anniversary: '01/01',
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
                      messageRefRegisterForm.current?.showMessage({
                        type: 'success',
                        message: 'Registered Successfully',
                      });

                      const redux_user = {
                        user: user,
                        accessToken: data?.accessToken,
                      };
                      setUserStorage(redux_user);

                      dispatch(setInitUser(redux_user));
                      setTimeout(() => {
                        toggleRegisterModal();
                      }, 1850);
                    }
                  })
                  .catch((e) => {
                    messageRefRegisterForm.current?.showMessage({
                      type: 'danger',
                      message: e?.message,
                    });
                  })
                  .finally(() => {});
              }
            }}
            bgColor={colors.headerbg}
            addMargin={16}
          />
        </ScrollView>
      </RegisterForm>

      <VarifyOtpForm
        visible={visibleVarifyOtpFormForm}
        onClose={toggleVarifyOtpFormModal}
        contentContainerStyle={{
          marginHorizontal: 0,
        }}
        messageRef={messageRefVarifyOtpFormForm}>
        <Text
          style={{
            color: colors.darkBlackText,
            fontFamily: fonts.BGFlameBold,
            fontSize: fontSize.fs20,
          }}>
          Verify OTP
        </Text>
        <Text style={styles.subTitleText}>Please enter 4 digit code sent to your mail.</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
            marginTop: 10,
            alignItems: 'center',
          }}>
          <OtpBox
            ref={box1}
            blurOnSubmit={false}
            onChange={() => {
              if (box1.current.getValue() === '') {
                box2.current?.getFocus();
              }
            }}
          />
          <OtpBox
            ref={box2}
            blurOnSubmit={false}
            onChange={() => {
              if (box2.current.getValue() === '') {
                box3.current.getFocus();
              } else {
                box1.current.getFocus();
              }
            }}
          />
          <OtpBox
            ref={box3}
            blurOnSubmit={false}
            onChange={() => {
              if (box3.current.getValue() === '') {
                box4.current.getFocus();
              } else {
                box2.current.getFocus();
              }
            }}
          />
          <OtpBox
            ref={box4}
            blurOnSubmit={true}
            onChange={() => {
              if (box4.current.getValue() === '') {
                Keyboard.dismiss();
              } else {
                box3.current.getFocus();
              }
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 0,
            marginTop: 10,
            alignItems: 'center',
          }}>
          {seconds !== 0 ? (
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                fontFamily: fonts.BGFlameBold,
                color: colors.headerbg,
              }}>
              {`Resend in ${seconds < 10 ? `0${seconds}` : seconds} `}seconds
            </Text>
          ) : null}

          {seconds === 0 ? (
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '400',
                  fontFamily: fonts.BGFlameLight,
                  color: colors.black,
                }}>
                If you don't receive the code?
              </Text>
              <Pressable style={{flexDirection: 'row'}} onPress={reSetTimerOTP}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    fontFamily: fonts.BGFlameLight,
                    color: colors.headerbg,
                  }}>
                  {' Resend OTP'}
                </Text>
              </Pressable>
            </View>
          ) : null}
        </View>
        <FieldInput
          inputViewStyles={styles.textInput}
          placeholder="New Password"
          onChangeText={(text) => {
            handleInputChange(text, 'changed_verifyOTP_pwd');
          }}
          value={state.OPTpwd}
        />
        <Pressable
          style={{
            borderRadius: 8,
            marginTop: vs(15),
            paddingVertical: vs(10),
            paddingHorizontal: ms(16),
            alignSelf: 'center',
            backgroundColor: colors.headerbg,
          }}
          onPress={() => {
            const otp = `${box1.current.getValue()}${box2.current.getValue()}${box3.current.getValue()}${box4.current.getValue()}`;

            const params_verify_otp = {
              email: state.fp_email,
              otp: otp,
              password: state.OPTpwd,
            };
            API_Auth.verify_otp(params_verify_otp)
              .then((res) => {
                const {code, data, message} = res;
                if (code === StatusCodes.Error) {
                  messageRefVarifyOtpFormForm.current?.showMessage({
                    type: 'danger',
                    message: message,
                  });
                } else if (code === StatusCodes.SUCCESS) {
                  messageRefVarifyOtpFormForm.current?.showMessage({
                    type: 'success',
                    message: 'Password changed',
                  });

                  handleInputChange('', 'changed_fp_email');
                  handleInputChange('', 'changed_verifyOTP_pwd');
                  toggleForgotPasswordModal();
                }
              })
              .catch((e) => {
                const {code, data, message} = e;
                if (code === StatusCodes.Error) {
                  messageRefVarifyOtpFormForm.current?.showMessage({
                    type: 'danger',
                    message: message,
                  });
                }
              });
          }}>
          <Text
            style={{
              color: colors.white,
              fontSize: fontSize.fs16,
              fontFamily: fonts.BGFlameBold,
            }}>
            VARIFY
          </Text>
        </Pressable>
      </VarifyOtpForm>
    </View>
  );
};

export default withUser(Menu);

const styles = StyleSheet.create({
  linkBtn: {
    marginVertical: vs(10),
  },
  linkBtnText: {
    color: colors.headerbg,
    fontSize: fontSize.fs16,
    fontFamily: fonts.BGFlame,
  },
  subTitleText: {
    color: '#525f7f',
    fontSize: fontSize.fs16,
    fontFamily: fonts.BGFlame,
    marginTop: vs(10),
  },
});

export const menuStyles = StyleSheet.create({
  headerView: {
    height: 100,
    backgroundColor: colors.headerbg,

    flexDirection: 'row',
    marginBottom: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ms(16),
  },
  leftViewMain: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftView: {
    height: 30,
    width: 30,
  },
  rightViewMain: {
    width: '12%',
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
  locationText: {
    color: '#ABABAB',
    fontSize: fontSize.fs16,
    fontFamily: fonts.BGFlameBold,
    fontWeight: 'normal',
  },
  locationTextAdd: {
    color: '#343434',
    fontSize: fontSize.fs14,

    fontWeight: '700',
  },
  itemTxt: {
    color: '#808080',
    fontSize: fontSize.fs11,
  },
  locationIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',

    top: 6,
  },
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
    marginTop: 10,
    flexDirection: 'row',
  },
  searchIcon: {},
  filterIcon: {
    top: 10,
  },
  textInput: {
    height: 35,
    paddingLeft: 10,
    marginRight: 10,
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
});
