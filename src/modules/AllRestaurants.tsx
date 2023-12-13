import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {ms, vs} from 'react-native-size-matters';
import {API_Ordering, IRestaurant, StatusCodes} from '../api';
import {ThemeRedHeader} from '../components';
import ItemRestaurant from '../components/ItemRestaurant';
import {StackScreenRouteProp} from '../types/navigationTypes';

export interface AllRestaurantsProps {}

const AllRestaurants: React.FC<NativeStackScreenProps<StackScreenRouteProp, 'AllRestaurants'>> = ({navigation, route}) => {
  const [listRestaurants, setListRestaurants] = useState<IRestaurant[]>([]);

  useEffect(() => {
    const fetchingRestaurants = async () => {
      const resAllRestaurants = await API_Ordering.list_all_restaurants();

      if (resAllRestaurants.code === StatusCodes.SUCCESS) {
        setListRestaurants(resAllRestaurants.data);
      }
    };

    fetchingRestaurants();
  }, []);

  return (
    <View style={styles.container}>
      <ThemeRedHeader
        onPressLeft={() => {
          navigation.goBack();
        }}
        headerTitle="All Restaurants"
      />
      <FlatList
        data={listRestaurants}
        contentContainerStyle={{rowGap: vs(15), marginHorizontal: ms(16)}}
        renderItem={({item, index}) => (
          <ItemRestaurant
            onPress={() => {
              navigation.navigate('ChooseLocation', item);
            }}
            restaurantImage={item.restaurant.logo}
            name={item.restaurant.name}
            cost="1.99"
            rating="4.5"
            timeing="15"
            key={index}
            restaurantAddress=""
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AllRestaurants;
