import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
const HamburgerMenuSVGIcon = (props: SvgProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <Path
      fill="#fff"
      d="M1.76 5.338c0-.519.412-.938.92-.938h7.4a.91.91 0 0 1 .65.275.948.948 0 0 1 0 1.326.91.91 0 0 1-.65.275h-7.4a.91.91 0 0 1-.651-.275.948.948 0 0 1-.27-.663Zm0 5.662c0-.519.412-.938.92-.938h16.64a.91.91 0 0 1 .65.274.948.948 0 0 1 0 1.327.91.91 0 0 1-.65.275H2.68a.91.91 0 0 1-.651-.275.948.948 0 0 1-.27-.663Zm.92 4.724a.91.91 0 0 0-.651.274.948.948 0 0 0 0 1.327.91.91 0 0 0 .65.275h11.097a.91.91 0 0 0 .65-.275.948.948 0 0 0 0-1.327.91.91 0 0 0-.65-.274H2.68Z"
    />
  </Svg>
);
export default HamburgerMenuSVGIcon;
