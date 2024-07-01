import React from 'react';
import InputMask from 'react-input-mask';
import { NumericFormat } from 'react-number-format';
import styles from './Input.module.css';

const Input = ({
                   label,
                   type = 'text',
                   name,
                   value,
                   onChange,
                   error,
                   onBlur,
                   onFocus,
                   mask,
                   formatType,
               }) => {
    return (
        <div className={styles.wrapper}>
            {label && <label htmlFor={name}>{label}</label>}
            {formatType === 'currency' ? (
                <NumericFormat
                    value={value}
                    onValueChange={(values) => {
                        const event = { target: { name, value: values.floatValue } };
                        onChange && onChange(event);
                    }}
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="R$ "
                    fixedDecimalScale
                    decimalScale={2}
                    className={styles.input}
                    id={name}
                    name={name}
                    onBlur={onBlur}
                    onFocus={onFocus}
                />
            ) : mask ? (
                <InputMask
                    mask={mask}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    onFocus={onFocus}
                >
                    {(inputProps) => (
                        <input
                            {...inputProps}
                            id={name}
                            name={name}
                            className={styles.input}
                            type={type}
                        />
                    )}
                </InputMask>
            ) : (
                <input
                    id={name}
                    name={name}
                    className={styles.input}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    onFocus={onFocus}
                />
            )}
            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
};

export default Input;
