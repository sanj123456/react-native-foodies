import {DrawerScreenProps} from '@react-navigation/drawer';
import moment from 'moment';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {FlatList, Image, Pressable, RefreshControl, SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import DashedLine from 'react-native-dashed-line';
import {API_Ordering, StatusCodes} from '../api';
import {BagButton, ListEmptyComponent} from '../components';
import {HIT_SLOP} from '../constants/constants';
import {images} from '../core';
import {dispatch} from '../redux';
import {useAppSelector} from '../redux/hooks';
import {startLoading, stopLoading} from '../redux/modules/loading-slice';
import {colors, commonStyles, fontSize, fonts, ms, vs} from '../styles';
import {DrawerScreenRouteProp} from '../types/navigationTypes';
import {addToBag, selectResturant, selectResturantForFavorite} from '../redux/modules/bagSlice';
import {useFocusEffect} from '@react-navigation/native';
import {batch} from 'react-redux';
import {setRestaurant} from '../redux/modules/restaurantSlice';
import {BagState} from '../types';
import {navigationRef} from '../navigation/RootNavigation';
import {capitalizeFirst, prettyPrint} from '../utils/functions';
const OrderHistory: FC<DrawerScreenProps<DrawerScreenRouteProp, 'OrderHistory'>> = ({navigation, route}) => {
  const [orderhistorydata, setOrderHistoryData] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  const {isLoading} = useAppSelector((state) => state.Loader);
  const {user} = useAppSelector((state) => state.profile);

  const loadData = async () => {
    try {
      dispatch(startLoading());
      const response = await API_Ordering.order_history({customerId: user.customer._id});

      if (response.code === StatusCodes.SUCCESS) {
        setOrderHistoryData(response.data.data);
      }
    } catch (error) {
      console.log({error});
    } finally {
      dispatch(stopLoading());
    }
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      if (isActive) {
        loadData();
      }

      return () => {
        isActive = false;
      };
    }, [page]),
  );

  const fetchOrderDetails = async (_id: string) => {
    try {
      const response = await API_Ordering.find_order_details(_id);
      if (response.code === StatusCodes.SUCCESS) {
      }
    } catch (error) {
      console.log({error});
    }
  };

  const repeatOrder = async (item: any) => {
    const newBag: BagState = {
      items: item.items.map((it: any) => ({
        id: it.itemId._id,
        name: it.itemId.name,
        price: it.price,
        quantity: it.qty,
        specialInstructionsText: it.instruction,
        toppings: it.modifiers,
      })),
      restaurantId: item.restaurant.restaurant._id,
      restaurantIdForFavorite: item.restaurant._id,
      locationId: item.location._id,
      locationAddress: item.location.name,
      method: item.method,
      deliveryAddress: {},
      deliveryMethod: '',
      deliveryZoneId: '',
      orderTiming: 'now',
      scheduledOn: '',
    };

    dispatch(addToBag(newBag));

    if (item.method === 'pickup') {
      navigationRef.navigate('Bag');
      // setTimeout(() => {
      //   navigation.navigate('Menu', {
      //     passedData: {
      //       locationId: item.location._id,
      //       restaurantId: item.restaurant.restaurant._id,
      //       method: 'pickup',
      //     },
      //   });
      // }, 1000);
    } else if (item.method === 'delivery') {
      const response = await API_Ordering.find_one_restaurant(item.restaurant.restaurant._id);

      if (response.code === StatusCodes.SUCCESS) {
        batch(() => {
          dispatch(setRestaurant({restaurant: response.data}));
          dispatch(selectResturant({restaurantId: item.restaurant.restaurant._id}));
          dispatch(selectResturantForFavorite({restaurantIdForFavorite: item.restaurant._id}));
        });
        navigation.getParent()?.navigate('ChooseLocation', {
          _id: item.restaurant.restaurant._id,
          userId: {_id: item.restaurant._id},
          openlocation: true,
          locationId: item.location._id,
        });
      }
    }
  };

  const renderItem = ({item, data, index}: any) => {
    return (
      <View style={{flexDirection: 'column', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={[orderHistoryStyles.producttitleText, {flex: 1}]}>
            {item.name} X {item.qty}
          </Text>
          <Text style={[orderHistoryStyles.producttitleText]}>${parseFloat(item.price).toFixed(2)}</Text>
        </View>

        {item?.modifiers?.map((ele: any) => {
          if (ele.qty > 1) {
            var price: any = ele.price * data.items[0].qty * ele.qty;
          } else {
            var price: any = ele.price * data.items[0].qty;
          }
          return (
            <View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={[ele.selectedModifier ? orderHistoryStyles.productmodifireText : orderHistoryStyles.orderproductText, {flex: 1}]}>{ele.qty && ele.qty > 1 ? `${ele.product_name} X ${ele.qty}` : ele.product_name}</Text>
                <Text style={[orderHistoryStyles.orderproductText]}>${parseFloat(price).toFixed(2)}</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                {ele.selectedModifier ? (
                  <View>
                    <Text style={[orderHistoryStyles.orderproductText, {flex: 1}]}>- {ele.selectedModifier.label}</Text>
                  </View>
                ) : null}
                {ele.selectedModifier ? <Text style={[orderHistoryStyles.orderproductText, {flex: 1}]}>${parseFloat(ele.selectedModifier.value).toFixed(2)}</Text> : null}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const rendermainproductItem = ({item, index}: any) => {
    return (
      <View style={[orderHistoryStyles.restaurantItemsWrapper]}>
        <View style={{paddingHorizontal: '3%', paddingVertical: '2%', marginTop: 10}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5}}>
            <View style={{flex: 1}}>
              <Text style={[orderHistoryStyles.locationText, {color: colors.darkBlackText}]}>
                {'ORDER #'}
                {item.orderNum}
              </Text>
            </View>
            <View style={{marginRight: 8}}>
              <Text style={[orderHistoryStyles.date]}>{moment(item.createdAt).format('DD MMM YYYY HH:MM A')}</Text>
            </View>
          </View>
          <View style={{flex: 1}}>
            <Text style={[orderHistoryStyles.place]}>Item</Text>
            <FlatList data={item.items} renderItem={(values: any) => renderItem({...values, data: item})} />
            <DashedLine dashLength={5} dashThickness={1} dashGap={5} dashColor={'#D6D6D6'} style={{marginVertical: vs(8)}} />
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={[orderHistoryStyles.orderpriceText]}>Subtotal</Text>
              <Text style={[orderHistoryStyles.orderpricedisplayText]}>${parseFloat(item.payment.subTotal).toFixed(2)}</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={[orderHistoryStyles.orderpriceText]}>Tax & Fees</Text>
              <Text style={[orderHistoryStyles.orderpricedisplayText]}>${parseFloat(item.payment.tax).toFixed(2)}</Text>
            </View>
            {item?.payment?.taxDetails.map((ele: any) => {
              return (
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text style={[orderHistoryStyles.orderpricedisplayText]}>{ele.name}</Text>
                  <Text style={[orderHistoryStyles.orderpricedisplayText]}>${parseFloat(ele.amount).toFixed(2)}</Text>
                </View>
              );
            })}
            {item.payment.deliveryFee > 0 ? (
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={[orderHistoryStyles.orderpriceText]}>Delivery Fee</Text>
                <Text style={[orderHistoryStyles.orderpricedisplayText]}>${parseFloat(item.payment.orderFee + item.payment.deliveryFee).toFixed(2)}</Text>
              </View>
            ) : (
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={[orderHistoryStyles.orderpriceText]}>Ordering Fee</Text>
                <Text style={[orderHistoryStyles.orderpricedisplayText]}>${parseFloat(item.payment.orderFee + item.payment.deliveryFee).toFixed(2)}</Text>
              </View>
            )}
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={[orderHistoryStyles.orderpriceText]}>Tip</Text>
              <Text style={[orderHistoryStyles.orderpricedisplayText]}>${parseFloat(item.payment.tip).toFixed(2)}</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={[orderHistoryStyles.orderpriceText]}>Total</Text>
              <Text style={[orderHistoryStyles.orderpricedisplayText]}>${parseFloat(item.payment.total).toFixed(2)}</Text>
            </View>
          </View>
          <View style={{flex: 1, paddingTop: 8}}>
            <Text style={[orderHistoryStyles.place]}>Method</Text>
            <Text style={[orderHistoryStyles.locationText, {color: '#555555', fontSize: fontSize.fs14, fontFamily: fonts.BGFlameBold, fontWeight: '700'}]}>{capitalizeFirst(item.method)}</Text>
          </View>
          <DashedLine dashLength={5} dashThickness={1} dashGap={5} dashColor={'#D6D6D6'} style={{marginVertical: vs(8)}} />
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '3%'}}>
          <View style={{flex: 1}}>
            <Text style={[orderHistoryStyles.locationText, {color: colors.darkBlackText}]}>{/* ${parseFloat(item.payment.total).toFixed(2)} */}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image style={orderHistoryStyles.repeatIcon} source={images.icRepeat} />
            <Pressable style={{marginLeft: 8}} onPress={() => repeatOrder(item)}>
              <Text style={[orderHistoryStyles.repeatTxt]}>Repeat Order</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={commonStyles.mainView}>
      <SafeAreaView style={{backgroundColor: colors.headerbg}} />
      <StatusBar barStyle={'light-content'} hidden={false} backgroundColor={colors.headerbg} />
      <View style={orderHistoryStyles.headerView}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={HIT_SLOP}>
          <Image style={orderHistoryStyles.backIconStyles} source={images.icHeaderBack} />
        </Pressable>
        <View style={orderHistoryStyles.centerView}>
          <View style={{}}>
            <Text style={orderHistoryStyles.txt}>Order History</Text>
          </View>
        </View>
        <BagButton />
      </View>
      <FlatList
        bounces={true}
        refreshControl={<RefreshControl enabled={true} onRefresh={loadData} refreshing={isLoading} />}
        onEndReached={() => {}}
        onEndReachedThreshold={0.2}
        data={orderhistorydata}
        renderItem={(props) => (
          <Pressable
            onPress={() => {
              fetchOrderDetails(props.item.id);
            }}>
            {rendermainproductItem(props)}
          </Pressable>
        )}
        ListEmptyComponent={<ListEmptyComponent style={{margin: ms(30), textAlign: 'center'}}>{"You can view your order history here\nonce you've placed an order."}</ListEmptyComponent>}
      />
    </View>
  );
};

export default OrderHistory;

export const orderHistoryStyles = StyleSheet.create({
  headerView: {
    height: 100,
    backgroundColor: colors.headerbg,

    flexDirection: 'row',
    marginBottom: 0,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ms(16),
  },
  contentContainerStyle: {
    paddingHorizontal: 15,
    paddingVertical: 30,
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
  },
  repeatIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  locationText: {
    color: '#ABABAB',
    fontSize: fontSize.fs15,
    fontFamily: fonts.BGFlameBold,
    fontWeight: '700',
  },
  producttitleText: {
    color: '#343434',
    fontSize: fontSize.fs15,
    fontFamily: fonts.BGFlameBold,
    fontWeight: '700',
    marginVertical: 5,
  },
  productmodifireText: {
    fontWeight: '700',
    color: '#555555',
    fontSize: fontSize.fs13,
    marginVertical: 5,
    fontFamily: fonts.BGFlameBold,
  },
  orderproductText: {
    fontWeight: '400',
    color: '#555555',
    fontSize: fontSize.fs13,
    marginVertical: 5,
    fontFamily: fonts.BGFlameLight,
  },
  orderpriceText: {
    fontWeight: '700',
    color: '#555555',
    fontSize: fontSize.fs14,
    marginVertical: 5,
    fontFamily: fonts.BGFlameLight,
  },
  orderpricedisplayText: {
    fontWeight: '700',
    color: '#555555',
    fontSize: fontSize.fs14,
    marginVertical: 5,
    fontFamily: fonts.BGFlameLight,
  },
  date: {
    color: '#555555',
    fontSize: fontSize.fs12,
    fontFamily: fonts.BGFlame,
  },
  repeatTxt: {
    color: colors.headerbg,
    fontSize: fontSize.fs15,
    fontFamily: fonts.BGFlameBold,
  },
  place: {
    color: '#777676',
    fontSize: fontSize.fs15,
    fontFamily: fonts.BGFlame,
    lineHeight: 30,
    fontWeight: '400',
  },
  locationTextAdd: {
    color: '#343434',
    fontSize: fontSize.fs14,

    fontWeight: '700',
  },
  priceTxt: {
    color: '#343434',
    fontSize: fontSize.fs13,
    fontFamily: fonts.BGFlameBold,
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
    marginHorizontal: '5%',
    marginVertical: '3%',
    backgroundColor: colors.white,
    borderRadius: 10,
    ...commonStyles.shadowStyles,
    paddingBottom: 20,
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

  dottedLine: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'black',

    lineHeight: 1,
    backgroundColor: colors.primary,
  },
});
