import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Botao from '../../components/reused/Botao';

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
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const Row = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;

    @media (max-width: 600px) {
        flex-direction: column;
        align-items: stretch;
    }
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

const Input = styled.input`
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

    &:disabled {
        background-color: #f5f0e6;
        color: #999;
        cursor: not-allowed;
    }
`;

const FieldGroup = styled.div`
    flex: 1;
    min-width: 180px;
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

const ToggleWrapper = styled.label`
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.85rem;
    color: ${colors.text};
`;

const ToggleTrack = styled.span`
    position: relative;
    width: 44px;
    height: 24px;
    background: ${props => (props.$active ? colors.primary : colors.border)};
    border-radius: 12px;
    transition: background 0.25s;

    &::after {
        content: '';
        position: absolute;
        top: 3px;
        left: ${props => (props.$active ? '23px' : '3px')};
        width: 18px;
        height: 18px;
        background: #FFF;
        border-radius: 50%;
        transition: left 0.25s;
        box-shadow: 0 1px 3px rgba(0,0,0,0.15);
    }
`;

const HiddenCheckbox = styled.input`
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
`;

const JustificativaInput = styled(Input)`
    font-size: 0.85rem;
    padding: 0.45rem 0.7rem;
`;

const StatusBadge = styled.span`
    display: inline-block;
    padding: 0.2rem 0.6rem;
    border-radius: 0.4rem;
    font-size: 0.78rem;
    font-weight: 600;
    color: #FFF;
    background: ${props => (props.$present ? colors.primary : colors.error)};
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

const SuccessBanner = styled.div`
    background: rgba(242,185,36,0.15);
    border: 1px solid ${colors.primary};
    color: ${colors.dark};
    padding: 0.75rem 1.25rem;
    border-radius: 0.75rem;
    font-weight: 600;
    font-size: 0.9rem;
`;

async function loadNomes(alunoIds) {
    if (alunoIds.length === 0) return {};
    try {
        const res = await api.get(`/api/usuarios/nomes?ids=${alunoIds.join(',')}`);
        const names = {};
        res.data.forEach(p => { names[p.id] = p.nome; });
        return names;
    } catch { return {}; }
}

export default function LancarFrequencia() {
    const [disciplinas, setDisciplinas] = useState([]);
    const [disciplinaId, setDisciplinaId] = useState('');
    const [alunosMatriculados, setAlunosMatriculados] = useState([]);
    const [tiposFrequencia, setTiposFrequencia] = useState([]);
    const [data, setData] = useState(new Date().toISOString().split('T')[0]);
    const [presencas, setPresencas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        setLoading(true);
        Promise.all([
            api.get('/api/disciplinas'),
            api.get('/api/frequencias/tipos'),
        ])
            .then(([resDisc, resTipos]) => {
                setDisciplinas(resDisc.data);
                setTiposFrequencia(resTipos.data);
            })
            .catch((err) => console.error('Erro ao carregar dados:', err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!disciplinaId) {
            setAlunosMatriculados([]);
            setPresencas([]);
            return;
        }
        (async () => {
            try {
                const res = await api.get(`/api/matriculas-disciplina/disciplina/${disciplinaId}`);
                const matriculas = res.data;
                const alunoIds = matriculas.map(m => m.aluno);
                const names = await loadNomes(alunoIds);
                const enriched = matriculas.map((m) => ({
                    alunoId: m.aluno,
                    nome: names[m.aluno] || `Aluno #${m.aluno}`,
                    matriculaId: m.id,
                }));
                enriched.sort((a, b) => a.nome.localeCompare(b.nome));
                setAlunosMatriculados(enriched);
                setPresencas(
                    enriched.map((a) => ({
                        alunoId: a.alunoId,
                        nome: a.nome,
                        presente: true,
                        justificativa: '',
                    }))
                );
            } catch (err) {
                console.error('Erro ao buscar matriculas:', err);
            }
        })();
    }, [disciplinaId]);

    const handleToggle = (index) => {
        const novas = [...presencas];
        novas[index].presente = !novas[index].presente;
        if (novas[index].presente) {
            novas[index].justificativa = '';
        }
        setPresencas(novas);
    };

    const handleJustificativa = (index, value) => {
        const novas = [...presencas];
        novas[index].justificativa = value;
        setPresencas(novas);
    };

    async function handleSave() {
        if (!disciplinaId) {
            alert('Selecione uma disciplina.');
            return;
        }
        if (!data) {
            alert('Selecione uma data.');
            return;
        }

        const tipoPresente = tiposFrequencia.find((t) => t.tipo === 'Presente' || t.tipo === 'P');
        const tipoFalta = tiposFrequencia.find((t) => t.tipo === 'Falta' || t.tipo === 'F');

        if (!tipoPresente || !tipoFalta) {
            alert('Tipos de frequencia nao encontrados. Verifique o cadastro de tipos.');
            return;
        }

        const lote = presencas.map((p) => ({
            aluno: p.alunoId,
            data: new Date(data + 'T12:00:00').toISOString(),
            frequencia: p.presente ? tipoPresente.id : tipoFalta.id,
            justificativa: p.presente ? '' : p.justificativa || '',
            disciplina: parseInt(disciplinaId),
        }));

        setSaving(true);
        setSuccess('');
        try {
            await api.post('/api/frequencias/lote', lote);
            setSuccess('Frequencia lancada com sucesso!');
            setPresencas(
                alunosMatriculados.map((a) => ({
                    alunoId: a.alunoId,
                    nome: a.nome,
                    presente: true,
                    justificativa: '',
                }))
            );
        } catch (err) {
            alert(err.response?.data?.message || 'Erro ao lancar frequencia.');
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <Page>
                <LoadingOverlay>Carregando...</LoadingOverlay>
            </Page>
        );
    }

    return (
        <Page>
            <Title>Lancar Frequencia</Title>

            {success && <SuccessBanner>{success}</SuccessBanner>}

            <Card>
                <CardTitle>Configuracao</CardTitle>
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
                        <Label>Data</Label>
                        <Input
                            type="date"
                            value={data}
                            onChange={(e) => setData(e.target.value)}
                        />
                    </FieldGroup>
                </Row>
            </Card>

            {disciplinaId && alunosMatriculados.length > 0 && (
                <Card>
                    <CardTitle>
                        Presencas ({alunosMatriculados.length} aluno{alunosMatriculados.length !== 1 ? 's' : ''})
                    </CardTitle>
                    <TableWrapper>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Aluno</th>
                                    <th>Presenca</th>
                                    <th>Justificativa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {presencas.map((p, index) => (
                                    <tr key={p.alunoId}>
                                        <td style={{ fontWeight: 500 }}>{p.nome}</td>
                                        <td>
                                            <ToggleWrapper>
                                                <HiddenCheckbox
                                                    type="checkbox"
                                                    checked={p.presente}
                                                    onChange={() => handleToggle(index)}
                                                />
                                                <ToggleTrack $active={p.presente} />
                                                <StatusBadge $present={p.presente}>
                                                    {p.presente ? 'Presente' : 'Falta'}
                                                </StatusBadge>
                                            </ToggleWrapper>
                                        </td>
                                        <td>
                                            <JustificativaInput
                                                type="text"
                                                placeholder="Justificativa (opcional)"
                                                value={p.justificativa}
                                                onChange={(e) => handleJustificativa(index, e.target.value)}
                                                disabled={p.presente}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </TableWrapper>
                    <Botao
                        text={saving ? 'Salvando...' : 'Salvar Frequencia'}
                        onClick={handleSave}
                        disabled={saving}
                    />
                </Card>
            )}

            {disciplinaId && alunosMatriculados.length === 0 && (
                <Card>
                    <EmptyState>
                        Nenhum aluno matriculado nesta disciplina.
                    </EmptyState>
                </Card>
            )}
        </Page>
    );
}
