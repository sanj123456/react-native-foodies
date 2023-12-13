import React from 'react';
import {StyleSheet, View} from 'react-native';

import RadioButton from './RadioButton';
import {RadioGroupProps} from './types';

export default function RadioGroup({
  containerStyle,
  layout = 'column',
  onPress,
  radioButtons,
  selectedId,
  testID,
}: RadioGroupProps) {
  function handlePress(data: any) {
    if (data.id !== selectedId && onPress) {
      onPress(data);
    }
  }

  return (
    <View
      style={[styles.container, {flexDirection: layout}, containerStyle]}
      testID={testID}>
      {radioButtons.map(button => (
        <RadioButton
          {...button}
          key={button.id}
          selected={button.id === selectedId}
          onPress={() => handlePress(button)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
