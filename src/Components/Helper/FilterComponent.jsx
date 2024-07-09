import React, { useState } from 'react';

const FilterComponent = ({ onFilter, filters }) => {
    const [cpf, setCpf] = useState(filters.cpf || '');
    const [startDate, setStartDate] = useState(filters.startDate || '');
    const [endDate, setEndDate] = useState(filters.endDate || '');

    const handleFilterChange = () => {
        onFilter({ cpf, startDate, endDate });
    };

    return (
        <div>
            <input
                type="text"
                placeholder="CPF"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
            />
            <input
                type="date"
                placeholder="Data Inicial"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
            />
            <input
                type="date"
                placeholder="Data Final"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
            />
            <button onClick={handleFilterChange}>Aplicar Filtros</button>
        </div>
    );
};

export default FilterComponent;
