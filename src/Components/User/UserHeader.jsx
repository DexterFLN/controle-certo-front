import React from 'react';
import UserHeaderNav from './UserHeaderNav';
import { useLocation } from 'react-router-dom';
import styles from './UserHeader.module.css';

const UserHeader = () => {
  const [title, setTitle] = React.useState();
  const location = useLocation();

  React.useEffect(() => {
    setTitle(location.pathname);
    switch (location.pathname) {
      case '/user/profile':
        setTitle('Perfil do Usuário');
        break;
      case '/user/profile/admin':
        setTitle('Perfil Administrador');
        break;
      case '/user/expense':
        setTitle('Despesas');
        break;
      case '/user/budget':
        setTitle('Orçamento');
        break;
      case '/user/library':
        setTitle('Conceitos');
        break;
      default:
        setTitle('Situação do mês');
    }
  }, [location]);
  return (
    <header className={styles.header}>
      <h1 className="title">{title}</h1>
      <UserHeaderNav></UserHeaderNav>
    </header>
  );
};

export default UserHeader;
