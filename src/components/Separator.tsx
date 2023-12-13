import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {vs} from 'react-native-size-matters';

const Separator = () => {
  return <View style={styles.main} />;
};

export default Separator;

const styles = StyleSheet.create({
  main: {
    height: vs(12),
  },
});
