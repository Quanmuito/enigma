import React, { useState } from 'react';
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
    isEmpty
} from 'global';
import SelectMotor from 'components/SelectMotor';
import InputSetting from 'components/InputSetting';

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

    const changeMotorSettings = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        let newMotor = getMotor(referenceMotor);

        /** Apply change based on user selection */
        let name: string = event.target.value;
        let id: string = event.target.id;
        switch (id) {
            case 'reflector':
                newMotor.reflector = getReflectorByName(name);
                break;
            case 'rotor-1':
                newMotor.rotor1 = getRotorByName(name);
                break;
            case 'rotor-2':
                newMotor.rotor2 = getRotorByName(name);
                break;
            case 'rotor-3':
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

    const changeRotorSettings = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let input: string = event.target.value.toUpperCase().trim();
        let error = validateRotorSettingsInput(input);

        let newRotorSettings = getRotorSettings(rotorSettings);
        let id: string = event.target.id;
        switch (id) {
            case 'ringSettings':
                newRotorSettings = { ...newRotorSettings, ringSettings: input, ringError: error };
                break;
            case 'startSettings':
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

    const changeMessage = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
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
            <header className="d-flex flex-column align-items-center justify-content-center">
                <h1 >Enigma I simulator</h1>
            </header>
            <section id="section-machine">
                <div className="container" style={ { marginTop: '5%' } }>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="row" id="motor-settings">
                                <SelectMotor
                                    id="reflector"
                                    value={ referenceMotor.reflector.name }
                                    onChange={ changeMotorSettings }
                                />
                                <SelectMotor
                                    id="rotor-1"
                                    value={ referenceMotor.rotor1.name }
                                    onChange={ changeMotorSettings }
                                />
                                <SelectMotor
                                    id="rotor-2"
                                    value={ referenceMotor.rotor2.name }
                                    onChange={ changeMotorSettings }
                                />
                                <SelectMotor
                                    id="rotor-3"
                                    value={ referenceMotor.rotor3.name }
                                    onChange={ changeMotorSettings }
                                />
                            </div>

                            <br />
                            <InputSetting
                                id={ 'ring-settings' }
                                value={ rotorSettings.ringSettings }
                                error={ rotorSettings.ringError }
                                example={ 'Example: ABC, DHK, QMT, etc.' }
                                onChange={ changeRotorSettings }
                            />

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
                            <InputSetting
                                id={ 'start-settings' }
                                value={ rotorSettings.startSettings }
                                error={ rotorSettings.startError }
                                example={ 'Example: ABC, DHK, QMT, etc.' }
                                onChange={ changeRotorSettings }
                            />
                        </div>
                        <div className="col-sm-6" style={ { padding: '0 5%' } }>
                            <div style={ { overflowWrap: 'break-word' } }>
                                <label
                                    className="form-label"
                                    htmlFor="message"
                                >
                                    Input your message
                                </label>
                                <textarea
                                    className={ 'form-control ' + (isEmpty(message.error) ? '' : 'is-invalid') }
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
                                <div className="row justify-content-center" style={ { overflowWrap: 'break-word' } }>
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
            <footer className="d-flex flex-column align-items-center justify-content-center">
                <h5>{ 'QuanMuiTo@' + new Date().getFullYear() }</h5>
                <span className="text-muted">v1.0.1</span>
            </footer>
        </div>
    );
}

export default App;
