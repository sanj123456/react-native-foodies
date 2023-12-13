import React, {forwardRef, useState, useCallback, useRef, useImperativeHandle} from 'react';
import {TextInput, StyleSheet, TextInputProps} from 'react-native';
import {colors, fonts, fontSize} from '../styles';

interface OtpBoxProps {
  onSubmitEditing?: () => void;
  blurOnSubmit?: boolean;
  onChange?: (text: string) => void;
}

interface OtpBoxRef {
  getFocus: () => void;
  clearInput: () => void;
  getValue: () => string;
}

const OtpBox = forwardRef<OtpBoxRef, OtpBoxProps>((props, ref) => {
  const {onSubmitEditing, blurOnSubmit, onChange} = props;
  const inputRef = useRef<any>(null);
  const [text, setText] = useState<string>('');

  useImperativeHandle(
    ref,
    () => ({
      getFocus: () => inputRef.current?.focus(),
      clearInput: () => {
        setText('');
      },
      getValue: () => {
        return text;
      },
    }),
    [text],
  );

  const changeTextHandler = useCallback(
    (value: string) => {
      setText(value);
      if (onChange) {
        onChange('');
      }
    },
    [onChange],
  );

  return (
    <TextInput ref={inputRef} style={text.length === 1 ? styles.filled : styles.unfilled} maxLength={1} textAlign={'center'} returnKeyType={'next'} value={text} blurOnSubmit={blurOnSubmit} onSubmitEditing={onSubmitEditing} onChangeText={changeTextHandler} />
  );
});

export default OtpBox;

const styles = StyleSheet.create({
  unfilled: {
    width: 65,
    height: 60,
    borderRadius: 5,
    backgroundColor: colors.white,
    borderColor: colors.black,
    borderWidth: 1,
    color: colors.black,
    fontWeight: '600',
    fontSize: fontSize.fs22,
    fontFamily: fonts.BGFlameLight,
  },
  filled: {
    width: 65,
    height: 60,
    borderRadius: 5,
    fontFamily: fonts.BGFlameLight,
    backgroundColor: colors.headerbg,
    color: colors.white,
    fontWeight: '600',
    fontSize: fontSize.fs22,
  },
});
