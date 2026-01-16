const { spawn } = require('child_process');

const bots = [];

// Lista de Salas
bots.push({ file: 'sala1.js', name: 'SALA 01' });

if (process.env.HAXBALL_TOKEN_2 && process.env.HAXBALL_TOKEN_2.length > 5) {
    bots.push({ file: 'sala2.js', name: 'SALA 02' });
}

function startBot(botConfig) {
    console.log(`[GERENCIADOR] Iniciando: ${botConfig.name}...`);
    
    // Mudamos para 'pipe' para poder ler o erro
    const child = spawn('node', [botConfig.file], {
        env: process.env 
    });

    // Mostra o que a sala fala (logs normais)
    child.stdout.on('data', (data) => {
        process.stdout.write(`[${botConfig.name}] ${data}`);
    });

    // Mostra o ERRO se houver (Importante!)
    child.stderr.on('data', (data) => {
        process.stderr.write(`[ERRO ${botConfig.name}] ${data}`);
    });

    child.on('close', (code) => {
        console.error(`[ALERTA] ${botConfig.name} fechou (Código: ${code}). Reiniciando em 5s...`);
        setTimeout(() => startBot(botConfig), 5000);
    });
}

(async () => {
    for (const bot of bots) {
        startBot(bot);
        await new Promise(r => setTimeout(r, 3000));
    }
})();
