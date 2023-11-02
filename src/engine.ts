import { Gear, Plugboard } from 'types';

export const getPlugboardSignal = (plugboard: Plugboard, signal: number, isBackward: boolean = false): number => {
    if (isBackward) {
        let letter = plugboard.output[signal];
        return plugboard.entry.indexOf(letter);
    }

    let letter = plugboard.entry[signal];
    return plugboard.output.indexOf(letter);
};

