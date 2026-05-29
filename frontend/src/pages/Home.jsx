import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { getUploadUrl } from '../services/uploads';
import { Link } from 'react-router-dom';
import Navbar from "../components/reused/Navbar";
import Banner from "../components/Banner";
import Section from "../components/Section";
import Footer from "../components/reused/Footer";
import Loading from '../components/reused/Loading';
import styled, { keyframes } from 'styled-components';

import '../global.css';

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
`;

const PageContent = styled.div`
    animation: ${fadeIn} 0.8s ease-out;
`;

const CTASection = styled.section`
    width: 100%;
    padding: 6rem 2rem;
    background: linear-gradient(135deg, #C49A1A 0%, #F2B924 50%, #F5C542 100%);
    text-align: center;
`;

const CTATitle = styled.h2`
    font-size: 2.2rem;
    font-weight: 800;
    color: #FFFFFF;
    margin-bottom: 1rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);

    @media (max-width: 768px) {
        font-size: 1.6rem;
    }
`;

const CTAText = styled.p`
    font-size: 1.15rem;
    color: rgba(255, 255, 255, 0.92);
    margin-bottom: 2.5rem;
    max-width: 520px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.7;
`;

const CTAButton = styled(Link)`
    display: inline-block;
    padding: 1rem 3rem;
    background-color: #FFFFFF;
    color: #1E1B16;
    text-decoration: none;
    border-radius: 2rem;
    font-weight: 700;
    font-size: 1.05rem;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
`;

export default function Home() {
    const [secoes, setSecoes] = useState([]);
    const [bannerUrl, setBannerUrl] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Carregar em paralelo para maior velocidade
                const [resSecoes, resBanner] = await Promise.allSettled([
                    api.get('/api/secoes'),
                    api.get('/api/banners/ativo').catch(() => null)
                ]);

                if (resSecoes.status === 'fulfilled') {
                    setSecoes(resSecoes.value.data);
                }

                if (resBanner.status === 'fulfilled' && resBanner.value) {
                    setBannerUrl(getUploadUrl(resBanner.value.data.imagem));
                }
            } catch (err) {
                console.error("Erro ao buscar dados:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <PageContent><Loading /></PageContent>;
    }

    return (
        <PageContent>
            <Navbar />
            <Banner imagemUrl={bannerUrl} loading={loading} />

            {secoes.map((secao, index) => (
                <Section
                    key={secao.id}
                    titulo={secao.titulo}
                    imagem={secao.imagem}
                    texto={secao.texto}
                    index={index}
                />
            ))}

            <CTASection id="sobre">
                <CTATitle>Faça parte da nossa história</CTATitle>
                <CTAText>
                    Junte-se ao Cursinho Inserção e prepare-se para o ensino superior
                    com educação popular de qualidade.
                </CTAText>
                <CTAButton to="/portal/login">Acessar o Portal</CTAButton>
            </CTASection>

            <Footer />
        </PageContent>
    );
}
