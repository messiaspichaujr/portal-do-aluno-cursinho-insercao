import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://portal-do-aluno-cursinho-insercao-m.vercel.app';
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

// Create a small test PNG image
function createTestImage() {
    const tmpDir = '/tmp';
    const imgPath = path.join(tmpDir, 'test-section.png');
    // Minimal valid PNG: 1x1 red pixel
    const buf = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
        0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
        0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00,
        0x00, 0x00, 0x02, 0x00, 0x01, 0xE2, 0x21, 0xBC, 0x33, 0x00, 0x00, 0x00,
        0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);
    fs.writeFileSync(imgPath, buf);
    return imgPath;
}

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ ignoreHTTPSErrors: true });
    const page = await context.newPage();

    const consoleErrors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('response', res => {
        if (res.status() >= 400) {
            consoleErrors.push(`HTTP ${res.status()} on ${res.url()}`);
        }
    });

    try {
        // ===== LOGIN AS ADMIN =====
        log('Login admin', 'INFO', 'Fazendo login...');
        await page.goto(BASE_URL + '/portal/login', { waitUntil: 'networkidle', timeout: 20000 });
        await page.fill('input[type="email"]', ADMIN_EMAIL);
        await page.fill('input[type="password"]', ADMIN_PASS);
        await page.click('button[type="submit"]');
        await sleep(3000);
        log('Admin logado', page.url().includes('/admin') ? 'PASS' : 'FAIL', page.url());

        // ===== TEST: CREATE SECTION WITH IMAGE =====
        log('Criar secao', 'INFO', 'Navegando para secoes...');
        await page.goto(BASE_URL + '/admin/secoes', { waitUntil: 'networkidle', timeout: 15000 });

        // Fill form
        await page.fill('input[name="titulo"]', 'Secao Teste Automatizado');
        await page.fill('textarea[name="texto"]', 'Esta e uma secao de teste criada automaticamente pelo Playwright para validar o sistema de upload e criacao de secoes.');

        // Upload image
        const imgPath = createTestImage();
        const fileInput = await page.$('input[type="file"]');
        await fileInput.setInputFiles(imgPath);
        await sleep(1000);

        // Check preview appears
        const preview = await page.$('img[alt="Pre-visualizacao"]');
        log('Secao - Preview da imagem', preview ? 'PASS' : 'FAIL');

        // Check button is enabled
        const allBtns = await page.$$('button');
        let guardarBtn = null;
        for (const btn of allBtns) {
            const text = await btn.textContent();
            if (text && text.includes('Guardar')) { guardarBtn = btn; break; }
        }
        if (guardarBtn) {
            const disabled = await guardarBtn.getAttribute('disabled');
            log('Secao - Botao habilitado com imagem', disabled === null ? 'PASS' : 'FAIL');
        }

        // Clear errors before submit
        consoleErrors.length = 0;

        // Click save
        log('Secao - Salvando...', 'INFO');
        await guardarBtn.click();
        await sleep(5000);

        // Check result
        const pageErrors = consoleErrors.filter(e => e.includes('400') || e.includes('502') || e.includes('500'));
        if (pageErrors.length > 0) {
            log('Secao criada', 'FAIL', pageErrors.join('; '));
        } else {
            // Check if section appears in the list
            const cards = await page.$$('h3');
            let found = false;
            for (const card of cards) {
                const text = await card.textContent();
                if (text.includes('Teste Automatizado')) { found = true; break; }
            }
            log('Secao criada com sucesso', found ? 'PASS' : 'FAIL', found ? 'encontrada na lista' : 'nao encontrada na lista');
        }

        // ===== TEST: BANNER PAGE =====
        log('Banners', 'INFO', 'Navegando...');
        consoleErrors.length = 0;
        await page.goto(BASE_URL + '/admin/banners', { waitUntil: 'networkidle', timeout: 15000 });

        const bannerTitle = await page.textContent('h1').catch(() => '');
        log('Banner page carrega', bannerTitle.includes('Banner') ? 'PASS' : 'FAIL', bannerTitle);

        // Check existing banners render images
        const bannerImages = await page.$$('.Card img, img[alt*="Banner"]');
        log('Banner - Imagens existentes', bannerImages.length > 0 ? 'PASS' : 'FAIL', `${bannerImages.length} imagens encontradas`);

        if (bannerImages.length > 0) {
            const firstImg = bannerImages[0];
            const src = await firstImg.getAttribute('src');
            log('Banner - URL da imagem', src ? 'PASS' : 'FAIL', src ? src.substring(0, 80) + '...' : 'sem src');

            // Try to load the image directly
            if (src) {
                const imgRes = await page.evaluate(async (url) => {
                    try {
                        const res = await fetch(url, { method: 'HEAD' });
                        return { status: res.status, type: res.headers.get('content-type') };
                    } catch (e) {
                        return { status: 0, error: e.message };
                    }
                }, src);
                log('Banner - Imagem carregavel', imgRes.status === 200 ? 'PASS' : 'FAIL',
                    `status ${imgRes.status}, type ${imgRes.type || imgRes.error}`);
            }
        }

        // ===== TEST: PUBLIC REGISTRATION =====
        log('Cadastro publico', 'INFO', 'Testando registro...');
        consoleErrors.length = 0;
        await page.goto(BASE_URL + '/cadastro', { waitUntil: 'networkidle', timeout: 15000 });

        const testEmail = `teste.playwright.${Date.now()}@teste.com`;
        await page.fill('input[name="nome"]', 'Aluno Teste Playwright');
        await page.fill('input[name="email"]', testEmail);
        await page.fill('input[name="senha"]', 'Teste123!');
        await page.selectOption('select[name="tipo"]', '3');
        await page.click('button[type="submit"]');
        await sleep(3000);

        const regErrors = consoleErrors.filter(e => e.includes('400') || e.includes('500'));
        if (regErrors.length > 0) {
            log('Cadastro publico - registro', 'FAIL', regErrors.join('; '));
        } else {
            // Check for success message on page
            const bodyText = await page.textContent('body');
            const success = bodyText.includes('sucesso') || bodyText.includes('aprovacao') || page.url().includes('login');
            log('Cadastro publico - registro', success ? 'PASS' : 'FAIL',
                success ? 'cadastro realizado' : `url: ${page.url()}`);
        }

        // ===== TEST: LOGIN WITH INACTIVE USER =====
        log('Login usuario pendente', 'INFO', 'Tentando login com usuario pendente...');
        consoleErrors.length = 0;
        await page.goto(BASE_URL + '/portal/login', { waitUntil: 'networkidle', timeout: 15000 });
        await page.fill('input[type="email"]', testEmail);
        await page.fill('input[type="password"]', 'Teste123!');
        await page.click('button[type="submit"]');
        await sleep(3000);

        const loginError = await page.textContent('body');
        const blocked = loginError.includes('inativo') || loginError.includes('aprova') || loginError.includes('incorretos') || page.url().includes('login');
        log('Login usuario pendente bloqueado', blocked ? 'PASS' : 'FAIL',
            blocked ? 'acesso negado corretamente' : `url: ${page.url()}`);

        // ===== TEST: ADMIN PAGES LOAD =====
        const adminPages = [
            { path: '/admin/secoes', name: 'Secoes' },
            { path: '/admin/banners', name: 'Banners' },
            { path: '/admin/redes', name: 'Redes Sociais' },
            { path: '/admin/criar-conta', name: 'Criar Conta' },
            { path: '/admin/educadores/candidaturas', name: 'Candidaturas' },
            { path: '/admin/alunos/matriculas', name: 'Matriculas' },
        ];

        // Need to be logged in as admin - re-login
        await page.goto(BASE_URL + '/portal/login', { waitUntil: 'networkidle', timeout: 15000 });
        await page.fill('input[type="email"]', ADMIN_EMAIL);
        await page.fill('input[type="password"]', ADMIN_PASS);
        await page.click('button[type="submit"]');
        await sleep(3000);

        for (const ap of adminPages) {
            const res = await page.goto(BASE_URL + ap.path, { waitUntil: 'networkidle', timeout: 10000 }).catch(() => null);
            const url = page.url();
            const loaded = url.includes(ap.path);
            log(`Admin page: ${ap.name}`, loaded ? 'PASS' : 'FAIL', loaded ? '' : `redirected to ${url}`);
        }

    } catch (err) {
        log('Erro geral', 'FAIL', err.message);
    } finally {
        // Cleanup test image
        try { fs.unlinkSync('/tmp/test-section.png'); } catch {}

        await browser.close();
        console.log('\n========================================');
        console.log(`RESULTADO: ${passed} passaram, ${failed} falharam`);
        console.log('========================================');
        process.exit(failed > 0 ? 1 : 0);
    }
})();
