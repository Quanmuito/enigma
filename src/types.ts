import { RefObject } from 'react';

export type Rotor = {
    name: string,
    notch: string,
    entry: string[],
    output: string[],
};

export type Reflector = {
    name: string,
    entry: string[],
    output: string[],
};

export type Enigma = {
    name: string,
    usage: string,
    description: string,
    date: string,
    rotors: Rotor[],
    reflectors: Reflector[];
};

export type DailySetting = {
    date: number,
    rotors: Rotor[],
    rings: string,
    starts: string,
    plugboard: string,
};

export type NodeRefObjectType = {
    id: number;
    ref: RefObject<HTMLSpanElement>;
};
