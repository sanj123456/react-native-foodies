import {StyleSheet, Text, View} from 'react-native';
import React, {FC, useState, useEffect, useRef} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {birthDates} from '../staticData';
import {ms, vs} from 'react-native-size-matters';
import WhiteBox from './WhiteBox';
import ToppingTitle from '../modules/OrderDetailPageComponents/ToppingTitle';

const LocalDatePicker = ({title = '', onChangeValue = (date: string) => {}}) => {
  const firstRender = useRef(true);
  const [monthIndex, setMonthIndex] = useState<number>(-1);
  const [dateMonth, setDateMonth] = useState<string>('');
  const [dateDay, setDateDay] = useState<string>('');

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    onChangeValue(`${dateMonth}/${dateDay}`);
  }, [monthIndex, dateDay]);

  return (
    <WhiteBox removeShadowStyles={true} style={{backgroundColor: '#FFFFFF', borderRadius: ms(10), marginTop: vs(10), marginHorizontal: 0, padding: 0}}>
      <ToppingTitle containerStyle={{flex: 1}}>{title} Month</ToppingTitle>
      <Dropdown
        data={birthDates}
        labelField="label"
        valueField="value"
        onChange={(item) => {
          setMonthIndex(item.index);
          setDateMonth(`${item.value}`);
        }}
        confirmSelectItem
        style={{
          borderWidth: 1,
          backgroundColor: '#F6F6F6',
          borderColor: '#E3E3E3',
          borderRadius: ms(4),
          flex: 2.5,
          paddingEnd: ms(12),
          paddingStart: ms(12),
        }}
        containerStyle={{}}
        placeholder="Select month"
      />
      <ToppingTitle containerStyle={{flex: 1}}>{title} Date</ToppingTitle>
      <Dropdown
        data={birthDates[monthIndex]?.data ?? []}
        labelField="label"
        valueField="value"
        onChange={(item) => {
          setDateDay(`${item.value}`);
        }}
        style={{
          borderWidth: 1,
          backgroundColor: '#F6F6F6',
          borderColor: '#E3E3E3',
          borderRadius: ms(4),
          flex: 2.5,
          paddingEnd: ms(12),
          paddingStart: ms(12),
        }}
        placeholder="Select date"
      />
    </WhiteBox>
  );
};

export default LocalDatePicker;

const styles = StyleSheet.create({});
