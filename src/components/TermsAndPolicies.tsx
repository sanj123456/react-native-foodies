import React from 'react';
import {Image, StyleSheet, Text, Pressable, StyleProp, ViewStyle} from 'react-native';
import {colors, fontSize, fonts, ms} from '../styles';
import {images} from '../core';

export interface TermsAndPoliciesProps {
  onPressPolicies?: () => void;
  onPressTerms?: () => void;
  onPressTermsAndPolicies?: () => void;
  contentContainerStyle?: StyleProp<ViewStyle> | undefined;
  checked: boolean;
}

const TermsAndPolicies: React.FC<TermsAndPoliciesProps> = ({onPressPolicies = () => {}, onPressTerms = () => {}, contentContainerStyle, onPressTermsAndPolicies = () => {}, checked = false}) => {
  return (
    <Pressable onPress={onPressTermsAndPolicies} style={[styles.container, contentContainerStyle]}>
      <Image style={styles.checkbox} source={checked ? images.icCheck : images.icUncheck} />
      <Text style={styles.text}>
        I agree to{' '}
        <Text onPress={onPressTerms} style={styles.textLink}>
          terms
        </Text>{' '}
        and{' '}
        <Text onPress={onPressPolicies} style={styles.textLink}>
          policies
        </Text>
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: ms(12),
  },
  text: {
    fontSize: fontSize.fs13,
    fontFamily: fonts.BGFlame,
    color: colors.darkBlackText,
    flex: 1,
  },
  textLink: {
    textDecorationLine: 'underline',
  },
  checkbox: {
    width: ms(20),
    height: ms(20),
  },
});

export default TermsAndPolicies;
