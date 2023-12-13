import React, {FC, useState, useEffect, useRef} from 'react';
import {View, Pressable, TextInput, Text} from 'react-native';
import {PrimaryText} from '../components';
import {commonStyles, vs} from '../styles';
import {ItemCounterProps} from '../types/components';
import {itemCounterStyles} from './itemCounterStyles';

const ItemCounter: FC<ItemCounterProps> = (props) => {
  const {value, maxLength = Infinity, onChangeValue = () => {}, from} = props;
  const [counter, setCounter] = useState<number>(typeof value === 'undefined' ? 1 : value);
  const focused = useRef<boolean>(false);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!focused.current) {
      onChangeValue(counter);
    }
  }, [counter]);

  useEffect(() => {
    if (value) {
      setCounter(value);
    }
  }, [value]);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: vs(6),
      }}>
      <Pressable
        onPress={() => {
          setCounter((c: number) => {
            if (c - 1 >= 0) {
              return c - 1;
            }
            return c;
          });
        }}
        style={itemCounterStyles.buttonStyle}>
        <PrimaryText style={itemCounterStyles.buttonText}>-</PrimaryText>
      </Pressable>
      <View style={itemCounterStyles.inputView}>
        <TextInput
          keyboardType="number-pad"
          hitSlop={commonStyles.hitSlop}
          style={itemCounterStyles.inputStyles}
          value={`${counter}`}
          onChangeText={(txt) => {
            setCounter(Number(txt.replace(/\D/g, '')));
          }}
          onFocus={() => {
            focused.current = true;
          }}
          onBlur={() => {
            focused.current = false;
          }}
          editable={false}
        />
      </View>
      <Pressable
        onPress={() => {
          setCounter((c: number) => {
            if (c + 1 <= maxLength) {
              return c + 1;
            }
            return c;
          });
        }}
        style={itemCounterStyles.buttonStyle}>
        <PrimaryText style={itemCounterStyles.buttonText}>+</PrimaryText>
      </Pressable>
    </View>
  );
};

export {ItemCounter};
export default ItemCounter;
