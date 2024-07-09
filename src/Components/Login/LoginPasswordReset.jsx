import React from 'react';
import Input from '../Forms/Input';
import Button from '../Forms/Button';
import formUse from '../../Hooks/formUse';
import useFetch from '../../Hooks/useFetch';
import Loading from '../Helper/Loading';
import { POST_VALIDATE_TOKEN_PASSWORD } from '../../apiService';
import Error from '../Helper/Error';
import { useNavigate } from 'react-router-dom';
import CustomToast from "../Helper/CustomToast.jsx";

const LoginPasswordReset = () => {
  const [loading, setLoading] = React.useState(false);
  const [token, setToken] = React.useState('');
  const password = formUse('password');
  const confirmPassword = formUse('confirmPassword', null, password.value);
  const { status, error, request } = useFetch();
  const navigate = useNavigate();

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');

    if (tokenParam) setToken(tokenParam);
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true)


    if (password.validate() && confirmPassword.validate()) {
      const { url, options } = POST_VALIDATE_TOKEN_PASSWORD(
          token,
          password.value,
      );
      await request(url, options);

      setTimeout(()=> {
        setLoading(false)
        navigate('/login');
        CustomToast('Sua senha foi alterada com sucesso!', 'success', 3000);
      }, 2000)
    }
  }

  return (
      <section>
        <h1 className="title">Alterar senha</h1>
        <form onSubmit={handleSubmit}>
          <Input
              label="Token recebido no e-mail"
              type="text"
              name="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
          />
          <Input
              label="Nova senha"
              type="password"
              name="password"
              {...password}
          />
          <Input
              label="Confirme a senha"
              type="password"
              name="confirmPassword"
              {...confirmPassword}
          />
          {loading ? (
              <>
                <Loading />
                <Button disabled>Aguarde...</Button>
              </>
          ) : (
              <Button>Alterar senha</Button>
          )}
          <Error error={error} />
        </form>
      </section>
  );
};

export default LoginPasswordReset;
