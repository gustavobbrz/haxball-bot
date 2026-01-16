const HBInit = require('haxball.js');

// === CONFIGURAÇÃO CORRIGIDA (Baseada nos seus logs) ===
const config = {
    // Tenta pegar ROOM_NAME, se não achar, usa o padrão
    name: process.env.ROOM_NAME || "Haxball Sala 1",
    token: process.env.HAXBALL_TOKEN,
    password: process.env.ROOM_PASS || "", 
    maxPlayers: parseInt(process.env.MAX_PLAYERS) || 16,
    adminCommand: process.env.ADMIN_PASS || "!admin",
    geo: { code: "br", lat: -23.5505, lon: -46.6333 }
};

// --- FIX KEEP ALIVE ---
setInterval(() => {}, 1000 * 60 * 30);

if (!config.token) {
    console.error("[SALA 1] ❌ ERRO: Token não configurado!");
    process.exit(1);
}

console.log(`[SALA 1] 🔄 Iniciando navegador...`);
console.log(`[SALA 1] 📝 Nome da Sala: ${config.name}`);
console.log(`[SALA 1] 👑 Senha Admin: ${config.adminCommand}`);

HBInit({
    roomName: config.name,
    maxPlayers: config.maxPlayers,
    public: !config.password,
    password: config.password,
    token: config.token,
    geo: config.geo,
    noPlayer: true,
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true }
}).then((room) => {
    
    room.onRoomLink = (link) => {
        console.log("==================================================");
        console.log(`[SALA 1] 🔗 LINK: ${link}`);
        console.log("==================================================");
    };

    room.onPlayerJoin = (player) => {
        console.log(`[SALA 1] 👤 Entrou: ${player.name}`);
        room.sendChat(`Bem-vindo!`, player.id);
    };

    room.onPlayerChat = (player, message) => {
        if (message === config.adminCommand) {
            room.setPlayerAdmin(player.id, true);
            console.log(`[SALA 1] 👑 Admin dado para ${player.name}`);
            return false;
        }
    };

    room.onRoomExit = () => { process.exit(1); };

}).catch((err) => {
    console.error("[SALA 1] ❌ ERRO:", err);
    process.exit(1);
});
