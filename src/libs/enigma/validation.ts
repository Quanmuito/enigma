import type { Config, RotorData, ReflectorData } from './types';
import { KEYBOARD } from './constants';
import rotorDataList from './data/rotors.json';
import reflectorDataList from './data/reflectors.json';
import { InvalidConfigError } from './errors';

export function validateRotorName(name: string): boolean {
    return (rotorDataList as RotorData[]).some((r) => r.name === name);
}

export function validateReflectorName(name: string): boolean {
    return (reflectorDataList as ReflectorData[]).some((r) => r.name === name);
}

export function validateRingSetting(ring: string): boolean {
    if (ring.length !== 3) {
        return false;
    }
    return ring.split('').every((char) => KEYBOARD.includes(char));
}

export function validateStartSetting(start: string): boolean {
    if (start.length !== 3) {
        return false;
    }
    return start.split('').every((char) => KEYBOARD.includes(char));
}

export function validateConfig(config: Config): void {
    if (!config.rotors || config.rotors.length !== 3) {
        throw new InvalidConfigError('Rotors must be an array of exactly 3 rotor names');
    }

    for (const rotorName of config.rotors) {
        if (!validateRotorName(rotorName)) {
            throw new InvalidConfigError(`Invalid rotor name: "${rotorName}"`);
        }
    }

    if (!validateReflectorName(config.reflector)) {
        throw new InvalidConfigError(`Invalid reflector name: "${config.reflector}"`);
    }

    if (!validateRingSetting(config.ring)) {
        throw new InvalidConfigError(`Invalid ring setting: "${config.ring}". Must be 3 uppercase letters`);
    }

    if (!validateStartSetting(config.start)) {
        throw new InvalidConfigError(`Invalid start setting: "${config.start}". Must be 3 uppercase letters`);
    }

    if (typeof config.plugboard !== 'string') {
        throw new InvalidConfigError('Plugboard must be a string');
    }
}
