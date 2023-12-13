import {NativeStackScreenProps} from '@react-navigation/native-stack';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, FlatList, Image, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Region} from 'react-native-maps';
import {batch} from 'react-redux';
import {API_Ordering, StatusCodes} from '../api';
import {ResponseChooseLocation} from '../api/types';
import {AddDeliveryAddress, BackButton, BagButton, FavoriteAndUnfavoriteButton, OrderTimeSelection, RenderJSON, SlightDelayInDelivery} from '../components';
import {ComponentMatrix} from '../constants/constants';
import {images} from '../core';
import {getCurrentLocation} from '../core/GlobalLocation';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {selectLocation, selectLocationMethod, setDeliveryAddress, setOrderTiming} from '../redux/modules/bagSlice';
import {colors, commonStyles, ms, vs} from '../styles';
import {fonts, fontSize} from '../styles/fonts';
import {StackScreenRouteProp} from '../types/navigationTypes';
import {showDangerMessage} from '../utils/functions';

const ChooseLocation: React.FC<NativeStackScreenProps<StackScreenRouteProp, 'ChooseLocation'>> = ({navigation, route}) => {
  const {_id, userId, openlocation = false, locationId} = route?.params ?? {};
  const [modalShowSlightDelayInDelivery, setModalShowSlightDelayInDelivery] = useState(false);
  const [modalShowAddDeliveryAddress, setModalShowAddDeliveryAddress] = useState(false);
  const [modalShowOrderTime, setModalShowOrderTime] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ResponseChooseLocation | null>(null);
  const [allLocationData, setAllLocationData] = useState<ResponseChooseLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [initialRegion, setInitialRegion] = useState<Region | undefined>(undefined);
  const dispatch = useAppDispatch();
  const {method} = useAppSelector((state) => state.itemBag);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    const init = async () => {
      const responses = await Promise.allSettled([
        getCurrentLocation(),
        API_Ordering.find_all_location({
          restaurant: userId._id,
        }),
      ]);

      const [locationResponse, findAllLocationResponse] = responses;

      if (locationResponse.status === 'fulfilled') {
        const region: Region = {
          ...locationResponse.value,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        setInitialRegion(region);
      }

      if (findAllLocationResponse.status === 'fulfilled') {
        setIsLoading(false);
        if (findAllLocationResponse.value.code === StatusCodes.SUCCESS) {
          setAllLocationData(findAllLocationResponse.value?.data);
        }
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (openlocation && locationId) {
      const item = allLocationData.find((l) => l._id === locationId);
      if (item?.enableIhd || item?.pickupDelivery?.enableDelivery) {
        setModalShowAddDeliveryAddress(true);
        setSelectedItem(item);
        batch(() => {
          dispatch(selectLocation({locationId: item?._id, locationAddress: item.displayAddress}));
          dispatch(selectLocationMethod({method: 'delivery'}));
        });
      }
    }
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.fitToCoordinates(allLocationData.map((marker) => ({latitude: marker.latLng[0], longitude: marker.latLng[1]})));
        mapRef.current.fitToElements({
          edgePadding: {top: 100, right: 100, bottom: 100, left: 100},
        });
      }
    }, 100);
  }, [openlocation, allLocationData]);

  return (
    <View style={commonStyles.mainView}>
      <SafeAreaView style={{backgroundColor: colors.headerbg}} />
      <StatusBar barStyle={'light-content'} hidden={false} backgroundColor={colors.headerbg} />
      <View style={styles.headerView}>
        <BackButton style={{marginLeft: ComponentMatrix.HORIZONTAL_16}} onPress={() => navigation.goBack()} />
        <View style={styles.centerView}>
          <Text style={styles.headerTxt}>Choose Location</Text>
        </View>
        <View style={{flexDirection: 'row', marginRight: ComponentMatrix.HORIZONTAL_16}}>
          <FavoriteAndUnfavoriteButton />
          <BagButton />
        </View>
      </View>
      {!isLoading ? (
        <ScrollView style={{marginTop: -ms(25)}}>
          <View style={{width: Dimensions.get('screen').width, aspectRatio: 14 / 10}}>
            <MapView ref={mapRef} initialRegion={initialRegion} provider={PROVIDER_GOOGLE} mapPadding={{top: ms(25), bottom: 0, left: 0, right: 0}} style={{flex: 1}} showsUserLocation>
              {allLocationData.map((marker: any, index: number) => {
                return <Marker key={`${index}`} coordinate={{latitude: marker.latLng[0], longitude: marker.latLng[1]}} />;
              })}
            </MapView>
          </View>
          <View style={{height: vs(50), justifyContent: 'center'}}>
            <Pressable
              style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start', marginHorizontal: ComponentMatrix.HORIZONTAL_16}}
              onPress={() => {
                navigation.goBack();
              }}>
              <Image style={styles.backIcon} source={images.icLeft} />
              <Text style={{textAlign: 'center', marginTop: 2, color: colors.headerbg, fontSize: fontSize.fs15, fontFamily: fonts.BGFlameBold, alignItems: 'center'}}>Back</Text>
            </Pressable>
          </View>
          <FlatList
            data={allLocationData}
            renderItem={({item, index}) => {
              // const show_delivery_btn = (!item.isClosedDelivery || item.willDeliveryOpenToday) && (item.enableIhd || item.pickupDelivery.enableDelivery);
              // const show_pickup_btn = (!item.isClosedPickup || item.willPickupOpenToday) && item.pickupDelivery.enablePickup;
              const show_delivery_btn = item.enableIhd || item.pickupDelivery.enableDelivery;
              const show_pickup_btn = item.pickupDelivery.enablePickup;
              if (!show_delivery_btn && !show_pickup_btn) {
                return null;
              }

              return (
                <View key={`${index}`} style={[styles.locationItemsWrapper, {marginTop: 15}]}>
                  <View style={{flexDirection: 'row', paddingTop: 15, paddingHorizontal: 15}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.addressTxt}>{item.name}</Text>
                      <View style={{paddingTop: 5}}>
                        <Text style={[styles.addressTxt, {fontSize: fontSize.fs13, color: '#A0A0A0', fontFamily: fonts.BGFlame}]}>{item.city}</Text>
                      </View>
                    </View>
                    {(item.isClosedPickup && item.isClosedDelivery) || (!item.willDeliveryOpenToday && !item.willPickupOpenToday) ? (
                      <View style={{backgroundColor: '#FFECEA', borderRadius: 5, paddingHorizontal: 8, justifyContent: 'center', alignItems: 'center', height: vs(25)}}>
                        <Text style={{color: 'red', fontSize: fontSize.fs11, fontFamily: fonts.BGFlame, fontWeight: '700'}}>{`${!item.willDeliveryOpenToday && !item.willPickupOpenToday ? 'CLOSED TODAY' : 'CURRENTLY CLOSED'}`}</Text>
                      </View>
                    ) : (
                      <View style={{backgroundColor: '#DDFFD1', borderRadius: 5, paddingHorizontal: 8, justifyContent: 'center', alignItems: 'center', height: vs(25)}}>
                        <Text style={{color: '#258E00', fontSize: fontSize.fs11, fontFamily: fonts.BGFlame, fontWeight: '700'}}>OPEN</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.locationTxt}>{item.displayAddress}</Text>
                  <View style={{flexDirection: 'row', marginTop: 20, justifyContent: 'space-between', alignSelf: 'center', marginHorizontal: ms(8)}}>
                    {show_delivery_btn && (
                      <Pressable
                        style={[styles.buttonWrapper]}
                        onPress={() => {
                          setModalShowAddDeliveryAddress(true);
                          setSelectedItem(item);
                          batch(() => {
                            dispatch(selectLocation({locationId: item?._id, locationAddress: item.displayAddress}));
                            dispatch(selectLocationMethod({method: 'delivery'}));
                          });
                        }}>
                        <Text style={styles.cardTxt}>Delivery</Text>
                        {item.schedule.delivery != null ? (
                          <Text style={styles.cardstimeTxt}>{`${moment(item.schedule.delivery.startTime, 'HH:mm').format('h:mm A')} - ${moment(item.schedule.delivery.endTime, 'HH:mm').format('h:mm A')}`}</Text>
                        ) : (
                          <Text style={styles.cardstimeTxt}>Unavailable</Text>
                        )}
                      </Pressable>
                    )}
                    {show_pickup_btn && (
                      <Pressable
                        style={[styles.buttonWrapper1]}
                        // disabled={item.schedule.pickup == null || item.isClosedPickup}
                        onPress={() => {
                          batch(() => {
                            dispatch(selectLocation({locationId: item?._id, locationAddress: item.displayAddress}));
                            dispatch(selectLocationMethod({method: 'pickup'}));
                            dispatch(setDeliveryAddress({}));
                          });
                          setModalShowOrderTime(true);
                          setSelectedItem(item);
                        }}>
                        <Text style={[styles.cardTxt, {color: colors.headerbg}]}>Pickup</Text>
                        {item.schedule.pickup !== null ? (
                          <Text style={[styles.cardstimeTxt, {color: colors.headerbg}]}>{`${moment(item.schedule.pickup.startTime, 'HH:mm').format('h:mm A')} - ${moment(item.schedule.pickup.endTime, 'HH:mm').format('h:mm A')}`}</Text>
                        ) : (
                          <Text style={[styles.cardstimeTxt, {color: colors.headerbg}]}>Unavailable</Text>
                        )}
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            }}
          />
        </ScrollView>
      ) : null}
      <AddDeliveryAddress
        onClose={() => {
          setModalShowAddDeliveryAddress(false);
        }}
        visible={modalShowAddDeliveryAddress}
        navigation={navigation}
        selectedLocation={selectedItem}
        restaurantId={_id}
        setModalShowOrderTime={setModalShowOrderTime}
      />
      <SlightDelayInDelivery onClose={() => setModalShowSlightDelayInDelivery(false)} visible={modalShowSlightDelayInDelivery} />
      <OrderTimeSelection
        onClose={(orderTiming: 'now' | 'later') => {
          setModalShowOrderTime(false);
          setSelectedItem(null);
          dispatch(setOrderTiming(orderTiming));
          if (selectedItem) {
            navigation.navigate('Menu', {
              passedData: {locationId: selectedItem._id, restaurantId: _id, method},
            });
          }
        }}
        onSimpleClose={() => {
          setModalShowOrderTime(false);
          setSelectedItem(null);
        }}
        visible={modalShowOrderTime}
        selectedLocation={selectedItem}
      />
    </View>
  );
};

export default ChooseLocation;

export const styles = StyleSheet.create({
  headerView: {height: 100, backgroundColor: colors.headerbg, marginBottom: 0, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 99},
  centerView: {flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute', width: '100%', alignSelf: 'center'},
  txt: {color: colors.darkBlackText, fontSize: fontSize.fs15, fontFamily: fonts.BGFlameBold, textAlign: 'center'},
  headerTxt: {color: colors.white, fontSize: fontSize.fs20, fontFamily: fonts.BGFlameBold},
  backIcon: {width: 20, height: 20, resizeMode: 'contain', alignSelf: 'center'},
  locationText: {color: '#ABABAB', fontSize: fontSize.fs16, fontFamily: fonts.BGFlameBold, fontWeight: 'normal'},
  addressTxt: {color: colors.headerbg, fontSize: fontSize.fs15, fontFamily: fonts.BGFlameBold, alignItems: 'center', width: '90%'},
  titleTxt: {color: colors.headerbg, fontSize: fontSize.fs15, fontFamily: fonts.BGFlameBold, alignItems: 'center'},
  cardTxt: {fontWeight: '700', color: colors.white, fontSize: fontSize.fs15, fontFamily: fonts.BGFlameBold, textAlign: 'center', lineHeight: 24},
  cardstimeTxt: {fontWeight: '700', color: colors.white, fontSize: fontSize.fs12, fontFamily: fonts.BGFlameLight, textAlign: 'center', lineHeight: 24},
  sampleTxt: {color: '#030303', fontSize: fontSize.fs13, fontFamily: fonts.BGFlame, textAlign: 'center'},
  locationTxt: {color: '#030303', fontSize: fontSize.fs13, fontFamily: fonts.BGFlame, marginTop: 15, marginHorizontal: 15},
  locationItemsWrapper: {marginVertical: '1%', marginHorizontal: ms(18), backgroundColor: colors.white, borderRadius: 10, ...commonStyles.shadowStyles, paddingBottom: 20},
  textInput: {borderWidth: 1, borderColor: '#F0F2F5', paddingLeft: 10, height: vs(50)},
  buttonWrapper: {backgroundColor: colors.headerbg, borderRadius: 10, height: 80, justifyContent: 'center', alignItems: 'center', flex: 1, marginLeft: ms(7), marginRight: ms(4)},
  buttonWrapper1: {backgroundColor: '#FFECEA', borderWidth: 1, borderColor: '#EFEFEF', ...commonStyles.shadowStyles, height: 80, borderRadius: 10, flex: 1, justifyContent: 'center', alignItems: 'center', marginLeft: ms(4), marginRight: ms(7)},
  text: {fontSize: fontSize.fs18, color: colors.black, fontFamily: fonts.BGFlameBold},
  dateBox: {alignItems: 'center', justifyContent: 'center', borderRadius: 8, marginHorizontal: 5, height: vs(50), minWidth: vs(70), backgroundColor: '#FFECEA'},
});
