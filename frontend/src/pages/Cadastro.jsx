import { useState } from "react";
import styled from "styled-components";
import { api } from '../services/api';

const Page = styled.div`
    display: flex;
    flex-direction: column;
    text-align: left;
    align-content: center;
    padding: 1rem;
    height: 100%;
    gap: 10px;

    h1 {
        margin-top: 0;
        margin-bottom: 1rem;
        font-size: 1.4rem;
        color: #C49A1A;
    }
`;

const Card = styled.div`
    background-color: #FEF8E9;
    padding: 2rem;
    border-radius: 1rem;
    max-width: 32rem;
    width: 100%;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
`;

const Label = styled.label`
    font-size: 0.85rem;
    font-weight: 600;
    color: #4A453E;
    margin-bottom: 0.35rem;
`;

const Input = styled.input`
    width: 100%;
    padding: 0.65rem 1rem;
    border: 2px solid #E8E2D6;
    border-radius: 0.5rem;
    font-size: 1rem;
    color: #1E1B16;
    background-color: #FAFAF7;
    outline: none;

    &:focus {
        border-color: #F2B924;
        box-shadow: 0 0 0 3px rgba(242, 185, 36, 0.15);
        background-color: #FFFFFF;
    }
`;

const Select = styled.select`
    width: 100%;
    padding: 0.65rem 1rem;
    border: 2px solid #E8E2D6;
    border-radius: 0.5rem;
    font-size: 1rem;
    color: #1E1B16;
    background-color: #FAFAF7;
    outline: none;
    cursor: pointer;

    &:focus {
        border-color: #F2B924;
        box-shadow: 0 0 0 3px rgba(242, 185, 36, 0.15);
        background-color: #FFFFFF;
    }
`;

const SubmitButton = styled.button`
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.75rem;
    background-color: #F2B924;
    color: #1E1B16;
    font-weight: 700;
    font-size: 1rem;
    border: none;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #C49A1A;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const Message = styled.p`
    margin-top: 0.5rem;
    text-align: center;
    font-size: 0.9rem;
    color: ${props => (props.$success ? '#28a745' : '#dc3545')};
`;

export default function Cadastro() {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        tipo: 3
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'tipo' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            await api.post('/api/usuarios', formData);
            setIsSuccess(true);
            setMessage('Usuário criado com sucesso!');
            setFormData({ nome: '', email: '', senha: '', tipo: 3 });
        } catch (err) {
            console.error("Erro no cadastro:", err);
            setIsSuccess(false);
            setMessage(err.response?.data || 'Erro ao criar usuário. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Page>
            <h1>Novo Usuário</h1>
            <Card>
                <Form onSubmit={handleSubmit}>
                    <InputGroup>
                        <Label htmlFor="nome">Nome Completo</Label>
                        <Input
                            type="text"
                            id="nome"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            required
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label htmlFor="senha">Senha</Label>
                        <Input
                            type="password"
                            id="senha"
                            name="senha"
                            value={formData.senha}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label htmlFor="tipo">Tipo de Usuário</Label>
                        <Select id="tipo" name="tipo" value={formData.tipo} onChange={handleChange}>
                            <option value={3}>Aluno</option>
                            <option value={2}>Professor</option>
                        </Select>
                    </InputGroup>

                    
                    <SubmitButton type="submit" disabled={loading}>
                        {loading ? 'Criando...' : 'Criar Usuário'}
                    </SubmitButton>

                    {message && <Message $success={isSuccess}>{message}</Message>}
                </Form>
            </Card>
        </Page>
    );
}
