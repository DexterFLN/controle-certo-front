import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.section}>
                    <h2>Sobre Nós</h2>
                    <p>Controle certo é uma plataforma para ajudar você a gerenciar suas finanças de maneira eficiente.</p>
                </div>
                <div className={styles.section}>
                    <h2>Contato</h2>
                    <p>Telefone: (11) 1234-5678</p>
                    <p>Email: contato@controlecerto.com.br</p>
                </div>
                <div className={styles.section}>
                    <h2>Endereço</h2>
                    <p>Rua do Senac, 789</p>
                    <p>Bairro das Neves</p>
                    <p>Florianópolis, Santa Catarina</p>
                </div>
            </div>
            <div className={styles.bottomBar}>
                <p>&copy; 2024 Controle certo. Todos os direitos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;
