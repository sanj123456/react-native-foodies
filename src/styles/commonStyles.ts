import {colors} from './colors';
import {StyleSheet} from 'react-native';
import {ms} from 'react-native-size-matters';
import fontSize, {fonts} from './fonts';

export const commonStyles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  horizontalSpaceViewStyles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  horizontalCenterViewStyles: {
    flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  primaryButtonStyles: {
    width: '100%',
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  primaryButtonLabel: {
    // ...fonts.heading16,
  },
  icon24: {
    height: 24,
    width: 24,
    resizeMode: 'contain',
  },
  shadowStyles: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 1,
  },
  hitSlop: {
    top: 10,
    bottom: 10,
    left: 15,
    right: 15,
  },
  x: {},
  removePadding: {
    padding: undefined,
    paddingBottom: undefined,
    paddingEnd: undefined,
    paddingHorizontal: undefined,
    paddingLeft: undefined,
    paddingRight: undefined,
    paddingStart: undefined,
    paddingTop: undefined,
    paddingVertical: undefined,
  },
  removeMargin: {
    margin: undefined,
    marginBottom: undefined,
    marginEnd: undefined,
    marginHorizontal: undefined,
    marginLeft: undefined,
    marginRight: undefined,
    marginStart: undefined,
    marginTop: undefined,
    marginVertical: undefined,
  },
  modalMessageStyle: {
    borderTopLeftRadius: ms(10),
    borderTopRightRadius: ms(10),
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: colors.CoralRed,
    fontSize: fontSize.fs14,
  },
  totalRowText: {
    fontSize: fontSize.fs14,
    fontFamily: fonts.BGFlameBold,
    color: '#777676',
  },
});
