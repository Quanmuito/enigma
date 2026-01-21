import { KEYBOARD_STRING } from 'libs/enigma/constants';

const isEncryptable = (char: string): boolean => {
    return KEYBOARD_STRING.includes(char);
};

const getInvalidCharacterForSetting = (input: string): string[] => {
    const uniqueInvalidChars = new Set<string>();
    for (const char of input) {
        if (char !== ' ' && !isEncryptable(char)) {
            uniqueInvalidChars.add(char);
        }
    }
    return Array.from(uniqueInvalidChars);
};

const getDuplicatedCharacter = (input: string): string[] => {
    const seen = new Set<string>();
    const duplicates = new Set<string>();
    for (const char of input) {
        if (isEncryptable(char)) {
            if (seen.has(char)) {
                duplicates.add(char);
            } else {
                seen.add(char);
            }
        }
    }
    return Array.from(duplicates);
};

export function validatePlugboardSetting(input: string): string {
    input = input.trim();
    if (input === '') {
        return '';
    }

    const invalidChar = getInvalidCharacterForSetting(input);
    if (invalidChar.length > 0) {
        return 'Contain invalid character(s): ' + invalidChar.join(' ');
    }

    const duplicateChar = getDuplicatedCharacter(input);
    if (duplicateChar.length > 0) {
        return 'A character cannot be swapped twice: ' + duplicateChar.join(' ');
    }

    const pairs = input.split(' ');
    if (!pairs.every((pair) => pair === '' || pair.length === 2)) {
        return 'A letter pair should have 2 characters';
    }

    return '';
}

export function validateRotorSetting(input: string): string {
    input = input.trim();
    const invalidChar = getInvalidCharacterForSetting(input);
    if (invalidChar.length > 0) {
        return 'Contain invalid character(s): ' + invalidChar.join(' ');
    }

    if (input.length !== 3) {
        return 'Should contain 3 characters.';
    }

    return '';
}

