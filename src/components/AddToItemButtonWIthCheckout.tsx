import React from 'react';
import {Pressable, PressableProps, StyleSheet, Text, View} from 'react-native';
import {useTotal} from '../hooks';
import {colors, fonts, ms, vs, fontSize} from '../styles';

type BtnShowType = 'Added' | 'Checkout' | 'Add';
interface IAddToItemButtonWithCheckout extends PressableProps {
  showType?: BtnShowType;
  total?: any;
}

const AddToItemButtonWIthCheckout = ({showType = 'Added', total, ...props}: IAddToItemButtonWithCheckout) => {
  const {numSums, sumOfPrice} = useTotal();

  return (
    <Pressable style={styles.btnStyle} {...props}>
      <View style={{marginLeft: 12}}>
        <Text style={[styles.locationText, {color: colors.white}]}>{showType === 'Added' ? `${numSums} Item Added To BAG` : showType === 'Add' ? `Add To BAG` : 'CHECKOUT'}</Text>
      </View>
      {/* <PriceTag price={sumOfPrice}/> */}
      <View style={{marginRight: 12}}>
        <Text style={[styles.locationText, {color: colors.white}]}>${showType === 'Added' ? sumOfPrice : total}</Text>
      </View>
    </Pressable>
  );
};

export default AddToItemButtonWIthCheckout;

const styles = StyleSheet.create({
  locationText: {
    color: colors.lightGray,
    fontSize: fontSize.fs16,
    fontFamily: fonts.BGFlameBold,
  },
  btnStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '3%',
    backgroundColor: colors.headerbg,
    paddingVertical: vs(10),
    borderRadius: ms(5),
    marginTop: vs(15),
    marginBottom: vs(10),
  },
});
