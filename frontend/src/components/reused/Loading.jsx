import styled, { keyframes } from 'styled-components';

const dotPulse = keyframes`
    0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
    40% { opacity: 1; transform: scale(1); }
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    gap: 0.75rem;
`;

const Text = styled.span`
    font-size: 1rem;
    font-weight: 500;
    color: #4A453E;
    letter-spacing: 0.02em;
`;

const Dots = styled.span`
    display: inline-flex;
    gap: 4px;
    margin-left: 2px;
`;

const Dot = styled.span`
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: #C49A1A;
    display: inline-block;
    animation: ${dotPulse} 1.4s ease-in-out infinite;
    &:nth-child(1) { animation-delay: 0s; }
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
`;

export default function Loading() {
    return (
        <Wrapper>
            <Text>
                Carregando
                <Dots>
                    <Dot />
                    <Dot />
                    <Dot />
                </Dots>
            </Text>
        </Wrapper>
    );
}
