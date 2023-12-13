import React from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import Badge from './Badge';
import {navigationRef} from '../navigation/RootNavigation';
import {images} from '../core';
export interface BagButtonProps {}

const BagButton: React.FC<BagButtonProps> = ({}) => {
  return (
    <Pressable
      onPress={() => {
        navigationRef.navigate('Bag');
      }}
      style={styles.rightViewMain}>
      <View style={styles.rightView}>
        <Image style={styles.backIconStyles} source={images.icCart} />
        <Badge />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  rightViewMain: {},
  rightView: {height: 30, width: 30},
  backIconStyles: {width: 20, height: 20, resizeMode: 'contain', alignSelf: 'center', top: 6},
});

export default BagButton;
