import styled from 'styled-components';
import { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import { api } from '../../services/api';
import { getUploadUrl } from '../../services/uploads';
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

const Textarea = styled.textarea`
    width: 100%; padding: 0.8rem; border: 1px solid #ccc; border-radius: 5px;
    min-height: 120px; resize: vertical;
`;

const InputImg = styled.input`
    width: 100%; padding: 0.75rem; color: #000;
    &::file-selector-button {
        width: 100%; background-color: #0D76B8; color: #fff; font-weight: 500;
        padding: 1rem 2rem; border: none; border-radius: 1rem; margin-right: 1rem;
        cursor: pointer; transition: all 0.2s;
    }
    &::file-selector-button:hover { background-color: #095a8f; }
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
    img { width: 100%; max-width: 20rem; height: auto; object-fit: cover; border-radius: 1rem; margin-top: 1rem; }
    h3 { margin: 0; font-size: 1rem; color: #333; }
    p { white-space: pre-line; text-align: justify; margin: 0.2rem 0 0; font-size: 0.8rem; color: #333; }
`;

const ActionsDiv = styled.div` display: flex; gap: 1rem; `;

const Button = styled.button`
    padding: 0.7rem 1.5rem; border: none; font-weight: 600;
    background-color: ${p => p.secondary ? '#6c757d' : p.danger ? '#dc3545' : '#f2b924'};
    color: ${p => p.secondary || p.danger ? '#FFF' : '#42403dff'};
    border-radius: 5px; cursor: pointer; transition: all 0.2s;
    &:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
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
                    <h2>Escrever novo recado</h2>
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
                            <Botao text="Cancelar" bgColor="#DC3545"
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
                                    <p><strong>{formatarData(recado.data)}</strong></p>
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
