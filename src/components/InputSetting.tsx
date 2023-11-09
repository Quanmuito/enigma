import React from 'react';
import { capitalizeFirstLetter, isEmpty } from 'global';
import { Action } from 'types';


type InputSettingState = {
    id: string,
    value: string,
    error: string,
    example: string,
    type: string,
    dispatch: React.Dispatch<Action>
}

export default function InputSetting({ id, value, error, example, type, dispatch }: InputSettingState) {
    const label: string = id.split('-').map((word) => capitalizeFirstLetter(word)).join(' ');

    return (
        <div className="row">
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
                onChange={ (event) => dispatch({
                    type: type,
                    payload: {
                        value: event.target.value,
                    },
                }) }
                value={ value }
            />
            <div className="form-text" id="basic-addon4">{ example }</div>
            <div className="invalid-feedback">{ error }</div>
        </div>
    );
}
