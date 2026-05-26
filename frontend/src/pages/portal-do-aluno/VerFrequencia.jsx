import styled from 'styled-components';
import { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
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

const Select = styled.select`
    font-size: 1rem; width: 100%; padding: 0.75rem; border: 2px solid #0D76B8;
    border-radius: 1rem; color: #000; background-color: #FFF;
`;

const Input = styled.input`
    font-size: 1rem; width: 100%; padding: 0.75rem; border: 2px solid #0D76B8;
    border-radius: 1rem; color: #000; background-color: #FFF;
    &:disabled { font-size: 0.75rem; color: #7e7e7eff; }
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

export default function VerFrequencia() {
    const [frequencias, setFrequencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tiposFrequencia, setTiposFrequencia] = useState([]);

    const token = localStorage.getItem('user_token');
    let userId = null;
    let isProf = false;
    if (token) {
        try {
            const decoded = jwtDecode(token);
            userId = decoded.sub;
            isProf = decoded.tipo === 2;
        } catch {}
    }

    const [alunos, setAlunos] = useState([]);
    const [alunoId, setAlunoId] = useState(null);

    useEffect(() => {
        api.get('/api/frequencias/tipos').then(res => setTiposFrequencia(res.data)).catch(() => {});
        if (isProf) {
            api.get('/api/usuarios/alunos/matriculados').then(res => {
                setAlunos(res.data);
                if (res.data.length > 0) setAlunoId(res.data[0].id);
            }).catch(() => {});
        } else if (userId) {
            carregarFrequencias(userId);
        }
    }, [userId, isProf]);

    useEffect(() => {
        if (isProf && alunoId) carregarFrequencias(alunoId);
    }, [alunoId, isProf]);

    async function carregarFrequencias(id) {
        setLoading(true);
        try {
            const res = await api.get(`/api/frequencias/aluno/${id}`);
            setFrequencias(res.data);
        } catch (err) {
            console.error('Erro ao buscar frequência:', err);
        } finally {
            setLoading(false);
        }
    }

    function getTipoLabel(tipoId) {
        const t = tiposFrequencia.find(tf => tf.id === tipoId);
        return t ? t.tipo : tipoId;
    }

    function formatarData(data) {
        return new Date(data).toLocaleDateString("pt-BR");
    }

    if (loading) return <Div><p>Carregando...</p></Div>;

    return (
        <Div>
            <h1>Visualizar Frequência</h1>

            {isProf && alunos.length > 0 && (
                <ManagementDiv>
                    <h2>Aluno</h2>
                    <Form>
                        <Select value={alunoId || ''} onChange={(e) => setAlunoId(parseInt(e.target.value))}>
                            {alunos.map(a => (
                                <option key={a.id} value={a.id}>{a.nome}</option>
                            ))}
                        </Select>
                    </Form>
                </ManagementDiv>
            )}

            <ManagementDiv>
                <h2>Presença por Data</h2>
                <ListDiv>
                    {frequencias.length === 0 ? (
                        <p>Nenhum registro de frequência encontrado.</p>
                    ) : frequencias.map(f => (
                        <Card key={f.id}>
                            <InfoDiv><h3>{formatarData(f.data)}</h3></InfoDiv>
                            <div style={{ display: "flex", gap: "0.5rem", width: "50%" }}>
                                <Input type="text" value={getTipoLabel(f.frequencia)} disabled />
                                <Input type="text" value={f.justificativa} disabled />
                            </div>
                        </Card>
                    ))}
                </ListDiv>
            </ManagementDiv>
        </Div>
    );
}
