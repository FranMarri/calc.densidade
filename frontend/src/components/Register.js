import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// Adiciona o Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = () => {
        if (password !== confirmPassword) {
            alert('As senhas não coincidem.');
            return;
        }

        axios.post('http://localhost:5000/auth/register', { username, password })
            .then(response => {
                alert('Registrado com sucesso!');
                navigate('/login');
            })
            .catch(error => {
                alert('Erro ao registrar. Nome de usuário pode estar em uso.');
            });
    };

    // CSS in-line para a tela de registro
    const styles = {
        container: {
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundImage: 'url("/images/background.png")', // Caminho correto para a imagem de fundo
            backgroundSize: 'cover', // Ajuste para cobrir a tela
            backgroundPosition: 'center', // Centraliza a imagem
            backgroundRepeat: 'no-repeat', // Evita repetição da imagem
        },
        box: {
            backgroundColor: '#a0e7e5',
            padding: '50px 40px', // Aumentando o padding
            borderRadius: '10px',
            boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            maxWidth: '500px', // Aumenta o tamanho do container
            width: '100%',
        },
        logo: {
            maxWidth: '120px', // Aumenta o tamanho da logo
            marginBottom: '25px',
        },
        inputWrapper: {
            position: 'relative',
            marginBottom: '20px',
        },
        icon: {
            position: 'absolute',
            top: '50%',
            left: '10px',
            transform: 'translateY(-50%)',
            color: '#666',
            fontSize: '20px', // Aumenta o tamanho dos ícones
        },
        input: {
            width: '100%',
            padding: '15px 50px', // Aumenta o padding para dar mais espaço ao texto
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '20px', // Aumenta o tamanho do texto nos inputs
            boxSizing: 'border-box',
        },
        button: {
            width: '100%',
            padding: '16px', // Aumenta o tamanho do botão
            backgroundColor: '#4ecdc4',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px', // Aumenta o tamanho do texto do botão
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        },
        buttonHover: {
            backgroundColor: '#3fb5a8',
        },
        loginLink: {
            marginTop: '25px', // Aumenta o espaçamento acima do link
            fontSize: '22px', // Aumenta o tamanho do texto no link
            color: '#333',
        },
        loginBtn: {
            background: 'none',
            border: 'none',
            color: '#333',
            textDecoration: 'underline',
            fontSize: '19px', // Aumenta o tamanho do botão de link
            cursor: 'pointer',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>Crie sua conta</h2> {/* Aumenta o tamanho do título */}
                <p style={{ fontSize: '18px', marginBottom: '30px' }}>Preencha os campos para se registar</p> {/* Aumenta o tamanho da descrição */}

                {/* Campo de Nome de Utilizador com ícone */}
                <div style={styles.inputWrapper}>
                    <FontAwesomeIcon icon={faUser} style={styles.icon} />
                    <input
                        type="text"
                        placeholder="Nome de Utilizador"
                        onChange={(e) => setUsername(e.target.value)}
                        style={styles.input}
                    />
                </div>

                {/* Campo de Palavra-passe com ícone */}
                <div style={styles.inputWrapper}>
                    <FontAwesomeIcon icon={faLock} style={styles.icon} />
                    <input
                        type="password"
                        placeholder="Palavra-passe"
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                    />
                </div>

                {/* Campo de Confirmar Palavra-passe com ícone */}
                <div style={styles.inputWrapper}>
                    <FontAwesomeIcon icon={faLock} style={styles.icon} />
                    <input
                        type="password"
                        placeholder="Confirmar Palavra-passe"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={styles.input}
                    />
                </div>

                <button onClick={handleRegister} style={styles.button}>
                    Registar
                </button>

                <div style={styles.loginLink}>
                    <p>Já tem uma conta?</p>
                    <button style={styles.loginBtn} onClick={() => navigate('/login')}>
                        Voltar ao Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Register;
