import {StyleSheet, Text, TextProps, View} from 'react-native';
import React from 'react';
import {colors, fonts, vs, fontSize} from '../../styles';

const RequiredTitle = (props: TextProps) => {
  return (
    <Text {...props} style={[styles.main, props.style]}>
      {props.children}
    </Text>
  );
};

export default RequiredTitle;

const styles = StyleSheet.create({
  main: {
    color: colors.requireItemText,
    fontSize: fontSize.fs14,
  },
});
