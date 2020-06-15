import { PasswordPolicy, charsets } from 'password-sheriff';
import { PasswordsLengthsType } from './types';

export default {
  low: new PasswordPolicy({
    length: {
      minLength: PasswordsLengthsType.Low,
    },
  }),
  easy: new PasswordPolicy({
    contains: {
      atLeast: 1,
      expressions: [charsets.upperCase, charsets.numbers],
    },
    length: {
      minLength: PasswordsLengthsType.Easy,
    },
  }),
  normal: new PasswordPolicy({
    contains: {
      atLeast: 2,
      expressions: [charsets.upperCase, charsets.numbers],
    },
    length: {
      minLength: PasswordsLengthsType.Normal,
    },
  }),
  medium: new PasswordPolicy({
    contains: {
      atLeast: 3,
      expressions: [
        charsets.lowerCase,
        charsets.upperCase,
        charsets.numbers,
        charsets.specialCharacters,
      ],
    },
    length: {
      minLength: PasswordsLengthsType.Medium,
    },
  }),
  complex: new PasswordPolicy({
    identicalChars: {
      max: 3,
    },
    contains: {
      atLeast: 4,
      expressions: [
        charsets.lowerCase,
        charsets.upperCase,
        charsets.numbers,
        charsets.specialCharacters,
      ],
    },
    length: {
      minLength: PasswordsLengthsType.Complex,
    },
  }),
};
