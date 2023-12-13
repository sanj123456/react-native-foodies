import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {fonts, fontSize, vs} from '../styles';

const OrderDetailsItem = ({title, val}: {title: string; val: any}) => {
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: vs(5)}}>
      <Text style={styles.keyOrderDetailsItem}>{title}</Text>
      <Text style={[styles.valOrderDetailsItem, {flex: 1, maxWidth: '70%'}]}>{val}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  keyOrderDetailsItem: {fontSize: fontSize.fs14, fontFamily: fonts.BGFlameBold, color: '#777676'},
  valOrderDetailsItem: {fontFamily: fonts.BGFlameBold, fontSize: fontSize.fs13, textAlign: 'right', color: '#343434'},
});

export default OrderDetailsItem;
