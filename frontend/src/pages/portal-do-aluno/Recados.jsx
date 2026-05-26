import styled from 'styled-components';
import { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import { api } from '../../services/api';
import { getUploadUrl } from '../../services/uploads';
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

const Textarea = styled.textarea`
    width: 100%; padding: 0.8rem; border: 1px solid #E8E2D6; border-radius: 8px;
    min-height: 120px; resize: vertical; font-family: inherit; font-size: 0.9rem;
    background-color: #FFF; color: #4A453E;
    &:focus { outline: none; border-color: #C49A1A; box-shadow: 0 0 0 2px rgba(196, 154, 26, 0.15); }
`;

const InputImg = styled.input`
    width: 100%; padding: 0.75rem; color: #4A453E;
    &::file-selector-button {
        width: 100%; background-color: #C49A1A; color: #FFF; font-weight: 500;
        padding: 1rem 2rem; border: none; border-radius: 8px; margin-right: 1rem;
        cursor: pointer; transition: all 0.2s;
    }
    &::file-selector-button:hover { background-color: #1E1B16; }
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
    display: flex; flex-direction: column; align-items: flex-start; gap: 1rem; flex: 1;
    img { width: 100%; max-width: 20rem; height: auto; object-fit: cover; border-radius: 10px; margin-top: 1rem; }
    h3 { margin: 0; font-size: 1rem; color: #1E1B16; }
    p { white-space: pre-line; text-align: justify; margin: 0.2rem 0 0; font-size: 0.85rem; color: #4A453E; line-height: 1.5; }
`;

const DateBadge = styled.span`
    display: inline-block; font-size: 0.75rem; font-weight: 600;
    color: #C49A1A; background-color: rgba(196, 154, 26, 0.1);
    padding: 2px 10px; border-radius: 20px; margin-bottom: 0.5rem;
`;

const ActionsDiv = styled.div` display: flex; gap: 0.75rem; flex-shrink: 0; `;

const Button = styled.button`
    padding: 0.6rem 1.25rem; border: none; font-weight: 600; font-size: 0.85rem;
    background-color: ${p => p.secondary ? '#6c757d' : p.danger ? '#E8445A' : '#C49A1A'};
    color: ${p => p.secondary || p.danger ? '#FFF' : '#FFF'};
    border-radius: 6px; cursor: pointer; transition: all 0.2s;
    &:hover { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
`;

export default function Recados() {
    const [recados, setRecados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [editData, setEditData] = useState({ id: null, texto: '', img: '' });

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
        } catch (err) {
            console.error('Erro ao buscar recados:', err);
        } finally {
            setLoading(false);
        }
    }

    async function handleCriar() {
        if (!editData.texto.trim()) { alert('Informe o texto do recado.'); return; }
        try {
            await api.post('/api/recados', { prof: parseInt(userId), texto: editData.texto, img: editData.img || null });
            setEditData({ id: null, texto: '', img: '' });
            carregarRecados();
        } catch (err) {
            alert(err.response?.data || 'Erro ao criar recado.');
        }
    }

    async function handleEditar(recado) {
        setIsEdit(true);
        setEditData({ id: recado.id, texto: recado.texto, img: recado.img || '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function handleSalvarEdicao() {
        try {
            await api.put(`/api/recados/${editData.id}`, { texto: editData.texto, img: editData.img });
            setIsEdit(false);
            setEditData({ id: null, texto: '', img: '' });
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

    if (loading) return <Div><p>Carregando...</p></Div>;

    return (
        <Div>
            <h1>Recados</h1>

            {isProf && (
                <ManagementDiv>
                    <h2>{isEdit ? 'Editar recado' : 'Escrever novo recado'}</h2>
                    <Form>
                        <Textarea name="texto" placeholder="Texto da Postagem"
                            value={editData.texto}
                            onChange={(e) => setEditData({ ...editData, texto: e.target.value })} />
                        <InputImg id="recado-upload" type="file"
                            onChange={(e) => setEditData({ ...editData, img: e.target.files[0] })} />
                        {isEdit && editData.img && typeof editData.img === 'string' && (
                            <img src={getUploadUrl(editData.img)} alt="Imagem atual"
                                style={{ width: "200px", borderRadius: "10px", marginTop: "1rem" }} />
                        )}
                        <Botao text={isEdit ? "Salvar alterações" : "Criar"}
                            onClick={isEdit ? handleSalvarEdicao : handleCriar} />
                        {isEdit && (
                            <Botao text="Cancelar" bgColor="#6c757d"
                                onClick={() => { setIsEdit(false); setEditData({ id: null, texto: '', img: '' }); }} />
                        )}
                    </Form>
                </ManagementDiv>
            )}

            <ManagementDiv>
                <h2>Recados</h2>
                <ListDiv>
                    {recados.length === 0 ? (
                        <p>Nenhum recado.</p>
                    ) : recados.map(recado => (
                        <Card key={recado.id}>
                            <InfoDiv>
                                <div>
                                    <h3>Professor ID: {recado.prof}</h3>
                                    <DateBadge>{formatarData(recado.data)}</DateBadge>
                                    <p>{recado.texto}</p>
                                    {recado.img && <img src={getUploadUrl(recado.img)} alt="Imagem do recado" />}
                                </div>
                            </InfoDiv>
                            {isProf && (
                                <ActionsDiv>
                                    <Button onClick={() => handleEditar(recado)}>Editar</Button>
                                    <Button danger onClick={() => handleRemover(recado.id)}>Apagar</Button>
                                </ActionsDiv>
                            )}
                        </Card>
                    ))}
                </ListDiv>
            </ManagementDiv>
        </Div>
    );
}
