import * as React from 'react';
import Svg, {SvgProps, Mask, Path, G} from 'react-native-svg';
import {Image} from 'react-native';
import {images} from '../../src/core';

interface DropDownIconProps extends SvgProps {
  side: 'up' | 'down';
}

const DropDownIcon = (props: DropDownIconProps) => {
  if (props.side === 'down') {
    return <Image source={images.icDown} />;
  } else if (props.side === 'up') {
    return <Image source={images.icUp} />;
  } else {
    return null;
  }
};
export default DropDownIcon;
