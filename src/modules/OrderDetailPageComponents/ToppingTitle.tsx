import React from 'react';
import {StyleProp, StyleSheet, Text, TextProps, View, ViewStyle} from 'react-native';
import {colors, fontSize, fonts, vs} from '../../styles';
const ToppingTitle = (props: TextProps & {containerStyle?: StyleProp<ViewStyle> | undefined}) => {
  return (
    <View style={[styles.mainContainer, props.containerStyle]}>
      <Text {...props} style={[styles.toppingsTxt, props.style]}>
        {props.children}
      </Text>
    </View>
  );
};

export default ToppingTitle;

const styles = StyleSheet.create({
  mainContainer: {
    paddingVertical: vs(5),
  },
  toppingsTxt: {
    fontSize: fontSize.fs16,
    fontFamily: fonts.BGFlame,
    color: colors.darkBlackText,
  },
});
