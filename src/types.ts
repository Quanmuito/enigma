export type Rotor = {
    name: string,
    wiring: string,
    notch: string,
}

export type Gear = {
    original: string[],
    shuffled: string[],
    notch: string,
}

export type Reflector = {
    name: string,
    wiring: string,
}

export type Plugboard = {
    entry: string[],
    output: string[],
}

export type StringSettings = {
    settings: string,
    valid: boolean,
}

export type Enigma = {
    name: string,
    usage: string,
    description: string,
    date: string,
    keyboard: string,
    rotors: Rotor[],
    reflectors: Reflector[]
}
