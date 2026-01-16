const { spawn } = require('child_process');

// Configurações
const START_DELAY = 10000; // 10 segundos entre iniciar uma e outra

const bots = [
    { file: 'sala1.js', name: '🔴 Sala 1 ' },
    { file: 'sala2.js', name: '🔵 Sala 2 ' }
];

function startBot(botConfig) {
    console.log(`[GERENCIADOR] Iniciando ${botConfig.name}...`);
    
    // Inicia o arquivo separado, herdando as variáveis do painel
    const child = spawn('node', [botConfig.file], {
        cwd: __dirname,
        stdio: 'inherit', // Mostra os logs da sala no console principal
        env: process.env
    });

    child.on('close', (code) => {
        console.error(`[ALERTA] ${botConfig.name} fechou (Código ${code}).`);
        console.log(`[GERENCIADOR] Reiniciando em 5 segundos...`);
        setTimeout(() => startBot(botConfig), 5000);
    });
}

async function init() {
    console.log("=== INICIANDO SISTEMA MULTI-SALAS PRO ===");
    
    // Inicia Sala 1
    startBot(bots[0]);

    // Espera e inicia Sala 2
    await new Promise(r => setTimeout(r, START_DELAY));
    startBot(bots[1]);
}

init();
