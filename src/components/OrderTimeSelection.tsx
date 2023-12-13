import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import {API_Ordering, StatusCodes} from '../api';
import {ListEmptyComponent} from '../components';
import {ComponentMatrix} from '../constants/constants';
import {images} from '../core';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {setScheduledOn} from '../redux/modules/bagSlice';
import {startLoading, stopLoading} from '../redux/modules/loading-slice';
import {colors, commonStyles, ms, vs} from '../styles';
import {fonts, fontSize} from '../styles/fonts';

const OrderTimeSelection = ({visible, onClose, selectedLocation, onSimpleClose}: any) => {
  const [dates, setDates] = useState([]);
  const [times, setTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [isOrderForNowEnable, setIsOrderForNowEnable] = useState(false);
  const {isLoading} = useAppSelector((state) => state.Loader);
  const {method} = useAppSelector((state) => state.itemBag);
  const {restaurant} = useAppSelector((state) => state.restaurant);

  const dispatch = useAppDispatch();
  const orderTimeFlashRef = React.useRef<any>(null);

  useEffect(() => {
    if (selectedLocation) {
      API_Ordering.schedule({locationId: selectedLocation._id, method}).then((res) => {
        setIsOrderForNowEnable(res.code === StatusCodes.SUCCESS && res.data.find((d: string) => d === 'now'));
      });
    }
  }, [selectedLocation]);

  const getAvailableDates = async () => {
    try {
      dispatch(startLoading());
      const resADates = await API_Ordering.ordering_available_dates(selectedLocation._id, method);
      if (resADates.code === StatusCodes.SUCCESS) {
        setDates(resADates.data);
        if (resADates.data.length > 0) {
          setSelectedDate(resADates.data[0]);
          getSlots(resADates.data[0]);
        }
      }
      dispatch(stopLoading());
    } catch (error: any) {
      console.log({error});
      dispatch(stopLoading());
      orderTimeFlashRef.current?.showMessage({
        type: 'danger',
        message: error?.message ?? 'Something went wrong.',
      });
    }
  };

  const getSlots = async (date: string) => {
    try {
      setSelectedDate(date);
      setTimes([]);
      dispatch(startLoading());
      const resTimes = await API_Ordering.ordering_slots(selectedLocation._id, method, date);
      if (resTimes.code === StatusCodes.SUCCESS) {
        setTimes(resTimes.data);
      }
      dispatch(stopLoading());
    } catch (error: any) {
      console.log({error});
      dispatch(stopLoading());
      orderTimeFlashRef.current?.showMessage({
        type: 'danger',
        message: error?.message ?? 'Something went wrong.',
      });
    }
  };

  const selectTime = (item: string) => {
    const dd = moment(selectedDate);
    const tt = moment(item, 'HH:mm');
    dd.set({
      hour: tt.get('hour'),
      minute: tt.get('minute'),
      second: 0,
      millisecond: 0,
    });

    dispatch(setScheduledOn(dd.utc().format('yyyy-MM-DDTHH:mm:ss.SSS') + 'Z'));
    setDates([]);
    setTimes([]);

    onClose('later');
  };

  const onSimpleCloseWithDatesClear = () => {
    setDates([]);
    setTimes([]);
    setSelectedDate('');
    onSimpleClose();
  };

  return (
    <Modal onRequestClose={onSimpleCloseWithDatesClear} animationType="slide" transparent={true} visible={visible}>
      <TouchableWithoutFeedback onPress={onSimpleCloseWithDatesClear}>
        <View style={{height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center'}}>
          <View style={{backgroundColor: colors.white, width: '94%', borderRadius: 10, alignSelf: 'center', paddingBottom: 15}}>
            {dates.length > 0 ? (
              <>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: vs(61), paddingHorizontal: ComponentMatrix.HORIZONTAL_16}}>
                  <View>
                    <Text style={[styles.addressTxt, {marginTop: 15}]}>Order for later</Text>
                    <Text style={[styles.locationTxt, {marginTop: 5, fontSize: fontSize.fs13, color: '#A0A0A0', fontFamily: fonts.BGFlame, marginHorizontal: 0}]}>Choose date and time</Text>
                  </View>
                  <Pressable onPress={onSimpleCloseWithDatesClear}>
                    <Image style={{}} source={images.icClose} />
                  </Pressable>
                </View>
                <ScrollView horizontal style={{flexDirection: 'row', marginTop: 5, marginHorizontal: 10}}>
                  {dates.map((date) =>
                    date == selectedDate ? (
                      <View key={date} style={[styles.dateBox, {backgroundColor: colors.headerbg}]}>
                        <Text style={[styles.txt, {color: colors.white}]}>{moment(date).format('ddd')}</Text>
                        <Text style={[styles.sampleTxt, {color: colors.white}]}>{moment(date).format('D')}</Text>
                      </View>
                    ) : (
                      <Pressable key={date} style={styles.dateBox} onPress={() => getSlots(date)}>
                        <Text style={styles.txt}>{moment(date).format('ddd')}</Text>
                        <Text style={styles.sampleTxt}>{moment(date).format('D')}</Text>
                      </Pressable>
                    ),
                  )}
                </ScrollView>

                <FlatList
                  data={times}
                  numColumns={4}
                  style={{marginTop: 5, marginHorizontal: 15, height: vs(140)}}
                  columnWrapperStyle={{justifyContent: 'flex-start', marginHorizontal: -5}}
                  ListEmptyComponent={() =>
                    isLoading ? (
                      <View style={{height: vs(140), justifyContent: 'center'}}>
                        <ActivityIndicator color={'#DC4135af'} size={40} />
                      </View>
                    ) : (
                      <ListEmptyComponent>No date and time</ListEmptyComponent>
                    )
                  }
                  renderItem={({item}) => (
                    <Pressable style={{width: '25%', padding: 5}} onPress={() => selectTime(item)}>
                      <Text style={{borderColor: colors.headerbg, borderWidth: 1, borderRadius: 5, width: '100%', textAlign: 'center', fontSize: fontSize.fs13, fontFamily: fonts.BGFlame}}>{moment(item, 'HH:mm').format('hh:mm A')}</Text>
                    </Pressable>
                  )}
                />
              </>
            ) : (
              <>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: vs(61), paddingHorizontal: ComponentMatrix.HORIZONTAL_16}}>
                  <Text style={[styles.titleTxt, {marginHorizontal: 0}]}>When do you want it?</Text>
                  <Pressable
                    onPress={() => {
                      setDates([]);
                      onSimpleClose();
                    }}>
                    <Image style={{}} source={images.icClose} />
                  </Pressable>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10, marginHorizontal: ms(8), justifyContent: 'space-between', alignSelf: 'center'}}>
                  {!restaurant.ordering.orderNow && !restaurant.ordering.orderLater && <Text style={[styles.titleTxt, {marginHorizontal: 0}]}>Currently not accepting orders</Text>}
                  {restaurant.ordering.orderNow && isOrderForNowEnable && (
                    <Pressable
                      style={[styles.buttonWrapper]}
                      onPress={() => {
                        dispatch(setScheduledOn(''));
                        onClose('now');
                      }}>
                      <Text style={styles.cardTxt}>Order for now</Text>
                      {method === 'pickup' ? <Text style={styles.cardstimeTxt}>Wait: {selectedLocation?.pickupDelivery?.pickupPrepTime} mins</Text> : method === 'delivery' ? <Text style={styles.cardstimeTxt}>Get your food ASAP</Text> : null}
                    </Pressable>
                  )}
                  {restaurant.ordering.orderLater && (
                    <Pressable style={[styles.buttonWrapper1]} onPress={getAvailableDates}>
                      <Text style={[styles.cardTxt, {color: colors.headerbg}]}>Order for later</Text>
                      <Text numberOfLines={1} style={[styles.cardstimeTxt, {color: colors.headerbg}]}>
                        Select a future date & time
                      </Text>
                    </Pressable>
                  )}
                </View>
              </>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
      <FlashMessage ref={orderTimeFlashRef} />
    </Modal>
  );
};

export const styles = StyleSheet.create({
  addressTxt: {color: colors.headerbg, fontSize: fontSize.fs15, fontFamily: fonts.BGFlameBold, alignItems: 'center', width: '90%'},
  locationTxt: {color: '#030303', fontSize: fontSize.fs13, fontFamily: fonts.BGFlame, marginTop: 15, marginHorizontal: 15},
  dateBox: {alignItems: 'center', justifyContent: 'center', borderRadius: 8, marginHorizontal: 5, height: vs(50), minWidth: vs(70), backgroundColor: '#FFECEA'},
  sampleTxt: {color: '#030303', fontSize: fontSize.fs13, fontFamily: fonts.BGFlame, textAlign: 'center'},
  txt: {color: colors.darkBlackText, fontSize: fontSize.fs15, fontFamily: fonts.BGFlameBold, textAlign: 'center'},
  titleTxt: {color: colors.headerbg, fontSize: fontSize.fs15, fontFamily: fonts.BGFlameBold, alignItems: 'center'},
  buttonWrapper: {backgroundColor: colors.headerbg, borderRadius: 10, height: 80, justifyContent: 'center', alignItems: 'center', flex: 1, marginLeft: ms(7), marginRight: ms(4)},
  buttonWrapper1: {
    backgroundColor: '#FFECEA',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    ...commonStyles.shadowStyles,
    height: 80,
    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: ms(4),
    marginRight: ms(7),
    paddingHorizontal: ms(4),
  },
  cardTxt: {fontWeight: '700', color: colors.white, fontSize: fontSize.fs15, fontFamily: fonts.BGFlameBold, textAlign: 'center', lineHeight: 24},
  cardstimeTxt: {fontWeight: '700', color: colors.white, fontSize: fontSize.fs12, fontFamily: fonts.BGFlameLight, textAlign: 'center', lineHeight: 24},
});

export default OrderTimeSelection;
