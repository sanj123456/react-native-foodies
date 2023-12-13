import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {API_Auth, StatusCodes} from '../../api';
import {Loader, ThemeRedHeader, WhiteBox} from '../../components';
import FieldInput from '../../components/FieldInput';
import {colors, fontSize, fonts, ms, vs} from '../../styles';
import {StackScreenRouteProp} from '../../types/navigationTypes';
import {isEmail, prettyPrint, showDangerMessage} from '../../utils/functions';

export interface ForgotPasswordProps {}

const ForgotPassword: React.FC<NativeStackScreenProps<StackScreenRouteProp, 'ForgotPassword'>> = ({navigation, route}) => {
  const [email, setEmail] = React.useState('');

  const isAllValidForgotPassowrd = () => {
    if (email?.length === 0) {
      showDangerMessage('Email is required');
      return false;
    } else if (!isEmail(email)) {
      showDangerMessage('Please enter valid email');
      return false;
    }
    return true;
  };

  const onPressContinue = async () => {
    if (isAllValidForgotPassowrd()) {
      try {
        const response = await API_Auth.reset_password({email});

        const {code, data} = response;
        if (code === StatusCodes.SUCCESS) {
          navigation.navigate('VerifyOTP', {
            email,
          });
        }
      } catch (error) {
        console.log({error});
        showDangerMessage(error?.message);
      }
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ThemeRedHeader
        headerTitle="Forgot Password?"
        onPressLeft={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
      />
      <View style={styles.container}>
        <WhiteBox>
          <Text style={styles.subTitleText}>Enter the e-mail address associated with your account. If an account exists, we will send a reset password email.</Text>
          <FieldInput inputViewStyles={styles.textInput} placeholder="Email" onChangeText={setEmail} value={email} keyboardType="email-address" />
          <Pressable
            style={{
              borderRadius: 8,
              marginTop: vs(10),
              paddingVertical: vs(10),
              paddingHorizontal: ms(16),
              alignSelf: 'center',
              backgroundColor: colors.headerbg,
            }}
            onPress={onPressContinue}>
            <Text
              style={{
                color: colors.white,
                fontSize: fontSize.fs16,
                fontFamily: fonts.BGFlameBold,
              }}>
              CONTINUE
            </Text>
          </Pressable>
        </WhiteBox>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#CDCDCD',
    borderRadius: 4,
    height: vs(38),
    paddingLeft: ms(10),
    marginTop: vs(10),
  },
  subTitleText: {
    color: '#525f7f',
    fontSize: fontSize.fs16,
    fontFamily: fonts.BGFlame,
    marginTop: vs(10),
  },
});

export default ForgotPassword;
