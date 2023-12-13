import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import WebView from 'react-native-webview';
import ThemeRedHeader from '../components/ThemeRedHeader';

export interface TermAndConditionsProps {}

const TermAndConditions: React.FC<TermAndConditionsProps> = ({}) => {
  return (
    <View style={styles.container}>
      <ThemeRedHeader headerTitle="Terms & Conditions" />
      <WebView source={{uri: `https://foodiestakeout.com/privacy`}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TermAndConditions;
