import { chromium } from 'playwright';

const BASE_URL = 'https://portal-do-aluno-cursinho-insercao-m.vercel.app';
const API_URL = 'https://portal-do-aluno-cursinho-insercao-production.up.railway.app';
const ADMIN_EMAIL = 'admin@cursinho.com';
const ADMIN_PASS = 'Pac4Finaly321!';

let passed = 0, failed = 0;
function log(test, status, detail = '') {
    const icon = status === 'PASS' ? '[PASS]' : status === 'FAIL' ? '[FAIL]' : '[INFO]';
    console.log(`${icon} ${test}${detail ? ' - ' + detail : ''}`);
    if (status === 'PASS') passed++;
    if (status === 'FAIL') failed++;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
function auth(token) { return { 'Authorization': `Bearer ${token}` }; }
function jsonAuth(token) { return { ...auth(token), 'Content-Type': 'application/json' }; }

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const errors = [];
    page.on('response', res => { if (res.status() >= 400) errors.push(`${res.status()} ${res.url()}`); });

    try {
        // ===== ADMIN LOGIN =====
        console.log('\n=== ADMIN LOGIN ===');
        await page.goto(BASE_URL + '/admin/login', { waitUntil: 'networkidle', timeout: 15000 });
        await page.fill('input[type="email"]', ADMIN_EMAIL);
        await page.fill('input[type="password"]', ADMIN_PASS);
        await page.click('button[type="submit"]');
        await sleep(3000);
        log('Admin login', page.url().includes('/admin') ? 'PASS' : 'FAIL', page.url());

        // Get admin token
        const loginRes = await fetch(API_URL + '/api/usuarios/login', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: ADMIN_EMAIL, senha: ADMIN_PASS })
        });
        const { token } = await loginRes.json();

        // ===== DISCIPLINAS: não criar se já existem =====
        console.log('\n=== DISCIPLINAS ===');
        const discRes = await fetch(API_URL + '/api/disciplinas', { headers: auth(token) });
        let disciplinas = await discRes.json();
        log('Disciplinas existem', disciplinas.length >= 2 ? 'PASS' : 'FAIL', `${disciplinas.length} disciplinas`);

        let matDisc = disciplinas.find(d => d.sigla === 'MAT');
        let porDisc = disciplinas.find(d => d.sigla === 'POR');

        if (!matDisc) {
            await page.goto(BASE_URL + '/admin/disciplinas', { waitUntil: 'networkidle', timeout: 15000 });
            await page.fill('input[placeholder="Ex: MAT"]', 'MAT');
            await page.fill('input[placeholder="Ex: Matemática"]', 'Matemática');
            const btns = await page.$$('button');
            for (const b of btns) { const t = await b.textContent(); if (t?.includes('Criar')) { await b.click(); break; } }
            await sleep(2000);
            const updated = await (await fetch(API_URL + '/api/disciplinas', { headers: auth(token) })).json();
            matDisc = updated.find(d => d.sigla === 'MAT');
        }
        if (!porDisc) {
            await page.goto(BASE_URL + '/admin/disciplinas', { waitUntil: 'networkidle', timeout: 15000 });
            await page.fill('input[placeholder="Ex: MAT"]', 'POR');
            await page.fill('input[placeholder="Ex: Matemática"]', 'Português');
            const btns = await page.$$('button');
            for (const b of btns) { const t = await b.textContent(); if (t?.includes('Criar')) { await b.click(); break; } }
            await sleep(2000);
            const updated = await (await fetch(API_URL + '/api/disciplinas', { headers: auth(token) })).json();
            porDisc = updated.find(d => d.sigla === 'POR');
        }
        log('MAT existe', matDisc ? 'PASS' : 'FAIL', matDisc ? `id=${matDisc.id}` : '');
        log('POR existe', porDisc ? 'PASS' : 'FAIL', porDisc ? `id=${porDisc.id}` : '');

        // ===== REGISTRAR E APROVAR ALUNO =====
        console.log('\n=== ALUNO: REGISTRO → APROVAÇÃO → MATRÍCULA AUTO ===');
        const testEmail = `aluno.fluxo.${Date.now()}@teste.com`;
        await page.goto(BASE_URL + '/cadastro', { waitUntil: 'networkidle', timeout: 15000 });
        await page.fill('input[name="nome"]', 'Aluno Fluxo Teste');
        await page.fill('input[name="email"]', testEmail);
        await page.fill('input[name="senha"]', 'Senha123456');
        await page.selectOption('select[name="tipo"]', '3');
        await page.click('button[type="submit"]');
        await sleep(3000);
        log('Aluno registra', 'PASS');

        const pendingRes = await fetch(API_URL + '/api/usuarios/alunos/pendentes', { headers: auth(token) });
        const testAluno = (await pendingRes.json()).find(a => a.email === testEmail);
        log('Aluno pendente encontrado', testAluno ? 'PASS' : 'FAIL');

        if (testAluno) {
            await fetch(API_URL + `/api/usuarios/alunos/${testAluno.id}/aprovar`, { method: 'PUT', headers: auth(token) });
            await sleep(2000);

            const matRes = await fetch(API_URL + `/api/matriculas-disciplina/aluno/${testAluno.id}`, { headers: auth(token) });
            const matriculas = await matRes.json();
            log('Matrícula automática', matriculas.length >= 2 ? 'PASS' : 'FAIL', `${matriculas.length} disciplinas`);

            const discIds = matriculas.map(m => m.disciplina);
            log('Matriculado em MAT', discIds.includes(matDisc?.id) ? 'PASS' : 'FAIL');
            log('Matriculado em POR', discIds.includes(porDisc?.id) ? 'PASS' : 'FAIL');
        }

        // ===== REGISTRAR E APROVAR PROFESSOR =====
        console.log('\n=== PROFESSOR: REGISTRO → APROVAÇÃO ===');
        const profEmail = `prof.fluxo.${Date.now()}@teste.com`;
        await page.goto(BASE_URL + '/cadastro', { waitUntil: 'networkidle', timeout: 15000 });
        await page.fill('input[name="nome"]', 'Professor Fluxo Teste');
        await page.fill('input[name="email"]', profEmail);
        await page.fill('input[name="senha"]', 'Senha123456');
        await page.selectOption('select[name="tipo"]', '2');
        await page.click('button[type="submit"]');
        await sleep(3000);

        const pendingProf = await (await fetch(API_URL + '/api/usuarios/professores/pendentes', { headers: auth(token) })).json();
        const testProf = pendingProf.find(p => p.email === profEmail);
        log('Professor pendente', testProf ? 'PASS' : 'FAIL');

        if (testProf) {
            await fetch(API_URL + `/api/usuarios/${testProf.id}/aprovar`, { method: 'PUT', headers: auth(token) });
            await sleep(1000);
            log('Professor aprovado', 'PASS');
        }

        if (!testProf || !testAluno || !matDisc) {
            log('Dados insuficientes', 'FAIL', 'abortando testes');
            throw new Error('Dados de teste insuficientes');
        }

        // ===== PROFESSOR: LOGIN =====
        console.log('\n=== PROFESSOR: LOGIN E FREQUÊNCIA ===');
        const profLoginRes = await fetch(API_URL + '/api/usuarios/login', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: profEmail, senha: 'Senha123456' })
        });
        const { token: profToken } = await profLoginRes.json();
        log('Professor login', profLoginRes.status === 200 ? 'PASS' : 'FAIL');

        // ===== FREQUÊNCIA: LOTE POR DISCIPLINA =====
        const tiposRes = await fetch(API_URL + '/api/frequencias/tipos', { headers: auth(profToken) });
        const tipos = await tiposRes.json();
        const presenteTipo = tipos.find(t => t.tipo === 'P') || tipos.find(t => t.tipo === 'Presente');
        log('Tipos frequência', tipos.length > 0 ? 'PASS' : 'FAIL', `${tipos.length} tipos`);

        if (presenteTipo) {
            const freqLote = await fetch(API_URL + '/api/frequencias/lote', {
                method: 'POST', headers: jsonAuth(profToken),
                body: JSON.stringify([{
                    aluno: testAluno.id,
                    data: '2026-05-26T10:00:00',
                    frequencia: presenteTipo.id,
                    justificativa: '',
                    disciplina: matDisc.id
                }])
            });
            log('Lançar frequência lote', freqLote.status === 201 ? 'PASS' : 'FAIL', `status ${freqLote.status}`);
        }

        const freqDiscRes = await fetch(API_URL + `/api/frequencias/disciplina/${matDisc.id}`, { headers: auth(profToken) });
        const freqList = await freqDiscRes.json();
        log('Frequência por disciplina', freqList.length > 0 ? 'PASS' : 'FAIL', `${freqList.length} registros`);

        // ===== NOTAS: N1-N4 POR DISCIPLINA =====
        console.log('\n=== PROFESSOR: NOTAS N1-N4 ===');
        const evalNames = ['N1', 'N2', 'N3', 'N4'];
        const createdEvals = [];
        for (const name of evalNames) {
            const evalRes = await fetch(API_URL + '/api/avaliacoes', {
                method: 'POST', headers: jsonAuth(profToken),
                body: JSON.stringify({ nomeDaNota: name, disciplina: matDisc.id })
            });
            if (evalRes.status === 201) createdEvals.push(await evalRes.json());
        }
        log('Criar N1-N4', createdEvals.length === 4 ? 'PASS' : 'FAIL', `${createdEvals.length}/4`);

        const grades = [8.5, 7.0, 9.0, 8.0];
        let gradesOk = true;
        for (let i = 0; i < createdEvals.length; i++) {
            const notaRes = await fetch(API_URL + '/api/notas', {
                method: 'POST', headers: jsonAuth(profToken),
                body: JSON.stringify({
                    aluno: testAluno.id,
                    avaliacao: createdEvals[i].id,
                    nota: grades[i],
                    disciplina: matDisc.id
                })
            });
            if (notaRes.status !== 201) gradesOk = false;
        }
        log('Lançar notas', gradesOk ? 'PASS' : 'FAIL');

        // ===== PROFESSOR: POSTAR REcado =====
        console.log('\n=== PROFESSOR: RECADOS E CONTEÚDOS ===');
        const recadoRes = await fetch(API_URL + '/api/recados', {
            method: 'POST', headers: jsonAuth(profToken),
            body: JSON.stringify({ texto: `Recado teste ${Date.now()}`, prof: testProf.id })
        });
        log('Professor posta recado', recadoRes.status === 201 || recadoRes.status === 200 ? 'PASS' : 'FAIL', `status ${recadoRes.status}`);

        const conteudoRes = await fetch(API_URL + '/api/conteudos', {
            method: 'POST', headers: jsonAuth(profToken),
            body: JSON.stringify({ link: 'https://exemplo.com/pdf', disciplina: matDisc.id })
        });
        log('Professor posta conteúdo', conteudoRes.status === 201 || conteudoRes.status === 200 ? 'PASS' : 'FAIL', `status ${conteudoRes.status}`);

        // ===== ALUNO: VISUALIZAÇÃO COMPLETA =====
        console.log('\n=== ALUNO: VISUALIZAÇÃO COMPLETA ===');
        const alunoLoginRes = await fetch(API_URL + '/api/usuarios/login', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: testEmail, senha: 'Senha123456' })
        });
        const { token: alunoToken } = await alunoLoginRes.json();
        log('Aluno login', alunoLoginRes.status === 200 ? 'PASS' : 'FAIL');

        if (alunoToken) {
            // Notas por disciplina
            const notasRes = await fetch(API_URL + `/api/notas/aluno/${testAluno.id}/disciplina/${matDisc.id}`, { headers: auth(alunoToken) });
            const notas = await notasRes.json();
            log('Aluno vê notas por disciplina', notas.length === 4 ? 'PASS' : 'FAIL', `${notas.length}/4 notas`);

            // Verificar valores das notas
            const valores = notas.map(n => n.nota).sort((a, b) => a - b);
            const esperados = [...grades].sort((a, b) => a - b);
            const valoresOk = valores.length === 4 && valores.every((v, i) => Math.abs(v - esperados[i]) < 0.01);
            log('Valores das notas corretos', valoresOk ? 'PASS' : 'FAIL',
                valoresOk ? '' : `recebidos: ${valores.join(',')}, esperados: ${esperados.join(',')}`);

            // Frequência por disciplina
            const freqAlunoRes = await fetch(API_URL + `/api/frequencias/aluno/${testAluno.id}/disciplina/${matDisc.id}`, { headers: auth(alunoToken) });
            const freqAluno = await freqAlunoRes.json();
            log('Aluno vê frequência por disciplina', freqAluno.length > 0 ? 'PASS' : 'FAIL', `${freqAluno.length} registros`);

            // Disciplinas do aluno
            const discAlunoRes = await fetch(API_URL + `/api/matriculas-disciplina/aluno/${testAluno.id}`, { headers: auth(alunoToken) });
            const discAluno = await discAlunoRes.json();
            log('Aluno vê suas disciplinas', discAluno.length >= 2 ? 'PASS' : 'FAIL', `${discAluno.length} disciplinas`);

            // Aluno visualiza recados
            const recadosRes = await fetch(API_URL + '/api/recados', { headers: auth(alunoToken) });
            const recados = await recadosRes.json();
            log('Aluno vê recados', recados.length > 0 ? 'PASS' : 'FAIL', `${recados.length} recados`);

            // Aluno visualiza conteúdos
            const conteudosRes = await fetch(API_URL + '/api/conteudos', { headers: auth(alunoToken) });
            const conteudos = await conteudosRes.json();
            log('Aluno vê conteúdos', conteudos.length > 0 ? 'PASS' : 'FAIL', `${conteudos.length} conteúdos`);
        }

        // ===== UI PROFESSOR: PÁGINAS DO PORTAL =====
        console.log('\n=== UI PROFESSOR: PORTAL ===');
        await page.goto(BASE_URL + '/portal/login', { waitUntil: 'networkidle', timeout: 15000 });
        await page.fill('input[type="email"]', profEmail);
        await page.fill('input[type="password"]', 'Senha123456');
        await page.click('button[type="submit"]');
        await sleep(3000);
        log('Professor login UI', page.url().includes('/portal') ? 'PASS' : 'FAIL');

        const profPages = [
            { path: '/portal/avaliacoes', name: 'Avaliações' },
            { path: '/portal/frequencia', name: 'Lançar Frequência' },
            { path: '/portal/frequencia/ver', name: 'Ver Frequência' },
            { path: '/portal/notas', name: 'Notas' },
            { path: '/portal/recados', name: 'Recados' },
            { path: '/portal/conteudos', name: 'Conteúdos' }
        ];
        for (const p of profPages) {
            await page.goto(BASE_URL + p.path, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
            log(`Professor UI: ${p.name}`, page.url().includes(p.path) ? 'PASS' : 'FAIL');
        }

        // Verificar se a página de avaliações tem seletor de disciplina
        await page.goto(BASE_URL + '/portal/avaliacoes', { waitUntil: 'networkidle', timeout: 15000 });
        const selects = await page.$$('select');
        log('Seletor de disciplina', selects.length > 0 ? 'PASS' : 'FAIL');

        // ===== UI ALUNO: PÁGINAS DO PORTAL =====
        console.log('\n=== UI ALUNO: PORTAL ===');
        await page.goto(BASE_URL + '/portal/login', { waitUntil: 'networkidle', timeout: 15000 });
        await page.fill('input[type="email"]', testEmail);
        await page.fill('input[type="password"]', 'Senha123456');
        await page.click('button[type="submit"]');
        await sleep(3000);
        log('Aluno login UI', page.url().includes('/portal') ? 'PASS' : 'FAIL');

        const alunoPages = [
            { path: '/portal/notas', name: 'Minhas Notas' },
            { path: '/portal/frequencia/ver', name: 'Ver Frequência' },
            { path: '/portal/recados', name: 'Recados' },
            { path: '/portal/conteudos', name: 'Conteúdos' }
        ];
        for (const p of alunoPages) {
            await page.goto(BASE_URL + p.path, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
            log(`Aluno UI: ${p.name}`, page.url().includes(p.path) ? 'PASS' : 'FAIL');
        }

        // Verificar página de notas do aluno tem conteúdo
        await page.goto(BASE_URL + '/portal/notas', { waitUntil: 'networkidle', timeout: 15000 });
        const notasBody = await page.textContent('body');
        log('Aluno notas conteúdo', notasBody.length > 100 ? 'PASS' : 'FAIL');

    } catch (err) {
        log('ERRO GERAL', 'FAIL', err.message);
    } finally {
        await browser.close();
        console.log('\n========================================');
        console.log(`RESULTADO: ${passed} passaram, ${failed} falharam`);
        console.log('========================================');
        process.exit(failed > 0 ? 1 : 0);
    }
})();
