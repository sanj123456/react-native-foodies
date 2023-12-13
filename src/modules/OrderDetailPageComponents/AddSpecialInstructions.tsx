import React, {useState} from 'react';
import {Pressable, PressableProps, StyleProp, Text, TextInput, TextInputProps, TextStyle, View, StyleSheet, ViewStyle, Dimensions} from 'react-native';
import {colors, commonStyles, ms, vs} from '../../styles';
import {fontSize, fonts} from '../../styles/fonts';
import {useAppSelector} from '../../redux';
const {width} = Dimensions.get('window');
export const AddSpecialInstructions = ({
  containerStyle,
  styleAddSpecialInstructions,
  textInputProps,
  textInputStyle,
}: {
  containerStyle?: StyleProp<ViewStyle>;
  styleAddSpecialInstructions?: PressableProps['style'];
  textInputProps?: TextInputProps;
  textInputStyle?: StyleProp<TextStyle>;
}) => {
  const {restaurant} = useAppSelector((state) => state.restaurant);
  const {
    ordering: {hideSpecialInstruction, instructionText},
  } = restaurant;

  if (hideSpecialInstruction) {
    return null;
  }

  const [active, setActive] = useState(false);

  return (
    <View style={[containerStyle, {paddingVertical: vs(8)}]}>
      <Pressable
        onPress={() => {
          setActive((_a) => !_a);
          if (textInputProps && typeof textInputProps['onChangeText'] === 'function') {
            textInputProps.onChangeText('');
          }
        }}
        style={styleAddSpecialInstructions}>
        <Text style={{marginVertical: vs(8)}}>
          <Text style={orderDetailStyles.addText}>{`${active ? '-' : '+'}`}</Text>
          <Text style={[orderDetailStyles.itemTxt, {fontWeight: '400', color: colors.headerbg}]}>{` ${active ? 'Remove' : 'Add'} special instructions`}</Text>
        </Text>
      </Pressable>
      {active && <TextInput {...textInputProps} style={[textInputStyle, commonStyles.removeMargin, commonStyles.removePadding, styles.inputSpecialInstructions]} placeholder={instructionText} placeholderTextColor={colors.greyText} multiline={true} />}
    </View>
  );
};

const styles = StyleSheet.create({
  inputSpecialInstructions: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    color: colors.darkBlackText,
    includeFontPadding: false,
    textAlignVertical: 'center',
    fontSize: fontSize.fs14,
    paddingVertical: vs(10),
    paddingHorizontal: ms(16),
  },
});

export const orderDetailStyles = StyleSheet.create({
  headerView: {
    height: 100,
    backgroundColor: colors.headerbg,

    flexDirection: 'row',
    marginBottom: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'space-between',
  },
  contentContainerStyle: {
    paddingHorizontal: 15,
    paddingVertical: 30,
  },
  leftViewMain: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftView: {
    height: 30,
    width: 30,
  },
  rightViewMain: {
    width: '12%',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rightView: {
    height: 30,
    width: 30,
    marginRight: 50,
  },
  centerView: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    color: colors.white,
    fontSize: fontSize.fs20,
  },
  stepperActive: {
    height: 12,
    width: 34,
    borderRadius: 8,
    marginTop: 5,
  },
  stepperInActive: {
    height: 13,
    backgroundColor: '#F0F2F5',
    width: 38,
    borderRadius: 8,
    marginTop: 5,
  },
  headerRightText: {
    textAlign: 'center',
    paddingTop: 5,

    color: '#677A8E',
  },
  backIconStyles: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    alignSelf: 'center',
    top: 6,
  },
  locationText: {
    color: '#ABABAB',
    fontSize: fontSize.fs16,
    fontFamily: fonts.BGFlameBold,
  },
  locationTextAdd: {
    color: '#343434',
    fontSize: fontSize.fs14,

    fontWeight: '700',
  },
  itemTxt: {
    fontSize: fontSize.fs13,
    fontFamily: fonts.BGFlame,
    color: '#777676',
    fontWeight: '700',
  },
  addText: {
    color: colors.headerbg,
    fontSize: fontSize.fs16,
    fontFamily: fonts.BGFlameBold,
  },
  toppingsTxt: {
    fontSize: fontSize.fs15,
    fontFamily: fonts.BGFlame,
    color: colors.darkBlackText,
    fontWeight: '700',
  },
  locationIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',

    top: 6,
  },
  locationWrapper: {
    marginHorizontal: '4%',
    marginVertical: '1%',
    backgroundColor: colors.white,
    borderRadius: 10,
    ...commonStyles.shadowStyles,
    paddingBottom: 10,
    marginTop: 10,
  },
  restaurantItemsWrapper: {
    marginHorizontal: width * 0.04,
    marginVertical: width * 0.01,
    backgroundColor: colors.white,
    borderRadius: 10,
    ...commonStyles.shadowStyles,
    marginBottom: 10,
  },
  searchIcon: {},
  filterIcon: {
    top: 10,
  },
  textInput: {
    height: 35,

    paddingLeft: 10,
    marginRight: 10,
  },
  icRestaurantStyle: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  buttonWrapper: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    ...commonStyles.shadowStyles,

    paddingVertical: '4%',
    borderRadius: 10,
    width: '48%',
  },
  buttonWrapper1: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    ...commonStyles.shadowStyles,

    paddingVertical: '4%',
    borderRadius: 10,
    width: '31%',
  },
  dummyImage: {
    height: 240,
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  selectedText: {
    fontSize: fontSize.fs18,
    paddingLeft: 10,
    color: colors.black,
    fontFamily: fonts.BGFlameBold,
  },
  text: {
    fontSize: fontSize.fs18,
    color: colors.black,
    fontFamily: fonts.BGFlameBold,
  },
  dropDownIconStyle: {},
});
