import React, {useState, useRef, useEffect} from 'react';
import {Text} from 'react-native';
import {RadioGroup, RadioGroupProps} from '../../components';
import ToppingTitle from './ToppingTitle';
import RequiredTitle from './RequiredTitle';
import {minMaxRequireStringBuilder} from '../../utils/functions';
export const RadioButtonsGroupWithTitle = ({
  title,
  onChangeValue = (data: any) => {},
  id,
  name,
  item,
  ...props
}: RadioGroupProps & {
  id: string;
  name: string;
  title: string;
  onChangeValue: (data: any) => void;
  item: any;
}) => {
  const [selectedId, setSelectedId] = useState<any>(null);
  const [label, setLabel] = useState<any>('');
  const [price, setPrice] = useState(0);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    onChangeValue({
      id: selectedId,
      name: name,
      price,
      type: 'radio',
      product_name: label,
    });
  }, [selectedId]);

  let minMaxRequireString = '';
  if (item.isRequired) {
    minMaxRequireString += '* ';
  }

  return (
    <>
      <ToppingTitle>
        {name}
        <RequiredTitle>{minMaxRequireString}</RequiredTitle>
      </ToppingTitle>
      <RadioGroup
        containerStyle={[{alignItems: 'flex-start'}]}
        radioButtons={props.radioButtons}
        onPress={({id, price, label}: any) => {
          setSelectedId(id);
          setPrice(price);
          setLabel(label);
        }}
        selectedId={selectedId}
      />
    </>
  );
};
