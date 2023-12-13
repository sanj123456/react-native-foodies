import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

export interface WeDontDeliverToThisAddressProps {}

const WeDontDeliverToThisAddress: React.FC<WeDontDeliverToThisAddressProps> = ({}) => {
  return (
    <View style={styles.container}>
      <Text>Hello</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default WeDontDeliverToThisAddress;
