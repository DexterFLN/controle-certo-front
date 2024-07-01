import React from 'react';
import {validate as validateCPF} from 'cpf-check';

const types = {
    categoryName: {
        regex: /^.{1,30}$/,
        message: 'Nome da categoria deve ter no máximo 30 caracteres.',
    },
    categoryDescription: {
        regex: /^.{0,50}$/,
        message: 'Descrição da categoria deve ter no máximo 50 caracteres.',
    },
    description: {
        regex: /^.{1,50}$/,
        message: 'Descrição deve ter no máximo 50 caracteres.',
    },
    value: {
        regex: /^\d+(\.\d{1,2})?$/,
        message: 'Valor deve ser um número.',
    },
    totalInstallments: {
        regex: /^\d+$/,
        message: 'Número de parcelas deve ser um número inteiro.',
    },
    currentInstallment: {
        regex: /^\d+$/,
        message: 'Parcela atual deve ser um número inteiro.',
    },
    firstAndLastName: {
        regex: /^(?=.{1,50}$)[a-zA-Z\s-]+ [a-zA-Z\s-]+$/,
        message: 'Digite um nome e sobrenome válidos com no máximo 50 caracteres.',
    },
    cpf: {
        regex: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
        message: 'Digite um CPF válido.',
    },
    email: {
        regex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: 'Digite um E-mail válido.',
    },
    phonenumber: {
        regex: /^.*$/,
        message: 'Digite um telefone válido no formato (99) 99999-9999.',
    },
    cep: {
        regex: /^\d{5}-?\d{3}$/,
        message: 'Digite um CEP válido.',
    },
    district: {
        regex: /^.{1,40}$/,
        message: 'Bairro deve ter no máximo 40 caracteres.',
    },
    city: {
        regex: /^.{1,40}$/,
        message: 'Município deve ter no máximo 40 caracteres.',
    },
    state: {
        regex: /^.{1,2}$/,
        message: 'UF deve ter no máximo 2 caracteres.',
    },
    password: {
        regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        message: 'A senha deve ter no mínimo 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.',
    },
    confirmPassword: {
        validate: (value, compareValue) => value === compareValue,
        message: 'As senhas não são iguais.',
    },
    acceptTerms: {
        validate: (value) => value === true,
        message: 'Você deve aceitar os termos de uso.',
    },
};

const formUse = (type, mask, compareValue) => {
    const [value, setValue] = React.useState(type === 'acceptTerms' ? false : '');
    const [error, setError] = React.useState('');
    const errorTimeoutRef = React.useRef(null);

    function validate(value) {
        if (value === undefined || value === null) {
            setError('Preencha um valor.');
            clearTimeout(errorTimeoutRef.current);
            errorTimeoutRef.current = setTimeout(() => setError(''), 5000);
            return false;
        }

        if (type === 'acceptTerms' && !value) {
            setError(types[type].message);
            return false;
        }
        if (value.length === 0) {
            setError('Preencha um valor.');
            clearTimeout(errorTimeoutRef.current);
            errorTimeoutRef.current = setTimeout(() => setError(''), 5000);
            return false;
        } else if (type === 'cpf') {
            const cleanedValue = value.replace(/\D/g, '');
            if (!validateCPF(cleanedValue)) {
                setError(types[type].message);
                clearTimeout(errorTimeoutRef.current);
                errorTimeoutRef.current = setTimeout(() => setError(''), 5000);
                return false;
            } else {
                return true;
            }
        } else if (type === 'phonenumber') {
            const cleanedValue = value.replace(/\D/g, '');
            if (!types[type].regex.test(cleanedValue)) {
                setError(types[type].message);
                clearTimeout(errorTimeoutRef.current);
                errorTimeoutRef.current = setTimeout(() => setError(''), 5000);
                return false;
            }
        } else if (types[type] && types[type].regex && !types[type].regex.test(value)) {
            setError(types[type].message);
            clearTimeout(errorTimeoutRef.current);
            errorTimeoutRef.current = setTimeout(() => setError(''), 5000);
            return false;
        } else if (types[type] && types[type].validate && !types[type].validate(value, compareValue)) {
            setError(types[type].message);
            clearTimeout(errorTimeoutRef.current);
            errorTimeoutRef.current = setTimeout(() => setError(''), 5000);
            return false;
        } else {
            setError(null);
            return true;
        }
    }

    function onChange({target}) {
        let newValue = target.type === 'checkbox' ? target.checked : target.value;
        if (mask) {
            newValue = newValue.replace(/[^\d]/g, ''); // Remove todos os caracteres de máscara
        }
        setValue(newValue);
    }

    function onFocus() {
        setError(null);
        clearTimeout(errorTimeoutRef.current);
    }

    function reset() {
        setValue(type === 'acceptTerms' ? false : '');
        setError('');
    }

    return {
        value,
        setValue,
        onChange,
        error,
        setError,
        validate: () => validate(value),
        onBlur: () => validate(value),
        onFocus,
        reset,
        mask,
    };
};

export default formUse;
