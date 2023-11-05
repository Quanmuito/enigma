export type Rotor = {
    name: string,
    notch: string,
    entry: string[],
    output: string[],
}

export type Motor = {
    rotor1: Rotor,
    rotor2: Rotor,
    rotor3: Rotor,
    reflector: Reflector,
};

export type Gear = {
    original: string[],
    shuffled: string[],
    notch: string,
}

export type Reflector = {
    name: string,
    entry: string[],
    output: string[],
}

export type Plugboard = {
    entry: string[],
    output: string[],
    settings: string,
    valid: boolean,
    error: string,
}

export type RotorSettings = {
    ringSettings: string,
    ringSettingsValid: boolean,
    ringError: string,
    startSettings: string,
    startSettingsValid: boolean,
    startError: string,
}

export type Message = {
    entry: string,
    output: string,
    valid: boolean,
    error: string,
}

export type Enigma = {
    name: string,
    usage: string,
    description: string,
    date: string,
    rotors: Rotor[],
    reflectors: Reflector[]
}
