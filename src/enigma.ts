import {
    Motor,
    Reflector,
    Rotor,
    RotorSettings,
    Plugboard
} from 'types';
import {
    I,
    II,
    III,
    UKWB,
    EnigmaI,
    DUMMYROTOR,
    DUMMYREFLECTOR
} from 'data';
import {
    isEncryptable,
    DEFAULT_KEYBOARD,
    TYPE_BOTH,
    TYPE_RING,
    TYPE_START
} from 'global';

/** Take the letter in the first position of both `entry` and `output` array, put to the last position */
const rotate = (rotor: Rotor, rounds: number = 1): Rotor => {
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

const rotateToLetter = (rotor: Rotor, letter: string): Rotor => {
    let letterPosition = rotor.entry.indexOf(letter);
    return rotate(rotor, letterPosition);
};

const rotateOnNotch = (motor: Motor): Motor => {
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

const adjustRing = (rotor: Rotor, letter: string): Rotor => {
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
const getPlugboardSignal = (plugboard: Plugboard, signal: number, isBackward: boolean = false): number => {
    if (isBackward) {
        let letter = plugboard.output[signal];
        return plugboard.entry.indexOf(letter);
    }

    let letter = plugboard.entry[signal];
    return plugboard.output.indexOf(letter);
};

/** Ouput signal direction of rotor and reflector is opposite with plugboard */
const getRotorSignal = (rotor: Rotor, signal: number, isBackward: boolean = false): number => {
    if (isBackward) {
        let letter = rotor.entry[signal];
        return rotor.output.indexOf(letter);
    }

    let letter = rotor.output[signal];
    return rotor.entry.indexOf(letter);
};

const getReflectorSignal = (reflector: Reflector, signal: number, isBackward: boolean = false): number => {
    if (isBackward) {
        let letter = reflector.entry[signal];
        return reflector.output.indexOf(letter);
    }

    let letter = reflector.output[signal];
    return reflector.entry.indexOf(letter);
};

const getMotorSignal = (motor: Motor, signal: number): number => {
    let r3Signal = getRotorSignal(motor.rotor3, signal);
    let r2Signal = getRotorSignal(motor.rotor2, r3Signal);
    let r1Signal = getRotorSignal(motor.rotor1, r2Signal);
    let refSignal = getReflectorSignal(motor.reflector, r1Signal);
    let r1BSignal = getRotorSignal(motor.rotor1, refSignal, true);
    let r2BSignal = getRotorSignal(motor.rotor2, r1BSignal, true);
    let r3BSignal = getRotorSignal(motor.rotor3, r2BSignal, true);
    return r3BSignal;
};

export const getEncryptedMessage = (motor: Motor, plugboard: Plugboard, entry: string): string => {
    let letters = entry.split('');
    let output = '';

    letters.forEach((char) => {
        if (!isEncryptable(char)) {
            output = output + char;
        } else {
            rotateOnNotch(motor);

            let kbSignal = DEFAULT_KEYBOARD.indexOf(char);
            let pbSignal = getPlugboardSignal(plugboard, kbSignal);
            let motorSignal = getMotorSignal(motor, pbSignal);
            let pbBSignal = getPlugboardSignal(plugboard, motorSignal, true);
            let outputLetter = DEFAULT_KEYBOARD[pbBSignal];
            output = output + outputLetter;
        }
    });
    return output;
};

export const getCurrentMotorState = (motor: Motor, entry: string): Motor => {
    entry.split('').forEach(() => rotateOnNotch(motor));
    return motor;
};

/** Initial default setup */
export const applyRotorSettings = (motor: Motor, rotorSettings: RotorSettings, type: string): Motor => {
    switch (type) {
        case TYPE_RING:
            adjustRing(motor.rotor1, rotorSettings.ringSettings[0]);
            adjustRing(motor.rotor2, rotorSettings.ringSettings[1]);
            adjustRing(motor.rotor3, rotorSettings.ringSettings[2]);
            break;
        case TYPE_START:
            rotateToLetter(motor.rotor1, rotorSettings.startSettings[0]);
            rotateToLetter(motor.rotor2, rotorSettings.startSettings[1]);
            rotateToLetter(motor.rotor3, rotorSettings.startSettings[2]);
            break;
        default:
            adjustRing(motor.rotor1, rotorSettings.ringSettings[0]);
            adjustRing(motor.rotor2, rotorSettings.ringSettings[1]);
            adjustRing(motor.rotor3, rotorSettings.ringSettings[2]);
            rotateToLetter(motor.rotor1, rotorSettings.startSettings[0]);
            rotateToLetter(motor.rotor2, rotorSettings.startSettings[1]);
            rotateToLetter(motor.rotor3, rotorSettings.startSettings[2]);
            break;
    }
    return motor;
};

/** Swap position of specified letter pairs. Example: "CJ KX AM" */
export const applyPlugboardSettings = (plugboard: Plugboard, settings: string): Plugboard => {
    settings.split(' ').forEach(
        (letterPair: string) => {
            let letter_1: string = letterPair[0];
            let letter_2: string = letterPair[1];

            let pos_1 = plugboard.entry.indexOf(letter_1);
            let pos_2 = plugboard.entry.indexOf(letter_2);

            plugboard.output[pos_1] = letter_2;
            plugboard.output[pos_2] = letter_1;
        }
    );
    return plugboard;
};

export const getTodayReferenceMotorState = (): Motor => {
    let motor = {
        rotor1: getRotor(I),
        rotor2: getRotor(II),
        rotor3: getRotor(III),
        reflector: getReflector(UKWB),
    };
    return getMotor(motor);
};

export const getTodayRotorSettingsState = (): RotorSettings => {
    let rotorSettings = {
        ringSettings: 'AAA',
        ringError: '',
        startSettings: 'AAA',
        startError: '',
    };
    return getRotorSettings(rotorSettings);
};

export const getTodayAppliedMotorState = (): Motor => {
    let motor = applyRotorSettings(
        getTodayReferenceMotorState(),
        getTodayRotorSettingsState(),
        TYPE_BOTH
    );
    return getMotor(motor);
};

export const getTodayPlugboardState = (): Plugboard => {
    let settings = '';
    let plugboard = {
        entry: DEFAULT_KEYBOARD.split(''),
        output: DEFAULT_KEYBOARD.split(''),
        settings: settings,
        error: '',
    };
    applyPlugboardSettings(plugboard, settings);
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
export const getRotorSettings = (basedRotorSettings: RotorSettings): RotorSettings => {
    return JSON.parse(JSON.stringify(basedRotorSettings)) as typeof basedRotorSettings;
};
