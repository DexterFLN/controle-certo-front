import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import Home from '../../Assets/feed.svg?react';
import Expense from '../../Assets/IconsHeader/addExpense.svg?react';
import Library from '../../Assets/IconsHeader/library.svg?react';
import Budget from '../../Assets/IconsHeader/budget.svg?react';
import Logout from '../../Assets/IconsHeader/logout.svg?react';
import styles from './UserHeaderNav.module.css';
import useMedia from '../../Hooks/useMedia';

const UserHeaderNav = () => {
  const mobile = useMedia('(max-width: 40rem)');
  const { userLogout } = React.useContext(UserContext);
  const [mobileMenu, setMobileMenu] = React.useState(false);

  const { pathname } = useLocation();
  React.useEffect(() => {
    setMobileMenu(false);
  }, [pathname]);

  const navigate = useNavigate();
  function handleLogout() {
    userLogout();
    navigate('/login');
  }

  return (
    <>
      {mobile && (
        <button
          aria-label="Menu"
          className={`${styles.mobileButton} ${
            mobileMenu && styles.mobileButtonActive
          }`}
          onClick={() => setMobileMenu(!mobileMenu)}
        ></button>
      )}
      <nav
        className={`${mobile ? styles.navMobile : styles.nav} ${
          mobileMenu && styles.navMobileActive
        }`}
      >
        <NavLink to="/user" end>
          <Home />
          {mobile && 'Home'}
        </NavLink>
        <NavLink to="expense">
          <Expense />
          {mobile && 'Despesas'}
        </NavLink>
        <NavLink to="budget">
          <Budget />
          {mobile && 'Orçamento'}
        </NavLink>
        <NavLink to="library">
          <Library />
          {mobile && 'Conceitos'}
        </NavLink>
        <button onClick={handleLogout}>
          <Logout />
          {mobile && 'Sair'}
        </button>
      </nav>
    </>
  );
};

export default UserHeaderNav;
