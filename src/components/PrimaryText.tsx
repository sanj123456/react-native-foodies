import React, {FC} from 'react';
import {Text, TextProps} from 'react-native';

const PrimaryText: FC<TextProps> = props => {
  return (
    <Text style={[{color: 'black'}, props.style]} {...props}>
      {props.children}
    </Text>
  );
};

export default PrimaryText;
