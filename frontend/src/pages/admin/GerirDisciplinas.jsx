import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { api } from '../../services/api';

const Container = styled.div`
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #1E1B16;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  flex-wrap: wrap;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
  min-width: 140px;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #4A453E;
`;

const Input = styled.input`
  padding: 0.7rem 1rem;
  border: 1px solid #E8E2D6;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  &:focus { border-color: #C49A1A; }
`;

const Button = styled.button`
  padding: 0.7rem 1.5rem;
  background: #C49A1A;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #1E1B16; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.8rem 1rem;
  background: #FEF8E9;
  color: #4A453E;
  font-size: 0.85rem;
  font-weight: 700;
`;

const Td = styled.td`
  padding: 0.8rem 1rem;
  border-bottom: 1px solid #E8E2D6;
  font-size: 0.95rem;
  color: #1E1B16;
`;

const ActionBtn = styled.button`
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  margin-right: 0.5rem;
  transition: opacity 0.2s;
  &:hover { opacity: 0.8; }
`;

const EditBtn = styled(ActionBtn)`background: #C49A1A; color: #fff;`;
const DeleteBtn = styled(ActionBtn)`background: #E8445A; color: #fff;`;

const EmptyState = styled.p`
  text-align: center;
  color: #999;
  padding: 2rem;
`;

export default function GerirDisciplinas() {
    const [disciplinas, setDisciplinas] = useState([]);
    const [sigla, setSigla] = useState('');
    const [nome, setNome] = useState('');
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => { carregar(); }, []);

    async function carregar() {
        try {
            const res = await api.get('/api/disciplinas');
            setDisciplinas(res.data);
        } catch (err) {
            console.error('Erro ao carregar disciplinas:', err);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!sigla.trim() || !nome.trim()) return;
        setLoading(true);
        try {
            if (editId) {
                await api.put(`/api/disciplinas/${editId}`, { sigla, nome });
            } else {
                await api.post('/api/disciplinas', { sigla, nome });
            }
            setSigla(''); setNome(''); setEditId(null);
            carregar();
        } catch (err) {
            alert(err.response?.data || 'Erro ao salvar disciplina');
        }
        setLoading(false);
    }

    function iniciarEdit(d) {
        setEditId(d.id);
        setSigla(d.sigla);
        setNome(d.nome);
    }

    async function remover(id) {
        if (!window.confirm('Remover esta disciplina?')) return;
        try {
            await api.delete(`/api/disciplinas/${id}`);
            carregar();
        } catch (err) {
            alert(err.response?.data || 'Erro ao remover');
        }
    }

    return (
        <Container>
            <Title>Gerir Disciplinas</Title>

            <Card>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label>Sigla</Label>
                        <Input value={sigla} onChange={e => setSigla(e.target.value)} maxLength={5} placeholder="Ex: MAT" />
                    </FormGroup>
                    <FormGroup style={{ flex: 2 }}>
                        <Label>Nome</Label>
                        <Input value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Matemática" />
                    </FormGroup>
                    <Button type="submit" disabled={loading}>
                        {editId ? 'Atualizar' : 'Criar'}
                    </Button>
                    {editId && <Button type="button" onClick={() => { setEditId(null); setSigla(''); setNome(''); }} style={{ background: '#999' }}>Cancelar</Button>}
                </Form>
            </Card>

            <Card>
                {disciplinas.length === 0 ? (
                    <EmptyState>Nenhuma disciplina cadastrada.</EmptyState>
                ) : (
                    <Table>
                        <thead>
                            <tr><Th>Sigla</Th><Th>Nome</Th><Th>Ações</Th></tr>
                        </thead>
                        <tbody>
                            {disciplinas.map(d => (
                                <tr key={d.id}>
                                    <Td><strong>{d.sigla}</strong></Td>
                                    <Td>{d.nome}</Td>
                                    <Td>
                                        <EditBtn onClick={() => iniciarEdit(d)}>Editar</EditBtn>
                                        <DeleteBtn onClick={() => remover(d.id)}>Remover</DeleteBtn>
                                    </Td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card>
        </Container>
    );
}
