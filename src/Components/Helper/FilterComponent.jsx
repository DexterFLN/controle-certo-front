import React, { useState } from 'react';
import styles from '../User/UserAdmin.module.css';

const FilterComponent = ({ onFilter }) => {
    const [cpf, setCpf] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleFilter = () => {
        onFilter(cpf, startDate, endDate);
    };

    return (
        <div className={styles.filters}>
            <div className={styles.filterField}>
                <label htmlFor="cpf" className={styles.label}>CPF:</label>
                <input
                    type="text"
                    id="cpf"
                    className={styles.input}
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="Digite o CPF"
                />
            </div>
            <div className={styles.filterField}>
                <label htmlFor="startDate" className={styles.label}>Data de Início:</label>
                <input
                    type="date"
                    id="startDate"
                    className={styles.input}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </div>
            <div className={styles.filterField}>
                <label htmlFor="endDate" className={styles.label}>Data Fim:</label>
                <input
                    type="date"
                    id="endDate"
                    className={styles.input}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>
            <button className={styles.filterButton} onClick={handleFilter}>
                Filtrar
            </button>
        </div>
    );
};

export default FilterComponent;
