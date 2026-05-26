import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import styled from 'styled-components';
import logo from '../assets/imgs/logo_sem_fundo.png';

const PageWrapper = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #FEF8E9 0%, #FFF5D6 50%, #FEF0C7 100%);
    padding: 2rem;
`;

const Card = styled.div`
    background-color: #FFFFFF;
    padding: 3rem 2.5rem;
    border-radius: 1.5rem;
    box-shadow: 0 20px 60px rgba(196, 154, 26, 0.12), 0 4px 20px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 28rem;
    width: 100%;
`;

const LogoImg = styled.img`
    height: 80px;
    object-fit: contain;
    margin-bottom: 1.5rem;
`;

const Title = styled.h1`
    font-size: 1.4rem;
    font-weight: 700;
    color: #1E1B16;
    margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
    font-size: 0.9rem;
    color: #6B6356;
    margin-bottom: 2rem;
    text-align: center;
    line-height: 1.5;
`;

const Form = styled.form`
    width: 100%;
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
    padding: 0.75rem 1rem;
    border: 2px solid #E8E2D6;
    border-radius: 0.75rem;
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
    padding: 0.75rem 1rem;
    border: 2px solid #E8E2D6;
    border-radius: 0.75rem;
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
    padding: 0.85rem;
    background-color: #F2B924;
    color: #1E1B16;
    border: none;
    border-radius: 0.75rem;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.2s;
    margin-top: 0.5rem;

    &:hover { background-color: #C49A1A; }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const Message = styled.p`
    text-align: center;
    font-size: 0.9rem;
    color: ${props => (props.$success ? '#28a745' : '#dc3545')};
    margin-top: 0.5rem;
`;

const BackLink = styled(Link)`
    margin-top: 1.5rem;
    font-size: 0.85rem;
    color: #6B6356;
    text-decoration: none;
    transition: color 0.2s;
    &:hover { color: #C49A1A; }
`;

export default function CadastroPublico() {
    const [formData, setFormData] = useState({ nome: '', email: '', senha: '', tipo: 3 });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'tipo' ? parseInt(value) : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            await api.post('/api/usuarios', formData);
            setIsSuccess(true);
            setMessage('Cadastro realizado! Aguarde a aprovação do administrador.');
            setTimeout(() => navigate('/portal/login'), 3000);
        } catch (err) {
            setIsSuccess(false);
            setMessage(err.response?.data || 'Erro ao criar cadastro. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageWrapper>
            <Card>
                <LogoImg src={logo} alt="Cursinho Inserção" />
                <Title>Crie sua conta</Title>
                <Subtitle>Candidate-se como aluno ou educador popular</Subtitle>
                <Form onSubmit={handleSubmit}>
                    <InputGroup>
                        <Label>Nome Completo</Label>
                        <Input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
                    </InputGroup>
                    <InputGroup>
                        <Label>E-mail</Label>
                        <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </InputGroup>
                    <InputGroup>
                        <Label>Senha</Label>
                        <Input type="password" name="senha" value={formData.senha} onChange={handleChange} required minLength={6} />
                    </InputGroup>
                    <InputGroup>
                        <Label>Tipo de cadastro</Label>
                        <Select name="tipo" value={formData.tipo} onChange={handleChange}>
                            <option value={3}>Aluno</option>
                            <option value={2}>Educador Popular</option>
                        </Select>
                    </InputGroup>
                    <SubmitButton type="submit" disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </SubmitButton>
                    {message && <Message $success={isSuccess}>{message}</Message>}
                </Form>
                <BackLink to="/portal/login">Já tem uma conta? Faça login</BackLink>
            </Card>
        </PageWrapper>
    );
}
