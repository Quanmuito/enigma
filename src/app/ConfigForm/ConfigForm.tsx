import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfigForm } from 'hooks/useConfigForm';
import { useEnigmaOptions } from 'hooks/useEnigmaOptions';
import type { Config } from 'libs/enigma';
import type { AppState } from 'types';
import { Input } from 'components/Forms/Input';
import { Select, Option } from 'components/Forms/Select';
import styles from './style.module.css';

const ROTOR_SETTING_LENGTH = 3;

type ConfigFormPropsType = {
    config: Config,
    setAppState: React.Dispatch<React.SetStateAction<AppState>>
}

export default function ConfigForm({ config, setAppState }: ConfigFormPropsType) {
    const { t } = useTranslation();
    const { rotorOptions, reflectorOptions } = useEnigmaOptions();
    const { values, errors, handleChange, handleSubmit, handleReset } = useConfigForm(config, setAppState);
    const [imageError, setImageError] = useState(false);

    const handleUppercaseChange = useCallback((field: 'ring' | 'start' | 'plugboard', e: React.ChangeEvent<HTMLInputElement>) => {
        const upper = e.target.value.toUpperCase();
        handleChange(field, upper);
    }, [handleChange]);

    const handleReflectorChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        handleChange('reflector', e.target.value);
    }, [handleChange]);

    const handleRotor1Change = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        handleChange('rotor1', e.target.value);
    }, [handleChange]);

    const handleRotor2Change = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        handleChange('rotor2', e.target.value);
    }, [handleChange]);

    const handleRotor3Change = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        handleChange('rotor3', e.target.value);
    }, [handleChange]);

    return (
        <div className={ styles.container }>
            <h1>{ t('enigmaMachineConfiguration') }</h1>
            <h3>{ t('todaysDate') } { new Date().getDate() }</h3>
            <div className={ styles.layout }>
                <form
                    className={ styles.form }
                    onSubmit={ handleSubmit }
                    autoComplete="off"
                    aria-label="Enigma machine configuration form"
                >
                    <div className={ styles.formField }>
                        <div className={ styles.selectsRow }>
                            <div className={ styles.selectWrapper }>
                                <Select
                                    label="Reflector"
                                    name="reflector"
                                    value={ values.reflector }
                                    onChange={ handleReflectorChange }
                                >
                                    { reflectorOptions.map((option) => (
                                        <Option key={ option } value={ option }>
                                            { option }
                                        </Option>
                                    )) }
                                </Select>
                            </div>

                            <div className={ styles.selectWrapper }>
                                <Select
                                    label="Rotor 1"
                                    name="rotor1"
                                    value={ values.rotor1 }
                                    onChange={ handleRotor1Change }
                                >
                                    { rotorOptions.map((option) => (
                                        <Option key={ option } value={ option }>
                                            { option }
                                        </Option>
                                    )) }
                                </Select>
                            </div>

                            <div className={ styles.selectWrapper }>
                                <Select
                                    label="Rotor 2"
                                    name="rotor2"
                                    value={ values.rotor2 }
                                    onChange={ handleRotor2Change }
                                >
                                    { rotorOptions.map((option) => (
                                        <Option key={ option } value={ option }>
                                            { option }
                                        </Option>
                                    )) }
                                </Select>
                            </div>

                            <div className={ styles.selectWrapper }>
                                <Select
                                    label="Rotor 3"
                                    name="rotor3"
                                    value={ values.rotor3 }
                                    onChange={ handleRotor3Change }
                                >
                                    { rotorOptions.map((option) => (
                                        <Option key={ option } value={ option }>
                                            { option }
                                        </Option>
                                    )) }
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className={ styles.formField }>
                        <Input
                            label="Ring Setting (3 letters)"
                            name="ring"
                            value={ values.ring }
                            onChange={ (e) => handleUppercaseChange('ring', e) }
                            error={ errors.ring }
                            helperText="Example: AAA"
                            maxLength={ ROTOR_SETTING_LENGTH }
                        />
                    </div>

                    <div className={ styles.formField }>
                        <Input
                            label="Plugboard Pairs"
                            name="plugboard"
                            value={ values.plugboard }
                            onChange={ (e) => handleUppercaseChange('plugboard', e) }
                            error={ errors.plugboard }
                            helperText="Example: AB CD EF (space-separated pairs)"
                        />
                    </div>

                    <div className={ styles.formField }>
                        <Input
                            label="Start Position (3 letters)"
                            name="start"
                            value={ values.start }
                            onChange={ (e) => handleUppercaseChange('start', e) }
                            error={ errors.start }
                            helperText="Example: AAA"
                            maxLength={ ROTOR_SETTING_LENGTH }
                        />
                    </div>

                    <div className={ styles.formField }>
                        <button type="submit" className={ styles.button }>{ t('applyConfiguration') }</button>
                        <button type="button" onClick={ handleReset } className={ styles.button }>{ t('reset') }</button>
                    </div>
                </form>

                { !imageError && (
                    <div className={ styles.imageContainer }>
                        <img
                            alt="config-sheet"
                            src="https://www.101computing.net/wp/wp-content/uploads/enigma-code-book.png"
                            className={ styles.image }
                            onError={ () => setImageError(true) }
                        />
                    </div>
                ) }
            </div>
        </div>
    );
}

