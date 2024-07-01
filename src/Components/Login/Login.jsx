import React from 'react';
import LoginRegister from './LoginRegister';
import LoginPasswordLost from './LoginPasswordLost';
import LoginForm from './LoginForm';
import LoginPasswordReset from './LoginPasswordReset';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import styles from './Login.module.css';

const Login = () => {
  const { login } = React.useContext(UserContext);

  if (login === true) return <Navigate to="/user" />;

  return (
    <section className={styles.login}>
      <div className={styles.forms}>
        <Routes>
          <Route path="/" element={<LoginForm />}></Route>
          <Route path="register" element={<LoginRegister />}></Route>
          <Route path="lost-password" element={<LoginPasswordLost />}></Route>
          <Route path="reset-password" element={<LoginPasswordReset />}></Route>
        </Routes>
      </div>
    </section>
  );
};

export default Login;
