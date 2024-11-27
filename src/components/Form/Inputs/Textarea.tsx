import React from 'react';

type TextareaPropsType = {
    id: string,
    options: React.HTMLAttributes<HTMLElement> | {[x: string]: string},
}
export const Textarea = ({ id, options }: TextareaPropsType) => (
    <textarea
        id={ id }
        aria-labelledby={ `${id}-label` }
        aria-describedby={ `${id}-feedback` }
        { ...options }
    />
);
