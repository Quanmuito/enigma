export const DEFAULT_KEYBOARD = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const NUMBERS = '1234567890';
export const SPECIAL_CHARACTERS = '!@#$%^&*()-_=+[]{};:"|`~,./<>?';
export const SUPPORTED_CHARACTERS = DEFAULT_KEYBOARD + NUMBERS + SPECIAL_CHARACTERS;
export const TYPE_BOTH = 'BOTH';
export const TYPE_RING = 'RING';
export const TYPE_START = 'START';

export const isEmpty = (string: string): boolean => {
    return (string === '') || (string === ' ');
};

export const isEncryptable = (char: string): boolean => {
    return DEFAULT_KEYBOARD.includes(char);
};

export const isNumber = (char: string): boolean => {
    return NUMBERS.includes(char);
};

export const isSpecialCharacter = (char: string): boolean => {
    return SPECIAL_CHARACTERS.includes(char);
};

export const isSupportedCharacter = (char: string): boolean => {
    return SUPPORTED_CHARACTERS.includes(char);
};
