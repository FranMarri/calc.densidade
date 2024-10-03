// src/EvaluationList.js

import React, { useState } from 'react';
import axios from 'axios';

const Evaluations = () => {
    const [studentName, setStudentName] = useState('');
    const [gender, setGender] = useState('feminino'); // Adicionando estado para gênero
    const [evaluations, setEvaluations] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchEvaluations = async () => {
        if (!studentName) {
            alert("Por favor, insira o nome do aluno.");
            return;
        }

        try {
            const endpoint = gender === 'masculino' 
                ? `http://localhost:5000/evaluations/masculino?name=${studentName}` 
                : `http://localhost:5000/evaluations/feminino?name=${studentName}`; // Mudança aqui
            
            const response = await axios.get(endpoint);

            if (Array.isArray(response.data)) {
                setEvaluations(response.data);
                setErrorMessage(''); // Limpa mensagens de erro anteriores
            } else {
                setEvaluations([]);
                setErrorMessage('Nenhuma avaliação encontrada.');
            }
        } catch (error) {
            console.error("Erro ao buscar avaliações:", error);
            setErrorMessage("Erro ao buscar avaliações.");
        }
    };

    const styles = {
        container: {
            width: '80%',
            margin: '0 auto',
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
        input: {
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            margin: '5px',
            width: '80%',
            maxWidth: '400px',
            fontSize: '1em',
        },
        select: {
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
        },
        evaluationTable: {
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '20px',
        },
        tableHeader: {
            backgroundColor: '#4ecdc4',
            color: 'white',
            padding: '15px',
            fontSize: '1.1em',
        },
        tableCell: {
            border: '1px solid #ddd',
            padding: '15px',
            fontSize: '1em',
        },
        errorMessage: {
            color: 'red',
            textAlign: 'center',
            marginTop: '10px',
        },
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Buscar Avaliações por Nome do Aluno</h2>
            <input
                style={styles.input}
                type="text"
                placeholder="Nome do Aluno"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
            />
            <select
                style={styles.select}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
            >
                <option value="feminino">Feminino</option>
                <option value="masculino">Masculino</option>
            </select>
            <button style={styles.button} onClick={fetchEvaluations}>Buscar Avaliações</button>
            {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
            <table style={styles.evaluationTable}>
                <thead>
                    <tr>
                        <th style={styles.tableHeader}>Data</th>
                        <th style={styles.tableHeader}>Percentual de Gordura</th>
                    </tr>
                </thead>
                <tbody>
                    {evaluations.length > 0 ? (
                        evaluations.map((evaluation, index) => (
                            <tr key={index}>
                                <td style={styles.tableCell}>{evaluation.data}</td>
                                <td style={styles.tableCell}>{evaluation.percentual_gordura}%</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2" style={styles.tableCell}>Nenhuma avaliação encontrada.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Evaluations;
