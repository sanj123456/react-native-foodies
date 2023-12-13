import React from 'react';
import {Image, Pressable, StyleSheet, Text, View, SafeAreaView, StatusBar} from 'react-native';
import Badge from './Badge';
import {images} from '../core';
import {colors, commonStyles, ms, vs} from '../styles';
import fontSize, {fonts} from '../styles/fonts';
import {useNavigation} from '@react-navigation/native';
import {ComponentMatrix, HIT_SLOP} from '../constants/constants';

export type Props = {
  headerTitle: string;
  onPressLeft?: () => void;
  isTrasparent?: boolean;
};

const ThemeRedHeader: React.FC<Props> = (props) => {
  const navigation = useNavigation();
  const {
    headerTitle,
    onPressLeft = () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    },
    isTrasparent = false,
  } = props;
  return (
    <>
      <SafeAreaView style={{backgroundColor: colors.headerbg}} />
      <StatusBar barStyle={'light-content'} hidden={false} backgroundColor={colors.headerbg} />
      <View style={[homeStyles.headerView, props.isTrasparent && homeStyles.trasparent]}>
        <Pressable disabled={!navigation.canGoBack()} onPress={onPressLeft} hitSlop={HIT_SLOP}>
          {navigation.canGoBack() && <Image source={images.icHeaderBack} />}
        </Pressable>
        <View style={homeStyles.centerView}>
          <Text style={homeStyles.txt}>{headerTitle}</Text>
        </View>
        <View style={homeStyles.rightViewMain} />
      </View>
    </>
  );
};

export const homeStyles = StyleSheet.create({
  headerView: {
    height: 100,
    backgroundColor: colors.headerbg,
    flexDirection: 'row',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: ComponentMatrix.HORIZONTAL_16,
    alignItems: 'center',
  },
  trasparent: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
  },
  rightViewMain: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    color: colors.white,
    fontSize: fontSize.fs20,
    fontFamily: fonts.BGFlameBold,
  },
});

export default ThemeRedHeader;
