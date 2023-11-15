export const VERSION = '1.0.3';
export const KEYBOARD = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const NUMBERS = '1234567890';
export const SPECIAL_CHARACTERS = '!@#$%^&*()-_=+[]{};:\'\\"|`~,./<>?';
export const SUPPORTED_CHARACTERS = KEYBOARD + NUMBERS + SPECIAL_CHARACTERS;
export const TODAY = new Date().getDate();

export const isEmpty = (string: string): boolean => {
    return (string === '') || (string === ' ');
};

export const isEncryptable = (char: string): boolean => {
    return KEYBOARD.includes(char);
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

export const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
