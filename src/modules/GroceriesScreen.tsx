import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ThemeRedHeader} from '../components';
import {commonStyles} from '../styles';
import {StackScreenRouteProp} from '../types/navigationTypes';
export interface GroceriesScreenProps {}

const GroceriesScreen: React.FC<NativeStackScreenProps<StackScreenRouteProp, 'GroceriesScreen'>> = ({navigation, route}) => {
  return (
    <View style={styles.container}>
      <ThemeRedHeader
        headerTitle="Groceries"
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <Text style={[commonStyles.errorText, {textAlign: 'center'}]}>Stay tuned for new grocery shopping features.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GroceriesScreen;
