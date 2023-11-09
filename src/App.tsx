import React, { useState } from 'react';
import { EnigmaI } from 'data';
import {
    Message,
    Motor,
    Plugboard,
    RotorSettings
} from 'types';
import {
    getTodayReferenceMotorState,
    getTodayRotorSettingsState,
    getTodayAppliedMotorState,
    getTodayPlugboardState,
    getMotor,
    getRotorByName,
    getReflectorByName,
    getRotorSettings,
    getPlugboard,
    getEncryptedMessage,
    getCurrentMotorState,
    applyRotorSettings,
    applyPlugboardSettings
} from 'enigma';
import {
    validateMessage,
    validateRotorSettingsInput,
    validatePlugboardSettingsInput
} from 'validation';
import {
    TYPE_BOTH,
    TYPE_RING,
    TYPE_START,
    isEmpty
} from 'global';

function App() {
    /**
     * Control the state of reference motor.
     * This state get settings from #motor-settings to create a reference with factory default data
     */
    const [referenceMotor, setReferenceMotor] = useState<Motor>(getTodayReferenceMotorState());

    /**
     * Control the state of the motor that use to encrypt the message.
     * This state copy the value of `referenceMotor` then apply `rings` and `starts` settings.
     */
    const [encryptMotor, setEncryptMotor] = useState<Motor>(getTodayAppliedMotorState());

    /**
     * Control the state of the `encryptedMotor` after being used to encrypt the message
     */
    const [displayMotor, setDisplayMotor] = useState<Motor>(getTodayAppliedMotorState());

    /** Control the rotor settings */
    const [rotorSettings, setRotorSettings] = useState<RotorSettings>(getTodayRotorSettingsState());

    /** Control state of plugboard */
    const [plugboard, setPlugboard] = useState<Plugboard>(getTodayPlugboardState());

    /** Control input message from user */
    const [message, setMessage] = useState<Message>(
        {
            entry: '',
            output: '',
            error: '',
        }
    );

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
        setReferenceMotor(newMotor);

        /** Apply rotor settings, then set to `encryptedMotor` and `displayMotor` */
        let appliedMotor = applyRotorSettings(newMotor, getRotorSettings(rotorSettings), TYPE_BOTH);
        setEncryptMotor(appliedMotor);
        setDisplayMotor(appliedMotor);
    };

    const changeRotorSettings = (type: string, event: React.ChangeEvent<HTMLInputElement>): void => {
        let input = event.target.value.toUpperCase().trim();
        let error = validateRotorSettingsInput(input);

        let newRotorSettings = getRotorSettings(rotorSettings);
        switch (type) {
            case TYPE_RING:
                newRotorSettings = { ...newRotorSettings, ringSettings: input, ringError: error };
                break;
            case TYPE_START:
                newRotorSettings = { ...newRotorSettings, startSettings: input, startError: error };
                break;
            default:
                break;
        }
        setRotorSettings(newRotorSettings);

        if (isEmpty(error)) {
            /** Apply rotor settings, then set to `encryptedMotor` and `displayMotor` */
            let appliedMotor = applyRotorSettings(getMotor(referenceMotor), newRotorSettings, TYPE_BOTH);
            setEncryptMotor(appliedMotor);
            setDisplayMotor(appliedMotor);
        }
    };

    const changePlugboardSettings = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let input = event.target.value.toUpperCase();
        let error = validatePlugboardSettingsInput(input);

        if (isEmpty(error)) {
            let newPlugboard = applyPlugboardSettings(getPlugboard(plugboard), input);
            setPlugboard({ ...newPlugboard, settings: input, error: error });
        } else {
            setPlugboard({ ...plugboard, settings: input, error: error });
        }
    };

    const changeMessage = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let entry = event.target.value.toUpperCase();
        let error = validateMessage(entry);

        if (isEmpty(error)) {
            let output = getEncryptedMessage(getMotor(encryptMotor), getPlugboard(plugboard), entry);
            setMessage({ ...message, entry: entry, output: output, error: error });
            setDisplayMotor(getCurrentMotorState(getMotor(encryptMotor), entry));
        } else {
            setMessage({ ...message, entry: entry, error: error });
        }
    };

    return (
        <div className="App bg-light-subtle">
            <section id="section-machine">
                <div className="container" style={ { paddingTop: '5%' } }>
                    <h1 className="text-center">Enigma I simulator</h1>

                    <div className="panel panel-default" style={ { marginTop: '5%' } }>
                        <div className="row">
                            <div className="col">
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

                                <br />

                                <div className="row">
                                    <label
                                        className="form-label"
                                        htmlFor="ringSettings"
                                    >
                                        Ring settings
                                    </label>
                                    <input
                                        className={ 'form-control ' + (isEmpty(rotorSettings.ringError) ? '' : 'is-invalid') }
                                        type="text"
                                        id="ringSettings"
                                        onChange={ (event)  => changeRotorSettings(TYPE_RING, event) }
                                        value={ rotorSettings.ringSettings }
                                    />
                                    <div className="form-text" id="basic-addon4">Example: ABC, DHK, QMT, etc.</div>
                                    <div className="invalid-feedback">{ rotorSettings.ringError }</div>
                                </div>

                                <br />

                                <div className="row">
                                    <label
                                        className="form-label"
                                        htmlFor="plugboardSettings"
                                    >
                                        Plugboard settings
                                    </label>
                                    <input
                                        className={ 'form-control ' + (isEmpty(plugboard.error) ? '' : 'is-invalid') }
                                        type="text"
                                        id="plugboardSettings"
                                        onChange={ changePlugboardSettings }
                                        value={ plugboard.settings }
                                    />
                                    <div className="form-text" id="basic-addon4">Example: AO HI MU SN WX ZQ</div>
                                    <div className="invalid-feedback">{ plugboard.error }</div>
                                </div>

                                <br />

                                <div className="row">
                                    <label
                                        className="form-label"
                                        htmlFor="startSettings"
                                    >
                                        Start position settings
                                    </label>
                                    <input
                                        className={ 'form-control ' + (isEmpty(rotorSettings.startError) ? '' : 'is-invalid') }
                                        type="text"
                                        id="startSettings"
                                        onChange={ (event)  => changeRotorSettings(TYPE_START, event) }
                                        value={ rotorSettings.startSettings }
                                    />
                                    <div className="form-text" id="basic-addon4">Example: ABC, DHK, QMT, etc.</div>
                                    <div className="invalid-feedback">{ rotorSettings.startError }</div>
                                </div>

                                <br />
                            </div>
                            <div className="col">
                                <div className="row">
                                    <label
                                        className="form-label"
                                        htmlFor="message"
                                    >
                                        Input your message
                                    </label>
                                    <input
                                        className={ 'form-control ' + (isEmpty(message.error) ? '' : 'is-invalid') }
                                        type="text"
                                        id="message"
                                        onChange={ changeMessage }
                                        value={ message.entry }
                                    />
                                    <div className="invalid-feedback">{ message.error }</div>
                                </div>
                                <br /><br />
                                <div className="container text-center">
                                    <div className="row justify-content-center">
                                        <div className="col-4 p-3 bg-body-secondary rounded-5">
                                            <h1>{ displayMotor.rotor1.entry[0] }</h1>
                                        </div>
                                        <div className="col-4 p-3 bg-dark-subtle rounded-5">
                                            <h1>{ displayMotor.rotor2.entry[0] }</h1>
                                        </div>
                                        <div className="col-4 p-3 bg-body-secondary rounded-5">
                                            <h1>{ displayMotor.rotor3.entry[0] }</h1>
                                        </div>
                                    </div>
                                    <br /><br />
                                    MESSAGE: <br />
                                    <h2>{ message.entry }</h2>
                                    <br /><br />
                                    OUTPUT: <br />
                                    <h2>{ message.output }</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="text-center">{ 'QuanMuiTo@' + new Date().getFullYear() }</div>
            <p className="text-center"><span className="text-muted">v1.0.1</span></p>
        </div>
    );
}

export default App;
