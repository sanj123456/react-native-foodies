import React, {FC, useState} from 'react';
import {FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, Pressable, View} from 'react-native';
import {images, screenName} from '../core';
import {colors, commonStyles, fonts, fontSize} from '../styles';
import {CommonNavigationProps, StackScreenRouteProp} from '../types/navigationTypes';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HIT_SLOP} from '../constants/constants';
const PaymentMethod: React.FC<NativeStackScreenProps<StackScreenRouteProp, 'PaymentMethod'>> = ({navigation, route}) => {
  const Data = [
    {
      id: 1,
      image: require('../../assets/images/DummyVisa.png'),
      image1: require('../../assets/images/icCheckCircle.png'),
    },
    {
      id: 2,
      image: require('../../assets/images/DummyMaster.png'),
    },
  ];
  return (
    <View style={commonStyles.mainView}>
      <SafeAreaView style={{backgroundColor: colors.white}} />
      <ScrollView style={{backgroundColor: colors.white}} showsVerticalScrollIndicator={false}>
        {/* <View style={commonStyles.mainView}> */}
        <View style={paymentMethodStyles.headerView}>
          <View style={paymentMethodStyles.leftViewMain}>
            <Pressable style={paymentMethodStyles.leftView} hitSlop={HIT_SLOP} onPress={() => navigation.goBack()}>
              <Image style={paymentMethodStyles.backIconStyles} source={images.icHeaderBack} />
            </Pressable>
          </View>
          <View style={paymentMethodStyles.centerView}>
            <View style={{}}>
              <Text style={paymentMethodStyles.txt}>Payment</Text>
            </View>
          </View>
          <View style={[paymentMethodStyles.rightViewMain, {flexDirection: 'row'}]}>
            <View style={paymentMethodStyles.rightView}>
              <Image style={paymentMethodStyles.backIconStyles} source={images.icHeaderSearch} />
            </View>
            <View style={paymentMethodStyles.rightViewMain}>
              <View style={paymentMethodStyles.rightView}>
                <Image style={paymentMethodStyles.backIconStyles} source={images.icCart} />
              </View>
            </View>
          </View>
        </View>
        <View style={[paymentMethodStyles.restaurantItemsWrapper]}>
          <View
            style={{
              width: '92%',
              alignSelf: 'center',
              marginTop: 12,
            }}>
            <View style={{paddingVertical: '3%'}}>
              <Text style={[paymentMethodStyles.locationText]}>Payment Method</Text>
            </View>
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
                <Image style={paymentMethodStyles.appleIconStyles} source={images.icApple} />
              </View>
              <View style={{paddingLeft: 3}}>
                <Text style={[paymentMethodStyles.toppingsTxt, {lineHeight: 30}]}>Apple Pay</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
                justifyContent: 'space-between',
              }}>
              <View style={[paymentMethodStyles.buttonWrapper, {}]}>
                <Text style={paymentMethodStyles.cardTxt}>New Card</Text>
              </View>
              <Pressable style={[paymentMethodStyles.buttonWrapper1]} onPress_={() => navigation.navigate('PaymentMethod1')}>
                <Text style={[paymentMethodStyles.cardTxt, {color: colors.headerbg}]}>Saved Card</Text>
              </Pressable>
            </View>
            <FlatList
              data={Data}
              style={{
                marginTop: 15,
              }}
              renderItem={({item, index}) => {
                return (
                  <View style={paymentMethodStyles.itemWrapper}>
                    <View
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                      }}>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Image style={paymentMethodStyles.icRestaurantStyle} source={item?.image} />
                      </View>
                      <View
                        style={{
                          marginLeft: 10,
                          paddingTop: 3,
                          flex: 1,
                        }}>
                        <Text style={paymentMethodStyles.CardTxt}>Visa</Text>
                        <Text style={paymentMethodStyles.cardNumber}>Ending with 5883</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 5,
                      }}>
                      <Image style={paymentMethodStyles.icCheckCircle} source={item?.image1} />
                    </View>
                  </View>
                );
              }}
              keyExtractor={(item: any) => item.id}
            />
          </View>
        </View>
        <Pressable
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: '3%',
            backgroundColor: colors.headerbg,
            paddingVertical: 15,
            borderRadius: 5,
            marginTop: 15,
            marginBottom: 15,
          }}
          onPress={() => navigation.navigate('OrderSuccess')}>
          <View style={{marginLeft: 12}}>
            <Text style={[paymentMethodStyles.checkoutTxt, {color: colors.white}]}>CHECKOUT</Text>
          </View>
          <View style={{marginRight: 12}}>
            <Text style={[paymentMethodStyles.checkoutTxt, {color: colors.white}]}>$8.25</Text>
          </View>
        </Pressable>
        {/* </View> */}
      </ScrollView>
    </View>
  );
};
export default PaymentMethod;
export const paymentMethodStyles = StyleSheet.create({
  headerView: {
    height: 100,
    backgroundColor: colors.headerbg,

    flexDirection: 'row',
    marginBottom: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'space-between',
  },
  leftViewMain: {width: '15%', justifyContent: 'center', alignItems: 'center'},
  leftView: {height: 30, width: 30},
  rightViewMain: {width: '12%', justifyContent: 'center', alignItems: 'center', marginRight: 10},
  rightView: {height: 30, width: 30, marginRight: 50},
  centerView: {flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center'},
  txt: {color: colors.white, fontSize: fontSize.fs20, fontFamily: fonts.BGFlameBold},
  backIconStyles: {width: 20, height: 20, resizeMode: 'contain', alignSelf: 'center', top: 6},
  appleIconStyles: {width: 20, height: 20, resizeMode: 'contain', alignSelf: 'center'},
  locationText: {color: colors.darkBlackText, fontSize: fontSize.fs16, fontFamily: fonts.BGFlameBold},
  checkoutTxt: {color: '#ABABAB', fontSize: fontSize.fs16, fontFamily: fonts.BGFlameBold},
  toppingsTxt: {fontSize: fontSize.fs16, fontFamily: fonts.BGFlameBold, color: colors.darkBlackText},
  restaurantItemsWrapper: {marginHorizontal: '4%', marginVertical: '1%', backgroundColor: colors.white, borderRadius: 10, ...commonStyles.shadowStyles, paddingBottom: 20},
  icRestaurantStyle: {width: 45, height: 45, resizeMode: 'contain', borderRadius: 40},
  icCheckCircle: {width: 25, height: 25, resizeMode: 'contain'},
  cardTxt: {color: colors.white, fontSize: fontSize.fs14, fontFamily: fonts.BGFlameBold, textAlign: 'center'},
  buttonWrapper: {backgroundColor: colors.headerbg, borderWidth: 1, borderColor: '#EFEFEF', ...commonStyles.shadowStyles, paddingVertical: '5%', borderRadius: 4, width: '48%'},
  buttonWrapper1: {backgroundColor: '#FFECEA', borderWidth: 1, borderColor: '#EFEFEF', ...commonStyles.shadowStyles, paddingVertical: '5%', borderRadius: 4, width: '48%'},
  itemWrapper: {backgroundColor: '#F9F9F9', paddingHorizontal: '5%', paddingVertical: '5%', marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', flex: 1},
  CardTxt: {color: '#565656', fontFamily: fonts.BGFlameBold, fontSize: fontSize.fs15},
  cardNumber: {color: '#565656', fontFamily: fonts.BGFlame, fontSize: fontSize.fs13, lineHeight: 20},
});
