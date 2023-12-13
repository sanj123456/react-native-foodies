import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {colors, commonStyles, fonts, fontSize, ms, vs} from '../styles';
import {percentage} from '../utils/functions';
import SelectableButtonPayment from './SelectableButtonPayment';

const AddATip = ({tip = 0, onTipValue = (tip: number) => {}}: {tip: number; onTipValue: (tipValue: number, tipPercentage: number, isUserGiveTip: boolean) => void}) => {
  const tips = [15, 18, 20];
  const [selectedTip, setNewTipIndex] = useState(-1);
  const [advancedTip, setAdvancedTip] = useState('');

  useEffect(() => {
    let _currentTip = 0;

    try {
      if (selectedTip === -1) {
        onTipValue(0, 0, false);
      } else {
        _currentTip = selectedTip < tips.length ? percentage(tip, tips[selectedTip]) : Number(advancedTip);
        onTipValue(_currentTip, tips[selectedTip], selectedTip !== -1);
      }
    } catch (error) {
      console.log({error});
    }
  }, [tip, advancedTip, selectedTip]);

  return (
    <View style={[styles.couponWrapper]}>
      <View style={{paddingHorizontal: '3%', marginVertical: '4%'}}>
        <Text style={styles.sectionHeader}>Tip</Text>
        <View style={{flexDirection: 'row', columnGap: ms(5), marginTop: vs(8)}}>
          {tips.map((tip, index) => {
            return <SelectableButtonPayment title={`${tip}%`} onPress={() => setNewTipIndex(index)} selected={index === selectedTip} />;
          })}
          <SelectableButtonPayment title={`other`} onPress={() => setNewTipIndex(tips.length)} selected={tips.length === selectedTip} />
        </View>
        {tips.length === selectedTip && (
          <TextInput
            onChangeText={(text) => {
              setAdvancedTip(text.replace(/[^0-9]/g, ''));
            }}
            keyboardType={'number-pad'}
            autoCapitalize={'none'}
            autoCorrect={false}
            placeholder={'Enter Tip Amount'}
            maxLength={7}
            value={advancedTip}
            style={{fontFamily: fonts.BGFlame, fontSize: fontSize.fs13, borderWidth: 1, borderColor: '#CDCDCD', borderRadius: 4, height: vs(42), paddingLeft: ms(10), marginTop: vs(11)}}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {color: '#777676', fontFamily: fonts.BGFlameBold, fontSize: fontSize.fs15},
  couponWrapper: {marginHorizontal: '4%', marginVertical: '1%', backgroundColor: colors.white, borderRadius: 10, ...commonStyles.shadowStyles, marginBottom: 10},
});

export default AddATip;
