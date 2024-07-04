import React from 'react';
import UserHeader from './UserHeader';
import { Routes, Route } from 'react-router-dom';
import HomeApp from '../Inital/HomeApp';
import BudgetUser from '../Inital/BudgetUser';
import ExpenseUser from '../Inital/ExpenseUser';
import LibraryUser from '../Inital/LibraryUser';
import UserProfile from './UserProfile';
import UserAdmin from './UserAdmin.jsx';

const User = () => {
  return (
    <section className="container">
      <UserHeader />
      <Routes>
        <Route path="/" element={<HomeApp></HomeApp>}></Route>
        <Route path="/expense" element={<ExpenseUser></ExpenseUser>}></Route>
        <Route path="/profile" element={<UserProfile></UserProfile>}></Route>
        <Route path="/budget" element={<BudgetUser></BudgetUser>}></Route>
        <Route path="/library" element={<LibraryUser></LibraryUser>}></Route>
        <Route path="/profile/admin" element={<UserAdmin></UserAdmin>}></Route>
      </Routes>
    </section>
  );
};

export default User;
