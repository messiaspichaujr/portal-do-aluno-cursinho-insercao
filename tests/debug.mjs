const API = 'https://portal-do-aluno-cursinho-insercao-production.up.railway.app';

async function debug() {
    // 1. Banner historico
    console.log('=== 1. Banner historico ===');
    const histRes = await fetch(API + '/api/banners/historico');
    console.log('Status:', histRes.status, histRes.headers.get('content-type'));
    const histText = await histRes.text();
    console.log('Body:', histText.substring(0, 500));

    // 2. Secoes list
    console.log('\n=== 2. Secoes ===');
    const secRes = await fetch(API + '/api/secoes');
    console.log('Status:', secRes.status, secRes.headers.get('content-type'));
    const secText = await secRes.text();
    console.log('Body:', secText.substring(0, 500));

    // 3. Test /uploads path
    console.log('\n=== 3. /uploads root ===');
    const upRes = await fetch(API + '/uploads/');
    console.log('Status:', upRes.status, upRes.headers.get('content-type'));
    const upText = await upRes.text();
    console.log('Body:', upText.substring(0, 300));

    // 4. Registration
    console.log('\n=== 4. Public registration ===');
    const regRes = await fetch(API + '/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nome: 'Teste Debug',
            email: 'debug.test.' + Date.now() + '@teste.com',
            senha: 'Teste123',
            tipo: 3
        })
    });
    console.log('Status:', regRes.status, regRes.headers.get('content-type'));
    const regBody = await regRes.text();
    console.log('Response:', regBody);
}

debug().catch(console.error);
