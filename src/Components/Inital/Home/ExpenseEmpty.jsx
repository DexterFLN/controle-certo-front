import React from 'react';
import styles from './ExpenseEmpty.module.css';
import Button from '../../Forms/Button.jsx'
import {useNavigate} from 'react-router-dom';

const ExpenseEmpty = () => {
    const navigate = useNavigate();

    const handleGoToBudget = () => {
        navigate('/user/budget');
    };

    const handleGoToAddExpense = () => {
        navigate('/user/expense');
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.title}>Nenhuma Despesa Lançada</div>
                <p className={styles.text}>
                    Parece que você ainda não fez nenhum lançamento de despesa para este mês. Não se preocupe!
                    Você pode criar o seu orçamento mensal e depois adicionar suas despesas conforme necessário.
                </p>
                <div className={styles.buttonContainer}>
                    <Button onClick={handleGoToBudget}>
                        Criar Orçamento Mensal
                    </Button>
                </div>
                <p className={styles.text}>
                    Caso já tenha um orçamento criado, pode lançar as suas despesas agora mesmo.
                </p>

                <div className={styles.buttonContainer}>
                    <Button onClick={handleGoToAddExpense}>
                        Adicionar Despesa
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ExpenseEmpty;
