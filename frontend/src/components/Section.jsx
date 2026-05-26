import styled from 'styled-components';
import { getUploadUrl } from '../services/uploads';

const SectionWrapper = styled.section`
    width: 100%;
    padding: 5rem 0;
    background-color: ${props => props.$even ? '#FEF8E9' : '#FFFFFF'};

    &:last-of-type {
        padding-bottom: 4rem;
    }
`;

const Content = styled.div`
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    gap: 3rem;

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

const SectionTitle = styled.h2`
    font-size: 1.75rem;
    font-weight: 700;
    color: #0D76B8;
    margin-bottom: 1rem;
    line-height: 1.3;

    @media (max-width: 768px) {
        font-size: 1.4rem;
    }
`;

const SectionText = styled.p`
    font-size: 1.05rem;
    line-height: 1.75;
    color: #555;
`;

const ImageContent = styled.div`
    flex: 1;
    min-width: 0;
`;

const SectionImage = styled.img`
    width: 100%;
    max-height: 400px;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.02);
    }
`;

const TextOnlyContent = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 0 2rem;
    text-align: center;
`;

export default function Section({ titulo, imagem, texto, index }) {
    const even = index % 2 === 0;
    const reverse = index % 2 !== 0;

    if (!imagem) {
        return (
            <SectionWrapper $even={even}>
                <TextOnlyContent>
                    <SectionTitle>{titulo}</SectionTitle>
                    <SectionText>{texto}</SectionText>
                </TextOnlyContent>
            </SectionWrapper>
        );
    }

    return (
        <SectionWrapper $even={even}>
            <Content $reverse={reverse}>
                <TextContent>
                    <SectionTitle>{titulo}</SectionTitle>
                    <SectionText>{texto}</SectionText>
                </TextContent>
                <ImageContent>
                    <SectionImage src={getUploadUrl(imagem)} alt={titulo} />
                </ImageContent>
            </Content>
        </SectionWrapper>
    );
}
