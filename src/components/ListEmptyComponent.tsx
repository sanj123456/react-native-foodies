import {StyleSheet, Text, View, TextProps, StyleProp, ViewStyle} from 'react-native';
import React from 'react';
import {colors, fonts} from '../styles';
import fontSize from '../styles/fonts';

const ListEmptyComponent = ({children, style, viewStyle}: TextProps & {viewStyle?: StyleProp<ViewStyle> | undefined}) => {
  return (
    <View style={viewStyle}>
      <Text
        style={[
          {
            color: colors.darkBlackText,
            fontSize: fontSize.fs14,
            fontFamily: fonts.BGFlameBold,

            alignItems: 'center',
          },
          style,
        ]}>
        {children}
      </Text>
    </View>
  );
};

export default ListEmptyComponent;

const styles = StyleSheet.create({});
