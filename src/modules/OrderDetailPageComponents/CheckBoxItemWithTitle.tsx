import React, {useEffect, useRef, useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {ItemCounter} from '../../components';
import {images} from '../../core';
import {ms, vs} from '../../styles';
import {orderDetailStyles} from '../OrderDetailPage';
import {PaginationRow} from './PaginationRow';
import PriceTag from './PriceTag';
import RequiredTitle from './RequiredTitle';
import ToppingTitle from './ToppingTitle';
import {PizzaOptions} from './types';
import {minMaxRequireStringBuilder, showDangerMessage} from '../../utils/functions';
export const CheckBoxItemWithTitle = (props: {title: string; item: any; onChangeValue: (data: any) => void; qty: number}) => {
  const {title = '', item, qty} = props;

  const [toppingItem, setToppingItem] = useState(Array.from({length: item?.subProducts?.length ?? 0}));

  const {advancedPizzaOptions = false, enableQtyUpdate = false, isRequired} = item ?? {};

  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    props?.onChangeValue?.(toppingItem);
  }, [toppingItem]);

  let minMaxRequireString = minMaxRequireStringBuilder(item);

  return (
    <View style={{marginTop: vs(10)}}>
      <ToppingTitle>
        {title}
        <RequiredTitle>{minMaxRequireString}</RequiredTitle>
      </ToppingTitle>
      {item?.subProducts?.map((p: any, index: number) => {
        return (
          <CheckItem
            key={`${index}`}
            itemData={item}
            p={p}
            name={title}
            isRequired={isRequired}
            advancedPizzaOptions={advancedPizzaOptions}
            enableQtyUpdate={enableQtyUpdate}
            qty={qty}
            onChangeValue={(data: any) => {
              setToppingItem((_tI) => {
                _tI[index] = data;
                return [..._tI];
              });
            }}
          />
        );
      })}
    </View>
  );
};

const CheckItem = ({itemData, p, advancedPizzaOptions, enableQtyUpdate, onChangeValue = () => {}, name, isRequired, qty}: any) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(-1);
  const [selectedSubModifier, setSelectedSubModifier] = useState<{
    value: string;
    label: string;
  }>({
    value: '',
    label: '',
  });
  const [pizzaOptions, setPizzaOptions] = useState<PizzaOptions>({
    side: 'All',
    size: 'Extra',
  });

  const [iQtyCount, setQty] = useState<number>(1);

  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (isChecked) {
      console.log(qty, iQtyCount, itemData);
      if (itemData.max && qty >= itemData.max) {
        showDangerMessage(`You can select ${itemData.max} maximum.`);
        setIsChecked(false);
        return;
      } else {
        let onChangeData = null;
        if (advancedPizzaOptions) {
          onChangeData = {
            advancedPizzaOptions: true,
            enableParentModifier: itemData?.enableParentModifier,
            defaultSelected: p?.defaultSelected,
            id: p?.product_id,
            name: name,
            product_name: p?.product_name,
            price: p?.price,
            type: 'checkbox',
            ...pizzaOptions,
            extraPrice: p?.extraPrice,
            halfPrice: p?.halfPrice,
            ...(p?.subModifiers?.length > 0 && {
              selectedSubModifier,
              price: index === -1 ? 0 : p?.price + p?.subModifiers[index]?.price,
              name: name,
              product_name: p?.product_name,
            }),
          };
        } else {
          onChangeData = {
            id: p?.product_id,
            name: name,
            product_name: p?.product_name,
            price: p?.price,
            type: 'checkbox',
            ...(p?.subModifiers?.length > 0 && {
              selectedSubModifier,
              price: index === -1 ? 0 : p?.price + p?.subModifiers[index]?.price,
              name: name,
              product_name: p?.product_name,
            }),
            ...(Boolean(advancedPizzaOptions) && {pizzaOptions}),
            ...(Boolean(enableQtyUpdate) && {quantity: iQtyCount}),
          };
        }

        onChangeValue(onChangeData);
      }
    } else {
      onChangeValue(null);
    }
  }, [isChecked, selectedSubModifier, pizzaOptions, iQtyCount]);

  const data = p?.subModifiers?.map(({name, price}: any) => {
    return {
      value: `${price}`,
      label: `${name} - $${price}`,
    };
  });

  const getThePrice = () => {
    if (Boolean(advancedPizzaOptions)) {
      if (pizzaOptions.size === 'Regular') {
        if (pizzaOptions.side === 'All') {
          return p?.price ?? 0;
        } else {
          return p?.halfPrice ?? 0;
        }
      } else if (pizzaOptions.size === 'Extra') {
        if (pizzaOptions.side === 'All') {
          return p?.extraPrice ?? 0;
        } else {
          return p?.extraPrice / 2;
        }
      }
    } else if (Boolean(enableQtyUpdate)) {
      return p?.price * iQtyCount;
    } else if (p?.subModifiers?.length > 0) {
      return p?.price + index === -1 ? 0 : p?.subModifiers[index]?.price;
    } else {
      return p?.price;
    }
  };

  return (
    <>
      <Pressable
        onPress={() => {
          setIsChecked(!isChecked);
        }}
        style={{
          marginTop: vs(5),
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Image
          style={[
            {
              width: ms(20),
              height: ms(20),
            },
            isRequired && styles.requiredCheckBox,
          ]}
          source={isChecked ? images.icCheck : images.icUncheck}
        />
        <Text style={[orderDetailStyles.itemTxt, {fontWeight: '400', flex: 1, marginStart: ms(9)}]}>{p?.product_name}</Text>
        <PriceTag price={getThePrice()} />
      </Pressable>
      {isChecked && Boolean(enableQtyUpdate) && (
        <ItemCounter
          from={'CheckItem'}
          onChangeValue={(nextValue) => {
            if (nextValue === 0) {
              setIsChecked(false);
            } else {
              setQty(nextValue);
            }
          }}
        />
      )}
      {isChecked && Boolean(advancedPizzaOptions) && (
        <PaginationRow
          onChangeValue={({side, size}) => {
            setPizzaOptions({
              side: side,
              size: size,
            });
          }}
          extraPrice={p?.extraPrice ?? '0'}
        />
      )}
      {isChecked && !Boolean(enableQtyUpdate) && !Boolean(advancedPizzaOptions) && p?.subModifiers?.length > 0 && (
        <Dropdown
          onChange={(item: any) => {
            setSelectedSubModifier(item);
            setIndex(item?._index);
          }}
          value={selectedSubModifier}
          data={data}
          labelField={'label'}
          valueField={'value'}
          style={{
            borderWidth: 1,
            backgroundColor: '#F6F6F6',
            borderColor: '#E3E3E3',
            paddingStart: ms(12),
            paddingEnd: ms(16),
            minHeight: vs(34),
            borderRadius: ms(4),
            marginTop: vs(5),
          }}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  requiredCheckBox: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'red',
    borderRadius: ms(2),
  },
});
