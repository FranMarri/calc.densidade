// src/components/Students.js

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [newStudent, setNewStudent] = useState({
        name: '',
        cep: '',
        address: '',
        phone: '',
        gender: '',
        birthDate: ''
    });
    const [editingStudentId, setEditingStudentId] = useState(null);
    const [visibleEvaluations, setVisibleEvaluations] = useState({});
    const [studentName, setStudentName] = useState('');

    const navigate = useNavigate();

    const getStudents = useCallback(() => {
        axios.get('http://localhost:5000/students')
            .then(response => {
                const studentsWithAge = response.data.map(student => ({
                    ...student,
                    age: calculateAge(student.birthDate)
                }));
                setStudents(studentsWithAge);
            })
            .catch(error => {
                alert('Erro ao carregar alunos.');
                console.error(error);
            });
    },[])

    useEffect(() => {
        getStudents();
        
    }, []);

    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDifference = today.getMonth() - birth.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const fetchAddress = async (cep) => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            if (response.data && !response.data.erro) {
                setNewStudent(prev => ({
                    ...prev,
                    address: `${response.data.logradouro}, ${response.data.bairro}, ${response.data.localidade} - ${response.data.uf}` // Endereço completo
                }));
            } else {
                alert('CEP inválido!');
            }
        } catch (error) {
            alert('Erro ao buscar endereço.');
            console.error(error);
        }
    };

    const addStudent = () => {
        axios.post('http://localhost:5000/students/add', newStudent)
            .then(response => {
                setStudents([...students, { id: response.data.id, ...newStudent, age: calculateAge(newStudent.birthDate), active: true }]);
                setNewStudent({ name: '', cep: '', address: '', phone: '', gender: '', birthDate: '' });
            })
            .catch(error => {
                alert('Erro ao adicionar aluno.');
                console.error(error);
            });
    };

    const updateStudent = (id, updatedInfo) => {
        axios.put(`http://localhost:5000/students/${id}`, updatedInfo)
            .then(() => {
                setStudents(students.map(student => (student.id === id ? { ...student, ...updatedInfo, age: calculateAge(updatedInfo.birthDate) } : student)));
                setEditingStudentId(null);
                setNewStudent({ name: '', cep: '', address: '', phone: '', gender: '', birthDate: '' });
            })
            .catch(error => {
                alert('Erro ao atualizar aluno.');
                console.error(error);
            });
    };

    const handleEditClick = (student) => {
        setEditingStudentId(student.id);
        setNewStudent({
            name: student.name,
            cep: '', // O CEP não está armazenado, então pode ser deixado vazio ou ajustado conforme necessário
            address: student.address,
            phone: student.phone,
            gender: student.gender,
            birthDate: student.birthDate
        });
    };

    const deleteStudent = (id) => {
        axios.delete(`http://localhost:5000/students/${id}`)
            .then(() => {
                setStudents(students.filter(student => student.id !== id));
            })
            .catch(error => {
                alert('Erro ao excluir aluno.');
                console.error(error);
            });
    };

    const handleAddEvaluation = (student) => {
        if (student.gender === 'Masculino') {
            navigate('/avaliacao-masculina', { state: { alunoId: student.id, nome: student.name, idade: student.age } });
        } else if (student.gender === 'Feminino') {
            navigate('/avaliacao-feminina', { state: { alunoId: student.id, nome: student.name, idade: student.age } });
        }
    };

    const fetchLastEvaluations = async (studentId) => {
        try {
            const response = await axios.get(`http://localhost:5000/evaluations/${studentId}`);
            const { avaliacoes_femininas, avaliacoes_masculinas } = response.data;

            // Combinar as avaliações femininas e masculinas em um único array
            const combinedEvaluations = [
                ...avaliacoes_femininas.map(evalFem => ({ ...evalFem, tipo: 'Feminina' })),
                ...avaliacoes_masculinas.map(evalMasc => ({ ...evalMasc, tipo: 'Masculina' })),
            ];

            // Ordenar as avaliações por data (assumindo que 'data' está em formato ISO ou semelhante)
            combinedEvaluations.sort((a, b) => new Date(b.data) - new Date(a.data));

            return combinedEvaluations;
        } catch (error) {
            console.error("Erro ao buscar avaliações:", error);
            alert("Erro ao buscar avaliações.");
            return [];
        }
    };

    const generateComparativeData = (evaluations) => {
        if (evaluations.length < 2) {
            return null;
        }

        const [latest, secondLatest] = evaluations;

        const comparison = {};

        // Lista de campos para comparar com suas respectivas unidades
        const fieldsToCompare = [
            { field: 'peso', label: 'Peso (kg)' },
            { field: 'altura', label: 'Altura (cm)' },
            { field: 'peitoral', label: 'Peitoral (cm)' },
            { field: 'axilar_media', label: 'Axilar Média (cm)' },
            { field: 'triceps', label: 'Tríceps (cm)' },
            { field: 'subescapular', label: 'Subescapular (cm)' },
            { field: 'abdomen', label: 'Abdomen (cm)' },
            { field: 'supra_iliaca', label: 'Supra Iliaca (cm)' },
            { field: 'coxa', label: 'Coxa (cm)' },
            { field: 'percentual_gordura', label: 'Percentual de Gordura (%)' },
            { field: 'percentual_massa_magra', label: 'Percentual de Massa Magra (%)' },
            { field: 'massa_gordura_kg', label: 'Massa de Gordura (kg)' },
            { field: 'massa_magra_kg', label: 'Massa Magra (kg)' },
            { field: 'imc', label: 'IMC' }
        ];

        fieldsToCompare.forEach(({ field, label }) => {
            const latestValue = latest[field];
            const secondValue = secondLatest[field];
            const difference = latestValue - secondValue;
            comparison[label] = {
                latest: latestValue,
                previous: secondValue,
                difference: difference.toFixed(2)
            };
        });

        return comparison;
    };

    const generateEvaluationsPDF = async (student) => {
        const evaluations = await fetchLastEvaluations(student.id);
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text(`Avaliações de ${student.name}`, 20, 20);

        if (evaluations.length === 0) {
            doc.setFontSize(12);
            doc.text("Nenhuma avaliação encontrada.", 20, 30);
        } else {
            // Adicionar todas as avaliações
            doc.setFontSize(14);
            doc.text("Todas as Avaliações:", 20, 30);
            doc.autoTable({
                startY: 35,
                head: [['Tipo', 'Data', 'Peso (kg)', 'Altura (cm)', 'Peitoral (cm)', 'Axilar Média (cm)', 'Tríceps (cm)', 'Subescapular (cm)', 'Abdomen (cm)', 'Supra Iliaca (cm)', 'Coxa (cm)', '% Gordura', '% Massa Magra', 'Massa Gordura (kg)', 'Massa Magra (kg)', 'IMC', 'Classificação IMC']],
                body: evaluations.map(evalItem => ([
                    evalItem.tipo,
                    evalItem.data,
                    `${evalItem.peso} kg`,
                    `${evalItem.altura} cm`,
                    `${evalItem.peitoral} cm`,
                    `${evalItem.axilar_media} cm`,
                    `${evalItem.triceps} cm`,
                    `${evalItem.subescapular} cm`,
                    `${evalItem.abdomen} cm`,
                    `${evalItem.supra_iliaca} cm`,
                    `${evalItem.coxa} cm`,
                    `${evalItem.percentual_gordura} %`,
                    `${evalItem.percentual_massa_magra} %`,
                    `${evalItem.massa_gordura_kg} kg`,
                    `${evalItem.massa_magra_kg} kg`,
                    evalItem.imc,
                    evalItem.classificacao_imc
                ])),
                styles: { fontSize: 8 },
                headStyles: { fillColor: [78, 204, 196] },
            });

            // Gerar comparativo das duas últimas avaliações
            const comparison = generateComparativeData(evaluations);
            if (comparison) {
                const startY = doc.lastAutoTable.finalY + 10;
                doc.setFontSize(14);
                doc.text(`Comparativo das Duas Últimas Avaliações de ${student.name}:`, 20, startY);

                const comparisonTable = Object.keys(comparison).map(label => [
                    label,
                    `${comparison[label].previous}${getUnit(label)}`,
                    `${comparison[label].latest}${getUnit(label)}`,
                    `${comparison[label].difference}${getDifferenceSign(comparison[label].difference)}`
                ]);

                doc.autoTable({
                    startY: startY + 5,
                    head: [['Campo', 'Anterior', 'Atual', 'Diferença']],
                    body: comparisonTable,
                    styles: { fontSize: 8 },
                    headStyles: { fillColor: [78, 204, 196] },
                    columnStyles: {
                        3: { halign: 'right' } // Alinhar a coluna de diferença à direita
                    }
                });
            }
        }

        doc.save(`avaliacoes_${student.name}.pdf`);
    };

    const handleSubmitEdit = () => {
        updateStudent(editingStudentId, newStudent);
        setEditingStudentId(null);
    };

    const toggleEvaluations = async (studentId) => {
        if (visibleEvaluations[studentId]) {
            // Se as avaliações já estão visíveis, esconda-as
            setVisibleEvaluations(prev => ({ ...prev, [studentId]: null }));
        } else {
            // Caso contrário, busque as avaliações e mostre-as
            const evaluations = await fetchLastEvaluations(studentId);
            const comparison = generateComparativeData(evaluations);
            setVisibleEvaluations(prev => ({ ...prev, [studentId]: { evaluations, comparison } }));
        }
    };

    const handleSearchChange = (e) => {
        setStudentName(e.target.value);
        axios.get(`http://localhost:5000/search/${e.target.value}`,)
            .then(response => {
                const studentsWithAge = response.data.map(student => ({
                    ...student,
                    age: calculateAge(student.birthDate)
                }));
                studentsWithAge.length==0 ? setStudents([]) : setStudents(studentsWithAge);

            })
            .catch(error => {
                getStudents();
                
                console.error(error);
            });
        

    };

    // Função para obter a unidade de medida com base no campo
    const getUnit = (fieldLabel) => {
        const unitMapping = {
            'Peso (kg)': ' kg',
            'Altura (cm)': ' cm',
            'Peitoral (cm)': ' cm',
            'Axilar Média (cm)': ' cm',
            'Tríceps (cm)': ' cm',
            'Subescapular (cm)': ' cm',
            'Abdomen (cm)': ' cm',
            'Supra Iliaca (cm)': ' cm',
            'Coxa (cm)': ' cm',
            'Percentual de Gordura (%)': ' %',
            'Percentual de Massa Magra (%)': ' %',
            'Massa de Gordura (kg)': ' kg',
            'Massa Magra (kg)': ' kg',
            'IMC': ''
        };
        return unitMapping[fieldLabel] || '';
    };

    // Função para adicionar sinal de diferença
    const getDifferenceSign = (difference) => {
        if (difference > 0) return ' ↑'; // Aumento
        if (difference < 0) return ' ↓'; // Diminuição
        return ''; // Sem diferença
    };

    const styles = {
        container: {
            width: '90%',
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
        addStudent: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '20px',
        },
        input: {
            padding: '10px 15px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            margin: '5px',
            width: '80%',
            maxWidth: '400px',
            fontSize: '1em',
            transition: 'border-color 0.3s',
        },
        button: {
            padding: '10px 20px',
            backgroundColor: '#4ecdc4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s, transform 0.2s',
            fontSize: '1em',
            margin: '10px 0',
        },
        studentTable: {
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '20px',
        },
        tableHeader: {
            backgroundColor: '#4ecdc4',
            color: 'white',
            padding: '10px',
            fontSize: '1.1em',
            border: '1px solid #ddd',
        },
        tableCell: {
            border: '1px solid #ddd',
            padding: '10px',
            fontSize: '0.9em',
            verticalAlign: 'top',
        },
        studentItemActive: {
            borderLeft: '5px solid #4caf50',
        },
        studentItemInactive: {
            borderLeft: '5px solid #f44336',
        },
        studentButton: {
            marginLeft: '5px',
            padding: '8px 12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            fontSize: '0.9em',
        },
        evaluationsContainer: {
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#e8f4f8',
            borderRadius: '4px',
        },
        evaluationTable: {
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '10px',
        },
        comparativeSection: {
            marginTop: '20px',
            padding: '10px',
            backgroundColor: '#fff3cd',
            borderRadius: '4px',
        },
        comparativeTable: {
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '10px',
        },
        sectionTitle: {
            fontSize: '1.2em',
            marginBottom: '10px',
            color: '#333',
        },
        searchContainer: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
            flexDirection: 'column',
        },
        searchInput: {
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '1em',
            width: '300px',
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Lista de Alunos</h2>
            <div style={styles.addStudent}>
                <h3>Adicionar Aluno</h3>
                <input
                    style={styles.input}
                    type="text"
                    placeholder="Nome"
                    value={newStudent.name}
                    onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                />
                <input
                    style={styles.input}
                    type="text"
                    placeholder="CEP"
                    value={newStudent.cep}
                    onChange={e => {
                        setNewStudent({ ...newStudent, cep: e.target.value });
                        if (e.target.value.length === 8) fetchAddress(e.target.value);
                    }}
                />
                <input
                    style={styles.input}
                    type="text"
                    placeholder="Endereço"
                    value={newStudent.address}
                    onChange={e => setNewStudent({ ...newStudent, address: e.target.value })}
                />
                <input
                    style={styles.input}
                    type="text"
                    placeholder="Telefone"
                    value={newStudent.phone}
                    onChange={e => setNewStudent({ ...newStudent, phone: e.target.value })}
                />
                <select
                    style={styles.input}
                    value={newStudent.gender}
                    onChange={e => setNewStudent({ ...newStudent, gender: e.target.value })}
                >
                    <option value="">Selecione o Gênero</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                </select>
                <input
                    style={styles.input}
                    type="date"
                    placeholder="Data de Nascimento"
                    value={newStudent.birthDate}
                    onChange={e => setNewStudent({ ...newStudent, birthDate: e.target.value })}
                />
                <button style={styles.button} onClick={editingStudentId ? handleSubmitEdit : addStudent}>
                    {editingStudentId ? 'Atualizar Aluno' : 'Adicionar Aluno'}
                </button>
            </div>

            <div style={styles.searchContainer} >
            <h2 style={styles.title}>Buscar Avaliações por Nome do Aluno</h2>
                <input
                    style={styles.input}
                    type="text"
                    placeholder="Nome do Aluno"
                    value={studentName}
                    onChange={e => handleSearchChange(e)}
                    
                />
           
            </div>

            <table style={styles.studentTable}>
                <thead>
                    <tr>
                        <th style={styles.tableHeader}>Nome</th>
                        <th style={styles.tableHeader}>Idade</th>
                        <th style={styles.tableHeader}>Gênero</th>
                        <th style={styles.tableHeader}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <React.Fragment key={student.id}>
                            <tr style={student.active ? styles.studentItemActive : styles.studentItemInactive}>
                                <td style={styles.tableCell}>{student.name}</td>
                                <td style={styles.tableCell}>{student.age}</td>
                                <td style={styles.tableCell}>{student.gender}</td>
                                <td style={styles.tableCell}>
                                    <button style={styles.studentButton} onClick={() => handleEditClick(student)}>Editar</button>
                                    <button style={styles.studentButton} onClick={() => deleteStudent(student.id)}>Excluir</button>
                                    <button style={styles.studentButton} onClick={() => handleAddEvaluation(student)}>Adicionar Avaliação</button>
                                    <button style={styles.studentButton} onClick={() => generateEvaluationsPDF(student)}>Gerar PDF</button>
                                    <button style={styles.studentButton} onClick={() => toggleEvaluations(student.id)}>
                                        {visibleEvaluations[student.id] ? 'Ocultar Avaliações' : 'Ver Avaliações'}
                                    </button>
                                </td>
                            </tr>
                            {visibleEvaluations[student.id] && (
                                <tr>
                                    <td colSpan="4" style={styles.tableCell}>
                                        <div style={styles.evaluationsContainer}>
                                            <h4>Avaliações:</h4>
                                            {visibleEvaluations[student.id].evaluations.length === 0 ? (
                                                <p>Nenhuma avaliação encontrada.</p>
                                            ) : (
                                                <>
                                                    {/* Tabela de Avaliações */}
                                                    <table style={styles.evaluationTable}>
                                                        <thead>
                                                            <tr>
                                                                <th style={styles.tableHeader}>Tipo</th>
                                                                <th style={styles.tableHeader}>Data</th>
                                                                <th style={styles.tableHeader}>Peso (kg)</th>
                                                                <th style={styles.tableHeader}>Altura (cm)</th>
                                                                <th style={styles.tableHeader}>% Gordura (%)</th>
                                                                <th style={styles.tableHeader}>IMC</th>
                                                                {/* Adicione mais colunas conforme necessário */}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {visibleEvaluations[student.id].evaluations.map(evaluation => (
                                                                <tr key={evaluation.id}>
                                                                    <td style={styles.tableCell}>{evaluation.tipo}</td>
                                                                    <td style={styles.tableCell}>{evaluation.data}</td>
                                                                    <td style={styles.tableCell}>{evaluation.peso} kg</td>
                                                                    <td style={styles.tableCell}>{evaluation.altura} cm</td>
                                                                    <td style={styles.tableCell}>{evaluation.percentual_gordura} %</td>
                                                                    <td style={styles.tableCell}>{evaluation.imc}</td>
                                                                    {/* Adicione mais células conforme necessário */}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>

                                                    {/* Comparativo das Duas Últimas Avaliações */}
                                                    {visibleEvaluations[student.id].comparison && (
                                                        <div style={styles.comparativeSection}>
                                                            <h4>Comparativo das Duas Últimas Avaliações de {student.name}:</h4>
                                                            <table style={styles.comparativeTable}>
                                                                <thead>
                                                                    <tr>
                                                                        <th style={styles.tableHeader}>Campo</th>
                                                                        <th style={styles.tableHeader}>Anterior</th>
                                                                        <th style={styles.tableHeader}>Atual</th>
                                                                        <th style={styles.tableHeader}>Diferença</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {Object.keys(visibleEvaluations[student.id].comparison).map((field, index) => (
                                                                        <tr key={index}>
                                                                            <td style={styles.tableCell}>{field}</td>
                                                                            <td style={styles.tableCell}>{visibleEvaluations[student.id].comparison[field].previous}{getUnit(field)}</td>
                                                                            <td style={styles.tableCell}>{visibleEvaluations[student.id].comparison[field].latest}{getUnit(field)}</td>
                                                                            <td style={{
                                                                                ...styles.tableCell,
                                                                                color: visibleEvaluations[student.id].comparison[field].difference > 0 ? '#4caf50' : visibleEvaluations[student.id].comparison[field].difference < 0 ? '#f44336' : '#000'
                                                                            }}>
                                                                                {visibleEvaluations[student.id].comparison[field].difference}{getDifferenceSign(visibleEvaluations[student.id].comparison[field].difference)}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Função para obter a unidade de medida com base no campo
const getUnit = (fieldLabel) => {
    const unitMapping = {
        'Peso (kg)': ' kg',
        'Altura (cm)': ' cm',
        'Peitoral (cm)': ' cm',
        'Axilar Média (cm)': ' cm',
        'Tríceps (cm)': ' cm',
        'Subescapular (cm)': ' cm',
        'Abdomen (cm)': ' cm',
        'Supra Iliaca (cm)': ' cm',
        'Coxa (cm)': ' cm',
        'Percentual de Gordura (%)': ' %',
        'Percentual de Massa Magra (%)': ' %',
        'Massa de Gordura (kg)': ' kg',
        'Massa Magra (kg)': ' kg',
        'IMC': ''
    };
    return unitMapping[fieldLabel] || '';
};

// Função para adicionar sinal de diferença
const getDifferenceSign = (difference) => {
    if (difference > 0) return ' ↑'; // Aumento
    if (difference < 0) return ' ↓'; // Diminuição
    return ''; // Sem diferença
};

export default Students;
