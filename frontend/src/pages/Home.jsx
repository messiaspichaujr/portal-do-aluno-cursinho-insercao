import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { getUploadUrl } from '../services/uploads';
import { Link } from 'react-router-dom';
import Navbar from "../components/reused/Navbar";
import Banner from "../components/Banner";
import Section from "../components/Section";
import Footer from "../components/reused/Footer";
import styled from 'styled-components';

import '../global.css';

const LoadingContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    font-size: 1.2rem;
    color: #0D76B8;
`;

const ErrorContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    font-size: 1rem;
    color: #E23467;
    padding: 2rem;
    text-align: center;
`;

const CTASection = styled.section`
    width: 100%;
    padding: 5rem 2rem;
    background: linear-gradient(135deg, #E23467 0%, #F2B924 100%);
    text-align: center;
`;

const CTATitle = styled.h2`
    font-size: 2rem;
    font-weight: 700;
    color: #FFFFFF;
    margin-bottom: 1rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const CTAText = styled.p`
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 2rem;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
`;

const CTAButton = styled(Link)`
    display: inline-block;
    padding: 1rem 3rem;
    background-color: #FFFFFF;
    color: #E23467;
    text-decoration: none;
    border-radius: 2rem;
    font-weight: 700;
    font-size: 1.1rem;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    }
`;

export default function Home() {
    const [secoes, setSecoes] = useState([]);
    const [bannerUrl, setBannerUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resSecoes = await api.get('/api/secoes');
                setSecoes(resSecoes.data);
            } catch (err) {
                console.error("Erro ao buscar seções:", err);
            }

            try {
                const resBanner = await api.get('/api/banners/ativo');
                setBannerUrl(getUploadUrl(resBanner.data.imagem));
            } catch (err) {
                console.log("Nenhum banner ativo, usando imagem padrão.");
            }

            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) {
        return <LoadingContainer>Carregando...</LoadingContainer>;
    }

    if (error) {
        return <ErrorContainer>Erro ao carregar a página. Tente novamente mais tarde.</ErrorContainer>;
    }

    return (
        <>
            <Navbar />
            <Banner imagemUrl={bannerUrl} />

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
                <CTAButton to="/admin/login">Acessar o Portal</CTAButton>
            </CTASection>

            <Footer />
        </>
    );
}
