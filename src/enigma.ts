import {
    Reflector,
    Rotor,
    Setting,
    Machine,
    AppState,
    DailySetting
} from 'types';
import {
    UKWB,
    EnigmaI,
    DUMMYROTOR,
    DUMMYREFLECTOR,
    DAILY_SETTINGS
} from 'data';
import { KEYBOARD, TODAY, isEncryptable } from 'global';
import { run } from 'v2/enigma';

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

const getReferenceMachineState = (dailySetting: DailySetting): Machine => {
    return {
        reflector: getClone<Reflector>(UKWB),
        rotor1: getClone<Rotor>(dailySetting.rotors[0]),
        rotor2: getClone<Rotor>(dailySetting.rotors[1]),
        rotor3: getClone<Rotor>(dailySetting.rotors[2]),
        plugboard: {
            entry: KEYBOARD.split(''),
            output: KEYBOARD.split(''),
        },
    };
};

const getSettingState = (dailySetting: DailySetting): Setting => {
    return {
        date: dailySetting.date,
        ringSettings: dailySetting.rings,
        ringError: '',
        startSettings: dailySetting.starts,
        startError: '',
        plugboardSettings: dailySetting.plugboard,
        plugboardError: '',
    };
};

export const getAppStateByDate = (date: number = TODAY): AppState => {
    let dailySetting = DAILY_SETTINGS[date];

    let machine = getReferenceMachineState(dailySetting);
    let setting = getSettingState(dailySetting);

    return {
        setting: setting,
        referenceMachine: machine,
        configuredMachine: getConfiguredMachine(setting, getClone<Machine>(machine)),
        displayMachine: getConfiguredMachine(setting, getClone<Machine>(machine)),
        message: {
            entry: '',
            output: '',
            error: '',
        },
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

export const getEncryptedMessage = (state: AppState, entry: string): string => {
    const config = {
        rotors: [state.referenceMachine.rotor1.name, state.referenceMachine.rotor2.name, state.referenceMachine.rotor3.name],
        reflector: state.referenceMachine.reflector.name,
        ring: state.setting.ringSettings,
        start: state.setting.startSettings,
        plugboard: state.setting.plugboardSettings,
    };

    return run(config, entry)[0];
};

export const getDisplayMachineState = (machine: Machine, entry: string): Machine => {
    entry.split('').forEach((char) => {
        if (isEncryptable(char)) {
            rotateOnNotch(machine);
        }
    });
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
