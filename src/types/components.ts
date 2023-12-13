import {ReactNode} from 'react';
import {TextProps, TextStyle, ViewStyle, TextInputProps, StyleProp} from 'react-native';

export type PrimaryTextProps = {
  style?: TextStyle;
  children?: ReactNode;
  props?: TextProps;
};

export type PrimaryButtonProps = {
  bgColor?: string;
  textColor?: string;
  style?: ViewStyle;
  title: string;
  addMargin?: number;
  onPress: () => void;
  disabled?: boolean;
  icon?: any;
  labelStyles?: TextStyle;
  type?: 'primary_border_label' | 'default' | undefined;
};

export interface FieldInputProps extends TextInputProps {
  placeholder?: string;
  inputViewStyles?: ViewStyle;
  inputStyles?: TextStyle;
  onChangeText?: (text: string) => void;
  value?: string;
  type?: 'email' | 'password' | 'name' | 'phone' | string;
  title?: string;
  onBlur?: () => void;
  keyboardType?: 'email-address' | 'number-pad' | 'phone-pad';
  contentContainerStyle?: StyleProp<ViewStyle> | undefined;
}

export type SignUpHeaderProps = {
  stepNum?: number;
  highlightBar?: number;
  type?: 'back_only' | undefined;
};

export type ItemCounterProps = {
  value?: number;
  maxLength?: number;
  onChangeValue: (value: number) => void;
  from?: string;
};

export type MyImagePickerProps = {
  onChange: (src: any) => void;
  style?: ViewStyle;
  children: ReactNode;
  mediaType?: 'photo' | 'video' | 'mixed';
};
