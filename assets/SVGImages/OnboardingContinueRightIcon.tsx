import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

const OnboardingContinueRightIcon = (props: SvgProps) => {
  return (
    <Svg width={26} height={23} viewBox="0 0 26 23" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path d="M14.5 2l9.5 9.5-9.5 9.5M2 12h21" stroke="#fff" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
};

export default OnboardingContinueRightIcon;
