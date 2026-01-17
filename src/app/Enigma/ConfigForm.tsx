import React from 'react';
import { Config } from 'libs/enigma';
import { validatePlugboardSetting, validateRotorSetting } from 'libs/validation';
import { AppState } from 'types';
import { getTodayDate } from 'libs/utils';

type FieldType = {
    reflector: string,
    rotor1: string,
    rotor2: string,
    rotor3: string,
    ring: string,
    start: string,
    plugboard: string,
}

type ConfigFormPropsType = {
    config: Config,
    setAppState: React.Dispatch<React.SetStateAction<AppState>>
}
export default function ConfigForm({ config, setAppState }: ConfigFormPropsType) {
    const initialValues: FieldType = {
        reflector: config.reflector,
        rotor1: config.rotors[0],
        rotor2: config.rotors[1],
        rotor3: config.rotors[2],
        ring: config.ring,
        start: config.start,
        plugboard: config.plugboard,
    };

    function onFinish(values: FieldType) {
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
    }

    function onFinishFailed() {
        alert('Invalid input');
    }

    return (
        <div className="form-container">
            <img alt="config-sheet" src="https://www.101computing.net/wp/wp-content/uploads/enigma-code-book.png" />
        </div>
    );
}

function valueToUpperCase(event: React.ChangeEvent<HTMLInputElement>) {
    event.target.value = event.target.value.toUpperCase();
}

function renderButton(name: string) {
    return function _renderButton(option: string) {
        const key = `${name}-${option}`;

        return (
            <></>
        );
    };
}

