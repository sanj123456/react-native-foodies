import {StyleSheet, Text, TextStyle, ViewStyle, StyleProp, View, Pressable} from 'react-native';
import React, {useEffect} from 'react';
import {ms, vs} from 'react-native-size-matters';
import WhiteBox from './WhiteBox';
import {colors} from '../styles';
import PercentageBar from './PercentageBar';
import fontSize, {fonts} from '../styles/fonts';
import {LoyaltyPointRule} from '../api';

interface LoyaltyBalanceProps {
  headerStyle?: StyleProp<TextStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  loyaltyState: LoyaltyPointRule;
  onUse: () => void;
  onRemove: () => void;
  subTotal: number;
  isUseLoyaltyBalance: boolean;
}

const LoyaltyBalance = (props: LoyaltyBalanceProps) => {
  const {
    loyaltyState: {loyaltyRules, loyaltyPoints},
    subTotal = 0,
  } = props;

  const msg1 = (points: any) => `You don't have enough points to redeem. (Min. ${points} PTS required for redemption)`;
  const msg2 = (points: any) => `Doesn't meet loyalty requirements\n(Min. $${points} Subtotal required)`;

  const renderMessage = () => {
    if (subTotal < loyaltyRules.minSubtotal) {
      return <Text style={{color: colors.requireItemText}}>{msg2(loyaltyRules.minSubtotal)}</Text>;
    }
    if (loyaltyPoints < loyaltyRules.minRedeemableAmount) {
      return <Text style={{color: colors.requireItemText}}>{msg1(loyaltyRules.minRedeemableAmount)}</Text>;
    }
    return null;
  };

  return (
    <WhiteBox style={styles.mainContainer}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={props.headerStyle}>Loyalty Balance</Text>
        <Text>$1 = {props.loyaltyState.loyaltyRules.pointsPerDollar} PTS</Text>
      </View>
      <Text style={styles.lblAvailablePoints}>Available Points - {props.loyaltyState.loyaltyPoints}</Text>
      <PercentageBar progress={props.loyaltyState.isUseLoyaltyBalance ? 15 : 50} containerStyle={{marginTop: vs(6)}} points={props.loyaltyState.isUseLoyaltyBalance ? 0 : props.loyaltyState.loyaltyPoints} />
      {renderMessage()}
      {props.isUseLoyaltyBalance ? (
        <Pressable style={styles.btnApply} onPress={props.onRemove}>
          <Text style={styles.btnText}>Remove</Text>
        </Pressable>
      ) : subTotal >= loyaltyRules.minSubtotal && loyaltyPoints >= loyaltyRules.minRedeemableAmount ? (
        <Pressable style={styles.btnApply} onPress={props.onUse}>
          <Text style={styles.btnText}>Use now</Text>
        </Pressable>
      ) : null}
    </WhiteBox>
  );
};

export default LoyaltyBalance;

const styles = StyleSheet.create({
  mainContainer: {},
  lblAvailablePoints: {
    color: colors.darkBlackText,
    fontFamily: fonts.BGFlame,
    fontSize: fontSize.fs15,
    marginTop: vs(5),
  },
  btnApply: {
    backgroundColor: colors.headerbg,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    borderRadius: 10,
    paddingHorizontal: ms(16),
    maxWidth: ms(150),
    height: vs(40),
    marginTop: vs(8),
  },
  btnText: {
    fontSize: fontSize.fs16,
    fontFamily: fonts.BGFlameBold,
    color: '#ffffff',
  },
});
