
const HaxballJS = require('haxball.js');

// === CONFIGURAÇÃO SALA 2 (Lendo variáveis do Painel) ===
const config = {
    name: process.env.NOME_DA_SALA_2 || "Haxball Sala 2",
    token: process.env.HAXBALL_TOKEN_2,
    password: process.env.SENHA_DA_SALA_2 || "",
    maxPlayers: parseInt(process.env.MAX_PLAYERS_SALA_2) || 12,
    modCommand: process.env.SENHA_MODERADOR_SALA_2 || "!mod", // Comando para virar mod na sala 2
    geo: { code: "br", lat: -23.5505, lon: -46.6333 }
};

// Verifica se a sala 2 foi configurada
if (!config.token || config.token === "") {
    console.log("[SALA 2] Token não configurado. A Sala 2 não será aberta.");
    // Mantemos o processo vivo mas sem fazer nada, ou fechamos. 
    // Como o index reinicia se fechar com erro, vamos fechar com código 0 (sucesso/intencional)
    process.exit(0); 
}

console.log(`[SALA 2] Tentando abrir sala: ${config.name}`);

HaxballJS.then((HBInit) => {
    const room = HBInit({
        roomName: config.name,
        maxPlayers: config.maxPlayers,
        public: !config.password,
        password: config.password,
        token: config.token,
        geo: config.geo,
        noPlayer: true
    });

    room.onRoomLink = (link) => {
        console.log(`[SALA 2] ONLINE! Link: ${link}`);
        console.log(`[SALA 2] Comando de Mod: ${config.modCommand}`);
    };

    room.onPlayerJoin = (player) => {
        console.log(`[SALA 2] Entrou: ${player.name}`);
        room.sendChat(`Bem-vindo à Sala Secundária, ${player.name}!`, player.id);
    };

    room.onPlayerChat = (player, message) => {
        // Comando para virar Admin/Mod na sala 2
        if (message === config.modCommand) {
            room.setPlayerAdmin(player.id, true);
            room.sendChat(`Admin concedido na Sala 2, ${player.name}!`, player.id);
            return false;
        }
    };
});
