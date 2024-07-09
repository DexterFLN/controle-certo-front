import React from 'react';
import Input from '../Forms/Input';
import Button from '../Forms/Button';
import formUse from '../../Hooks/formUse';
import useFetch from '../../Hooks/useFetch';
import Loading from '../Helper/Loading';
import {POST_REQUEST_TOKEN_PASSWORD} from '../../apiService';
import {useNavigate} from 'react-router-dom';
import CustomToast from "../Helper/CustomToast.jsx";

const LoginPasswordLost = () => {
        const username = formUse('cpf', '999.999.999-99');
        const email = formUse('email');
        const {request} = useFetch();
        const [error, setError] = React.useState(null);
        const [loading, setLoading] = React.useState(false);
        const navigate = useNavigate();

        function validateAllFields() {
            const isValid = [username.validate(), email.validate()].every(Boolean);
            return isValid;
        }

        async function handleSubmit(event) {
            event.preventDefault();
            setLoading(true);

            if (!validateAllFields()) {
                setLoading(false);
                return;
            }

            try {
                const {url, options} = POST_REQUEST_TOKEN_PASSWORD(
                    username.value,
                    email.value,
                );
                await request(url, options);
                window.localStorage.removeItem('token');

            } catch (e) {
                console.log(e);
                setLoading(false);
            }
            setTimeout(() => {
                setLoading(false);
                navigate('/login');
                CustomToast("E-mail para troca de senha enviado!", 'info', 3000)
            }, 3000);
        }

        return (
            <section>
                <h1 className="title">Esqueceu a senha?</h1>
                <form onSubmit={handleSubmit}>
                    <Input label="CPF" type="text" name="username" {...username} />
                    <Input label="E-mail" type="email" name="email" {...email} />
                    {loading ? (
                        <>
                            <Loading/>
                            <Button disabled>Enviando E-mail...</Button>
                        </>
                    ) : (
                        <Button>Enviar E-mail</Button>
                    )}
                    {error && <p className="error">{error}</p>}

                </form>
            </section>
        );
    }
;

export default LoginPasswordLost;
