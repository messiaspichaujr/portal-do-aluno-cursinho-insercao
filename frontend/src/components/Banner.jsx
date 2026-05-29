import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import bannerReserva from "../assets/imgs/img_capa_exemplo.jpg";

const HeroSection = styled.section`
    position: relative;
    width: 100%;
    min-height: 90vh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (max-width: 768px) {
        min-height: 70vh;
    }
`;

const HeroImage = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: opacity 0.5s ease-in-out;
`;

const Placeholder = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #C49A1A 0%, #F2B924 50%, #F5C542 100%);
    opacity: ${props => props.loaded ? 0 : 1};
    transition: opacity 0.5s ease-in-out;
`;

const Overlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        to bottom,
        rgba(30, 27, 22, 0.45) 0%,
        rgba(30, 27, 22, 0.65) 50%,
        rgba(30, 27, 22, 0.85) 100%
    );
`;

const HeroContent = styled.div`
    position: relative;
    z-index: 2;
    text-align: center;
    color: #FFFFFF;
    padding: 0 2rem;
    max-width: 750px;
`;

const HeroTitle = styled.h1`
    font-size: 3.6rem;
    font-weight: 800;
    margin-bottom: 1.2rem;
    letter-spacing: -0.5px;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

    @media (max-width: 768px) {
        font-size: 2.2rem;
    }
`;

const HeroSubtitle = styled.p`
    font-size: 1.2rem;
    font-weight: 300;
    line-height: 1.7;
    opacity: 0.95;
    margin-bottom: 2.5rem;

    @media (max-width: 768px) {
        font-size: 1rem;
    }
`;

const HeroCTA = styled.a`
    display: inline-block;
    padding: 1rem 3rem;
    background-color: #F2B924;
    color: #1E1B16;
    text-decoration: none;
    border-radius: 2rem;
    font-weight: 700;
    font-size: 1.05rem;
    transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s;

    &:hover {
        background-color: #C49A1A;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(242, 185, 36, 0.3);
    }
`;

export default function Banner({ imagemUrl, loading = false }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const imgRef = useRef();

    useEffect(() => {
        if (imgRef.current && imgRef.current.complete) {
            setImageLoaded(true);
        }
    }, []);

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    return (
        <HeroSection>
            <Placeholder loaded={imageLoaded || !imagemUrl} />
            <HeroImage
                ref={imgRef}
                src={imagemUrl || bannerReserva}
                alt="Banner Cursinho Inserção"
                loading="eager"
                onLoad={handleImageLoad}
                style={{ opacity: imageLoaded || !imagemUrl ? 1 : 0 }}
            />
            <Overlay />
            <HeroContent>
                <HeroTitle>Cursinho Inserção</HeroTitle>
                <HeroSubtitle>
                    Educação popular e preparação para o ensino superior.
                    Transformando vidas através do conhecimento.
                </HeroSubtitle>
                <HeroCTA href="#sobre">Saiba Mais</HeroCTA>
            </HeroContent>
        </HeroSection>
    );
}
