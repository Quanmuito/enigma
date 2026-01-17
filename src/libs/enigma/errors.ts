export class EnigmaError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'EnigmaError';
        Object.setPrototypeOf(this, EnigmaError.prototype);
    }
}

export class RotorNotFoundError extends EnigmaError {
    constructor(rotorName: string) {
        super(`Rotor "${rotorName}" not found in rotor data`);
        this.name = 'RotorNotFoundError';
        Object.setPrototypeOf(this, RotorNotFoundError.prototype);
    }
}

export class ReflectorNotFoundError extends EnigmaError {
    constructor(reflectorName: string) {
        super(`Reflector "${reflectorName}" not found in reflector data`);
        this.name = 'ReflectorNotFoundError';
        Object.setPrototypeOf(this, ReflectorNotFoundError.prototype);
    }
}

export class InvalidConfigError extends EnigmaError {
    constructor(message: string) {
        super(`Invalid configuration: ${message}`);
        this.name = 'InvalidConfigError';
        Object.setPrototypeOf(this, InvalidConfigError.prototype);
    }
}

export class InvalidDateError extends EnigmaError {
    constructor(date: number, maxDate: number) {
        super(`Date index ${date} is out of bounds. Valid range: 0-${maxDate}`);
        this.name = 'InvalidDateError';
        Object.setPrototypeOf(this, InvalidDateError.prototype);
    }
}
