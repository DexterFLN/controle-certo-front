import React, {useState, useEffect} from 'react';
import {GET_USERS_ADM, DELETE_USER} from '../../apiService.jsx';
import useFetch from "../../Hooks/useFetch.jsx";
import DataTable from "../Graph/DataTable.jsx";
import styles from "./UserAdmin.module.css";
import {GET_COLUMNS_USER_ADMIN_ON_APP} from "../Graph/TableColumns.jsx";
import {format, parseISO} from "date-fns";
import Modal from "../Modal/Modal.jsx";
import FilterComponent from "../Helper/FilterComponent.jsx";

const UserAdmin = () => {
    const {request} = useFetch();
    const [dataTable, setDataTable] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [userIdToDelete, setUserIdToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const {url, options} = GET_USERS_ADM();
            const {response, json} = await request(url, options);

            if (response.ok) {
                json.forEach((user) => {
                    user.usuario_dh_criacao = format(new Date(user.usuario_dh_criacao), 'dd/MM/yyyy');
                });
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

            if (response.ok) {
                setDataTable((prevData) => prevData.filter((user) => user.id_usuario !== id));
                setFilteredData((prevData) => prevData.filter((user) => user.id_usuario !== id));
            } else {
                console.error('Erro ao deletar usuário:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
        }
    };

    const applyFilters = (cpf, startDate, endDate) => {
        let filteredUsers = dataTable;
        console.log(filteredUsers)
        if (cpf) {
            filteredUsers = filteredUsers.filter(user => user.usuario_documento.includes(cpf));
        }

        if (startDate) {
            const parsedStartDate = parseISO(startDate);
            filteredUsers = filteredUsers.filter(user => {
                const userDate = parseISO(user.usuario_dh_criacao);
                return userDate >= parsedStartDate;
            });
        }

        if (endDate) {
            const parsedEndDate = parseISO(endDate);
            filteredUsers = filteredUsers.filter(user => {
                const userDate = parseISO(user.usuario_dh_criacao);
                return userDate <= parsedEndDate;
            });
        }

        setFilteredData(filteredUsers);
    };

    return (
        <section className={styles.userAdmin}>
            <h1 className={styles.subtitle}>Lista de usuários</h1>
            <div className={styles.filterContainer}>
                <FilterComponent onFilter={applyFilters}/>
                <button className={styles.clearFilterButton} onClick={() => setFilteredData(dataTable)}>
                    Limpar Filtros
                </button>
            </div>
            <DataTable
                columns={GET_COLUMNS_USER_ADMIN_ON_APP()}
                data={filteredData}
                deleteRow={handleDeleteClick}
                rowIdAccessor="id_usuario"
                pdfHeaderTitle="Lista de usuários Controle Certo"
            />
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
