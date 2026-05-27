import styled from 'styled-components';
import { useState, useEffect, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';
import { api } from '../../services/api';

const colors = {
    dark: '#1E1B16',
    primary: '#F2B924',
    accent: '#C49A1A',
    cream: '#FEF8E9',
    text: '#4A453E',
    error: '#E8445A',
    border: '#E8E2D6',
};

const Page = styled.div`
    display: flex;
    flex-direction: column;
    text-align: left;
    padding: 1.5rem;
    height: 100%;
    gap: 1.5rem;
    max-width: 960px;
    margin: 0 auto;
    width: 100%;
`;

const Title = styled.h1`
    margin: 0;
    font-size: 1.5rem;
    color: ${colors.dark};
    font-weight: 700;
`;

const Card = styled.section`
    background: ${colors.cream};
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    border: 1px solid ${colors.border};
`;

const CardTitle = styled.h2`
    margin: 0 0 1.25rem 0;
    font-size: 1.1rem;
    color: ${colors.dark};
    font-weight: 600;
`;

const Row = styled.div`
    display: flex;
    gap: 1rem;
    align-items: flex-end;
    flex-wrap: wrap;

    @media (max-width: 600px) {
        flex-direction: column;
        align-items: stretch;
    }
`;

const FieldGroup = styled.div`
    flex: 1;
    min-width: 180px;
`;

const Label = styled.label`
    font-size: 0.85rem;
    font-weight: 600;
    color: ${colors.text};
    margin-bottom: 0.35rem;
    display: block;
`;

const Select = styled.select`
    font-size: 0.95rem;
    width: 100%;
    padding: 0.7rem 1rem;
    border: 2px solid ${colors.border};
    border-radius: 0.75rem;
    color: ${colors.text};
    background-color: #FFF;
    transition: border-color 0.2s;

    &:focus {
        outline: none;
        border-color: ${colors.primary};
    }
`;

const TableWrapper = styled.div`
    overflow-x: auto;
    margin-top: 1rem;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 0.9rem;

    thead th {
        background: ${colors.dark};
        color: ${colors.cream};
        padding: 0.75rem 1rem;
        text-align: left;
        font-weight: 600;
        white-space: nowrap;

        &:first-child { border-radius: 0.5rem 0 0 0; }
        &:last-child { border-radius: 0 0.5rem 0 0; }
    }

    tbody tr {
        &:nth-child(even) { background: rgba(242,185,36,0.06); }
        &:hover { background: rgba(242,185,36,0.12); }
    }

    tbody td {
        padding: 0.65rem 1rem;
        border-bottom: 1px solid ${colors.border};
        vertical-align: middle;
        color: ${colors.text};
    }
`;

const StatusBadge = styled.span`
    display: inline-block;
    padding: 0.2rem 0.65rem;
    border-radius: 0.4rem;
    font-size: 0.78rem;
    font-weight: 600;
    color: #FFF;
    background: ${props => (props.$present ? colors.primary : colors.error)};
`;

const FilterGroup = styled.div`
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
`;

const FilterButton = styled.button`
    padding: 0.5rem 1.2rem;
    border-radius: 0.6rem;
    border: 2px solid ${props => (props.$active ? colors.primary : colors.border)};
    background: ${props => (props.$active ? colors.primary : '#FFF')};
    color: ${props => (props.$active ? '#FFF' : colors.text)};
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        border-color: ${colors.primary};
        background: ${props => (props.$active ? colors.accent : 'rgba(242,185,36,0.1)')};
    }
`;

const SectionHeader = styled.h3`
    margin: 1.5rem 0 0.5rem 0;
    font-size: 0.95rem;
    color: ${colors.accent};
    font-weight: 700;
    padding-bottom: 0.35rem;
    border-bottom: 2px solid ${colors.primary};
    display: inline-block;
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 2.5rem 1rem;
    color: ${colors.text};
    font-size: 0.95rem;
    opacity: 0.7;
`;

const LoadingOverlay = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    color: ${colors.text};
    font-size: 1rem;
`;

const DisciplineSection = styled.div`
    margin-bottom: 1.5rem;
`;

const DisciplineLabel = styled.h3`
    margin: 0 0 0.75rem 0;
    font-size: 1rem;
    color: ${colors.dark};
    font-weight: 700;
    padding: 0.5rem 0.75rem;
    background: rgba(242,185,36,0.15);
    border-left: 4px solid ${colors.primary};
    border-radius: 0 0.5rem 0.5rem 0;
`;

export default function VerFrequencia() {
    const [frequencias, setFrequencias] = useState([]);
    const [tiposFrequencia, setTiposFrequencia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('diario');

    // Professor state
    const [disciplinas, setDisciplinas] = useState([]);
    const [disciplinaId, setDisciplinaId] = useState('');
    const [todosAlunos, setTodosAlunos] = useState([]);

    // Student state
    const [studentDisciplinas, setStudentDisciplinas] = useState([]);
    const [studentData, setStudentData] = useState({});

    const token = localStorage.getItem('user_token');
    let userId = null;
    let isProf = false;
    if (token) {
        try {
            const decoded = jwtDecode(token);
            userId = decoded.sub;
            isProf = decoded.tipo === 2;
        } catch { /* ignore */ }
    }

    // Load tipos and role-specific data
    useEffect(() => {
        api.get('/api/frequencias/tipos')
            .then((res) => setTiposFrequencia(res.data))
            .catch(() => {});

        if (isProf) {
            setLoading(true);
            Promise.all([
                api.get('/api/disciplinas'),
                api.get('/api/usuarios/alunos/matriculados'),
            ])
                .then(([resDisc, resAlunos]) => {
                    setDisciplinas(resDisc.data);
                    setTodosAlunos(resAlunos.data);
                })
                .catch((err) => console.error('Erro ao carregar dados:', err))
                .finally(() => setLoading(false));
        } else if (userId) {
            api.get('/api/disciplinas')
                .then((res) => setDisciplinas(res.data))
                .catch(() => {});
            loadStudentData();
        }
    }, [userId, isProf]);

    // Professor: load frequencies when discipline changes
    useEffect(() => {
        if (!isProf || !disciplinaId) {
            if (isProf) setFrequencias([]);
            return;
        }
        setLoading(true);
        api.get(`/api/frequencias/disciplina/${disciplinaId}`)
            .then((res) => setFrequencias(res.data))
            .catch((err) => console.error('Erro ao buscar frequencias:', err))
            .finally(() => setLoading(false));
    }, [disciplinaId, isProf]);

    async function loadStudentData() {
        setLoading(true);
        try {
            const matRes = await api.get(`/api/matriculas-disciplina/aluno/${userId}`);
            const matriculas = matRes.data;
            const discIds = matriculas.map((m) => m.disciplina);
            setStudentDisciplinas(discIds);

            const dataMap = {};
            await Promise.all(
                discIds.map(async (discId) => {
                    try {
                        const freqRes = await api.get(
                            `/api/frequencias/aluno/${userId}/disciplina/${discId}`
                        );
                        dataMap[discId] = freqRes.data;
                    } catch {
                        dataMap[discId] = [];
                    }
                })
            );
            setStudentData(dataMap);
        } catch (err) {
            console.error('Erro ao carregar dados do aluno:', err);
        } finally {
            setLoading(false);
        }
    }

    function getTipoLabel(tipoId) {
        const t = tiposFrequencia.find((tf) => tf.id === tipoId);
        return t ? t.tipo : String(tipoId);
    }

    function isPresente(tipoId) {
        const label = getTipoLabel(tipoId);
        return label.toLowerCase().includes('presente');
    }

    function formatarData(dataStr) {
        return new Date(dataStr).toLocaleDateString('pt-BR');
    }

    function getAlunoNome(alunoId) {
        const a = todosAlunos.find((al) => al.id === alunoId);
        return a ? a.nome : `Aluno #${alunoId}`;
    }

    // Group records by period (week or month)
    function groupByPeriod(records) {
        if (filtro === 'diario') return null; // no grouping

        const groups = {};
        records.forEach((r) => {
            const d = new Date(r.data);
            let key;
            if (filtro === 'semanal') {
                const startOfWeek = new Date(d);
                startOfWeek.setDate(d.getDate() - d.getDay());
                key = `Semana de ${startOfWeek.toLocaleDateString('pt-BR')}`;
            } else {
                key = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
                key = key.charAt(0).toUpperCase() + key.slice(1);
            }
            if (!groups[key]) groups[key] = [];
            groups[key].push(r);
        });
        return groups;
    }

    function renderTable(records, showStudentName) {
        const sorted = [...records].sort(
            (a, b) => new Date(b.data) - new Date(a.data)
        );

        if (filtro === 'diario') {
            return (
                <TableWrapper>
                    <Table>
                        <thead>
                            <tr>
                                <th>Data</th>
                                {showStudentName && <th>Aluno</th>}
                                <th>Status</th>
                                <th>Justificativa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.map((f) => (
                                <tr key={f.id}>
                                    <td>{formatarData(f.data)}</td>
                                    {showStudentName && (
                                        <td style={{ fontWeight: 500 }}>
                                            {getAlunoNome(f.aluno)}
                                        </td>
                                    )}
                                    <td>
                                        <StatusBadge $present={isPresente(f.frequencia)}>
                                            {getTipoLabel(f.frequencia)}
                                        </StatusBadge>
                                    </td>
                                    <td>{f.justificativa || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </TableWrapper>
            );
        }

        // Grouped view
        const groups = groupByPeriod(sorted);
        if (!groups) return null;

        return Object.entries(groups).map(([period, recs]) => (
            <div key={period}>
                <SectionHeader>{period}</SectionHeader>
                <TableWrapper>
                    <Table>
                        <thead>
                            <tr>
                                <th>Data</th>
                                {showStudentName && <th>Aluno</th>}
                                <th>Status</th>
                                <th>Justificativa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recs.map((f) => (
                                <tr key={f.id}>
                                    <td>{formatarData(f.data)}</td>
                                    {showStudentName && (
                                        <td style={{ fontWeight: 500 }}>
                                            {getAlunoNome(f.aluno)}
                                        </td>
                                    )}
                                    <td>
                                        <StatusBadge $present={isPresente(f.frequencia)}>
                                            {getTipoLabel(f.frequencia)}
                                        </StatusBadge>
                                    </td>
                                    <td>{f.justificativa || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </TableWrapper>
            </div>
        ));
    }

    if (loading) {
        return (
            <Page>
                <LoadingOverlay>Carregando...</LoadingOverlay>
            </Page>
        );
    }

    // ========== STUDENT VIEW ==========
    if (!isProf) {
        const hasData = Object.values(studentData).some(
            (arr) => arr && arr.length > 0
        );

        return (
            <Page>
                <Title>Minhas Frequencias</Title>

                <Card>
                    <CardTitle>Filtro</CardTitle>
                    <FilterGroup>
                        <FilterButton
                            $active={filtro === 'diario'}
                            onClick={() => setFiltro('diario')}
                        >
                            Diario
                        </FilterButton>
                        <FilterButton
                            $active={filtro === 'semanal'}
                            onClick={() => setFiltro('semanal')}
                        >
                            Semanal
                        </FilterButton>
                        <FilterButton
                            $active={filtro === 'mensal'}
                            onClick={() => setFiltro('mensal')}
                        >
                            Mensal
                        </FilterButton>
                    </FilterGroup>
                </Card>

                {!hasData && (
                    <Card>
                        <EmptyState>
                            Nenhum registro de frequencia encontrado.
                        </EmptyState>
                    </Card>
                )}

                {studentDisciplinas.map((discId) => {
                    const records = studentData[discId] || [];
                    if (records.length === 0) return null;
                    const disc = disciplinas.length > 0
                        ? disciplinas.find((d) => d.id === discId)
                        : null;
                    const discLabel = disc
                        ? `${disc.sigla} - ${disc.nome}`
                        : `Disciplina #${discId}`;

                    return (
                        <Card key={discId}>
                            <DisciplineLabel>{discLabel}</DisciplineLabel>
                            {renderTable(records, false)}
                        </Card>
                    );
                })}
            </Page>
        );
    }

    // ========== PROFESSOR VIEW ==========
    return (
        <Page>
            <Title>Visualizar Frequencia</Title>

            <Card>
                <CardTitle>Filtros</CardTitle>
                <Row>
                    <FieldGroup>
                        <Label>Disciplina</Label>
                        <Select
                            value={disciplinaId}
                            onChange={(e) => setDisciplinaId(e.target.value)}
                        >
                            <option value="">Selecione uma disciplina</option>
                            {disciplinas.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.sigla} - {d.nome}
                                </option>
                            ))}
                        </Select>
                    </FieldGroup>
                    <FieldGroup>
                        <Label>Periodo</Label>
                        <FilterGroup style={{ marginTop: '0.15rem' }}>
                            <FilterButton
                                $active={filtro === 'diario'}
                                onClick={() => setFiltro('diario')}
                            >
                                Diario
                            </FilterButton>
                            <FilterButton
                                $active={filtro === 'semanal'}
                                onClick={() => setFiltro('semanal')}
                            >
                                Semanal
                            </FilterButton>
                            <FilterButton
                                $active={filtro === 'mensal'}
                                onClick={() => setFiltro('mensal')}
                            >
                                Mensal
                            </FilterButton>
                        </FilterGroup>
                    </FieldGroup>
                </Row>
            </Card>

            {!disciplinaId && (
                <Card>
                    <EmptyState>
                        Selecione uma disciplina para visualizar as frequencias.
                    </EmptyState>
                </Card>
            )}

            {disciplinaId && frequencias.length === 0 && (
                <Card>
                    <EmptyState>
                        Nenhum registro de frequencia encontrado para esta disciplina.
                    </EmptyState>
                </Card>
            )}

            {disciplinaId && frequencias.length > 0 && (
                <Card>
                    <CardTitle>
                        Registros ({frequencias.length})
                    </CardTitle>
                    {renderTable(frequencias, true)}
                </Card>
            )}
        </Page>
    );
}
