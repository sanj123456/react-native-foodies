import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {ms, vs} from 'react-native-size-matters';
import {IRestaurant} from '../api';
import {ItemRestaurant} from '../components';
import ThemeRedHeader from '../components/ThemeRedHeader';
import {useAppSelector} from '../redux/hooks';
import {colors, commonStyles} from '../styles';
import {StackScreenRouteProp} from '../types/navigationTypes';

export type Props = {};

const FavoriteRestaurantScreen: React.FC<NativeStackScreenProps<StackScreenRouteProp, 'FavoriteRestaurantScreen'>> = ({navigation, route}) => {
  const [listFavRestaurants, setListFavRestaurants] = useState<IRestaurant[]>([]);

  const {user, accessToken} = useAppSelector((state) => state.profile);

  useEffect(() => {}, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={{backgroundColor: colors.white}}>
        <ThemeRedHeader
          headerTitle="Favorites"
          onPressLeft={() => {
            navigation.goBack();
          }}
        />
        {accessToken.length === 0 ? (
          <Text style={[commonStyles.errorText, {textAlign: 'center'}]}>You must sign in to use your favorite list.</Text>
        ) : listFavRestaurants.length === 0 ? (
          <Text style={[commonStyles.errorText, {textAlign: 'center'}]}>No Favorites Restaurants.</Text>
        ) : (
          <FlatList
            data={listFavRestaurants}
            contentContainerStyle={{rowGap: vs(15), marginHorizontal: ms(16)}}
            renderItem={({item, index}) => {
              return (
                <ItemRestaurant
                  name={item.restaurant.name}
                  cost="1.99"
                  rating="4.5"
                  timeing="15"
                  key={index}
                  restaurantImage={item.restaurant.logo}
                  onPress={() => {
                    navigation.navigate('ChooseLocation', item);
                  }}
                  restaurantAddress={''}
                />
              );
            }}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default FavoriteRestaurantScreen;
