export const validatePlugboardSettingsInput = (input: string): boolean => {
    if (input === '') {
        return true;
    }

    let inputArray = input.trim().split(' ');
    if (inputArray.length < 1) {
        return false;
    }
    for (let i = 0; i < inputArray.length; i++) {
        let element = inputArray[i];
        if (element.length !== 2) {
            return false;
        }
    }
    return true;
};
