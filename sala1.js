
const HaxballJS = require('haxball.js');

// === CONFIGURAÇÃO SALA 1 (Lendo variáveis do Painel) ===
// Nota: Os nomes das variáveis (process.env.XXX) devem ser iguais aos do Pterodactyl (letras maiúsculas e _ no lugar de espaço)
const config = {
    name: process.env.NOME_DA_SALA || "Haxball Sala 1",
    token: process.env.HAXBALL_TOKEN,
    password: process.env.SENHA_DA_SALA || "", // Se vazio, sem senha
    maxPlayers: parseInt(process.env.MAX_PLAYERS) || 12,
    adminCommand: process.env.SENHA_ADMIN_PRINCIPAL || "!admin", // O comando para virar dono
    geo: { code: "br", lat: -23.5505, lon: -46.6333 }
};

if (!config.token) {
    console.error("[SALA 1] ERRO: Token da Sala 1 não encontrado nas variáveis!");
    process.exit(1); // Fecha o script se não tiver token
}

console.log(`[SALA 1] Tentando abrir sala: ${config.name}`);

HaxballJS.then((HBInit) => {
    const room = HBInit({
        roomName: config.name,
        maxPlayers: config.maxPlayers,
        public: !config.password,
        password: config.password,
        token: config.token,
        geo: config.geo,
        noPlayer: true // O bot não cria um jogador físico, fica invisível
    });

    // Quando a sala abre
    room.onRoomLink = (link) => {
        console.log(`[SALA 1] ONLINE! Link: ${link}`);
        console.log(`[SALA 1] Comando de admin: ${config.adminCommand}`);
    };

    // Quando alguém entra
    room.onPlayerJoin = (player) => {
        console.log(`[SALA 1] Entrou: ${player.name}`);
        room.sendChat(`Bem-vindo, ${player.name}!`, player.id);
    };

    // Comandos de Chat
    room.onPlayerChat = (player, message) => {
        // Comando para virar Admin (Baseado na variável do painel)
        if (message === config.adminCommand) {
            room.setPlayerAdmin(player.id, true);
            room.sendChat(`Você agora é admin, ${player.name}!`, player.id);
            return false; // Não mostra a senha no chat
        }
    };
});
