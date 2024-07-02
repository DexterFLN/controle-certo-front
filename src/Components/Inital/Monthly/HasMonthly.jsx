import React, {useState} from 'react';
import GraphTemplate from '../../Graph/GraphTemplate.jsx';
import styles from './HasMonthly.module.css';
import Button from "../../Forms/Button.jsx";
import {DELETE_MONTHLY_BUDGET} from "../../../apiService.jsx";
import useFetch from "../../../Hooks/useFetch.jsx";
import Error from '../../Helper/Error.jsx'
import Loading from '../../Helper/Loading.jsx'
import Modal from "../../Modal/Modal.jsx";

const HasMonthly = ({body}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [monthlyBudgetIdToDelete, setMonthlyBudgetIdToDelete] = useState(null);
    const {error, request} = useFetch();
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteClick = () => {
        const id = body.id_orcamento ? body.id_orcamento : null;
        const monthlyReference = body ? body.mes_ano_referente : '';
        setModalMessage(`Deseja deletar o orçamento "${monthlyReference}"?`);
        setMonthlyBudgetIdToDelete(id);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setMonthlyBudgetIdToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (monthlyBudgetIdToDelete !== null) {
            setIsLoading(true)
            await deleteRow(monthlyBudgetIdToDelete);
            setIsModalVisible(false);
            setTimeout(() => {
                setIsLoading(false);
                window.location.reload();
            }, 3000);
        }
    };

    const deleteRow = async (id) => {
        console.log(id)
        try {
            const {url, options} = DELETE_MONTHLY_BUDGET(id);
            await request(url, options);
        } catch (error) {
            console.error('Error deleting the row:', error);
        }
    };

    const {
        id_orcamento,
        orcamento_dh_criacao,
        renda_mensal,
        mes_ano_referente,
        orcamento_itens_despesas
    } = body;

    const pieChartData = [
        ['Categoria', 'Percentual'],
        ...orcamento_itens_despesas.map(item => [
            item.item_despesa_categoria.categoria_nome,
            item.valor_despesa_item
        ])
    ];

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(value);
    };

    const PIE_CHART_OPTIONS = {
        pieHole: 0.4,
        is3D: true,
        legend: {
            textStyle: {color: '#333', fontSize: 18, bold: true},
            position: 'bottom',
            alignment: 'center'
        },
        tooltip: {textStyle: {color: 'blue', fontSize: 14}}
    };

    return (
        <div className={styles.budgetContainer}>
            <div className={styles.budgetInfo}>
                <h2 className={styles.subtitle}>Informações do Orçamento</h2>
                <div className={styles.fieldWrapper}>
                    <div className={styles.fieldHeader}>
                        <span className={styles.label}>ID do Orçamento:</span>
                    </div>
                    <p>{id_orcamento}</p>
                </div>
                <div className={styles.fieldWrapper}>
                    <div className={styles.fieldHeader}>
                        <span className={styles.label}>Data de Criação:</span>
                    </div>
                    <p>{new Date(orcamento_dh_criacao).toLocaleString()}</p>
                </div>
                <div className={styles.fieldWrapper}>
                    <div className={styles.fieldHeader}>
                        <span className={styles.label}>Renda Mensal:</span>
                    </div>
                    <p>{formatCurrency(renda_mensal)}</p>
                </div>
                <div className={styles.fieldWrapper}>
                    <div className={styles.fieldHeader}>
                        <span className={styles.label}>Mês/Ano Referente:</span>
                    </div>
                    <p>{mes_ano_referente}</p>
                </div>
                <div className={styles.deleteBudgetButton}>
                    <Button onClick={handleDeleteClick}>Deletar orçamento</Button>
                    <Error error={error}/>
                </div>
            </div>
            <div className={styles.expenseChart}>
                <h2 className={styles.subtitle}>Distribuição de Despesas</h2>
                <GraphTemplate
                    chartType="PieChart"
                    data={pieChartData}
                    width="100%"
                    height="400px"
                    options={PIE_CHART_OPTIONS}
                />
            </div>
            <div className={styles.expenseItems}>
                <h2 className={styles.subtitle}>Itens de Despesa</h2>
                {orcamento_itens_despesas.map((item) => (
                    <div key={item.id_item_despesa} className={styles.fieldWrapper}>
                        <div className={styles.fieldHeader}>
                            <span className={styles.label}>ID do Item:</span>
                        </div>
                        <p>{item.id_item_despesa}</p>
                        <div className={styles.fieldHeader}>
                            <span className={styles.label}>Meta de Orçamento:</span>
                        </div>
                        <p>{item.item_despesa_meta_orcamento ? 'Sim' : 'Não'}</p>
                        <div className={styles.fieldHeader}>
                            <span className={styles.label}>Valor planejado para categoria:</span>
                        </div>
                        <p>{formatCurrency(item.valor_despesa_item)}</p>
                        <div className={styles.fieldHeader}>
                            <span className={styles.label}>Categoria:</span>
                        </div>
                        <p>{item.item_despesa_categoria.categoria_nome}</p>
                        <div className={styles.fieldHeader}>
                            <span className={styles.label}>Descrição da Categoria:</span>
                        </div>
                        <p>{item.item_despesa_categoria.categoria_descricao}</p>
                        <div className={styles.fieldHeader}>
                            <span className={styles.label}>Data de Criação:</span>
                        </div>
                        <p>{new Date(item.item_despesa_dh_criacao).toLocaleString()}</p>
                    </div>
                ))}
            </div>
            {isLoading && <Loading/>}
            <Modal
                show={isModalVisible}
                message={modalMessage}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};

export default HasMonthly;
