const HBInit = require('haxball.js');

const config = {
    name: process.env.ROOM_NAME_2 || "Haxball Sala 2",
    token: process.env.HAXBALL_TOKEN_2,
    // Vi nos logs que a senha da sala 2 está na variável PASSWORD_2
    password: process.env.PASSWORD_2 || "", 
    maxPlayers: parseInt(process.env.MAX_PLAYERS_2) || 12,
    // Vi nos logs MOD_PASS_2
    modCommand: process.env.MOD_PASS_2 || "!mod",
    geo: { code: "br", lat: -23.5505, lon: -46.6333 }
};

// --- FIX KEEP ALIVE ---
setInterval(() => {}, 1000 * 60 * 30);

if (!config.token) {
    console.log("[SALA 2] ⚠️ Token 2 não configurado.");
} else {

    console.log(`[SALA 2] 🔄 Iniciando...`);
    console.log(`[SALA 2] 📝 Nome: ${config.name}`);

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
            console.log(`[SALA 2] 🔗 LINK: ${link}`);
            console.log("==================================================");
        };

        room.onPlayerJoin = (player) => {
            console.log(`[SALA 2] 👤 Entrou: ${player.name}`);
            room.sendChat(`Bem-vindo à Sala 2!`, player.id);
        };

        room.onPlayerChat = (player, message) => {
            if (message === config.modCommand) {
                room.setPlayerAdmin(player.id, true);
                console.log(`[SALA 2] 👮 Admin dado para ${player.name}`);
                return false;
            }
        };
        
        room.onRoomExit = () => { process.exit(1); };

    }).catch((err) => {
        console.error("[SALA 2] ❌ ERRO:", err);
        process.exit(1);
    });
}
