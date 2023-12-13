import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ms, vs} from 'react-native-size-matters';
import {FieldInput} from '../components';
import {FormDataGuestUser, I} from '../types';

const GuestUser = ({onChangeValue, initData, editable = true}: I<FormDataGuestUser>) => {
  const [name, setName] = useState(initData?.name ?? '');
  const [email, setEmail] = useState(initData?.email ?? '');
  const [phone, setPhone] = useState(initData?.phone ?? '');
  const [note, setNote] = useState(initData?.note ?? '');
  useEffect(() => {
    setName(initData?.name || '');
    setEmail(initData?.email || '');
    setPhone(initData?.phone || '');
    setNote(initData?.note || '');
  }, [initData]);
  useEffect(() => {
    const formData = {name, email, phone, note};
    onChangeValue(formData);
  }, [name, email, phone, note]);

  return (
    <View style={{}}>
      <FieldInput editable={editable} inputViewStyles={styles.textInput} placeholder="Full Name" onChangeText={setName} value={name} />
      <FieldInput editable={editable} inputViewStyles={styles.textInput} placeholder="Email Address" onChangeText={setEmail} value={email} />
      <FieldInput
        editable={editable}
        inputViewStyles={styles.textInput}
        placeholder="Phone Number"
        onChangeText={(number) => {
          const _number = number.replace(/[^0-9]/g, '');
          setPhone(_number);
        }}
        value={'' + phone}
        keyboardType="number-pad"
        maxLength={10}
      />
      <FieldInput inputViewStyles={styles.textInputNote} placeholder="Add a Note" onChangeText={setNote} value={note} />
    </View>
  );
};
export const styles = StyleSheet.create({
  textInput: {borderWidth: 1, borderColor: '#CDCDCD', borderRadius: 4, height: vs(38), paddingLeft: ms(10), marginTop: vs(10)},
  textInputNote: {borderWidth: 1, borderColor: '#CDCDCD', borderRadius: 4, height: 110, paddingLeft: 10, marginTop: 10},
});
export default GuestUser;
