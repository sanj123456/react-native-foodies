import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {Alert, FlatList, StyleSheet, SafeAreaView} from 'react-native';
import {ms} from 'react-native-size-matters';
import {API_Ordering, StatusCodes} from '../api';
import {Restaurant} from '../api/types';
import ItemRestaurant from '../components/ItemRestaurant';
import ThemeRedHeader from '../components/ThemeRedHeader';
import {ComponentMatrix} from '../constants/constants';
import {dispatch, useAppSelector} from '../redux';
import {resetState, selectResturant} from '../redux/modules/bagSlice';
import {StackScreenRouteProp} from '../types/navigationTypes';

const AllListingsCategoriesScreens: React.FC<NativeStackScreenProps<StackScreenRouteProp, 'AllListingsCategoriesScreens'>> = ({navigation, route}) => {
  const {category_id, category_name} = route.params;

  const {items, restaurantId} = useAppSelector((state) => state.itemBag);
  const {user, accessToken} = useAppSelector((state) => state.profile);
  const [listRestaurants, setListRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchingRestaurants = async () => {
    try {
      const resAllRestaurants = await API_Ordering.homeScreen({
        ...(accessToken.length > 0 && {customer: user._id}),
        ...(category_id.length > 0 && {category: category_id}),
      });
      if (resAllRestaurants.code === StatusCodes.SUCCESS) {
        setListRestaurants(resAllRestaurants.data.allRestaurants);
      }

      setIsLoading(false);
    } catch (error) {
      console.log({error});
    }
  };

  useEffect(() => {
    fetchingRestaurants();
  }, []);

  const onPressRestaurant = (item: Restaurant, index: number) => {
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
      dispatch(selectResturant({restaurantId: item._id}));
      navigation.navigate('ChooseLocation', item);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemeRedHeader headerTitle={`${category_name} Restaurnt`} />
      <FlatList
        data={listRestaurants}
        style={styles.body}
        contentContainerStyle={styles.subBody}
        renderItem={({index, item, separators}) => {
          return (
            <ItemRestaurant
              name={item.name}
              cost=""
              rating=""
              onPress={() => {
                onPressRestaurant(item, index);
              }}
              restaurantAddress={item.address}
              timeing={'15'}
              restaurantImage={item.logo}
            />
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    marginHorizontal: ComponentMatrix.HORIZONTAL_12,
  },
  subBody: {
    gap: ms(8),
    paddingVertical: ms(8),
  },
  item: {},
});

export default AllListingsCategoriesScreens;
