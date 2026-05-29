import styled from 'styled-components';
import { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import { api } from '../../services/api';
import Botao from '../../components/reused/Botao';
import Loading from '../../components/reused/Loading';

const Div = styled.div`
    display: flex; flex-direction: column; text-align: left;
    align-content: center; padding: 1rem; height: 100%; gap: 10px;
    h1 { margin-top: 0; margin-bottom: 1rem; font-size: 1.4rem; color: #1E1B16; }
`;

const ManagementDiv = styled.section`
    background-color: #FEF8E9; padding: 2rem; border-radius: 1rem;
    box-shadow: 0 2px 8px rgba(30, 27, 22, 0.06); margin-bottom: 2rem;
    border: 1px solid #E8E2D6;
    h2 { margin-top: 0; margin-bottom: 1rem; font-size: 1rem; color: #1E1B16; }
`;

const Form = styled.div`
    display: flex; flex-direction: column; padding: 2rem 0; width: 100%;
    flex-grow: 1; border-radius: 1rem; gap: 1rem; align-items: center;
`;

const Textarea = styled.textarea`
    width: 100%; padding: 0.8rem; border: 1px solid #E8E2D6; border-radius: 8px;
    min-height: 120px; resize: vertical; font-family: inherit; font-size: 0.9rem;
    background-color: #FFF; color: #4A453E;
    &:focus { outline: none; border-color: #C49A1A; box-shadow: 0 0 0 2px rgba(196, 154, 26, 0.15); }
`;

const ListDiv = styled.div`
    display: flex; flex-direction: column; width: 100%; gap: 1rem;
`;

const RecadoCard = styled.div`
    background-color: #FFF; border: 1px solid #E8E2D6; border-radius: 12px;
    padding: 1.5rem; transition: box-shadow 0.2s ease;
    &:hover { box-shadow: 0 4px 12px rgba(30, 27, 22, 0.08); }
`;

const RecadoHeader = styled.div`
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 0.75rem; padding-bottom: 0.75rem;
    border-bottom: 1px solid #E8E2D6;
`;

const AuthorInfo = styled.div`
    display: flex; align-items: center; gap: 0.5rem;
`;

const AuthorName = styled.span`
    font-size: 0.9rem; font-weight: 600; color: #1E1B16;
`;

const Separator = styled.span`
    color: #C49A1A; font-size: 0.85rem;
`;

const DateText = styled.span`
    font-size: 0.8rem; color: #4A453E;
`;

const RecadoBody = styled.p`
    white-space: pre-line; text-align: justify; margin: 0;
    font-size: 0.9rem; color: #4A453E; line-height: 1.6;
`;

const ActionsDiv = styled.div` display: flex; gap: 0.5rem; `;

const ActionBtn = styled.button`
    padding: 0.35rem 0.7rem; border: none; font-weight: 600; font-size: 0.75rem;
    background-color: ${p => p.danger ? '#E8445A' : '#C49A1A'};
    color: #FFF; border-radius: 6px; cursor: pointer; transition: opacity 0.2s;
    &:hover { opacity: 0.85; }
`;

export default function Recados() {
    const [recados, setRecados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [editData, setEditData] = useState({ id: null, texto: '' });
    const [profNames, setProfNames] = useState({});

    const token = localStorage.getItem('user_token');
    let isProf = false;
    let userId = null;
    if (token) {
        try {
            const decoded = jwtDecode(token);
            isProf = decoded.tipo === 2;
            userId = decoded.sub;
        } catch {}
    }

    useEffect(() => { carregarRecados(); }, []);

    async function carregarRecados() {
        try {
            const res = await api.get('/api/recados');
            setRecados(res.data);
            // Load professor names via /api/usuarios/nomes
            const profIds = [...new Set(res.data.map(r => r.prof))];
            if (profIds.length > 0) {
                try {
                    const nomesRes = await api.get(`/api/usuarios/nomes?ids=${profIds.join(',')}`);
                    const names = {};
                    nomesRes.data.forEach(p => { names[p.id] = p.nome; });
                    setProfNames(names);
                } catch {
                    // names will fall back to "Professor"
                }
            }
        } catch (err) {
            console.error('Erro ao buscar recados:', err);
        } finally {
            setLoading(false);
        }
    }

    async function handleCriar() {
        if (!editData.texto.trim()) { alert('Informe o texto do recado.'); return; }
        try {
            await api.post('/api/recados', { prof: parseInt(userId), texto: editData.texto });
            setEditData({ id: null, texto: '' });
            carregarRecados();
        } catch (err) {
            alert(err.response?.data || 'Erro ao criar recado.');
        }
    }

    async function handleEditar(recado) {
        setIsEdit(true);
        setEditData({ id: recado.id, texto: recado.texto });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function handleSalvarEdicao() {
        try {
            await api.put(`/api/recados/${editData.id}`, { texto: editData.texto });
            setIsEdit(false);
            setEditData({ id: null, texto: '' });
            carregarRecados();
        } catch (err) {
            alert(err.response?.data || 'Erro ao atualizar recado.');
        }
    }

    async function handleRemover(id) {
        if (!window.confirm('Tem certeza que deseja apagar este recado?')) return;
        try {
            await api.delete(`/api/recados/${id}`);
            carregarRecados();
        } catch (err) {
            alert(err.response?.data || 'Erro ao remover recado.');
        }
    }

    function formatarData(data) {
        return new Date(data).toLocaleDateString("pt-BR", {
            day: "2-digit", month: "2-digit", year: "numeric"
        });
    }

    if (loading) return <Div><Loading /></Div>;

    return (
        <Div>
            <h1>Recados</h1>

            {isProf && (
                <ManagementDiv>
                    <h2>{isEdit ? 'Editar recado' : 'Escrever novo recado'}</h2>
                    <Form>
                        <Textarea name="texto" placeholder="Texto do recado..."
                            value={editData.texto}
                            onChange={(e) => setEditData({ ...editData, texto: e.target.value })} />
                        <Botao text={isEdit ? "Salvar alterações" : "Publicar"}
                            onClick={isEdit ? handleSalvarEdicao : handleCriar} />
                        {isEdit && (
                            <Botao text="Cancelar" bgColor="#6c757d"
                                onClick={() => { setIsEdit(false); setEditData({ id: null, texto: '' }); }} />
                        )}
                    </Form>
                </ManagementDiv>
            )}

            <ManagementDiv>
                <h2>Recados</h2>
                <ListDiv>
                    {recados.length === 0 ? (
                        <p style={{ color: '#4A453E' }}>Nenhum recado.</p>
                    ) : recados.map(recado => (
                        <RecadoCard key={recado.id}>
                            <RecadoHeader>
                                <AuthorInfo>
                                    <AuthorName>{profNames[recado.prof] || 'Professor'}</AuthorName>
                                    <Separator>-</Separator>
                                    <DateText>{formatarData(recado.data)}</DateText>
                                </AuthorInfo>
                                {isProf && (
                                    <ActionsDiv>
                                        <ActionBtn onClick={() => handleEditar(recado)}>Editar</ActionBtn>
                                        <ActionBtn danger onClick={() => handleRemover(recado.id)}>Apagar</ActionBtn>
                                    </ActionsDiv>
                                )}
                            </RecadoHeader>
                            <RecadoBody>{recado.texto}</RecadoBody>
                        </RecadoCard>
                    ))}
                </ListDiv>
            </ManagementDiv>
        </Div>
    );
}
