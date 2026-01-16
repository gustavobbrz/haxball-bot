const HBInit = require('haxball.js');

// === CONFIGURAÇÃO VIA PAINEL (SALA 2) ===
const config = {
    name: process.env.NOME_DA_SALA_2 || "Haxball Sala 2",
    token: process.env.HAXBALL_TOKEN_2,
    password: process.env.SENHA_DA_SALA_2 || "",
    maxPlayers: parseInt(process.env.MAX_PLAYERS_SALA_2) || 12,
    modCommand: process.env.SENHA_MODERADOR_SALA_2 || "!mod",
    geo: { code: "br", lat: -23.5505, lon: -46.6333 }
};

if (!config.token) {
    console.log("[SALA 2] Token 2 não configurado. Ignorando sala.");
    // Aqui usamos exit(0) se não quiser que reinicie, ou loop no index
    // Vamos deixar rodando um loop lento para não travar o index
    setInterval(() => {}, 100000); 
} else {

    console.log(`[SALA 2] Tentando abrir: ${config.name}`);

    HBInit({
        roomName: config.name,
        maxPlayers: config.maxPlayers,
        public: !config.password,
        password: config.password,
        token: config.token,
        geo: config.geo,
        noPlayer: true,
        // CONFIGURAÇÃO DO PUPPETEER
        puppeteer: { 
            args: ['--no-sandbox', '--disable-setuid-sandbox'], 
            headless: true 
        }
    }).then((room) => {

        room.onRoomLink = (link) => {
            console.log(`[SALA 2] Link: ${link}`);
        };

        room.onPlayerJoin = (player) => {
            console.log(`[SALA 2] Entrou: ${player.name}`);
            room.sendChat(`Bem-vindo à Sala 2!`, player.id);
        };

        room.onPlayerChat = (player, message) => {
            if (message === config.modCommand) {
                room.setPlayerAdmin(player.id, true);
                return false;
            }
        };
        
        room.onRoomExit = () => {
            console.log("[SALA 2] Fechou.");
            process.exit(1);
        };

    }).catch((err) => {
        console.error("[SALA 2] ERRO:", err);
        process.exit(1);
    });
}
