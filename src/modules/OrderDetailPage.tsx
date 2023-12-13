import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useReducer, useRef, useState} from 'react';
import {Alert, Dimensions, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, Pressable, View, useWindowDimensions, StatusBar, Modal, ActivityIndicator} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {useDispatch} from 'react-redux';
import {API_Ordering, StatusCodes} from '../api';
import {Modifier} from '../api/types';
import {AddToItemButtonWIthCheckout, BagButton, ItemCounter, Separator} from '../components';
import {images} from '../core';
import {useAppSelector} from '../redux/hooks';
import {addItemToBagOrInBagItemQuantity} from '../redux/modules/bagSlice';
import {colors, commonStyles, fontSize, fonts, ms} from '../styles';
import {StackScreenRouteProp} from '../types/navigationTypes';
import {createArrayIfNot, prettyPrint, showDangerMessage, showSuccessMessage} from '../utils/functions';
import {AddSpecialInstructions, CheckBoxItemWithTitle, DropdownWithTitle, RadioButtonsGroupWithTitle} from './OrderDetailPageComponents';
import {HIT_SLOP} from '../constants/constants';
import {startLoading, stopLoading} from '../redux/modules/loading-slice';
import compact from 'lodash/compact';
import FastImage from 'react-native-fast-image';
const {width} = Dimensions.get('window');

const OrderDetailPage: React.FC<NativeStackScreenProps<StackScreenRouteProp, 'OrderDetailPage'>> = ({navigation, route}) => {
  const {isCommingFromBag, item_id} = route.params;
  const [itemQuantity, setItemQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const {width} = useWindowDimensions();
  const flRef = useRef<FlatList>(null);
  const dispatch = useDispatch();
  const {items} = useAppSelector((state) => state.itemBag);

  const [itemDetail, setItemDetails] = useReducer(
    (state: any, action: any) => {
      if (action.type === 'ALTER_CHECK_MODIFIRE') {
        return {
          ...state,
          modifiers: state.modifiers.map((modifier: any) => ({
            ...modifier,
            checked: !modifier.checked,
          })),
        };
      }
      if (action.type === 'init') {
        return {...state, ...action.payload};
      }
      if (action.type === 'setSpecialInstructions') {
        return {...state, specialInstructionsText: action.payload};
      }
      return {...state};
    },
    {
      _id: '',
      name: '',
      description: '',
      imageUrl: undefined,
      isAlchohol: false,
      isAvailableDaily: true,
      isCombo: false,
      isPizza: false,
      isSuggested: false,
      method: 'all',
      modifiers: [],
      plu: '',
      price: 0,
      subProducts: [],
      glutenFree: false,
      vegetarian: false,
      vegan: false,
      loyaltyPoint: 0,
      quantity: 0,
      specialInstructionsText: '',
    },
  );
  const [itemModifiers, setItemModifiers] = useState(Array.from({length: itemDetail.modifiers.length}));

  const makeDefaultSelection = () => {};

  useEffect(() => {
    const fetchItem = async () => {
      // dispatch(startLoading());
      setIsLoading(true);
      try {
        if (item_id) {
          const res = await API_Ordering.find_one_item(item_id);

          const {data, code} = res;
          if (code === StatusCodes.SUCCESS) {
            setItemDetails({
              type: 'init',
              payload: {
                ...data,
                checked: false,
                modifiers: Object.entries(data?.modifiers ?? {}).map(([key, modifier]: any) => {
                  return {
                    ...modifier,
                    id: key,
                    checked: false,
                    subProducts: createArrayIfNot(modifier?.subProducts).map((subProduct) => ({
                      ...subProduct,
                      subModifiers: createArrayIfNot(subProduct?.subModifiers).map((subModifier, index) => ({
                        ...subModifier,
                        id: `${key}${subModifier?.name}`,
                      })),
                    })),
                  };
                }),
              },
            });
          }
        }
      } catch (error) {
        console.log({error});
      } finally {
        // dispatch(stopLoading());
        setIsLoading(false);
      }
    };
    fetchItem();
  }, []);

  const getThisItemTotal = () => {
    const toppings = itemModifiers
      .flatMap((itemModifier, index) => {
        if (Array.isArray(itemModifier)) {
          return itemModifier.filter((f) => f != null && typeof f !== 'undefined').map((x) => x);
        }
        return itemModifier;
      })
      .filter((f) => f != null && typeof f !== 'undefined');

    let sumOfTotal: any = 0;
    if (Array.isArray(toppings) && toppings.length > 0) {
      sumOfTotal = toppings?.reduce((a: any, c: any) => {
        if (c?.advancedPizzaOptions) {
          let advanceTotal = 0;
          if (c?.size === 'Regular' && c?.side === 'All') {
            advanceTotal = c?.price;
          } else if (c?.size === 'Regular' && c?.side !== 'All') {
            advanceTotal = c?.price / 2;
          } else if (c?.size === 'Extra' && c?.side === 'All') {
            advanceTotal = c?.extraPrice;
          } else if (c?.size === 'Extra' && c?.side !== 'All') {
            advanceTotal = c?.extraPrice / 2;
          }
          return a + advanceTotal;
        } else {
          let toppingsQty = c?.quantity ?? 1;
          return a + toppingsQty * c?.price;
        }
      }, 0);
    }
    const thisItemTotal = itemQuantity * (itemDetail?.price + sumOfTotal);
    return Math.round((thisItemTotal + Number.EPSILON) * 100) / 100;
  };

  const onPressAddToItemButton = (isConfirmationTaked = false) => {
    if (itemQuantity === 0) {
      showDangerMessage('Please select quantity');
      return;
    }

    // showDangerMessage('All the required modifiers must be selected');

    if (itemDetail.isAlchohol && !isConfirmationTaked) {
      Alert.alert('Confirmation', 'Age 18+ ?', [
        {
          text: 'Cancel',
          onPress: () => {},
        },
        {
          text: 'OK',
          onPress: () => {
            onPressAddToItemButton(true);
          },
        },
      ]);
      return;
    }

    for (let index = 0; index < itemDetail.modifiers.length; index++) {
      const element: Modifier = itemDetail.modifiers[index];
      console.log(element);
      const {isRequired, min, max, enableQtyUpdate} = element;
      if (element.type === 'checkbox') {
        const compactedModifiers = compact(itemModifiers[index] as any);

        if (enableQtyUpdate) {
          const sumQty: number = compact(itemModifiers[index] as any).reduce((sum, obj) => sum + (obj.quantity || 1), 0) as number;
          console.log(element.name, min, max, sumQty);
          if ((isRequired || sumQty != 0) && min && sumQty < min) {
            showDangerMessage('Please select minimum modifier for ' + element.name + '.');
            return;
          } else if ((isRequired || sumQty != 0) && max && sumQty > max) {
            showDangerMessage(`You can select ${max} maximum for ${element.name}.`);
            // showDangerMessage('Please select less then maximum modifier for ' + element.name + '.');
            return;
          }
        } else {
          if (isRequired && compactedModifiers.length === 0) {
            showDangerMessage('Please select modifier for ' + element.name + '.');
            return;
          } else if ((isRequired || compactedModifiers.length != 0) && min && compactedModifiers.length < min) {
            showDangerMessage('Please select minimum modifier for ' + element.name + '.');
            return;
          } else if ((isRequired || compactedModifiers.length != 0) && max && compactedModifiers.length > max) {
            showDangerMessage(`You can select ${max} maximum for ${element.name}.`);
            // showDangerMessage('Please select less then maximum modifier for ' + element.name + '.');
            return;
          }
        }
      } else if (isRequired && typeof itemModifiers[index] === 'undefined') {
        showDangerMessage('Please select modifier ' + element.name + '.');
        return;
      }
    }

    const toppings = itemModifiers
      .flatMap((itemModifier, index) => {
        if (Array.isArray(itemModifier)) {
          return itemModifier.filter((f) => f != null && typeof f !== 'undefined').map((x) => x);
        }
        return itemModifier;
      })
      .filter((f) => f != null && typeof f !== 'undefined');

    const dish = {
      description: itemDetail.description,
      id: itemDetail._id,
      name: itemDetail.name,
      price: itemDetail.price,
      quantity: itemQuantity,
      specialInstructionsText: itemDetail.specialInstructionsText,
      toppings: toppings,
    };
    dispatch(addItemToBagOrInBagItemQuantity(dish));
    showMessage({
      message: 'Item is added to Bag',
      type: 'success',
    });
  };

  return (
    <View style={commonStyles.mainView}>
      <SafeAreaView style={{backgroundColor: colors.headerbg}} />
      <StatusBar barStyle={'light-content'} hidden={false} backgroundColor={colors.headerbg} />
      <View style={orderDetailStyles.headerView}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={HIT_SLOP}>
          <Image source={images.icHeaderBack} />
        </Pressable>
        <BagButton />
      </View>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView contentContainerStyle={{}} showsVerticalScrollIndicator={false}>
          <View style={[orderDetailStyles.restaurantItemsWrapper]}>
            {itemDetail?.imageUrl && <FastImage style={orderDetailStyles.dummyImage} source={{uri: itemDetail?.imageUrl}} />}
            <View style={{marginHorizontal: width * 0.025}}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, marginTop: 15}}>
                <Text style={[orderDetailStyles.locationText, {color: colors.darkBlackText, flex: 1}]}>{itemDetail?.name}</Text>
                <Text style={[orderDetailStyles.locationText, {color: colors.darkBlackText}]}>${itemDetail?.price}</Text>
              </View>
              {Boolean(itemDetail?.description) && (
                <View style={{marginTop: 0}}>
                  <Text style={orderDetailStyles.itemTxt}>{itemDetail?.description}</Text>
                </View>
              )}
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <ItemCounter
                  from={'OrderDetailPage'}
                  value={itemQuantity}
                  onChangeValue={(nextValue) => {
                    setItemQuantity(nextValue);
                  }}
                />
                <View style={{marginTop: 10, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <View style={{flexDirection: 'row', marginHorizontal: 4}}>
                    {!!itemDetail.glutenFree && <Image style={{marginRight: 8}} source={images.DummyIcon1} />}
                    {!!itemDetail.vegan && <Image style={{marginRight: 8}} source={images.DummyIcon2} />}
                    {!!itemDetail.vegetarian && <Image style={{padding: 4}} source={images.DummyIcon3} />}
                  </View>
                </View>
              </View>
              <FlatList
                ref={flRef}
                data={itemDetail.modifiers}
                {...(itemDetail.modifiers.length && {
                  ListHeaderComponent: <Text style={styles.toppingsTxt}>Toppings</Text>,
                })}
                ListFooterComponent={<Separator />}
                _ItemSeparatorComponent={() => <View style={{height: 1, backgroundColor: '#BDBDBD', marginTop: 10}} />}
                style={{flexGrow: 0}}
                renderItem={({item, index}) => {
                  switch (item.type) {
                    case 'checkbox':
                      return (
                        <CheckBoxItemWithTitle
                          title={item.name}
                          item={item}
                          qty={item.enableQtyUpdate ? (compact(itemModifiers[index] as any).reduce((sum, obj) => sum + (obj.quantity || 1), 0) as number) : compact(itemModifiers[index] as any).length}
                          onChangeValue={(data) => {
                            setItemModifiers((oldM) => {
                              oldM[index] = data;
                              return [...oldM];
                            });
                          }}
                        />
                      );
                    case 'select':
                      return (
                        <DropdownWithTitle
                          title={item.name}
                          item={item}
                          data={item?.subProducts}
                          onChangeValue={(data) => {
                            setItemModifiers((oldM) => {
                              oldM[index] = data;
                              return [...oldM];
                            });
                          }}
                        />
                      );
                    case 'radio':
                      const size = ms(20);
                      const buttons = item?.subProducts?.map((subProduct: any) => {
                        return {
                          value: subProduct?.product_id,
                          id: subProduct?.product_id,
                          label: `${subProduct?.product_name}`,
                          price: subProduct?.price,
                          size,
                          containerStyle: {
                            marginHorizontal: 0,
                          },
                          labelStyle: {
                            fontSize: fontSize.fs13,
                            fontFamily: fonts.BGFlame,
                            color: '#777676',
                            fontWeight: '400',
                          },
                          borderColor: '#DBDBDB',
                          color: '#565656',
                        };
                      });
                      return (
                        <RadioButtonsGroupWithTitle
                          radioButtons={buttons}
                          {...item}
                          item={item}
                          onChangeValue={(data) => {
                            setItemModifiers((oldM) => {
                              oldM[index] = data;
                              return [...oldM];
                            });
                          }}
                        />
                      );
                    default:
                      return null;
                  }
                }}
              />
              <AddSpecialInstructions
                textInputProps={{
                  onChangeText: (text) => {
                    setItemDetails({
                      type: 'setSpecialInstructions',
                      payload: text,
                    });
                  },
                }}
              />
            </View>
          </View>
        </ScrollView>
        <AddToItemButtonWIthCheckout total={getThisItemTotal()} showType="Add" onPress={() => onPressAddToItemButton()} />
      </SafeAreaView>
      <Modal animationType="none" transparent={true} visible={isLoading}>
        <View style={[styles.container, StyleSheet.absoluteFill]}>
          <View style={styles.whiteBox}>
            <ActivityIndicator color={'#DC4135af'} size={40} />
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default OrderDetailPage;
const styles = StyleSheet.create({
  toppingsTxt: {
    fontFamily: fonts.BGFlameBold,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  whiteBox: {
    aspectRatio: 1,
    backgroundColor: 'white',
    height: ms(50),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ms(5),
  },
});
export const orderDetailStyles = StyleSheet.create({
  headerView: {
    height: 100,
    backgroundColor: colors.headerbg,

    flexDirection: 'row',
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
  locationText: {
    color: '#ABABAB',
    fontSize: fontSize.fs16,
    fontFamily: fonts.BGFlameBold,
  },
  locationTextAdd: {
    color: '#343434',
    fontSize: fontSize.fs14,
    fontWeight: '700',
  },
  itemTxt: {
    fontSize: fontSize.fs13,
    fontFamily: fonts.BGFlame,
    color: '#777676',
    fontWeight: '700',
  },
  addText: {
    color: colors.headerbg,
    fontSize: fontSize.fs16,
    fontFamily: fonts.BGFlameBold,
  },
  toppingsTxt: {
    fontSize: fontSize.fs15,
    fontFamily: fonts.BGFlame,
    color: colors.darkBlackText,
    fontWeight: '700',
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
    marginHorizontal: width * 0.04,
    marginVertical: width * 0.01,
    backgroundColor: colors.white,
    borderRadius: 10,
    ...commonStyles.shadowStyles,
    marginBottom: 10,
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
    resizeMode: 'stretch',
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
});
// useEffect(() => {
//   if (item_id) {
//     API_Ordering.find_one_item(item_id)
//       .then((res) => {
//         const {data} = res;

//         if (typeof isCommingFromBag !== 'undefined') {
//           setItemDetails({
//             type: 'init',
//             payload: {
//               ...data,
//               checked: false,
//               modifiers: Object.entries(data?.modifiers ?? {}).map(([key, modifier]: any) => {
//                 return {
//                   ...modifier,
//                   id: key,
//                   checked: false,
//                   subProducts: createArrayIfNot(modifier?.subProducts).map((subProduct) => ({
//                     ...subProduct,
//                     subModifiers: createArrayIfNot(subProduct?.subModifiers).map((subModifier, index) => ({
//                       ...subModifier,
//                       id: `${key}${subModifier?.name}`,
//                     })),
//                   })),
//                 };
//               }),
//             },
//           });
//         } else {
//           setItemDetails({
//             type: 'init',
//             payload: {
//               ...data,
//               checked: false,
//               modifiers: Object.entries(data?.modifiers ?? {}).map(([key, modifier]: any) => ({
//                 ...modifier,
//                 id: key,
//                 checked: false,
//                 subProducts: createArrayIfNot(modifier?.subProducts).map((subProduct) => ({
//                   ...subProduct,
//                   subModifiers: createArrayIfNot(subProduct?.subModifiers).map((subModifier, index) => ({
//                     ...subModifier,
//                     id: `${key}${subModifier?.name}`,
//                   })),
//                 })),
//               })),
//             },
//           });
//         }
//         setItemDetails({
//           type: 'init',
//           payload: {
//             ...data,
//             checked: false,
//             modifiers: Object.entries(data?.modifiers ?? {}).map(([key, modifier]: any) => ({
//               ...modifier,
//               id: key,
//               checked: false,
//               subProducts: [...(modifier?.subProducts || [])].map((subProduct) => ({
//                 ...subProduct,
//                 subModifiers: [...(subProduct?.subModifiers || [])].map((subModifier, index) => ({
//                   ...subModifier,
//                   id: `${key}${subModifier?.name}`,
//                 })),
//               })),
//             })),
//           },
//         });
//       })
//       .catch((error) => {
//
//       });
//   }
// }, []);
