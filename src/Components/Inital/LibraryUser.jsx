import React, { useState } from 'react';
import styles from './LibraryUser.module.css';
import investmentData from '../Helper/InvestmentData.jsx';

const LibraryUser = () => {
    const [selectedInvestment, setSelectedInvestment] = useState(null);

    const handleItemClick = (index) => {
        setSelectedInvestment(index);
    };

    const handleSubTitleClick = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className={styles.investmentConcepts}>
            <div className={styles.investmentTypes}>
                <h2>Tipos de Investimentos</h2>
                <ul>
                    {investmentData.map((investment, index) => (
                        <li
                            key={index}
                            className={index === selectedInvestment ? styles.selected : ''}
                            onClick={() => handleItemClick(index)}
                        >
                            {investment.type}
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles.investmentText}>
                <h2>Conceitos</h2>
                {selectedInvestment !== null ? (
                    <div className={styles.conceptText}>
                        <h3 onClick={() => handleSubTitleClick('concept')}>
                            {investmentData[selectedInvestment].type}
                        </h3>
                        <p>{investmentData[selectedInvestment].text}</p>
                        {investmentData[selectedInvestment].image && (
                            <img
                                src={investmentData[selectedInvestment].image}
                                alt={investmentData[selectedInvestment].type}
                                className={styles.investmentImage}
                            />
                        )}
                        <div className={styles.summary}>
                            <h3>Sumário</h3>
                            <ul>
                                {investmentData[selectedInvestment].details.map((detail, i) => (
                                    <li key={i}>
                                        <a onClick={() => handleSubTitleClick(`detail-${i}`)}>
                                            {detail.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {investmentData[selectedInvestment].details.map((detail, i) => (
                            <div key={i}>
                                <h3 onClick={() => handleSubTitleClick(`detail-${i}`)} id={`detail-${i}`}>
                                    {detail.title}
                                </h3>
                                {detail.content.map((paragraph, j) => (
                                    <p key={j}>{paragraph}</p>
                                ))}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.noConcept}>
                        <p>Selecione um tipo de investimento para ver os conceitos detalhados.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default LibraryUser;
