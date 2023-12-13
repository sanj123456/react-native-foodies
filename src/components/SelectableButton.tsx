import React from 'react';
import {Pressable, PressableProps, StyleProp, StyleSheet, Text, ViewStyle} from 'react-native';
import {colors, fonts, fontSize} from '../styles';

const SelectableButton = ({selected, onPress, title, style}: {selected: boolean; onPress: PressableProps['onPress']; title: string; style?: StyleProp<ViewStyle>}) => {
  return (
    <Pressable style={[styles.rightButtonWrapper, selected && {backgroundColor: colors.headerbg}, style]} onPress={onPress}>
      <Text style={{color: selected ? colors.white : colors.headerbg, textAlign: 'center', fontFamily: fonts.BGFlameBold, fontSize: fontSize.fs14}}>{title}</Text>
    </Pressable>
  );
};

export const styles = StyleSheet.create({
  rightButtonWrapper: {backgroundColor: '#FFECEA', borderWidth: 1, borderColor: '#EFEFEF', paddingVertical: '6%', borderRadius: 10, width: '31%', paddingLeft: 3, paddingRight: 3},
});

export default SelectableButton;
