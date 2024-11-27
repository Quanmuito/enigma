export type Config = {
    rotors: string[],
    reflector: string,
    ring: string,
    start: string,
    plugboard: string,
};

export type RotorData = {
    name: string,
    notch: string,
    wiring: string,
};

export type ReflectorData = {
    name: string,
    wiring: string,
};

export type Rotor = {
    notch: string,
    ingang: string[],
    engang: string[],
};

export type Reflector = {
    ingang: string[],
    engang: string[],
};

export type Plugboard = {
    ingang: string[],
    engang: string[],
};

export type Machine = {
    reflector: Reflector,
    rotor1: Rotor,
    rotor2: Rotor,
    rotor3: Rotor,
    plugboard: Plugboard,
};
