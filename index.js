const { spawn } = require('child_process');
const http = require('http');

// === MANTÉM O PAINEL ONLINE (Porta 8000) ===
const PORT = process.env.SERVER_PORT || 8000;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('HaxHosting Multi-System Online');
}).listen(PORT, () => console.log(`[SYSTEM] Painel Online na porta ${PORT}`));

// === CONFIGURAÇÃO DOS PROCESSOS ===
const bots = [
    { file: 'sala1.js', name: 'DONO 01 (Sala 1)' },
    { file: 'sala2.js', name: 'DONO 02 (Sala 2)' }
];

function startBot(botConfig) {
    console.log(`[SYSTEM] Iniciando ${botConfig.name}...`);
    
    // Inicia o processo isolado
    const child = spawn('node', [botConfig.file], {
        cwd: __dirname,
        stdio: 'inherit',
        env: process.env
    });

    child.on('close', (code) => {
        console.error(`[ALERTA] ${botConfig.name} caiu (Código ${code}).`);
        console.log(`[SYSTEM] Reiniciando ${botConfig.name} em 5s...`);
        setTimeout(() => startBot(botConfig), 5000);
    });
}

// Inicia as duas salas com intervalo para não bugar a conexão
startBot(bots[0]);
setTimeout(() => startBot(bots[1]), 10000);
