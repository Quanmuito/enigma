import React from 'react';
import { TFunction } from 'i18next';
import style from './style.module.css';

type SelectPropsType = {
    list: string[];
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    customStyle?: { readonly [key: string]: string };
}

export default function Select(name: string, t: TFunction) {
    const key = name.charAt(0).toUpperCase() + name.slice(1);

    return function Select({ list, value, onChange, customStyle = undefined }: SelectPropsType) {
        return (
            <select
                id={ name }
                name={ name }
                className={ style.select }
                style={ customStyle }
                aria-label={ t(`label${key}`) }
                value={ value }
                onChange={ onChange }
            >
                { list.map(Option(t)) }
            </select>
        );
    };
}

function Option(t: TFunction) {
    return function Option(value: string, index: number) {
        return <option key={ value + index } value={ value }>{ t(value) }</option>;
    };
}
