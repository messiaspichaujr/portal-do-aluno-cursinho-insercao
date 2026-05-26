import styled from 'styled-components';
import bannerReserva from "../assets/imgs/img_capa_exemplo.jpg";

const HeroSection = styled.section`
    position: relative;
    width: 100%;
    min-height: 80vh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (max-width: 768px) {
        min-height: 60vh;
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
`;

const Overlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        to bottom,
        rgba(13, 118, 184, 0.55) 0%,
        rgba(13, 118, 184, 0.75) 50%,
        rgba(13, 118, 184, 0.9) 100%
    );
`;

const HeroContent = styled.div`
    position: relative;
    z-index: 2;
    text-align: center;
    color: #FFFFFF;
    padding: 0 2rem;
    max-width: 700px;
`;

const HeroTitle = styled.h1`
    font-size: 3.2rem;
    font-weight: 800;
    margin-bottom: 1rem;
    letter-spacing: -0.5px;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

    @media (max-width: 768px) {
        font-size: 2rem;
    }
`;

const HeroSubtitle = styled.p`
    font-size: 1.15rem;
    font-weight: 300;
    line-height: 1.6;
    opacity: 0.95;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
        font-size: 0.95rem;
    }
`;

const HeroCTA = styled.a`
    display: inline-block;
    padding: 0.85rem 2.5rem;
    background-color: #F2B924;
    color: #333;
    text-decoration: none;
    border-radius: 2rem;
    font-weight: 700;
    font-size: 1rem;
    transition: background-color 0.2s, transform 0.2s;

    &:hover {
        background-color: #e0a820;
        transform: translateY(-2px);
    }
`;

export default function Banner({ imagemUrl }) {
    return (
        <HeroSection>
            <HeroImage
                src={imagemUrl || bannerReserva}
                alt="Banner Cursinho Inserção"
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
