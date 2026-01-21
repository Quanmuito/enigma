import React, { useState, useRef, useCallback } from 'react';
import { Config } from 'libs/enigma';
import { validatePlugboardSetting, validateRotorSetting } from 'libs/validation';
import { AppState } from 'types';

type FieldType = {
    reflector: string,
    rotor1: string,
    rotor2: string,
    rotor3: string,
    ring: string,
    start: string,
    plugboard: string,
}

type ErrorsType = {
    ring?: string,
    start?: string,
    plugboard?: string,
}

export function useConfigForm(config: Config, setAppState: React.Dispatch<React.SetStateAction<AppState>>) {
    const initialValues = useRef<FieldType>({
        reflector: config.reflector,
        rotor1: config.rotors[0],
        rotor2: config.rotors[1],
        rotor3: config.rotors[2],
        ring: config.ring,
        start: config.start,
        plugboard: config.plugboard,
    });

    const [values, setValues] = useState<FieldType>(initialValues.current);

    const [errors, setErrors] = useState<ErrorsType>({});

    const handleChange = useCallback((field: keyof FieldType, value: string) => {
        setValues((prev) => ({ ...prev, [field]: value }));

        if (field === 'ring' || field === 'start') {
            const error = validateRotorSetting(value);
            setErrors((prev) => ({ ...prev, [field]: error || undefined }));
        } else if (field === 'plugboard') {
            const error = validatePlugboardSetting(value);
            setErrors((prev) => ({ ...prev, [field]: error || undefined }));
        }
    }, []);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();

        const ringError = validateRotorSetting(values.ring);
        const startError = validateRotorSetting(values.start);
        const plugboardError = validatePlugboardSetting(values.plugboard);

        if (ringError || startError || plugboardError) {
            setErrors({
                ring: ringError || undefined,
                start: startError || undefined,
                plugboard: plugboardError || undefined,
            });
            return;
        }

        const newConfig = {
            reflector: values.reflector,
            rotors: [values.rotor1, values.rotor2, values.rotor3],
            ring: values.ring,
            start: values.start,
            plugboard: values.plugboard,
        };

        setAppState({
            config: { ...newConfig },
            showMachine: true,
        });
    }, [values, setAppState]);

    const handleReset = useCallback(() => {
        setValues(initialValues.current);
        setErrors({});
    }, []);

    return {
        values,
        errors,
        handleChange,
        handleSubmit,
        handleReset,
    };
}
