export type Rotor = {
    name: string,
    notch: string,
    entry: string[],
    output: string[],
}

export type Reflector = {
    name: string,
    entry: string[],
    output: string[],
}

export type Plugboard = {
    entry: string[],
    output: string[],
}

export type Setting = {
    ringSettings: string,
    ringError: string,
    plugboardSettings: string,
    plugboardError: string,
    startSettings: string,
    startError: string,
}

export type Machine = {
    reflector: Reflector,
    rotor1: Rotor,
    rotor2: Rotor,
    rotor3: Rotor,
    plugboard: Plugboard,
}

export type Message = {
    entry: string,
    output: string,
    error: string,
}

export type AppState = {
    setting: Setting,
    referenceMachine: Machine,
    configuredMachine: Machine,
    displayMachine: Machine,
    message: Message,
}

export type Action = {
    type: string,
    payload: {
        value: string,
        [index: string]: string
    },
}

export type Enigma = {
    name: string,
    usage: string,
    description: string,
    date: string,
    rotors: Rotor[],
    reflectors: Reflector[]
}