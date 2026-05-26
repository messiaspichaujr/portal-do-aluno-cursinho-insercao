import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
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
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); margin-bottom: 2rem;
    h2 { margin-top: 0; margin-bottom: 1rem; font-size: 1rem; color: #0D76B8; }
`;

const Form = styled.div`
    display: flex; flex-direction: column; padding: 2rem 0; width: 100%;
    flex-grow: 1; border-radius: 1rem; gap: 1rem; align-items: center;
`;

const Input = styled.input`
    width: 100%; padding: 0.75rem; border: 2px solid #0D76B8;
    border-radius: 1rem; color: #000; background-color: #FFF;
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

const ActionsDiv = styled.div` display: flex; gap: 1rem; `;

const Button = styled.button`
    padding: 0.7rem 1.5rem; border: none; font-weight: 600;
    background-color: ${p => p.secondary ? '#6c757d' : p.danger ? '#dc3545' : '#f2b924'};
    color: ${p => p.secondary || p.danger ? '#FFF' : '#42403dff'};
    border-radius: 5px; cursor: pointer; transition: all 0.2s;
    &:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
`;

export default function GerirAvaliacoes() {
    const navigate = useNavigate();
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [novoNome, setNovoNome] = useState('');

    const token = localStorage.getItem('user_token');
    let isProf = false;
    if (token) {
        try { isProf = jwtDecode(token).tipo === 2; } catch {}
    }

    useEffect(() => {
        carregarAvaliacoes();
    }, []);

    async function carregarAvaliacoes() {
        try {
            const res = await api.get('/api/avaliacoes');
            setAvaliacoes(res.data);
        } catch (err) {
            console.error('Erro ao buscar avaliações:', err);
        } finally {
            setLoading(false);
        }
    }

    async function handleCriar() {
        if (!novoNome.trim()) { alert('Informe o nome da avaliação.'); return; }
        try {
            await api.post('/api/avaliacoes', { nomeDaNota: novoNome });
            setNovoNome('');
            carregarAvaliacoes();
        } catch (err) {
            alert(err.response?.data || 'Erro ao criar avaliação.');
        }
    }

    async function handleRemover(id) {
        if (!window.confirm('Tem certeza que deseja apagar esta avaliação?')) return;
        try {
            await api.delete(`/api/avaliacoes/${id}`);
            carregarAvaliacoes();
        } catch (err) {
            alert(err.response?.data || 'Erro ao remover avaliação.');
        }
    }

    if (loading) return <Div><p>Carregando...</p></Div>;

    return (
        <Div>
            <h1>Gestão das Avaliações</h1>

            {isProf && (
                <ManagementDiv>
                    <h2>Criar Nova Avaliação</h2>
                    <Form>
                        <Input type="text" placeholder="Nome da Avaliação" value={novoNome}
                            onChange={(e) => setNovoNome(e.target.value)} />
                        <Botao text="Criar" onClick={handleCriar} />
                    </Form>
                </ManagementDiv>
            )}

            <ManagementDiv>
                <h2>Avaliações Cadastradas</h2>
                <ListDiv>
                    {avaliacoes.length === 0 ? (
                        <p>Nenhuma avaliação cadastrada.</p>
                    ) : avaliacoes.map(a => (
                        <Card key={a.id}>
                            <InfoDiv>
                                <div>
                                    <h3>{a.nomeDaNota}</h3>
                                    <p>ID: {a.id}</p>
                                </div>
                            </InfoDiv>
                            <ActionsDiv>
                                <Button secondary onClick={() => navigate(`/portal/avaliacoes/ver`, { state: { avaliacao: a } })}>
                                    Ver
                                </Button>
                                {isProf && (
                                    <>
                                        <Button onClick={() => navigate(`/portal/avaliacoes/edit`, { state: { avaliacao: a } })}>
                                            Editar
                                        </Button>
                                        <Button danger onClick={() => handleRemover(a.id)}>Apagar</Button>
                                    </>
                                )}
                            </ActionsDiv>
                        </Card>
                    ))}
                </ListDiv>
            </ManagementDiv>
        </Div>
    );
}
