const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Configuração do banco de dados SQLite
const db = new sqlite3.Database('./database.db');

// Criação das tabelas
db.serialize(() => {
    // Tabela de usuários
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`);

    // Tabela de alunos
    db.run(`CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        address TEXT,
        phone TEXT,
        gender TEXT,
        birthDate TEXT,
        active BOOLEAN DEFAULT 1
    )`);

    // Tabela de avaliações femininas
    db.run(`CREATE TABLE IF NOT EXISTS avaliacao_feminina (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        aluno_id INTEGER,
        nome TEXT,
        idade INTEGER,
        peso REAL,
        altura REAL,
        peitoral REAL,
        axilar_media REAL,
        triceps REAL,
        subescapular REAL,
        abdomen REAL,
        supra_iliaca REAL,
        coxa REAL,
        percentual_gordura REAL,
        percentual_massa_magra REAL,
        massa_gordura_kg REAL,
        massa_magra_kg REAL,
        imc REAL,
        classificacao_imc TEXT,
        data TEXT,
        FOREIGN KEY (aluno_id) REFERENCES students(id)
    )`);

    // Tabela de avaliações masculinas
    db.run(`CREATE TABLE IF NOT EXISTS avaliacao_masculina (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        aluno_id INTEGER,
        nome TEXT,
        idade INTEGER,
        peso REAL,
        altura REAL,
        peitoral REAL,
        axilar_media REAL,
        triceps REAL,
        subescapular REAL,
        abdomen REAL,
        supra_iliaca REAL,
        coxa REAL,
        percentual_gordura REAL,
        percentual_massa_magra REAL,
        massa_gordura_kg REAL,
        massa_magra_kg REAL,
        imc REAL,
        classificacao_imc TEXT,
        data TEXT,
        FOREIGN KEY (aluno_id) REFERENCES students(id)
    )`);
});

// Inicialização do Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Rotas de autenticação
app.post('/auth/register', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`,
        [username, hashedPassword], function (err) {
            if (err) return res.status(500).send("Erro ao criar usuário.");
            res.status(201).send({ id: this.lastID });
        });
});

app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err || !user) return res.status(400).send("Usuário não encontrado.");

        if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1h' });
            res.status(200).send({ token });
        } else {
            res.status(401).send("Senha incorreta.");
        }
    });
});

// Rotas de alunos
app.post('/students/add', (req, res) => {
    const { name, address, phone, gender, birthDate } = req.body;

    db.run(`INSERT INTO students (name, address, phone, gender, birthDate) VALUES (?, ?, ?, ?, ?)`, 
           [name, address, phone, gender, birthDate], function (err) {
        if (err) return res.status(500).send("Erro ao adicionar aluno.");
        res.status(201).send({ id: this.lastID });
    });
});

app.get('/students', (req, res) => {
    db.all(`SELECT * FROM students`, (err, rows) => {
        if (err) return res.status(500).send("Erro ao obter alunos.");
        res.status(200).send(rows);
    });
});

app.get('/search/:search', (req, res) => {
    console.log(req.params.search);
    db.all(`SELECT * FROM students WHERE name LIKE '%${req.params.search}%'`, (err, rows) => {
        if (err) return res.status(500).send("Erro ao obter alunos.");
        res.status(200).send(rows);
    });
});

app.put('/students/:id', (req, res) => {
    const { name, address, phone, gender, birthDate, active } = req.body;
    db.run(`UPDATE students SET name = ?, address = ?, phone = ?, gender = ?, birthDate = ?, active = ? WHERE id = ?`, 
           [name, address, phone, gender, birthDate, active, req.params.id], function (err) {
        if (err) return res.status(500).send("Erro ao atualizar aluno.");
        res.status(200).send({ message: "Aluno atualizado com sucesso." });
    });
});

app.delete('/students/:id', (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM students WHERE id = ?`, id, function (err) {
        if (err) return res.status(500).send("Erro ao excluir aluno.");
        if (this.changes === 0) {
            return res.status(404).send("Aluno não encontrado.");
        }
        res.status(204).send(); // Sem conteúdo, sucesso na exclusão
    });
});

// Rotas de avaliações femininas
app.post('/evaluations/avaliacao-feminina', (req, res) => {
    const {
        aluno_id,
        nome,
        idade,
        peso,
        altura,
        peitoral,
        axilar_media,
        triceps,
        subescapular,
        abdomen,
        supra_iliaca,
        coxa,
        percentual_gordura,
        percentual_massa_magra,
        massa_gordura_kg,
        massa_magra_kg,
        imc,
        classificacao_imc,
    } = req.body;

    db.run(`INSERT INTO avaliacao_feminina (aluno_id, nome, idade, peso, altura, peitoral, axilar_media, triceps, subescapular, abdomen, supra_iliaca, coxa, percentual_gordura, percentual_massa_magra, massa_gordura_kg, massa_magra_kg, imc, classificacao_imc) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [aluno_id, nome, idade, peso, altura, peitoral, axilar_media, triceps, subescapular, abdomen, supra_iliaca, coxa, percentual_gordura, percentual_massa_magra, massa_gordura_kg, massa_magra_kg, imc, classificacao_imc], function (err) {
        if (err) return res.status(500).send({ error: "Erro ao adicionar avaliação feminina." });
        res.status(201).send({ message: "Avaliação feminina adicionada com sucesso!", id: this.lastID });
    });
});

// Rotas de avaliações masculinas
app.post('/evaluations/avaliacao-masculina', (req, res) => {
    const {
        aluno_id,
        nome,
        idade,
        peso,
        altura,
        peitoral,
        axilar_media,
        triceps,
        subescapular,
        abdomen,
        supra_iliaca,
        coxa,
        percentual_gordura,
        percentual_massa_magra,
        massa_gordura_kg,
        massa_magra_kg,
        imc,
        classificacao_imc,
    } = req.body;

    db.run(`INSERT INTO avaliacao_masculina (aluno_id, nome, idade, peso, altura, peitoral, axilar_media, triceps, subescapular, abdomen, supra_iliaca, coxa, percentual_gordura, percentual_massa_magra, massa_gordura_kg, massa_magra_kg, imc, classificacao_imc) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [aluno_id, nome, idade, peso, altura, peitoral, axilar_media, triceps, subescapular, abdomen, supra_iliaca, coxa, percentual_gordura, percentual_massa_magra, massa_gordura_kg, massa_magra_kg, imc, classificacao_imc], function (err) {
        if (err) return res.status(500).send({ error: "Erro ao adicionar avaliação masculina." });
        res.status(201).send({ message: "Avaliação masculina adicionada com sucesso!", id: this.lastID });
    });
});

// Obter avaliações de um aluno
app.get('/evaluations/:alunoId', (req, res) => {
    const alunoId = req.params.alunoId;

    // Obter avaliações femininas
    db.all(`SELECT * FROM avaliacao_feminina WHERE aluno_id = ?`, [alunoId], (errFemininas, rowsFemininas) => {
        if (errFemininas) return res.status(500).send("Erro ao obter avaliações femininas.");

        // Obter avaliações masculinas
        db.all(`SELECT * FROM avaliacao_masculina WHERE aluno_id = ?`, [alunoId], (errMasculinas, rowsMasculinas) => {
            if (errMasculinas) return res.status(500).send("Erro ao obter avaliações masculinas.");

            // Retornar ambas as avaliações
            res.status(200).send({
                avaliacoes_femininas: rowsFemininas,
                avaliacoes_masculinas: rowsMasculinas,
            });
        });
    });
});

// Endpoint para buscar avaliações pelo nome do aluno
app.get('/evaluations/by-name', (req, res) => {
    const { name } = req.query;
    db.all(`SELECT * FROM avaliacao_feminina WHERE nome = ? UNION SELECT * FROM avaliacao_masculina WHERE nome = ?`, [name, name], (err, evaluations) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao buscar avaliações.');
        }
        res.json(evaluations);
    });
});

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
    