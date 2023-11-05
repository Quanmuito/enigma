import { DEFAULT_KEYBOARD } from 'global';

export const validatePlugboardSettingsInput = (input: string): boolean => {
    if (input === '') {
        return true;
    }

    let inputArray = input.trim().split(' ');
    if (inputArray.length === 0) {
        return false;
    }
    for (let i = 0; i < inputArray.length; i++) {
        let letterPair = inputArray[i];

        /** Letter pair should always have 2 letters */
        if (letterPair.length !== 2) {
            return false;
        }

        let letters = letterPair.split('');
        if (!validateLetter(letters[0]) || !validateLetter(letters[1])) {
            return false;
        }
    }
    return true;
};

export const validateRotorSettingsInput = (input: string): boolean => {
    if ((input.length === 3)) {
        let letters = input.split('');
        if (validateLetter(letters[0]) && validateLetter(letters[1]) && validateLetter(letters[2])) {
            return true;
        }
    }
    return false;
};

export const validateMessage = (input: string): boolean => {
    if (input === '') {
        return true;
    }

    let letters = input.split('');
    for (let i = 0; i < letters.length; i++) {
        let letter = letters[i];
        if (letter !== '' && !validateLetter(letter)) {
            return false;
        }
    }

    return true;
};

export const validateLetter = (letter: string): boolean => {
    return DEFAULT_KEYBOARD.includes(letter);
};
