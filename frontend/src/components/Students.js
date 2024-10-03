import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from "jspdf"; // Certifique-se de instalar essa biblioteca

function Students() {
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
    const navigate = useNavigate();

    useEffect(() => {
        // Obter alunos do servidor
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
                    address: `${response.data.logradouro}, ` // Preenche o logradouro
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
            cep: student.cep,
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
            if (Array.isArray(response.data)) {
                return response.data; // Retorna as avaliações se for um array
            } else {
                console.error("Resposta inesperada:", response.data);
                return []; // Retorna um array vazio se não for um array
            }
        } catch (error) {
            console.error("Erro ao buscar avaliações:", error);
            alert("Erro ao buscar avaliações.");
            return []; // Retorna um array vazio em caso de erro
        }
    };

    const generateEvaluationsPDF = async (student) => {
        const evaluations = await fetchLastEvaluations(student.id);
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text(`Últimas Avaliações de ${student.name}`, 20, 20);

        if (evaluations.length === 0) {
            doc.setFontSize(12);
            doc.text("Nenhuma avaliação encontrada.", 20, 30);
        } else {
            let y = 30; // posição inicial no eixo y
            evaluations.forEach((evaluation, index) => {
                doc.setFontSize(12);
                doc.text(`Avaliação ${index + 1}: ${evaluation.data} - ${evaluation.percentual_gordura}% de gordura`, 20, y);
                y += 10; // Espaçamento entre as linhas
            });
        }

        doc.save(`avaliacoes_${student.name}.pdf`);
    };

    const handleSubmitEdit = () => {
        updateStudent(editingStudentId, newStudent);
        setEditingStudentId(null);
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
        addStudent: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '20px',
        },
        input: {
            padding: '15px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            margin: '5px',
            width: '80%',
            maxWidth: '400px',
            fontSize: '1.1em',
            transition: 'border-color 0.3s',
        },
        button: {
            padding: '15px 20px',
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
            padding: '15px',
            fontSize: '1.1em',
        },
        tableCell: {
            border: '1px solid #ddd',
            padding: '15px',
            fontSize: '1em',
        },
        studentItemActive: {
            borderLeft: '5px solid #4caf50',
        },
        studentItemInactive: {
            borderLeft: '5px solid #f44336',
        },
        studentButton: {
            marginLeft: '10px',
            padding: '10px 15px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            fontSize: '1em',
        },
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
                        <tr key={student.id} style={student.active ? styles.studentItemActive : styles.studentItemInactive}>
                            <td style={styles.tableCell}>{student.name}</td>
                            <td style={styles.tableCell}>{student.age}</td>
                            <td style={styles.tableCell}>{student.gender}</td>
                            <td style={styles.tableCell}>
                                <button style={styles.studentButton} onClick={() => handleEditClick(student)}>Editar</button>
                                <button style={styles.studentButton} onClick={() => deleteStudent(student.id)}>Excluir</button>
                                <button style={styles.studentButton} onClick={() => handleAddEvaluation(student)}>Adicionar Avaliação</button>
                                <button style={styles.studentButton} onClick={() => generateEvaluationsPDF(student)}>Gerar PDF</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Students;
