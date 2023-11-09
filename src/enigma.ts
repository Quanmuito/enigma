import {
    Reflector,
    Rotor,
    Plugboard,
    Setting,
    Machine,
    AppState,
    Message
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
    DEFAULT_KEYBOARD, isEmpty, isEncryptable
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
    if (isEmpty(letter)) {
        letter = 'A';
    }
    let letterPosition = rotor.entry.indexOf(letter);
    return rotate(rotor, letterPosition);
};

const rotateOnNotch = (machine: Machine): Machine => {
    if (
        machine.rotor2.entry[0] === machine.rotor2.notch ||
        (machine.rotor3.entry[0] === machine.rotor3.notch && machine.rotor2.entry[0] === machine.rotor2.notch)
    ) {
        rotate(machine.rotor1);
        rotate(machine.rotor2);
        rotate(machine.rotor3);
    }
    else if (
        machine.rotor3.entry[0] === machine.rotor3.notch
    ) {
        rotate(machine.rotor2);
        rotate(machine.rotor3);
    }
    else {
        rotate(machine.rotor3);
    }
    return machine;
};

const adjustRing = (rotor: Rotor, letter: string): Rotor => {
    if (isEmpty(letter)) {
        letter = 'A';
    }
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

const getSignal = (machine: Machine, signal: number): number => {
    let pbSignal = getPlugboardSignal(machine.plugboard, signal);
    let r3Signal = getRotorSignal(machine.rotor3, pbSignal);
    let r2Signal = getRotorSignal(machine.rotor2, r3Signal);
    let r1Signal = getRotorSignal(machine.rotor1, r2Signal);
    let refSignal = getReflectorSignal(machine.reflector, r1Signal);
    let r1BSignal = getRotorSignal(machine.rotor1, refSignal, true);
    let r2BSignal = getRotorSignal(machine.rotor2, r1BSignal, true);
    let r3BSignal = getRotorSignal(machine.rotor3, r2BSignal, true);
    let pbBSignal = getPlugboardSignal(machine.plugboard, r3BSignal);

    return pbBSignal;
};

export const getEncryptedMessage = (machine: Machine, entry: string): string => {
    let letters = entry.split('');
    let output = '';

    letters.forEach((char) => {
        if (!isEncryptable(char)) {
            output = output + char;
        } else {
            rotateOnNotch(machine);

            let kbSignal = DEFAULT_KEYBOARD.indexOf(char);
            let signal = getSignal(machine, kbSignal);
            let outputLetter = DEFAULT_KEYBOARD.charAt(signal);
            output = output + outputLetter;
        }
    });
    return output;
};

export const getDisplayMachineState = (machine: Machine, entry: string): Machine => {
    entry.split('').forEach((char) => {
        if (isEncryptable(char)) {
            rotateOnNotch(machine);
        }
    });
    return machine;
};

export const getTodayPlugboardState = (): Plugboard => {
    return {
        entry: DEFAULT_KEYBOARD.split(''),
        output: DEFAULT_KEYBOARD.split(''),
    };
};

const getTodayMachineState = (): Machine => {
    return {
        reflector: getClone<Reflector>(UKWB),
        rotor1: getClone<Rotor>(I),
        rotor2: getClone<Rotor>(II),
        rotor3: getClone<Rotor>(III),
        plugboard: getTodayPlugboardState(),
    };
};

const getTodaySettingState = (): Setting => {
    return {
        ringSettings: 'AAA',
        ringError: '',
        plugboardSettings: '',
        plugboardError: '',
        startSettings: 'AAA',
        startError: '',
    };
};

const getTodayMessageState = (): Message => {
    return {
        entry: '',
        output: '',
        error: '',
    };
};

export const getTodayAppState = (): AppState => {
    let machine = getTodayMachineState();
    let setting = getTodaySettingState();

    return {
        setting: setting,
        referenceMachine: machine,
        configuredMachine: getConfiguredMachine(setting, getClone<Machine>(machine)),
        displayMachine: getConfiguredMachine(setting, getClone<Machine>(machine)),
        message: getTodayMessageState(),
    };
};

export const getConfiguredMachine = (setting: Setting, machine: Machine): Machine => {
    adjustRing(machine.rotor1, setting.ringSettings.charAt(0));
    adjustRing(machine.rotor2, setting.ringSettings.charAt(1));
    adjustRing(machine.rotor3, setting.ringSettings.charAt(2));
    rotateToLetter(machine.rotor1, setting.startSettings.charAt(0));
    rotateToLetter(machine.rotor2, setting.startSettings.charAt(1));
    rotateToLetter(machine.rotor3, setting.startSettings.charAt(2));

    /** Swap position of specified letter pairs. Example: "CJ KX AM" */
    setting.plugboardSettings.split(' ').forEach(
        (letterPair: string) => {
            let letter_1: string = letterPair[0];
            let letter_2: string = letterPair[1];

            let pos_1 = machine.plugboard.entry.indexOf(letter_1);
            let pos_2 = machine.plugboard.entry.indexOf(letter_2);

            machine.plugboard.output[pos_1] = letter_2;
            machine.plugboard.output[pos_2] = letter_1;
        }
    );

    return machine;
};

export const getRotorByName = (name: string): Rotor => {
    let rotor = EnigmaI.rotors.find((rotor) => rotor.name === name);
    let foundRotor = (rotor !== undefined) ? rotor : DUMMYROTOR;
    return getClone<Rotor>(foundRotor);
};

export const getReflectorByName = (name: string): Reflector => {
    let reflector = EnigmaI.reflectors.find((reflector) => reflector.name === name);
    let foundReflector = (reflector !== undefined) ? reflector : DUMMYREFLECTOR;
    return getClone<Reflector>(foundReflector);
};

/** Deep cloning make sure the instance only copy the value istead of reference the default data */
export const getClone = <T>(based: T): T => {
    return JSON.parse(JSON.stringify(based)) as typeof based;
};
