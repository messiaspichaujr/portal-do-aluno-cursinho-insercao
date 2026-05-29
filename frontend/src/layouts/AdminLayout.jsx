import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import AdminSidebar from '../components/reused/AdminSidebar';

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
`;

const AdminContainer = styled.div`
    display: flex;
    min-height: 100vh;
    background-color: #f8f9fa; 
`;

const ContentWrapper = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    margin-left: ${props => (props.isSidebarCollapsed ? '80px' : '323px')};
    transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const MainContent = styled.main`
    flex-grow: 1;
    padding: 2rem;
    overflow-y: auto;
    animation: ${fadeIn} 0.4s ease-out;
`;

export default function AdminLayout() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <AdminContainer>
            <AdminSidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
            />

            <ContentWrapper isSidebarCollapsed={isSidebarCollapsed}>
                <MainContent>
                    <Outlet/>
                </MainContent>
            </ContentWrapper>
        </AdminContainer>
    );
}
