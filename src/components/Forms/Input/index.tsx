import React from 'react';
import styles from './style.module.css';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
    helperText?: string;
};

export const Input = React.memo(
    React.forwardRef<HTMLInputElement, InputProps>(
        ({ label, error, helperText, className, name, id, ...props }, ref) => {
            const inputId = id || name;
            const errorId = error && inputId ? `${inputId}-error` : undefined;
            const helperId = helperText && !error && inputId ? `${inputId}-helper` : undefined;

            const inputClassName = [
                styles.input,
                error && styles.inputError,
                className,
            ].filter(Boolean).join(' ');

            return (
                <div className={ styles.inputWrapper }>
                    { label && (
                        <label htmlFor={ inputId } className={ styles.label }>
                            { label }
                        </label>
                    ) }
                    <input
                        ref={ ref }
                        id={ inputId }
                        name={ name }
                        className={ inputClassName }
                        aria-invalid={ !!error }
                        aria-describedby={ errorId || helperId }
                        { ...props }
                    />
                    { error && (
                        <span id={ errorId } className={ styles.errorMessage }>
                            { error }
                        </span>
                    ) }
                    { helperText && !error && (
                        <span id={ helperId } className={ styles.helperText }>
                            { helperText }
                        </span>
                    ) }
                </div>
            );
        }
    )
);

Input.displayName = 'Input';
