const { spawn } = require('child_process');
const path = require('path');

// === LISTA DE SALAS PARA INICIAR ===
const bots = [
    { 
        file: 'sala1.js', 
        name: 'SALA 01 (Principal)' 
    },
    { 
        file: 'sala2.js', 
        name: 'SALA 02 (Secundária)' 
    },
];

const START_DELAY = 10000; // 10 segundos entre cada sala

function startBot(botConfig) {
    console.log(`[GERENCIADOR] Iniciando processo: ${botConfig.name}...`);
    
    const child = spawn('node', [botConfig.file], {
        cwd: __dirname, 
        stdio: 'inherit' 
    });

    child.on('close', (code) => {
        console.error(`[ALERTA] ${botConfig.name} caiu/fechou (Código ${code}).`);
        console.log(`[GERENCIADOR] Reiniciando ${botConfig.name} em 5 segundos...`);
        setTimeout(() => startBot(botConfig), 5000);
    });
    
    child.on('error', (err) => {
        console.error(`[ERRO FATAL] Não foi possível iniciar ${botConfig.name}:`, err);
    });
}

async function initSystem() {
    console.log("==========================================");
    console.log("   GERENCIADOR HAXBALL (BASEADO NA AZZURASHIN)   ");
    console.log("==========================================");

    for (let i = 0; i < bots.length; i++) {
        startBot(bots[i]);
        
        if (i < bots.length - 1) {
            console.log(`[GERENCIADOR] Aguardando ${START_DELAY/1000}s para a próxima...`);
            await new Promise(r => setTimeout(r, START_DELAY));
        }
    }
    console.log("[GERENCIADOR] Todas as salas foram acionadas.");
}

initSystem();
