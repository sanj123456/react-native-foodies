import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, StyleProp, TextStyle} from 'react-native';
import {divmod} from '../utils/functions';

export interface TimerProps {
  timeout: number;
  timeToShow: 'D' | 'H' | 'M' | 'S';
  onChange: (seconds: number) => void | null;
  onFinish: () => void | null;
  format: 'mm:ss' | 'hh:mm:ss';
  textStyle: StyleProp<TextStyle>;
}

const Timer: React.FC<Partial<TimerProps>> = props => {
  const {timeout = 120} = props;

  const [seconds, setSeconds] = useState(timeout);
  const timerRef = React.useRef(timeout);

  useEffect(() => {
    const timerId = setInterval(() => {
      timerRef.current -= 1;
      if (timerRef.current < 0) {
        clearInterval(timerId);
        props.onFinish?.();
      } else {
        setSeconds(timerRef.current);
      }
    }, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, []);
  useEffect(() => {
    props?.onChange?.(seconds);
  }, [seconds]);

  const [minutes, remainingSeconds] = divmod(seconds, 60);

  return <Text style={[styles.textStyle, props.textStyle]}>{`Resend in ${minutes}:${remainingSeconds.toString().padStart(2, '0')} seconds`}</Text>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textStyle: {
    textAlign: 'center',
  },
});

export default Timer;
