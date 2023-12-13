import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {FlatList, Image, Linking, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {DeliveryAddress, ResponseTypeCreateOrder} from '../api/types';
import ThemeRedHeader from '../components/ThemeRedHeader';
import {images} from '../core';
import {useAppDispatch} from '../redux/hooks';
import {resetState} from '../redux/modules/bagSlice';
import {colors, commonStyles, fontSize, fonts, ms, vs} from '../styles';
import {StackScreenRouteProp} from '../types/navigationTypes';
import PrimaryButton from '../components/PrimaryButton';
import {ComponentMatrix} from '../constants/constants';
import {prettyPrint, showDangerMessage} from '../utils/functions';
import {API_Ordering, StatusCodes} from '../api';
import {toString} from 'lodash';
import {BagItem} from './Bag';
import Separator from '../components/Separator';
import moment from 'moment';
import RenderJSON from '../components/RenderJSON';
import TaxFeesBlock from '../components/TaxFeesBlock';
import CheckOutTaxItem from '../components/CheckOutTaxItem';
const OrderSuccess: React.FC<NativeStackScreenProps<StackScreenRouteProp, 'OrderSuccess'>> = ({navigation, route}) => {
  const {_id}: ResponseTypeCreateOrder = route.params ?? {};
  const dispatch = useAppDispatch();
  const [orderDetails, setOrderDetails] = React.useState<ResponseTypeCreateOrder>({} as ResponseTypeCreateOrder);
  // prettyPrint(orderDetails);
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await API_Ordering.find_order_details(_id);
        if (response.code === StatusCodes.SUCCESS) {
          setOrderDetails(() => {
            return {
              ...response.data,
              items: response.data.items.map((item: any) => {
                return {
                  ...item,
                  toppings: item.modifiers,
                };
              }),
            };
          });
        }
      } catch (error) {
        console.log({error});
        showDangerMessage("Couldn't fetch order details");
      }
    };

    fetchOrderDetails();
  }, []);

  const handlePlaceanotherorder = () => {
    dispatch(resetState());
    navigation.reset({
      index: 0,
      routes: [{name: 'Drawer'}],
    });
  };

  const orderNowPickupDateS = (orderNowPickupDate: any): string => {
    try {
      const newDate = moment(orderNowPickupDate);
      return `${newDate.format('LLLL')}`;
    } catch (error) {
      console.log({error});
      return '';
    }
  };

  let paymentStatusText = '';

  if (orderDetails?.paymentStatus === 'pending' && orderDetails?.paymentMethod === 'pay-there') {
    paymentStatusText = `Pay At ${orderDetails.method === 'pickup' ? 'Store' : 'Delivery'}`;
  } else if (orderDetails?.paymentStatus === 'paid' && orderDetails?.paymentMethod === 'online') {
    paymentStatusText = 'Approved';
  }

  return (
    <View style={commonStyles.mainView}>
      <SafeAreaView style={{backgroundColor: colors.headerbg}} />
      <StatusBar barStyle={'light-content'} hidden={false} backgroundColor={colors.headerbg} />
      <ThemeRedHeader
        onPressLeft={() => {
          dispatch(resetState());
          navigation.reset({
            index: 0,
            routes: [{name: 'Drawer'}],
          });
        }}
        headerTitle="Order Confirmed"
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[orderSuccessStyles.restaurantItemsWrapper]}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: '5%',
            }}>
            <Image style={orderSuccessStyles.checkCircleIcon} source={images.icCheckCircle} />
            <View
              style={{
                paddingTop: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={orderSuccessStyles.successTxt}>Success</Text>
              <Text style={orderSuccessStyles.placedTxt}>You've placed your order</Text>
            </View>
          </View>
        </View>
        <View style={[orderSuccessStyles.guestDetailsWrapper]}>
          <View
            style={{
              width: '92%',
              alignSelf: 'center',
              marginTop: 12,
              paddingBottom: 10,
              paddingVertical: '3%',
            }}>
            <Text
              style={{
                color: colors.darkBlackText,
                fontFamily: fonts.BGFlameBold,
                fontSize: fontSize.fs15,
              }}>
              Order Status
            </Text>
            <View style={{flexDirection: 'row', marginTop: 20}}>
              <View style={{flex: 0.5}}>
                <Image style={orderSuccessStyles.DummyIcon} source={images.DummyIcon} />
              </View>
              <View style={{flex: 1.3}}>
                <Text style={orderSuccessStyles.foodTxt}>Your food is being prepared</Text>
                {orderDetails.method === 'pickup' ? (
                  <Text style={orderSuccessStyles.placedTxt}>It will be ready for pickup at {orderNowPickupDateS(orderDetails.orderTiming === 'later' && orderDetails?.scheduledOn ? orderDetails.scheduledOn : orderDetails.orderNowPickupDate)}</Text>
                ) : (
                  <Text style={orderSuccessStyles.placedTxt}>It will be delivered on {orderNowPickupDateS(orderDetails.orderTiming === 'later' && orderDetails?.scheduledOn ? orderDetails.scheduledOn : orderDetails.orderNowPickupDate)}</Text>
                )}
                <Pressable
                  onPress={() => {
                    if (typeof orderDetails.location.valueOf() == 'object' && orderDetails.location?.phone) {
                      Linking.openURL(`tel:${orderDetails.location?.phone}`);
                    }
                  }}
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image style={{}} source={images.icphone} />
                  <View style={{marginLeft: 10}}>
                    <Text style={[orderSuccessStyles.rewardsText, {fontSize: fontSize.fs14}]}>Contact Restaurant</Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
          <View
            style={{
              paddingHorizontal: '3%',
              backgroundColor: '#F9F9F9',
              paddingVertical: '3%',
              borderBottomRightRadius: 10,
              borderBottomLeftRadius: 10,
            }}>
            <FlatList renderItem={(props) => <BagItem {...props} editable={false} />} data={orderDetails.items} ItemSeparatorComponent={() => <Separator />} />
            <View style={[{height: StyleSheet.hairlineWidth, backgroundColor: colors.SonicSilver, marginVertical: vs(8)}]} />
            {typeof orderDetails.payment !== 'undefined' && (
              <TaxFeesBlock
                styleWhiteBox={{backgroundColor: '#F9F9F9'}}
                data={{
                  tax: orderDetails?.payment?.tax,
                  taxDetails: orderDetails?.payment?.taxDetails,
                  'Ordering Fee': orderDetails?.payment?.orderFee,
                  'Delivery Fee': orderDetails?.payment?.deliveryFee,
                }}
              />
            )}
            <CheckOutTaxItem item={{title: 'Total', price: orderDetails?.payment?.total}} />
          </View>
        </View>
        <View style={[orderSuccessStyles.moreInfoWrapper]}>
          <View style={{paddingHorizontal: '3%', marginVertical: '4%'}}>
            <Text
              style={{
                color: colors.darkBlackText,
                fontFamily: fonts.BGFlameBold,
                fontSize: fontSize.fs15,
              }}>
              Order Status
            </Text>
            <View style={{marginTop: 12, flexDirection: 'row'}}>
              <Image style={{}} source={images.icReceipt} />
              <View style={{paddingLeft: 10}}>
                <Text style={orderSuccessStyles.orderTxt}>
                  Order Number:
                  <Text style={orderSuccessStyles.foodTxt}>
                    {''} {orderDetails.orderNum}
                  </Text>
                </Text>
              </View>
            </View>
            <View style={{marginTop: 12, flexDirection: 'row'}}>
              <Image style={{}} source={images.icDelivery} />
              <View style={{paddingHorizontal: ms(15)}}>
                <Text style={orderSuccessStyles.orderTxt}>
                  {orderDetails.method === 'delivery' ? 'Delivery' : 'Pickup'}:{' '}
                  <Text style={orderSuccessStyles.foodTxt}>{orderNowPickupDateS(orderDetails.orderTiming === 'later' && orderDetails?.scheduledOn ? orderDetails.scheduledOn : orderDetails.orderNowPickupDate)}</Text>
                </Text>
              </View>
            </View>
            <View style={{marginTop: 12, flexDirection: 'row'}}>
              <Image style={{}} source={images.icPayment} />
              <View style={{paddingHorizontal: ms(15)}}>
                <Text style={orderSuccessStyles.orderTxt}>
                  Payment: <Text style={orderSuccessStyles.foodTxt}>{paymentStatusText}</Text>
                </Text>
              </View>
            </View>
            {orderDetails.deliveryAddress?.formatted_address && (
              <View style={{marginTop: 12, flexDirection: 'row'}}>
                <Image style={{}} source={images.icPayment} />
                <View style={{paddingHorizontal: ms(15)}}>
                  <Text style={orderSuccessStyles.orderTxt}>
                    Delivery Address: <Text style={orderSuccessStyles.foodTxt}>{orderDetails.deliveryAddress?.formatted_address}</Text>
                  </Text>
                </View>
              </View>
            )}
            {orderDetails.method === 'pickup' && (
              <View style={{marginTop: 12, flexDirection: 'row'}}>
                <Image style={{}} source={images.ic_Location} />
                <View style={{paddingHorizontal: ms(15)}}>
                  <Text style={orderSuccessStyles.orderTxt}>
                    Pickup Address: <Text style={orderSuccessStyles.foodTxt}>{orderDetails?.location?.displayAddress}</Text>
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
        <PrimaryButton
          style={{
            marginHorizontal: ComponentMatrix.HORIZONTAL_16,
            width: undefined,
            marginVertical: vs(12),
            marginBottom: ComponentMatrix.insets.bottom,
            marginTop: undefined,
          }}
          title="Place Another Order"
          onPress={handlePlaceanotherorder}
        />
      </ScrollView>
    </View>
  );
};
export default OrderSuccess;
export const orderSuccessStyles = StyleSheet.create({
  headerView: {
    height: 100,
    backgroundColor: colors.headerbg,

    flexDirection: 'row',
    marginBottom: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  leftView: {
    height: 30,
    width: 30,
    position: 'absolute',
    marginLeft: ms(12),
    borderWidth: 1,
  },
  txt: {
    color: colors.white,
    fontSize: fontSize.fs20,
    fontFamily: fonts.BGFlameBold,
    textAlign: 'center',
    flex: 1,
  },

  backIconStyles: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    alignSelf: 'center',
    top: 6,
  },
  successTxt: {
    color: '#555555',
    fontSize: fontSize.fs15,
    fontFamily: fonts.BGFlameBold,
  },
  placedTxt: {
    color: '#565656',
    fontFamily: fonts.BGFlame,
    fontSize: fontSize.fs13,
  },
  rewardsText: {
    color: colors.headerbg,
    fontSize: fontSize.fs13,
    fontFamily: fonts.BGFlameBold,
  },
  checkCircleIcon: {
    width: 25,
    height: 25,
  },
  DummyIcon: {
    width: 75,
    height: 65,
  },
  foodTxt: {
    color: colors.darkBlackText,
    fontFamily: fonts.BGFlameBold,
    fontSize: fontSize.fs13,
  },
  orderTxt: {
    color: '#ABABAB',
    fontFamily: fonts.BGFlame,
    fontSize: fontSize.fs14,
    flex: 1,
  },
  restaurantItemsWrapper: {
    marginHorizontal: '4%',
    marginVertical: '1%',
    backgroundColor: colors.white,
    borderRadius: 10,
    ...commonStyles.shadowStyles,
    marginBottom: 10,
  },
  guestDetailsWrapper: {
    marginHorizontal: '4%',
    marginVertical: '1%',
    backgroundColor: colors.white,
    borderRadius: 10,
    ...commonStyles.shadowStyles,
    marginBottom: 10,
  },
  moreInfoWrapper: {
    marginHorizontal: '4%',
    marginVertical: '1%',
    backgroundColor: colors.white,
    borderRadius: 10,
    ...commonStyles.shadowStyles,
    marginBottom: 10,
  },
});
