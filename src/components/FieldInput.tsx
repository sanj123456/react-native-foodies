import React, {FC, useState} from 'react';
import {TextInput, View} from 'react-native';
import {colors, fontSize, fonts} from '../styles';
import {} from '../styles/fonts';
import {FieldInputProps} from '../types/components';
import PrimaryText from './PrimaryText';

const FieldInput: FC<FieldInputProps> = ({placeholder, inputViewStyles, onChangeText, value, type = '', title, onBlur, keyboardType, contentContainerStyle, ...otherProps}) => {
  const [hidePassword, setHidePassword] = useState(type == 'password');

  return (
    <View style={[{width: '100%'}, contentContainerStyle]}>
      {title && <PrimaryText style={{color: colors.lightBlueText}}>{title}</PrimaryText>}
      <TextInput
        style={[
          {
            fontFamily: fonts.BGFlame,
            fontSize: fontSize.fs13,
          },
          inputViewStyles,
          typeof otherProps.editable !== 'undefined' && otherProps.editable === false && {color: colors.greyText},
        ]}
        hitSlop={{top: 20, bottom: 20, left: 0, right: 0}}
        placeholder={placeholder}
        onChangeText={onChangeText}
        onBlur={onBlur}
        value={value}
        autoCapitalize={'none'}
        keyboardType={keyboardType ?? 'default'}
        autoCorrect={false}
        placeholderTextColor={colors.placeholderTextColor}
        {...otherProps}
        secureTextEntry={hidePassword}
      />
    </View>
  );
};

export default FieldInput;
