import React, { useState } from 'react';
import { EnigmaI } from 'data';
import {
    Message,
    Motor,
    Plugboard,
    RotorSettings
} from 'types';
import {
    getTodayRingState,
    getTodayStartState,
    getTodayMotorState,
    getTodayPlugboardState,
    getMotor,
    getRotorByName,
    getReflectorByName,
    plug,
    adjustRing,
    rotateToLetter,
    rotateOnNotch,
    getPlugboardSignal,
    getMotorSignal,
    getRotor,
    applyStartSettings,
    applyRingSettings
} from 'enigma';
import {
    validateMessage,
    validateRotorSettingsInput,
    validatePlugboardSettingsInput
} from 'validation';
import { DEFAULT_KEYBOARD, TYPE_BOTH, TYPE_RING, TYPE_START } from 'global';

function App() {
    /**
     * Control the state of reference motor.
     * This state get settings from #motor-settings to create a reference with factory default data
     */
    const [referenceMotor, setReferenceMotor] = useState<Motor>(getTodayMotorState());

    /**
     * Control the state of the motor that use to encrypt the message.
     * This state copy the value of `referenceMotor` then apply `rings` and `starts` settings.
     */
    const [encryptMotor, setEncryptMotor] = useState<Motor>(getTodayMotorState());

    /**
     * Control the state of the `encryptedMotor` after being used to encrypt the message
     */
    const [displayMotor, setDisplayMotor] = useState<Motor>(getTodayMotorState());

    /** Control ring settings for rotors */
    const [ringSettings, setRingSettings] = useState<RotorSettings>(getTodayRingState());

    /** Control state of plugboard */
    const [plugboard, setPlugboard] = useState<Plugboard>(getTodayPlugboardState());

    /** Control start settings for rotors */
    const [startSettings, setStartSettings] = useState<RotorSettings>(getTodayStartState());

    /** Control input message from user */
    const [message, setMessage] = useState<Message>(
        {
            entry: '',
            output: '',
            valid: true,
        }
    );

    const applySettings = (motor: Motor, type: string, input: string = ''): void => {
        /** Apply `rings` and `starts` settings, then set to `encryptedMotor` and `displayMotor` */
        switch (type) {
            case TYPE_RING:
                applyRingSettings(motor, input);
                applyStartSettings(motor, startSettings.settings);
                break;
            case TYPE_START:
                applyRingSettings(motor, ringSettings.settings);
                applyStartSettings(motor, input);
                break;
            default:
                applyRingSettings(motor, ringSettings.settings);
                applyStartSettings(motor, startSettings.settings);
                break;
        }
        setEncryptMotor(motor);
        setDisplayMotor(motor);
    };

    const changeMotorSettings = (number: number, event: React.ChangeEvent<HTMLSelectElement>): void => {
        let newMotor = getMotor(referenceMotor);

        /** Apply change based on user selection */
        let name: string = event.target.value;
        switch (number) {
            case 0:
                newMotor.reflector = getReflectorByName(name);
                break;
            case 1:
                newMotor.rotor1 = getRotorByName(name);
                break;
            case 2:
                newMotor.rotor2 = getRotorByName(name);
                break;
            case 3:
                newMotor.rotor3 = getRotorByName(name);
                break;
            default:
                break;
        }
        setReferenceMotor(getMotor(newMotor));
        applySettings(getMotor(newMotor), TYPE_BOTH);
    };

    const changeRingSettings = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let input = event.target.value.toUpperCase();
        let isValid = validateRotorSettingsInput(input);
        if (isValid) {
            applySettings(getMotor(referenceMotor), TYPE_RING, input);
        }
        setRingSettings({ settings: input, valid: isValid });
    };

    const changePlugboardSettings = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let settingsInput = event.target.value.toUpperCase();
        let isValid = validatePlugboardSettingsInput(settingsInput);
        isValid
            ? setPlugboard({ ...plugboard, settings: settingsInput, valid: isValid, output: plug(settingsInput) })
            : setPlugboard({ ...plugboard, settings: settingsInput, valid: isValid });
    };

    const changeStartSettings = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let input = event.target.value.toUpperCase();
        let isValid = validateRotorSettingsInput(input);
        if (isValid) {
            applySettings(getMotor(referenceMotor), TYPE_START, input);
        }
        setStartSettings({ settings: input, valid: isValid });
    };

    const changeMessage = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let entry = event.target.value.toUpperCase();
        let isValid = validateMessage(entry);
        if (isValid) {
            let output = encrypt(getMotor(encryptMotor), entry);
            setMessage({ ...message, entry: entry, output: output, valid: isValid });
        } else {
            setMessage({ ...message, valid: isValid });
        }
    };

    const encrypt = (motor: Motor, entry: string): string => {
        let letters = entry.split('');
        let output = '';

        letters.forEach((letter) => {
            rotateOnNotch(motor);

            let kbSignal = DEFAULT_KEYBOARD.indexOf(letter);
            let pbSignal = getPlugboardSignal(plugboard, kbSignal);
            let motorSignal = getMotorSignal(motor, pbSignal);
            let pbBSignal = getPlugboardSignal(plugboard, motorSignal, true);
            let outputLetter = DEFAULT_KEYBOARD[pbBSignal];
            output = output + outputLetter;
        });
        setDisplayMotor(getMotor(motor));
        return output;
    };

    return (
        <div className="App">
            <div className="row" id="motor-settings">
                <div className="col">
                    <label className="form-label" htmlFor="reflector">Reflector</label>
                    <select
                        className="form-select"
                        id="reflector"
                        value={ referenceMotor.reflector.name }
                        onChange={ (event) => changeMotorSettings(0, event) }
                    >
                        {
                            EnigmaI.reflectors.map(
                                (reflector) => <option key={ reflector.name } value={ reflector.name }>{ reflector.name }</option>
                            )
                        }
                    </select>
                </div>
                <div className="col">
                    <label className="form-label" htmlFor="rotor1">Rotor 1</label>
                    <select
                        className="form-select"
                        id="rotor1"
                        value={ referenceMotor.rotor1.name }
                        onChange={ (event) => changeMotorSettings(1, event) }
                    >
                        {
                            EnigmaI.rotors.map(
                                (rotor) => <option key={ rotor.name } value={ rotor.name }>{ rotor.name }</option>
                            )
                        }
                    </select>
                </div>
                <div className="col">
                    <label className="form-label" htmlFor="rotor2">Rotor 2</label>
                    <select
                        className="form-select"
                        id="rotor2"
                        value={ referenceMotor.rotor2.name }
                        onChange={ (event) => changeMotorSettings(2, event) }
                    >
                        {
                            EnigmaI.rotors.map(
                                (rotor) => <option key={ rotor.name } value={ rotor.name }>{ rotor.name }</option>
                            )
                        }
                    </select>
                </div>
                <div className="col">
                    <label className="form-label" htmlFor="rotor3">Rotor 3</label>
                    <select
                        className="form-select"
                        id="rotor3"
                        value={ referenceMotor.rotor3.name }
                        onChange={ (event) => changeMotorSettings(3, event) }
                    >
                        {
                            EnigmaI.rotors.map(
                                (rotor) => <option key={ rotor.name } value={ rotor.name }>{ rotor.name }</option>
                            )
                        }
                    </select>
                </div>
            </div>

            <div className="row">
                <label
                    className="form-label"
                    htmlFor="ringSettings"
                >
                    Ring settings
                </label>
                <input
                    className={ 'form-control ' + (ringSettings.valid ? '' : 'is-invalid') }
                    type="text"
                    id="ringSettings"
                    onChange={ changeRingSettings }
                    value={ ringSettings.settings }
                />
                <div id="ringSettings" className="invalid-feedback">
                    Invaid ring settings. Example: ABC, DHK, QMT, etc.
                </div>
            </div>

            <div className="row">
                <label
                    className="form-label"
                    htmlFor="plugboardSettings"
                >
                    Plugboard settings
                </label>
                <input
                    className={ 'form-control ' + (plugboard.valid ? '' : 'is-invalid') }
                    type="text"
                    id="plugboardSettings"
                    onChange={ changePlugboardSettings }
                    value={ plugboard.settings }
                />
                <div id="plugboardSettings" className="invalid-feedback">
                    Invaid plugboard settings. Example: AO HI MU SN WX ZO
                </div>
            </div>

            <div className="row">
                <label
                    className="form-label"
                    htmlFor="startSettings"
                >
                    Start position settings
                </label>
                <input
                    className={ 'form-control ' + (startSettings.valid ? '' : 'is-invalid') }
                    type="text"
                    id="startSettings"
                    onChange={ changeStartSettings }
                    value={ startSettings.settings }
                />
                <div id="startSettings" className="invalid-feedback">
                    Invaid start position settings. Example: ABC or DHK, etc
                </div>
            </div>

            <div className="row">
                <label
                    className="form-label"
                    htmlFor="message"
                >
                    Input your message
                </label>
                <input
                    className={ 'form-control ' + (message.valid ? '' : 'is-invalid') }
                    type="text"
                    id="message"
                    onChange={ changeMessage }
                    value={ message.entry }
                />
                <div id="message" className="invalid-feedback">
                    Invaid character.
                </div>
            </div>

            <button type="button" className="btn btn-primary">{ displayMotor.rotor1.entry[0] }</button>
            <button type="button" className="btn btn-primary">{ displayMotor.rotor2.entry[0] }</button>
            <button type="button" className="btn btn-primary">{ displayMotor.rotor3.entry[0] }</button>
            { /* <br /><button onClick={ run }>Run</button> */ }
            <br /><br /><br />
            MESSAGE: { message.entry }
            <br /><br /><br />
            OUTPUT: { message.output }
        </div>
    );
}

export default App;
