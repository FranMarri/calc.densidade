import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// Adiciona o Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        axios.post('http://localhost:5000/auth/login', { username, password })
            .then(response => {
                localStorage.setItem('token', response.data.token);
                navigate('/menu');
            })
            .catch(error => {
                alert('Erro ao fazer login');
            });
    };

    // CSS in-line para a tela de login
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
            padding: '50px 40px', // Aumenta o padding para mais espaçamento interno
            borderRadius: '10px',
            boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            maxWidth: '500px', // Aumenta a largura do container
            width: '100%',
        },
        logo: {
            maxWidth: '150px', // Ajusta o tamanho da logo para maior
            marginBottom: '30px', // Aumenta a margem inferior
        },
        inputWrapper: {
            position: 'relative',
            marginBottom: '20px', // Aumenta o espaçamento entre os campos
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
            padding: '15px 50px', // Aumenta o padding para dar mais espaço ao texto e ícones
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '18px', // Aumenta o tamanho do texto nos inputs
            boxSizing: 'border-box',
        },
        button: {
            width: '100%',
            padding: '16px', // Aumenta o tamanho do botão
            backgroundColor: '#4ecdc4',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px', // Aumenta o tamanho do texto no botão
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        },
        buttonHover: {
            backgroundColor: '#3fb5a8',
        },
        registerLink: {
            marginTop: '25px', // Aumenta o espaçamento acima do link
            fontSize: '16px', // Aumenta o tamanho do texto no link
            color: '#333',
        },
        registerBtn: {
            background: 'none',
            border: 'none',
            color: '#4ecdc4',
            textDecoration: 'underline',
            fontSize: '16px', // Aumenta o tamanho do botão de link
            cursor: 'pointer',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                {/* Logo acima do título */}
                <img src="/images/icon.png" alt="Logo" style={styles.logo} />

                <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>Bem-vindo de volta!</h2> {/* Aumenta o tamanho do título */}
                <p style={{ fontSize: '20px', marginBottom: '30px' }}>Por favor, insira os seus dados para continuar</p> {/* Aumenta o tamanho do subtítulo */}

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

                <button onClick={handleLogin} style={styles.button}>
                    Entrar
                </button>

                <div style={styles.registerLink}>
                    <p>Não tem conta?</p>
                    <button style={styles.registerBtn} onClick={() => navigate('/register')}>
                        Registar-se
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
