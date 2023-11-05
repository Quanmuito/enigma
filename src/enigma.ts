import { Plugboard, Motor, Reflector, Rotor, RotorSettings } from 'types';
import { DUMMYREFLECTOR, DUMMYROTOR, EnigmaI, I, II, III, UKWB } from 'data';
import { DEFAULT_KEYBOARD } from 'global';

/** Swap position of specified letter pairs. Example: "CJ KX AM" */
export const plug = (letterPairs: string): string[] => {
    let entry = DEFAULT_KEYBOARD.split('');
    let output = DEFAULT_KEYBOARD.split('');
    letterPairs.split(' ').forEach(
        (letterPair: string) => {
            let letter_1: string = letterPair[0];
            let letter_2: string = letterPair[1];

            let pos_1 = entry.indexOf(letter_1);
            let pos_2 = entry.indexOf(letter_2);

            output[pos_1] = letter_2;
            output[pos_2] = letter_1;
        }
    );
    return output;
};

/** Take the letter in the first position of both `entry` and `output` array, put to the last position */
export const rotate = (rotor: Rotor, rounds: number = 1): Rotor => {
    let i = 0;
    while (i < rounds) {
        let entryFirstLetter = rotor.entry[0];
        rotor.entry.shift();
        rotor.entry.push(entryFirstLetter);

        let outputFirstLetter = rotor.output[0];
        rotor.output.shift();
        rotor.output.push(outputFirstLetter);
        i++;
    }
    return rotor;
};

export const rotateToLetter = (rotor: Rotor, letter: string): Rotor => {
    let letterPosition = rotor.entry.indexOf(letter);
    return rotate(rotor, letterPosition);
};

export const rotateOnNotch = (motor: Motor): Motor => {
    if (
        motor.rotor2.entry[0] === motor.rotor2.notch ||
        (motor.rotor3.entry[0] === motor.rotor3.notch && motor.rotor2.entry[0] === motor.rotor2.notch)
    ) {
        rotate(motor.rotor1);
        rotate(motor.rotor2);
        rotate(motor.rotor3);
    }
    else if (
        motor.rotor3.entry[0] === motor.rotor3.notch
    ) {
        rotate(motor.rotor2);
        rotate(motor.rotor3);
    }
    else {
        rotate(motor.rotor3);
    }
    return motor;
};

export const adjustRing = (rotor: Rotor, letter: string): Rotor => {
    let letterPosition = rotor.entry.indexOf(letter);
    let i = 0;
    while (i < letterPosition) {
        /** Shift the letter in `output` up by 1. Eg: A -> B, E -> F */
        rotor.output = rotor.output.map(
            (letter: string) => {
                let letterPos = rotor.entry.indexOf(letter);
                let shiftedLetterPos = letterPos + 1;
                return rotor.entry[(rotor.entry.length + shiftedLetterPos) % rotor.entry.length];
            }
        );
        /** Rotate the `output` array backward */
        let outputLastLetter = rotor.output[rotor.entry.length - 1];
        rotor.output.pop();
        rotor.output.unshift(outputLastLetter);
        i++;
    }
    return rotor;
};

/** Get the signal from plugboard */
export const getPlugboardSignal = (plugboard: Plugboard, signal: number, isBackward: boolean = false): number => {
    if (isBackward) {
        let letter = plugboard.output[signal];
        return plugboard.entry.indexOf(letter);
    }

    let letter = plugboard.entry[signal];
    return plugboard.output.indexOf(letter);
};

/** Ouput signal direction of rotor and reflector is opposite with plugboard */
export const getRotorSignal = (rotor: Rotor, signal: number, isBackward: boolean = false): number => {
    if (isBackward) {
        let letter = rotor.entry[signal];
        return rotor.output.indexOf(letter);
    }

    let letter = rotor.output[signal];
    return rotor.entry.indexOf(letter);
};

export const getReflectorSignal = (reflector: Reflector, signal: number, isBackward: boolean = false): number => {
    if (isBackward) {
        let letter = reflector.entry[signal];
        return reflector.output.indexOf(letter);
    }

    let letter = reflector.output[signal];
    return reflector.entry.indexOf(letter);
};

export const getMotorSignal = (motor: Motor, signal: number): number => {
    let r3Signal = getRotorSignal(motor.rotor3, signal);
    let r2Signal = getRotorSignal(motor.rotor2, r3Signal);
    let r1Signal = getRotorSignal(motor.rotor1, r2Signal);
    let refSignal = getReflectorSignal(motor.reflector, r1Signal);
    let r1BSignal = getRotorSignal(motor.rotor1, refSignal, true);
    let r2BSignal = getRotorSignal(motor.rotor2, r1BSignal, true);
    let r3BSignal = getRotorSignal(motor.rotor3, r2BSignal, true);
    return r3BSignal;
};

/** Initial default setup */
export const getTodayRingState = (): RotorSettings => {
    return {
        settings: 'AAA',
        valid: true,
    };
};

export const applyRingSettings = (motor: Motor, settings: string): Motor => {
    adjustRing(motor.rotor1, settings[0]);
    adjustRing(motor.rotor2, settings[1]);
    adjustRing(motor.rotor3, settings[2]);
    return motor;
};

export const getTodayStartState = (): RotorSettings => {
    return {
        settings: 'AAA',
        valid: true,
    };
};

export const applyStartSettings = (motor: Motor, settings: string): Motor => {
    rotateToLetter(motor.rotor1, settings[0]);
    rotateToLetter(motor.rotor2, settings[1]);
    rotateToLetter(motor.rotor3, settings[2]);
    return motor;
};

export const getTodayMotorState = (): Motor => {
    let motor = {
        rotor1: getRotor(I),
        rotor2: getRotor(II),
        rotor3: getRotor(III),
        reflector: getReflector(UKWB),
    };

    let rings = getTodayRingState();
    applyRingSettings(motor, rings.settings);

    let starts = getTodayStartState();
    applyStartSettings(motor, starts.settings);

    return getMotor(motor);
};

export const getTodayPlugboardState = (): Plugboard => {
    let keyboard: string = JSON.parse(JSON.stringify(DEFAULT_KEYBOARD));
    let settings = '';

    let plugboard = {
        entry: keyboard.split(''),
        output: plug(settings),
        settings: settings,
        valid: true,
    };
    return getPlugboard(plugboard);
};

export const getRotorByName = (name: string): Rotor => {
    let rotor = EnigmaI.rotors.find((rotor) => rotor.name === name);
    let foundRotor = (rotor !== undefined) ? rotor : DUMMYROTOR;
    return getRotor(foundRotor);
};

export const getReflectorByName = (name: string): Reflector => {
    let reflector = EnigmaI.rotors.find((reflector) => reflector.name === name);
    let foundReflector = (reflector !== undefined) ? reflector : DUMMYREFLECTOR;
    return getReflector(foundReflector);
};

/** Deep cloning make sure the instance only copy the value istead of reference the default data */
export const getPlugboard = (basedPlugboard: Plugboard): Plugboard => {
    return JSON.parse(JSON.stringify(basedPlugboard)) as typeof basedPlugboard;
};
export const getRotor = (basedRotor: Rotor): Rotor => {
    return JSON.parse(JSON.stringify(basedRotor)) as typeof basedRotor;
};
export const getReflector = (basedReflector: Reflector): Reflector => {
    return JSON.parse(JSON.stringify(basedReflector)) as typeof basedReflector;
};
export const getMotor = (basedMotor: Motor): Motor => {
    return JSON.parse(JSON.stringify(basedMotor)) as typeof basedMotor;
};

