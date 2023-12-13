import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {API_Auth, ParamSignUp, StatusCodes} from '../../api';
import {LocalDatePicker, TermsAndPolicies, ThemeRedHeader} from '../../components';
import FieldInput from '../../components/FieldInput';
import {dispatch} from '../../redux';
import {setInitUser} from '../../redux/modules/profileSlice';
import {colors, fontSize, fonts, ms, vs} from '../../styles';
import {} from '../../styles/fonts';
import {StackScreenRouteProp} from '../../types/navigationTypes';
import {prettyPrint, showDangerMessage, showSuccessMessage} from '../../utils/functions';
import {isEmail, validateName} from '../../utils/validator';
export interface SignUpProps {}
const SignUp: React.FC<NativeStackScreenProps<StackScreenRouteProp, 'SignUp'>> = ({navigation, route}) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [birthday, setBirthday] = React.useState('');
  const [anniversary, setAnniversary] = React.useState('');
  const [agree, setAgree] = React.useState(false);
  const isAllValidSignUp = () => {
    const _name = name.trim();
    const _email = email.trim();
    const _password = password.trim();
    const _phone = phone.trim();
    if (_name.length === 0) {
      showDangerMessage('Name is required');
      return false;
    } else if (!validateName(_name)) {
      showDangerMessage('Name should only contain alphabetic characters');
      return false;
    } else if (_email.length === 0) {
      showDangerMessage('Email is required');
      return false;
    } else if (!isEmail(_email)) {
      showDangerMessage('Invalid email address');
      return false;
    } else if (_phone.length === 0) {
      showDangerMessage('Phone number is required');
      return false;
    } else if (_phone.length < 10) {
      showDangerMessage('Phone number should be at least 10 digit');
      return false;
    } else if (_password.length === 0) {
      showDangerMessage('Password is required');
      return false;
    } else if (!agree) {
      showDangerMessage('Please agree to our terms and conditions');
      return false;
    } else {
      return true;
    }
  };
  const onPressRegister = async () => {
    if (!isAllValidSignUp()) {
      return;
    }

    let paramSignUp: ParamSignUp = {
      email: email,
      name: name,
      password: password,
      status: 'active',
      phone: phone,
      emailForCouponAndInfo: true,
      smsForCouponAndInfo: true,
      agreeTermsAndConditions: agree,
      role: 'customer',
      loyalityPoints: 0,
      birthday: birthday,
      anniversary: anniversary,
    };
    try {
      const res = await API_Auth.sign_up(paramSignUp);

      const {data, code} = res;
      if (StatusCodes.SUCCESS === code) {
        const customer = {
          _id: data?._doc?._id,
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
          smsForCouponAndInfo: true,
          emailForCouponAndInfo: true,
          phone: phone,
          birthday: birthday,
          anniversary: anniversary,
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
        const redux_user = {user: user, accessToken: data?.accessToken};
        showSuccessMessage('Sign up successfully');
        AsyncStorage.setItem('user', JSON.stringify(redux_user));

        dispatch(setInitUser(redux_user));
        navigation.navigate('Home');
      }
    } catch (e) {
      showDangerMessage(e?.message);
    } finally {
      // navigation.popToTop();
    }
  };
  return (
    <View style={styles.container}>
      <ThemeRedHeader headerTitle="Register" />
      <View style={styles.a}>
        <ScrollView>
          <FieldInput inputViewStyles={styles.textInput} placeholder="Name" onChangeText={setName} value={name} autoFocus={true} />
          <FieldInput inputViewStyles={styles.textInput} placeholder="Email Address" onChangeText={setEmail} value={email} keyboardType="email-address" />
          <FieldInput inputViewStyles={styles.textInput} placeholder="Phone" onChangeText={setPhone} value={phone} keyboardType="phone-pad" maxLength={10} />
          <FieldInput inputViewStyles={styles.textInput} placeholder="Password" type="password" onChangeText={setPassword} value={password} />
          {/* <LocalDatePicker
            onChangeValue={(date) => {
              setBirthday(date);
            }}
            title={'Birthday'}
          />
          <LocalDatePicker
            onChangeValue={(date) => {
              setAnniversary(date);
            }}
            title={'Anniversary'}
          /> */}
          <TermsAndPolicies
            contentContainerStyle={{marginTop: vs(15)}}
            onPressPolicies={() => {
              navigation.navigate('PrivacyPolicy');
            }}
            onPressTerms={() => {
              navigation.navigate('TermAndConditions');
            }}
            checked={agree}
            onPressTermsAndPolicies={() => {
              setAgree(!agree);
            }}
          />
          <Pressable onPress={onPressRegister} style={styles.b}>
            <Text style={styles.c}> Register </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.navigate('SignIn');
            }}
            style={[styles.linkBtn, {alignItems: 'center'}]}>
            <Text style={styles.linkBtnText}>Sign In</Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1},
  textInput: {borderWidth: 1, borderColor: '#CDCDCD', borderRadius: 4, height: vs(38), paddingLeft: ms(10), marginTop: vs(10)},
  linkBtn: {marginVertical: vs(10)},
  linkBtnText: {color: colors.headerbg, fontSize: fontSize.fs16, fontFamily: fonts.BGFlame},
  a: {marginHorizontal: ms(16)},
  b: {borderRadius: 8, paddingVertical: vs(10), paddingHorizontal: ms(16), backgroundColor: colors.headerbg, marginTop: vs(16)},
  c: {color: colors.white, fontSize: fontSize.fs16, fontFamily: fonts.BGFlameBold, textAlign: 'center'},
});
export default SignUp;
