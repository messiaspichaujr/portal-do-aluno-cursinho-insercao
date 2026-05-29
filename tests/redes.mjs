import { chromium } from 'playwright';

const BASE_URL = 'https://portal-do-aluno-cursinho-insercao-m.vercel.app';
const API_URL = 'https://portal-do-aluno-cursinho-insercao-production.up.railway.app';
const ADMIN_EMAIL = 'admin@cursinho.com';
const ADMIN_PASS = 'Pac4Finaly321!';

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // 1. Check if /api/redes returns anything
    console.log('=== 1. API /api/redes ===');
    const redesRes = await fetch(API_URL + '/api/redes');
    console.log('Status:', redesRes.status);
    const redes = await redesRes.json();
    console.log('Redes cadastradas:', JSON.stringify(redes, null, 2));

    if (redes.length === 0) {
        console.log('Nenhuma rede social cadastrada. Tentando adicionar via admin...');

        // Login as admin
        await page.goto(BASE_URL + '/portal/login', { waitUntil: 'networkidle', timeout: 20000 });
        await page.fill('input[type="email"]', ADMIN_EMAIL);
        await page.fill('input[type="password"]', ADMIN_PASS);
        await page.click('button[type="submit"]');
        await new Promise(r => setTimeout(r, 3000));
        console.log('Admin logado:', page.url());

        // Go to redes admin page
        await page.goto(BASE_URL + '/admin/redes', { waitUntil: 'networkidle', timeout: 15000 });
        console.log('Redes page URL:', page.url());

        // Get page content to understand the form
        const bodyText = await page.textContent('body');
        console.log('Page preview:', bodyText.substring(0, 500));
    }

    // 2. Check footer on homepage
    console.log('\n=== 2. Footer na homepage ===');
    await page.goto(BASE_URL + '/home', { waitUntil: 'networkidle', timeout: 20000 });

    // Check footer section
    const footerExists = await page.$('footer');
    console.log('Footer existe:', !!footerExists);

    if (footerExists) {
        // Check redes sociais section
        const footerText = await footerExists.textContent();
        console.log('Footer text:', footerText.substring(0, 300));

        // Check for links in redes section
        const footerLinks = await footerExists.$$('a');
        console.log('Links no footer:', footerLinks.length);
        for (const link of footerLinks) {
            const text = await link.textContent();
            const href = await link.getAttribute('href');
            console.log(`  - "${text?.trim()}" -> ${href}`);
        }
    }

    await browser.close();
})();
