import { Rotor } from 'types';
import { DEFAULT_KEYBOARD } from 'global';

export const DUMMYROTOR: Rotor = {
    name: 'DUMMY',
    notch: 'A',
    entry: DEFAULT_KEYBOARD.split(''),
    output: DEFAULT_KEYBOARD.split(''),
};

export const I: Rotor = {
    name: 'I',
    notch: 'Q',
    entry: DEFAULT_KEYBOARD.split(''),
    output: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ'.split(''),
};

export const II: Rotor = {
    name: 'II',
    notch: 'E',
    entry: DEFAULT_KEYBOARD.split(''),
    output: 'AJDKSIRUXBLHWTMCQGZNPYFVOE'.split(''),
};

export const III: Rotor = {
    name: 'III',
    notch: 'V',
    entry: DEFAULT_KEYBOARD.split(''),
    output: 'BDFHJLCPRTXVZNYEIWGAKMUSQO'.split(''),
};

export const IV: Rotor = {
    name: 'IV',
    notch: 'J',
    entry: DEFAULT_KEYBOARD.split(''),
    output: 'ESOVPZJAYQUIRHXLNFTGKDCMWB'.split(''),
};

export const V: Rotor = {
    name: 'V',
    notch: 'S',
    entry: DEFAULT_KEYBOARD.split(''),
    output: 'VZBRGITYUPSDNHLXAWMJQOFECK'.split(''),
};
