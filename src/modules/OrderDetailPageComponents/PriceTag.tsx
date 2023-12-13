import {StyleSheet, Text, View, ViewProps} from 'react-native';
import React from 'react';
import {colors, fonts, fontSize} from '../../styles';

const PriceTag = ({children, isMinus = false, ...props}: ViewProps & {price: string | number; isMinus?: boolean}) => {
  return (
    <View style={props.style}>
      <Text style={styles.priceTag}>{`${isMinus ? '-' : ''} $${Number(props.price ?? '0').toFixed(2)}`}</Text>
    </View>
  );
};

export default PriceTag;

const styles = StyleSheet.create({
  priceTag: {
    fontFamily: fonts.BGFlameBold,
    fontSize: fontSize.fs13,
    textAlign: 'right',
    color: colors.darkBlackText,
  },
});
