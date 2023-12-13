import {DrawerScreenProps} from '@react-navigation/drawer';
import React, {FC, useEffect, useState} from 'react';
import {Dimensions, Image, Linking, Pressable, StyleSheet, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {API_Auth, API_Ordering, AuthUrls, StatusCodes} from '../api';
import {CheckInput, FieldInput, ThemeRedHeader} from '../components';
import {images} from '../core';
import {useAppSelector} from '../redux/hooks';
import {colors, fontSize, fonts, ms, vs} from '../styles';
import {DrawerScreenRouteProp} from '../types/navigationTypes';
import {isEmail, prettyPrint, showDangerMessage, showSuccessMessage} from '../utils/functions';
import {ResponseGetProfile} from '../api/types';
import {ComponentMatrix} from '../constants/constants';
import {dispatch, setInitUser} from '../redux';
import {useDispatch} from 'react-redux';
import {startLoading, stopLoading} from '../redux/modules/loading-slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {USER_INACTIVE} from '../api/StatusCodes';

const Profile: FC<DrawerScreenProps<DrawerScreenRouteProp, 'Profile'>> = ({navigation, route}) => {
  const safeArea = useSafeAreaInsets();

  const {user, accessToken, restaurantUrl} = useAppSelector((state) => state.profile);
  const dispatch = useDispatch();

  const [Profiledata, SetProfiledata] = useState<ResponseGetProfile>();
  const [valuename, setValuename] = useState('');
  const [valueemail, setValueemail] = useState('');
  const [valuephone, setValuephone] = useState('');
  const [smsForCouponAndInfo, setSmsForCouponAndInfo] = useState(false);
  const [emailForCouponAndInfo, setEmailForCouponAndInfo] = useState(false);

  const isAllValidProfile = () => {
    try {
      const _valuename = valuename.trim();

      if (_valuename.length === 0) {
        showDangerMessage('Please enter a name');
        return false;
      } else if (_valuename.length < 4) {
        showDangerMessage('Name must be at least 4 characters');
        return false;
      } else if (valueemail.length === 0) {
        showDangerMessage('Please enter a email');
        return false;
      } else if (!isEmail(valueemail)) {
        showDangerMessage('Email must be valid email');
        return false;
      } else if (valuephone.length === 0) {
        showDangerMessage('Please enter a valid phone number');
        return false;
      } else if (valuephone.length < 10) {
        showDangerMessage('Phone number cannot be less than 10');
        return false;
      }
      return true;
    } catch (error) {
      console.log({error});
      showDangerMessage('Something went wrong');
      return false;
    }
  };

  const fetchProfile = async () => {
    try {
      dispatch(startLoading());
      const response = await API_Ordering.Get_User_Profiledata(user._id);
      if (response.code === StatusCodes.SUCCESS) {
        SetProfiledata(response.data);
        if (!response.data?.customer) {
          return;
        }
        setValuename(response.data?.customer?.name);
        setValueemail(response.data?.customer?.email);
        setValuephone('' + response.data?.customer?.phone);
        setSmsForCouponAndInfo(response.data?.customer?.smsForCouponAndInfo);
        setEmailForCouponAndInfo(response.data?.customer?.emailForCouponAndInfo);
      } else {
        showDangerMessage(response.message);
      }
    } catch (error) {
      console.log({error});
      showDangerMessage(error?.message ? (error?.message === USER_INACTIVE ? 'You account has been deleted' : error?.message) : 'Something went wrong');
    } finally {
      dispatch(stopLoading());
    }
  };

  const updateUserStore = async () => {
    try {
      dispatch(startLoading());
      const response = await API_Auth.get_profile(user._id);
      if (response.code === StatusCodes.SUCCESS) {
        const {data} = response;

        const customer = {
          _id: data?.customer?._id,
          userId: user?.customer?.userId,
          email: data?.email,
          role: data?.role,
          status: data?.status,
          address: data?.address,
          customerGroup: data?.customer?.customerGroup,
          name: data?.customer?.name,
          restaurants: data?.customer?.restaurants,
          paymentMethods: data?.customer?.paymentMethods,
          loyaltyPoints: data?.customer?.loyaltyPoints,
          smsForCouponAndInfo: data?.customer?.smsForCouponAndInfo,
          emailForCouponAndInfo: data?.customer?.emailForCouponAndInfo,
          phone: data?.customer?.phone,
          birthday: data?.customer?.birthday,
          anniversary: data?.customer?.anniversary,
        };
        const _user = {
          _id: user?._id, // missing
          email: data?.email,
          password: user.password, // missing
          status: data?.status,
          role: data?.role,
          permissions: data?.permissions,
          authProvider: data?.authProvider,
          restaurant: data?.restaurant,
          customer: customer,
        };
        const redux_user = {user: _user, accessToken: accessToken};
        await AsyncStorage.setItem('user', JSON.stringify(redux_user));
        dispatch(setInitUser(redux_user));
      }
    } catch (error) {
      showDangerMessage(error?.message ?? 'Something went wrong...');
    } finally {
      dispatch(stopLoading());
    }
  };

  const editProfilePressHandler = async () => {
    try {
      if (!isAllValidProfile()) return;
      dispatch(startLoading());
      const params = {
        id: user.customer._id,
        email: valueemail,
        userId: user._id,
        name: valuename,
        status: 'active',
        smsForCouponAndInfo,
        emailForCouponAndInfo,
      };
      console.log(params);
      const response = await API_Ordering.updateUserProfile(user._id, params);
      if (response.code === StatusCodes.SUCCESS) {
        showSuccessMessage('Profile updated successfully...');
        await updateUserStore();
        navigation.navigate('Home');
      } else {
        showDangerMessage(response.message);
      }
    } catch (error) {
      showDangerMessage(error?.message ?? 'Something went wrong...');
    } finally {
      dispatch(stopLoading());
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchProfile);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.mainView}>
      <ThemeRedHeader headerTitle={Profiledata?.customer?.name} />

      <View style={{marginHorizontal: 25}}>
        <FieldInput
          inputViewStyles={styles.textInput}
          placeholder="Name"
          onChangeText={(text) => {
            setValuename(text);
          }}
          value={valuename}
        />
        <FieldInput
          inputViewStyles={styles.textInput}
          placeholder="Email Address"
          onChangeText={(text) => {
            setValueemail(text);
          }}
          value={valueemail}
          keyboardType="email-address"
        />
        <FieldInput
          inputViewStyles={styles.textInput}
          placeholder="Phone"
          onChangeText={(text) => {
            setValuephone(text);
          }}
          value={'' + valuephone}
          keyboardType="phone-pad"
          maxLength={10}
        />
        <CheckInput initValue={smsForCouponAndInfo} title={'Sign up for SMS coupons and info'} onChangeValue={(nextIsChecked: boolean) => setSmsForCouponAndInfo(nextIsChecked)} />
        <CheckInput initValue={emailForCouponAndInfo} title={'Sign up for Email coupons and info'} onChangeValue={(nextIsChecked: boolean) => setEmailForCouponAndInfo(nextIsChecked)} />
        <Pressable
          style={{
            backgroundColor: '#EFEFEF',
            height: vs(40),
            alignItems: 'center',
            marginHorizontal: 0,
            justifyContent: 'center',
            borderRadius: 5,
            marginTop: 40,
          }}
          onPress={editProfilePressHandler}>
          <Text
            style={{
              color: '#DC4135',
              fontSize: fontSize.fs16,
              fontFamily: fonts.BGFlameLight,
              fontWeight: '400',
            }}>
            Edit Profile
          </Text>
        </Pressable>
        <Pressable
          style={{
            backgroundColor: '#DC4135',
            height: vs(40),
            alignItems: 'center',
            marginHorizontal: 0,
            justifyContent: 'center',
            borderRadius: 5,
            marginTop: 10,
          }}
          onPress={() => Linking.openURL(`${restaurantUrl}/my-account`).catch((err) => console.error("Couldn't load page", err))}>
          <Text
            style={{
              color: '#EFEFEF',
              fontSize: fontSize.fs16,
              fontFamily: fonts.BGFlameLight,
              fontWeight: '400',
            }}>
            Delete Account
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerView: {
    height: Dimensions.get('window').height / 2 - 100,
    backgroundColor: colors.headerbg,

    marginBottom: 0,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  leftView: {
    marginTop: 30,
    marginLeft: 10,
    height: 25,
    width: 25,
  },
  backIconStyles: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  viewcenter: {
    justifyContent: 'flex-end',
    marginTop: 10,
    marginBottom: 20,
    flex: 1,
  },
  usernametext: {
    marginTop: 10,
    marginBottom: 10,
    color: colors.white,
    fontSize: fontSize.fs20,
    fontFamily: fonts.BGFlameBold,
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#CDCDCD',
    borderRadius: 4,

    height: vs(38),

    paddingLeft: ms(10),

    marginTop: vs(10),
  },
});
