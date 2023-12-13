import {DrawerScreenProps} from '@react-navigation/drawer';
import React, {FC, useEffect, useState} from 'react';
import {Alert, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions, RefreshControl, StatusBar, ActivityIndicator, FlatList} from 'react-native';
// import MasonryList from 'react-native-masonry-list';
import {API_Ordering, StatusCodes} from '../api';
import {Category, Favourite, MasonryImage, MasonryItemProps, Restaurant} from '../api/types';
import {images} from '../core';
import {colors, commonStyles, fontSize, fonts, ms, vs} from '../styles';
import {DrawerScreenRouteProp} from '../types/navigationTypes';
import {prettyPrint, showDangerMessage} from '../utils/functions';
import HamburgerMenuSVGIcon from '../../assets/SVGImages/HamburgerMenuSVGIcon';
import BagButton from '../components/BagButton';
import {ComponentMatrix, isStag} from '../constants/constants';
import FastImage from 'react-native-fast-image';
import debounce from 'lodash/debounce';
import {dispatch, useAppSelector} from '../redux';
import {resetState, selectResturant, selectResturantForFavorite} from '../redux/modules/bagSlice';
import {batch} from 'react-redux';
import {setFavorite, setRestaurant} from '../redux/modules/restaurantSlice';
import {stopLoading, startLoading} from '../redux/modules/loading-slice';
import {setInit} from '../redux/modules/partnerSlice';
import ListEmptyComponent from '../components/ListEmptyComponent';
import {setRestaurantUrl} from '../redux/modules/profileSlice';
import MasonryList from '../components/MasonryList';

const HomeNew: FC<DrawerScreenProps<DrawerScreenRouteProp, 'Home'>> = ({navigation, route}) => {
  const [textSearch, setTextSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [listRestaurants, setListRestaurants] = useState<Restaurant[]>([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<Favourite[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const {items, restaurantId} = useAppSelector((state) => state.itemBag);
  const {user, accessToken} = useAppSelector((state) => state.profile);
  const [refreshing, setRefreshing] = useState(false);

  const fetchingRestaurants = async (category_id: string = '') => {
    try {
      setTextSearch('');
      setIsLoading(true);
      const params = {
        ...(accessToken.length > 0 && {customer: user._id}),
        ...(category_id.length > 0 && {category: category_id}),
      };
      const resAllRestaurants = await API_Ordering.homeScreen(params);
      if (resAllRestaurants.code === StatusCodes.SUCCESS) {
        setListRestaurants(resAllRestaurants.data.allRestaurants);
        setCategories(resAllRestaurants.data.categories.sort((a, b) => a.sort - b.sort));
        setFavoriteRestaurants(resAllRestaurants.data.favourites);

        dispatch(setInit(resAllRestaurants.data.partner));
        dispatch(setRestaurantUrl(isStag && resAllRestaurants.data.allRestaurants.length > 0 ? resAllRestaurants.data.allRestaurants[0].url : resAllRestaurants.data.deleteAccountUrl));
      } else {
      }
    } catch (error) {
      console.log({error});
    } finally {
      setIsLoading(false);
    }
  };

  const fetchingRestaurantsWithRefreshing = async () => {
    setRefreshing(true);
    await fetchingRestaurants();
    setRefreshing(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      try {
        if (textSearch != '') {
          setIsLoading(true);
          const resSearchRestaurants = await API_Ordering.search(textSearch);
          if (resSearchRestaurants.code === StatusCodes.SUCCESS && resSearchRestaurants.data != StatusCodes.SUCCESS) {
            setListRestaurants(resSearchRestaurants.data);

            setIsLoading(false);
          } else {
          }
        } else {
          fetchingRestaurants();
        }
      } catch (error) {
        console.log(error);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);

    // const delayDebounceFn = debounce(async () => {
    //   try {
    //     if (textSearch != '') {
    //       setIsLoading(true);
    //       const resSearchRestaurants = await API_Ordering.search(textSearch);
    //       if (resSearchRestaurants.code === StatusCodes.SUCCESS && resSearchRestaurants.data != StatusCodes.SUCCESS) {
    //         setListRestaurants(resSearchRestaurants.data);

    //         setIsLoading(false);
    //       }
    //     } else {
    //       fetchingRestaurants();
    //     }
    //   } catch (error) {}
    // }, 500);

    // delayDebounceFn();
  }, [accessToken, textSearch]);

  const onPressRestaurant = async (item: Restaurant, index: number) => {
    console.log(item);
    if (items.length > 0 && item._id !== restaurantId) {
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
      try {
        dispatch(startLoading());
        const response = await API_Ordering.find_one_restaurant(item._id);

        if (response.code === StatusCodes.SUCCESS) {
          batch(() => {
            dispatch(setRestaurant({restaurant: response.data}));
            dispatch(setFavorite(favoriteRestaurants.find((f) => f.restaurant.restaurant._id === item._id) != null));
            dispatch(selectResturant({restaurantId: item._id}));
            dispatch(selectResturantForFavorite({restaurantIdForFavorite: item.userId._id}));
          });
          navigation.getParent()?.navigate('ChooseLocation', item);
        }
      } catch (error) {
        showDangerMessage(error?.message ?? 'Something went wrong');
        console.log({error});
      } finally {
        dispatch(stopLoading());
      }
    }
  };
  const {width} = useWindowDimensions();

  return (
    <View style={commonStyles.mainView}>
      <SafeAreaView style={{backgroundColor: colors.headerbg}} />
      <StatusBar barStyle={'light-content'} hidden={false} backgroundColor={colors.headerbg} />
      <View style={styles.headerView}>
        <Pressable onPress={() => navigation.openDrawer()}>
          <HamburgerMenuSVGIcon />
        </Pressable>
        <Image source={images.home_title} />
        <BagButton />
      </View>
      <View style={{flex: 1}}>
        <ScrollView bounces={true} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchingRestaurantsWithRefreshing} />} style={{flexGrow: 0, marginTop: -ms(25)}} contentContainerStyle={{paddingVertical: ms(10)}}>
          <View style={{paddingHorizontal: ms(18), flexDirection: 'row', alignItems: 'center', paddingTop: ms(25)}}>
            <View style={{borderRadius: 20, borderWidth: 1, flexDirection: 'row', alignItems: 'center', height: 40, borderColor: '#5F5F5F', flex: 1}}>
              <Image style={styles.searchIcon} source={images.icSearch} />
              <View style={{width: ms(1), backgroundColor: '#5F5F5F', marginVertical: '15%', height: '70%', marginLeft: 12}} />
              <TextInput
                style={{flex: 1, marginLeft: 8, includeFontPadding: false, padding: 0, textAlignVertical: 'center', paddingVertical: 0}}
                placeholder="Search Foodies"
                placeholderTextColor={'#B4B1B1'}
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
            <View style={{paddingLeft: 10}}>
              <Pressable
                onPress={() => {
                  navigation.getParent()?.navigate('MapOfRestauntsNearOfUserScreen');
                }}
                style={styles.mapButton}>
                <Image source={images.icMap} />
              </Pressable>
            </View>
          </View>
          {favoriteRestaurants.length > 0 && (
            <View style={{}}>
              <View style={{paddingStart: ComponentMatrix.HORIZONTAL_12, marginTop: vs(12)}}>
                <Text style={[styles.favText, {color: colors.darkBlackText}]}>My Favorites</Text>
              </View>
              <ScrollView horizontal={true} contentContainerStyle={{paddingStart: ComponentMatrix.HORIZONTAL_12}} style={{marginTop: vs(10)}}>
                {favoriteRestaurants.map((fav, favIdx) => (
                  <Pressable
                    onPress={() => {
                      const params = {
                        _id: fav.restaurant.restaurant._id,
                        userId: {_id: fav.restaurant._id},
                        name: fav.restaurant.restaurant.name,
                        email: fav.restaurant.restaurant.email,
                        address: fav.restaurant.restaurant.address,
                        logo: fav.restaurant.restaurant.logo,
                      };
                      onPressRestaurant(params, favIdx);
                    }}
                    style={styles.itemWrapper}
                    key={`${favIdx}`}>
                    <FastImage style={styles.icFavStyle} source={{uri: fav.restaurant.restaurant.favImg || fav.restaurant.restaurant.logo}} />
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
          {categories.length > 0 && (
            <View style={{paddingBottom: vs(20)}}>
              <View style={{paddingStart: ComponentMatrix.HORIZONTAL_12, marginTop: vs(12)}}>
                <Text style={[styles.favText, {color: colors.darkBlackText}]}>Categories</Text>
              </View>
              <ScrollView horizontal={true} contentContainerStyle={{paddingStart: ComponentMatrix.HORIZONTAL_12}} style={{marginTop: vs(10)}}>
                {categories.map((cat, catIdx) => (
                  <Pressable onPress={() => fetchingRestaurants(cat._id)} key={`${catIdx}`} style={[styles.catItemWrapper, {width: undefined, maxWidth: width / 5}]}>
                    <FastImage style={styles.icCatStyle} source={{uri: cat.image}} />
                    <Text ellipsizeMode="tail" numberOfLines={1} style={[styles.catText, {color: colors.darkBlackText, marginTop: 8}]}>
                      {cat.name}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
          {isLoading ? <ActivityIndicator color={'#DC4135af'} size={40} /> : <MasonryList data={listRestaurants} onPressRestaurant={onPressRestaurant} />}
        </ScrollView>
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  headerView: {
    height: 100,
    backgroundColor: colors.headerbg,
    flexDirection: 'row',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ComponentMatrix.HORIZONTAL_16,
    zIndex: 99,
  },
  favText: {
    color: '#ABABAB',
    fontSize: fontSize.fs16,
    fontFamily: fonts.BGFlameBold,
  },
  searchIcon: {
    marginLeft: 10,
  },
  icFavStyle: {
    width: ms(100),
    aspectRatio: 4 / 3,
    resizeMode: 'cover',
    borderRadius: ms(4),
  },
  itemWrapper: {width: ms(100), borderRadius: 10, alignItems: 'center', marginEnd: ms(8)},
  mapButton: {width: 69, height: 35, backgroundColor: '#EE2D26', borderRadius: 18, alignItems: 'center', justifyContent: 'center'},
  catText: {
    color: '#ABABAB',
    fontSize: fontSize.fs12,
    fontFamily: fonts.BGFlameBold,
  },
  catItemWrapper: {width: 55, alignItems: 'center', justifyContent: 'flex-end', paddingHorizontal: 5},
  icCatStyle: {
    width: ms(45),
    height: ms(45),
    aspectRatio: 1,
    resizeMode: 'cover',
    borderRadius: ms(23),
  },
});

export default HomeNew;
