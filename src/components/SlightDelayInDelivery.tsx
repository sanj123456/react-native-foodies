import React from 'react';
import {Image, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {images} from '../core';
import {colors} from '../styles';
import {fonts, fontSize} from '../styles/fonts';

const SlightDelayInDelivery = ({visible, onClose}: any) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={{height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center'}}>
        <View style={{backgroundColor: colors.white, width: '94%', borderRadius: 10, paddingTop: 30, alignSelf: 'center', paddingBottom: 50}}>
          <Pressable style={{alignSelf: 'flex-end', marginRight: 20, top: -5}} onPress={onClose}>
            <Image style={{}} source={images.icClose} />
          </Pressable>
          <View style={{alignSelf: 'center'}}>
            <Image style={{}} source={images.DeliveryImage} />
          </View>
          <View style={{paddingTop: 10}}>
            <Text style={styles.txt}>Slight Delay in Delivery</Text>
          </View>
          <View style={{paddingTop: 10}}>
            <Text style={styles.sampleTxt}>We are experiencing surge in Orders,</Text>
            <Text style={styles.sampleTxt}>so there may be a slight delay in</Text>
            <Text style={styles.sampleTxt}>delivery</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const styles = StyleSheet.create({
  txt: {color: colors.darkBlackText, fontSize: fontSize.fs15, fontFamily: fonts.BGFlameBold, textAlign: 'center'},
  sampleTxt: {color: '#030303', fontSize: fontSize.fs13, fontFamily: fonts.BGFlame, textAlign: 'center'},
});

export default SlightDelayInDelivery;
