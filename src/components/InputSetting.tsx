import React from 'react';
import { capitalizeFirstLetter, isEmpty } from 'global';


type InputSettingState = {
    id: string,
    value: string,
    error: string,
    example: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function InputSetting({ id, value, error, example, onChange }: InputSettingState) {
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
                onChange={ onChange }
                value={ value }
            />
            <div className="form-text" id="basic-addon4">{ example }</div>
            <div className="invalid-feedback">{ error }</div>
        </div>
    );
}
