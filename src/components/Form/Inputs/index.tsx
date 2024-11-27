import React from 'react';

export * from './Select';
export * from './Textarea';

type InputPropsType = {
    id: string,
    type?: 'text' | 'password' | 'radio' | 'checkbox'
    options: React.HTMLAttributes<HTMLElement> | {[x: string]: string},
}
export const Input = ({ id, type, options }: InputPropsType) => (
    <input
        id={ id }
        type={ type }
        aria-labelledby={ `${id}-label` }
        aria-describedby={ `${id}-feedback` }
        { ...options }
    />
);

export const Submit = ({ id, options }: InputPropsType) => (
    <input id={ id } type="submit" aria-label="submit" { ...options } />
);

export const Reset = ({ id, options }: InputPropsType) => (
    <input id={ id } type="reset" aria-label="reset" { ...options } />
);
