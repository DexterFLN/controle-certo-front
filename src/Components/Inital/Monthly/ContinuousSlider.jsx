import React, {useEffect, useState} from 'react';
import Slider from '@mui/material/Slider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import styles from './ContinuousSlider.module.css';
import Input from '../../Forms/Input';
import {addMonths, subMonths} from 'date-fns';
import Button from '../../Forms/Button';
import {Delete} from '@mui/icons-material';
import useFetch from '../../../Hooks/useFetch';
import {
    DELETE_CATEGORY,
    GET_CATEGORY_USER,
    POST_BUDGET_USER,
    POST_CATEGORY_USER,
    GET_LAST_MONTHLY_BUDGET
} from "../../../apiService";
import Error from "../../Helper/Error";
import MoneyBar from '../../../Assets/IconsHeader/Money/money-8.svg?react';
import MoneyDown from '../../../Assets/IconsHeader/Money/money-7.svg?react';
import DataTable from '../../Graph/DataTable';
import {GET_COLUMNS_CATEGORY} from '../../Graph/TableColumns';
import Modal from '../../Modal/Modal';
import Loading from "../../Helper/Loading";
import formUse from '../../../Hooks/formUse';

const ContinuousSlider = ({formattedDate}) => {
    const [categories, setCategories] = useState([]);
    const [sliderValues, setSliderValues] = useState([]);
    const [categorySelected, setCategorySelected] = useState('');
    const [monthlyIncome, setMonthlyIncome] = useState(0);
    const [valueUsed, setValueUsed] = useState(0);
    const [valueAvailable, setRendaDisponivel] = useState(0);
    const [valueAvailableNegativa, setRendaDisponivelNegativa] = useState(false);
    const [exibirMensagemErro, setExibirMensagemErro] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [errorSelectedCategory, setErrorSelectedCategory] = useState(false);
    const {request: requestDelete} = useFetch();
    const {status: statusBudget, request: requestBudget} = useFetch();
    const {request: requestCategoryPost} = useFetch();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);
    const [loadingCreateBudget, setLoadingCreateBudget] = useState(false);
    const [errorMonthlyIncome, setErrorMonthlyIncome] = useState(false);
    const [errorSliderValues, setErrorSliderValues] = useState(false);
    const [lastBudgetText, setLastBudgetText] = useState('');
    const categoryName = formUse('categoryName');
    const categoryDescription = formUse('categoryDescription');

    async function requestLastBudgetteste(url, options) {
        const response = await fetch(url, options);
        const json = await response.json();
        return {response, json};
    }

    const handleGetLastBudget = async () => {
        const {url, options} = GET_LAST_MONTHLY_BUDGET();
        try {
            const response = await fetch(url, options);
            if (response.ok) {
                const text = await response.text(); // Obtém a resposta como texto
                if (text) {
                    const json = JSON.parse(text); // Converte o texto para JSON
                    const budgetItems = json.orcamento_itens_despesas
                        .filter(item => categories.some(cat => cat.categoria_nome === item.item_despesa_categoria.categoria_nome))
                        .map(item => ({
                            categoria: item.item_despesa_categoria.categoria_nome,
                            valor: ((item.valor_despesa_item / json.renda_mensal) * 100),
                        }));

                    if (budgetItems.length > 0) {
                        setMonthlyIncome(json.renda_mensal);
                        setSliderValues(budgetItems);
                        setLastBudgetText(`Último orçamento copiado: ${json.mes_ano_referente}. Você pode continuar editando ou enviar o orçamento.`);
                    } else {
                        setLastBudgetText("Nenhum orçamento encontrado. Não se preocupe, você pode criar um novo agora e reutilize-o mais tarde!");
                    }
                } else {
                    setLastBudgetText("Nenhum orçamento encontrado. Não se preocupe, você pode criar um novo agora e reutilize-o mais tarde!");
                }
            } else {
                console.error('Erro ao buscar o último orçamento:', response.statusText);
                setLastBudgetText("Erro ao buscar o último orçamento. Tente novamente mais tarde.");
            }
        } catch (error) {
            console.error('Erro ao processar a resposta do orçamento:', error);
            setLastBudgetText("Erro ao buscar o último orçamento. Tente novamente mais tarde.");
        }
    }

    const handleDeleteClick = (id) => {
        const category = categories.find(cat => cat.id_categoria === id);
        const categoryName = category ? category.categoria_nome : '';
        setModalMessage(`Deseja deletar a categoria "${categoryName}"?`);
        setCategoryIdToDelete(id);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setCategoryIdToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (categoryIdToDelete !== null) {
            await deleteRow(categoryIdToDelete);
            setIsModalVisible(false);
        }
    };

    useEffect(() => {
        async function fetchCategories() {
            try {
                const token = window.localStorage.getItem('token');
                const {url, options} = GET_CATEGORY_USER(token);
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

    const deleteRow = async (id) => {
        try {
            const {url, options} = DELETE_CATEGORY(id);
            await requestDelete(url, options);

            setCategories(prevCategories => prevCategories.filter(row => row.id_categoria !== id));

            setSliderValues(prevSliderValues => prevSliderValues.filter(slider => {
                const categoria = categories.find(cat => cat.id_categoria === id);
                return categoria ? slider.categoria !== categoria.categoria_nome : true;
            }));

            setCategorySelected('');
        } catch (error) {
            console.error('Error deleting the row:', error);
        }
    };

    const addSlider = () => {
        setErrorSelectedCategory(false);
        if (
            categorySelected.trim() !== '' &&
            !sliderValues.some((slider) => slider.categoria === categorySelected)
        ) {
            const newSlider = {valor: 0, categoria: categorySelected};
            setSliderValues([...sliderValues, newSlider]);
            setCategorySelected('');
        } else {
            setErrorSelectedCategory(true);
        }
    };

    const removeSlider = (index) => {
        const newSliderValues = sliderValues.filter((_, i) => i !== index);
        setSliderValues(newSliderValues);
    };

    const handleSliderChange = (event, newValue, index) => {
        const newSliderValues = [...sliderValues];
        newSliderValues[index].valor = newValue;

        const totalPercentage = newSliderValues.reduce(
            (acc, curr) => acc + curr.valor,
            0,
        );

        if (totalPercentage > 100) {
            const overflow = totalPercentage - 100;
            newSliderValues.forEach((slider, i) => {
                if (i !== index) {
                    const newSliderValue =
                        slider.valor - overflow / (newSliderValues.length - 1);
                    slider.valor = newSliderValue < 0 ? 0 : newSliderValue;
                }
            });
        }
        setSliderValues(newSliderValues);
    };

    const addCategory = async () => {
        if (!categoryName.validate() || !categoryDescription.validate()) {
            return;
        }

        const newCategory = {
            nome_categoria: categoryName.value,
            descricao_categoria: categoryDescription.value || '' // Deixa a descrição vazia se não for preenchida
        };

        const {url, options} = POST_CATEGORY_USER(newCategory);
        const {response, json} = await requestCategoryPost(url, options);

        if (response.ok) {
            setCategories(prevCategories => [...prevCategories, json]);
            categoryName.reset();
            categoryDescription.reset();
        } else {
            console.error('Erro ao adicionar a categoria:', response.statusText);
        }
    };

    async function handleSubmit(event) {
        event.preventDefault();
        setLoadingCreateBudget(true);

        setErrorMonthlyIncome(false);
        setErrorSliderValues(false);
        setExibirMensagemErro(false);

        if (monthlyIncome <= 0) {
            setErrorMonthlyIncome(true);
            setSliderValues([]);
            setLoadingCreateBudget(false);
            return;
        }

        if (sliderValues.length === 0 || sliderValues.every(slider => slider.valor === 0)) {
            setErrorSliderValues(true);
            setExibirMensagemErro(true);
            setTimeout(() => setExibirMensagemErro(false), 5000);
            setTimeout(() => setErrorSliderValues(false), 5000);
            setLoadingCreateBudget(false);
            return;
        }

        if (valueAvailable < 0) {
            setExibirMensagemErro(true);
            setLoadingCreateBudget(false);
            return;
        }

        const objetoCombinado = sliderValues.map(itemSlider => {
            const categoria = categories.find(itemCategoria => itemCategoria.categoria_nome === itemSlider.categoria); // Encontrar a categoria pelo nome no slider

            return {
                id_categoria: categoria.id_categoria,
                valor_despesa_categoria: ((itemSlider.valor / 100) * monthlyIncome).toFixed(2)
            };
        });

        const body = {
            renda_mensal: monthlyIncome,
            mes_ano_referencia: formattedDate,
            item_despesa: objetoCombinado
        };

        const {url, options} = POST_BUDGET_USER(body);
        const {response} = await requestBudget(url, options);
        if (response.status === 204) {
            setTimeout(() => {
                setLoadingCreateBudget(false);
                window.location.reload();
            }, 3000)
        }
    }

    const handleNextMonth = () => {
        const newDate = addMonths(currentDate, 1);
        setCurrentDate(newDate);
    };

    const handlePreviousMonth = () => {
        const newDate = subMonths(currentDate, 1);
        setCurrentDate(newDate);
    };

    useEffect(() => {
        const somaValoresSliders = sliderValues.reduce(
            (acc, curr) => acc + curr.valor,
            0,
        );
        const novoValorUtilizado = (somaValoresSliders / 100) * monthlyIncome;

        setValueUsed(novoValorUtilizado);

        const novoRendaDisponivel = monthlyIncome - novoValorUtilizado;
        setRendaDisponivel(novoRendaDisponivel);

        setRendaDisponivelNegativa(novoRendaDisponivel < 0);

        const timeout = setTimeout(() => {
            setExibirMensagemErro(false);
        }, 5000);

        return () => clearTimeout(timeout);
    }, [sliderValues, monthlyIncome]);

    const categoryAvailable = categories.filter(
        (cat) => cat && !sliderValues.some((slider) => slider.categoria === cat.categoria_nome),
    );

    return (
        <section>
            <div className={`${styles.graph} animeLeft`}>

                <h1 className={styles.subtitle}>Planejamento do mês</h1>

                <div className={styles.testando}>
                    <div className={styles.frUmSlider}>
                        <div className={styles.monthlyValues}>
                            <div className={styles.incomeMonthly}>
                                <h2 className={styles.subtitle}>Inicie seu planejamento inserindo sua renda mensal</h2>
                                <Input
                                    type="text"
                                    value={monthlyIncome}
                                    formatType="currency"
                                    setValue={setMonthlyIncome}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setMonthlyIncome(value);
                                        if (value <= 0) {
                                            setSliderValues([]);
                                        }
                                    }}
                                    onBlur={() => {
                                        if (monthlyIncome <= 0) {
                                            setErrorMonthlyIncome(true);
                                        }
                                    }}
                                    onFocus={() => setErrorMonthlyIncome(false)}
                                />
                                {errorMonthlyIncome && <Error error="Renda mensal deve ser maior que zero"/>}
                                <div className={styles.copyLastBudget}>
                                    <Button onClick={handleGetLastBudget}>Copiar último orçamento</Button>
                                    <span>{lastBudgetText}</span>
                                </div>
                            </div>

                            <div className={styles.incomeAvailable}>
                                <MoneyBar className={styles.icon}/>
                                <label>Renda disponível:</label>
                                <span className={styles.budgetSpan}>R$ {valueAvailable.toFixed(2)}</span>
                            </div>

                            <div className={styles.incomeCompromised}>
                                <MoneyDown className={styles.icon}/>
                                <label>Renda comprometida:</label>
                                <span className={styles.budgetSpan}
                                      style={{color: valueAvailableNegativa ? 'red' : 'black'}}>
                                    R$ {valueUsed.toFixed(2)}</span>
                            </div>
                            <div className={styles.orcamento}>
                                {Array.isArray(categories) && categories.length > 0 ? (
                                    <Select
                                        className={styles.categorySelector}
                                        value={categorySelected}
                                        onChange={(e) => setCategorySelected(e.target.value)}
                                        displayEmpty
                                    >
                                        <MenuItem value="" disabled>
                                            Escolha uma categoria...
                                        </MenuItem>
                                        {categoryAvailable.map((category, index) => (
                                            <MenuItem key={index} value={category.categoria_nome}>
                                                {category.categoria_nome}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                ) : (
                                    <p className={styles.noHasCategory}>Você pode criar categorias na janela de
                                        orçamento</p>
                                )}
                                <Button
                                    className={styles.buttonCategory}
                                    onClick={addSlider}
                                    disabled={sliderValues.some((slider) => slider.categoria === categorySelected)}
                                >Adicionar Item Orçamento</Button>
                            </div>
                            <div className={styles.containerSliderCreate}>
                                {sliderValues.map((slider, index) => (
                                    <div key={index} className={styles.fieldWrapper}>
                                        <div className={styles.sliderWrapper}>
                                            <div className={styles.sliderHeader}>
                                                <div className={styles.categorySlider}>
                                                    {slider.categoria}
                                                </div>
                                                <div className={styles.sliderValue}>
                                                    <span>R$ {((slider.valor / 100) * monthlyIncome).toFixed(2)}</span>
                                                </div>
                                            </div>

                                            <div className={styles.sliderItem}>
                                                <Slider
                                                    className={styles.slider}
                                                    value={slider.valor}
                                                    onChange={(event, newValue) =>
                                                        handleSliderChange(event, newValue, index)
                                                    }
                                                    aria-label={`Slider ${index + 1}`}
                                                    max={100}
                                                />

                                            </div>
                                        </div>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => removeSlider(index)}
                                            className={styles.removeButton}>
                                            <Delete/>
                                        </Button>
                                    </div>
                                ))}
                                {sliderValues.length === 0 && (<p className={styles.budgetItensEmpty}>
                                    Ainda não foram adicionados itens ao orçamento.
                                </p>)}
                                <div className={styles.containerButtonBudget}>
                                    <Button className={styles.buttonBudget} onClick={handleSubmit}>Enviar Orçamento
                                        mensal</Button>
                                </div>
                                {exibirMensagemErro && valueAvailable < 0 && (
                                    <Error error="Para continuar com seu planejamento mensal, a renda disponível não pode ser negativa. Por favor, ajuste os valores."/>)}
                                {errorSliderValues &&
                                    <Error
                                        error=" Por favor, adicione pelo menos uma categoria com um valor maior que zero para continuar com seu planejamento mensal."/>}
                            </div>
                        </div>
                    </div>
                    <div className={styles.categoriaTeste}>
                        <Input
                            label="Nome categoria"
                            type="text"
                            value={categoryName.value}
                            setValue={categoryName.setValue}
                            onChange={categoryName.onChange}
                            onBlur={categoryName.onBlur}
                            onFocus={categoryName.onFocus}
                        />
                        {categoryName.error && <Error error={categoryName.error}/>}
                        <Input
                            label="Descrição Categoria"
                            type="text"
                            value={categoryDescription.value}
                            setValue={categoryDescription.setValue}
                            onChange={categoryDescription.onChange}
                            onBlur={categoryDescription.onBlur}
                            onFocus={categoryDescription.onFocus}
                        />
                        {categoryDescription.error && <Error error={categoryDescription.error}/>}
                        <Button variant="contained" color="primary" onClick={addCategory}>
                            Adicionar Categoria
                        </Button>
                        <DataTable columns={GET_COLUMNS_CATEGORY()} data={categories} deleteRow={handleDeleteClick}
                                   rowIdAccessor="id_categoria" pdfHeaderTitle="Lista de categorias"/>
                    </div>
                </div>
            </div>
            {loadingCreateBudget && (<Loading/>)}
            <Modal
                show={isModalVisible}
                message={modalMessage}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
            />
        </section>
    );
};

export default ContinuousSlider;
