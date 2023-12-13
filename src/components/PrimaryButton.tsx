import React, {FC} from 'react';
import {Image, Pressable} from 'react-native';
import {colors, commonStyles} from '../styles';
import {PrimaryButtonProps} from '../types/components';
import PrimaryText from './PrimaryText';

const PrimaryButton: FC<PrimaryButtonProps> = ({style, title, addMargin, onPress, disabled, icon, labelStyles, type, bgColor = colors.headerbg, textColor}) => {
  let colorBg = bgColor || colors.primary;
  let colorTxt = textColor || colors.white;

  if (disabled) {
    colorBg = colors.background;
    colorTxt = colors.disabledText;
  } else if (type === 'primary_border_label') {
    colorBg = colors.white;
    colorTxt = colors.primary;
  }

  const computedStyle = {
    marginTop: addMargin ?? 0,
    ...commonStyles.primaryButtonStyles,
    backgroundColor: colorBg,
    borderWidth: type == 'primary_border_label' ? 1 : 0,
    borderColor: type === 'primary_border_label' ? colors.primary : undefined,
    ...style,
  };

  return (
    <Pressable disabled={disabled} onPress={onPress} style={computedStyle}>
      {icon && <Image style={commonStyles.icon24} source={icon} />}
      <PrimaryText
        style={{
          ...commonStyles.primaryButtonLabel,
          color: colorTxt,
          ...labelStyles,
          marginLeft: icon ? 8 : 0,
        }}>
        {title}
      </PrimaryText>
    </Pressable>
  );
};

export default PrimaryButton;
