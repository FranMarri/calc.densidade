// src/Evaluations.js

import React, { useState } from 'react';
import axios from 'axios';

const Evaluations = () => {
    const [studentName, setStudentName] = useState('');
    const [avaliacoesFemininas, setAvaliacoesFemininas] = useState([]);
    const [avaliacoesMasculinas, setAvaliacoesMasculinas] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fetchEvaluations = async () => {
        if (!studentName.trim()) {
            alert("Por favor, insira o nome do aluno.");
            return;
        }

        setIsLoading(true);
        setErrorMessage('');
        setAvaliacoesFemininas([]);
        setAvaliacoesMasculinas([]);

        try {
            const response = await axios.get(`http://localhost:5000/evaluations/by-name`, {
                params: { name: studentName.trim() }
            });

            const { avaliacoes_femininas, avaliacoes_masculinas } = response.data;

            if (
                (avaliacoes_femininas && avaliacoes_femininas.length > 0) ||
                (avaliacoes_masculinas && avaliacoes_masculinas.length > 0)
            ) {
                setAvaliacoesFemininas(avaliacoes_femininas || []);
                setAvaliacoesMasculinas(avaliacoes_masculinas || []);
            } else {
                setErrorMessage('Nenhuma avaliação encontrada.');
            }
        } catch (error) {
            console.error("Erro ao buscar avaliações:", error);
            setErrorMessage("Erro ao buscar avaliações.");
        } finally {
            setIsLoading(false);
        }
    };

    const styles = {
        container: {
            width: '80%',
            margin: '20px auto',
            padding: '20px',
            backgroundColor: '#f0f8ff',
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
        },
        title: {
            textAlign: 'center',
            color: '#333',
            fontSize: '2em',
            marginBottom: '20px',
        },
        searchSection: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '20px',
        },
        input: {
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            margin: '5px',
            width: '80%',
            maxWidth: '400px',
            fontSize: '1em',
        },
        button: {
            padding: '10px 15px',
            backgroundColor: '#4ecdc4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            marginTop: '10px',
            fontSize: '1em',
        },
        evaluationSection: {
            marginTop: '20px',
        },
        sectionTitle: {
            color: '#333',
            fontSize: '1.5em',
            marginBottom: '10px',
        },
        evaluationTable: {
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '20px',
        },
        tableHeader: {
            backgroundColor: '#4ecdc4',
            color: 'white',
            padding: '10px',
            fontSize: '1em',
            border: '1px solid #ddd',
        },
        tableCell: {
            border: '1px solid #ddd',
            padding: '10px',
            fontSize: '0.9em',
        },
        errorMessage: {
            color: 'red',
            textAlign: 'center',
            marginTop: '10px',
        },
        loading: {
            textAlign: 'center',
            color: '#333',
            fontSize: '1.2em',
            marginTop: '10px',
        },
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Buscar Avaliações por Nome do Aluno</h2>
            <div style={styles.searchSection}>
                <input
                    style={styles.input}
                    type="text"
                    placeholder="Nome do Aluno"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            fetchEvaluations();
                        }
                    }}
                />
                <button style={styles.button} onClick={fetchEvaluations} disabled={isLoading}>
                    {isLoading ? 'Buscando...' : 'Buscar Avaliações'}
                </button>
            </div>
            {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}

            {/* Avaliações Femininas */}
            {avaliacoesFemininas.length > 0 && (
                <div style={styles.evaluationSection}>
                    <h3 style={styles.sectionTitle}>Avaliações Femininas</h3>
                    <table style={styles.evaluationTable}>
                        <thead>
                            <tr>
                                <th style={styles.tableHeader}>Data</th>
                                <th style={styles.tableHeader}>Percentual de Gordura (%)</th>
                                <th style={styles.tableHeader}>IMC</th>
                                <th style={styles.tableHeader}>Classificação IMC</th>
                                {/* Adicione mais colunas conforme necessário */}
                            </tr>
                        </thead>
                        <tbody>
                            {avaliacoesFemininas.map((evaluation) => (
                                <tr key={evaluation.id}>
                                    <td style={styles.tableCell}>{evaluation.data}</td>
                                    <td style={styles.tableCell}>{evaluation.percentual_gordura}</td>
                                    <td style={styles.tableCell}>{evaluation.imc}</td>
                                    <td style={styles.tableCell}>{evaluation.classificacao_imc}</td>
                                    {/* Adicione mais células conforme necessário */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Avaliações Masculinas */}
            {avaliacoesMasculinas.length > 0 && (
                <div style={styles.evaluationSection}>
                    <h3 style={styles.sectionTitle}>Avaliações Masculinas</h3>
                    <table style={styles.evaluationTable}>
                        <thead>
                            <tr>
                                <th style={styles.tableHeader}>Data</th>
                                <th style={styles.tableHeader}>Percentual de Gordura (%)</th>
                                <th style={styles.tableHeader}>IMC</th>
                                <th style={styles.tableHeader}>Classificação IMC</th>
                                {/* Adicione mais colunas conforme necessário */}
                            </tr>
                        </thead>
                        <tbody>
                            {avaliacoesMasculinas.map((evaluation) => (
                                <tr key={evaluation.id}>
                                    <td style={styles.tableCell}>{evaluation.data}</td>
                                    <td style={styles.tableCell}>{evaluation.percentual_gordura}</td>
                                    <td style={styles.tableCell}>{evaluation.imc}</td>
                                    <td style={styles.tableCell}>{evaluation.classificacao_imc}</td>
                                    {/* Adicione mais células conforme necessário */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Evaluations;
