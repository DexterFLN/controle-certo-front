import React, {useState, useContext, useEffect} from 'react';
import {UserContext} from '../../UserContext';
import Input from '../Forms/Input';
import Button from '../Forms/Button';
import styles from './UserProfile.module.css';
import {GET_CEP, POST_CHANGE_PASSWORD_ON_APP} from "../../apiService";
import useFetch from "../../Hooks/useFetch";
import formUse from "../../Hooks/formUse";
import Error from "../Helper/Error";
import {formatCPF, formatPhone, formatCEP} from "../Helper/formatValues.jsx";
import {validateNameUser, validateCEP, validatePhone, validateEmail} from '../Helper/validationValues.jsx';
import CustomToast from "../Helper/CustomToast.jsx";
import TermsModal from '../Modal/TermsModal.jsx'

const UserProfile = () => {
    const [currentError, setCurrentError] = useState({});
    const {data, updateUserProfile} = useContext(UserContext);
    const [editableField, setEditableField] = useState(null);
    const {request: requestCep} = useFetch();
    const {request: requestChangepassword} = useFetch();
    const [editedData, setEditedData] = useState({...data});
    const [passwordError, setPasswordError] = useState('');
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const newPassword = formUse('password');
    const confirmNewPassword = formUse('confirmPassword', null, newPassword.value);
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
    const fetchAddress = async (cep) => {
        if (!validateCEP(cep)) return;

        const {url, options} = GET_CEP(cep.replace('-', ''));
        const response = await requestCep(url, options);

        if (response && response.json) {
            const {bairro, localidade, uf} = response.json;
            const novo = {
                ...editedData,
                bairro: bairro,
                municipio: localidade,
                uf: uf || editedData.uf,
            };
            setEditedData(novo);
        } else {
            setCurrentError({
                field: 'cep',
                message: 'CEP não encontrado.'
            });
            setTimeout(() => {
                setCurrentError({});
            }, 3000);
        }
    };

    useEffect(() => {
        try {
            if (validateCEP(editedData.cep)) {
                fetchAddress(editedData.cep);
            }
        } catch (e) {

        }
    }, [editedData.cep]);

    const handleSaveChanges = async () => {
        if (editableField === 'cep') {
            const isValid = validateCEP(editedData.cep);
            if (!isValid) {
                setCurrentError({
                    field: editableField,
                    message: 'Digite um CEP válido.'
                });
                setTimeout(() => {
                    setCurrentError({});
                }, 3000);
                return;
            } else {
                await fetchAddress(editedData.cep);
            }
        }
        if (editableField === 'usuario_nome') {
            const isValid = validateNameUser(editedData.usuario_nome);
            if (!isValid) {
                setCurrentError({
                    field: editableField,
                    message: 'Digite um nome e sobrenome válidos com no máximo 50 caracteres.'
                });
                setTimeout(() => {
                    setCurrentError({});
                }, 3000);
                return;
            }
        }

        if (editableField === 'usuario_email') {
            const isValid = validateEmail(editedData.usuario_email);
            if (!isValid) {
                setCurrentError({
                    field: editableField,
                    message: 'Digite um E-mail válido.'
                });
                setTimeout(() => {
                    setCurrentError({});
                }, 3000);
                return;
            }
        }

        if (editableField === 'usuario_telefone') {
            const isValid = validatePhone(editedData.usuario_telefone);
            if (!isValid) {
                setCurrentError({
                    field: editableField,
                    message: 'Digite um telefone válido.'
                });
                setTimeout(() => {
                    setCurrentError({});
                }, 3000);
                return;
            }
        }

        const updatedProfile = {...data, ...editedData};
        updateUserProfile(updatedProfile);
        setEditableField(null);
        setEditedData(updatedProfile);
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
            email: data.usuario_email,
        };

        try {
            const {url, options} = POST_CHANGE_PASSWORD_ON_APP(body);
            const {response} = await requestChangepassword(url, options);
            if (response.ok) {
                CustomToast('Senha alterada com sucesso!', 'success', 2000);
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

    const handleEditField = (fieldName) => {
        if (editableField && editableField !== fieldName) {
            setEditedData({...data});
        }
        setEditableField(fieldName);
    };

    const handleCancelEdit = () => {
        setEditedData({...data});
        setEditableField(null);
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

    return (
        <div className={styles.profileContainer}>
            <div className={styles.personalInfo}>
                <h2 className={styles.subtitle}>Informações Pessoais</h2>

                <div className={styles.fieldWrapper}>
                    <div className={styles.fieldHeader}>
                        <span className={styles.label}>Nome:</span>
                        <button onClick={() => handleEditField('usuario_nome')} className={styles.editButton}>Editar
                        </button>
                    </div>
                    {editableField === 'usuario_nome' ? (
                        <div className={styles.editContainer}>
                            <div className={styles.inputWrapper}>
                                <Input
                                    name="usuario_nome"
                                    value={editedData.usuario_nome}
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.editActions}>
                                <Button onClick={handleSaveChanges} className={styles.saveButton}>Salvar</Button>
                                <Button onClick={handleCancelEdit} className={styles.cancelButton}>Cancelar</Button>
                            </div>
                            {currentError.field === 'usuario_nome' && <Error error={currentError.message}/>}
                        </div>
                    ) : (
                        <p>{editedData.usuario_nome}</p>
                    )}
                </div>

                <div className={styles.fieldWrapper}>
                    <div className={styles.fieldHeader}>
                        <span className={styles.label}>E-mail:</span>
                        <button onClick={() => handleEditField('usuario_email')} className={styles.editButton}>Editar
                        </button>
                    </div>
                    {editableField === 'usuario_email' ? (
                        <div className={styles.editContainer}>
                            <div className={styles.inputWrapper}>
                                <Input
                                    name="usuario_email"
                                    value={editedData.usuario_email}
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.editActions}>
                                <Button onClick={handleSaveChanges} className={styles.saveButton}>Salvar</Button>
                                <Button onClick={handleCancelEdit} className={styles.cancelButton}>Cancelar</Button>
                            </div>
                            {currentError.field === 'usuario_email' && <Error error={currentError.message}/>}
                        </div>
                    ) : (
                        <p>{editedData.usuario_email}</p>
                    )}
                </div>

                <div className={styles.fieldWrapper}>
                    <div className={styles.fieldHeader}>
                        <span className={styles.label}>Telefone:</span>
                        <button onClick={() => handleEditField('usuario_telefone')}
                                className={styles.editButton}>Editar
                        </button>
                    </div>
                    {editableField === 'usuario_telefone' ? (
                        <div className={styles.editContainer}>
                            <div className={styles.inputWrapper}>
                                <Input
                                    name="usuario_telefone"
                                    value={editedData.usuario_telefone}
                                    onChange={handleChange}
                                    className={styles.input}
                                    mask={"(99) 99999-9999"}
                                />
                            </div>
                            <div className={styles.editActions}>
                                <Button onClick={handleSaveChanges} className={styles.saveButton}>Salvar</Button>
                                <Button onClick={handleCancelEdit} className={styles.cancelButton}>Cancelar</Button>
                            </div>
                            {currentError.field === 'usuario_telefone' && <Error error={currentError.message}/>}
                        </div>
                    ) : (
                        <p>{formatPhone(editedData.usuario_telefone)}</p>
                    )}
                </div>

                <div className={styles.fieldWrapper}>
                    <div className={styles.fieldHeader}>
                        <span className={styles.label}>CPF:</span>
                    </div>
                    <p>{formatCPF(editedData.usuario_documento)}</p>
                </div>

                <div className={styles.fieldWrapper}>
                    <div className={styles.fieldHeader}>
                        <span className={styles.label}>Data de Criação:</span>
                    </div>
                    <p>{new Date(editedData.usuario_dh_criacao).toLocaleString()}</p>
                </div>

                <div className={styles.fieldWrapper}>
                    <div className={styles.fieldHeader}>
                        <span className={styles.label}>Aceite dos Termos:</span>
                    </div>
                    <div className={styles.termsContainer}>
                        <p>{editedData.usuario_aceite_termos ? 'Aceito' : 'Não Aceito'}</p>
                        <Button className={styles.editButton}
                                onClick={() => setIsTermsModalVisible(true)}>
                            Termos de Uso
                        </Button>
                    </div>
                    <TermsModal
                        show={isTermsModalVisible}
                        termsText={termsText}
                        onClose={() => setIsTermsModalVisible(false)}
                    />
                </div>
            </div>

            <div className={styles.addressInfo}>
                <h2 className={styles.subtitle}>Informações de Endereço</h2>

                <div className={styles.fieldWrapper}>
                    <div className={styles.fieldHeader}>
                        <span className={styles.label}>CEP:</span>
                        <button onClick={() => handleEditField('cep')} className={styles.editButton}>Editar</button>
                    </div>
                    {editableField === 'cep' ? (
                        <div className={styles.editContainer}>
                            <div className={styles.inputWrapper}>
                                <Input
                                    name="cep"
                                    value={editedData.cep}
                                    onChange={handleChange}
                                    className={styles.input}
                                    mask="99999-999"
                                />
                            </div>
                            <div className={styles.editActions}>
                                <Button onClick={handleSaveChanges} className={styles.saveButton}>Salvar</Button>
                                <Button onClick={handleCancelEdit} className={styles.cancelButton}>Cancelar</Button>
                            </div>
                            {currentError.field === 'cep' && <Error error={currentError.message}/>}
                        </div>
                    ) : (
                        <p>{formatCEP(editedData.cep)}</p>
                    )}
                </div>

                <div className={styles.fieldWrapper}>
                    <div className={styles.fieldHeader}>
                        <span className={styles.label}>Bairro:</span>
                    </div>
                    <p>{editedData.bairro}</p>
                </div>

                <div className={styles.fieldWrapper}>
                    <div className={styles.fieldHeader}>
                        <span className={styles.label}>Município:</span>
                    </div>
                    <p>{editedData.municipio}</p>
                </div>

                <div className={styles.fieldWrapper}>
                    <div className={styles.fieldHeader}>
                        <span className={styles.label}>UF:</span>
                    </div>
                    <p>{editedData.uf}</p>
                </div>
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
