import React, { useReducer } from 'react';
import { getTodayAppState } from 'enigma';
import {
    reducer,
    ACTION_MESSAGE,
    ACTION_PLUGBOARD_SETTINGS,
    ACTION_RING_SETTINGS,
    ACTION_START_SETTINGS
} from 'reducer';
import { SelectMotor, InputSetting } from 'components';
import { VERSION, isEmpty } from 'global';

export default function App() {
    const [state, dispatch] = useReducer(reducer, getTodayAppState());

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
                                    value={ state.referenceMachine.reflector.name }
                                    dispatch={ dispatch }
                                />
                                <SelectMotor
                                    id="rotor-1"
                                    value={ state.referenceMachine.rotor1.name }
                                    dispatch={ dispatch }
                                />
                                <SelectMotor
                                    id="rotor-2"
                                    value={ state.referenceMachine.rotor2.name }
                                    dispatch={ dispatch }
                                />
                                <SelectMotor
                                    id="rotor-3"
                                    value={ state.referenceMachine.rotor3.name }
                                    dispatch={ dispatch }
                                />
                            </div>

                            <br />
                            <InputSetting
                                id={ 'ring-settings' }
                                value={ state.setting.ringSettings }
                                error={ state.setting.ringError }
                                example={ 'Example: ABC, DHK, QMT, etc.' }
                                type={ ACTION_RING_SETTINGS }
                                dispatch={ dispatch }
                            />

                            <br />
                            <InputSetting
                                id={ 'plugboard-settings' }
                                value={ state.setting.plugboardSettings }
                                error={ state.setting.plugboardError }
                                example={ 'Example: AO HI MU SN WX ZQ' }
                                type={ ACTION_PLUGBOARD_SETTINGS }
                                dispatch={ dispatch }
                            />

                            <br />
                            <InputSetting
                                id={ 'start-settings' }
                                value={ state.setting.startSettings }
                                error={ state.setting.startError }
                                example={ 'Example: ABC, DHK, QMT, etc.' }
                                type={ ACTION_START_SETTINGS }
                                dispatch={ dispatch }
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
                                    className={ 'form-control ' + (isEmpty(state.message.error) ? '' : 'is-invalid') }
                                    id="message"
                                    onChange={ (event) => dispatch({
                                        type: ACTION_MESSAGE,
                                        payload: {
                                            value: event.target.value,
                                        },
                                    }) }
                                    value={ state.message.entry }
                                />
                                <div className="invalid-feedback">{ state.message.error }</div>
                            </div>
                            <br /><br />
                            <div className="container text-center">
                                <div className="row justify-content-center">
                                    <div className="col-4 p-3 bg-body-secondary rounded-5">
                                        <h1>{ state.displayMachine.rotor1.entry[0] }</h1>
                                    </div>
                                    <div className="col-4 p-3 bg-dark-subtle rounded-5">
                                        <h1>{ state.displayMachine.rotor2.entry[0] }</h1>
                                    </div>
                                    <div className="col-4 p-3 bg-body-secondary rounded-5">
                                        <h1>{ state.displayMachine.rotor3.entry[0] }</h1>
                                    </div>
                                </div>
                                <div className="row justify-content-center" style={ { overflowWrap: 'break-word' } }>
                                    <br /><br />
                                    MESSAGE: <br />
                                    <h2>{ state.message.entry }</h2>
                                    <br /><br />
                                    OUTPUT: <br />
                                    <h2>{ state.message.output }</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <footer className="d-flex flex-column align-items-center justify-content-center">
                <h5>{ 'QuanMuiTo@' + new Date().getFullYear() }</h5>
                <span className="text-muted">{ VERSION }</span>
            </footer>
        </div>
    );
}
