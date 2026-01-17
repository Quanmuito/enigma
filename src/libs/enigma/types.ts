/**
 * Configuration for an Enigma machine
 */
export type Config = {
    /** Array of 3 rotor names (e.g., ["I", "II", "III"]) */
    rotors: string[],
    /** Reflector name (e.g., "UKW-B") */
    reflector: string,
    /** Ring setting - 3 uppercase letters (e.g., "AAA") */
    ring: string,
    /** Start position - 3 uppercase letters (e.g., "AAA") */
    start: string,
    /** Plugboard settings - space-separated pairs (e.g., "AB CD EF") */
    plugboard: string,
};

/**
 * Daily settings data structure from JSON
 */
export type DailySettingData = {
    date: number,
    rotors: string,
    ring: string,
    start: string,
    plugboard: string,
};

/**
 * Rotor data structure from JSON
 */
export type RotorData = {
    name: string,
    notch: string,
    wiring: string,
};

/**
 * Reflector data structure from JSON
 */
export type ReflectorData = {
    name: string,
    wiring: string,
};

/**
 * Rotor component with input and output arrays
 */
export type Rotor = {
    /** Notch position for double-stepping */
    notch: string,
    /** Input array (alphabet) */
    ingang: string[],
    /** Output array (wired mapping) */
    engang: string[],
};

/**
 * Reflector component with input and output arrays
 */
export type Reflector = {
    /** Input array (alphabet) */
    ingang: string[],
    /** Output array (wired mapping) */
    engang: string[],
};

/**
 * Plugboard component with input and output arrays
 */
export type Plugboard = {
    /** Input array (alphabet) */
    ingang: string[],
    /** Output array (swapped mapping) */
    engang: string[],
};

/**
 * Complete Enigma machine state
 */
export type Machine = {
    reflector: Reflector,
    rotor1: Rotor,
    rotor2: Rotor,
    rotor3: Rotor,
    plugboard: Plugboard,
};
