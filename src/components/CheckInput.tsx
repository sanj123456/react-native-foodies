import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {ms, vs} from 'react-native-size-matters';
import {images} from '../core';
import fontSize, {fonts} from '../styles/fonts';
import {colors} from '../styles';

const CheckInput = ({onChangeValue = (nextIsChecked: boolean) => {}, initValue = false, title = '', containerStyle = undefined}) => {
  const [checked, setChecked] = useState(initValue);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setChecked(initValue);
  }, [initValue]);

  const handleClick = () => {
    setChecked(!checked);
    onChangeValue(!checked);
  };

  return (
    <Pressable onPress={handleClick} style={[styles.container, containerStyle]}>
      <Image style={styles.checkbox} source={checked ? images.icCheck : images.icUncheck} />
      {String(title).length > 0 && <Text style={styles.text}>{title}</Text>}
    </Pressable>
  );
};

export default CheckInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vs(16),
  },
  text: {
    fontSize: fontSize.fs13,
    fontFamily: fonts.BGFlame,
    color: colors.darkBlackText,
    flex: 1,
    marginStart: ms(9),
  },
  checkbox: {
    width: ms(20),
    height: ms(20),
  },
});
