import { Gear, Plugboard } from 'types';

/** Swap position of 2 specified letters */
export const plug = (plugboard: Plugboard, letterPairs: string[]): Plugboard => {
    letterPairs.forEach(
        (letterPair: string) => {
            let letterArray = letterPair.split('');
            let letter_1: string = letterArray[0];
            let letter_2: string = letterArray[1];

            let pos_1 = plugboard.entry.indexOf(letter_1);
            let pos_2 = plugboard.entry.indexOf(letter_2);

            plugboard.output[pos_1] = letter_2;
            plugboard.output[pos_2] = letter_1;
        }
    );

    return plugboard;
};

export const adjustRing = (gear: Gear, ringPosition: number): Gear => {
    let i = 0;
    while (i < ringPosition) {
        /** Shift the letter in `shuffled` up by 1. Eg: A -> B, E -> F */
        gear.shuffled = gear.shuffled.map(
            (letter: string) => {
                let letterPos = gear.original.indexOf(letter);
                let shiftedLetterPos = letterPos + 1;
                return gear.original[(gear.original.length + shiftedLetterPos) % gear.original.length];
            }
        );
        /** Rotate backward */
        let shuffledLastLetter = gear.shuffled[gear.original.length - 1];
        gear.shuffled.pop();
        gear.shuffled.unshift(shuffledLastLetter);
        i++;
    }

    return gear;
};

export const rotateGear = (gear: Gear, rounds: number = 1): Gear => {
    let i = 0;
    while (i < rounds) {
        let originalFirstLetter = gear.original[0];
        gear.original.shift();
        gear.original.push(originalFirstLetter);

        let shuffledFirstLetter = gear.shuffled[0];
        gear.shuffled.shift();
        gear.shuffled.push(shuffledFirstLetter);
        i++;
    }
    return gear;
};
