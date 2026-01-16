const HBInit = require('haxball.js');

const config = {
    name: process.env.NOME_DA_SALA_2 || "Haxball Sala 2",
    token: process.env.HAXBALL_TOKEN_2,
    password: process.env.SENHA_DA_SALA_2 || "",
    maxPlayers: parseInt(process.env.MAX_PLAYERS_SALA_2) || 12,
    modCommand: process.env.SENHA_MODERADOR_SALA_2 || "!mod",
    geo: { code: "br", lat: -23.5505, lon: -46.6333 }
};

// --- FIX KEEP ALIVE ---
setInterval(() => {}, 1000 * 60 * 30);

if (!config.token) {
    console.log("[SALA 2] ⚠️ Token 2 não configurado. Sala ficará em espera.");
} else {

    console.log(`[SALA 2] 🔄 Iniciando configuração...`);
    console.log(`[SALA 2] ⏳ Abrindo sala: "${config.name}"`);

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

        console.log(`[SALA 2] ✅ Instância criada. Esperando Haxball entregar o link...`);

        room.onRoomLink = (link) => {
            console.log("==================================================");
            console.log(`[SALA 2] 🔗 LINK DA SALA: ${link}`);
            console.log("==================================================");
        };

        room.onPlayerJoin = (player) => {
            console.log(`[SALA 2] 👤 Entrou: ${player.name}`);
            room.sendChat(`Bem-vindo à Sala 2!`, player.id);
        };

        room.onPlayerChat = (player, message) => {
            console.log(`[SALA 2] 💬 ${player.name}: ${message}`);
            if (message === config.modCommand) {
                room.setPlayerAdmin(player.id, true);
                return false;
            }
        };
        
        room.onRoomExit = () => {
            console.log("[SALA 2] ❌ Sala fechou.");
            process.exit(1);
        };

    }).catch((err) => {
        console.error("[SALA 2] ❌ ERRO:", err);
        process.exit(1);
    });
}
