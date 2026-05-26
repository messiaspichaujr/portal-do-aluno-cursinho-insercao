import styled from 'styled-components';
import { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import { api } from '../../services/api';
import Botao from '../../components/reused/Botao';

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

const Input = styled.input`
    width: 100%; padding: 0.75rem; border: 1px solid #E8E2D6;
    border-radius: 8px; color: #4A453E; background-color: #FFF;
    font-family: inherit; font-size: 0.9rem;
    &:focus { outline: none; border-color: #C49A1A; box-shadow: 0 0 0 2px rgba(196, 154, 26, 0.15); }
`;

const ListDiv = styled.div`
    display: flex; flex-direction: column; width: 100%; gap: 1rem;
`;

const Card = styled.div`
    background-color: #FFF; border: 1px solid #E8E2D6; border-radius: 10px;
    padding: 1.5rem; display: flex; gap: 2rem; justify-content: space-between; align-items: center;
    transition: box-shadow 0.2s ease;
    &:hover { box-shadow: 0 4px 12px rgba(30, 27, 22, 0.08); }
`;

const InfoDiv = styled.div`
    display: flex; flex-direction: column; align-items: flex-start; gap: 0.5rem; flex: 1;
    h3 { margin: 0; font-size: 1rem; color: #1E1B16; }
    p { margin: 0; font-size: 0.85rem; color: #4A453E; word-break: break-all; line-height: 1.5; }
`;

const DisciplineBadge = styled.span`
    display: inline-block; font-size: 0.75rem; font-weight: 600;
    color: #C49A1A; background-color: rgba(196, 154, 26, 0.1);
    padding: 2px 10px; border-radius: 20px;
`;

const ActionsDiv = styled.div` display: flex; gap: 0.75rem; flex-shrink: 0; `;

const Button = styled.button`
    padding: 0.6rem 1.25rem; border: none; font-weight: 600; font-size: 0.85rem;
    background-color: ${p => p.secondary ? '#6c757d' : p.danger ? '#E8445A' : '#C49A1A'};
    color: ${p => p.secondary || p.danger ? '#FFF' : '#FFF'};
    border-radius: 6px; cursor: pointer; transition: all 0.2s;
    &:hover { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
`;

export default function Conteudos() {
    const [conteudos, setConteudos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [formData, setFormData] = useState({ id: null, disciplina: '', link: '' });

    const token = localStorage.getItem('user_token');
    let isProf = false;
    if (token) {
        try { isProf = jwtDecode(token).tipo === 2; } catch {}
    }

    useEffect(() => { carregarConteudos(); }, []);

    async function carregarConteudos() {
        try {
            const res = await api.get('/api/conteudos');
            setConteudos(res.data);
        } catch (err) {
            console.error('Erro ao buscar conteúdos:', err);
        } finally {
            setLoading(false);
        }
    }

    async function handleCriar() {
        if (!formData.link.trim()) { alert('Informe o link.'); return; }
        try {
            await api.post('/api/conteudos', { disciplina: formData.disciplina ? parseInt(formData.disciplina) : null, link: formData.link });
            setFormData({ id: null, disciplina: '', link: '' });
            carregarConteudos();
        } catch (err) {
            alert(err.response?.data || 'Erro ao criar conteúdo.');
        }
    }

    async function handleSalvarEdicao() {
        try {
            await api.put(`/api/conteudos/${formData.id}`, {
                disciplina: formData.disciplina ? parseInt(formData.disciplina) : null, link: formData.link
            });
            setIsEdit(false);
            setFormData({ id: null, disciplina: '', link: '' });
            carregarConteudos();
        } catch (err) {
            alert(err.response?.data || 'Erro ao atualizar conteúdo.');
        }
    }

    async function handleRemover(id) {
        if (!window.confirm('Tem certeza que deseja apagar este conteúdo?')) return;
        try {
            await api.delete(`/api/conteudos/${id}`);
            carregarConteudos();
        } catch (err) {
            alert(err.response?.data || 'Erro ao remover conteúdo.');
        }
    }

    if (loading) return <Div><p>Carregando...</p></Div>;

    return (
        <Div>
            <h1>Conteúdos</h1>

            {isProf && (
                <ManagementDiv>
                    <h2>{isEdit ? 'Editar conteúdo' : 'Adicionar novo conteúdo'}</h2>
                    <Form>
                        <Input name="disciplina" placeholder="ID da Disciplina (opcional)"
                            value={formData.disciplina}
                            onChange={(e) => setFormData({ ...formData, disciplina: e.target.value })} />
                        <Input name="link" placeholder="Link do conteúdo"
                            value={formData.link}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })} />
                        <Botao text={isEdit ? "Salvar alterações" : "Criar"}
                            onClick={isEdit ? handleSalvarEdicao : handleCriar} />
                        {isEdit && (
                            <Botao text="Cancelar" bgColor="#6c757d"
                                onClick={() => { setIsEdit(false); setFormData({ id: null, disciplina: '', link: '' }); }} />
                        )}
                    </Form>
                </ManagementDiv>
            )}

            <ManagementDiv>
                <h2>Conteúdos</h2>
                <ListDiv>
                    {conteudos.length === 0 ? (
                        <p>Nenhum conteúdo cadastrado.</p>
                    ) : conteudos.map(c => (
                        <Card key={c.id}>
                            <InfoDiv>
                                <DisciplineBadge>Disciplina ID: {c.disciplina || 'Geral'}</DisciplineBadge>
                                <p>{c.link}</p>
                            </InfoDiv>
                            <ActionsDiv>
                                <Button secondary onClick={() => window.open(c.link, "_blank")}>Ver</Button>
                                {isProf && (
                                    <>
                                        <Button onClick={() => { setIsEdit(true); setFormData({ id: c.id, disciplina: c.disciplina || '', link: c.link }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                                            Editar
                                        </Button>
                                        <Button danger onClick={() => handleRemover(c.id)}>Apagar</Button>
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
