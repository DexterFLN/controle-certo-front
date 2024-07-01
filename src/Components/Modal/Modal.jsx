import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import styles from './Modal.module.css';

const Modal = ({ show, message, onClose, onConfirm }) => {
    if (!show) return null;

    return (
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                <FaExclamationTriangle className={styles.icon} />
                <h2>Você tem certeza?</h2>
                <p>{message}</p>
                <div className={styles.buttons}>
                    <button onClick={onConfirm} className={styles.confirmButton}>Deletar</button>
                    <button onClick={onClose} className={styles.cancelButton}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
