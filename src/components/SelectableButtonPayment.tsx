import React from 'react';
import {commonStyles, vs} from '../styles';
import SelectableButton from './SelectableButton';

const SelectableButtonPayment = ({title, onPress, selected}: any) => {
  return <SelectableButton {...{title, onPress, selected}} style={[{height: vs(42), flex: 1}, commonStyles.removeMargin, commonStyles.removePadding, commonStyles.center]} />;
};

export default SelectableButtonPayment;
