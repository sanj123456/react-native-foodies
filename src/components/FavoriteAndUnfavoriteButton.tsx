import React from 'react';
import {Button, StyleSheet, Text, View, Image, Pressable, PressableProps} from 'react-native';
import {dispatch, useAppSelector} from '../redux';
import {images} from '../core';
import {API_Ordering, StatusCodes} from '../api';
import {prettyPrint, showDangerMessage, showSuccessMessage} from '../utils/functions';
import {setFavorite} from '../redux/modules/restaurantSlice';

export interface FavoriteAndUnfavoriteButtonProps extends PressableProps {}

const FavoriteAndUnfavoriteButton: React.FC<FavoriteAndUnfavoriteButtonProps> = (props) => {
  const {accessToken, user} = useAppSelector((state) => state.profile);
  const {restaurantIdForFavorite} = useAppSelector((state) => state.itemBag);
  const {isFavorite} = useAppSelector((state) => state.restaurant);

  if (accessToken.length == 0) {
    return null;
  }

  const handleClick = async () => {
    try {
      const response = await API_Ordering.add_fav_restaurant({
        customerId: user._id,
        restaurantId: restaurantIdForFavorite,
      });
      if (response.code === StatusCodes.SUCCESS) {
        showSuccessMessage(response.data.message);
        dispatch(setFavorite(!isFavorite));
      } else {
        showDangerMessage(response?.data?.message);
      }
    } catch (error) {
      console.log({error});
      showDangerMessage('Something went wrong.');
    }
  };

  return (
    <Pressable {...props} onPress={handleClick}>
      <Image style={{height: 32, width: 32, tintColor: 'white'}} source={accessToken.length && isFavorite ? images.filledHeart : images.unFilledHeart} />
    </Pressable>
  );
};

const styles = StyleSheet.create({});

export default FavoriteAndUnfavoriteButton;
