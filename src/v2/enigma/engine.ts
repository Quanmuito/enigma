import { Config, Machine, Plugboard, Reflector, ReflectorData, Rotor, RotorData } from './types';
import rotorData from './rotors.json';
import reflectorData from './reflectors.json';

export const DEFAULT_KEYBOARD = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const getKeyboard = (): string[] =>  DEFAULT_KEYBOARD.split('');

export const getShiftedLetter = (letter: string, shift: number): string => {
    const keyboard = getKeyboard();
    const currentPosition = keyboard.indexOf(letter);
    const newIndex = (currentPosition + shift) % keyboard.length;
    return keyboard[newIndex];
};

export const rotate = (
    ingang: string[],
    engang: string[],
    rounds: number = 1,
    backward: boolean = false
): [string[], string[]] => {
    if (backward) {
        const newIngang = ingang.slice(ingang.length - rounds, ingang.length).concat(ingang.slice(0, ingang.length - rounds));
        const newEngang = engang.slice(engang.length - rounds, engang.length).concat(engang.slice(0, engang.length - rounds));
        return [newIngang, newEngang];
    }

    const newIngang = ingang.slice(rounds, ingang.length).concat(ingang.slice(0, rounds));
    const newEngang = engang.slice(rounds, engang.length).concat(engang.slice(0, rounds));
    return [newIngang, newEngang];
};

export const adjustRing = (ingang: string[], engang: string[], shift: number): [string[], string[]] => {
    const newIngang = ingang.map((letter) => getShiftedLetter(letter, shift));
    const newEngang = engang.map((letter) => getShiftedLetter(letter, shift));
    return rotate(newIngang, newEngang, shift, true);
};

export const adjustStart = (ingang: string[], engang: string[], shift: number): [string[], string[]] => (
    rotate(ingang, engang, shift)
);

export const getRotorByName = (name: string): RotorData => {
    const rotorList = JSON.parse(JSON.stringify(rotorData)) as RotorData[];
    const rotor = rotorList.find((data) => data.name === name);

    const dummy: RotorData = {
        name: 'DUMMY',
        notch: 'A',
        wiring: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    };

    return rotor ? rotor : dummy;
};

export const getRotor = (name: string, ring: string, start: string): Rotor => {
    const rotorData = getRotorByName(name);

    const keyboard = getKeyboard();
    const [ringIngang, ringEngang] = adjustRing(keyboard, rotorData.wiring.split(''), keyboard.indexOf(ring));
    const [startIngang, startEngang] = adjustStart(ringIngang, ringEngang, keyboard.indexOf(start));

    return {
        notch: rotorData.notch,
        ingang: startIngang,
        engang: startEngang,
    };
};

export const getReflectorByName = (name: string) => {
    const reflectorList = JSON.parse(JSON.stringify(reflectorData)) as ReflectorData[];
    const reflector = reflectorList.find((data) => data.name === name);

    const dummy: ReflectorData = {
        name: 'DUMMY',
        wiring: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    };

    return reflector ? reflector : dummy;
};

export const getReflector = (name: string): Reflector => {
    const reflectorData = getReflectorByName(name);

    return {
        ingang: getKeyboard(),
        engang: reflectorData.wiring.split(''),
    };
};

export const getPlugboard = (config: string): Plugboard => {
    const keyboard = getKeyboard();
    const swaps = config.split(' ');

    const output = keyboard.map((letter) => {
        const matchingSwap = swaps.find((pair) => pair.includes(letter));
        if (matchingSwap) {
            const otherLetter = matchingSwap.replace(letter, '');
            return otherLetter;
        }
        return letter;
    });

    return {
        ingang: getKeyboard(),
        engang: output,
    };
};

export const getConfiguredMachine = (config: Config): Machine => ({
    rotor1: getRotor(config.rotors[0], config.ring[0], config.start[0]),
    rotor2: getRotor(config.rotors[1], config.ring[1], config.start[1]),
    rotor3: getRotor(config.rotors[2], config.ring[2], config.start[2]),
    reflector: getReflector(config.reflector),
    plugboard: getPlugboard(config.plugboard),
});

export const getRotatedMachine = (machine: Machine): Machine => {
    if (
        machine.rotor2.ingang[0] === machine.rotor2.notch ||
        (machine.rotor3.ingang[0] === machine.rotor3.notch && machine.rotor2.ingang[0] === machine.rotor2.notch)
    ) {
        const [ingang1, engang1] = rotate(machine.rotor1.ingang, machine.rotor1.engang);
        const [ingang2, engang2] = rotate(machine.rotor2.ingang, machine.rotor2.engang);
        const [ingang3, engang3] = rotate(machine.rotor3.ingang, machine.rotor3.engang);
        return {
            ...machine,
            rotor1: {
                ...machine.rotor1,
                ingang: ingang1,
                engang: engang1,
            },
            rotor2: {
                ...machine.rotor2,
                ingang: ingang2,
                engang: engang2,
            },
            rotor3: {
                ...machine.rotor3,
                ingang: ingang3,
                engang: engang3,
            },
        };
    }
    else if (
        machine.rotor3.ingang[0] === machine.rotor3.notch
    ) {
        const [ingang2, engang2] = rotate(machine.rotor2.ingang, machine.rotor2.engang);
        const [ingang3, engang3] = rotate(machine.rotor3.ingang, machine.rotor3.engang);
        return {
            ...machine,
            rotor2: {
                ...machine.rotor2,
                ingang: ingang2,
                engang: engang2,
            },
            rotor3: {
                ...machine.rotor3,
                ingang: ingang3,
                engang: engang3,
            },
        };
    }
    else {
        const [ingang3, engang3] = rotate(machine.rotor3.ingang, machine.rotor3.engang);
        return {
            ...machine,
            rotor3: {
                ...machine.rotor3,
                ingang: ingang3,
                engang: engang3,
            },
        };
    }
};

export const getSignal = (
    ingang: string[],
    engang: string[],
    signal: number,
    backward: boolean = false
): number => (
    backward
        ? engang.indexOf(ingang[signal])
        : ingang.indexOf(engang[signal])
);

export const getEncryptedLetter = (machine: Machine, letter: string): string => {
    const { rotor1, rotor2, rotor3, reflector, plugboard } = machine;
    const keyboard = getKeyboard();
    /**
     * Sequence of electrical signal travel route:
     * 1. Keyboard
     * 2. Plugboard input -> output
     * 3. Rotor 3 output -> input
     * 4. Rotor 2 output -> input
     * 5. Rotor 1 output -> input
     * 6. Reflector output -> input
     * 7. Rotor 1 input -> output
     * 8. Rotor 2 input -> output
     * 9. Rotor 3 input -> output
     * 10. Plugboard output -> input
     * 11. Light bulbs
     */
    const kbSignal = keyboard.indexOf(letter);
    const pbSignal = getSignal(plugboard.ingang, plugboard.engang, kbSignal, true);
    const r3Signal = getSignal(rotor3.ingang, rotor3.engang, pbSignal);
    const r2Signal = getSignal(rotor2.ingang, rotor2.engang, r3Signal);
    const r1Signal = getSignal(rotor1.ingang, rotor1.engang, r2Signal);
    const refSignal = getSignal(reflector.ingang, reflector.engang, r1Signal);
    const r1SignalBack = getSignal(rotor1.ingang, rotor1.engang, refSignal, true);
    const r2SignalBack = getSignal(rotor2.ingang, rotor2.engang, r1SignalBack, true);
    const r3SignalBack = getSignal(rotor3.ingang, rotor3.engang, r2SignalBack, true);
    const pbSignalBack = getSignal(plugboard.ingang, plugboard.engang, r3SignalBack, true);

    return keyboard[pbSignalBack];
};

/**
 * returns [
 *      encryptedMessage,
 *      rotor1 display letter,
 *      rotor2 display letter,
 *      rotor3 display letter,
 * ]
 */
export const getEncryptedMessage = (machine: Machine, message: string): string[] => {
    const output = message.split('').map((letter) => {
        machine = { ...getRotatedMachine(machine) };
        return getEncryptedLetter(machine, letter);
    });

    return [
        output.join(''),
        machine.rotor1.ingang[0],
        machine.rotor2.ingang[0],
        machine.rotor3.ingang[0],
    ];
};

export const run = (config: Config, message: string): string[] => {
    const configuredMachine = getConfiguredMachine(config);
    return getEncryptedMessage(configuredMachine, message);
};


