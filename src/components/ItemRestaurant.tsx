import React from 'react';
import {Image, StyleSheet, Text, Pressable, View} from 'react-native';
import {colors, ms, vs} from '../styles';
import fontSize, {fonts} from '../styles/fonts';
import {images} from '../core';
import FastImage from 'react-native-fast-image';

export type Props = {
  onPress: () => void;
  restaurantImage?: string;
  name: string;
  rating: string;
  cost: string;
  timeing: string;
  restaurantAddress: string;
};

const ItemRestaurant: React.FC<Props> = (props) => {
  return (
    <Pressable onPress={props?.onPress} style={styles.container}>
      <FastImage style={styles.thumbnail} source={{uri: props.restaurantImage}} />
      <View style={styles.rightView}>
        <View style={styles.topRow}>
          <Text style={styles.lblName}>{props.name}</Text>
        </View>
        <View style={{height: 1, backgroundColor: '#D6D6D6'}} />
        <View style={styles.secondRow}>
          <Text style={styles.lblTiming}>{props.restaurantAddress}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: ms(8),
  },
  thumbnail: {
    height: vs(82),

    aspectRatio: 4 / 3,
    borderRadius: ms(10),
    resizeMode: 'stretch',
  },
  rightView: {
    flex: 1,
    justifyContent: 'space-around',
  },
  lblName: {
    color: colors.darkBlackText,
    fontSize: fontSize.fs15,
    fontFamily: fonts.BGFlameBold,
  },
  vwRatingContainer: {
    flexDirection: 'row',
    marginLeft: 5,
    alignItems: 'center',
    columnGap: 5,
  },
  lblRating: {
    fontSize: fontSize.fs13,
    fontFamily: fonts.BGFlame,
    color: '#3BB54A',
  },
  topRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  secondRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lblDeliveryTime: {
    fontFamily: fonts.BGFlame,
    fontSize: fontSize.fs11,
    color: '#808080',
  },
  lblTiming: {
    fontFamily: fonts.BGFlame,
    fontSize: fontSize.fs11,
    color: '#808080',
  },
});
export default ItemRestaurant;
