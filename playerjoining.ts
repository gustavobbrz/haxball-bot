import { room, specPlayerIdList, debuggingMode, playerConnStrings, adminAuthList, redPlayerIdList, restartGameWithCallback, bluePlayerIdList } from "./index.js";
import { checkAndHandleBadWords } from "./moderation.js";
import { movePlayerToTeam, moveOneSpecToEachTeam } from "./teammanagement.js";
import { sendDiscordWebhook, createPlayerJoinEmbed } from "./discord.js";
import { getRoomConfig } from "./config.js";

export function handlePlayerJoining(player: PlayerObject): void {
    const playerId: number = player.id;
    const playerName: string = player.name;
    const playerList: PlayerObject[] = room.getPlayerList();
    const config = getRoomConfig();
    
    // Verificações de segurança
    if (checkAndHandleBadWords(player, playerName)) return;
    if (isPlayerAlreadyConnected(player, player.conn)) return;
    
    // Verifica Admin e dá a coroa
    if (adminAuthList.has(player.auth)) {
        room.setPlayerAdmin(playerId, true);
        room.sendAnnouncement(`👑 ${playerName} é um administrador!`, null, 0xFFD700, "bold", 2);
    }
    
    // --- MENSAGENS DE BOAS-VINDAS ---
    room.sendAnnouncement("═══════════════════════════════════════", playerId, 0xFFFFFF, "bold", 0);
    room.sendAnnouncement(`🔥 Bem-vindo(a) ${playerName}! 🔥`, playerId, 0xFF6600, "bold", 2);
    room.sendAnnouncement("═══════════════════════════════════════", playerId, 0xFFFFFF, "bold", 0);
    
    room.sendAnnouncement("", playerId, 0xFFFFFF, "normal", 0);
    
    // Mensagem sobre o Discord
    room.sendAnnouncement("💬 Quer entrar no nosso Discord? Digite !discord", playerId, 0x7289DA, "bold", 1);
    
    // Mensagem da Host
    room.sendAnnouncement("🚀 Servidor Hospedado por HaxHosting", playerId, 0x00FFFF, "bold", 1); 
    
    room.sendAnnouncement("", playerId, 0xFFFFFF, "normal", 0);
    room.sendAnnouncement("📜 Digite !regras para ver as regras", playerId, 0xFFFF00, "normal", 1);
    room.sendAnnouncement("❓ Digite !help para ver todos os comandos", playerId, 0xFFFF00, "normal", 1);
    room.sendAnnouncement("═══════════════════════════════════════", playerId, 0xFFFFFF, "bold", 0);
    
    // Anunciar entrada para todos (Global)
    room.sendAnnouncement(`🟢 ${playerName} entrou na sala!`, null, 0x00FF00, "normal", 1);
    
    // --- WEBHOOK DO DISCORD (CORRIGIDO) ---
    if (config.webhooks && config.webhooks.join) {
        // IMPORTANTE: Agora passamos 'player' (o objeto todo), não só 'playerName'
        // Isso permite que o discord.ts pegue o IP, Auth e Hex corretamente.
        sendDiscordWebhook(config.webhooks.join, {
            embeds: [createPlayerJoinEmbed(player, config.roomName)]
        });
    }
    
    // Lógica de jogo (Specs e Times)
    specPlayerIdList.push(playerId);
    console.log(`>>> ${playerName} entrou na sala.`);
    checkAndRestartWithNewMode(playerList);
}

function checkAndRestartWithNewMode(playerList: PlayerObject[]): void {
    const playerListLength: number = playerList.length;
    if (playerListLength === 1) restartGameWithCallback(() => movePlayerToTeam(playerList[0]!.id, redPlayerIdList));
    if (playerListLength === 2) restartGameWithCallback(() => movePlayerToTeam(specPlayerIdList[0]!, bluePlayerIdList));
    if (playerListLength <= 6 && specPlayerIdList.length === 2) restartGameWithCallback(() => moveOneSpecToEachTeam());
}

function isPlayerAlreadyConnected(player: PlayerObject, conn: string): boolean {
    const playerId = player.id;
    if (!debuggingMode && [...playerConnStrings.values()].some(value => value === conn)) {
        room.kickPlayer(playerId, "Já estás conectado à sala", false);
        console.warn(`>>> ${player.name} foi expulso. Razão: conectar-se duas vezes com o mesmo IP.`);
        return true;
    }
    playerConnStrings.set(playerId, conn);
    return false;
}
