export const KEYBOARD = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const isEmpty = (string: string): boolean => {
    return (string === '') || (string === ' ');
};

const isEncryptable = (char: string): boolean => {
    return KEYBOARD.includes(char);
};

const getInvalidCharacterForSetting = (input: string): string[] => {
    return input.split('').filter((char) => !isEmpty(char) && !isEncryptable(char));
};

const getDuplicatedCharacter = (input: string): string[] => {
    return input.split('').filter((char, index) => {
        if (!isEncryptable(char)) {
            return false;
        }
        return input.indexOf(char) !== index;
    });
};

export function validatePlugboardSetting(input: string): string {
    if (isEmpty(input)) {
        return '';
    }

    input.trim();
    const invalidChar = getInvalidCharacterForSetting(input);
    if (invalidChar.length > 0) {
        return 'Contain invalid character(s): ' + invalidChar.join(' ');
    }

    const duplicateChar = getDuplicatedCharacter(input);
    if (duplicateChar.length > 0) {
        return 'A character cannot be swapped twice: ' + duplicateChar.join(' ');
    }

    if (!input.split(' ').every((pair) => isEmpty(pair) || pair.length === 2)) {
        return 'A letter pair should have 2 characters';
    }

    return '';
}

export function validateRotorSetting(input: string): string {
    input.trim();
    const invalidChar = getInvalidCharacterForSetting(input);
    if (invalidChar.length > 0) {
        return 'Contain invalid character(s): ' + invalidChar.join(' ');
    }

    if (input.length !== 3) {
        return 'Should contain 3 characters.';
    }

    return '';
}

