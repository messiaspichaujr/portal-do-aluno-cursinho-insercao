import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { jwtDecode } from 'jwt-decode';
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

const LoginCard = styled.div`
    background-color: #FFFFFF;
    padding: 3rem 2.5rem;
    border-radius: 1.5rem;
    box-shadow: 0 20px 60px rgba(196, 154, 26, 0.12), 0 4px 20px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 26rem;
    width: 100%;
`;

const LogoImg = styled.img`
    height: 100px;
    object-fit: contain;
    margin-bottom: 2rem;
`;

const WelcomeText = styled.p`
    font-size: 0.95rem;
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

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const Label = styled.label`
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    color: #4A453E;
    margin-bottom: 0.35rem;
`;

const FormInput = styled.input`
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #E8E2D6;
    border-radius: 0.75rem;
    outline: none;
    transition: all 0.3s ease;
    font-size: 1rem;
    color: #1E1B16;
    background-color: #FAFAF7;

    &:focus {
        border-color: #F2B924;
        box-shadow: 0 0 0 3px rgba(242, 185, 36, 0.15);
        background-color: #FFFFFF;
    }

    &::placeholder {
        color: #A8A29E;
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
    transition: background-color 0.2s, transform 0.2s;
    margin-top: 0.5rem;

    &:hover {
        background-color: #C49A1A;
        transform: translateY(-1px);
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
    }
`;

const ErrorMessage = styled.p`
    color: #E8445A;
    margin-top: 1rem;
    text-align: center;
    font-size: 0.9rem;
`;

const BackLink = styled(Link)`
    display: inline-block;
    margin-top: 1.5rem;
    font-size: 0.85rem;
    color: #6B6356;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
        color: #C49A1A;
    }
`;

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/api/usuarios/login', { email, senha });
            const { token } = response.data;
            localStorage.setItem('user_token', token);

            const decodedToken = jwtDecode(token);
            const userType = decodedToken.tipo;

            if (userType === 1) {
                navigate('/admin/dashboard');
            } else if (userType === 2) {
                navigate('/portal/avaliacoes');
            } else if (userType === 3) {
                navigate('/portal/notas');
            } else {
                setError('Tipo de usuário desconhecido.');
            }
        } catch (err) {
            console.error("Erro no login:", err);
            setError(err.response?.data || 'Email ou senha incorretos. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageWrapper>
            <LoginCard>
                <LogoImg src={logo} alt="Cursinho Inserção" />
                <WelcomeText>
                    Acesse o portal do Cursinho Inserção
                </WelcomeText>
                <Form onSubmit={handleSubmit}>
                    <InputContainer>
                        <Label htmlFor="email">E-mail</Label>
                        <FormInput
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Digite seu e-mail"
                            required
                        />
                    </InputContainer>
                    <InputContainer>
                        <Label htmlFor="senha">Senha</Label>
                        <FormInput
                            type="password"
                            id="senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            placeholder="Digite sua senha"
                            required
                        />
                    </InputContainer>
                    <SubmitButton type="submit" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </SubmitButton>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                </Form>
                <BackLink to="/home">Voltar ao site</BackLink>
            </LoginCard>
        </PageWrapper>
    );
}
