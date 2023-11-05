import {
    isEmpty,
    isEncryptable,
    isSupportedCharacter
} from 'global';

export const validatePlugboardSettingsInput = (input: string): string => {
    if (!isEmpty(input)) {
        input.trim();

        let invalidChar = getInvalidCharacter(input);
        if (invalidChar.length > 0) {
            return 'Contain not supported character(s): ' + invalidChar.join(' ');
        }

        let duplicateChar = getDuplicatedCharacter(input);
        if (duplicateChar.length > 0) {
            return 'A character cannot be swapped twice: ' + duplicateChar.join(' ');
        }

        if (!input.split(' ').every((pair) => isEmpty(pair) || pair.length === 2)) {
            return 'A letter pair should have 2 characters';
        }
    }
    return '';
};

export const validateRotorSettingsInput = (input: string): string => {
    let invalidChar = getInvalidCharacter(input);
    if (invalidChar.length > 0) {
        return 'Contain not supported character(s): ' + invalidChar.join(' ');
    }

    if (input.length !== 3) {
        return 'Invalid setting. Should contain 3 characters.';
    }

    return '';
};

export const validateMessage = (input: string): string => {
    if (!isEmpty(input)) {
        let invalidChar = getInvalidCharacter(input);
        if (invalidChar.length > 0) {
            return 'Contain not supported character(s): ' + invalidChar.join(' ');
        }
    }

    return '';
};

const getInvalidCharacter = (input: string): string[] => {
    return input.split('').filter((char) => !isEmpty(char) && !isSupportedCharacter(char));
};

const getDuplicatedCharacter = (input: string): string[] => {
    return input.split('').filter((char, index) => {
        if (!isEncryptable(char)) {
            return false;
        }
        return input.indexOf(char) !== index;
    });
};
