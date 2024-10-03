import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const AvaliacaoFeminina = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const alunoId = location.state?.alunoId;
  const nomeAluno = location.state?.nome;
  const idadeAluno = location.state?.idade;

  const [nome, setNome] = useState(nomeAluno || '');
  const [idade, setIdade] = useState(idadeAluno || '');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [peitoral, setPeitoral] = useState('');
  const [axilarMedia, setAxilarMedia] = useState('');
  const [triceps, setTriceps] = useState('');
  const [subescapular, setSubescapular] = useState('');
  const [abdomen, setAbdomen] = useState('');
  const [supraIliaca, setSupraIliaca] = useState('');
  const [coxa, setCoxa] = useState('');
  const [resultados, setResultados] = useState(null);
  
  // Função para calcular resultados
  const calcularResultados = () => {
    // Conversão de valores
    const pesoKg = parseFloat(peso);
    const alturaM = parseFloat(altura) / 100;
    const idadeNum = parseFloat(idade);
    const peitoralNum = parseFloat(peitoral);
    const axilarMediaNum = parseFloat(axilarMedia);
    const tricepsNum = parseFloat(triceps);
    const subescapularNum = parseFloat(subescapular);
    const abdomenNum = parseFloat(abdomen);
    const supraIliacaNum = parseFloat(supraIliaca);
    const coxaNum = parseFloat(coxa);

    if (isNaN(pesoKg) || isNaN(alturaM) || isNaN(idadeNum) || isNaN(peitoralNum) || isNaN(axilarMediaNum) ||
        isNaN(tricepsNum) || isNaN(subescapularNum) || isNaN(abdomenNum) || isNaN(supraIliacaNum) || 
        isNaN(coxaNum)) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    // Cálculo da densidade corporal e resultados
    const S = peitoralNum + axilarMediaNum + tricepsNum + subescapularNum + abdomenNum + supraIliacaNum + coxaNum;
    const densidadeCorporal = 1.097 - 0.00046971 * S + 0.00000056 * S ** 2 - 0.00012828 * idadeNum;
    const percentualGordura = (495 / densidadeCorporal) - 450;
    const percentualMassaMagra = 100 - percentualGordura;
    const massaGorduraKg = (percentualGordura / 100) * pesoKg;
    const massaMagraKg = pesoKg - massaGorduraKg;
    const imc = pesoKg / (alturaM * alturaM);
    
    let classificacaoIMC = '';
    if (imc < 18.5) {
      classificacaoIMC = 'Abaixo do peso';
    } else if (imc >= 18.5 && imc < 24.9) {
      classificacaoIMC = 'Peso normal';
    } else if (imc >= 25 && imc < 29.9) {
      classificacaoIMC = 'Sobrepeso';
    } else {
      classificacaoIMC = 'Obesidade';
    }

    const resultados = {
      percentualGordura: percentualGordura.toFixed(2),
      percentualMassaMagra: percentualMassaMagra.toFixed(2),
      densidadeCorporal: densidadeCorporal.toFixed(4),
      massaGorduraKg: massaGorduraKg.toFixed(2),
      massaMagraKg: massaMagraKg.toFixed(2),
      imc: imc.toFixed(2),
      classificacaoIMC,
    };

    setResultados(resultados);
  };

  // Função para salvar a avaliação
  const salvarAvaliacao = async () => {
    if (!resultados) {
      alert('Por favor, calcule os resultados antes de salvar.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/evaluations/avaliacao-feminina', {
        aluno_id: alunoId,
        nome,
        idade,
        peso,
        altura,
        peitoral,
        axilar_media: axilarMedia,
        triceps,
        subescapular,
        abdomen,
        supra_iliaca: supraIliaca,
        coxa,
        percentual_gordura: resultados.percentualGordura,
        percentual_massa_magra: resultados.percentualMassaMagra,
        massa_gordura_kg: resultados.massaGorduraKg,
        massa_magra_kg: resultados.massaMagraKg,
        imc: resultados.imc,
        classificacao_imc: resultados.classificacaoIMC,
      });
      alert(response.data.message);
      navigate('/menu');
    } catch (error) {
      alert('Erro ao salvar avaliação: ' + (error.response?.data?.error || 'Erro desconhecido'));
    }
  };

  return (
    <div style={{
      width: '80%',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f7f9fc',
      borderRadius: '8px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{
        textAlign: 'center',
        color: '#4ecdc4',
        marginBottom: '20px'
      }}>Avaliação Feminina</h2>
      <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column' }}>
        {[
          { label: 'Nome', value: nome, setValue: setNome, type: 'text' },
          { label: 'Idade', value: idade, setValue: setIdade, type: 'number' },
          { label: 'Peso (kg)', value: peso, setValue: setPeso, type: 'number' },
          { label: 'Altura (cm)', value: altura, setValue: setAltura, type: 'number' },
          { label: 'Peitoral (mm)', value: peitoral, setValue: setPeitoral, type: 'number' },
          { label: 'Axilar Média (mm)', value: axilarMedia, setValue: setAxilarMedia, type: 'number' },
          { label: 'Tríceps (mm)', value: triceps, setValue: setTriceps, type: 'number' },
          { label: 'Subescapular (mm)', value: subescapular, setValue: setSubescapular, type: 'number' },
          { label: 'Abdômen (mm)', value: abdomen, setValue: setAbdomen, type: 'number' },
          { label: 'Supra-ilíaca (mm)', value: supraIliaca, setValue: setSupraIliaca, type: 'number' },
          { label: 'Coxa (mm)', value: coxa, setValue: setCoxa, type: 'number' },
        ].map(({ label, value, setValue, type }) => (
          <div key={label} style={{ marginBottom: '15px' }}>
            <label style={{ marginBottom: '5px', color: '#333' }}>{label}:</label>
            <input
              type={type}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
              style={{
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                width: '100%'
              }}
            />
          </div>
        ))}
        <button
          onClick={calcularResultados}
          style={{
            backgroundColor: '#4ecdc4',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '10px',
            cursor: 'pointer',
            marginBottom: '10px',
            fontSize: '16px'
          }}
        >
          Calcular
        </button>
        <button
          onClick={salvarAvaliacao}
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '10px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Salvar Avaliação
        </button>
      </form>

      {resultados && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
          <h3 style={{ color: '#4ecdc4' }}>Resultados</h3>
          <p><strong>Percentual de Gordura:</strong> {resultados.percentualGordura} %</p>
          <p><strong>Percentual de Massa Magra:</strong> {resultados.percentualMassaMagra} %</p>
          <p><strong>Densidade Corporal:</strong> {resultados.densidadeCorporal} g/cm³</p>
          <p><strong>Massa Gordura:</strong> {resultados.massaGorduraKg} kg</p>
          <p><strong>Massa Magra:</strong> {resultados.massaMagraKg} kg</p>
          <p><strong>IMC:</strong> {resultados.imc}</p>
          <p><strong>Classificação IMC:</strong> {resultados.classificacaoIMC}</p>
        </div>
      )}
    </div>
  );
};

export default AvaliacaoFeminina;