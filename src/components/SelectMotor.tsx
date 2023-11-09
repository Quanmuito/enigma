import React from 'react';
import { EnigmaI } from 'data';
import { capitalizeFirstLetter } from 'global';

type SelectRotorState = {
    id: string,
    value: string,
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

export default function SelectMotor({ id, value, onChange }: SelectRotorState) {
    const label: string = capitalizeFirstLetter(id).replace('-', ' ');

    return (
        <div className="col-md-3 col-sm-6">
            <label className="form-label" htmlFor={ id }>{ label }</label>
            <select
                className="form-select"
                id={ id }
                value={ value }
                onChange={ onChange }
            >
                {
                    (id === 'reflector')
                        ? EnigmaI.reflectors.map(
                            (reflector) => <option key={ reflector.name } value={ reflector.name }>{ reflector.name }</option>
                        )
                        : EnigmaI.rotors.map(
                            (rotor) => <option key={ rotor.name } value={ rotor.name }>{ rotor.name }</option>
                        )
                }
            </select>
        </div>
    );
}
