import React, {useState} from 'react';
import Input from '../Forms/Input';
import Button from '../Forms/Button';
import formUse from '../../Hooks/formUse';
import {POST_USER_AUTH, POST_USER, GET_CEP, TOKEN_USER_AUTH} from '../../apiService';
import {UserContext} from '../../UserContext';
import useFetch from '../../Hooks/useFetch';
import Error from '../Helper/Error';
import Loading from '../Helper/Loading';
import Search from '../../Assets/IconsHeader/search.svg?react';
import styles from './LoginRegister.module.css';
import {useNavigate} from 'react-router-dom';
import TermsModal from '../Modal/TermsModal';
import CustomToast from "../Helper/CustomToast.jsx";

const LoginRegister = () => {
    const firstAndLastName = formUse('firstAndLastName');
    const username = formUse('cpf', '999.999.999-99');
    const email = formUse('email');
    const phonenumber = formUse('phonenumber', '(99) 99999-9999');
    const cep = formUse('cep', '99999-999');
    const bairro = formUse('district');
    const minicipio = formUse('city');
    const uf = formUse('state');
    const password = formUse('password');
    const confirmPassword = formUse('confirmPassword', null, password.value);
    const acceptTerms = formUse('acceptTerms');
    const navigate = useNavigate();

    const {data: dataCep, error: errorCep, request: requestCep} = useFetch();
    const {
        loading: loadingPostUser,
        status: statusPostUser,
        error: errorPostUser,
        request: requestPostUser
    } = useFetch();
    const {userLogin} = React.useContext(UserContext);
    const {loading, error, request} = useFetch();
    const [loadingCep, setLoadingCep] = React.useState(false);
    const [loadingUser, setLoadingUser] = React.useState(false);
    const [isTermsModalVisible, setIsTermsModalVisible] = useState(false); // Estado para controlar a visibilidade do modal
    const termsText = `
O “Controle Certo” atenderá aos dispositivos da Lei Geral de Proteção de Dados (LGPD) – Lei nº 13.709/2018, da Lei nº 12.965/2014 (Marco Civil da Internet) e do Decreto nº 8.771, de 11/05/2016. O sistema não estará autorizado para uso por indivíduos com menos de 18 anos de idade completos.
O sistema, por simplicidade e filosofia de negócio, solicitará as seguintes informações: nome, sobrenome, CPF, data de nascimento, telefone, e-mail, município e UF apenas para fins básicos de cadastro e acesso à conta Controle Certo. 
Os dados pessoais coletados serão criptografados e armazenados em nossos servidores, protegidos por políticas de segurança, com asseguramento da privacidade, da autenticidade e da inviolabilidade das informações, conforme determina o Marco Civil da Internet. O armazenamento ocorrerá enquanto o usuário possuir uma conta ativa. Após o encerramento ou exclusão da conta, os dados serão excluídos de forma imediata.
Será assegurado e garantido que todas as informações dos usuários não serão comercializadas ou divulgadas em nenhuma circunstância. Será seguido todos os protocolos de segurança recomendados.
Em caso de qualquer incidente de segurança que resulte em vazamento de dados, tanto a Autoridade Nacional de Proteção de Dados (ANPD) quanto os usuários serão prontamente notificados.
O responsável pela proteção de dados, o Data Protection Officer, estará disponível para contato por e-mail ou telefone para lidar com questões relacionadas aos dados. Ele também será encarregado de emitir comunicações, avisos, orientações e tomar medidas em resposta a comunicações da ANPD.
A política de privacidade poderá ser revisada periodicamente para refletir alterações nas práticas de privacidade. Os usuários serão informados sobre quaisquer mudanças significativas.
`;

    function validateAllFields() {
        const isValid = [
            firstAndLastName.validate(),
            username.validate(),
            email.validate(),
            cep.validate(),
            bairro.validate(),
            minicipio.validate(),
            uf.validate(),
            password.validate(),
            confirmPassword.validate(),
            acceptTerms.validate(),
        ].every(Boolean);
        return isValid;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setLoadingUser(true);
        if (!validateAllFields()) {
            setLoadingUser(false);
            return;
        }

        if (password.value !== confirmPassword.value) {
            confirmPassword.setError('As senhas não coincidem.');
            setLoadingUser(false);
            return;
        }

        const body = {
            username: username.value,
            password: password.value,
            email: email.value,
        };

        try {
            const {url, options} = POST_USER_AUTH(body);
            const {response} = await request(url, options);
            console.log(response)
            if (response.ok) {
                const requestUser = {
                    nome_usuario: firstAndLastName.value,
                    email_usuario: email.value,
                    numero_telefone: phonenumber.value,
                    uf: uf.value,
                    municipio: minicipio.value,
                    bairro: bairro.value,
                    cep: cep.value,
                    data_aceite_termos: true
                };

                const accessToken = await TOKEN_USER_AUTH(username, password);
                console.log('Received Access Token:', accessToken);
                window.localStorage.setItem('token', accessToken);

                const {url, options} = POST_USER(requestUser, window.localStorage.getItem('token'));
                console.log(options);
                await requestPostUser(url, options);
                console.log(statusPostUser);
                setTimeout(() => {
                    setLoadingCep(false);
                }, 3000);
                console.log(dataCep);
                setTimeout(() => {
                    setLoadingUser(false);
                }, 3000);
                navigate('/login');
                CustomToast("Seu perfil foi criado, agora utilize o CPF e senha informada para realizar o login!", 'info', 5000);
            } else {
                setTimeout(() => {
                    setLoadingUser(false);
                }, 3000);
            }
        } catch (error) {
            console.log(loadingUser)
            console.log(loadingCep)
            console.error('Failed to get access token:');
            setLoadingUser(false);
        }
    }

    async function handleCep(event) {
        event.preventDefault();
        setLoadingCep(true);
        try {
            const {url, options} = GET_CEP(cep.value.replace('-', ''));
            const {json} = await requestCep(url, options);
            setTimeout(() => {
                setLoadingCep(false);
            }, 2000);
            bairro.setValue(json.bairro || '');
            minicipio.setValue(json.localidade || '');
            uf.setValue(json.uf || '');
        } catch (error) {
            setLoadingCep(false)
        }
    }

    return (
        <section>
            <h1 className="title">Cadastre-se</h1>
            <form onSubmit={handleSubmit}>
                <Input
                    label="Nome do usuário"
                    type="text"
                    name="firstAndLastName"
                    {...firstAndLastName}
                />
                <Input
                    label="CPF"
                    type="text"
                    name="username"
                    mask="999.999.999-99"
                    {...username}
                />
                <Input label="E-mail" type="text" name="email" {...email} />
                <Input
                    label="Telefone"
                    type="text"
                    name="phonenumber"
                    mask="(99) 99999-9999"
                    {...phonenumber}
                />
                <div className={styles.cepContainer}>
                    <Input label="CEP" type="text" name="cep" {...cep} />
                    <button className={styles.cepButton} onClick={handleCep}>
                        <Search/>
                    </button>
                </div>
                <Input label="Bairro" type="text" name="bairro" {...bairro} />
                <Input label="Município" type="text" name="minicipio" {...minicipio} />
                <Input label="UF" type="text" name="uf" {...uf} />
                <Input label="Senha" type="password" name="password" {...password} />
                <Input
                    label="Confirmar senha"
                    type="password"
                    name="confirmPassword"
                    {...confirmPassword}
                    onBlur={() => {
                        if (password.value !== confirmPassword.value) {
                            confirmPassword.setError('As senhas não coincidem.');
                        } else {
                            confirmPassword.setError(null);
                        }
                    }}
                />
                <div className={styles.termsContainer}>
                    <input
                        type="checkbox"
                        id="acceptTerms"
                        name="acceptTerms"
                        checked={acceptTerms.value}
                        onChange={acceptTerms.onChange}
                        onFocus={acceptTerms.onFocus}
                        onBlur={acceptTerms.onBlur}
                    />
                    <label htmlFor="acceptTerms" className={styles.termsLabel}>
                        Eu li e aceito os
                        <button
                            type="button"
                            className={styles.termsButton}
                            onClick={() => setIsTermsModalVisible(true)}
                        >
                            Termos de Uso
                        </button>
                    </label>
                </div>
                {acceptTerms.error && <Error error={acceptTerms.error}/>}
                {loadingUser || loadingCep ? (
                    <>
                        <Loading/>
                        <Button disabled>Cadastrando...</Button>
                    </>
                ) : (
                    <Button>Cadastrar</Button>
                )}
                {
                    <Error error={error}/>
                }
            </form>
            <TermsModal
                show={isTermsModalVisible}
                termsText={termsText}
                onClose={() => setIsTermsModalVisible(false)}
            />
        </section>
    );
};

export default LoginRegister;
