import { Reflector } from 'types';
import { DEFAULT_KEYBOARD } from 'global';

export const DUMMYREFLECTOR: Reflector = {
    name: 'DUMMY',
    entry: DEFAULT_KEYBOARD.split(''),
    output: DEFAULT_KEYBOARD.split(''),
};

export const UKWA: Reflector = {
    name: 'UKW-A',
    entry: DEFAULT_KEYBOARD.split(''),
    output: 'EJMZALYXVBWFCRQUONTSPIKHGD'.split(''),
};

export const UKWB: Reflector = {
    name: 'UKW-B',
    entry: DEFAULT_KEYBOARD.split(''),
    output: 'YRUHQSLDPXNGOKMIEBFZCWVJAT'.split(''),
};

export const UKWC: Reflector = {
    name: 'UKW-C',
    entry: DEFAULT_KEYBOARD.split(''),
    output: 'FVPJIAOYEDRZXWGCTKUQSBNMHL'.split(''),
};
