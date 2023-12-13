import {DrawerScreenProps} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import React, {FC, useEffect, useState} from 'react';
import {Alert, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {API_Ordering, IRestaurant, StatusCodes} from '../api';
import {Badge} from '../components';
import ItemRestaurant from '../components/ItemRestaurant';
import {images} from '../core';
import {LocationData, getLocationData} from '../core/GlobalLocation';
import {dispatch} from '../redux';
import {useAppSelector} from '../redux/hooks';
import {resetState, selectResturant} from '../redux/modules/bagSlice';
import {colors, commonStyles, fontSize, fonts, ms, vs} from '../styles';
import {DrawerScreenRouteProp} from '../types/navigationTypes';
import {isValidLengthArray} from '../utils/functions';

export const homeStyles = StyleSheet.create({
  headerView: {
    height: 100,
    backgroundColor: colors.headerbg,

    flexDirection: 'row',
    marginBottom: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
    width: '17%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightView: {
    height: 30,
    width: 30,
  },
  centerView: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  txt: {color: colors.white, fontSize: fontSize.fs20, fontFamily: fonts.BGFlameBold},
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
    width: 25,
    height: 25,
    resizeMode: 'contain',
    alignSelf: 'center',
    top: 6,
  },
  locationText: {
    color: '#ABABAB',
    fontSize: fontSize.fs16,
    fontFamily: fonts.BGFlameBold,
  },
  deliveryTxt: {
    color: '#ABABAB',
    fontSize: fontSize.fs16,
    fontFamily: fonts.BGFlame,
  },
  locationTextAdd: {
    color: '#343434',
    fontSize: fontSize.fs14,
    fontFamily: fonts.BGFlameBold,
    flex: 1,
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
    marginTop: 10,
  },
  foodDetailsWrapper: {
    marginHorizontal: '4%',
    marginVertical: '1%',
    backgroundColor: colors.white,
    borderRadius: 10,
    ...commonStyles.shadowStyles,
    marginTop: 10,
  },
  searchIcon: {
    width: 15,
    height: 15,
    marginLeft: 10,
  },
  filterIcon: {
    marginLeft: 10,
  },
  textInput: {
    paddingLeft: 0,
    marginTop: -5,
    flex: 1,
    width: '90%',
  },
  icRestaurantStyle: {
    resizeMode: 'contain',
  },
  itemWrapper: {width: ms(135), paddingVertical: vs(16.5), borderWidth: 1, borderColor: '#D9D9D9', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F4F4', borderRadius: 10},
});

const Home: FC<DrawerScreenProps<DrawerScreenRouteProp, 'Home'>> = ({navigation, route}) => {
  const {items, restaurantId} = useAppSelector((state) => state.itemBag);
  const [listTopRestaurants, setListTopRestaurants] = useState<IRestaurant[]>([]);
  const [listRestaurants, setListRestaurants] = useState<IRestaurant[]>([]);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [textSearch, setTextSearch] = useState('');
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const locationData: LocationData = await getLocationData();
        setLocation(locationData);
      } catch (error) {
        console.log({error});
      }
    };
    const fetchingRestaurants = async () => {
      const resTopRestaurants = await API_Ordering.list_top_restaurants({limit: 5});
      const resAllRestaurants = await API_Ordering.list_all_restaurants({limit: 5});
      if (resTopRestaurants.code === StatusCodes.SUCCESS) {
        setListTopRestaurants(resTopRestaurants.data);
      }
      if (resAllRestaurants.code === StatusCodes.SUCCESS) {
        setListRestaurants(resAllRestaurants.data);
      }
      setIsLoading(false);
    };
    fetchLocationData();
    fetchingRestaurants();
  }, []);

  const onPressRestaurant = (item: any, index: number) => {
    if (items.length > 0 && item.restaurant._id !== restaurantId) {
      Alert.alert('', 'You have items in bag from other restaurant', [
        {text: 'cancle'},
        {
          text: 'remove',
          style: 'destructive',
          onPress: () => {
            dispatch(resetState());
          },
        },
      ]);
    } else {
      dispatch(selectResturant({restaurantId: item.restaurant._id}));
      navigation.getParent()?.navigate('ChooseLocation', item);
    }
  };

  return (
    <View style={commonStyles.mainView}>
      <SafeAreaView style={{backgroundColor: colors.white}} />
      <View style={homeStyles.headerView}>
        <View style={homeStyles.leftViewMain}>
          <Pressable style={homeStyles.leftView} onPress={() => navigation.openDrawer()}>
            <Image style={homeStyles.backIconStyles} source={images.icMenu} />
          </Pressable>
        </View>
        <View style={homeStyles.centerView}>
          <Text style={homeStyles.txt}>Restaurants</Text>
        </View>
        <Pressable
          onPress={() => {
            navigation.getParent()?.navigate('Bag');
          }}
          style={homeStyles.rightViewMain}>
          <View style={homeStyles.rightView}>
            <Image style={homeStyles.backIconStyles} source={images.icCart} />
            <Badge />
          </View>
        </Pressable>
      </View>
      {isLoading === false ? (
        <SafeAreaView style={{flex: 1}}>
          <ScrollView contentContainerStyle={{}}>
            <View style={homeStyles.locationWrapper}>
              <View style={{paddingHorizontal: '3%', paddingVertical: '2%', flexDirection: 'row', backgroundColor: '#F4F4F4', borderTopRightRadius: 10, borderTopLeftRadius: 10}}>
                <Image style={homeStyles.locationIcon} source={images.icLocation} />
                <View style={{flex: 1, paddingHorizontal: 10}}>
                  <Text style={homeStyles.deliveryTxt}>Delivery to</Text>
                  <Text numberOfLines={3} style={homeStyles.locationTextAdd}>
                    {location ? `${location.formattedAddress}` : 'Loading location...'}
                  </Text>
                </View>
              </View>
              <View style={{paddingHorizontal: '3%', flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                <View style={{borderRadius: 18, borderWidth: 1, flexDirection: 'row', alignItems: 'center', height: 40, borderColor: '#D9D9D9', flex: 1}}>
                  <Image style={homeStyles.searchIcon} source={images.icSearch} />
                  <View style={{width: ms(1), backgroundColor: '#D6D6D6', marginVertical: '15%', height: '70%', marginLeft: 12}} />
                  <TextInput
                    style={{flex: 1, marginLeft: 8, includeFontPadding: false, padding: 0, textAlignVertical: 'center'}}
                    placeholder="Food"
                    placeholderTextColor={'#ABABAB'}
                    value={textSearch}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    returnKeyLabel={'search'}
                    returnKeyType={'search'}
                    onChangeText={(text) => {
                      setTextSearch(text);
                    }}
                  />
                </View>
                <Image style={homeStyles.filterIcon} source={images.icFilter} />
              </View>
            </View>
            <ScrollView horizontal={true} contentContainerStyle={{paddingHorizontal: vs(18), columnGap: ms(8)}} style={{marginTop: vs(15)}}>
              <Pressable
                onPress={() => {
                  navigation.getParent()?.navigate('AllRestaurants');
                }}
                style={homeStyles.itemWrapper}>
                <Image style={homeStyles.icRestaurantStyle} source={require('../../assets/images/icRestaurant.png')} />
                <View style={{marginTop: 8}}>
                  <Text style={[homeStyles.locationText, {color: colors.darkBlackText}]}>{'Restaurants'}</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => {
                  navigation.getParent()?.navigate('FavoriteRestaurantScreen');
                }}
                style={homeStyles.itemWrapper}>
                <Image style={homeStyles.icRestaurantStyle} source={require('../../assets/images/icFavourite.png')} />
                <View style={{marginTop: 8}}>
                  <Text style={[homeStyles.locationText, {color: colors.darkBlackText}]}>{'Favorites'}</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => {
                  navigation.getParent()?.navigate('GroceriesScreen');
                }}
                style={homeStyles.itemWrapper}>
                <Image style={homeStyles.icRestaurantStyle} source={require('../../assets/images/icCartIcon.png')} />
                <View style={{marginTop: 8}}>
                  <Text style={[homeStyles.locationText, {color: colors.darkBlackText}]}>{'Groceries'}</Text>
                </View>
              </Pressable>
            </ScrollView>
            <BoxListOfRestaurants title={'Top Restaurants'} data={listTopRestaurants} onPress={(item: any, index: number) => onPressRestaurant(item, index)} />
            <BoxListOfRestaurants title={'Restaurants'} data={listRestaurants} onPress={(item: any, index: number) => onPressRestaurant(item, index)} />
          </ScrollView>
        </SafeAreaView>
      ) : null}
    </View>
  );
};
export default Home;

const ButtonHeader = ({onPress = () => {}, title}: any) => {
  return (
    <Pressable onPress={onPress} style={{margin: ms(16), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
      <Text style={{color: colors.darkBlackText, fontSize: fontSize.fs16, fontFamily: fonts.BGFlameBold}}>{title}</Text>
      <Image style={{}} source={images.icBack} />
    </Pressable>
  );
};

const BoxListOfRestaurants = ({onPress = () => {}, data = [], title = ''}: any) => {
  const navigation = useNavigation();
  return (
    <View style={[homeStyles.restaurantItemsWrapper, {}]}>
      <ButtonHeader title={title} />
      <View style={{rowGap: vs(15), marginHorizontal: ms(16)}}>
        {isValidLengthArray(data) &&
          data.map((item: any, index: number) => (
            <ItemRestaurant onPress={() => onPress(item, index)} restaurantAddress={item.restaurant.address} restaurantImage={item.restaurant.logo} name={item.restaurant.name} cost="1.99" rating="4.5" timeing="15" key={index} />
          ))}
      </View>
      <Pressable
        onPress={() => {
          navigation.getParent()?.navigate('AllRestaurants');
        }}
        style={{backgroundColor: '#FFECEA', paddingVertical: '4%', marginTop: '3%', bottom: 0, borderBottomLeftRadius: 10, borderBottomRightRadius: 10}}>
        <Text style={{color: '#DC4135', textAlign: 'center', fontWeight: '700', fontSize: fontSize.fs14}}> See More </Text>
      </Pressable>
    </View>
  );
};
