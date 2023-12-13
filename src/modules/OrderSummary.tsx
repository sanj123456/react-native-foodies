import React, {FC, useState} from 'react';
import {Image, SafeAreaView, ScrollView, StyleSheet, Text, Pressable, View} from 'react-native';
import {images} from '../core';
import {colors, commonStyles, fonts, fontSize} from '../styles';
import {CommonNavigationProps, StackScreenRouteProp} from '../types/navigationTypes';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HIT_SLOP} from '../constants/constants';

const OrderSummary: React.FC<NativeStackScreenProps<StackScreenRouteProp, 'OrderSummary'>> = ({navigation, route}) => {
  const Data = [
    {
      id: 1,
      title: 'Burgers',
    },
    {
      id: 3,
      title: 'Pizzare',
    },
  ];
  const [getDropdownValue, setDropdownValue] = useState('');
  const [dropDownIndex, setDropdownIndex] = useState(Number);

  return (
    <View style={commonStyles.mainView}>
      <SafeAreaView style={{backgroundColor: colors.white}} />
      <ScrollView style={{backgroundColor: colors.white}} showsVerticalScrollIndicator={false}>
        {/* <View style={commonStyles.mainView}> */}
        <View style={orderSummaryStyles.headerView}>
          <View style={orderSummaryStyles.leftViewMain}>
            <Pressable style={orderSummaryStyles.leftView} hitSlop={HIT_SLOP} onPress={() => navigation.goBack()}>
              <Image style={orderSummaryStyles.backIconStyles} source={images.icHeaderBack} />
            </Pressable>
          </View>
          {/* <View style={orderSummaryStyles.centerView}>
            <View style={{}}>
              <Text style={orderSummaryStyles.txt}>Bag</Text>
            </View>
          </View> */}
          <View style={[orderSummaryStyles.rightViewMain, {flexDirection: 'row'}]}>
            <View style={orderSummaryStyles.rightView}>
              <Image style={orderSummaryStyles.backIconStyles} source={images.icHeaderSearch} />
            </View>
            <View style={orderSummaryStyles.rightViewMain}>
              <View style={orderSummaryStyles.rightView}>
                <Image style={orderSummaryStyles.backIconStyles} source={images.icCart} />
              </View>
            </View>
          </View>
        </View>
        <View style={[orderSummaryStyles.restaurantItemsWrapper]}>
          <View
            style={{
              width: '92%',
              alignSelf: 'center',
              marginTop: 12,
            }}>
            <View style={{paddingVertical: '3%'}}>
              <Text style={[orderSummaryStyles.signUpTxt]}>Sign Up For an Account</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',

                paddingVertical: 10,
              }}>
              <View style={{}}>
                <Text style={[orderSummaryStyles.locationText]}>Blazin Burger with Cheesey</Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                <View style={{marginRight: 5}}>
                  <Text style={[orderSummaryStyles.locationText]}>$8.25</Text>
                </View>
              </View>
            </View>

            <View style={{}}>
              <Text style={[orderSummaryStyles.toppingsTxt, {lineHeight: 30}]}>Toppings</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{flexDirection: 'row'}}>
                <View>
                  <Text style={orderSummaryStyles.itemTxt}>Mayoniise</Text>
                </View>
                <View style={{paddingLeft: 8}}>
                  <Text style={[orderSummaryStyles.itemTxt, {color: '#A49F9F'}]}>X2</Text>
                </View>
              </View>

              <View style={{marginRight: 5}}>
                <Text style={[orderSummaryStyles.priceTxt]}>$8.25</Text>
              </View>
            </View>
            <View style={{paddingTop: 8}}>
              <View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: '#BDBDBD',
                  marginTop: 8,
                  borderStyle: 'dashed',
                }}
              />
            </View>

            <View style={{marginTop: 10}}>
              <Text style={[orderSummaryStyles.toppingsTxt, {lineHeight: 30}]}>Special Instructions</Text>
            </View>
            <View style={{}}>
              <Text style={[orderSummaryStyles.itemTxt, {lineHeight: 24}]}>Make it more spicy and cook food properly to at least 75C or hotter.</Text>
            </View>
          </View>
          <View style={[orderSummaryStyles.totalWrapper]}>
            <View
              style={{
                width: '92%',
                alignSelf: 'center',
                marginTop: 12,
                paddingBottom: 20,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingTop: 10,
                }}>
                <View style={{}}>
                  <Text style={orderSummaryStyles.totalTxt}>Sub Total</Text>
                </View>
                <View style={{}}>
                  <Text style={orderSummaryStyles.priceTxt}>$15.90</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 12,
                }}>
                <View style={{}}>
                  <Text style={orderSummaryStyles.totalTxt}>Tax</Text>
                </View>
                <View style={{}}>
                  <Text style={orderSummaryStyles.priceTxt}>$15.90</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 12,
                }}>
                <View style={{}}>
                  <Text style={orderSummaryStyles.totalTxt}>Tip</Text>
                </View>
                <View style={{}}>
                  <Text style={orderSummaryStyles.priceTxt}>$15.90</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 12,
                }}>
                <View style={{}}>
                  <Text style={orderSummaryStyles.totalTxt}>Online Ordering</Text>
                </View>
                <View style={{}}>
                  <Text style={orderSummaryStyles.priceTxt}>$15.90</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 12,
                }}>
                <View style={{}}>
                  <Text style={orderSummaryStyles.totalTxt}>Coupon Discount</Text>
                </View>
                <View style={{}}>
                  <Text style={orderSummaryStyles.priceTxt}>$15.90</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 18,
                  borderTopWidth: 1,
                  borderStyle: 'dashed',
                }}>
                <View style={{paddingTop: 15}}>
                  <Text style={orderSummaryStyles.totalTxt}>Total</Text>
                </View>
                <View style={{paddingTop: 15}}>
                  <Text style={orderSummaryStyles.priceTxt}>$15.90</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        {/* </View> */}
      </ScrollView>
    </View>
  );
};

export default OrderSummary;

export const orderSummaryStyles = StyleSheet.create({
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
    color: colors.darkBlackText,
    fontSize: fontSize.fs15,
    fontFamily: fonts.BGFlameBold,
  },
  signUpTxt: {
    color: '#000000',
    textAlign: 'center',
    fontSize: fontSize.fs17,
    fontFamily: fonts.BGFlame,
  },
  locationTextAdd: {
    color: '#343434',
    fontSize: fontSize.fs14,

    fontWeight: '700',
  },
  priceTxt: {
    color: '#343434',
    fontSize: fontSize.fs13,
    fontFamily: fonts.BGFlame,
    fontWeight: '700',
  },
  itemTxt: {
    fontSize: fontSize.fs14,
    fontFamily: fonts.BGFlameBold,
    color: '#777676',
  },
  addText: {
    color: colors.headerbg,
    fontSize: fontSize.fs16,
    fontFamily: fonts.BGFlameBold,
  },
  toppingsTxt: {
    fontSize: fontSize.fs13,
    fontFamily: fonts.BGFlame,
    color: '#777676',
  },
  totalTxt: {
    fontSize: fontSize.fs14,
    fontFamily: fonts.BGFlameBold,
    color: '#777676',
    lineHeight: 24,
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
  },
  totalWrapper: {
    backgroundColor: '#F9F9F9',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: 15,
    borderRadius: 10,
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
  buttonWrapper1: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    ...commonStyles.shadowStyles,

    paddingVertical: '4%',
    borderRadius: 10,
    width: '31%',
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
});
