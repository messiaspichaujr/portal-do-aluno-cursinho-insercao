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

const Input = styled.input`
    width: 100%; padding: 0.75rem; border: 2px solid #0D76B8;
    border-radius: 1rem; color: #000; background-color: #FFF;
`;

const ListDiv = styled.div`
    display: flex; flex-direction: column; width: 100%; gap: 2rem;
`;

const Card = styled.div`
    background-color: #FFF; border: 1px solid #0D76B8; border-radius: 8px;
    padding: 1.5rem; display: flex; gap: 2rem; justify-content: space-between; align-items: center;
`;

const InfoDiv = styled.div`
    display: flex; flex-direction: column; align-items: flex-start; gap: 1rem;
    h3 { margin: 0; font-size: 1rem; color: #333; }
    p { margin: 0.2rem 0 0; font-size: 0.8rem; color: #333; word-break: break-all; }
`;

const ActionsDiv = styled.div` display: flex; gap: 1rem; `;

const Button = styled.button`
    padding: 0.7rem 1.5rem; border: none; font-weight: 600;
    background-color: ${p => p.secondary ? '#6c757d' : p.danger ? '#dc3545' : '#f2b924'};
    color: ${p => p.secondary || p.danger ? '#FFF' : '#42403dff'};
    border-radius: 5px; cursor: pointer; transition: all 0.2s;
    &:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
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
                            <Botao text="Cancelar" bgColor="#DC3545"
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
                                <h3>Disciplina ID: {c.disciplina || 'Geral'}</h3>
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
