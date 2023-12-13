import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {PriceTag} from '../modules/OrderDetailPageComponents';
import {commonStyles, fontSize, fonts, vs} from '../styles';

export interface CheckOutTaxItemProps {
  item: {
    title: string;
    price: any;
    disable?: boolean;
  };
  isMinus?: boolean;
}

const CheckOutTaxItem: React.FC<CheckOutTaxItemProps> = ({item, isMinus}) => {
  if (item?.disable) return null;
  const {title, price} = item;

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: vs(5),
      }}>
      <Text style={commonStyles.totalRowText}>{String(title)}</Text>
      <PriceTag isMinus={typeof isMinus !== 'undefined' ? isMinus : String(title) === 'Coupon Discount'} price={price} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CheckOutTaxItem;
