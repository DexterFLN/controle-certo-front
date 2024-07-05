import React, {useState, useContext} from 'react';
import {UserContext} from '../../UserContext';
import Input from '../Forms/Input';
import Button from '../Forms/Button';
import styles from './UserProfile.module.css';
import {GET_CEP, POST_CHANGE_PASSWORD_ON_APP} from "../../apiService";
import useFetch from "../../Hooks/useFetch";
import formUse from '../../Hooks/formUse';
import Error from "../Helper/Error";

const UserProfile = () => {
    const [error, setError] = useState('');
    const {data, updateUserProfile} = useContext(UserContext);
    const [editableField, setEditableField] = useState(null);
    const {data: dataCep, request: requestCep} = useFetch();
    const {request: requestChangepassword} = useFetch();
    const [editedData, setEditedData] = useState({...data});
    const [passwordError, setPasswordError] = useState('');
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const usuarioNome = formUse('firstAndLastName', null, editedData.usuario_nome);
    const usuarioEmail = formUse('email', null, editedData.usuario_email);
    const usuarioTelefone = formUse('phonenumber', '(99) 99999-9999', editedData.usuario_telefone);
    const cep = formUse('cep', '99999-999', data.cep);
    const newPassword = formUse('password');
    const confirmNewPassword = formUse('confirmPassword', null, newPassword.value);

    const fetchAddress = async (cep) => {
        try {
            const {url, options} = GET_CEP(cep.replace('-', ''));
            const response = await requestCep(url, options);
            if (response && response.json) {
                const {bairro, localidade, uf} = response.json;
                setEditedData((prevData) => ({
                    ...prevData,
                    bairro,
                    municipio: localidade,
                    uf,
                }));
            }
        } catch (error) {
            console.error('Erro ao buscar o endereço:', error);
        }
    };

    const handleSaveChanges = async () => {
        let validate = false;
        setError("error");
        if (editableField === 'cep') {
            validate = cep.validate();
            if (!validate) {
                setError(cep.error);
            } else {
                await fetchAddress(editedData.cep);
            }
        }

        updateUserProfile(editedData);
        setEditableField(null);
    };

    const handlePasswordChange = async () => {
        if (newPassword.value !== confirmNewPassword.value) {
            setPasswordError('As senhas não são iguais.');
            setTimeout(() => setPasswordError(''), 5000);
            return false;
        }
        if (!newPassword.validate() || !confirmNewPassword.validate()) {
            setPasswordError(newPassword.error || confirmNewPassword.error);
            setTimeout(() => setPasswordError(''), 5000);
            return false;
        }
        setPasswordError('');

        const body = {
            new_password: newPassword.value,
            old_password: passwordData.currentPassword,
            email: usuarioEmail.value,
        };

        try {
            const {url, options} = POST_CHANGE_PASSWORD_ON_APP(body);
            const {response} = await requestChangepassword(url, options);
            if (response.ok) {
                alert('Senha alterada!');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmNewPassword: '',
                });
                newPassword.reset();
                confirmNewPassword.reset();
            } else {
                setPasswordError('A senha atual não está correta.');
                setTimeout(() => setPasswordError(''), 5000);
            }
        } catch (error) {
            setPasswordError('Erro ao alterar a senha. Por favor, tente novamente.');
            setTimeout(() => setPasswordError(''), 5000);
            console.error(error);
        }

        return true;
    };

    const handleCancelEdit = () => {
        setEditedData({...data});
        setEditableField(null);
    };

    const handleEditField = (fieldName) => {
        setEditableField(fieldName);
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setEditedData({
            ...editedData,
            [name]: value,
        });
    };

    const handlePasswordInputChange = (e) => {
        const {name, value} = e.target;
        setPasswordData({
            ...passwordData,
            [name]: value,
        });
        if (name === 'newPassword') {
            newPassword.setValue(value);
            confirmNewPassword.setValue(passwordData.confirmNewPassword);
        }
        if (name === 'confirmNewPassword') {
            confirmNewPassword.setValue(value);
        }
    };

    const renderField = (label, name, value, editable) => {
        const isEditable = editable && editableField === name;

        return (
            <div className={styles.fieldWrapper} key={name}>
                <div className={styles.fieldHeader}>
                    <span className={styles.label}>{label}:</span>
                    {editable && !isEditable && (
                        <button onClick={() => handleEditField(name)} className={styles.editButton}>
                            Editar
                        </button>
                    )}
                </div>
                {isEditable ? (
                    <div className={styles.editContainer}>
                        <div className={styles.inputWrapper}>
                            <Input
                                name={name}
                                value={editedData[name]}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>
                        {error && <p>{error}</p>}
                        <div className={styles.editActions}>
                            <Button onClick={handleSaveChanges} className={styles.saveButton}>
                                Salvar
                            </Button>
                            <Button onClick={handleCancelEdit} className={styles.cancelButton}>
                                Cancelar
                            </Button>
                        </div>
                    </div>
                ) : (
                    <p>{value}</p>
                )}
            </div>
        );
    };

    return (
        <div className={styles.profileContainer}>
            <div className={styles.personalInfo}>
                <h2 className={styles.subtitle}>Informações Pessoais</h2>
                {renderField('Nome', 'usuario_nome', data.usuario_nome, true)}
                {renderField('E-mail', 'usuario_email', data.usuario_email, true)}
                {renderField('Telefone', 'usuario_telefone', data.usuario_telefone, true)}
                <div className={styles.fieldWrapper}>
                    <div className={styles.fieldHeader}>
                        <span className={styles.label}>CPF:</span>
                    </div>
                    <p>{data.usuario_documento}</p>
                </div>
                <div className={styles.fieldWrapper}>
                    <div className={styles.fieldHeader}>
                        <span className={styles.label}>Data de Criação:</span>
                    </div>
                    <p>{new Date(data.usuario_dh_criacao).toLocaleString()}</p>
                </div>
                <div className={styles.fieldWrapper}>
                    <div className={styles.fieldHeader}>
                        <span className={styles.label}>Aceite dos Termos:</span>
                    </div>
                    <p>{data.usuario_aceite_termos ? 'Aceito' : 'Não Aceito'}</p>
                </div>
            </div>
            <div className={styles.addressInfo}>
                <h2 className={styles.subtitle}>Informações de Endereço</h2>
                {renderField('CEP', 'cep', editedData.cep, true)}
                {renderField('Bairro', 'bairro', editedData.bairro, false)}
                {renderField('Município', 'municipio', editedData.municipio, false)}
                {renderField('UF', 'uf', editedData.uf, false)}
            </div>
            <div className={styles.passwordChange}>
                <h2 className={styles.subtitle}>Troca de Senha</h2>
                <Input
                    label="Senha Atual"
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordInputChange}
                    className={styles.input}
                />
                <Input
                    label="Nova Senha"
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                    onBlur={newPassword.onBlur}
                    onFocus={newPassword.onFocus}
                    className={styles.input}
                />
                {newPassword.error && <Error error={newPassword.error}/>}
                <Input
                    label="Confirmar Nova Senha"
                    type="password"
                    name="confirmNewPassword"
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordInputChange}
                    onBlur={confirmNewPassword.onBlur}
                    onFocus={confirmNewPassword.onFocus}
                    className={styles.input}
                />
                {confirmNewPassword.error && <Error error={confirmNewPassword.error}/>}
                {passwordError && <Error error={passwordError}/>}
                <Button onClick={handlePasswordChange}>Trocar Senha</Button>
            </div>
        </div>
    );
};

export default UserProfile;
