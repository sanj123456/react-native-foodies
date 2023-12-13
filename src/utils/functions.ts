import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationState} from '@react-navigation/native';
import {Alert, NativeScrollEvent, StyleSheet} from 'react-native';
import {MessageOptions, showMessage} from 'react-native-flash-message';
import {Method} from '../api/types';
import {API_KEYS, AuthRoute} from '../constants/constants';
import store from '../redux';
import {signOut} from '../redux/modules/profileSlice';
import {StackScreenRouteProp} from '../types/navigationTypes';
import axios from 'axios';
import {resetState} from '../redux/modules/bagSlice';
import {batch} from 'react-redux';
export const prettyPrint = (...data: any) => {
  const replacer = (key: any, value: any) => {
    if (typeof value === 'undefined') {
      return 'undefined';
    }
    if (value == null) {
      return 'null';
    }
    return value;
  };
  console.log(JSON.stringify(data, replacer, 2));
};

export const prettyPrintError = (data: any) => {
  console.error(JSON.stringify(data, null, 4));
};

export const prettyPrintStyle = (data: any) => {
  const flattenStyle = StyleSheet.flatten(data);
};

export const isUserSignin = () => {};

export const createRandomUser = () => {
  const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve'];
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'example.com'];
  const phoneFormats = ['XXXXXXXXXX'];
  const passwordLength = 8;
  function getRandomElement(array: string | any[]) {
    return array[Math.floor(Math.random() * array.length)];
  }
  function generateRandomString(length: number) {
    let result = 'admin';
    return result;
  }
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomDomain = getRandomElement(domains);
  const randomPhoneFormat = getRandomElement(phoneFormats);
  const user = {
    txt_reg_name: randomName,
    txt_reg_email: `${randomName.toLowerCase()}@${randomDomain}`,
    txt_reg_phone: randomPhoneFormat.replace(/X/g, () => Math.floor(Math.random() * 10)),
    txt_reg_password: generateRandomString(passwordLength),
  };
  return user;
};

export const toTitleCase = (str: string): string => {
  let words: string[] = str.toLowerCase().split(' ');
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }
  let titleCaseStr: string = words.join(' ');
  return titleCaseStr;
};

export const showDangerMessage = (message: string = '', options?: Omit<MessageOptions, 'message'>) => {
  showMessage({
    type: 'danger',
    message: message,
    ...options,
  });
};

export const showSuccessMessage = (message: string, options?: Omit<MessageOptions, 'message'>) => {
  showMessage({
    type: 'success',
    message: message,
    ...options,
  });
};

export const isEmail = (email: string) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

export const isValidLengthArray = (_arr: any) => {
  return Array.isArray(_arr) && _arr.length > 0;
};

export const createArrayIfNot = (_arr: any): any[] => {
  if (isValidLengthArray(_arr)) {
    return _arr;
  }
  return [];
};

export function getRandomArbitrary(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}
export function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
export function maskCardNumber(cardNumber: string): string | void {
  if (!/^(\d{4}\s){3}\d{4}$/.test(cardNumber)) {
    showDangerMessage("Invalid card number format. Please provide the card number in the format '1111 1111 1111 1111'.");
    return;
  }
  var maskedNumber = 'xxxx-xxxx-xxxx-' + cardNumber.slice(-4);
  return maskedNumber;
}
export const filterAuthRoute = (state: StackNavigationState<StackScreenRouteProp>) => {
  return state.routes.filter((r) => AuthRoute.includes(r.name));
};

export const handleSignOut = () => {
  Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
    {
      text: 'Cancel',
      style: 'cancel',
    },
    {
      text: 'Sign Out',
      onPress: async () => {
        try {
          await AsyncStorage.removeItem('user');
          batch(() => {
            store.dispatch(signOut());
            store.dispatch(resetState());
          });
        } catch (error: any) {
          showDangerMessage('Something went wrong');
        }
      },
    },
  ]);
};

export const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
}: NativeScrollEvent): {
  bIsCloseToBottom: boolean;
  distanceFromEnd: number;
} => {
  const paddingToBottom = layoutMeasurement.height / 2;
  return {bIsCloseToBottom: layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom, distanceFromEnd: paddingToBottom};
};

export function rgbaToHex(red: number, green: number, blue: number, alpha: number): string {
  red = Math.max(0, Math.min(255, red));
  green = Math.max(0, Math.min(255, green));
  blue = Math.max(0, Math.min(255, blue));
  alpha = Math.max(0, Math.min(1, alpha));
  const redHex = red.toString(16).padStart(2, '0');
  const greenHex = green.toString(16).padStart(2, '0');
  const blueHex = blue.toString(16).padStart(2, '0');
  const alphaHex = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
  const hexColorCode = `#${redHex}${greenHex}${blueHex}${alphaHex}`;
  return hexColorCode;
}
export const divmod = (x: number, y: number): [number, number] => {
  if (typeof x !== 'number' || typeof y !== 'number') {
    throw new TypeError('Arguments must be numbers');
  }
  const quotient = Math.floor(x / y);
  let remainder = x % y;
  return [quotient, remainder];
};

export const getMethodName = (method: Method): 'Delivery' | 'Pickup' | '' => {
  switch (method) {
    case 'delivery':
      return 'Delivery';
    case 'pickup':
      return 'Pickup';
  }
  return '';
};

export const percentage = (v: any, p: any) => {
  return (v * p) / 100;
};

export async function getDistanceMatrix(originLat: string | number, originLon: string | number, destLat: string | number, destLon: string | number, apiKey: string) {
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originLat},${originLon}&destinations=${destLat},${destLon}&key=${apiKey}`;
  try {
    const response = await axios.get(url);
    if (response.status !== 200) {
      throw new Error(`Error fetching distance matrix`);
    }
    const {rows, status} = response.data;
    if (status === 'OK') {
      if (rows[0]?.elements[0]?.status === 'ZERO_RESULTS') {
        // throw new Error('No route could be found between the origin and destination');
        throw new Error("We don't deliver to this address");
      }

      if (rows[0]?.elements[0]?.status === 'NOT_FOUND') {
        // throw new Error('Origin and/or destination of this pairing could not be geocoded');
        throw new Error("We don't deliver to this address");
      }

      if (rows[0].elements[0].status == 'OK') {
        const distanceValue = rows[0].elements[0].distance;
        return distanceValue;
      }
    } else {
      throw new Error(response.data?.error_message);
    }
  } catch (error: any) {
    // throw new Error(`Error fetching distance matrix: ${error.message}`);
    throw new Error(error?.message);
  }
}

export function getAddressValue(
  address_components: {
    long_name: string;
    short_name: string;
    types: string[];
  }[],
  type: string,
) {
  return address_components.find((ac: any) => ac.types.indexOf(type) != -1)?.long_name ?? '';
}

// export const minMaxRequireStringBuilder = ({isRequired, min, max}: {isRequired: boolean; min: number; max: number}) => {
//   let minMaxRequireString = '';
//   if (Boolean(min)) {
//     minMaxRequireString += ` (Min ${min}`;
//     if (Boolean(max)) {
//       minMaxRequireString += ` - Max ${max}`;
//     }
//     minMaxRequireString += `)`;
//   }
//   if (Boolean(isRequired)) {
//     minMaxRequireString += '* ';
//   }
//   return minMaxRequireString;
// };

export const minMaxRequireStringBuilder = ({isRequired, min, max}: {isRequired: boolean; min?: number; max?: number}) => {
  let minMaxRequireString = '';

  if (min || max) {
    minMaxRequireString += ' (';

    if (min) {
      minMaxRequireString += `Min ${min}`;
    }

    if (min && max) {
      minMaxRequireString += ' - ';
    }

    if (max) {
      minMaxRequireString += `Max ${max}`;
    }

    minMaxRequireString += ')';
  }

  if (isRequired) {
    minMaxRequireString += '* ';
  }

  return minMaxRequireString;
};

export const capitalizeFirst = (str: any) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
