import React from 'react';
import { capitalizeFirstLetter, isEmpty } from 'global';
import { Action } from 'types';
import { ACTION_PLUGBOARD_SETTINGS } from 'reducer';

type InputSettingState = {
    id: string,
    value: string,
    error: string,
    example: string,
    type: string,
    dispatch: React.Dispatch<Action>
}

export const InputSetting = ({ id, value, error, example, type, dispatch }: InputSettingState) => {
    const label: string = id.split('-').map((word) => capitalizeFirstLetter(word)).join(' ');
    const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const action: Action = {
            type: type,
            payload: {
                value: event.target.value,
            },
        };
        dispatch(action);
    };

    return (
        <div className={ (type === ACTION_PLUGBOARD_SETTINGS) ? 'col' : 'col-md-6' }>
            <label
                className="form-label"
                htmlFor={ id }
            >
                { label }
            </label>
            <input
                className={ 'form-control ' + (isEmpty(error) ? '' : 'is-invalid') }
                type="text"
                id={ id }
                onChange={ onChange }
                value={ value }
            />
            <div className="form-text" id="basic-addon4">{ example }</div>
            <div className="invalid-feedback">{ error }</div>
        </div>
    );
};
