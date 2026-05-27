import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { api } from '../../services/api';
import Loading from '../../components/reused/Loading';

/* ─── Color tokens ─── */
const C = {
    dark:    '#1E1B16',
    primary: '#F2B924',
    accent:  '#C49A1A',
    cream:   '#FEF8E9',
    text:    '#4A453E',
    error:   '#E8445A',
    border:  '#E8E2D6',
    white:   '#FFFFFF',
};

/* ─── Layout ─── */
const Container = styled.div`
    display: flex; flex-direction: column; padding: 1.5rem; gap: 1.5rem;
    min-height: 100%; max-width: 1100px; margin: 0 auto;
`;

const Title = styled.h1`
    margin: 0; font-size: 1.5rem; font-weight: 700; color: ${C.dark};
`;

const Subtitle = styled.h2`
    margin: 0 0 0.75rem; font-size: 1.1rem; font-weight: 600; color: ${C.text};
`;

/* ─── Panel ─── */
const Panel = styled.section`
    background: ${C.cream}; border-radius: 1rem; padding: 1.5rem;
    box-shadow: 0 2px 6px rgba(0,0,0,0.06);
`;

/* ─── Discipline cards grid ─── */
const DiscGrid = styled.div`
    display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
`;

const DiscCard = styled.button`
    display: flex; flex-direction: column; align-items: flex-start; gap: 0.35rem;
    padding: 1.25rem 1.5rem; border-radius: 0.75rem; cursor: pointer;
    border: 2px solid ${props => props.$active ? C.primary : C.border};
    background: ${props => props.$active ? C.primary : C.white};
    color: ${props => props.$active ? C.dark : C.text};
    transition: all 0.2s; text-align: left;

    &:hover {
        border-color: ${C.primary};
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(242,185,36,0.2);
    }

    .sigla { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
    .nome  { font-size: 0.95rem; font-weight: 600; }
`;

/* ─── Table ─── */
const TableWrap = styled.div`
    overflow-x: auto; margin-top: 0.5rem;
`;

const Table = styled.table`
    width: 100%; border-collapse: collapse; font-size: 0.95rem;
    th, td { padding: 0.7rem 1rem; text-align: center; border-bottom: 1px solid ${C.border}; }
    th { background: ${C.primary}; color: ${C.dark}; font-weight: 700; white-space: nowrap; }
    td { color: ${C.text}; }
    tbody tr { transition: background 0.15s; }
    tbody tr:hover { background: rgba(242,185,36,0.08); }
`;

/* ─── Grade display ─── */
const GradeBadge = styled.span`
    display: inline-block; min-width: 48px; padding: 0.3rem 0.5rem;
    border-radius: 0.4rem; font-weight: 600; font-size: 0.95rem;
    background: ${props => props.$empty ? 'transparent' : C.white};
    color: ${props => props.$empty ? '#aaa' : C.text};
    border: 1px solid ${props => props.$empty ? 'transparent' : C.border};
`;

const Avg = styled.span`
    font-weight: 700; color: ${C.dark};
`;

/* ─── Messages ─── */
const Msg = styled.p`
    margin: 0; padding: 1rem; text-align: center; color: ${C.text}; font-style: italic;
`;

const ErrorMsg = styled.p`
    margin: 0; padding: 1rem; text-align: center; color: ${C.error}; font-weight: 600;
`;

const Spinner = styled.div`
    display: flex; justify-content: center; align-items: center;
    padding: 3rem; color: ${C.text}; font-size: 1rem;
`;

/* ─── Helpers ─── */
const EVAL_NAMES = ['N1', 'N2', 'N3', 'N4'];

function calcMedia(values) {
    const vals = values.filter(v => v !== null && v !== undefined && v !== '');
    if (vals.length === 0) return '-';
    const sum = vals.reduce((a, b) => a + Number(b), 0);
    return (sum / vals.length).toFixed(1);
}

/* ═══════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════ */
export default function NotasAluno() {
    const token = localStorage.getItem('user_token');
    let userId = null;
    if (token) {
        try { userId = jwtDecode(token).sub; } catch { /* ignore */ }
    }

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    /* student's enrolled disciplines */
    const [minhasDisciplinas, setMinhasDisciplinas] = useState([]);
    const [disciplinaMap, setDisciplinaMap] = useState({});  // { id: { sigla, nome } }

    /* selected discipline */
    const [selectedDisciplina, setSelectedDisciplina] = useState(null);

    /* avaliacoes for selected discipline { N1: id, N2: id, ... } */
    const [avaliacaoMap, setAvaliacaoMap] = useState({});

    /* grades { avaliacaoId: nota } */
    const [grades, setGrades] = useState({});

    /* ─── Load student's disciplines ─── */
    useEffect(() => {
        if (!userId) { setLoading(false); return; }
        (async () => {
            try {
                /* load discipline catalog */
                const discRes = await api.get('/api/disciplinas');
                const dMap = {};
                discRes.data.forEach(d => { dMap[d.id] = d; });
                setDisciplinaMap(dMap);

                /* load enrollments */
                const matRes = await api.get(`/api/matriculas-disciplina/aluno/${userId}`);
                const enrolled = matRes.data.map(m => m.disciplina);
                setMinhasDisciplinas(enrolled);
            } catch (err) {
                setError('Erro ao carregar disciplinas.');
            } finally {
                setLoading(false);
            }
        })();
    }, [userId]);

    /* ─── Load grades when a discipline is selected ─── */
    useEffect(() => {
        if (!selectedDisciplina || !userId) {
            setGrades({});
            setAvaliacaoMap({});
            return;
        }

        (async () => {
            try {
                /* evaluations */
                const avaRes = await api.get(`/api/avaliacoes/disciplina/${selectedDisciplina}`);
                const aMap = {};
                avaRes.data.forEach(a => { aMap[a.nomeDaNota] = a.id; });
                setAvaliacaoMap(aMap);

                /* grades */
                const notasRes = await api.get(`/api/notas/aluno/${userId}/disciplina/${selectedDisciplina}`);
                const g = {};
                notasRes.data.forEach(n => {
                    g[n.avaliacao] = n.nota;
                });
                setGrades(g);
            } catch (err) {
                setError('Erro ao carregar notas.');
            }
        })();
    }, [selectedDisciplina, userId]);

    /* ─── Render helpers ─── */
    function gradeFor(evalName) {
        const avaId = avaliacaoMap[evalName];
        if (!avaId) return { value: null, empty: true };
        const val = grades[avaId];
        return {
            value: val !== null && val !== undefined ? Number(val).toFixed(1) : '-',
            empty: val === null || val === undefined,
        };
    }

    function calcOverallMedia() {
        const vals = EVAL_NAMES.map(n => {
            const avaId = avaliacaoMap[n];
            return avaId ? grades[avaId] : null;
        });
        return calcMedia(vals);
    }

    /* ─── Loading ─── */
    if (loading) return <Container><Loading /></Container>;

    /* ─── Render ─── */
    return (
        <Container>
            <Title>Minhas Notas</Title>

            {error && <ErrorMsg>{error}</ErrorMsg>}

            {/* Discipline cards */}
            <Panel>
                <Subtitle>Disciplinas</Subtitle>
                {minhasDisciplinas.length === 0 ? (
                    <Msg>Você nao esta matriculado em nenhuma disciplina.</Msg>
                ) : (
                    <DiscGrid>
                        {minhasDisciplinas.map(dId => {
                            const d = disciplinaMap[dId];
                            if (!d) return null;
                            return (
                                <DiscCard
                                    key={dId}
                                    $active={selectedDisciplina === dId}
                                    onClick={() => setSelectedDisciplina(dId)}
                                >
                                    <span className="sigla">{d.sigla}</span>
                                    <span className="nome">{d.nome}</span>
                                </DiscCard>
                            );
                        })}
                    </DiscGrid>
                )}
            </Panel>

            {/* Grades table */}
            {selectedDisciplina && (
                <Panel>
                    <Subtitle>
                        Notas — {disciplinaMap[selectedDisciplina]?.sigla || ''}{' '}
                        {disciplinaMap[selectedDisciplina]?.nome || ''}
                    </Subtitle>
                    <TableWrap>
                        <Table>
                            <thead>
                                <tr>
                                    {EVAL_NAMES.map(n => <th key={n}>{n}</th>)}
                                    <th>Media</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {EVAL_NAMES.map(n => {
                                        const g = gradeFor(n);
                                        return (
                                            <td key={n}>
                                                <GradeBadge $empty={g.empty}>{g.value}</GradeBadge>
                                            </td>
                                        );
                                    })}
                                    <td><Avg>{calcOverallMedia()}</Avg></td>
                                </tr>
                            </tbody>
                        </Table>
                    </TableWrap>
                </Panel>
            )}
        </Container>
    );
}
