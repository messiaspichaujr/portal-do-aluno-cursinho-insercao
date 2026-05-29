import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
`;

const fadeOut = keyframes`
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-20px); }
`;

const TransitionContainer = styled.div`
    width: 100%;
    min-height: 100vh;

    &.page-enter {
        animation: ${fadeIn} 0.5s ease-out forwards;
    }

    &.page-exit {
        animation: ${fadeOut} 0.3s ease-in forwards;
    }
`;

export default function PageTransition({ children }) {
    const [displayChildren, setDisplayChildren] = useState(children);
    const [transitionClass, setTransitionClass] = useState('page-enter');
    const location = useLocation();

    useEffect(() => {
        if (children !== displayChildren) {
            setTransitionClass('page-exit');

            const timer = setTimeout(() => {
                setDisplayChildren(children);
                setTransitionClass('page-enter');
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [children, location]);

    return (
        <TransitionContainer className={transitionClass}>
            {displayChildren}
        </TransitionContainer>
    );
}
