import React, {useEffect, useState} from 'react';
import useFetch from '../../Hooks/useFetch';
import {DELETE_EXPENSE, GET_EXPENSE_USER, GET_MONTHLY_BUDGET} from '../../apiService';
import Loading from '../Helper/Loading';
import Head from '../Helper/Head';
import GraphTemplate from '../Graph/GraphTemplate';
import DataTable from '../Graph/DataTable.jsx';
import styles from './HomeApp.module.css';
import {COLUMN_CHART_OPTIONS, PIE_CHART_OPTIONS} from '../Helper/ColumnNames';
import {addMonths, subMonths, format} from 'date-fns';
import {GET_COLUMNS_EXPENSE} from '../Graph/TableColumns.jsx';
import Modal from "../Modal/Modal.jsx";
import MonthValue from "../Month/MonthValue.jsx";
import Button from "../Forms/Button.jsx";
import GamificationCard from "../GamificationCard/GamificationCard.jsx";
import ExpenseEmpty from './Home/ExpenseEmpty.jsx'
import {useNavigate} from 'react-router-dom';
import {UserContext} from '../../UserContext';
import {getAvatarDetails} from '../Helper/getAvatarUrl';

const HomeApp = () => {
    const {data} = React.useContext(UserContext);
    const navigate = useNavigate();
    const {error, loading, request} = useFetch();
    const {error: errorExpense, loading: loadingExpense, request: requestExpense} = useFetch();
    const {data: dataMonthly, error: errorMonthly, loading: loadingMonthly, request: requestMonthly} = useFetch();
    const [monthlyBudget, setMonthlyBudget] = useState(null);
    const [dataChart, setDataChart] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [rotation, setRotation] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);
    const {avatarUrl, message} = getAvatarDetails(data.usuario_level);

    const handleDateChange = (date) => {
        setCurrentDate(date);
    };

    const handleRotationChange = (rotation) => {
        setRotation(rotation);
    };

    const handleDeleteClick = (id) => {
        const expense = tableData.find(cat => cat.id_despesa === id);
        const categoryName = expense ? expense.categoria_despesa.categoria_nome : '';

        const formattedDate = format(currentDate, 'MM/yyyy');
        let [month, year] = formattedDate.split('/');

        const requestDelete = {
            id_despesa: id,
            tipo_despesa: expense.tipo_despesa,
            month: month,
            year: year
        }
        setModalMessage(`Deseja deletar a despesa "${categoryName}"?`);
        setCategoryIdToDelete(requestDelete);
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
        fetchMonthlyData(currentDate);
    }, [currentDate]);

    useEffect(() => {
        if (monthlyBudget) {
            fetchData(currentDate);
        }
    }, [monthlyBudget]);

    const fetchMonthlyData = async (date) => {
        const formattedDate = format(date, 'MM/yyyy');
        let [month, year] = formattedDate.split('/');
        const {url, options} = GET_MONTHLY_BUDGET(month, year);
        const {json} = await requestMonthly(url, options);

        if (json) {
            setMonthlyBudget(json);
        } else {
            setMonthlyBudget([]);
        }
    };

    const fetchData = async (date) => {
        const formattedDate = format(date, 'MM/yyyy');
        let [month, year] = formattedDate.split('/');
        const {url, options} = GET_EXPENSE_USER(month, year);
        const {json} = await request(url, options);

        if (json) {
            setTableData(json);
            updateCharts(json, monthlyBudget);
        } else {
            setTableData([]);
            setDataChart([]);
            setPieChartData([]);
        }
    };

    const updateCharts = (expensesData, budgetData) => {

        const expenseMap = expensesData.reduce((acc, curr) => {
            const category = curr.categoria_despesa.categoria_nome;
            if (!acc[category]) {
                acc[category] = {planejado: 0, real: 0};
            }
            acc[category].real += curr.despesa_valor;
            return acc;
        }, {});

        if (budgetData.orcamento_itens_despesas) {
            budgetData.orcamento_itens_despesas.forEach((item) => {
                const category = item.item_despesa_categoria.categoria_nome;
                if (!expenseMap[category]) {
                    expenseMap[category] = {planejado: 0, real: 0};
                }
                // Aqui usamos diretamente o valor percentual para o planejado
                expenseMap[category].planejado += item.valor_despesa_item;
            });
        }

        const chartData = [
            ['Categoria', 'Planejado', 'Real'],
            ...Object.keys(expenseMap).map((key) => [
                key,
                expenseMap[key].planejado,
                expenseMap[key].real,
            ]),
        ];

        const pieChartData = [
            ['Categoria', 'Gasto Real'],
            ...Object.keys(expenseMap).map((key) => [key, expenseMap[key].real]),
        ];
        setDataChart(chartData);
        setPieChartData(pieChartData);
    };

    const handleNextMonth = () => {
        const newDate = addMonths(currentDate, 1);
        setCurrentDate(newDate);
    };

    const handlePreviousMonth = () => {
        const newDate = subMonths(currentDate, 1);
        setCurrentDate(newDate);
    };

    const deleteRow = async (body) => {
        try {
            const {url, options} = DELETE_EXPENSE(body);
            await requestExpense(url, options);
            setTableData((prevData) => prevData.filter((row) => row.id_despesa !== body.id_despesa));
        } catch (error) {
            console.error('Error deleting the row:', error);
        }
    };

    function getPaymentType(payment) {
        switch (payment) {
            case 'avista':
                return 'À vista';
            case 'recorrente':
                return 'Recorrente';
            case 'parcelado':
                return 'Parcelado';
            default:
                return 'Tipo de pagamento desconhecido';
        }
    }

    const handleGoToAddExpense = () => {
        navigate('/user/expense');
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(value);
    };

    const dados = tableData.map((item) => ({
        id_despesa: item.id_despesa,
        categoria_despesa: item.categoria_despesa.categoria_nome,
        descricao_despesa: item.despesa_descricao,
        tipo_despesa: getPaymentType(item.tipo_despesa),
        parcela_atual: item.parcela_atual ? item.parcela_atual : '-',
        parcela_total: item.parcela_total ? item.parcela_total : '-',
        valor_despesa: formatCurrency(item.despesa_valor),
        data_despesa: item.despesa_dh_criacao,
    }));

    if (loading || loadingMonthly) return <Loading/>;
    if (error) return <div>Erro: {error}</div>;
    if (errorMonthly) return <div>Erro: {errorMonthly}</div>;

    return (
        <section>
            <Head title="Home"/>
            <div className={styles.monthCurrent}>
                <div className={styles.lvlBarContainer}>
                    <GamificationCard
                        avatarUrl={avatarUrl}
                        currentLevel={data.usuario_level == null ? 0 : data.usuario_level}
                        progress={data.usuario_experiencia}
                        message={message}
                    />
                </div>
                <div className={styles.monthCurrentContainer}>
                    <MonthValue
                        currentDate={currentDate}
                        onDateChange={handleDateChange}
                        rotation={rotation}
                        onRotationChange={handleRotationChange}
                    />
                </div>
            </div>
            <div className={styles.graph}>
                {tableData.length > 0 ? (
                    <>
                        <div className={styles.graphItem}>
                            <h2 className={styles.subtitle}>Gasto planejado vs real</h2>
                            <GraphTemplate
                                chartType="ColumnChart"
                                data={dataChart}
                                width="100%"
                                height="500px"
                                options={COLUMN_CHART_OPTIONS()}
                                legendToggle
                            />
                        </div>
                        <div className={styles.graphItem}>
                            <h2 className={styles.subtitle}>Gasto por categoria</h2>
                            <GraphTemplate
                                chartType="PieChart"
                                data={pieChartData}
                                width="100%"
                                height="500px"
                                options={PIE_CHART_OPTIONS()}
                                legendToggle
                            />
                        </div>
                        <div className={styles.tableExpense}>
                            <h1 className={styles.subtitle}>Despesas do mês</h1>
                            <div className={styles.buttonExpenseAdd}>
                                <span>Adicione novas despesas que serão refletidas no orçamento do mês atual. Gerencie suas finanças de forma eficiente e mantenha o controle sobre seus gastos mensais.</span>
                                <Button onClick={handleGoToAddExpense}>Adicionar despesas</Button>
                            </div>
                            <div className={styles.tableExpenseItem}>
                                <DataTable columns={GET_COLUMNS_EXPENSE()} data={dados} deleteRow={handleDeleteClick}
                                           rowIdAccessor="id_despesa" pdfHeaderTitle="Lista de despesas"/>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className={styles.emptyExpense}>
                        <ExpenseEmpty/>
                    </div>
                )}
            </div>
            <Modal
                show={isModalVisible}
                message={modalMessage}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
            />
        </section>
    );
};

export default HomeApp;
