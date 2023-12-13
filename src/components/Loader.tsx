import React from 'react';
import {ActivityIndicator, Modal, StyleSheet, View} from 'react-native';
import {ms} from 'react-native-size-matters';
import {useAppSelector} from '../redux';

const Loader = ({}) => {
  const {isLoading, tag} = useAppSelector((state: any) => state.Loader);

  return (
    <Modal animationType="none" transparent={true} visible={isLoading}>
      <View style={[styles.container, StyleSheet.absoluteFill]}>
        <View style={styles.whiteBox}>
          <ActivityIndicator color={'#DC4135af'} size={40} />
        </View>
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  whiteBox: {
    aspectRatio: 1,
    backgroundColor: 'white',
    height: ms(50),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ms(5),
  },
});
