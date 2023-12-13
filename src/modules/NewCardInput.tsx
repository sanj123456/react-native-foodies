import React, {useEffect, useReducer, useRef} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {TextInputMask} from 'react-native-masked-text';
import {API_Cards, StatusCodes} from '../api';
import {FieldInput} from '../components';
import {useAppSelector} from '../redux';
import {colors, fontSize, ms, vs} from '../styles';
import {CardState} from '../types';
import {maskCardNumber, showDangerMessage, showSuccessMessage} from '../utils/functions';

type Props = {
  initData?: Partial<CardState>;
  onSaveNewCard?: () => void;
  onDataChange?: (data: CardState) => void;
};

const NewCardInput = (props: Props) => {
  const {user, accessToken} = useAppSelector((state) => state.profile);
  const {gateway, _id, name} = useAppSelector((state) => state.gateway);

  const reducer = (state: CardState, action: any) => ({...state, ...action});

  const initialArg = {
    sCardHolderName: '',
    sCardNumber: '',
    sExpiryDate: '',
    sCVV: '',
    ...props?.initData,
  };
  const [state, dispatch] = useReducer(reducer, initialArg);
  const refCreditCardField = useRef(null);
  const refExpiryDateField = useRef(null);
  useEffect(() => {
    props?.onDataChange?.(state);
  }, [state, dispatch]);

  const _onSaveNewCard = async () => {
    try {
      if (!accessToken.length) {
        showDangerMessage('Please login first');
        return;
      }

      const [expirationMonth, expirationYear] = state.sExpiryDate.split('/');
      const truncatedCardNumber = maskCardNumber(state.sCardNumber);

      if (typeof truncatedCardNumber !== 'undefined') {
        const response = await API_Cards.addCard({
          cardHolderName: state.cardHolderName,
          expirationMonth: expirationMonth,
          expirationYear: expirationYear,
          cardLogo: 'Visa',
          truncatedCardNumber: truncatedCardNumber,
          cvv: state.sCVV,
          customer: user.customer._id,
          token: '6492f01c-e037-4158-8aef-18c88e099a30',
          gateway: gateway,
          provider: name,
        });

        if (response.code === StatusCodes.SUCCESS) {
          showSuccessMessage('Card added successfully.');
        } else {
          showDangerMessage('Something went wrong.');
        }
      }
    } catch (error) {
      console.log({error});
      showDangerMessage('Something went wrong.');
    }
  };
  const onSaveNewCard = () => {
    try {
    } catch (error) {
      console.log({error});
    }
  };

  return (
    <View style={{}}>
      <FieldInput
        inputViewStyles={styles.textInput}
        placeholder="Full Name"
        onChangeText={(sCardHolderName) => {
          dispatch({sCardHolderName});
        }}
        value={state.sCardHolderName}
      />
      <TextInputMask
        type={'credit-card'}
        options={{
          obfuscated: false,
          issuer: 'visa-or-mastercard',
        }}
        placeholder={'Card Number'}
        placeholderTextColor={colors.placeholderTextColor}
        style={[styles.textInput]}
        ref={refCreditCardField}
        onChangeText={(sCardNumber) => {
          dispatch({sCardNumber});
        }}
        value={state.sCardNumber}
      />
      <TextInputMask
        placeholder={'Expiration Date'}
        type={'datetime'}
        options={{
          format: 'MM/YY',
        }}
        style={[styles.textInput]}
        placeholderTextColor={colors.placeholderTextColor}
        onChangeText={(sExpiryDate) => {
          dispatch({sExpiryDate});
        }}
        value={state.sExpiryDate}
        ref={refExpiryDateField}
      />
      <FieldInput
        inputViewStyles={styles.textInput}
        placeholder="CVC"
        onChangeText={(sCVV) => {
          dispatch({sCVV: sCVV.replace(/[^0-9]/g, '')});
        }}
        maxLength={4}
        keyboardType={'number-pad'}
        value={state.sCVV}
      />
      <Pressable onPress={onSaveNewCard} style={styles.buttonSaveCard}>
        <Text style={styles.saveText}>Save Card</Text>
      </Pressable>
    </View>
  );
};

export default NewCardInput;

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: colors.VeryLightGray,
    borderRadius: 4,
    height: 38,
    paddingLeft: 10,
    marginTop: 10,
  },
  buttonSaveCard: {
    height: vs(38),
    backgroundColor: colors.headerbg,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'flex-end',
    paddingHorizontal: ms(16),
  },
  saveText: {
    color: colors.white,
    fontSize: fontSize.fs12,
  },
});
