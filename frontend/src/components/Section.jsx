import styled from 'styled-components';
import { getUploadUrl } from '../services/uploads';

const SectionWrapper = styled.section`
    width: 100%;
    padding: 0;
    background-color: ${props => props.$even ? '#FEF8E9' : '#FFFFFF'};

    @media (max-width: 768px) {
        padding: 0;
    }
`;

const SectionInner = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 5rem 2rem;

    @media (max-width: 768px) {
        padding: 3rem 1.5rem;
    }
`;

const ContentRow = styled.div`
    display: flex;
    align-items: center;
    gap: 4rem;

    ${props => props.$reverse ? 'flex-direction: row-reverse;' : 'flex-direction: row;'}

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 2rem;
    }
`;

const TextContent = styled.div`
    flex: 1;
    min-width: 0;

    @media (max-width: 768px) {
        text-align: center;
    }
`;

const SectionLabel = styled.span`
    display: inline-block;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #C49A1A;
    margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
    font-size: 2.2rem;
    font-weight: 800;
    color: #1E1B16;
    margin-bottom: 1.5rem;
    line-height: 1.2;

    @media (max-width: 768px) {
        font-size: 1.6rem;
    }
`;

const SectionText = styled.p`
    font-size: 1.1rem;
    line-height: 1.85;
    color: #555;
`;

const ImageWrapper = styled.div`
    flex: 1;
    min-width: 0;
    position: relative;
`;

const SectionImage = styled.img`
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
    transition: transform 0.4s ease;

    &:hover {
        transform: scale(1.02);
    }

    @media (max-width: 768px) {
        height: 250px;
        border-radius: 16px;
    }
`;

const DecorationDot = styled.div`
    position: absolute;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #F2B924, #C49A1A);
    opacity: 0.15;
    z-index: -1;
    top: -20px;
    ${props => props.$reverse ? 'right: -20px;' : 'left: -20px;'}
`;

const TextOnlyContent = styled.div`
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
`;

export default function Section({ titulo, imagem, texto, index }) {
    const even = index % 2 === 0;
    const reverse = index % 2 !== 0;

    if (!imagem) {
        return (
            <SectionWrapper $even={even}>
                <SectionInner>
                    <TextOnlyContent>
                        <SectionTitle>{titulo}</SectionTitle>
                        <SectionText>{texto}</SectionText>
                    </TextOnlyContent>
                </SectionInner>
            </SectionWrapper>
        );
    }

    return (
        <SectionWrapper $even={even}>
            <SectionInner>
                <ContentRow $reverse={reverse}>
                    <TextContent>
                        <SectionLabel>Saiba mais</SectionLabel>
                        <SectionTitle>{titulo}</SectionTitle>
                        <SectionText>{texto}</SectionText>
                    </TextContent>
                    <ImageWrapper>
                        <DecorationDot $reverse={reverse} />
                        <SectionImage src={getUploadUrl(imagem)} alt={titulo} />
                    </ImageWrapper>
                </ContentRow>
            </SectionInner>
        </SectionWrapper>
    );
}
