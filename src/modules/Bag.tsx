import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, Image, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {API_Ordering, StatusCodes} from '../api';
import {AddToItemButtonWIthCheckout, BackButton, CheckOutTaxItem, ItemCounter, Separator, WhiteBox} from '../components';
import {images, screenName} from '../core';
import {navigationRef} from '../navigation/RootNavigation';
import {dispatch} from '../redux';
import {useAppSelector} from '../redux/hooks';
import {updateQty} from '../redux/modules/bagSlice';
import {colors, commonStyles, fonts, ms, vs} from '../styles';
import fontSize from '../styles/fonts';
import {Item} from '../types';
import {StackScreenRouteProp} from '../types/navigationTypes';
import {prettyPrint, showDangerMessage} from '../utils/functions';
import {PriceTag} from './OrderDetailPageComponents';
import TaxFeesBlock from '../components/TaxFeesBlock';
import {ComponentMatrix} from '../constants/constants';
import {useFocusEffect} from '@react-navigation/native';
export interface Root {
  subTotal: number;
  tax: number;
  taxDetails: TaxDetail[];
  total: number;
  serviceCharge: ServiceCharge;
  appliedCoupon: any;
  orderFee: number;
  deliveryFee: number;
  accumatedDeliveryFee: number;
  loyaltyDiscount: number;
  discount: number;
  pointsUsed: any;
  disableOrdering: boolean;
  ihdFee: number;
  tip?: string | number;
}
export interface TaxDetail {
  name: string;
  rate?: number;
  taxId: string;
  amount: number;
}
export interface ServiceCharge {
  amount: number;
  name: string;
  taxId: string;
}
const Bag: React.FC<NativeStackScreenProps<StackScreenRouteProp, 'Bag'>> = ({navigation, route}) => {
  const itemBag = useAppSelector((state) => state.itemBag);
  const {items, restaurantId, locationId, method, deliveryAddress, locationAddress, deliveryZoneId, deliveryMethod} = itemBag;
  console.log(items);
  const [reload, setReload] = useState(false);
  const [total, setTotal] = useState<Root>({
    subTotal: 0,
    tax: 0,
    taxDetails: [],
    total: 0,
    serviceCharge: {
      amount: 0,
      name: '',
      taxId: '',
    },
    appliedCoupon: null,
    orderFee: 0,
    deliveryFee: 0,
    accumatedDeliveryFee: 0,
    loyaltyDiscount: 0,
    discount: 0,
    pointsUsed: null,
    disableOrdering: false,
    ihdFee: 0,
  });

  useFocusEffect(
    useCallback(() => {
      setReload(!reload);
    }, [items]),
  );

  useEffect(() => {
    if (items.length == 0) {
      return;
    }

    const billing_data: any = {
      data: items.map((item: Item) => ({
        _id: item.id,
        qty: item.quantity,
        description: item.description,
        modifiers: item.toppings.map((topping: any) => {
          if (topping?.selectedSubModifier) {
            return {
              product_id: topping.id || topping.product_id,
              product_name: topping?.product_name,
              price: topping.price,
              name: topping.name,
              qty: item.quantity,
              selectedModifier: {
                label: topping?.selectedSubModifier?.label,
                value: topping?.selectedSubModifier?.value,
              },
              selectedParentValue: {label: '', value: ''},
            };
          } else if (topping?.advancedPizzaOptions) {
            return {
              advancedPizzaOptions: topping?.advancedPizzaOptions,
              enableParentModifier: topping?.enableParentModifier,
              defaultSelected: topping?.defaultSelected,
              name: topping?.name,
              product_name: topping?.product_name,
              price: topping?.price,
              extraPrice: topping?.extraPrice,
              halfPrice: topping?.halfPrice,
              subModifiers: [],
              product_id: topping.id || topping.product_id,
              selectedParentValue: {label: '', value: ''},
              selectedParentValues: [],
              side: String(topping?.side)?.toLowerCase(),
              size: String(topping?.size)?.toLowerCase(),
              sort: 0,
            };
          } else {
            return {
              product_id: topping.id || topping.product_id,
              product_name: topping?.product_name,
              price: topping.price,
              name: topping.name,
              qty: topping?.quantity,
              selectedParentValue: {label: '', value: ''},
            };
          }
        }),
        name: item.name,
        price: item.price,
        note: item.specialInstructionsText,
      })),
      coupon: '',
      points: '',
      location: locationId,
      restaurant: restaurantId,
      method: method,
      address: {},
    };
    if (method === 'delivery') {
      billing_data.deliveryMethod = deliveryMethod;
      billing_data.deliveryZoneId = deliveryZoneId;
      billing_data.address = deliveryAddress;
    }
    console.log('billing_data', billing_data);
    API_Ordering.billing(billing_data)
      .then((response) => {
        console.log('billing_data response', response);
        if (response.code === StatusCodes.SUCCESS) {
          setTotal(response.data);
        } else {
          showDangerMessage('Something went wrong.');
        }
      })
      .catch((error) => {
        showDangerMessage(error?.message);
        console.log({error});
      });
  }, [reload]);
  return (
    <View style={commonStyles.mainView}>
      <SafeAreaView style={{backgroundColor: colors.headerbg}} />
      <StatusBar barStyle={'light-content'} hidden={false} backgroundColor={colors.headerbg} />
      <View style={bagStyles.headerView}>
        <BackButton style={{marginLeft: ComponentMatrix.HORIZONTAL_16}} onPress={() => navigation.goBack()} />
        <View style={bagStyles.centerView}>
          <Text style={bagStyles.txt}>Bag</Text>
        </View>
      </View>
      {items.length > 0 ? (
        <ScrollView style={{backgroundColor: colors.white}} showsVerticalScrollIndicator={false}>
          {/* <View style={commonStyles.mainView}> */}
          <WhiteBox>
            <FlatList
              renderItem={(props) => (
                <BagItem
                  {...props}
                  onChangeValueOnItemCounter={(newValue: number) => {
                    dispatch(
                      updateQty({
                        index: props.index,
                        quantity: newValue,
                      }),
                    );
                    setReload(!reload);
                  }}
                  itemCounterKey={props.index + new Date().getTime()}
                />
              )}
              data={itemBag.items}
              keyExtractor={(item, index) => `${item.id}`}
              ItemSeparatorComponent={() => <Separator />}
            />
          </WhiteBox>
          <WhiteBox style={{marginTop: vs(10)}}>
            <FlatList
              data={[
                {type: 'simple', title: 'Sub Total', price: total.subTotal},
                {
                  // type: 'TaxFees',
                  // data: {
                  //   tax: total.tax,
                  //   taxDetails: total.taxDetails,
                  //   serviceCharge: total.serviceCharge,
                  // }
                  type: 'TaxFees',
                  data: {
                    tax: total.tax,
                    taxDetails: total.taxDetails,
                    serviceCharge: total.serviceCharge,
                    'Ordering Fee': total.orderFee,
                    'Delivery Fee': total.deliveryFee,
                    'ihd Fee': total.ihdFee,
                  },
                },
                // {type: 'simple', title: 'Online Ordering', price: total.orderFee},
                {type: 'simple', title: 'Total', price: total.total},
              ]}
              renderItem={({item, index}) => {
                return item.type === 'simple' ? <CheckOutTaxItem item={item} /> : <TaxFeesBlock data={item.data} />;
              }}
            />
          </WhiteBox>
          <AddToItemButtonWIthCheckout showType={'Checkout'} total={Number(total?.total ?? '0').toFixed(2)} onPress={() => navigation.navigate('OrderCheckout')} />
        </ScrollView>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image style={{height: 80, width: 80, marginTop: -100}} source={images.shoppingcart} />
          <Text
            style={{
              fontFamily: fonts.BGFlameBold,
              fontSize: fontSize.fs18,
              padding: 10,
              color: '#343434',
              fontWeight: '700',
            }}>
            GOOD FOOD IS ALWAYS COOKING
          </Text>
          <Text
            style={{
              fontFamily: fonts.BGFlameBold,
              fontSize: fontSize.fs18,
              padding: 0,
              color: '#777676',
              fontWeight: '400',
            }}>
            Your cart is empty
          </Text>
        </View>
      )}
    </View>
  );
};
export default Bag;
export const bagStyles = StyleSheet.create({
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
  contentContainerStyle: {
    paddingHorizontal: 15,
    paddingVertical: 30,
  },
  leftViewMain: {
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
    position: 'absolute',
    width: '100%',
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
    color: '#ABABAB',
    fontSize: fontSize.fs16,
    fontFamily: fonts.BGFlameBold,
    fontWeight: 'normal',
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
    marginHorizontal: '4%',
    marginVertical: '1%',
    backgroundColor: colors.white,
    borderRadius: 10,
    ...commonStyles.shadowStyles,
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

export const BagItem = (props: any) => {
  const {item, index, onChangeValueOnItemCounter, editable = true, itemCounterKey} = props;

  return (
    <View style={{}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text style={[bagStyles.locationText, {color: colors.darkBlackText, flex: 1}]}>{item?.name}</Text>
        <PriceTag price={item?.price} />
        {false ? (
          <Pressable
            style={{marginLeft: ms(11)}}
            onPress={() => {
              navigationRef.navigate(screenName.OrderDetailPage, {
                item_id: item.id,
                isCommingFromBag: true,
              });
            }}>
            <Image style={bagStyles.editIcon} source={images.icEditIcon} />
          </Pressable>
        ) : null}
      </View>
      {editable ? <ItemCounter key={itemCounterKey} from={'BagItem'} onChangeValue={onChangeValueOnItemCounter} value={item.quantity} /> : null}
      <FlatList
        {...(item?.toppings?.length > 0 && {
          ListHeaderComponent: (
            <View style={{marginTop: 0}}>
              <Text style={[bagStyles.toppingsTxt, {lineHeight: 30}]}>Toppings</Text>
            </View>
          ),
        })}
        data={item?.toppings ?? []}
        renderItem={({item: itemOfTopping}) => {
          let advancedPizzaOptionPrice = 0;
          if (itemOfTopping.advancedPizzaOptions) {
            if (itemOfTopping.size === 'Regular') {
              if (itemOfTopping.side === 'All') {
                advancedPizzaOptionPrice = itemOfTopping.price;
              } else {
                advancedPizzaOptionPrice = itemOfTopping.halfPrice;
              }
            } else {
              if (itemOfTopping.side === 'All') {
                advancedPizzaOptionPrice = itemOfTopping.extraPrice;
              } else {
                advancedPizzaOptionPrice = itemOfTopping.extraPrice / 2;
              }
            }
          }
          return (
            <View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{flex: 1}}>
                  <Text style={bagStyles.itemTxt}>{itemOfTopping.product_name}</Text>
                  {Boolean(itemOfTopping?.quantity) && (
                    <Text style={[bagStyles.itemTxt, {color: '#A49F9F'}]}>
                      {' X'}
                      {itemOfTopping?.quantity}
                    </Text>
                  )}
                </Text>
                <PriceTag price={(itemOfTopping.advancedPizzaOptions ? advancedPizzaOptionPrice : itemOfTopping?.price) * (Boolean(itemOfTopping?.quantity) ? itemOfTopping?.quantity : 1)} />
              </View>
              {itemOfTopping.type === 'checkbox' && Boolean(itemOfTopping?.selectedSubModifier) && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text style={[bagStyles.itemTxt, {color: '#A49F9F'}]}>{`  - ${String(itemOfTopping?.selectedSubModifier?.label).split(' - ')?.[0]}`}</Text>
                  <PriceTag price={itemOfTopping?.selectedSubModifier?.value} />
                </View>
              )}
            </View>
          );
        }}
      />
      {Boolean(item?.specialInstructionsText?.length) && (
        <>
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
            <Text style={[bagStyles.toppingsTxt, {lineHeight: 30}]}>Special Instructions</Text>
          </View>
          <Text style={[bagStyles.itemTxt, {lineHeight: 24}]}>{item?.specialInstructionsText}</Text>
        </>
      )}
    </View>
  );
};
