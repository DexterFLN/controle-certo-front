import React, {useEffect, useState} from 'react';
import styles from './ExpenseUser.module.css';
import Input from '../Forms/Input';
import Button from '../Forms/Button';
import {GET_CATEGORY_USER, POST_EXPENSE_USER} from '../../apiService';
import useFetch from '../../Hooks/useFetch';
import formUse from '../../Hooks/formUse';
import Error from '../Helper/Error';
import {FaQuestionCircle} from 'react-icons/fa';
import Loading from "../Helper/Loading.jsx";
import CustomToast from "../Helper/CustomToast.jsx";
import 'react-toastify/dist/ReactToastify.css';

const ExpenseUser = () => {
    const [categories, setCategories] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const {status, error, request} = useFetch();
    const expenseDescription = formUse('description');
    const expenseValue = formUse('value');
    const totalInstallments = formUse('totalInstallments');
    const currentInstallment = formUse('currentInstallment');
    const [showInfo, setShowInfo] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [showCategoryError, setShowCategoryError] = useState(false);
    const [showTypeError, setShowTypeError] = useState(false);
    const [loading, setLoading] = React.useState(false)
    useEffect(() => {
        async function fetchCategories() {
            try {
                const {url, options} = GET_CATEGORY_USER();
                const response = await fetch(url, options);
                if (!response.ok) {
                    throw new Error('Erro ao buscar categorias');
                }
                const data = await response.json();
                if (Array.isArray(data)) {
                    setCategories(data);
                } else {
                    setCategories([]);
                }
            } catch (error) {
                console.error('Erro ao buscar categorias:', error.message);
            }
        }

        fetchCategories();
    }, []);

    function validateAllFields() {
        const isValid = [
            expenseDescription.validate(),
            expenseValue.validate(),
            selectedOption !== '',
            selectedType !== '',
            selectedType !== 'parcelado' || (totalInstallments.validate() && currentInstallment.validate() && parseInt(currentInstallment.value) <= parseInt(totalInstallments.value)),
        ].every(Boolean);
        return isValid;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (selectedOption === '') {
            setShowCategoryError(true);
            setTimeout(() => setShowCategoryError(false), 3000);
        }

        if (selectedType === '') {
            setShowTypeError(true);
            setTimeout(() => setShowTypeError(false), 3000);
        }

        if (!validateAllFields()) {
            return;
        }

        setLoading(true)
        try {

            const body = {
                id_categoria: parseInt(selectedOption),
                descricao_despesa: expenseDescription.value,
                valor_despesa: parseFloat(expenseValue.value),
                tipo_despesa: selectedType,
                parcela_atual: selectedType === 'parcelado' ? parseInt(currentInstallment.value) : null,
                parcela_total: selectedType === 'parcelado' ? parseInt(totalInstallments.value) : null,
            };

            const {url, options} = POST_EXPENSE_USER(body);
            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error('Erro ao salvar categoria.');
            }
        } catch (e) {
            console.log(e)
        }
        setTimeout(() => {
            setLoading(false);
            expenseDescription.reset();
            expenseValue.reset();
            totalInstallments.reset();
            currentInstallment.reset();
            setSelectedOption('');
            setSelectedType('');
            setShowInfo('');
            CustomToast('Despesa adicionada com sucesso!', 'success', 3000);
        }, 2000);

    }

    function handleChange(event) {
        setSelectedOption(event.target.value);
    }

    const toggleInfo = (type) => {
        setShowInfo(showInfo === type ? '' : type);
    };

    const handleTypeClick = (type) => {
        setSelectedType(type);
        setShowInfo('');
    };

    const getInfoText = (type) => {
        switch (type) {
            case 'recorrente':
                return 'Recorrente: Despesas que ocorrem regularmente, como aluguel ou contas mensais.';
            case 'parcelado':
                return 'Parcelado: Despesas que são pagas em várias parcelas, como compras a prazo.';
            case 'avista':
                return 'À Vista: Despesas que são pagas integralmente no momento da compra.';
            default:
                return '';
        }
    };

    return (
        <section className={styles.expensePost}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2 className={styles.subtitle}>Informe a Despesa</h2>
                <div className={styles.formGroup}>
                    <label htmlFor="combo">Selecionar categoria:</label>
                    <div>
                        {Array.isArray(categories) && categories.length > 0 ? (
                            <select
                                key={categories.id_categoria}
                                value={selectedOption}
                                onChange={handleChange}
                                className={styles.select}
                            >
                                <option value="" className={styles.options}>
                                    Selecione...
                                </option>
                                {categories.map((category) => (
                                    <option
                                        key={category.id_categoria}
                                        value={category.id_categoria}
                                        className={styles.options}
                                    >
                                        {category.categoria_nome}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <p>Crie novas categorias para lançar despesas</p>
                        )}
                    </div>
                </div>
                {showCategoryError && <p className={styles.error}>Selecione uma categoria.</p>}

                <div className={styles.formRow}>
                    <Input label="Descrição" type="text" name="descricao" {...expenseDescription} />
                    <Input label="Valor" type="text" name="valor" formatType="currency" {...expenseValue} />
                </div>

                <div className={styles.typeContainer}>
                    <h2 className={styles.subtitle}>Tipo de Despesa</h2>
                    <div className={styles.radioContainer}>
                        <div
                            className={`${styles.radioBox} ${selectedType === 'avista' ? styles.selected : ''}`}
                            onClick={() => handleTypeClick('avista')}
                        >
                            <label>À Vista</label>
                            <FaQuestionCircle className={styles.infoIcon} onClick={(e) => {
                                e.stopPropagation();
                                toggleInfo('avista');
                            }}/>
                            {showInfo === 'avista' && <div className={styles.infoBox}>{getInfoText('avista')}</div>}
                        </div>
                        <div
                            className={`${styles.radioBox} ${selectedType === 'recorrente' ? styles.selected : ''}`}
                            onClick={() => handleTypeClick('recorrente')}
                        >
                            <label>Recorrente</label>
                            <FaQuestionCircle className={styles.infoIcon} onClick={(e) => {
                                e.stopPropagation();
                                toggleInfo('recorrente');
                            }}/>
                            {showInfo === 'recorrente' &&
                                <div className={styles.infoBox}>{getInfoText('recorrente')}</div>}
                        </div>
                        <div
                            className={`${styles.radioBox} ${selectedType === 'parcelado' ? styles.selected : ''}`}
                            onClick={() => handleTypeClick('parcelado')}
                        >
                            <label>Parcelado</label>
                            <FaQuestionCircle className={styles.infoIcon} onClick={(e) => {
                                e.stopPropagation();
                                toggleInfo('parcelado');
                            }}/>
                            {showInfo === 'parcelado' &&
                                <div className={styles.infoBox}>{getInfoText('parcelado')}</div>}
                        </div>
                    </div>
                </div>
                {showTypeError && <p className={styles.error}>Selecione um tipo de despesa.</p>}

                {selectedType === 'parcelado' && (
                    <>
                        <Input
                            label="Parcela atual"
                            type="number"
                            name="atualParcela"
                            placeholder="ex: 1"
                            {...currentInstallment}
                        />
                        <Input
                            label="Nº Parcelas"
                            type="number"
                            name="totalParcelas"
                            placeholder="ex: 5"
                            {...totalInstallments}
                        />
                        {parseInt(currentInstallment.value) > parseInt(totalInstallments.value) &&
                            <p className={styles.error}>A parcela atual não pode ser maior que o número total de
                                parcelas.</p>}
                    </>
                )}

                {loading ? (
                    <Button disabled>Enviando...</Button>
                ) : (
                    <Button>Enviar</Button>
                )}
                <Error error={error}/>
                {loading && <Loading/>}
            </form>
        </section>
    );
};

export default ExpenseUser;
