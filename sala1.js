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

if (!config.token) {
    console.error("[SALA 1] ERRO: Token não configurado no painel!");
    process.exit(1); // Sai com erro para o index.js reiniciar
}

console.log(`[SALA 1] Tentando abrir: ${config.name}`);

// === INICIALIZAÇÃO BLINDADA (Igual ao seu vem_tranquilo.js mas atualizado) ===
HBInit({
    roomName: config.name,
    maxPlayers: config.maxPlayers,
    public: !config.password,
    password: config.password,
    token: config.token,
    geo: config.geo,
    noPlayer: true,
    // O SEGREDO DO SUCESSO DO SEU OUTRO SERVIDOR ESTÁ AQUI EMBAIXO:
    puppeteer: { 
        args: ['--no-sandbox', '--disable-setuid-sandbox'], 
        headless: true 
    }
}).then((room) => {
    
    console.log(`[SALA 1] Sala aberta com sucesso!`);

    room.onRoomLink = (link) => {
        console.log(`[SALA 1] Link: ${link}`);
        console.log(`[SALA 1] Comando Admin: ${config.adminCommand}`);
    };

    room.onPlayerJoin = (player) => {
        console.log(`[SALA 1] Entrou: ${player.name}`);
        room.sendChat(`Bem-vindo à ${config.name}!`, player.id);
    };

    room.onPlayerChat = (player, message) => {
        if (message === config.adminCommand) {
            room.setPlayerAdmin(player.id, true);
            return false; // Não mostra a senha no chat
        }
    };

    // Mantém o processo vivo caso ocorra erro na sala
    room.onRoomExit = () => {
        console.log("[SALA 1] A sala fechou inesperadamente.");
        process.exit(1);
    };

}).catch((err) => {
    console.error("[SALA 1] ERRO CRÍTICO AO ABRIR:", err);
    process.exit(1);
});
