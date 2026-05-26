import { api } from "../../services/api";
import { getUploadUrl } from "../../services/uploads";
import styled from 'styled-components';
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

const FooterWrapper = styled.footer`
    background-color: #0D76B8;
    color: #FFFFFF;
    padding: 0;
`;

const TopBar = styled.div`
    height: 4px;
    background-color: #F2B924;
`;

const FooterContent = styled.div`
    max-width: 1100px;
    margin: 0 auto;
    padding: 3rem 2rem 1.5rem;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 3rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
`;

const FooterCol = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`;

const FooterTitle = styled.h4`
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #F2B924;
`;

const FooterText = styled.p`
    font-size: 0.9rem;
    line-height: 1.6;
    opacity: 0.85;
`;

const FooterLink = styled(Link)`
    font-size: 0.9rem;
    color: #FFFFFF;
    text-decoration: none;
    opacity: 0.85;
    transition: opacity 0.2s;

    &:hover {
        opacity: 1;
    }
`;

const ExternalLink = styled.a`
    font-size: 0.9rem;
    color: #FFFFFF;
    text-decoration: none;
    opacity: 0.85;
    transition: opacity 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
        opacity: 1;
    }
`;

const SocialIcon = styled.img`
    height: 1.5rem;
    width: 1.5rem;
    object-fit: contain;
`;

const Divider = styled.div`
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 2rem;

    hr {
        border: none;
        border-top: 1px solid rgba(255, 255, 255, 0.15);
    }
`;

const BottomBar = styled.div`
    max-width: 1100px;
    margin: 0 auto;
    padding: 1rem 2rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;

    p {
        font-size: 0.8rem;
        opacity: 0.7;
    }

    @media (max-width: 768px) {
        flex-direction: column;
        text-align: center;
    }
`;

const DevLink = styled.a`
    font-size: 0.8rem;
    color: #F2B924;
    text-decoration: none;
    opacity: 0.8;

    &:hover {
        opacity: 1;
        text-decoration: underline;
    }
`;

export default function Footer() {
    const [redes, setRedes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/api/redes')
            .then(res => setRedes(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <FooterWrapper id="contato">
            <TopBar />
            <FooterContent>
                <FooterCol>
                    <FooterTitle>Cursinho Inserção</FooterTitle>
                    <FooterText>
                        Educação popular e preparação para o ensino superior.
                        Transformando vidas através do conhecimento coletivo.
                    </FooterText>
                </FooterCol>

                <FooterCol>
                    <FooterTitle>Acesso</FooterTitle>
                    <FooterLink to="/portal/login">Portal do Aluno</FooterLink>
                    <FooterLink to="/admin/login">Administração</FooterLink>
                </FooterCol>

                <FooterCol>
                    <FooterTitle>Redes Sociais</FooterTitle>
                    {loading ? (
                        <FooterText>Carregando...</FooterText>
                    ) : redes.length === 0 ? (
                        <FooterText>Nenhuma rede social cadastrada.</FooterText>
                    ) : redes.map(rede => (
                        <ExternalLink key={rede.id} href={rede.link} target="_blank" rel="noopener noreferrer">
                            {rede.imagem && <SocialIcon src={getUploadUrl(rede.imagem)} alt={rede.texto} />}
                            {rede.texto}
                        </ExternalLink>
                    ))}
                </FooterCol>
            </FooterContent>

            <Divider><hr /></Divider>

            <BottomBar>
                <p>&copy; {new Date().getFullYear()} Cursinho Inserção — Todos os direitos reservados</p>
                <p>
                    Desenvolvedores:{' '}
                    <DevLink href="https://github.com/Anselmo2001" target="_blank" rel="noopener noreferrer">Claudio Anselmo</DevLink>,{' '}
                    <DevLink href="https://github.com/gabezadx" target="_blank" rel="noopener noreferrer">Gabriel Henrique</DevLink>,{' '}
                    <DevLink href="https://github.com/mwrina" target="_blank" rel="noopener noreferrer">Mari Rosa</DevLink>,{' '}
                    <DevLink href="https://github.com/messiaspichaujr" target="_blank" rel="noopener noreferrer">Messias Pichau</DevLink>,{' '}
                    <DevLink href="https://github.com/nathalia-berri" target="_blank" rel="noopener noreferrer">Nathalia Berri</DevLink>
                </p>
            </BottomBar>
        </FooterWrapper>
    );
}
