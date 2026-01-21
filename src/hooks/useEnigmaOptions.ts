import { useMemo } from 'react';
import rotorsData from 'libs/enigma/data/rotors.json';
import reflectorsData from 'libs/enigma/data/reflectors.json';

export function useEnigmaOptions() {
    const rotorOptions = useMemo(
        () => rotorsData.filter((r) => r.name !== 'DEFAULT').map((r) => r.name),
        []
    );

    const reflectorOptions = useMemo(
        () => reflectorsData.filter((r) => r.name !== 'DEFAULT').map((r) => r.name),
        []
    );

    return useMemo(() => ({
        rotorOptions,
        reflectorOptions,
    }), [rotorOptions, reflectorOptions]);
}
