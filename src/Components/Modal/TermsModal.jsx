import React from 'react';
import styles from './TermsModal.module.css';
import Button from '../Forms/Button';
const TermsModal = ({ show, termsText, onClose }) => {
    if (!show) return null;

    return (
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                <h2>Termos de uso</h2>
                <div className={styles.content}>
                    {termsText.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                    ))}
                </div>
                <div className={styles.buttons}>
                    <Button onClick={onClose} className={styles.closeButton}>Fechar</Button>
                </div>
            </div>
        </div>
    );
};

export default TermsModal;
