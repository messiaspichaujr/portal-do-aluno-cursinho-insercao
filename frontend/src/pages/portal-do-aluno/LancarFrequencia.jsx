import styled from 'styled-components';
import { useState, useEffect } from "react";
import { api } from '../../services/api';
import Botao from '../../components/reused/Botao';

const Div = styled.div`
    display: flex; flex-direction: column; text-align: left;
    align-content: center; padding: 1rem; height: 100%; gap: 10px;
    h1 { margin-top: 0; margin-bottom: 1rem; font-size: 1.4rem; color: #0D76B8; }
`;

const ManagementDiv = styled.section`
    background-color: #FEF8E9; padding: 2rem; border-radius: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 2rem;
    h2 { margin-top: 0; margin-bottom: 1rem; font-size: 1rem; color: #0D76B8; }
`;

const Form = styled.div`
    display: flex; flex-direction: column; padding: 2rem 0; width: 100%;
    flex-grow: 1; border-radius: 1rem; gap: 1rem; align-items: center;
`;

const Input = styled.input`
    font-size: 1rem; width: 100%; padding: 0.75rem; border: 2px solid #0D76B8;
    border-radius: 1rem; color: #000; background-color: #FFF;
`;

const ListDiv = styled.div`
    display: flex; flex-direction: column; width: 100%; gap: 2rem;
`;

const Card = styled.div`
    background-color: #FFF; border: 1px solid #0D76B8; border-radius: 8px;
    padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem;
`;

const InfoDiv = styled.div`
    display: flex; align-items: center; gap: 1rem;
    h3 { margin: 0; font-size: 1rem; color: #333; }
`;

const Select = styled.select`
    padding: 0.5rem; border: 2px solid #0D76B8; border-radius: 0.5rem; color: #000;
`;

export default function LancarFrequencia() {
    const [alunos, setAlunos] = useState([]);
    const [tiposFrequencia, setTiposFrequencia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(new Date().toISOString().split("T")[0]);
    const [presencas, setPresencas] = useState([]);

    useEffect(() => {
        Promise.all([
            api.get('/api/usuarios/alunos/matriculados'),
            api.get('/api/frequencias/tipos')
        ]).then(([resAlunos, resTipos]) => {
            setAlunos(resAlunos.data);
            setTiposFrequencia(resTipos.data);
            setPresencas(resAlunos.data.map(a => ({ alunoId: a.id, nome: a.nome, frequencia: '', justificativa: '' })));
        }).catch(err => {
            console.error('Erro ao carregar dados:', err);
        }).finally(() => setLoading(false));
    }, []);

    async function handleSave() {
        const aLancar = presencas.filter(p => p.frequencia);
        if (aLancar.length === 0) { alert('Selecione ao menos uma presença.'); return; }
        try {
            for (const p of aLancar) {
                await api.post('/api/frequencias', {
                    aluno: p.alunoId,
                    data: new Date(data).toISOString(),
                    frequencia: parseInt(p.frequencia),
                    justificativa: p.justificativa || ''
                });
            }
            alert('Frequência lançada com sucesso!');
            setPresencas(alunos.map(a => ({ alunoId: a.id, nome: a.nome, frequencia: '', justificativa: '' })));
        } catch (err) {
            alert(err.response?.data || 'Erro ao lançar frequência.');
        }
    }

    const handleChange = (index, field, value) => {
        const novas = [...presencas];
        novas[index][field] = value;
        setPresencas(novas);
    };

    if (loading) return <Div><p>Carregando...</p></Div>;

    return (
        <Div>
            <h1>Lançar Frequência</h1>

            <ManagementDiv>
                <h2>Data</h2>
                <Form>
                    <Input type="date" value={data} onChange={(e) => setData(e.target.value)} />
                </Form>
            </ManagementDiv>

            <ManagementDiv>
                <h2>Presença por Aluno</h2>
                <ListDiv>
                    {presencas.map((p, index) => (
                        <Card key={p.alunoId}>
                            <InfoDiv><h3>{p.nome}</h3></InfoDiv>
                            <div style={{ display: "flex", gap: "0.5rem", width: "60%" }}>
                                <Select value={p.frequencia}
                                    onChange={(e) => handleChange(index, "frequencia", e.target.value)}>
                                    <option value="">Selecione</option>
                                    {tiposFrequencia.map(t => (
                                        <option key={t.id} value={t.id}>{t.tipo}</option>
                                    ))}
                                </Select>
                                <Input type="text" placeholder="Justificativa"
                                    value={p.justificativa}
                                    onChange={(e) => handleChange(index, "justificativa", e.target.value)} />
                            </div>
                        </Card>
                    ))}
                    <Botao text="Salvar" onClick={handleSave}
                        disabled={!presencas.some(p => p.frequencia)} />
                </ListDiv>
            </ManagementDiv>
        </Div>
    );
}
