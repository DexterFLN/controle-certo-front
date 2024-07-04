import React from 'react';
import styles from './GamificationCard.module.css';

const GamificationCard = ({ avatarUrl, currentLevel, progress, message }) => {
    return (
        <div className={styles.card}>
            <div className={styles.avatarWrapper}>
                <img src={avatarUrl} alt="Avatar" className={styles.avatar} />
            </div>
            <div className={styles.info}>
                <div className={styles.level}>Level: {currentLevel}</div>
                <div className={styles.progressBar}>
                    <div
                        className={styles.progress}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                {message && <div className={styles.message}>{message}</div>}
            </div>
        </div>
    );
};

export default GamificationCard;
