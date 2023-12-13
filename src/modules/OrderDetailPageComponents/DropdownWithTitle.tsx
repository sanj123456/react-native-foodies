import React, {useState, useEffect, useRef} from 'react';
import {Image, Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {images} from '../../core';
import ToppingTitle from './ToppingTitle';
import {ms, vs} from 'react-native-size-matters';
import RequiredTitle from './RequiredTitle';
import {colors} from '../../styles';
import {orderDetailStyles} from '../OrderDetailPage';

export const DropdownWithTitle = (props: {title: string; data: any[]; onChangeValue: (data: any) => void; item: any}) => {
  const {item} = props;

  const [price, setPrice] = useState(0);
  const [value, setValue] = useState({});

  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    props?.onChangeValue?.({
      ...value,
      id: value?.product_id,
      name: props?.title,
      product_name: value?.product_name,
      type: 'select',
    });
  }, [value, price]);

  return (
    <>
      <ToppingTitle>
        {props.title}
        <RequiredTitle>{Boolean(item?.isRequired) && '*'}</RequiredTitle>
      </ToppingTitle>
      <Dropdown
        data={props.data}
        valueField="product_id"
        labelField="product_name"
        value={value}
        onChange={(item) => {
          setValue(item);
          setPrice(item?.price);
        }}
        renderRightIcon={() => (
          <View style={{position: 'absolute', right: 0}}>
            <Image style={orderDetailStyles.dropDownIconStyle} source={images.icDropdownIcon} />
          </View>
        )}
        style={{
          borderWidth: 1,
          backgroundColor: '#F6F6F6',
          borderColor: colors.gray,
          paddingStart: ms(12),
          paddingEnd: ms(16),
          minHeight: vs(34),
          borderRadius: ms(4),
        }}
      />
    </>
  );
};
