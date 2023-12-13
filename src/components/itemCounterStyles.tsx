import {StyleSheet} from 'react-native';
import {colors, commonStyles, fontSize, fonts, ms} from '../styles';

export const itemCounterStyles = StyleSheet.create({
  itemWrapper: {
    ...commonStyles.horizontalCenterViewStyles,
    borderWidth: 1,
  },
  buttonStyle: {
    ...commonStyles.shadowStyles,
    borderRadius: 50,
    backgroundColor: colors.headerbg,
    height: ms(21.84),
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSize.fs16,
    fontFamily: fonts.BGFlameBold,
    includeFontPadding: false,
  },
  inputView: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    marginHorizontal: 8,
    height: 30,
    width: 30,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputStyles: {
    color: colors.SonicSilver, //Sonic Silver,
    fontSize: fontSize.fs12,
    fontFamily: fonts.BGFlame,
    padding: 0,
    textAlign: 'center',
  },
});
