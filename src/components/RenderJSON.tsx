import {StyleSheet, Text, View, ScrollView, TextProps} from 'react-native';
import React from 'react';

const RenderJSON = ({children, ...props}: TextProps) => {
  const replacer = (key: string, value: any) => {
    if (typeof value === 'boolean') {
      return value ? 'YES' : 'NO';
    }
    if (typeof value === 'undefined') {
      return 'undefined';
    }
    return value;
  };
  return (
    <View style={{maxHeight: 150}}>
      <ScrollView>
        <Text selectable={true} {...props}>
          {JSON.stringify(children, replacer, 4)}
        </Text>
      </ScrollView>
    </View>
  );
};

export default RenderJSON;

const styles = StyleSheet.create({});
