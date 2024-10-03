import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';

function Menu({ students }) {
    const navigate = useNavigate();
    const [hoveredCard, setHoveredCard] = useState(null);

    // Estilos in-line ajustados para centralizar o container
    const styles = {
        container: {
            height: '100vh',
            display: 'flex',
            justifyContent: 'center', // Centraliza horizontalmente
            alignItems: 'center', // Centraliza verticalmente
            backgroundColor: '#f7f9fc', // Cor de fundo clara
            fontFamily: 'Arial, sans-serif',
        },
        header: {
            fontSize: '40px', // Tamanho do título maior
            marginBottom: '50px', // Espaçamento abaixo do título
            color: '#333', // Cor do texto
            fontWeight: 'bold',
            textAlign: 'center', // Centraliza o texto
        },
        cardContainer: {
            display: 'flex',
            justifyContent: 'center',
            gap: '30px', // Espaçamento entre os cartões
            flexWrap: 'wrap', // Flexível para telas menores
        },
        card: {
            backgroundColor: '#4ecdc4', // Cor vibrante do cartão
            padding: '40px',
            borderRadius: '15px',
            width: '250px',
            height: '150px',
            boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)', // Sombra suave
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '20px',
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.3s, box-shadow 0.3s', // Transições suaves
            transform: hoveredCard === 'students' ? 'scale(1.05)' : 'none',
            boxShadow: hoveredCard === 'students' ? '0px 15px 25px rgba(0, 0, 0, 0.2)' : '0px 10px 20px rgba(0, 0, 0, 0.1)',
        },
        evaluationsCard: {
            backgroundColor: '#4ecdc4', // Cor vibrante do cartão
            padding: '40px',
            borderRadius: '15px',
            width: '250px',
            height: '150px',
            boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)', // Sombra suave
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '20px',
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.3s, box-shadow 0.3s', // Transições suaves
            transform: hoveredCard === 'evaluations' ? 'scale(1.05)' : 'none',
            boxShadow: hoveredCard === 'evaluations' ? '0px 15px 25px rgba(0, 0, 0, 0.2)' : '0px 10px 20px rgba(0, 0, 0, 0.1)',
        },
        exitCard: {
            backgroundColor: '#f44336', // Cor vibrante do cartão de sair
            padding: '40px',
            borderRadius: '15px',
            width: '250px',
            height: '150px',
            boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)', // Sombra suave
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '20px',
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.3s, box-shadow 0.3s', // Transições suaves
            transform: hoveredCard === 'exit' ? 'scale(1.05)' : 'none',
            boxShadow: hoveredCard === 'exit' ? '0px 15px 25px rgba(0, 0, 0, 0.2)' : '0px 10px 20px rgba(0, 0, 0, 0.1)',
        }
    };

    return (
        <div style={styles.container}>
            <div>
                <h1 style={styles.header}>Menu Principal</h1>
                <div style={styles.cardContainer}>
                    {/* Cartão interativo para Gerenciamento de Alunos */}
                    <div
                        style={styles.card}
                        onClick={() => navigate('/students')} // Navega para o gerenciamento de alunos
                        onMouseEnter={() => setHoveredCard('students')}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        Gerenciamento de Alunos
                    </div>
                    {/* Cartão para Avaliações */}
                    <div 
                        style={styles.evaluationsCard} 
                        onClick={() => navigate('/evaluations')} // Navega para a tela de avaliações
                        onMouseEnter={() => setHoveredCard('evaluations')}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        Avaliações
                    </div>
                    {/* Cartão para Sair */}
                    <div
                        style={styles.exitCard}
                        onClick={() => alert('Saindo...')}
                        onMouseEnter={() => setHoveredCard('exit')}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        Sair
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Menu;
