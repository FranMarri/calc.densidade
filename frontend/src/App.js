// src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Menu from './components/Menu';
import Students from './components/Students';
import Evaluations from './components/Evaluations';
import AvaliacaoMasculina from './components/AvaliacaoMasculina'; // Tela para avaliação masculina
import AvaliacaoFeminina from './components/AvaliacaoFeminina'; // Tela para avaliação feminina

function App() {
    const [students] = useState([]); // Estado para gerenciar a lista de alunos

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/menu" element={<Menu students={students} />} />
                <Route path="/students" element={<Students />} />
                <Route path="/evaluations" element={<Evaluations />} />
                <Route path="/avaliacao-masculina" element={<AvaliacaoMasculina />} />
                <Route path="/avaliacao-feminina" element={<AvaliacaoFeminina />} />
                
            </Routes>
        </Router>
    );
}

export default App;
