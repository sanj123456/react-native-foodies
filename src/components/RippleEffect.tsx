import React, { useState,useMemo } from 'react';
import {
  View,
  Animated,
  Easing,
} from 'react-native';

const RippleEffect = ({ size, color, children }) => {
  const [isRippleActive, setIsRippleActive] = useState(false);

  const rippleSize = useMemo(() => {
    return size / 2;
  }, [size]);

  const rippleOpacity = useMemo(() => {
    return isRippleActive ? 1 : 0;
  }, [isRippleActive]);

  const rippleScale = useMemo(() => {
    return isRippleActive ? 1.5 : 1;
  }, [isRippleActive]);

  const ripplePosition = useMemo(() => {
    return {
      top: size / 2,
      left: size / 2,
    };
  }, [size]);

  const handlePress = () => {
    setIsRippleActive(true);
    setTimeout(() => {
      setIsRippleActive(false);
    }, 500);
  };

  return (
    <View
      onPress={handlePress}
      style={[
        {
          width: size,
          height: size,
          backgroundColor: color,
          opacity: rippleOpacity,
          borderRadius: size / 2,
          transform: [{ scale: rippleScale }],
        },
        {
          position: ripplePosition,
        },
      ]}
    >
      {children}
    </View>
  );
};

export default RippleEffect;
