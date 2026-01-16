const HBInit = require('haxball.js');

// === CONFIGURAÇÃO VIA PAINEL ===
const config = {
    name: process.env.NOME_DA_SALA || "Haxball Sala 1",
    token: process.env.HAXBALL_TOKEN,
    password: process.env.SENHA_DA_SALA || "", 
    maxPlayers: parseInt(process.env.MAX_PLAYERS) || 16,
    adminCommand: process.env.SENHA_ADMIN_PRINCIPAL || "!admin",
    geo: { code: "br", lat: -23.5505, lon: -46.6333 }
};

// --- FIX PARA NÃO FECHAR SOZINHO (CODE 0) ---
// Isso mantém o processo vivo indefinidamente
setInterval(() => {
    // Heartbeat silencioso a cada 30 min só para o Node não fechar
}, 1000 * 60 * 30);

if (!config.token) {
    console.error("[SALA 1] ❌ ERRO: Token não configurado no painel!");
    process.exit(1);
}

console.log(`[SALA 1] 🔄 Iniciando navegador headless...`);
console.log(`[SALA 1] ⏳ Tentando abrir a sala: "${config.name}"`);

HBInit({
    roomName: config.name,
    maxPlayers: config.maxPlayers,
    public: !config.password,
    password: config.password,
    token: config.token,
    geo: config.geo,
    noPlayer: true,
    puppeteer: { 
        args: ['--no-sandbox', '--disable-setuid-sandbox'], 
        headless: true 
    }
}).then((room) => {
    
    console.log(`[SALA 1] ✅ Navegador abriu! Aguardando link...`);

    // Quando o link é gerado
    room.onRoomLink = (link) => {
        console.log("==================================================");
        console.log(`[SALA 1] 🔗 LINK DA SALA: ${link}`);
        console.log(`[SALA 1] 🔑 Comando Admin: ${config.adminCommand}`);
        console.log("==================================================");
    };

    // Quando alguém entra
    room.onPlayerJoin = (player) => {
        console.log(`[SALA 1] 👤 Entrou: ${player.name} (ID: ${player.id})`);
        room.sendChat(`Bem-vindo à ${config.name}!`, player.id);
    };

    // Chat
    room.onPlayerChat = (player, message) => {
        console.log(`[SALA 1] 💬 ${player.name}: ${message}`);
        if (message === config.adminCommand) {
            room.setPlayerAdmin(player.id, true);
            console.log(`[SALA 1] 👑 Admin concedido para ${player.name}`);
            return false;
        }
    };

    // Erro ao sair
    room.onRoomExit = () => {
        console.log("[SALA 1] ❌ A sala fechou inesperadamente (onRoomExit).");
        process.exit(1);
    };

}).catch((err) => {
    console.error("[SALA 1] ❌ ERRO CRÍTICO AO ABRIR:", err);
    process.exit(1);
});
