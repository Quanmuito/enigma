import React from 'react';

type LabelPropsType = {
    id: string,
    label: string,
    options: React.HTMLAttributes<HTMLElement> | {[x: string]: string},
}
export const Label = ({ id, label, options }: LabelPropsType) => (
    <label id={ `${id}-label` } htmlFor={ id } { ...options }>
        { label }
    </label>
);

type FeedbackPropsType = {
    id: string,
    options: React.HTMLAttributes<HTMLElement> | {[x: string]: string},
    description: string,
    error?: string
}
export const Feedback = ({ id, options, description, error }: FeedbackPropsType) => (
    (error !== undefined)
        ? <FeedbackError id={ id } options={ options } error={ error } />
        : <FeedbackDescription id={ id } options={ options } description={ description } />
);

/** Render input description */
type FeedbackDescriptionPropsType = {
    id: string,
    options: React.HTMLAttributes<HTMLElement> | {[x: string]: string},
    description: string,
}
export const FeedbackDescription = ({ id, description, options }: FeedbackDescriptionPropsType) => (
    <div id={ `${id}-feedback` } { ...options }>
        { description }
    </div>
);

/** Render input error */
type FeedbackErrorPropsType = {
    id: string,
    options: React.HTMLAttributes<HTMLElement> | {[x: string]: string},
    error: string,
}
export const FeedbackError = ({ id, error, options }: FeedbackErrorPropsType) => (
    <div id={ `${id}-feedback` } { ...options }>
        { `Invalid input. Error: ${error}` }
    </div>
);
