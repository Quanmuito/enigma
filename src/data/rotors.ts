import { Rotor } from 'types';

const KEYBOARD = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const DUMMYROTOR: Rotor = {
    name: 'DUMMY',
    notch: 'A',
    entry: KEYBOARD.split(''),
    output: KEYBOARD.split(''),
};

export const I: Rotor = {
    name: 'I',
    notch: 'Q',
    entry: KEYBOARD.split(''),
    output: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ'.split(''),
};

export const II: Rotor = {
    name: 'II',
    notch: 'E',
    entry: KEYBOARD.split(''),
    output: 'AJDKSIRUXBLHWTMCQGZNPYFVOE'.split(''),
};

export const III: Rotor = {
    name: 'III',
    notch: 'V',
    entry: KEYBOARD.split(''),
    output: 'BDFHJLCPRTXVZNYEIWGAKMUSQO'.split(''),
};

export const IV: Rotor = {
    name: 'IV',
    notch: 'J',
    entry: KEYBOARD.split(''),
    output: 'ESOVPZJAYQUIRHXLNFTGKDCMWB'.split(''),
};

export const V: Rotor = {
    name: 'V',
    notch: 'S',
    entry: KEYBOARD.split(''),
    output: 'VZBRGITYUPSDNHLXAWMJQOFECK'.split(''),
};
