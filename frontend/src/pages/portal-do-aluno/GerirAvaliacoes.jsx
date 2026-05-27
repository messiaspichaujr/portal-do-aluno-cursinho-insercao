import styled from 'styled-components';
import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { api } from '../../services/api';

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

const Panel = styled.section`
    background: ${C.cream}; border-radius: 1rem; padding: 1.5rem;
    box-shadow: 0 2px 6px rgba(0,0,0,0.06);
`;

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

const GradeInput = styled.input`
    width: 64px; padding: 0.35rem 0.5rem; font-size: 0.95rem;
    text-align: center; border: 2px solid ${C.primary}; border-radius: 0.4rem;
    outline: none; background: ${C.white}; color: ${C.dark};
    &:focus { border-color: ${C.accent}; box-shadow: 0 0 0 3px rgba(242,185,36,0.25); }
`;

const GradeBadge = styled.span`
    display: inline-block; min-width: 48px; padding: 0.3rem 0.5rem;
    border-radius: 0.4rem; font-weight: 600; font-size: 0.95rem;
    background: ${props => props.empty ? 'transparent' : `${C.white}`};
    color: ${props => props.empty ? '#aaa' : C.text};
    border: 1px solid ${props => props.empty ? 'transparent' : C.border};
`;

const Avg = styled.span` font-weight: 700; color: ${C.dark}; `;

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

const SearchBar = styled.input`
    width: 100%; max-width: 320px; padding: 0.55rem 1rem; font-size: 0.9rem;
    border: 2px solid ${C.border}; border-radius: 0.5rem; background: ${C.white};
    color: ${C.text}; outline: none; transition: border-color 0.2s;
    &:focus { border-color: ${C.primary}; }
`;

const PaginationRow = styled.div`
    display: flex; justify-content: center; align-items: center; gap: 0.75rem;
    margin-top: 1rem; font-size: 0.9rem; color: ${C.text};
`;

const PageBtn = styled.button`
    padding: 0.4rem 0.9rem; border: 2px solid ${C.border}; border-radius: 0.4rem;
    background: ${C.white}; color: ${C.text}; font-weight: 600; cursor: pointer;
    transition: all 0.2s; font-size: 0.85rem;
    &:hover { border-color: ${C.primary}; background: rgba(242,185,36,0.1); }
    &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const Toolbar = styled.div`
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.75rem;
`;

const EVAL_NAMES = ['N1', 'N2', 'N3', 'N4'];
const PAGE_SIZE = 10;

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

export default function GerirAvaliacoes() {
    const user = getToken();
    const isProf = user?.tipo === 2;

    const [disciplinas, setDisciplinas] = useState([]);
    const [disciplinaId, setDisciplinaId] = useState('');
    const [loading, setLoading] = useState(true);

    const [matriculas, setMatriculas] = useState([]);
    const [studentMap, setStudentMap] = useState({});

    const [avaliacaoMap, setAvaliacaoMap] = useState({});
    const [grades, setGrades] = useState({});
    const [editing, setEditing] = useState(null);

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            try { const res = await api.get('/api/disciplinas'); setDisciplinas(res.data); }
            catch { setError('Erro ao carregar disciplinas.'); }
            finally { setLoading(false); }
        })();
    }, []);

    const loadDisciplineData = useCallback(async (discId) => {
        if (!discId) { setMatriculas([]); setAvaliacaoMap({}); setGrades({}); return; }
        setError('');
        try {
            const matRes = await api.get(`/api/matriculas-disciplina/disciplina/${discId}`);
            setMatriculas(matRes.data);

            const alunoIds = matRes.data.map(m => m.aluno);
            if (alunoIds.length > 0) {
                try {
                    const nomesRes = await api.get(`/api/usuarios/nomes?ids=${alunoIds.join(',')}`);
                    const map = {};
                    nomesRes.data.forEach(p => { map[p.id] = p.nome; });
                    setStudentMap(map);
                } catch {}
            }

            const avaRes = await api.get(`/api/avaliacoes/disciplina/${discId}`);
            let avas = avaRes.data;

            const existing = avas.map(a => a.nomeDaNota);
            const missing = EVAL_NAMES.filter(n => !existing.includes(n));
            for (const nome of missing) {
                await api.post('/api/avaliacoes', { nomeDaNota: nome, disciplina: Number(discId) });
            }
            if (missing.length > 0) {
                const avaRes2 = await api.get(`/api/avaliacoes/disciplina/${discId}`);
                avas = avaRes2.data;
            }

            const aMap = {};
            avas.forEach(a => { aMap[a.nomeDaNota] = a.id; });
            setAvaliacaoMap(aMap);

            const notasRes = await api.get(`/api/notas/disciplina/${discId}`);
            const g = {};
            notasRes.data.forEach(n => { g[`${n.aluno}_${n.avaliacao}`] = n.nota; });
            setGrades(g);
            setPage(1);
            setSearch('');
        } catch {
            setError('Erro ao carregar dados da disciplina.');
        }
    }, []);

    useEffect(() => {
        if (disciplinaId) loadDisciplineData(disciplinaId);
    }, [disciplinaId, loadDisciplineData]);

    async function saveGrade(alunoId, evalName, value) {
        const avaId = avaliacaoMap[evalName];
        if (!avaId) return;
        const nota = value === '' || value === undefined || value === null ? null : parseFloat(value);
        const key = `${alunoId}_${avaId}`;
        setGrades(prev => ({ ...prev, [key]: nota }));
        setEditing(null);
        if (nota === null) return;
        try {
            await api.post('/api/notas', { aluno: alunoId, avaliacao: avaId, nota, disciplina: Number(disciplinaId) });
        } catch {
            setError('Erro ao salvar nota.');
            setGrades(prev => ({ ...prev, [key]: null }));
        }
    }

    function handleBlur(alunoId, evalName, value) { saveGrade(alunoId, evalName, value); }
    function handleKeyDown(e, alunoId, evalName, value) {
        if (e.key === 'Enter') e.target.blur();
        else if (e.key === 'Escape') setEditing(null);
    }
    function startEdit(alunoId, evalName) { if (isProf) setEditing({ alunoId, evalName }); }

    function gradeCell(alunoId, evalName) {
        const avaId = avaliacaoMap[evalName];
        const key = `${alunoId}_${avaId}`;
        const value = grades[key];
        if (editing?.alunoId === alunoId && editing?.evalName === evalName) {
            return (
                <GradeInput autoFocus type="number" min="0" max="10" step="0.1"
                    defaultValue={value ?? ''}
                    onBlur={e => handleBlur(alunoId, evalName, e.target.value)}
                    onKeyDown={e => handleKeyDown(e, alunoId, evalName, e.target.value)}
                />
            );
        }
        return (
            <GradeBadge empty={value === null || value === undefined}
                onDoubleClick={() => startEdit(alunoId, evalName)}
                style={isProf ? { cursor: 'pointer' } : {}}
                title={isProf ? 'Clique duplo para editar' : ''}>
                {value !== null && value !== undefined ? Number(value).toFixed(1) : '-'}
            </GradeBadge>
        );
    }

    function mediaForAluno(alunoId) {
        const vals = EVAL_NAMES.map(n => grades[`${alunoId}_${avaliacaoMap[n]}`]);
        return calcMedia(vals);
    }

    // Filter + paginate
    const filtered = matriculas.filter(m => {
        const nome = studentMap[m.aluno] || `Aluno ${m.aluno}`;
        return !search || nome.toLowerCase().includes(search.toLowerCase());
    });
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    if (loading) return <Container><Spinner>Carregando...</Spinner></Container>;

    // Student view
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
                                <tbody><tr>
                                    {EVAL_NAMES.map(n => <td key={n}>{gradeCell(user.sub, n)}</td>)}
                                    <td><Avg>{mediaForAluno(user.sub)}</Avg></td>
                                </tr></tbody>
                            </Table>
                        </TableWrap>
                    </Panel>
                )}
            </Container>
        );
    }

    // Professor view
    return (
        <Container>
            <Title>Gestão de Notas</Title>
            {error && <ErrorMsg>{error}</ErrorMsg>}

            <Panel>
                <SelectWrap>
                    <Label htmlFor="disc-select">Disciplina:</Label>
                    <Select id="disc-select" value={disciplinaId} onChange={e => setDisciplinaId(e.target.value)}>
                        <option value="">Selecione uma disciplina</option>
                        {disciplinas.map(d => (
                            <option key={d.id} value={d.id}>{d.sigla} — {d.nome}</option>
                        ))}
                    </Select>
                </SelectWrap>
            </Panel>

            {disciplinaId && (
                <Panel>
                    <Subtitle>Lançamento de Notas</Subtitle>
                    {matriculas.length === 0 ? (
                        <Msg>Nenhum aluno matriculado nesta disciplina.</Msg>
                    ) : (
                        <>
                            <Toolbar>
                                <SearchBar type="text" placeholder="Buscar aluno..."
                                    value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                                <span style={{ fontSize: '0.85rem', color: C.text }}>
                                    {filtered.length} aluno{filtered.length !== 1 ? 's' : ''}
                                    {filtered.length !== matriculas.length && ` (de ${matriculas.length})`}
                                </span>
                            </Toolbar>
                            <TableWrap>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th style={{ textAlign: 'left' }}>Aluno</th>
                                            {EVAL_NAMES.map(n => <th key={n}>{n}</th>)}
                                            <th>Média</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginated.map(m => {
                                            const nome = studentMap[m.aluno] || `Aluno ${m.aluno}`;
                                            return (
                                                <tr key={m.id || m.aluno}>
                                                    <td style={{ textAlign: 'left', fontWeight: 600 }}>{nome}</td>
                                                    {EVAL_NAMES.map(n => <td key={n}>{gradeCell(m.aluno, n)}</td>)}
                                                    <td><Avg>{mediaForAluno(m.aluno)}</Avg></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            </TableWrap>
                            {totalPages > 1 && (
                                <PaginationRow>
                                    <PageBtn disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>Anterior</PageBtn>
                                    <span>{safePage} / {totalPages}</span>
                                    <PageBtn disabled={safePage >= totalPages} onClick={() => setPage(safePage + 1)}>Próximo</PageBtn>
                                </PaginationRow>
                            )}
                        </>
                    )}
                </Panel>
            )}
        </Container>
    );
}
