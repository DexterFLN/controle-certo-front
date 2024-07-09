import React, {useState, useEffect} from 'react';
import {GET_USERS_ADM, DELETE_USER} from '../../apiService.jsx';
import useFetch from "../../Hooks/useFetch.jsx";
import DataTable from "../Graph/DataTable.jsx";
import styles from "./UserAdmin.module.css";
import {GET_COLUMNS_USER_ADMIN_ON_APP} from "../Graph/TableColumns.jsx";
import {parse, isAfter, isBefore, isEqual, startOfDay, endOfDay} from "date-fns";
import Modal from "../Modal/Modal.jsx";
import CustomToast from "../Helper/CustomToast.jsx";

const UserAdmin = () => {
    const {request} = useFetch();
    const [dataTable, setDataTable] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [userIdToDelete, setUserIdToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState({cpf: '', startDate: '', endDate: ''});

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const {url, options} = GET_USERS_ADM();
            const {response, json} = await request(url, options);

            if (response.ok) {
                setDataTable(json);
                setFilteredData(json);
            } else {
                console.error('Erro ao buscar usuários:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
        }
    };

    const handleDeleteClick = (id) => {
        const user = dataTable.find((user) => user.id_usuario === id);
        setModalMessage(`Deseja deletar o usuário "${user.usuario_documento}"?`);
        setUserIdToDelete(id);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setUserIdToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (userIdToDelete) {
            setIsLoading(true);
            try {
                await deleteUser(userIdToDelete);
                setIsModalVisible(false);
                setUserIdToDelete(null);
                setIsLoading(false);
            } catch (error) {
                console.error('Erro ao deletar usuário:', error);
                setIsLoading(false);
            }
        }
    };

    const deleteUser = async (id) => {
        try {
            const {url, options} = DELETE_USER(id);
            const {response} = await request(url, options);
            CustomToast('Usuário deletado!', 'warning', 3000);

            if (response.ok) {
                setDataTable((prevData) => prevData.filter((user) => user.id_usuario !== id));
                setFilteredData((prevData) => prevData.filter((user) => user.id_usuario !== id));

            } else {
                console.error('Erro ao deletar usuário:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
        } finally {
            fetchUsers();
        }
    };

    const applyFilters = () => {
        let filteredUsers = dataTable;

        if (filters.cpf) {
            filteredUsers = filteredUsers.filter(user => user.usuario_documento.includes(filters.cpf));
        }

        if (filters.startDate) {
            const startDateFilter = startOfDay(parse(filters.startDate, 'yyyy-MM-dd', new Date()));
            filteredUsers = filteredUsers.filter(user => {
                const dateCreateUser = startOfDay(parse(user.usuario_dh_criacao, 'dd/MM/yyyy HH:mm:ss', new Date()));
                return isAfter(dateCreateUser, startDateFilter) || isEqual(dateCreateUser, startDateFilter);
            });
        }

        if (filters.endDate) {
            const endDateFilter = endOfDay(parse(filters.endDate, 'yyyy-MM-dd', new Date()));
            filteredUsers = filteredUsers.filter(user => {
                const dateCreateUser = endOfDay(parse(user.usuario_dh_criacao, 'dd/MM/yyyy HH:mm:ss', new Date()));
                return isBefore(dateCreateUser, endDateFilter) || isEqual(dateCreateUser, endDateFilter);
            });
        }

        setFilteredData(filteredUsers);
    };

    const handleFilterChange = (e) => {
        const {name, value} = e.target;
        setFilters((prevFilters) => ({...prevFilters, [name]: value}));
    };

    const handleClearFilters = () => {
        setFilters({cpf: '', startDate: '', endDate: ''});
        setFilteredData(dataTable);
    };

    return (
        <section className={styles.userAdmin}>
            <h1 className={styles.subtitle}>Lista de usuários</h1>
            <div className={styles.filters}>
                <div className={styles.filterField}>
                    <label className={styles.label} htmlFor="cpf">CPF</label>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="CPF"
                        name="cpf"
                        value={filters.cpf}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className={styles.filterField}>
                    <label className={styles.label} htmlFor="startDate">Data Inicial</label>
                    <input
                        className={styles.input}
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className={styles.filterField}>
                    <label className={styles.label} htmlFor="endDate">Data Final</label>
                    <input
                        className={styles.input}
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className={styles.filterActions}>
                    <button className={styles.filterButton} onClick={applyFilters}>
                        Aplicar Filtros
                    </button>
                    <button className={styles.filterButton} onClick={handleClearFilters}>
                        Limpar Filtros
                    </button>
                </div>
            </div>
            <div className={styles.tableContainer}>
                <DataTable
                    columns={GET_COLUMNS_USER_ADMIN_ON_APP()}
                    data={filteredData}
                    deleteRow={handleDeleteClick}
                    rowIdAccessor="id_usuario"
                    pdfHeaderTitle="Lista de usuários Controle Certo"
                />
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

export default UserAdmin;
