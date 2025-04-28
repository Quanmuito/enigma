import {
    Config,
    DailySettingData,
    Machine,
    Plugboard,
    Reflector,
    ReflectorData,
    Rotor,
    RotorData
} from './types';
import rotorDataList from './data/rotors.json';
import reflectorDataList from './data/reflectors.json';
import dailySettingsList from './data/dailySettings.json';
import { isLastItem, isString } from './utils';


// ---- Constants ------------------------------------------------------------------------------------------------------

export const KEYBOARD = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');


// ---- Utilities ------------------------------------------------------------------------------------------------------

/** Cut the array at 1 point then swap the position of the 2 new arrays */
function rotateArrayFromPoint(point: number) {
    return function (array: string[]): string[] {
        return [...array.slice(point), ...array.slice(0, point)];
    };
}

/** Explained in README.md/Shifted letters */
function shiftLetter(step: number) {
    return function (letter: string): string {
        const index = KEYBOARD.indexOf(letter);
        const newIndex = (index + step) % KEYBOARD.length;
        return KEYBOARD[newIndex];
    };
}

/** Explained in README.md/Rotate */
function rotateRotor(steps: number = 1) {
    const rotate = rotateArrayFromPoint(steps);

    return function (rotor: Rotor): Rotor {
        return {
            ...rotor,
            ingang: rotate(rotor.ingang),
            engang: rotate(rotor.engang),
        };
    };
}


// ---- Rotor Configuration --------------------------------------------------------------------------------------------

function getRotorByName(name: string): Rotor {
    const data = (rotorDataList as RotorData[]).find((r) => r.name === name)!;

    return {
        notch: data.notch,
        ingang: KEYBOARD,
        engang: data.wiring.split(''),
    };
}

/** Get list of rotors from config */
function selectRotors(names: string[]): Rotor[] {
    return names.map(getRotorByName);
}

/** Adjust ring position based on config */
function adjustRing(ringConfig: string) {
    return function (rotor: Rotor, index: number): Rotor {
        const step = rotor.ingang.indexOf(ringConfig[index]);
        const shifted = rotor.engang.map(shiftLetter(step));
        const cutPoint = shifted.length - step;
        return {
            ...rotor,
            engang: [...shifted.slice(cutPoint), ...shifted.slice(0, cutPoint)],
        };
    };
}

/** Adjust start position based on config */
function adjustStart(startConfig: string) {
    return function (rotor: Rotor, index: number): Rotor {
        const step = rotor.ingang.indexOf(startConfig[index]);
        return rotateRotor(step)(rotor);
    };
}

/** Get list of rotors after configured */
function getConfiguredRotors(config: Config): Rotor[] {
    return selectRotors(config.rotors)
        .map(adjustRing(config.ring))
        .map(adjustStart(config.start));
}


// ---- Reflector & Plugboard ------------------------------------------------------------------------------------------

/** Get reflector based on config */
function getReflector(name: string): Reflector {
    const data = (reflectorDataList as ReflectorData[]).find((r) => r.name === name)!;
    return {
        ingang: KEYBOARD,
        engang: data.wiring.split(''),
    };
}

/** Adjust plugboard based on config */
function getPlugboard(config: string): Plugboard {
    const pairs = config.split(' ');

    function mapLetter(letter: string): string {
        const pair = pairs.find((p) => p.includes(letter));
        return pair ? pair.replace(letter, '') : letter;
    }

    return {
        ingang: KEYBOARD,
        engang: KEYBOARD.map(mapLetter),
    };
}


// ---- Machine State & Signal Flow ------------------------------------------------------------------------------------

/** Get current state of machine after input 1 character */
function getMachineState(machine: Machine) {
    const rotate = rotateRotor();
    const rotor3OnNotch = machine.rotor3.ingang[0] === machine.rotor3.notch;
    const rotor2OnNotch = machine.rotor2.ingang[0] === machine.rotor2.notch;

    if (rotor2OnNotch && rotor3OnNotch) {
        return {
            ...machine,
            rotor1: rotate(machine.rotor1),
            rotor2: rotate(machine.rotor2),
            rotor3: rotate(machine.rotor3),
        };
    }
    else if (rotor3OnNotch) {
        return {
            ...machine,
            rotor2: rotate(machine.rotor2),
            rotor3: rotate(machine.rotor3),
        };
    }
    else {
        return {
            ...machine,
            rotor3: rotate(machine.rotor3),
        };
    }
}

/** Get the output letter after scrambled */
type GetSignalFunction = (signal: number) => number;
function createSignalMapper(input: string[], output: string[]) {
    return function (signal: number): number {
        return input.indexOf(output[signal]);
    };
}

function buildSignalFunctions(component: Rotor | Reflector | Plugboard): GetSignalFunction[] {
    return [
        createSignalMapper(component.ingang, component.engang), // forward signal
        createSignalMapper(component.engang, component.ingang), // backward signal
    ];
}

/** Build the chain of signal to encrypt the letter */
function getSignalSequence(machine: Machine): GetSignalFunction[] {
    const rotor1 = buildSignalFunctions(machine.rotor1);
    const rotor2 = buildSignalFunctions(machine.rotor2);
    const rotor3 = buildSignalFunctions(machine.rotor3);
    const reflector = buildSignalFunctions(machine.reflector);
    const plugboard = buildSignalFunctions(machine.plugboard);

    return [
        plugboard[0],
        rotor3[0],
        rotor2[0],
        rotor1[0],
        reflector[0],
        rotor1[1],
        rotor2[1],
        rotor3[1],
        plugboard[1],
    ];
}


// ---- Main Assembly --------------------------------------------------------------------------------------------------

export function getDailySettings(date: number = 0): Config {
    const setting = (dailySettingsList as DailySettingData[])[date];
    return {
        rotors: setting.rotors.split(', '),
        reflector: 'UKW-B',
        ring: setting.ring,
        start: setting.start,
        plugboard: setting.plugboard,
    };
}

/** Get the configured machine */
export function assemble(config: Config): Machine {
    const [rotor1, rotor2, rotor3] = getConfiguredRotors(config);

    return {
        rotor1: rotor1,
        rotor2: rotor2,
        rotor3: rotor3,
        reflector: getReflector(config.reflector),
        plugboard: getPlugboard(config.plugboard),
    };
}

/** Build the generator which wait for user input and encrypt the message */
export function buildGenerator(machine: Machine) {
    const nodePositions: number[] = [];

    function letterToSignal(letter: string): string | number {
        if (letter === ' ') return ' ';
        if (!KEYBOARD.includes(letter)) return letter;
        return KEYBOARD.indexOf(letter);
    }

    /** Get the output letter */
    function encryptLetter(letter: string, index: number, array: string[]): string {
        const inputSignal = letterToSignal(letter);
        if (isString(inputSignal)) return inputSignal;
        if (isLastItem(index, array)) nodePositions.push(inputSignal); // collect input of last letter for UI

        machine = { ...getMachineState(machine) };
        const sequence = getSignalSequence(machine);
        const outputSignal = sequence.reduce(
            (value, getSignalFunction) => {
                const signal = getSignalFunction(value);
                isLastItem(index, array) && nodePositions.push(signal); // collect the sequence of last letter for UI
                return signal;
            },
            inputSignal
        );

        return KEYBOARD[outputSignal];
    }

    /**
     * Take the message and return:
     * - output: the encrypted message
     * - machine: the current state of the machine
     * - nodePositions: output signal of each component when encrypt the last letter
     */
    return function generator(message: string): [string, Machine, number[]] {
        const input = message.trim().split('');
        const output = input.map(encryptLetter);
        return [output.join(''), machine, nodePositions];
    };
}
