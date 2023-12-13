import React from 'react';
import {Pressable, PressableProps, Text} from 'react-native';
import {colors, commonStyles} from '../../styles';
import {orderDetailStyles} from '../OrderDetailPage';

export const PaginationButton = ({title, isRed, ...props}: {title: 'Left' | 'All' | 'Right'; isRed: boolean} & PressableProps) => {
  return (
    <Pressable {...props} style={[{marginBottom: 3, backgroundColor: colors.white, borderWidth: 1, borderColor: '#EFEFEF', paddingVertical: '4%', borderRadius: 10, flex: 1}, commonStyles.shadowStyles]}>
      <Text
        style={{
          color: isRed ? colors.headerbg : colors.darkBlackText,
          textAlign: 'center',
        }}>
        {title}
      </Text>
    </Pressable>
  );
};
