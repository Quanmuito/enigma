import { Config, Machine, Plugboard, Reflector, ReflectorData, Rotor, RotorData } from './types';
import rotorDataList from './rotors.json';
import reflectorDataList from './reflectors.json';

const DEFAULT_KEYBOARD = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function getKeyboard(keyboard: string = DEFAULT_KEYBOARD): string[] {
    return keyboard.split('');
}

function swapAt(point: number) {
    return function _swapAt(array: string[]): string[] {
        return [...array.slice(point), ...array.slice(0, point)];
    };
}

/** Explained in README.md/Shifted letters */
function shiftLetter(step: number) {
    return function _shiftLetter(letter: string): string {
        const keyboard = getKeyboard();
        const currentIndex = keyboard.indexOf(letter);
        const newIndex = (currentIndex + step) % keyboard.length;
        return keyboard[newIndex];
    };
}

/** Explained in README.md/Rotate */
function rotateRotor(rounds: number = 1) {
    const adjustState = swapAt(rounds);

    return function _rotateRotor(rotor: Rotor): Rotor {
        return {
            ...rotor,
            ingang: adjustState(rotor.ingang),
            engang: adjustState(rotor.engang),
        };
    };
}

function rotateMachine(machine: Machine) {
    const rotor3OnNotch = machine.rotor3.ingang[0] === machine.rotor3.notch;
    const rotor2OnNotch = machine.rotor2.ingang[0] === machine.rotor2.notch;

    if (rotor2OnNotch && rotor3OnNotch) {
        return {
            ...machine,
            rotor1: rotateRotor()(machine.rotor1),
            rotor2: rotateRotor()(machine.rotor2),
            rotor3: rotateRotor()(machine.rotor3),
        };
    }
    else if (rotor3OnNotch) {
        return {
            ...machine,
            rotor2: rotateRotor()(machine.rotor2),
            rotor3: rotateRotor()(machine.rotor3),
        };
    }
    else {
        return {
            ...machine,
            rotor3: rotateRotor()(machine.rotor3),
        };
    }
}

function selectRotors(names: string[]): Rotor[] {
    const list = rotorDataList as RotorData[]; // Load once

    function getRotorByName(name: string): Rotor {
        const rotorData = list.find((data) => data.name === name) ?? list[0];
        return {
            notch: rotorData.notch,
            ingang: getKeyboard(),
            engang: rotorData.wiring.split(''),
        };
    }

    return names.map(getRotorByName);
}

function adjustRing(ringConfig: string) {
    const rings = ringConfig.split('');

    return function _adjustRing(rotor: Rotor, index: number): Rotor {
        const step = rotor.ingang.indexOf(rings[index]);
        const shiftedEngang = rotor.engang.map(shiftLetter(step));
        const cutPoint = shiftedEngang.length - step;
        const newEngang = [...shiftedEngang.slice(cutPoint), ...shiftedEngang.slice(0, cutPoint)];

        return {
            ...rotor,
            engang: newEngang,
        };
    };
}

function adjustStart(startConfig: string) {
    const starts = startConfig.split('');

    return function _adjustStart(rotor: Rotor, index: number): Rotor {
        const step = rotor.ingang.indexOf(starts[index]);
        return rotateRotor(step)(rotor);
    };
}

function getRotors(config: Config): Rotor[] {
    return selectRotors(config.rotors)
        .map(adjustRing(config.ring))
        .map(adjustStart(config.start));
}

function getReflector(name: string): Reflector {
    const list = reflectorDataList as ReflectorData[];
    const reflectorData = list.find((data) => data.name === name) ?? list[0];

    return {
        ingang: getKeyboard(),
        engang: reflectorData.wiring.split(''),
    };
}

function getPlugboard(plugboardConfig: string): Plugboard {
    const letterPairs = plugboardConfig.split(' ');

    function getSwappedLetter(letter: string): string {
        const matchingSwap = letterPairs.find((pair) => pair.includes(letter));
        if (matchingSwap) {
            const otherLetter = matchingSwap.replace(letter, '');
            return otherLetter;
        }
        return letter;
    }

    return {
        ingang: getKeyboard(),
        engang: getKeyboard().map(getSwappedLetter),
    };
}

type GetSignalFunction = (signal: number) => number;
function getSignal(input: string[], output: string[]): GetSignalFunction {
    return function _getSignal(signal: number): number {
        return input.indexOf(output[signal]);
    };
}

function rotorSignalBuilder(rotor: Rotor): GetSignalFunction[] {
    const getRotorSignal: GetSignalFunction = getSignal(rotor.ingang, rotor.engang);
    const getRotorReversedSignal: GetSignalFunction = getSignal(rotor.engang, rotor.ingang);
    return [getRotorSignal, getRotorReversedSignal];
}

function reflectorSignalBuilder(reflector: Reflector): GetSignalFunction[] {
    const getReflectorSignal: GetSignalFunction = getSignal(reflector.ingang, reflector.engang);
    return [getReflectorSignal];
}

function plugboardSignalBuilder(plugboard: Plugboard): GetSignalFunction[] {
    const getPlugboardSignal: GetSignalFunction = getSignal(plugboard.engang, plugboard.ingang);
    const getPlugboardReversedSignal: GetSignalFunction = getSignal(plugboard.ingang, plugboard.engang);
    return [getPlugboardSignal, getPlugboardReversedSignal];
}

function getSignalSequence(machine: Machine): GetSignalFunction[] {
    const [getRotor1Signal, getRotor1ReversedSignal] = rotorSignalBuilder(machine.rotor1);
    const [getRotor2Signal, getRotor2ReversedSignal] = rotorSignalBuilder(machine.rotor2);
    const [getRotor3Signal, getRotor3ReversedSignal] = rotorSignalBuilder(machine.rotor3);
    const [getReflectorSignal] = reflectorSignalBuilder(machine.reflector);
    const [getPlugboardSignal, getPlugboardSignalReversed] = plugboardSignalBuilder(machine.plugboard);

    return [
        getPlugboardSignal,
        getRotor3Signal,
        getRotor2Signal,
        getRotor1Signal,
        getReflectorSignal,
        getRotor1ReversedSignal,
        getRotor2ReversedSignal,
        getRotor3ReversedSignal,
        getPlugboardSignalReversed,
    ];
}

export function assemble(config: Config): Machine {
    const [rotor1, rotor2, rotor3] = getRotors(config);

    return {
        rotor1: rotor1,
        rotor2: rotor2,
        rotor3: rotor3,
        reflector: getReflector(config.reflector),
        plugboard: getPlugboard(config.plugboard),
    };
}

export function buildGenerator(machine: Machine) {
    const keyboard = getKeyboard();

    function encryptLetter(letter: string): string {
        if (letter === ' ') return ' ';

        machine = { ...rotateMachine(machine) };
        const sequence = getSignalSequence(machine);

        const inputSignal = keyboard.indexOf(letter);
        const outputSignal = sequence.reduce(
            function reducerFn(value, fn) {
                return fn(value);
            },
            inputSignal
        );
        return keyboard[outputSignal];
    }

    const nodePositions: number[] = [];
    function encryptLastLetter(letter: string): string {
        machine = { ...rotateMachine(machine) };
        const sequence = getSignalSequence(machine);

        const inputSignal = keyboard.indexOf(letter);
        nodePositions.push(inputSignal);
        const outputSignal = sequence.reduce(
            function reducerFn(value, fn) {
                const sig = fn(value);
                nodePositions.push(sig);
                return sig;
            },
            inputSignal
        );
        nodePositions.push(outputSignal);
        return keyboard[outputSignal];
    }

    return function generator(message: string): [string, Machine, number[]] {
        const input = message.trim();
        if (input.length === 0) {
            return [input, machine, nodePositions];
        }

        if (input.length === 1) {
            return [encryptLastLetter(input), machine, nodePositions];
        }

        const characters = input.split('');
        characters.pop();
        const encryptedCharacters = characters.map(encryptLetter);
        const output = encryptedCharacters.join('') + encryptLastLetter(input.slice(-1));

        return [output, machine, nodePositions];
    };
}
