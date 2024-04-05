import React from 'react';

export type SelectOption = {
    label?: string
    value: string
}

type SelectPropsType = {
    id: string,
    options: React.HTMLAttributes<HTMLElement> | {[x: string]: string},
    selectOptions: SelectOption[]
}

function renderSelectOption(selectOption: SelectOption, index: number) {
    return (
        <option key={ index } value={ selectOption.value }>
            { selectOption.label ?? selectOption.value }
        </option>
    );
}

export const Select = ({ id, options, selectOptions }: SelectPropsType) => (
    <select
        id={ id }
        aria-labelledby={ `${id}-label` }
        aria-describedby={ `${id}-feedback` }
        { ...options }
    >
        { selectOptions.map(renderSelectOption) }
    </select>
);
