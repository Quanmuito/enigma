import React from 'react';
import styles from './style.module.css';

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string;
    error?: string;
    helperText?: string;
};

type OptionProps = React.OptionHTMLAttributes<HTMLOptionElement>;

export const Select = React.memo(
    React.forwardRef<HTMLSelectElement, SelectProps>(
        ({ label, error, helperText, className, name, id, children, ...props }, ref) => {
            const selectId = id || name;
            const errorId = error && selectId ? `${selectId}-error` : undefined;
            const helperId = helperText && !error && selectId ? `${selectId}-helper` : undefined;

            const selectClassName = [
                styles.select,
                error && styles.selectError,
                className,
            ].filter(Boolean).join(' ');

            return (
                <div className={ styles.selectWrapper }>
                    { label && (
                        <label htmlFor={ selectId } className={ styles.label }>
                            { label }
                        </label>
                    ) }
                    <select
                        ref={ ref }
                        id={ selectId }
                        name={ name }
                        className={ selectClassName }
                        aria-invalid={ !!error }
                        aria-describedby={ errorId || helperId }
                        { ...props }
                    >
                        { children }
                    </select>
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

Select.displayName = 'Select';

export const Option = React.memo<OptionProps>(({ children, ...props }) => {
    return <option { ...props }>{ children }</option>;
});

Option.displayName = 'Option';
