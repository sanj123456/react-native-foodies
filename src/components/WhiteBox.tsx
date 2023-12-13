import {StyleSheet, Text, ViewProps, View, ViewStyle, StyleProp} from 'react-native';
import React, {Children} from 'react';
import {commonStyles, ms} from '../styles';
import {ComponentMatrix} from '../constants/constants';

export interface WhiteBoxProps extends ViewProps {
  removeShadowStyles?: boolean;
}

const WhiteBox: React.FC<WhiteBoxProps> = ({children, removeShadowStyles = false, ...props}) => {
  return (
    <View {...props} style={[!removeShadowStyles && commonStyles.shadowStyles, styles.mainContainer, props.style]}>
      {children}
    </View>
  );
};

export default WhiteBox;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: ms(10),
    marginHorizontal: ComponentMatrix.HORIZONTAL_16,
    padding: ms(16),
  },
});
