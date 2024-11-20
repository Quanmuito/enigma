import { Reflector } from 'types';

const KEYBOARD = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const DUMMYREFLECTOR: Reflector = {
    name: 'DUMMY',
    entry: KEYBOARD.split(''),
    output: KEYBOARD.split(''),
};

export const UKWA: Reflector = {
    name: 'UKW-A',
    entry: KEYBOARD.split(''),
    output: 'EJMZALYXVBWFCRQUONTSPIKHGD'.split(''),
};

export const UKWB: Reflector = {
    name: 'UKW-B',
    entry: KEYBOARD.split(''),
    output: 'YRUHQSLDPXNGOKMIEBFZCWVJAT'.split(''),
};

export const UKWC: Reflector = {
    name: 'UKW-C',
    entry: KEYBOARD.split(''),
    output: 'FVPJIAOYEDRZXWGCTKUQSBNMHL'.split(''),
};
