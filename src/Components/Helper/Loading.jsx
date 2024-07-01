import React from 'react';
import styles from './Loading.module.css';
import Spinner from './Spinner';

const Loading = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.loading}>
        <Spinner />
      </div>
    </div>
  );
};

export default Loading;
