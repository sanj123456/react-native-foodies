import {View, StyleSheet, Modal, Pressable, Image, ModalProps, StyleProp, ViewStyle, Dimensions} from 'react-native';
import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {images} from '../core';
import {colors, commonStyles, ms, vs} from '../styles';
import FlashMessage, {FlashMessageProps} from 'react-native-flash-message';
import {ComponentMatrix} from '../constants/constants';

interface IModalContainerProps extends ModalProps {
  onClose: () => void;
  contentContainerStyle?: StyleProp<ViewStyle>;
  messageRef?: React.LegacyRef<FlashMessage> | undefined;
}

const {height} = Dimensions.get('window');

const ModalContainer = ({onClose = () => {}, contentContainerStyle = undefined, messageRef: messageRef, ...props}: IModalContainerProps) => {
  return (
    <Modal animationType="slide" transparent={true} {...props}>
      <View style={styles.container}>
        <View
          style={{
            borderRadius: ms(10),
            backgroundColor: colors.white,
            padding: ms(16),
            marginHorizontal: ComponentMatrix.HORIZONTAL_16,
            maxHeight: height * 0.8,
          }}>
          <View style={styles.header}>
            <Pressable style={styles.icnClose} onPress={onClose}>
              <Image style={{}} source={images.icClose} />
            </Pressable>
          </View>
          {props.children}
          <FlashMessage position="top" ref={messageRef} style={commonStyles.modalMessageStyle} />
          {/* <View style={[styles.content, contentContainerStyle]}>
          </View> */}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  header: {
    height: vs(30),
    justifyContent: 'center',
  },
  content: {
    marginHorizontal: ComponentMatrix.HORIZONTAL_16,
    flex: 1,
    flexGrow: 1,
  },
  icnClose: {
    alignSelf: 'flex-end',
  },
});

export default ModalContainer;
