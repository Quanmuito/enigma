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
import { KEYBOARD } from './constants';
import { RotorNotFoundError, ReflectorNotFoundError, InvalidDateError } from './errors';
import { validateConfig } from './validation';


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

/**
 * Get rotor configuration by name
 * @param name - The name of the rotor (e.g., "I", "II", "III")
 * @returns Rotor configuration object
 * @throws {RotorNotFoundError} If rotor name is not found in rotor data
 */
function getRotorByName(name: string): Rotor {
    const data = (rotorDataList as RotorData[]).find((r) => r.name === name);

    if (!data) {
        throw new RotorNotFoundError(name);
    }

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

/**
 * Get reflector configuration by name
 * @param name - The name of the reflector (e.g., "UKW-A", "UKW-B", "UKW-C")
 * @returns Reflector configuration object
 * @throws {ReflectorNotFoundError} If reflector name is not found in reflector data
 */
function getReflector(name: string): Reflector {
    const data = (reflectorDataList as ReflectorData[]).find((r) => r.name === name);

    if (!data) {
        throw new ReflectorNotFoundError(name);
    }

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

/**
 * Get daily settings configuration for a specific date
 * @param date - Date index (0-based) for daily settings
 * @param defaultReflector - Optional reflector name (defaults to "UKW-B")
 * @returns Configuration object for the specified date
 * @throws {InvalidDateError} If date index is out of bounds
 */
export function getDailySettings(date: number = 0, defaultReflector: string = 'UKW-B'): Config {
    const settings = dailySettingsList as DailySettingData[];

    if (date < 0 || date >= settings.length) {
        throw new InvalidDateError(date, settings.length - 1);
    }

    const setting = settings[date];
    return {
        rotors: setting.rotors.split(', '),
        reflector: defaultReflector,
        ring: setting.ring,
        start: setting.start,
        plugboard: setting.plugboard,
    };
}

/**
 * Assemble a configured Enigma machine from configuration
 * @param config - Configuration object with rotors, reflector, ring, start, and plugboard settings
 * @returns Configured Machine object ready for encryption
 * @throws {InvalidConfigError} If configuration is invalid
 */
export function assemble(config: Config): Machine {
    validateConfig(config);
    const [rotor1, rotor2, rotor3] = getConfiguredRotors(config);

    return {
        rotor1: rotor1,
        rotor2: rotor2,
        rotor3: rotor3,
        reflector: getReflector(config.reflector),
        plugboard: getPlugboard(config.plugboard),
    };
}

/**
 * Build a generator function that encrypts messages using the provided machine
 * @param initialMachine - The initial state of the Enigma machine
 * @returns Generator function that takes a message and returns encrypted message, machine state, and node positions
 */
export function buildGenerator(initialMachine: Machine) {
    function letterToSignal(letter: string): string | number {
        if (letter === ' ') return ' ';
        if (!KEYBOARD.includes(letter)) return letter;
        return KEYBOARD.indexOf(letter);
    }

    /**
     * Encrypt a single letter through the machine
     * @param letter - The letter to encrypt
     * @param index - Current index in the message array
     * @param array - The full message array
     * @param machine - Current machine state (mutated during encryption)
     * @param nodePositions - Array to collect signal positions for UI visualization
     * @returns Encrypted letter
     */
    function encryptLetter(
        letter: string,
        index: number,
        array: string[],
        machine: Machine,
        nodePositions: number[]
    ): string {
        const inputSignal = letterToSignal(letter);
        if (isString(inputSignal)) return inputSignal;
        if (isLastItem(index, array)) nodePositions.push(inputSignal);

        const updatedMachine = getMachineState(machine);
        const sequence = getSignalSequence(updatedMachine);
        const outputSignal = sequence.reduce(
            (value, getSignalFunction) => {
                const signal = getSignalFunction(value);
                if (isLastItem(index, array)) {
                    nodePositions.push(signal);
                }
                return signal;
            },
            inputSignal
        );

        Object.assign(machine, updatedMachine);
        return KEYBOARD[outputSignal];
    }

    /**
     * Encrypt a message using the Enigma machine
     * @param message - The message to encrypt
     * @returns Tuple containing:
     *   - encrypted message string
     *   - final machine state after encryption
     *   - node positions array for UI visualization (signals from last letter)
     */
    return function generator(message: string): [string, Machine, number[]] {
        const nodePositions: number[] = [];
        const machine: Machine = {
            reflector: { ...initialMachine.reflector },
            rotor1: { ...initialMachine.rotor1 },
            rotor2: { ...initialMachine.rotor2 },
            rotor3: { ...initialMachine.rotor3 },
            plugboard: { ...initialMachine.plugboard },
        };

        const input = message.trim().split('');
        const output = input.map((letter, index, array) =>
            encryptLetter(letter, index, array, machine, nodePositions)
        );
        return [output.join(''), machine, nodePositions];
    };
}
