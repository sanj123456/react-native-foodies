import {NativeStackScreenProps} from '@react-navigation/native-stack';
import axios from 'axios';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ActivityIndicator, Dimensions, FlatList, Image, Modal, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import MapView, {Marker, PROVIDER_GOOGLE, Region} from 'react-native-maps';
import {batch} from 'react-redux';
import {API_Ordering, StatusCodes} from '../api';
import {ResponseChooseLocation} from '../api/types';
import {GOOGLE_URLS} from '../api/url';
import {BackButton, BagButton, FavoriteAndUnfavoriteButton, FieldInput, ListEmptyComponent} from '../components';
import {API_KEYS, ComponentMatrix} from '../constants/constants';
import {images} from '../core';
import {getCurrentLocation, getLocationData, LocationData} from '../core/GlobalLocation';
import {dispatch} from '../redux';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {selectLocation, selectLocationMethod, setDeliveryAddress, setDeliveryMethod, setDeliveryZoneId, setOrderTiming, setScheduledOn} from '../redux/modules/bagSlice';
import {startLoading, stopLoading} from '../redux/modules/loading-slice';
import {colors, commonStyles, ms, vs} from '../styles';
import {fonts, fontSize} from '../styles/fonts';
import {StackScreenRouteProp} from '../types/navigationTypes';
import {getAddressValue, getDistanceMatrix, showDangerMessage} from '../utils/functions';
import GeoFencing from 'react-native-geo-fencing';

const AddDeliveryAddress = ({visible, onClose, navigation, selectedLocation, restaurantId, setModalShowOrderTime}: any) => {
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState([]);
  const addDeliveryAddressRef = React.useRef<any>(null);
  const [sessionToken, setSessionToken] = useState('');
  const [userGeometryLocation, setUserGeometryLocation] = useState({
    lat: 0,
    lng: 0,
  });
  const {deliveryAddress} = useAppSelector((state) => state.itemBag);

  useEffect(() => {
    return () => {
      setResults([]);
      setInputValue('');
    };
  }, []);

  const {
    setValue,
    control,
    formState: {errors},
  } = useForm<any>();

  const fetchPlaces = async (input: string, newSessionToken: string) => {
    const params = {
      key: API_KEYS.GOOGLE_API_KEY,
      input: input,
    };
    try {
      const response = await axios({method: 'GET', url: GOOGLE_URLS.AUTO_COMPLETE, params});
      setResults(response.data.predictions);
    } catch (error: any) {
      console.log({error});
      addDeliveryAddressRef.current?.showMessage({
        type: 'danger',
        message: 'Something went wrong',
      });
    }
  };

  const onInputChange = (txt: string) => {
    const newSessionToken = Math.random().toString(36).substring(7);
    setSessionToken(newSessionToken);

    if (txt.length >= 3) {
      fetchPlaces(txt, newSessionToken);
    } else {
      setResults([]);
    }
    setInputValue(txt);
    batch(() => {
      dispatch(setDeliveryZoneId(''));
      dispatch(setDeliveryMethod(''));
      dispatch(setDeliveryAddress({}));
    });
  };

  const handlePrediction = async (address: any) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json`, {
        params: {
          place_id: address.place_id,
          key: API_KEYS.GOOGLE_API_KEY,
          language: 'en',
          sessiontoken: sessionToken, // Pass the session token
        },
      });
      setAddress(address, response.data.result);
      setUserGeometryLocation(response.data?.result?.geometry?.location);
    } catch (error) {
      console.log({error});
      console.error('Error fetching place details:', error);
    }
  };

  const setAddress = (address: any, result: any) => {
    const delivery_address = {
      formatted_address: address?.description ?? result?.formatted_address,

      address1: result?.name,
      address2: getAddressValue(result?.address_components, 'sublocality_level_1'),
      city: getAddressValue(result?.address_components, 'administrative_area_level_3') || getAddressValue(result?.address_components, 'locality'),
      state: getAddressValue(result?.address_components, 'administrative_area_level_1'),
      country: getAddressValue(result?.address_components, 'country'),
      zip: getAddressValue(result?.address_components, 'postal_code'),
      district: getAddressValue(result?.address_components, 'administrative_area_level_2'),
      status: 'active',
      street: '',
      type: 'delivery_address',
    };
    dispatch(setDeliveryAddress(delivery_address));
  };

  const handleItemSelect = (selectedItem: any) => () => {
    setResults([]);
    handlePrediction(selectedItem);
    setInputValue(selectedItem?.description);
    setValue('Search', selectedItem?.description);
  };

  const fetchLocationData = async () => {
    try {
      dispatch(startLoading());
      const locationData: LocationData = await getLocationData();
      handlePrediction(locationData);
      setInputValue(locationData.formattedAddress);
      dispatch(stopLoading());
    } catch (error: any) {
      console.log({error});
      dispatch(stopLoading());
      addDeliveryAddressRef.current?.showMessage({
        type: 'danger',
        message: error?.message ?? "Sorry, we couldn't fetch your location.",
      });
    }
  };

  const Varifyddress = async () => {
    let _deliveryZoneId = '';

    if (inputValue.length == 0 || !deliveryAddress?.formatted_address) {
      addDeliveryAddressRef.current?.showMessage({
        type: 'danger',
        message: 'Please enter or select your address.',
      });
      return;
    }
    const {lat: originLat, lng: originLon} = userGeometryLocation;
    const {
      enableIhd,
      pickupDelivery,
      latLng: [destLat, destLon],
    } = selectedLocation;
    try {
      if (enableIhd) {
        await checkIHDStatus();
        onClose(true);
        setInputValue('');
        batch(() => {
          dispatch(setDeliveryMethod('ihd'));
        });
        setModalShowOrderTime(true);
      } else if (pickupDelivery?.enableDelivery) {
        for (let index = 0; index < pickupDelivery?.deliveryZones.length; index++) {
          try {
            await GeoFencing.containsLocation({lat: originLat, lng: originLon}, pickupDelivery?.deliveryZones[index].geofencing);
            // console.log('yes', pickupDelivery?.deliveryZones[index]._id, enableIhd ? 'ihd' : pickupDelivery?.enableDelivery ? 'native' : '');
            onClose(true);
            setInputValue('');
            batch(() => {
              dispatch(setDeliveryZoneId(pickupDelivery?.deliveryZones[index]._id));
              dispatch(setDeliveryMethod(pickupDelivery?.enableDelivery ? 'native' : ''));
            });
            setModalShowOrderTime(true);
            break;
          } catch (error) {
            // console.log('not');
            if (pickupDelivery?.deliveryZones.length - 1 === index) {
              addDeliveryAddressRef.current?.showMessage({
                type: 'danger',
                message: "We don't deliver to this address",
              });
            }
          }
        }
      }
    } catch (error: any) {
      console.log(error);
      addDeliveryAddressRef.current?.showMessage({
        type: 'danger',
        message: error?.message ?? "Sorry, we couldn't fetch your location.",
      });
    }
  };

  const checkIHDStatus = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await API_Ordering.check_delivery_availability({address: deliveryAddress, locationId: selectedLocation._id});
        if (res.code === StatusCodes.SUCCESS) {
          resolve(true);
        } else {
          reject(new Error("We don't deliver to this address"));
        }
      } catch (error) {
        console.log({error});
        reject(error);
      }
    });
  };

  return (
    <Modal onRequestClose={() => {}} animationType="slide" transparent={true} visible={visible}>
      <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center'}}>
        <View
          style={{
            backgroundColor: colors.white,
            borderRadius: 10,
            marginHorizontal: ComponentMatrix.HORIZONTAL_16,
          }}>
          <View style={{paddingHorizontal: ComponentMatrix.HORIZONTAL_16}}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: vs(61)}}>
              <Text style={styles.titleTxt}>Add Delivery Address</Text>
              <Pressable
                onPress={() => {
                  onClose();
                  setInputValue('');
                  setResults([]);
                }}>
                <Image style={{}} source={images.icClose} />
              </Pressable>
            </View>
            <Controller control={control} name="test" render={({field: {onBlur, value}}) => <FieldInput title="" value={inputValue} inputViewStyles={styles.textInput} placeholder="Delivery Address" onBlur={onBlur} onChangeText={onInputChange} />} />
            <Pressable onPress={fetchLocationData}>
              <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: vs(8)}}>
                <Image style={{marginRight: 5}} source={images.icTrack_Location} />
                <Text style={styles.addressTxt}>{'Use Current Location'}</Text>
              </View>
            </Pressable>
          </View>
          <FlatList
            keyboardShouldPersistTaps={'handled'}
            style={{paddingLeft: 15, paddingRight: 15, marginTop: 10, flexGrow: 0}}
            data={results}
            keyExtractor={(item, index) => `${index}_PlacesList`}
            renderItem={({item}: any) => {
              return (
                <Pressable onPress={handleItemSelect(item)}>
                  <Text style={{fontSize: fontSize.fs15, fontFamily: fonts.BGFlameLight, padding: 8, fontWeight: '400'}}>{item?.description}</Text>
                </Pressable>
              );
            }}
          />
          <Pressable style={{backgroundColor: colors.headerbg, borderRadius: 5, marginTop: vs(24), height: 50, justifyContent: 'center', alignItems: 'center'}} onPress={Varifyddress}>
            <Text style={[styles.locationText, {color: colors.white, textAlign: 'center'}]}>VERIFY</Text>
          </Pressable>
        </View>
      </View>
      <FlashMessage ref={addDeliveryAddressRef} />
    </Modal>
  );
};

export default AddDeliveryAddress;

export const styles = StyleSheet.create({
  addressTxt: {color: colors.headerbg, fontSize: fontSize.fs15, fontFamily: fonts.BGFlameBold, alignItems: 'center', width: '90%'},
  titleTxt: {color: colors.headerbg, fontSize: fontSize.fs15, fontFamily: fonts.BGFlameBold, alignItems: 'center'},
  locationText: {color: '#ABABAB', fontSize: fontSize.fs16, fontFamily: fonts.BGFlameBold, fontWeight: 'normal'},
  textInput: {borderWidth: 1, borderColor: '#F0F2F5', paddingLeft: 10, height: vs(50)},
});
