import React from 'react';
import { GET_USER, TESTE, TOKEN_VALIDATE, PUT_USER_PROFILE } from './apiService';
import { useNavigate } from 'react-router-dom';
import useFetch from "./Hooks/useFetch.jsx";

export const UserContext = React.createContext();

export const UserStorage = ({ children }) => {
  const [data, setData] = React.useState(null);
  const [login, setLogin] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();
  const {request} = useFetch()

  const userLogout = React.useCallback(async function userLogout() {
    setData(null);
    setError(null);
    setLoading(false);
    setLogin(false);
    window.localStorage.removeItem('token');
  }, []);

  async function updateUserProfile(updatedData) {
    try {
      setLoading(true);
      const {url, options } = PUT_USER_PROFILE(updatedData);
      const {response} = await request(url,options)
      if (!response.ok) throw new Error('Erro ao atualizar perfil');

      setData((prevData) => ({
        ...prevData,
        ...updatedData,
      }));

    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function getUser(token) {
    const { url, options } = GET_USER(token);
    const response = await fetch(url, options);
    const json = await response.json();
    setData(json);
    setLogin(true);
  }

  async function userLogin(username, password) {
    try {
      setError(null);
      setLoading(true);
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('grant_type', 'password');

      const { url, options } = TESTE(formData);
      console.log(options)
      const tokenResponse = await fetch(url, options);
      if (!tokenResponse.ok) throw new Error('Não foi possivel fazer o login.');
      const { access_token } = await tokenResponse.json();
      window.localStorage.setItem('token', access_token);
      await getUser(access_token);
      navigate('/user');
    } catch (err) {
      setError(err.message);
      setLogin(false);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    async function autoLogin() {
      const token = window.localStorage.getItem('token');
      if (token) {
        try {
          setError(null);
          setLoading(true);
          const { url, options } = TOKEN_VALIDATE(token);
          const response = await fetch(url, options);
          if (!response.ok) throw new Error('Token inválido.');
          await getUser(token);
        } catch (err) {
          await userLogout();
        } finally {
          setLoading(false);
        }
      } else {
        setLogin(false);
      }
    }
    autoLogin();
  }, [userLogout]);

  return (
    <UserContext.Provider
      value={{ userLogin, data, userLogout, error, loading, login, updateUserProfile }}
    >
      {children}
    </UserContext.Provider>
  );
};
