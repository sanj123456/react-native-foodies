import React from 'react';
import {View, Text, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {colors, vs} from '../styles';

const PercentageBar = ({
  progress = 0,
  height = vs(30),
  color = colors.headerbg,
  containerStyle = undefined as StyleProp<ViewStyle>,
  points = 0,
}) => {
  return (
    <View
      style={[
        styles.container,
        {height, backgroundColor: '#e9ecef'},
        containerStyle,
      ]}>
      <View
        style={[
          styles.progressBar,
          {width: `${progress}%`, backgroundColor: color},
        ]}>
        <Text style={{color: 'white'}}>{points} PTS</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    marginLeft: 5,
  },
});

export default PercentageBar;
