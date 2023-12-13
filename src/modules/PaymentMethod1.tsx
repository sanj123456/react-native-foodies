import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {StackScreenRouteProp} from '../types/navigationTypes';

export interface PaymentMethod1Props {}

const PaymentMethod1: React.FC<NativeStackScreenProps<StackScreenRouteProp, 'PaymentMethod1'>> = ({navigation, route}) => {
  return (
    <View style={styles.container}>
      <Text>PaymentMethod1</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PaymentMethod1;
