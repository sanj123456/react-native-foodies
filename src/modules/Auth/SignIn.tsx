import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {Pressable, StyleSheet, Text, View, SafeAreaView} from 'react-native';
import {API_Auth, StatusCodes} from '../../api';
import FieldInput from '../../components/FieldInput';
import ThemeRedHeader from '../../components/ThemeRedHeader';
import {dispatch, useAppSelector} from '../../redux';
import {setInitUser} from '../../redux/modules/profileSlice';
import {colors, fontSize, fonts, ms, vs} from '../../styles';
import {} from '../../styles/fonts';
import {StackScreenRouteProp} from '../../types/navigationTypes';
import {filterAuthRoute, isEmail, prettyPrint, showDangerMessage, showSuccessMessage} from '../../utils/functions';
import {batch} from 'react-redux';
import {resetState} from '../../redux/modules/bagSlice';

export interface SignInProps {}

const SignIn: React.FC<NativeStackScreenProps<StackScreenRouteProp, 'SignIn'>> = ({navigation, route}) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const {isComingFrom} = useAppSelector((state) => state.navigation);
  const isAllValidLogin = () => {
    if (email?.length === 0) {
      showDangerMessage('Email is required');
      return false;
    } else if (!isEmail(email)) {
      showDangerMessage('Please enter valid email.');
      return false;
    } else if (password?.length === 0) {
      showDangerMessage('Password is required');
      return false;
    }
    return true;
  };

  const onPressSignIn = async () => {
    if (!isAllValidLogin()) {
      return;
    }
    try {
      const response = await API_Auth.login({email, password});
      if (response.code === StatusCodes.SUCCESS) {
        const redux_user = {
          user: response.data.user,
          accessToken: response.data?.accessToken,
        };

        showSuccessMessage('Sign in successfully');
        AsyncStorage.setItem('user', JSON.stringify(redux_user));
        batch(() => {
          // dispatch(resetState());
          dispatch(setInitUser(redux_user));
        });
        if (isComingFrom === 'undefined') {
          navigation.navigate('Home');
        } else {
          navigation.dispatch((state) => {
            const routes = filterAuthRoute(state);

            return CommonActions.reset({
              ...state,
              routes,
              index: routes.length - 1,
            });
          });
        }
      }
    } catch (error) {
      console.log({error});
      showDangerMessage(error?.message ?? '');
    }
  };
  return (
    <View style={styles.container}>
      <ThemeRedHeader headerTitle="Sign In" />
      <View style={{marginHorizontal: ms(16)}}>
        <FieldInput inputViewStyles={styles.textInput} placeholder="Email Address" onChangeText={setEmail} value={email} keyboardType="email-address" autoFocus={true} />
        <FieldInput inputViewStyles={styles.textInput} placeholder="Password" type="password" onChangeText={setPassword} value={password} />
        <Pressable
          onPress={() => {
            navigation.navigate('ForgotPassword');
          }}
          style={[styles.linkBtn, {alignItems: 'flex-end', alignSelf: 'flex-end'}]}>
          <Text style={styles.linkBtnText}>Forgot Password ?</Text>
        </Pressable>
        <Pressable
          onPress={onPressSignIn}
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
        {/* {__DEV__ && (
          <Pressable
            onPress={() => {
              setEmail('bob@yahoo.com');
              setPassword('3K58Z2x7');
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
              Sign in as default user
            </Text>
          </Pressable>
        )} */}
        <Pressable
          onPress={() => {
            navigation.navigate('SignUp');
          }}
          style={[styles.linkBtn, {alignItems: 'center'}]}>
          <Text style={styles.linkBtnText}>Create Account</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  textInput: {
    borderWidth: 1,
    borderColor: '#CDCDCD',
    borderRadius: 4,
    height: vs(38),
    paddingLeft: ms(10),
    marginTop: vs(10),
  },
  linkBtn: {
    marginVertical: vs(10),
  },
  linkBtnText: {
    color: colors.headerbg,
    fontSize: fontSize.fs16,
    fontFamily: fonts.BGFlame,
  },
  text: {
    fontSize: fontSize.fs13,
    fontFamily: fonts.BGFlame,
    color: colors.darkBlackText,
    flex: 1,
    marginStart: ms(9),
  },
});

export default SignIn;
