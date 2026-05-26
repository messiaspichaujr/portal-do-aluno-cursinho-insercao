import { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../assets/imgs/logo_sem_fundo.png';

const Nav = styled.nav`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 3rem;
    z-index: 1000;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;

    ${props => props.$scrolled ? `
        background-color: #0D76B8;
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
    ` : `
        background-color: transparent;
    `}
`;

const LogoImg = styled.img`
    height: 48px;
    object-fit: contain;
    transition: filter 0.3s ease;
    ${props => !props.$scrolled && `filter: brightness(0) invert(1);`}
`;

const NavLinks = styled.div`
    display: flex;
    align-items: center;
    gap: 2rem;

    @media (max-width: 768px) {
        display: none;
    }
`;

const NavLink = styled(Link)`
    font-size: 0.95rem;
    font-weight: 500;
    text-decoration: none;
    color: #FFF;
    opacity: 0.9;
    transition: opacity 0.2s;

    &:hover {
        opacity: 1;
    }
`;

const LoginButton = styled(Link)`
    padding: 0.6rem 1.5rem;
    background-color: #E23467;
    color: #FFF;
    text-decoration: none;
    border-radius: 2rem;
    font-weight: 600;
    font-size: 0.9rem;
    transition: background-color 0.2s, transform 0.2s;

    &:hover {
        background-color: #c62a55;
        transform: translateY(-1px);
    }
`;

const MobileMenuButton = styled.button`
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;

    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
`;

const MobileLine = styled.span`
    width: 24px;
    height: 2px;
    background-color: #FFF;
    border-radius: 2px;
`;

const MobileMenu = styled.div`
    display: none;
    position: fixed;
    top: 72px;
    left: 0;
    right: 0;
    background-color: #0D76B8;
    padding: 1.5rem;
    flex-direction: column;
    gap: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 999;

    @media (max-width: 768px) {
        display: ${props => props.$open ? 'flex' : 'none'};
    }
`;

const MobileLink = styled(Link)`
    font-size: 1rem;
    font-weight: 500;
    text-decoration: none;
    color: #FFF;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    transition: background-color 0.2s;

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
`;

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [location]);

    return (
        <>
            <Nav $scrolled={scrolled}>
                <Link to="/home">
                    <LogoImg src={logo} alt="Cursinho Inserção" $scrolled={scrolled} />
                </Link>

                <NavLinks>
                    <NavLink href="#sobre">Sobre</NavLink>
                    <NavLink href="#contato">Contato</NavLink>
                    <LoginButton to="/portal/login">Entrar</LoginButton>
                </NavLinks>

                <MobileMenuButton onClick={() => setMobileOpen(!mobileOpen)}>
                    <MobileLine />
                    <MobileLine />
                    <MobileLine />
                </MobileMenuButton>
            </Nav>

            <MobileMenu $open={mobileOpen}>
                <MobileLink href="#sobre">Sobre</MobileLink>
                <MobileLink href="#contato">Contato</MobileLink>
                <MobileLink to="/portal/login">Entrar</MobileLink>
                <MobileLink to="/admin/login">Administração</MobileLink>
            </MobileMenu>
        </>
    );
}
