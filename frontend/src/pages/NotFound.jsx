import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #FEF8E9;
  font-family: 'Roboto', sans-serif;
  text-align: center;
  padding: 2rem;
`;

const ErrorCode = styled.h1`
  font-size: 6rem;
  color: #E23467;
  margin: 0;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #0D76B8;
  margin: 1rem 0;
`;

const Text = styled.p`
  color: #555;
  margin-bottom: 2rem;
`;

const HomeLink = styled(Link)`
  padding: 0.75rem 2rem;
  background-color: #F2B924;
  color: #fff;
  text-decoration: none;
  border-radius: 1rem;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e0a820;
  }
`;

export default function NotFound() {
    return (
        <Container>
            <ErrorCode>404</ErrorCode>
            <Title>Página não encontrada</Title>
            <Text>A página que você procura não existe ou foi removida.</Text>
            <HomeLink to="/home">Voltar à página inicial</HomeLink>
        </Container>
    );
}
