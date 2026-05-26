import styled from 'styled-components';
import { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import { api } from '../../services/api';

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

const ListDiv = styled.div`
    display: flex; flex-direction: column; width: 100%; gap: 2rem;
`;

const Card = styled.div`
    background-color: #FFF; border: 1px solid #0D76B8; border-radius: 8px;
    padding: 1.5rem; display: flex; justify-content: space-between; align-items: center;
`;

const InfoDiv = styled.div`
    display: flex; flex-direction: column; gap: 0.25rem;
    h3 { margin: 0; font-size: 1rem; color: #333; }
    p { margin: 0; font-size: 0.8rem; color: #888; }
`;

const NotaValor = styled.span`
    font-size: 1.5rem; font-weight: 700; color: #0D76B8;
`;

export default function NotasAluno() {
    const [notas, setNotas] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('user_token');
    let userId = null;
    if (token) {
        try { userId = jwtDecode(token).sub; } catch {}
    }

    useEffect(() => {
        if (userId) carregarNotas();
    }, [userId]);

    async function carregarNotas() {
        try {
            const res = await api.get(`/api/notas/aluno/${userId}`);
            setNotas(res.data);
        } catch (err) {
            console.error('Erro ao buscar notas:', err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <Div><p>Carregando...</p></Div>;

    return (
        <Div>
            <h1>Minhas Notas</h1>
            <ManagementDiv>
                <h2>Notas por Avaliação</h2>
                <ListDiv>
                    {notas.length === 0 ? (
                        <p>Nenhuma nota lançada ainda.</p>
                    ) : notas.map(n => (
                        <Card key={n.id}>
                            <InfoDiv>
                                <h3>Avaliação ID: {n.avaliacao}</h3>
                                <p>Registro: {n.id}</p>
                            </InfoDiv>
                            <NotaValor>{n.nota}</NotaValor>
                        </Card>
                    ))}
                </ListDiv>
            </ManagementDiv>
        </Div>
    );
}
