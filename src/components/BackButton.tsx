import React from 'react';
import {StyleSheet, View, Pressable, ViewStyle, StyleProp, Image} from 'react-native';
import {HIT_SLOP} from '../constants/constants';
import {images} from '../core';

interface Props {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const BackButton: React.FC<Props> = ({onPress, style = undefined}) => {
  return (
    <View style={[styles.container, style]}>
      <Pressable onPress={onPress} hitSlop={HIT_SLOP}>
        <Image source={images.icHeaderBack} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
  },
});

export default BackButton;
