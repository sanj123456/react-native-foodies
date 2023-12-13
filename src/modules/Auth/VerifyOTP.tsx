import React, {useState} from 'react';
import {Keyboard, Pressable, StyleSheet, Text, View} from 'react-native';
import {FieldInput, ThemeRedHeader, Timer, WhiteBox} from '../../components';
import {colors, fontSize, fonts, ms, vs} from '../../styles';
import {StackScreenRouteProp} from '../../types/navigationTypes';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {API_Auth, StatusCodes} from '../../api';
import {showDangerMessage, showSuccessMessage} from '../../utils/functions';

export interface VerifyOTPProps {}

const VerifyOTP: React.FC<NativeStackScreenProps<StackScreenRouteProp, 'VerifyOTP'>> = ({navigation, route}) => {
  const {email} = route.params;

  const [otp, setOTP] = useState('');
  const [password, setPassword] = useState('');
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const isAllValid = () => {
    const _otp = otp.trim();
    const _password = password.trim();
    if (_otp.length === 0) {
      showDangerMessage('Please enter your OTP.');
      return false;
    } else if (_otp.length < 4) {
      showDangerMessage('Please enter valid OTP.');
      return false;
    } else if (_password.length === 0) {
      showDangerMessage('Password is required');
      return false;
    }
    return true;
  };

  const onPressVarify = async () => {
    const params_verify_otp = {
      email: email,
      otp: otp,
      password: password,
    };
    if (!isAllValid()) return;
    try {
      const response = await API_Auth.verify_otp(params_verify_otp);

      if (response.code === StatusCodes.SUCCESS) {
        showSuccessMessage('Password updated successfully.');
        navigation.navigate('SignIn');
      } else {
        showDangerMessage('Something went wrong.');
      }
    } catch (error) {
      console.log({error});
      showDangerMessage(error?.message);
    }
  };

  const setOTPValue = (v: string) => {
    setOTP(v);
  };

  const onPressResend = async () => {
    setIsTimerRunning(true);
    try {
      await API_Auth.reset_password({email});
    } catch (error) {
      console.log({error});
      showDangerMessage(error?.message);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ThemeRedHeader
        headerTitle="Verify OTP"
        onPressLeft={() => {
          navigation.popToTop();
        }}
      />
      <View style={styles.container}>
        <WhiteBox>
          <Text style={styles.subTitleText}>Please enter 6 digit code sent to your mail.</Text>
          <OTPInputView
            pinCount={6}
            keyboardType={'default'}
            autoFocusOnLoad
            style={{
              height: vs(50),
            }}
            codeInputFieldStyle={{
              color: colors.darkBlackText,
              fontFamily: fonts.BGFlameBold,
              fontSize: fontSize.fs13,
            }}
            onCodeFilled={setOTPValue}
            onCodeChanged={setOTPValue}
          />
          <Text style={styles.subTitleText}>New Password.</Text>
          <FieldInput inputViewStyles={styles.textInput} placeholder="Please enter new password" onChangeText={setPassword} value={password} />
          {isTimerRunning ? (
            <Timer
              timeout={30}
              onFinish={() => {
                setIsTimerRunning(false);
              }}
              textStyle={[styles.linkBtnText]}
            />
          ) : (
            <Text style={[styles.subTitleText, {textAlign: 'center'}]}>
              If you don't receive the code?
              <Text style={styles.btnResend} onPress={onPressResend}>
                {' '}
                Resend.
              </Text>
            </Text>
          )}
          <Pressable
            style={{
              borderRadius: 8,
              marginTop: vs(15),
              paddingVertical: vs(10),
              paddingHorizontal: ms(16),
              alignSelf: 'center',
              backgroundColor: colors.headerbg,
            }}
            onPress={onPressVarify}>
            <Text
              style={{
                color: colors.white,
                fontSize: fontSize.fs16,
                fontFamily: fonts.BGFlameBold,
              }}>
              VERIFY
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
  linkBtn: {
    marginVertical: vs(10),
  },
  linkBtnText: {
    color: colors.darkBlackText,
    fontSize: fontSize.fs16,
    marginTop: ms(20),
    fontFamily: fonts.BGFlame,
  },
  subTitleText: {
    color: '#525f7f',
    fontSize: fontSize.fs16,
    fontFamily: fonts.BGFlame,
    marginTop: vs(10),
  },
  btnResend: {
    color: colors.headerbg,
    fontSize: fontSize.fs16,
    fontFamily: fonts.BGFlame,
    marginTop: vs(10),
  },
});

export default VerifyOTP;
