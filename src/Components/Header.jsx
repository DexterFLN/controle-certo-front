import React from 'react';
import styles from './Header.module.css';
import {Link} from 'react-router-dom';
import {UserContext} from '../UserContext';
import jwt_decode from 'jwt-decode';

const Header = () => {
    const {data} = React.useContext(UserContext);

    let profile = null;
    try {
        const token = window.localStorage.getItem('token')
        if (token !== null) {
            const result = jwt_decode(window.localStorage.getItem('token'));
            console.log(result)
            profile = result.authorities[0];
        }
    } catch (error) {
        console.error('Erro ao decodificar o token:', error);
    }

    return (
        <div className={styles.header}>
            <nav className={`${styles.nav} container`}>
                {profile === 'ROLE_ADMIN' && (
                    <Link className={styles.loginAdmin} to={`/user/profile/admin`}>
                    </Link>
                )}
                <Link className={styles.logo} to="/" aria-label="Coin - Home"></Link>
                {data ? (
                    <Link className={styles.login} to="user/profile">
                        {data.usuario_email}
                    </Link>
                ) : (
                    <Link className={styles.login} to="/login">
                        Login / Criar
                    </Link>
                )}
            </nav>
        </div>
    );
};

export default Header;
