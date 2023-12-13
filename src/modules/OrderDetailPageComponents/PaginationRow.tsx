import React, {useState, useRef, useEffect} from 'react';
import {PressableProps, View, Text, Pressable} from 'react-native';
import {PaginationButton} from './PaginationButton';
import {colors, fonts, fontSize, ms} from '../../styles';
import {PizzaOptions, ToppingSides, ToppingSizes} from './types';
import {orderDetailStyles} from '../OrderDetailPage';

export const PaginationRow = ({onChangeValue = () => {}, extraPrice = '0'}: {onChangeValue: ({side, size}: Omit<PizzaOptions, 'price'>) => void; extraPrice: number | string}): JSX.Element => {
  const [toppingSize, setToppingSize] = useState<ToppingSizes>('Extra');
  const [toppingSide, setToppingSide] = useState<ToppingSides>('All');

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    onChangeValue({
      side: toppingSide,
      size: toppingSize,
    });
  }, [toppingSize, toppingSide]);

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
          paddingHorizontal: ms(2),
          columnGap: ms(10),
        }}>
        <PressableToppingSelector
          onPress={() => {
            setToppingSize('Regular');
          }}
          isSelected={toppingSize === 'Regular'}
          title="Regular"
        />
        <PressableToppingSelector
          onPress={() => {
            setToppingSize('Extra');
          }}
          isSelected={toppingSize === 'Extra'}
          title={`Extra - $${extraPrice}`}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
          paddingHorizontal: ms(2),
          columnGap: ms(10),
        }}>
        <PaginationButton
          onPress={() => {
            setToppingSide('Left');
          }}
          isRed={toppingSide === 'Left'}
          title={'Left'}
        />
        <PaginationButton
          onPress={() => {
            setToppingSide('All');
          }}
          isRed={toppingSide === 'All'}
          title={'All'}
        />
        <PaginationButton
          onPress={() => {
            setToppingSide('Right');
          }}
          isRed={toppingSide === 'Right'}
          title={'Right'}
        />
      </View>
    </>
  );
};

const PressableToppingSelector = ({title, isSelected, ...props}: PressableProps & {title: string; isSelected: boolean}) => {
  return (
    <Pressable style={[orderDetailStyles.buttonWrapper, {marginLeft: 0}]} {...props}>
      <Text
        style={{
          color: isSelected ? colors.headerbg : colors.darkBlackText,
          textAlign: 'center',
          fontFamily: fonts.BGFlame,
          fontSize: fontSize.fs13,
        }}>
        {title}
      </Text>
    </Pressable>
  );
};
