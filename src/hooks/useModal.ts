import React, {useState, useRef} from 'react';
import {Text} from 'react-native';
import {ModalContainer} from '../components';
import FlashMessage from 'react-native-flash-message';

const useModal = () => {
  const [visible, setVisible] = useState(false);

  const toggleModal = () => {
    setVisible(!visible);
  };
  const messageRef = useRef<FlashMessage>(null);

  // const showMessage = () => {
  //   messageRef.current?.showMessage({
  //     message: 'Hello World',
  //     description: 'This is our second message',
  //     type: 'success',
  //   });
  // };

  return {
    ModalContainer: ModalContainer,
    visible,
    toggleModal,
    setVisible,
    messageRef,
  };
};

export {useModal};
export default useModal;
