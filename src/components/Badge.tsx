import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, vs} from '../styles';
import fontSize from '../styles/fonts';
import {useTotal} from '../hooks';

const Badge = ({text, color, style}: any) => {
  const {numSumsQty} = useTotal();

  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.text}>{numSumsQty}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderColor: colors.white,
    backgroundColor: colors.white,
    borderRadius: 1000,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: vs(13),
    position: 'absolute',
    top: -5,
    right: -3,
  },
  text: {
    color: colors.requireItemText,
    textAlign: 'center',
    fontSize: fontSize.fs8,
  },
});

export default Badge;
