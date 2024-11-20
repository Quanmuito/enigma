export const validateSettingInput = (type: string, input: string): string => {
    // switch (type) {
    //     case ACTION_PLUGBOARD_SETTINGS: {
    //         if (isEmpty(input)) {
    //             return '';
    //         }

    //         input.trim();
    //         let invalidChar = getInvalidCharacterForSetting(input);
    //         if (invalidChar.length > 0) {
    //             return 'Contain invalid character(s): ' + invalidChar.join(' ');
    //         }

    //         let duplicateChar = getDuplicatedCharacter(input);
    //         if (duplicateChar.length > 0) {
    //             return 'A character cannot be swapped twice: ' + duplicateChar.join(' ');
    //         }

    //         if (!input.split(' ').every((pair) => isEmpty(pair) || pair.length === 2)) {
    //             return 'A letter pair should have 2 characters';
    //         }

    //         return '';
    //     }

    //     case ACTION_RING_SETTINGS:
    //     case ACTION_START_SETTINGS: {
    //         input.trim();
    //         let invalidChar = getInvalidCharacterForSetting(input);
    //         if (invalidChar.length > 0) {
    //             return 'Contain invalid character(s): ' + invalidChar.join(' ');
    //         }

    //         if (input.length !== 3) {
    //             return 'Should contain 3 characters.';
    //         }

    //         return '';
    //     }

    //     case ACTION_MESSAGE: {
    //         if (!isEmpty(input)) {
    //             let invalidChar = getInvalidCharacter(input);
    //             if (invalidChar.length > 0) {
    //                 return 'Contain not supported character(s): ' + invalidChar.join(' ');
    //             }
    //         }

    //         return '';
    //     }

    //     default:
    //         return '';
    // }
    return '';
};

// const getInvalidCharacter = (input: string): string[] => {
//     return input.split('').filter((char) => !isEmpty(char) && !isSupportedCharacter(char));
// };

// const getInvalidCharacterForSetting = (input: string): string[] => {
//     return input.split('').filter((char) => !isEmpty(char) && !isEncryptable(char));
// };

// const getDuplicatedCharacter = (input: string): string[] => {
//     return input.split('').filter((char, index) => {
//         if (!isEncryptable(char)) {
//             return false;
//         }
//         return input.indexOf(char) !== index;
//     });
// };
