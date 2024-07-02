import React, { useEffect, useState } from 'react';
import styles from './MonthValue.module.css';
import Next from '../../Assets/IconsHeader/next-right.svg?react';
import Previous from '../../Assets/IconsHeader/previous-left.svg?react';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const MonthValue = ({ currentDate, onDateChange, rotation, onRotationChange }) => {
    useEffect(() => {
        if (onDateChange) {
            onDateChange(currentDate);
        }
    }, [currentDate, onDateChange]);

    useEffect(() => {
        if (onRotationChange) {
            onRotationChange(rotation);
        }
    }, [rotation, onRotationChange]);

    const handleNextMonth = () => {
        const newDate = addMonths(currentDate, 1);
        onDateChange(newDate);
        onRotationChange((prevRotation) => prevRotation + 36);
    };

    const handlePreviousMonth = () => {
        const newDate = subMonths(currentDate, 1);
        onDateChange(newDate);
        onRotationChange((prevRotation) => prevRotation - 36);
    };

    return (
        <div className={styles.monthcontainer}>
            <Previous className={`${styles.icon} ${styles.arrowLeft}`} onClick={handlePreviousMonth} />
            <div className={styles.monthcircleContainer}>
                <div className={styles.monthcircle} style={{ transform: `rotate(${rotation}deg)` }}></div>
                <div className={styles.monthcircletext}>
                    <div>{format(currentDate, 'MMMM', { locale: ptBR })}</div>
                    <div>{currentDate.getFullYear()}</div>
                </div>
            </div>
            <Next className={`${styles.icon} ${styles.arrowRight}`} onClick={handleNextMonth} />
        </div>
    );
};

export default MonthValue;
