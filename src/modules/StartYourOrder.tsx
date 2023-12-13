import React from 'react';
import {Button, StyleSheet, Text, View, Pressable} from 'react-native';
import {ThemeRedHeader, WhiteBox} from '../components';
import fontSize, {fonts} from '../styles/fonts';
import {colors, commonStyles, ms, vs} from '../styles';
import {screenName} from '../core';

export interface StartYourOrderProps {}

const StartYourOrder: React.FC<StartYourOrderProps> = ({route, navigation}) => {
  return (
    <View style={styles.container}>
      <ThemeRedHeader
        onPressLeft={() => {
          navigation.goBack();
        }}
        headerTitle="Start Your Order"
      />
      <View style={styles.btnContainer}>
        <Text style={styles.headerTitle}>{route?.params?.restaurant?.name}</Text>
        <StartYourOrderButton
          onPress={() => {
            navigation.navigate(screenName.ChooseLocation, route?.params);
          }}
          title={'PICKUP'}
        />
        <StartYourOrderButton
          onPress={() => {
            navigation.navigate(screenName.ChooseLocation, route?.params);
          }}
          title={'DELIVERY'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnContainer: {
    flex: 1,
    justifyContent: 'center',
    rowGap: vs(8),
  },
  headerTitle: {
    fontSize: fontSize.fs22,
    color: colors.headerbg,
    fontFamily: fonts.BGFlameBold,
    textAlign: 'center',
    marginBottom: ms(10),
  },
});

export default StartYourOrder;

const StartYourOrderButton = ({title, onPress}: any) => {
  return (
    <WhiteBox removeShadowStyles={true} style={{marginHorizontal: 0, paddingVertical: 0}}>
      <Pressable
        onPress={onPress}
        style={{
          height: vs(80),
          borderRadius: ms(6),
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FFECEA',
          borderWidth: 1,
          borderColor: '#EFEFEF',
          ...commonStyles.shadowStyles,
        }}>
        <Text
          style={{
            fontSize: fontSize.fs20,
            color: colors.headerbg,
            fontFamily: fonts.BGFlameBold,
            textAlign: 'center',
          }}>
          {title}
        </Text>
      </Pressable>
    </WhiteBox>
  );
};
