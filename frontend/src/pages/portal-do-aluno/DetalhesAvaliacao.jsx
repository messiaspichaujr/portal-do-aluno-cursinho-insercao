import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
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
    padding: 1.5rem; display: flex; justify-content: space-between; align-items: center;
`;

const InfoDiv = styled.div`
    display: flex; align-items: center; gap: 1rem;
    h3 { margin: 0; font-size: 1rem; color: #333; }
    p { margin: 0.2rem 0 0; font-size: 0.8rem; color: #888; }
`;

export default function DetalhesAvaliacao() {
    const location = useLocation();
    const navigate = useNavigate();
    const avaliacaoState = location.state?.avaliacao;

    const isEdit = location.pathname.includes("/edit");

    const token = localStorage.getItem('user_token');
    let isProf = false;
    if (token) {
        try { isProf = jwtDecode(token).tipo === 2; } catch {}
    }

    const [nomeAvaliacao, setNomeAvaliacao] = useState(avaliacaoState?.nomeDaNota || '');
    const [avaliacaoId] = useState(avaliacaoState?.id || null);
    const [notas, setNotas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (avaliacaoId) {
            carregarNotas();
        } else {
            setLoading(false);
        }
    }, [avaliacaoId]);

    async function carregarNotas() {
        try {
            const res = await api.get(`/api/notas/avaliacao/${avaliacaoId}`);
            setNotas(res.data);
        } catch (err) {
            console.error('Erro ao buscar notas:', err);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        if (!nomeAvaliacao.trim()) { alert('Informe o nome da avaliação.'); return; }
        try {
            await api.put(`/api/avaliacoes/${avaliacaoId}`, { nomeDaNota: nomeAvaliacao });
            for (const n of notas) {
                if (n.nota !== '' && n.nota !== undefined) {
                    await api.post('/api/notas', { aluno: n.aluno, avaliacao: avaliacaoId, nota: parseFloat(n.nota) });
                }
            }
            navigate("/portal/avaliacoes");
        } catch (err) {
            alert(err.response?.data || 'Erro ao salvar.');
        }
    }

    const handleNotaChange = (index, value) => {
        const novasNotas = [...notas];
        novasNotas[index] = { ...novasNotas[index], nota: value };
        setNotas(novasNotas);
    };

    if (loading) return <Div><p>Carregando...</p></Div>;

    return (
        <Div>
            <h1>Gestão das Avaliações</h1>

            <ManagementDiv>
                <h2>Avaliação selecionada</h2>
                <Form>
                    <Input type="text" name="nome" value={nomeAvaliacao}
                        onChange={(e) => setNomeAvaliacao(e.target.value)}
                        disabled={!isEdit} />
                </Form>
            </ManagementDiv>

            <ManagementDiv>
                <h2>Notas por Aluno</h2>
                <ListDiv>
                    {notas.length === 0 ? (
                        <p>Nenhuma nota lançada para esta avaliação.</p>
                    ) : notas.map((n, index) => (
                        <Card key={n.id || index}>
                            <InfoDiv>
                                <div>
                                    <h3>Aluno ID: {n.aluno}</h3>
                                    <p>ID da nota: {n.id}</p>
                                </div>
                            </InfoDiv>
                            <div>
                                <Input type="number" value={n.nota ?? ''}
                                    onChange={(e) => handleNotaChange(index, e.target.value)}
                                    disabled={!isEdit} />
                            </div>
                        </Card>
                    ))}

                    {isProf && isEdit ? (
                        <Botao text="Salvar" onClick={handleSave}
                            disabled={!nomeAvaliacao.trim()} />
                    ) : (
                        <Botao text="Voltar" onClick={() => navigate("/portal/avaliacoes")} />
                    )}
                </ListDiv>
            </ManagementDiv>
        </Div>
    );
}
