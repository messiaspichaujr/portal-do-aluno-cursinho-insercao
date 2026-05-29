import { chromium } from 'playwright';

const BASE_URL = 'https://portal-do-aluno-cursinho-insercao-m.vercel.app';
const API_URL = 'https://portal-do-aluno-cursinho-insercao-production.up.railway.app';
const ADMIN_EMAIL = 'admin@cursinho.com';
const ADMIN_PASS = 'Pac4Finaly321!';

let passed = 0;
let failed = 0;

function log(test, status, detail = '') {
    const icon = status === 'PASS' ? '[PASS]' : status === 'FAIL' ? '[FAIL]' : '[INFO]';
    console.log(`${icon} ${test}${detail ? ' - ' + detail : ''}`);
    if (status === 'PASS') passed++;
    if (status === 'FAIL') failed++;
}

async function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ ignoreHTTPSErrors: true });
    const page = await context.newPage();

    // Collect console errors
    const consoleErrors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    try {
        // ===== TEST 1: Homepage loads =====
        log('Homepage', 'INFO', 'Carregando...');
        const homeRes = await page.goto(BASE_URL + '/home', { waitUntil: 'networkidle', timeout: 30000 });
        if (homeRes.status() === 200) {
            log('Homepage carrega', 'PASS', `status ${homeRes.status()}`);
        } else {
            log('Homepage carrega', 'FAIL', `status ${homeRes.status()}`);
        }

        // Check navbar exists
        const navbar = await page.$('nav');
        log('Navbar visivel', navbar ? 'PASS' : 'FAIL');

        // Check hero/banner
        const hero = await page.$('section');
        log('Banner/Hero visivel', hero ? 'PASS' : 'FAIL');

        // Check footer
        const footer = await page.$('footer');
        log('Footer visivel', footer ? 'PASS' : 'FAIL');

        // ===== TEST 2: Login page loads =====
        log('Login page', 'INFO', 'Carregando...');
        await page.goto(BASE_URL + '/portal/login', { waitUntil: 'networkidle', timeout: 15000 });
        const loginLogo = await page.$('img[alt="Cursinho Inserção"]');
        log('Login - Logo visivel', loginLogo ? 'PASS' : 'FAIL');

        const emailInput = await page.$('input[type="email"]');
        const passInput = await page.$('input[type="password"]');
        log('Login - Campos email/senha', emailInput && passInput ? 'PASS' : 'FAIL');

        const cadastroLink = await page.$('a[href="/cadastro"]');
        log('Login - Link "Cadastre-se"', cadastroLink ? 'PASS' : 'FAIL');

        // ===== TEST 3: Admin login =====
        log('Admin login', 'INFO', 'Tentando login...');
        await page.fill('input[type="email"]', ADMIN_EMAIL);
        await page.fill('input[type="password"]', ADMIN_PASS);
        await page.click('button[type="submit"]');
        await sleep(3000);

        const currentUrl = page.url();
        if (currentUrl.includes('/admin/')) {
            log('Admin login redirect', 'PASS', currentUrl);
        } else {
            log('Admin login redirect', 'FAIL', `redirected to ${currentUrl}`);
        }

        // ===== TEST 4: Admin sidebar =====
        const sidebar = await page.$('aside');
        log('Admin sidebar visivel', sidebar ? 'PASS' : 'FAIL');

        // ===== TEST 5: Section creation page =====
        log('Secoes page', 'INFO', 'Navegando...');
        await page.goto(BASE_URL + '/admin/secoes', { waitUntil: 'networkidle', timeout: 15000 });
        const secaoTitle = await page.$('h1');
        const titleText = secaoTitle ? await secaoTitle.textContent() : '';
        log('Secoes page carrega', titleText.includes('Se') ? 'PASS' : 'FAIL', titleText);

        // Check form fields
        const tituloInput = await page.$('input[name="titulo"]');
        const textoArea = await page.$('textarea[name="texto"]');
        const fileInput = await page.$('input[type="file"]');
        log('Secoes - Formulario completo', tituloInput && textoArea && fileInput ? 'PASS' : 'FAIL');

        // Check save button disabled (no image loaded)
        const saveBtn = await page.$('button');
        const allBtns = await page.$$('button');
        let guardarBtn = null;
        for (const btn of allBtns) {
            const text = await btn.textContent();
            if (text && text.includes('Guardar')) { guardarBtn = btn; break; }
        }
        if (guardarBtn) {
            const disabled = await guardarBtn.getAttribute('disabled');
            log('Secoes - Botao desabilitado sem imagem', disabled !== null ? 'PASS' : 'FAIL');
        } else {
            log('Secoes - Botao Guardar encontrado', 'FAIL', 'nao encontrado');
        }

        // ===== TEST 6: Public registration page =====
        log('Cadastro publico', 'INFO', 'Carregando...');
        await page.goto(BASE_URL + '/cadastro', { waitUntil: 'networkidle', timeout: 15000 });
        const regTitle = await page.$('h1');
        const regTitleText = regTitle ? await regTitle.textContent() : '';
        log('Cadastro publico carrega', regTitleText.includes('conta') || regTitleText.includes('Conta') ? 'PASS' : 'FAIL', regTitleText);

        const regName = await page.$('input[name="nome"]');
        const regEmail = await page.$('input[name="email"]');
        const regPass = await page.$('input[name="senha"]');
        const regType = await page.$('select[name="tipo"]');
        log('Cadastro - Campos completos', regName && regEmail && regPass && regType ? 'PASS' : 'FAIL');

        // ===== TEST 7: API health check =====
        log('API health', 'INFO', 'Testando endpoints...');
        const apiRes = await page.evaluate(async (url) => {
            try {
                const res = await fetch(url + '/api/secoes');
                return { status: res.status, ok: res.ok };
            } catch (e) {
                return { status: 0, error: e.message };
            }
        }, API_URL);
        log('API /api/secoes GET', apiRes.ok ? 'PASS' : 'FAIL', `status ${apiRes.status}`);

        // ===== TEST 8: 404 page =====
        log('404 page', 'INFO', 'Carregando...');
        const res404 = await page.goto(BASE_URL + '/pagina-que-nao-existe', { waitUntil: 'networkidle', timeout: 10000 }).catch(() => null);
        const body404 = await page.textContent('body').catch(() => '');
        log('404 page funciona', body404.includes('404') || body404.includes('encontrada') || body404.toLowerCase().includes('not found') ? 'PASS' : 'FAIL');

    } catch (err) {
        log('Erro geral', 'FAIL', err.message);
    } finally {
        await browser.close();
        console.log('\n========================================');
        console.log(`RESULTADO: ${passed} passaram, ${failed} falharam`);
        console.log('========================================');
        process.exit(failed > 0 ? 1 : 0);
    }
})();
