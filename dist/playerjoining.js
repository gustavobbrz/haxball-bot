"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePlayerJoining = void 0;
const index_js_1 = require("./index.js");
const moderation_js_1 = require("./moderation.js");
const teammanagement_js_1 = require("./teammanagement.js");
const discord_js_1 = require("./discord.js");
const config_js_1 = require("./config.js");
function handlePlayerJoining(player) {
    const playerId = player.id;
    const playerName = player.name;
    const playerList = index_js_1.room.getPlayerList();
    const config = (0, config_js_1.getRoomConfig)();
    // Verificações de segurança
    if ((0, moderation_js_1.checkAndHandleBadWords)(player, playerName))
        return;
    if (isPlayerAlreadyConnected(player, player.conn))
        return;
    // Verifica Admin e dá a coroa
    if (index_js_1.adminAuthList.has(player.auth)) {
        index_js_1.room.setPlayerAdmin(playerId, true);
        index_js_1.room.sendAnnouncement(`👑 ${playerName} é um administrador!`, null, 0xFFD700, "bold", 2);
    }
    // --- MENSAGENS DE BOAS-VINDAS ---
    index_js_1.room.sendAnnouncement("═══════════════════════════════════════", playerId, 0xFFFFFF, "bold", 0);
    index_js_1.room.sendAnnouncement(`🔥 Bem-vindo(a) ${playerName}! 🔥`, playerId, 0xFF6600, "bold", 2);
    index_js_1.room.sendAnnouncement("═══════════════════════════════════════", playerId, 0xFFFFFF, "bold", 0);
    index_js_1.room.sendAnnouncement("", playerId, 0xFFFFFF, "normal", 0);
    // Mensagem sobre o Discord
    index_js_1.room.sendAnnouncement("💬 Quer entrar no nosso Discord? Digite !discord", playerId, 0x7289DA, "bold", 1);
    // Mensagem da Host
    index_js_1.room.sendAnnouncement("🚀 Servidor Hospedado por HaxHosting", playerId, 0x00FFFF, "bold", 1);
    index_js_1.room.sendAnnouncement("", playerId, 0xFFFFFF, "normal", 0);
    index_js_1.room.sendAnnouncement("📜 Digite !regras para ver as regras", playerId, 0xFFFF00, "normal", 1);
    index_js_1.room.sendAnnouncement("❓ Digite !help para ver todos os comandos", playerId, 0xFFFF00, "normal", 1);
    index_js_1.room.sendAnnouncement("═══════════════════════════════════════", playerId, 0xFFFFFF, "bold", 0);
    // Anunciar entrada para todos (Global)
    index_js_1.room.sendAnnouncement(`🟢 ${playerName} entrou na sala!`, null, 0x00FF00, "normal", 1);
    // --- WEBHOOK DO DISCORD (CORRIGIDO) ---
    if (config.webhooks && config.webhooks.join) {
        // IMPORTANTE: Agora passamos 'player' (o objeto todo), não só 'playerName'
        // Isso permite que o discord.ts pegue o IP, Auth e Hex corretamente.
        (0, discord_js_1.sendDiscordWebhook)(config.webhooks.join, {
            embeds: [(0, discord_js_1.createPlayerJoinEmbed)(player, config.roomName)]
        });
    }
    // Lógica de jogo (Specs e Times)
    index_js_1.specPlayerIdList.push(playerId);
    console.log(`>>> ${playerName} entrou na sala.`);
    checkAndRestartWithNewMode(playerList);
}
exports.handlePlayerJoining = handlePlayerJoining;
function checkAndRestartWithNewMode(playerList) {
    const playerListLength = playerList.length;
    if (playerListLength === 1)
        (0, index_js_1.restartGameWithCallback)(() => (0, teammanagement_js_1.movePlayerToTeam)(playerList[0].id, index_js_1.redPlayerIdList));
    if (playerListLength === 2)
        (0, index_js_1.restartGameWithCallback)(() => (0, teammanagement_js_1.movePlayerToTeam)(index_js_1.specPlayerIdList[0], index_js_1.bluePlayerIdList));
    if (playerListLength <= 6 && index_js_1.specPlayerIdList.length === 2)
        (0, index_js_1.restartGameWithCallback)(() => (0, teammanagement_js_1.moveOneSpecToEachTeam)());
}
function isPlayerAlreadyConnected(player, conn) {
    const playerId = player.id;
    if (!index_js_1.debuggingMode && [...index_js_1.playerConnStrings.values()].some(value => value === conn)) {
        index_js_1.room.kickPlayer(playerId, "Já estás conectado à sala", false);
        console.warn(`>>> ${player.name} foi expulso. Razão: conectar-se duas vezes com o mesmo IP.`);
        return true;
    }
    index_js_1.playerConnStrings.set(playerId, conn);
    return false;
}
