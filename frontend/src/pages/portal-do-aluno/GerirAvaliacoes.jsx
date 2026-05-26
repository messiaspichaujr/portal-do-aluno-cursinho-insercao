import styled from 'styled-components';
import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { api } from '../../services/api';

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

/* ─── Select ─── */
const SelectWrap = styled.div`
    display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;
`;

const Label = styled.label`
    font-weight: 600; font-size: 0.95rem; color: ${C.text};
`;

const Select = styled.select`
    flex: 1; min-width: 220px; padding: 0.65rem 1rem; font-size: 0.95rem;
    border: 2px solid ${C.border}; border-radius: 0.5rem; background: ${C.white};
    color: ${C.text}; outline: none; transition: border-color 0.2s;
    &:focus { border-color: ${C.primary}; }
`;

/* ─── Card / Panel ─── */
const Panel = styled.section`
    background: ${C.cream}; border-radius: 1rem; padding: 1.5rem;
    box-shadow: 0 2px 6px rgba(0,0,0,0.06);
`;

/* ─── Table ─── */
const TableWrap = styled.div`
    overflow-x: auto;
`;

const Table = styled.table`
    width: 100%; border-collapse: collapse; font-size: 0.95rem;
    th, td { padding: 0.7rem 1rem; text-align: center; border-bottom: 1px solid ${C.border}; }
    th { background: ${C.primary}; color: ${C.dark}; font-weight: 700; white-space: nowrap; }
    td { color: ${C.text}; }
    tbody tr { transition: background 0.15s; }
    tbody tr:hover { background: rgba(242,185,36,0.08); }
`;

/* ─── Inline grade input ─── */
const GradeInput = styled.input`
    width: 64px; padding: 0.35rem 0.5rem; font-size: 0.95rem;
    text-align: center; border: 2px solid ${C.primary}; border-radius: 0.4rem;
    outline: none; background: ${C.white}; color: ${C.dark};
    &:focus { border-color: ${C.accent}; box-shadow: 0 0 0 3px rgba(242,185,36,0.25); }
`;

/* ─── Read-only badge for a grade ─── */
const GradeBadge = styled.span`
    display: inline-block; min-width: 48px; padding: 0.3rem 0.5rem;
    border-radius: 0.4rem; font-weight: 600; font-size: 0.95rem;
    background: ${props => props.empty ? 'transparent' : `${C.white}`};
    color: ${props => props.empty ? '#aaa' : C.text};
    border: 1px solid ${props => props.empty ? 'transparent' : C.border};
`;

/* ─── Average ─── */
const Avg = styled.span`
    font-weight: 700; color: ${C.dark};
`;

/* ─── Status messages ─── */
const Msg = styled.p`
    margin: 0; padding: 1rem; text-align: center; color: ${C.text}; font-style: italic;
`;

const ErrorMsg = styled.p`
    margin: 0; padding: 1rem; text-align: center; color: ${C.error}; font-weight: 600;
`;

/* ─── Spinner ─── */
const Spinner = styled.div`
    display: flex; justify-content: center; align-items: center;
    padding: 3rem; color: ${C.text}; font-size: 1rem;
`;

/* ─── Helpers ─── */
const EVAL_NAMES = ['N1', 'N2', 'N3', 'N4'];

function getToken() {
    const raw = localStorage.getItem('user_token');
    if (!raw) return null;
    try { return jwtDecode(raw); } catch { return null; }
}

function calcMedia(grades) {
    const vals = Object.values(grades).filter(v => v !== null && v !== undefined && v !== '');
    if (vals.length === 0) return '-';
    const sum = vals.reduce((a, b) => a + Number(b), 0);
    return (sum / vals.length).toFixed(1);
}

/* ═══════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════ */
export default function GerirAvaliacoes() {
    const user = getToken();
    const isProf = user?.tipo === 2;

    /* discipline list + selected */
    const [disciplinas, setDisciplinas] = useState([]);
    const [disciplinaId, setDisciplinaId] = useState('');
    const [loading, setLoading] = useState(true);

    /* student enrollment rows + student map */
    const [matriculas, setMatriculas] = useState([]);
    const [studentMap, setStudentMap] = useState({});  // { alunoId: nome }

    /* avaliacoes for this discipline { N1: id, N2: id, ... } */
    const [avaliacaoMap, setAvaliacaoMap] = useState({});

    /* grades  { `${alunoId}_${avaliacaoId}`: notaValue } */
    const [grades, setGrades] = useState({});

    /* which cell is currently being edited */
    const [editing, setEditing] = useState(null); // { alunoId, evalName }

    const [error, setError] = useState('');

    /* ─── Load disciplines on mount ─── */
    useEffect(() => {
        (async () => {
            try {
                const res = await api.get('/api/disciplinas');
                setDisciplinas(res.data);
            } catch (err) {
                setError('Erro ao carregar disciplinas.');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    /* ─── Load all students once (for name resolution) ─── */
    useEffect(() => {
        (async () => {
            try {
                const res = await api.get('/api/usuarios/alunos/matriculados');
                const map = {};
                res.data.forEach(s => { map[s.id] = s.nome; });
                setStudentMap(map);
            } catch {
                /* non-critical — IDs will be shown if names unavailable */
            }
        })();
    }, []);

    /* ─── When discipline changes, load everything ─── */
    const loadDisciplineData = useCallback(async (discId) => {
        if (!discId) { setMatriculas([]); setAvaliacaoMap({}); setGrades({}); return; }
        setError('');
        try {
            /* 1. enrollments */
            const matRes = await api.get(`/api/matriculas-disciplina/disciplina/${discId}`);
            const mats = matRes.data;
            setMatriculas(mats);

            /* 2. evaluations for this discipline */
            const avaRes = await api.get(`/api/avaliacoes/disciplina/${discId}`);
            let avas = avaRes.data;

            /* 3. create missing N1-N4 evaluations */
            const existing = avas.map(a => a.nomeDaNota);
            const missing = EVAL_NAMES.filter(n => !existing.includes(n));
            for (const nome of missing) {
                await api.post('/api/avaliacoes', { nomeDaNota: nome, disciplina: Number(discId) });
            }

            /* re-fetch after creation */
            if (missing.length > 0) {
                const avaRes2 = await api.get(`/api/avaliacoes/disciplina/${discId}`);
                avas = avaRes2.data;
            }

            const aMap = {};
            avas.forEach(a => { aMap[a.nomeDaNota] = a.id; });
            setAvaliacaoMap(aMap);

            /* 4. load grades for this discipline */
            const notasRes = await api.get(`/api/notas/disciplina/${discId}`);
            const g = {};
            notasRes.data.forEach(n => {
                g[`${n.aluno}_${n.avaliacao}`] = n.nota;
            });
            setGrades(g);
        } catch (err) {
            setError('Erro ao carregar dados da disciplina.');
        }
    }, []);

    useEffect(() => {
        if (disciplinaId) loadDisciplineData(disciplinaId);
    }, [disciplinaId, loadDisciplineData]);

    /* ─── Grade save ─── */
    async function saveGrade(alunoId, evalName, value) {
        const avaId = avaliacaoMap[evalName];
        if (!avaId) return;

        const nota = value === '' || value === undefined || value === null ? null : parseFloat(value);
        const key = `${alunoId}_${avaId}`;

        /* update local state optimistically */
        setGrades(prev => ({ ...prev, [key]: nota }));
        setEditing(null);

        if (nota === null) return; // empty — don't persist

        try {
            await api.post('/api/notas', {
                aluno: alunoId,
                avaliacao: avaId,
                nota,
                disciplina: Number(disciplinaId),
            });
        } catch (err) {
            setError('Erro ao salvar nota.');
            /* revert */
            setGrades(prev => ({ ...prev, [key]: value === '' ? null : prev[key] }));
        }
    }

    function handleBlur(alunoId, evalName, value) {
        saveGrade(alunoId, evalName, value);
    }

    function handleKeyDown(e, alunoId, evalName, value) {
        if (e.key === 'Enter') {
            e.target.blur();
        } else if (e.key === 'Escape') {
            setEditing(null);
        }
    }

    function startEdit(alunoId, evalName) {
        if (!isProf) return;
        setEditing({ alunoId, evalName });
    }

    /* ─── Render helpers ─── */
    function gradeCell(alunoId, evalName) {
        const avaId = avaliacaoMap[evalName];
        const key = `${alunoId}_${avaId}`;
        const value = grades[key];

        if (editing?.alunoId === alunoId && editing?.evalName === evalName) {
            return (
                <GradeInput
                    autoFocus
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    defaultValue={value ?? ''}
                    onBlur={e => handleBlur(alunoId, evalName, e.target.value)}
                    onKeyDown={e => handleKeyDown(e, alunoId, evalName, e.target.value)}
                />
            );
        }

        return (
            <GradeBadge
                empty={value === null || value === undefined}
                onDoubleClick={() => startEdit(alunoId, evalName)}
                style={isProf ? { cursor: 'pointer' } : {}}
                title={isProf ? 'Clique duplo para editar' : ''}
            >
                {value !== null && value !== undefined ? Number(value).toFixed(1) : '-'}
            </GradeBadge>
        );
    }

    function mediaForAluno(alunoId) {
        const vals = EVAL_NAMES.map(n => {
            const avaId = avaliacaoMap[n];
            return grades[`${alunoId}_${avaId}`];
        });
        return calcMedia(vals);
    }

    /* ─── Loading ─── */
    if (loading) return <Container><Spinner>Carregando...</Spinner></Container>;

    /* ─── Student read-only view ─── */
    if (!isProf && user?.tipo === 3) {
        return (
            <Container>
                <Title>Minhas Notas</Title>
                {disciplinas.length === 0 ? (
                    <Msg>Nenhuma disciplina encontrada.</Msg>
                ) : (
                    <Panel>
                        <Label>Disciplina:{' '}</Label>
                        <Select value={disciplinaId} onChange={e => setDisciplinaId(e.target.value)}>
                            <option value="">Selecione...</option>
                            {disciplinas.map(d => (
                                <option key={d.id} value={d.id}>{d.sigla} — {d.nome}</option>
                            ))}
                        </Select>
                    </Panel>
                )}

                {disciplinaId && (
                    <Panel>
                        <Subtitle>Notas</Subtitle>
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
                                        {EVAL_NAMES.map(n => <td key={n}>{gradeCell(user.sub, n)}</td>)}
                                        <td><Avg>{mediaForAluno(user.sub)}</Avg></td>
                                    </tr>
                                </tbody>
                            </Table>
                        </TableWrap>
                    </Panel>
                )}
            </Container>
        );
    }

    /* ─── Professor view ─── */
    return (
        <Container>
            <Title>Gestao de Notas</Title>

            {error && <ErrorMsg>{error}</ErrorMsg>}

            {/* Discipline selector */}
            <Panel>
                <SelectWrap>
                    <Label htmlFor="disc-select">Disciplina:</Label>
                    <Select
                        id="disc-select"
                        value={disciplinaId}
                        onChange={e => setDisciplinaId(e.target.value)}
                    >
                        <option value="">Selecione uma disciplina</option>
                        {disciplinas.map(d => (
                            <option key={d.id} value={d.id}>
                                {d.sigla} — {d.nome}
                            </option>
                        ))}
                    </Select>
                </SelectWrap>
            </Panel>

            {/* Grades table */}
            {disciplinaId && (
                <Panel>
                    <Subtitle>Lancamento de Notas</Subtitle>
                    {matriculas.length === 0 ? (
                        <Msg>Nenhum aluno matriculado nesta disciplina.</Msg>
                    ) : (
                        <TableWrap>
                            <Table>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'left' }}>Aluno</th>
                                        {EVAL_NAMES.map(n => <th key={n}>{n}</th>)}
                                        <th>Media</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {matriculas.map(m => {
                                        const nome = studentMap[m.aluno] || `Aluno ${m.aluno}`;
                                        return (
                                            <tr key={m.id || m.aluno}>
                                                <td style={{ textAlign: 'left', fontWeight: 600 }}>
                                                    {nome}
                                                </td>
                                                {EVAL_NAMES.map(n => (
                                                    <td key={n}>{gradeCell(m.aluno, n)}</td>
                                                ))}
                                                <td><Avg>{mediaForAluno(m.aluno)}</Avg></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </TableWrap>
                    )}
                </Panel>
            )}
        </Container>
    );
}
