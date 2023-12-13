import validator from 'validator';
import {showDangerMessage} from './functions';
import {FormDataGuestUser, WhichForm} from '../types';
export const isEmail = (email: string) => validator.isEmail(email);
export const isEquals = (str: string, otherStr: string) => String(str) === String(otherStr);
export const isEmpty = (str: string) => validator.isEmpty(str);
export const isValidName = (str: string) => /^([A-Za-z]+)$/.test(str);
export const isNumeric = (str: string) => validator.isNumeric(str);
export const isValidNumber = (str: string) => /^\d{10}$/.test(str);
export const isValidNumberWithDash = (str: string) => /[\d-]+$/.test(str);
export const validateCardNumber = (card_number: string) => {
  if (card_number.length === 0) {
    showDangerMessage('Please enter card number');
    return false;
  } else {
    const reg_card_number = /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/;
    return reg_card_number.test(card_number);
  }
};
export const validateCardHolderName = (name: string) => {
  const nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
  return nameRegex.test(name);
};
export const validatePhoneNumber = (input_str: string) => {
  if (typeof input_str === 'string') {
    if (isEmpty(input_str)) {
      showDangerMessage('Please enter phone number.');
      return false;
    } else if (input_str.length < 10) {
      showDangerMessage('Please enter valid phone number.');
      return false;
    } else if (!isValidNumber(input_str)) {
      showDangerMessage('Please enter valid phone number.');
      return false;
    } else {
      return true;
    }
  } else {
    showDangerMessage('Please enter valid phone number.');
  }
};
export const validatePasswordNew = (pwdStr: string, FieldName: string) => {
  let pwdError = '';
  if (isEmpty(pwdStr)) {
    pwdError = `Please enter ${String(FieldName).toLowerCase()}.`;
  } else if (
    !validator.isStrongPassword(pwdStr, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    const x = String(FieldName).toLowerCase();
    pwdError += `Please enter minimum 8 characters, at least one uppercase, one lowercase, one numeric and special character for ${x}.`;
  }
  if (pwdError.length === 0) {
    return true;
  } else {
    showDangerMessage(pwdError);
    return false;
  }
};
export function validateName(name: string) {
  if (name.trim() === '') {
    return false;
  }
  var regex = /^[a-zA-Z ]+$/;
  return regex.test(name);
}
export function validateEmail(email: string) {
  if (email.trim() === '') {
    return false;
  }
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
export const validateGuestInput = (isSignIn: WhichForm, guestData: Required<FormDataGuestUser>) => {
  if (isSignIn !== 'guestuser') {
    showDangerMessage('Please enter your guest details or do login');
    return false;
  }
  const {name, email, phone} = guestData;
  if (!validateName(name)) {
    showDangerMessage('Please enter your name.');
    return false;
  }

  if (email.length == 0) {
    showDangerMessage('Please enter email address.');
    return false;
  }

  var emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (!emailRegex.test(email)) {
    showDangerMessage('Please enter a valid email address.');
    return false;
  }

  if (String(phone).length == 0) {
    showDangerMessage('Please enter phone number.');
    return false;
  }

  var phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(String(phone))) {
    showDangerMessage('Please enter a valid 10-digit phone number.');
    return false;
  }
  return true;
};
