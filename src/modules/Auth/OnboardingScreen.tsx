import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {ImageBackground, Pressable, StatusBar, StyleSheet, Text, View} from 'react-native';
import OnboardingContinueRightIcon from '../../../assets/SVGImages/OnboardingContinueRightIcon';
import {images} from '../../core';
import {colors, fontSize, fonts, ms, vs} from '../../styles';
import {StackScreenRouteProp} from '../../types/navigationTypes';
import SkipButton from '../../components/SkipButton';

export interface SignInProps {}

const OnboardingScreen: React.FC<NativeStackScreenProps<StackScreenRouteProp, 'OnboardingScreen'>> = ({navigation, route}) => {
  useEffect(() => {
    StatusBar.setHidden(true);
    () => {
      StatusBar.setHidden(false);
    };
  }, []);

  return (
    <ImageBackground source={images.Onboarding} style={[StyleSheet.absoluteFillObject]} resizeMode="stretch">
      <StatusBar hidden={true} backgroundColor={'transparent'} barStyle={'light-content'} />
      <View pointerEvents="none" style={{flex: 1}} />
      <View style={{backgroundColor: '#FFFFFF'}}>
        <Text style={{marginHorizontal: ms(35), fontSize: fontSize.fs22, color: colors.Cinnabar, fontFamily: fonts.BGFlameBold, marginTop: vs(27)}}>Get started with Foodies</Text>
        <Pressable
          onPress={() => navigation.navigate('SignIn')}
          style={{flexDirection: 'row', marginHorizontal: ms(35), alignItems: 'center', justifyContent: 'center', backgroundColor: '#F2B644', paddingVertical: vs(12), borderRadius: ms(10), marginTop: vs(16), marginBottom: vs(37)}}>
          <Text
            style={{
              color: 'white',
              fontSize: fontSize.fs20,
              fontFamily: fonts.BGFlameBold,
              textAlign: 'center',
            }}>
            Continue
          </Text>
          <View style={{position: 'absolute', right: ms(35)}}>
            <OnboardingContinueRightIcon />
          </View>
        </Pressable>
      </View>
      <SkipButton
        style={{
          position: 'absolute',
          right: ms(35),
          top: vs(55),
        }}
        onPress={() => navigation.navigate('Drawer')}
      />
    </ImageBackground>
  );
};

export default OnboardingScreen;
