import React, {useState} from 'react';
import {LayoutAnimation, Pressable, StyleSheet, Text, View, Platform, UIManager, StyleProp, ViewProps, ViewStyle} from 'react-native';
import {PriceTag} from '../modules/OrderDetailPageComponents';
import CheckOutTaxItem from './CheckOutTaxItem';
import DropDownIcon from '../../assets/SVGImages/DropDownIcon';
import {colors, commonStyles} from '../styles';
import WhiteBox from './WhiteBox';

type TaxRow = {
  title: any;
  amount: any;
};

export interface TaxFeesBlockProps {
  data: any;
  styleWhiteBox?: StyleProp<ViewStyle>;
}
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
const TaxFeesBlock: React.FC<TaxFeesBlockProps> = ({data, styleWhiteBox}) => {
  const makeAList = () => {
    const taxDetails: TaxRow[] = [];

    if (Array.isArray(data.taxDetails)) {
      data.taxDetails.forEach((taxDetail: any) => {
        const a = {
          title: taxDetail.name,
          amount: taxDetail.amount,
        };

        taxDetails.push(a);
      });
    }

    let _orderFee = 0;
    let _deliveryFee = 0;

    if (data['Ordering Fee'] && data['Ordering Fee'] > 0) {
      // const a = {
      //   title: 'Ordering Fee',
      //   amount: data['Ordering Fee'],
      // };

      // taxDetails.push(a);
      _orderFee = data['Ordering Fee'];
    }

    if (data['Delivery Fee'] && data['Delivery Fee'] > 0) {
      // const a = {
      //   title: 'Delivery Fee',
      //   amount: data['Delivery Fee'] + _orderFee,
      // };

      // taxDetails.push(a);
      _deliveryFee = data['Delivery Fee'];
    }

    if (_orderFee + _deliveryFee > 0) {
      console.log(_orderFee, _deliveryFee);
      const a = {
        title: _deliveryFee == 0 ? 'Ordering Fee' : 'Delivery Fee',
        amount: _orderFee + _deliveryFee,
      };

      taxDetails.push(a);
    }

    // if (data['ihd Fee'] && data['ihd Fee'] > 0) {
    //   const a = {
    //     title: 'ihd Fee',
    //     amount: data['ihd Fee'],
    //   };

    //   taxDetails.push(a);
    // }

    return taxDetails;
  };

  const taxDetailsData = makeAList();
  const [side, setSide] = useState(false);

  const totalAmount = taxDetailsData.reduce((a, b) => {
    return a + b.amount;
  }, 0);

  return (
    <View style={[styles.container]}>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <Pressable
          onPress={() => {
            LayoutAnimation.configureNext({
              duration: 500,
              update: {type: 'spring', springDamping: 0.9},
            });
            setSide(!side);
          }}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={commonStyles.totalRowText}>Tax & Fees</Text>
          <DropDownIcon side={side ? 'up' : 'down'} />
        </Pressable>
        {!side && <PriceTag price={totalAmount} />}
      </View>

      <WhiteBox removeShadowStyles={true} style={[{marginHorizontal: 0, paddingVertical: 0, paddingRight: 0}, styleWhiteBox]}>
        {side &&
          taxDetailsData.map((taxDetail) => {
            return <CheckOutTaxItem item={{title: taxDetail.title, price: taxDetail.amount}} />;
          })}
      </WhiteBox>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TaxFeesBlock;
