import React from 'react';
import type { FormProps } from 'antd';
import { Radio, Button, Form, Input } from 'antd';
import { Config } from 'enigma';
import { validatePlugboardSetting, validateRotorSetting } from 'validation';
import { AppState } from 'types';
import { getTodayDate } from 'utils';

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

    const onFinish: FormProps<FieldType>['onFinish'] = (values: FieldType) => {
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
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (_) => {
        alert('Invalid input');
    };

    return (
        <div className="form-container">
            <Form
                name="configForm"
                initialValues={ initialValues }
                onFinish={ onFinish }
                onFinishFailed={ onFinishFailed }
                autoComplete="off"
                labelCol={ { span: 4 } }
                wrapperCol={ { span: 20 } }
            >
                <div className="form-control align-center" style={ { height: '10vh' } }>
                    <h3>Adjust settings for the Enigma machine</h3>
                    <p>You can customize your own setting or follow the Code Book</p>
                    <p>Today: { getTodayDate() }</p>
                </div>
                { /* Select reflector */ }
                <Form.Item<FieldType>
                    label="REFLECTOR"
                    name="reflector"
                    className="form-control"
                >
                    <Radio.Group block>
                        { ['UKW-A', 'UKW-B', 'UKW-C'].map(renderButton('reflector')) }
                    </Radio.Group>
                </Form.Item>

                { /* Select rotor 1 */ }
                <Form.Item<FieldType>
                    label="ROTOR 1"
                    name="rotor1"
                    className="form-control"
                >
                    <Radio.Group block>
                        { ['I', 'II', 'III', 'IV', 'V'].map(renderButton('rotor1')) }
                    </Radio.Group>
                </Form.Item>

                { /* Select rotor 2 */ }
                <Form.Item<FieldType>
                    label="ROTOR 2"
                    name="rotor2"
                    className="form-control"
                >
                    <Radio.Group block>
                        { ['I', 'II', 'III', 'IV', 'V'].map(renderButton('rotor2')) }
                    </Radio.Group>
                </Form.Item>

                { /* Select rotor 3 */ }
                <Form.Item<FieldType>
                    label="ROTOR 3"
                    name="rotor3"
                    className="form-control"
                >
                    <Radio.Group block>
                        { ['I', 'II', 'III', 'IV', 'V'].map(renderButton('rotor3')) }
                    </Radio.Group>
                </Form.Item>

                <div style={ { display: 'flex', justifyContent: 'space-between' } }>
                    { /* Input rings setting */ }
                    <Form.Item<FieldType>
                        label="RINGS"
                        name="ring"
                        className="form-control"
                        rules={ [{
                            validator(_, value: string) {
                                return new Promise((resolve, reject) => {
                                    const message = validateRotorSetting(value);
                                    (message === '') ? resolve('') : reject(message);
                                });
                            },
                        }] }
                    >
                        <Input maxLength={ 3 } onInput={ valueToUpperCase } />
                    </Form.Item>

                    { /* Input rings setting */ }
                    <Form.Item<FieldType>
                        label="START"
                        name="start"
                        className="form-control"
                        rules={ [{ message: 'Input start settings!' }] }
                    >
                        <Input maxLength={ 3 } onInput={ valueToUpperCase } />
                    </Form.Item>
                </div>

                { /* Input plugboard setting */ }
                <Form.Item<FieldType>
                    label="PLUGBOARD"
                    name="plugboard"
                    className="form-control"
                    rules={ [{
                        validator(_, value: string) {
                            return new Promise((resolve, reject) => {
                                const message = validatePlugboardSetting(value);
                                (message === '') ? resolve('') : reject(message);
                            });
                        },
                    }] }
                >
                    <Input onInput={ valueToUpperCase } />
                </Form.Item>

                { /* Submit */ }
                <Button
                    type="primary"
                    htmlType="submit"
                    className="form-control align-center"
                >
                    <h5><strong>ASSEMBLE ENIGMA MACHINE</strong></h5>
                </Button>
            </Form>
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
            <Radio.Button
                key={ key }
                id={ key }
                value={ option }
            >
                { option.toUpperCase() }
            </Radio.Button>
        );
    };
}

