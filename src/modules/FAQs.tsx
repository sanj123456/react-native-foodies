import {DrawerScreenProps} from '@react-navigation/drawer';
import React, {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ThemeRedHeader from '../components/ThemeRedHeader';
import {DrawerScreenRouteProp} from '../types/navigationTypes';

export interface FAQsProps {}

const FAQs: FC<DrawerScreenProps<DrawerScreenRouteProp, 'FAQs'>> = ({navigation, route}) => {
  return (
    <View style={styles.container}>
      <ThemeRedHeader
        headerTitle="FAQs"
        onPressLeft={() => {
          navigation.toggleDrawer();
        }}
      />
      <Text>FAQs</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default FAQs;
