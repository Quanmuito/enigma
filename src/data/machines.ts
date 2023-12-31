import { I, II, III, IV, V } from 'data/rotors';
import { UKWA, UKWB, UKWC } from 'data/reflectors';
import { Enigma } from 'types';

export const EnigmaI: Enigma = {
    name: 'Enigma I',
    usage: 'German Army and Air Force (Wehrmacht, Luftwaffe)',
    description: 'Enigma I was the modified version of Enigma machine G. Enigma I is also known as the Wehrmacht, or "Services" Enigma, and was used extensively by German military services and other government organisations (such as the railways[52]) before and during World War II. In August 1935, the Air Force introduced the Wehrmacht Enigma for their communications.',
    date: 'June 1930',
    rotors: [I, II, III, IV, V],
    reflectors: [UKWA, UKWB, UKWC],
};
