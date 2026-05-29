import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

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

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const errors = [];
    page.on('response', res => { if (res.status() >= 400) errors.push(`${res.status()} ${res.url()}`); });

    try {
        // ===== 1. API CHECKS =====
        console.log('\n=== API CHECKS ===');

        // Secoes
        const secRes = await fetch(API_URL + '/api/secoes');
        const secoes = await secRes.json();
        log('API /api/secoes', secRes.status === 200 ? 'PASS' : 'FAIL', `${secoes.length} secoes`);

        // File serving via /api/files
        if (secoes.length > 0 && secoes[0].imagem) {
            const origPath = secoes[0].imagem; // /uploads/imagens/xxx.png
            const apiPath = origPath.replace('/uploads/', '/api/files/');
            const fileRes = await fetch(API_URL + apiPath);
            log('API /api/files serve imagem', fileRes.status === 200 ? 'PASS' : 'FAIL',
                `status ${fileRes.status}, type ${fileRes.headers.get('content-type')}`);
        } else {
            log('API /api/files', 'INFO', 'sem secoes com imagem para testar');
        }

        // Redes
        const redesRes = await fetch(API_URL + '/api/redes');
        const redes = await redesRes.json();
        log('API /api/redes', redesRes.status === 200 ? 'PASS' : 'FAIL', `${redes.length} redes`);

        // ===== 2. HOMEPAGE =====
        console.log('\n=== HOMEPAGE ===');
        await page.goto(BASE_URL + '/home', { waitUntil: 'networkidle', timeout: 30000 });
        log('Homepage carrega', 'PASS');
        log('Navbar', await page.$('nav') ? 'PASS' : 'FAIL');
        log('Hero/Banner', await page.$('section') ? 'PASS' : 'FAIL');
        log('Footer', await page.$('footer') ? 'PASS' : 'FAIL');

        // Check sections render
        const sectionTitles = await page.$$('h2');
        log('Secoes na homepage', sectionTitles.length > 0 ? 'PASS' : 'FAIL', `${sectionTitles.length} titulos`);

        // Check section images load
        const sectionImages = await page.$$('img');
        let imgSrcs = [];
        for (const img of sectionImages) {
            const src = await img.getAttribute('src');
            if (src && src.includes('/api/files/')) imgSrcs.push(src);
        }
        log('Secao imagens usam /api/files', imgSrcs.length > 0 ? 'PASS' : 'FAIL',
            `${imgSrcs.length} imagens via API`);

        // Test that images actually load (via Node.js fetch, not browser)
        if (imgSrcs.length > 0) {
            let imgOk = true;
            for (const src of imgSrcs.slice(0, 3)) {
                try {
                    const r = await fetch(src);
                    if (r.status !== 200) imgOk = false;
                } catch { imgOk = false; }
            }
            log('Imagens carregam corretamente', imgOk ? 'PASS' : 'FAIL');
        }

        // Check redes no footer
        const footerText = await page.$eval('footer', el => el.textContent);
        const hasRedes = redes.length > 0 ? footerText.includes(redes[0].texto) : true;
        log('Redes sociais no footer', redes.length === 0 || hasRedes ? 'PASS' : 'FAIL',
            redes.length > 0 ? `"${redes[0].texto}" ${hasRedes ? 'encontrada' : 'nao encontrada'}` : 'sem redes cadastradas');

        // ===== 3. LOGIN PAGE =====
        console.log('\n=== LOGIN PAGE ===');
        await page.goto(BASE_URL + '/portal/login', { waitUntil: 'networkidle', timeout: 15000 });
        log('Logo visivel', await page.$('img[alt="Cursinho Inserção"]') ? 'PASS' : 'FAIL');
        log('Link Cadastre-se', await page.$('a[href="/cadastro"]') ? 'PASS' : 'FAIL');

        // ===== 4. ADMIN LOGIN =====
        console.log('\n=== ADMIN LOGIN ===');
        await page.fill('input[type="email"]', ADMIN_EMAIL);
        await page.fill('input[type="password"]', ADMIN_PASS);
        await page.click('button[type="submit"]');
        await sleep(3000);
        log('Login redirect admin', page.url().includes('/admin') ? 'PASS' : 'FAIL', page.url());
        log('Sidebar visivel', await page.$('aside') ? 'PASS' : 'FAIL');

        // ===== 5. SECOES PAGE =====
        console.log('\n=== SECOES PAGE ===');
        await page.goto(BASE_URL + '/admin/secoes', { waitUntil: 'networkidle', timeout: 15000 });
        const formFields = await page.$$('input, textarea');
        log('Formulario completo', formFields.length >= 3 ? 'PASS' : 'FAIL', `${formFields.length} campos`);

        // Create section with image
        const buf = Buffer.from([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A,0x00,0x00,0x00,0x0D,0x49,0x48,0x44,0x52,0x00,0x00,0x00,0x01,0x00,0x00,0x00,0x01,0x08,0x02,0x00,0x00,0x00,0x90,0x77,0x53,0xDE,0x00,0x00,0x00,0x0C,0x49,0x44,0x41,0x54,0x08,0xD7,0x63,0xF8,0xCF,0xC0,0x00,0x00,0x00,0x02,0x00,0x01,0xE2,0x21,0xBC,0x33,0x00,0x00,0x00,0x00,0x49,0x45,0x4E,0x44,0xAE,0x42,0x60,0x82]);
        const imgPath = '/tmp/test-section.png';
        fs.writeFileSync(imgPath, buf);

        await page.fill('input[name="titulo"]', 'Secao Teste Final');
        await page.fill('textarea[name="texto"]', 'Texto de teste automatizado para validar criacao de secao com upload de imagem.');
        const fileInput = await page.$('input[type="file"]');
        await fileInput.setInputFiles(imgPath);
        await sleep(1000);

        // Check preview
        const preview = await page.$('img');
        const previewSrc = preview ? await preview.getAttribute('src') : null;
        log('Preview imagem (blob)', previewSrc && previewSrc.startsWith('blob:') ? 'PASS' : 'FAIL');

        // Save
        errors.length = 0;
        const btns = await page.$$('button');
        let saveBtn = null;
        for (const b of btns) { const t = await b.textContent(); if (t && t.includes('Guardar')) { saveBtn = b; break; } }
        if (saveBtn) await saveBtn.click();
        await sleep(5000);

        const saveErrors = errors.filter(e => e.includes('/api/secoes') || e.includes('/api/uploads'));
        log('Criar secao com imagem', saveErrors.length === 0 ? 'PASS' : 'FAIL',
            saveErrors.length > 0 ? saveErrors[0] : 'sem erros');

        // ===== 6. BANNER PAGE =====
        console.log('\n=== BANNER PAGE ===');
        await page.goto(BASE_URL + '/admin/banners', { waitUntil: 'networkidle', timeout: 15000 });
        const bannerTitle = await page.textContent('h1').catch(() => '');
        log('Banner page', bannerTitle.includes('Banner') ? 'PASS' : 'FAIL');

        // ===== 7. PUBLIC REGISTRATION =====
        console.log('\n=== REGISTRO PUBLICO ===');
        await page.goto(BASE_URL + '/cadastro', { waitUntil: 'networkidle', timeout: 15000 });
        const testEmail = `teste.final.${Date.now()}@teste.com`;
        await page.fill('input[name="nome"]', 'Aluno Teste Final');
        await page.fill('input[name="email"]', testEmail);
        await page.fill('input[name="senha"]', 'Senha123456');
        await page.selectOption('select[name="tipo"]', '3');
        errors.length = 0;
        await page.click('button[type="submit"]');
        await sleep(3000);

        const regErrors = errors.filter(e => e.includes('/api/usuarios'));
        if (regErrors.length > 0) {
            log('Cadastro publico', 'FAIL', regErrors.join('; '));
        } else {
            const body = await page.textContent('body');
            const ok = body.includes('sucesso') || body.includes('aprova') || page.url().includes('login');
            log('Cadastro publico', ok ? 'PASS' : 'FAIL', ok ? 'registro OK' : `url: ${page.url()}`);
        }

        // ===== 8. LOGIN WITH PENDING USER =====
        console.log('\n=== LOGIN USUARIO PENDENTE ===');
        await page.goto(BASE_URL + '/portal/login', { waitUntil: 'networkidle', timeout: 15000 });
        await page.fill('input[type="email"]', testEmail);
        await page.fill('input[type="password"]', 'Senha123456');
        await page.click('button[type="submit"]');
        await sleep(2000);
        const loginBody = await page.textContent('body');
        const blocked = loginBody.includes('inativo') || loginBody.includes('aprova') || page.url().includes('login');
        log('Usuario pendente bloqueado', blocked ? 'PASS' : 'FAIL');

        // ===== 9. ADMIN PAGES =====
        console.log('\n=== ADMIN PAGES ===');
        await page.goto(BASE_URL + '/portal/login', { waitUntil: 'networkidle', timeout: 15000 });
        await page.fill('input[type="email"]', ADMIN_EMAIL);
        await page.fill('input[type="password"]', ADMIN_PASS);
        await page.click('button[type="submit"]');
        await sleep(3000);

        const pages = ['/admin/secoes', '/admin/banners', '/admin/redes', '/admin/criar-conta',
                       '/admin/educadores/candidaturas', '/admin/alunos/matriculas'];
        for (const p of pages) {
            await page.goto(BASE_URL + p, { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});
            log(`Admin: ${p.split('/').pop()}`, page.url().includes(p) ? 'PASS' : 'FAIL');
        }

        // ===== 10. ADD REDE SOCIAL =====
        console.log('\n=== REDE SOCIAL ===');
        await page.goto(BASE_URL + '/admin/redes', { waitUntil: 'networkidle', timeout: 15000 });
        await page.fill('input[name="texto"]', 'Instagram');
        const linkInputs = await page.$$('input[name="link"]');
        if (linkInputs.length > 0) {
            await linkInputs[0].fill('https://instagram.com/cursinhoinsercao');
        }
        errors.length = 0;
        const createBtns = await page.$$('button');
        let createBtn = null;
        for (const b of createBtns) { const t = await b.textContent(); if (t && t.includes('Criar')) { createBtn = b; break; } }
        if (createBtn) await createBtn.click();
        await sleep(3000);

        const redeErrors = errors.filter(e => e.includes('/api/redes') || e.includes('/api/uploads'));
        log('Criar rede social', redeErrors.length === 0 ? 'PASS' : 'FAIL',
            redeErrors.length > 0 ? redeErrors.join('; ') : 'sem erros');

        // Verify rede in footer
        await page.goto(BASE_URL + '/home', { waitUntil: 'networkidle', timeout: 20000 });
        const footerContent = await page.$eval('footer', el => el.textContent);
        log('Instagram no footer', footerContent.includes('Instagram') ? 'PASS' : 'FAIL');

        // ===== 11. 404 PAGE =====
        console.log('\n=== 404 ===');
        await page.goto(BASE_URL + '/nao-existe', { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});
        const body404 = await page.textContent('body').catch(() => '');
        log('404 page', body404.includes('404') || body404.includes('encontrada') ? 'PASS' : 'FAIL');

    } catch (err) {
        log('ERRO GERAL', 'FAIL', err.message);
    } finally {
        try { fs.unlinkSync('/tmp/test-section.png'); } catch {}
        await browser.close();
        console.log('\n========================================');
        console.log(`RESULTADO: ${passed} passaram, ${failed} falharam`);
        console.log('========================================');
        process.exit(failed > 0 ? 1 : 0);
    }
})();
