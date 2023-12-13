import React from 'react';
import {Button, StyleSheet, Text, View, Pressable, PressableProps} from 'react-native';
import {ms, vs} from 'react-native-size-matters';
import {fontSize, fonts} from '../styles';

const SkipButton: React.FC<PressableProps> = ({style, ...props}) => {
  return (
    <Pressable style={[styles.container, typeof style !== 'function' && style]} {...props}>
      <Text style={styles.txtSkip}>Skip</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FCB417',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: vs(18),
    paddingHorizontal: ms(14),
    paddingVertical: ms(10),
    // maxWidth: ms(60),
  },
  txtSkip: {
    color: '#fff',
    fontSize: fontSize.fs15,
    fontFamily: fonts.BGFlameBold,
  },
});

export default SkipButton;
