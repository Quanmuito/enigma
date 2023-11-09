import React from 'react';
import { EnigmaI } from 'data';
import { capitalizeFirstLetter } from 'global';
import { Action } from 'types';
import { ACTION_MACHINE_SETTINGS } from 'reducer';

type SelectRotorState = {
    id: string,
    value: string,
    dispatch: React.Dispatch<Action>,
}

export const SelectMotor = ({ id, value, dispatch }: SelectRotorState) => {
    const label: string = capitalizeFirstLetter(id).replace('-', ' ');
    const onChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        const action: Action = {
            type: ACTION_MACHINE_SETTINGS,
            payload: {
                value: event.target.value,
                id: id,
            },
        };
        dispatch(action);
    };

    return (
        <div className="col-lg-3 col-md-6">
            <label className="form-label" htmlFor={ id }>{ label }</label>
            <select
                className="form-select"
                id={ id }
                value={ value }
                onChange={ onChange }
            >
                {
                    (id === 'reflector')
                        ? EnigmaI.reflectors.map((reflector) =>
                            <option key={ reflector.name } value={ reflector.name }>{ reflector.name }</option>
                        )
                        : EnigmaI.rotors.map((rotor) =>
                            <option key={ rotor.name } value={ rotor.name }>{ rotor.name }</option>
                        )
                }
            </select>
        </div>
    );
};
