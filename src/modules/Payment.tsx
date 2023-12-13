import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {Image, SafeAreaView, ScrollView, StyleSheet, Text, Pressable, View} from 'react-native';
import {FieldInput} from '../components';
import {images} from '../core';
import {colors, commonStyles, fontSize, fonts, ms} from '../styles';
import {StackScreenRouteProp} from '../types/navigationTypes';
import {HIT_SLOP} from '../constants/constants';

const Payment: React.FC<NativeStackScreenProps<StackScreenRouteProp, 'Payment'>> = ({navigation, route}) => {
  const [checked, setChecked] = useState(false);

  return (
    <View style={commonStyles.mainView}>
      <SafeAreaView style={{backgroundColor: colors.white}} />
      <ScrollView style={{backgroundColor: colors.white}} showsVerticalScrollIndicator={false}>
        <View style={paymentStyles.headerView}>
          <Pressable style={paymentStyles.leftView} hitSlop={HIT_SLOP} onPress={() => navigation.goBack()}>
            <Image style={paymentStyles.backIconStyles} source={images.icHeaderBack} />
          </Pressable>
          <View style={paymentStyles.centerView}>
            <Text style={paymentStyles.txt}>Payment</Text>
          </View>
        </View>

        <View style={[paymentStyles.restaurantItemsWrapper]}>
          <View
            style={{
              width: '92%',
              alignSelf: 'center',
              marginTop: 12,
            }}>
            <Text style={[paymentStyles.locationText]}>Payment Method</Text>
            <View
              style={{
                flexDirection: 'row',
                borderWidth: 1,
                paddingVertical: '3%',
                borderColor: '#333333',
                borderRadius: 4,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <View style={{paddingRight: 8}}>
                <Image style={paymentStyles.appleIconStyles} source={images.icApple} />
              </View>
              <View style={{paddingLeft: 3}}>
                <Text style={[paymentStyles.toppingsTxt, {lineHeight: 30}]}>Apple Pay</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
                justifyContent: 'space-between',
              }}>
              <View style={[paymentStyles.buttonWrapper, {}]}>
                <Text style={paymentStyles.cardTxt}>New Card</Text>
              </View>
              <View style={[paymentStyles.buttonWrapper1]}>
                <Text style={[paymentStyles.cardTxt, {color: colors.headerbg}]}>Saved Card</Text>
              </View>
            </View>
            <View style={{marginTop: 6}}>
              <FieldInput inputViewStyles={paymentStyles.textInput} placeholder="Full Name" />
              <FieldInput inputViewStyles={paymentStyles.textInput} placeholder="Card Number" />
              <FieldInput inputViewStyles={paymentStyles.textInput} placeholder="Expiration Date" />
              <FieldInput inputViewStyles={paymentStyles.textInput} placeholder="CVC" />
              <FieldInput inputViewStyles={paymentStyles.textInput} placeholder="Zip Code" />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',

                paddingVertical: 15,
                marginTop: 15,
              }}>
              <View style={{flexDirection: 'row'}}>
                <Pressable onPress={() => setChecked(!checked)}>
                  <Image style={{}} source={checked ? images.icCheck : images.icUncheck} />
                </Pressable>
                <View style={{paddingLeft: 10}}>
                  <Text style={[paymentStyles.itemTxt, {fontWeight: '400'}]}>Save Card for future purchases</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Payment;

export const paymentStyles = StyleSheet.create({
  headerView: {
    height: 100,
    backgroundColor: colors.headerbg,

    flexDirection: 'row',
    marginBottom: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftView: {
    height: 30,
    width: 30,
    position: 'absolute',
    left: ms(12),
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
  backIconStyles: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    alignSelf: 'center',
    top: 6,
  },
  appleIconStyles: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  locationText: {
    color: colors.darkBlackText,
    fontSize: fontSize.fs16,
    fontFamily: fonts.BGFlameBold,
  },
  checkoutTxt: {
    color: colors.lightGray,
    fontSize: fontSize.fs16,
    fontFamily: fonts.BGFlameBold,
  },
  itemTxt: {
    fontSize: fontSize.fs16,
    fontFamily: fonts.BGFlame,
    color: colors.mediumGray,
  },
  toppingsTxt: {
    fontSize: fontSize.fs16,
    fontFamily: fonts.BGFlameBold,
    color: colors.darkBlackText,
  },
  restaurantItemsWrapper: {
    marginHorizontal: '4%',
    marginVertical: '1%',
    backgroundColor: colors.white,
    borderRadius: 10,
    ...commonStyles.shadowStyles,
    paddingBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.VeryLightGray,
    borderRadius: 4,
    height: 38,
    paddingLeft: 10,
    marginTop: 10,
  },
  cardTxt: {
    color: colors.white,
    fontSize: fontSize.fs14,
    fontFamily: fonts.BGFlameBold,
    textAlign: 'center',
  },
  buttonWrapper: {
    backgroundColor: colors.headerbg,
    borderWidth: 1,
    borderColor: colors.veryLightGray2,
    ...commonStyles.shadowStyles,
    paddingVertical: '5%',
    borderRadius: 4,
    width: '48%',
  },
  buttonWrapper1: {
    backgroundColor: colors.palePeach,
    borderWidth: 1,
    borderColor: colors.veryLightGray2,
    ...commonStyles.shadowStyles,
    paddingVertical: '5%',
    borderRadius: 4,
    width: '48%',
  },
});
