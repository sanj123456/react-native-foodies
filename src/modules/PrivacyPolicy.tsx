import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import WebView from 'react-native-webview';
import ThemeRedHeader from '../components/ThemeRedHeader';

export interface PrivacyPolicyProps {}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({}) => {
  return (
    <View style={styles.container}>
      <ThemeRedHeader headerTitle="Privacy Policy" />
      <WebView source={{uri: `https://foodiestakeout.com/privacy/`}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PrivacyPolicy;
