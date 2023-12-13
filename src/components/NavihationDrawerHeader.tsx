import React from 'react';
import {View, Pressable, StyleSheet, Keyboard, Text, Modal, Platform, Image} from 'react-native';
import {images} from '../core/images';
import {colors} from '../styles/colors';

const styles = StyleSheet.create({
  menuIconBg: {
    backgroundColor: colors.greyText,
    marginLeft: 10,
    padding: 5,
    borderRadius: 12,
    height: 39,
    width: 39,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconLeft: {
    backgroundColor: colors.black,
    marginLeft: 10,
    padding: 5,
    borderRadius: 12,
    height: 39,
    width: 39,
    left: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    right: 20,
  },
  headerTwoIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export const NavigationLeftHeader = (props: any) => {
  const toggleDrawer = async () => {
    Keyboard.dismiss();
    props.navigation.toggleDrawer();
  };

  const goBack = () => {
    props.navigation.goBack();
  };

  return (
    <View style={styles.headerTwoIcons}>
      <Pressable
        style={styles.menuIconLeft}
        onPress={() => {
          toggleDrawer();
        }}>
        <Image style={{height: 20, width: 20}} source={images.icMenu} />
      </Pressable>
    </View>
  );
};
