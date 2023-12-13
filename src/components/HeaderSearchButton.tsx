import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Pressable,
  PressableProps,
} from 'react-native';
import {images} from '../core';
import {vs} from 'react-native-size-matters';

export interface HeaderSearchButtonProps {
  onPressSearch?: null | (() => void) | undefined;
}

const HeaderSearchButton: React.FC<HeaderSearchButtonProps> = ({
  onPressSearch,
}) => {
  return (
    <Pressable onPress={onPressSearch} style={styles.container}>
      <Image style={styles.icon} source={images.icHeaderSearch} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: vs(24),
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  icon: {},
});

export default HeaderSearchButton;
