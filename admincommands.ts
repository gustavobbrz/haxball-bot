import { room } from "./index.js";
import { sendDiscordWebhook, createAdminActionEmbed } from "./discord.js";
import { getRoomConfig } from "./config.js";

interface AdminCommand {
    name: string;
    description: string;
    emoji: string;
    usage: string;
    response: (player: PlayerObject, args: string[]) => void;
}

const adminCommands: AdminCommand[] = [
    {
        name: "kick",
        description: "expulsar um jogador da sala",
        emoji: "👢",
        usage: "!kick <nome/id> [motivo]",
        response: (player: PlayerObject, args: string[]) => {
            if (args.length < 1) {
                room.sendAnnouncement("❌ Uso: !kick <nome/id> [motivo]", player.id, 0xFF0000, "bold", 0);
                return;
            }

            const targetIdentifier = args[0];
            const reason = args.slice(1).join(" ") || "Sem motivo especificado";
            const targetPlayer = findPlayer(targetIdentifier);

            if (!targetPlayer) {
                room.sendAnnouncement("❌ Jogador não encontrado!", player.id, 0xFF0000, "bold", 0);
                return;
            }

            if (targetPlayer.admin) {
                room.sendAnnouncement("❌ Você não pode kickar um admin!", player.id, 0xFF0000, "bold", 0);
                return;
            }

            room.kickPlayer(targetPlayer.id, reason, false);
            room.sendAnnouncement(`👢 ${targetPlayer.name} foi expulso por ${player.name}. Motivo: ${reason}`, null, 0xFFA500, "bold", 2);
            
            // Enviar webhook
            const config = getRoomConfig();
            if (config.webhooks && config.webhooks.admin) {
                sendDiscordWebhook(config.webhooks.admin, {
                    embeds: [createAdminActionEmbed(player.name, "Kick", targetPlayer.name, reason, config.roomName)]
                }).catch(console.error);
            }
        }
    },
    {
        name: "ban",
        description: "banir um jogador da sala",
        emoji: "🔨",
        usage: "!ban <nome/id> [motivo]",
        response: (player: PlayerObject, args: string[]) => {
            if (args.length < 1) {
                room.sendAnnouncement("❌ Uso: !ban <nome/id> [motivo]", player.id, 0xFF0000, "bold", 0);
                return;
            }

            const targetIdentifier = args[0];
            const reason = args.slice(1).join(" ") || "Sem motivo especificado";
            const targetPlayer = findPlayer(targetIdentifier);

            if (!targetPlayer) {
                room.sendAnnouncement("❌ Jogador não encontrado!", player.id, 0xFF0000, "bold", 0);
                return;
            }

            if (targetPlayer.admin) {
                room.sendAnnouncement("❌ Você não pode banir um admin!", player.id, 0xFF0000, "bold", 0);
                return;
            }

            room.kickPlayer(targetPlayer.id, reason, true);
            room.sendAnnouncement(`🔨 ${targetPlayer.name} foi BANIDO por ${player.name}. Motivo: ${reason}`, null, 0xFF0000, "bold", 2);
            
            // Enviar webhook
            const config = getRoomConfig();
            if (config.webhooks && config.webhooks.admin) {
                sendDiscordWebhook(config.webhooks.admin, {
                    embeds: [createAdminActionEmbed(player.name, "Ban", targetPlayer.name, reason, config.roomName)]
                }).catch(console.error);
            }
        }
    },
    {
        name: "mute",
        description: "silenciar um jogador",
        emoji: "🔇",
        usage: "!mute <nome/id>",
        response: (player: PlayerObject, args: string[]) => {
            if (args.length < 1) {
                room.sendAnnouncement("❌ Uso: !mute <nome/id>", player.id, 0xFF0000, "bold", 0);
                return;
            }

            const targetIdentifier = args[0];
            const targetPlayer = findPlayer(targetIdentifier);

            if (!targetPlayer) {
                room.sendAnnouncement("❌ Jogador não encontrado!", player.id, 0xFF0000, "bold", 0);
                return;
            }

            if (targetPlayer.admin) {
                room.sendAnnouncement("❌ Você não pode mutar um admin!", player.id, 0xFF0000, "bold", 0);
                return;
            }

            // Nota: haxball.js não tem função nativa de mute, então vamos simular
            room.sendAnnouncement(`🔇 ${targetPlayer.name} foi silenciado por ${player.name}.`, null, 0xFFA500, "bold", 2);
            room.sendAnnouncement("⚠️ Você foi silenciado. Evite spam ou comportamento inadequado.", targetPlayer.id, 0xFF0000, "bold", 2);
        }
    },
    {
        name: "clearbans",
        description: "limpar todos os bans da sala",
        emoji: "🧹",
        usage: "!clearbans",
        response: (player: PlayerObject, args: string[]) => {
            room.clearBans();
            room.sendAnnouncement(`🧹 Todos os bans foram limpos por ${player.name}.`, null, 0x00FF00, "bold", 2);
        }
    },
    {
        name: "rr",
        description: "reiniciar a partida",
        emoji: "🔄",
        usage: "!rr",
        response: (player: PlayerObject, args: string[]) => {
            room.stopGame();
            room.startGame();
            room.sendAnnouncement(`🔄 Partida reiniciada por ${player.name}.`, null, 0x00FFFF, "bold", 2);
        }
    },
    {
        name: "pause",
        description: "pausar a partida",
        emoji: "⏸️",
        usage: "!pause",
        response: (player: PlayerObject, args: string[]) => {
            room.pauseGame(true);
            room.sendAnnouncement(`⏸️ Partida pausada por ${player.name}.`, null, 0xFFFF00, "bold", 2);
        }
    },
    {
        name: "unpause",
        description: "despausar a partida",
        emoji: "▶️",
        usage: "!unpause",
        response: (player: PlayerObject, args: string[]) => {
            room.pauseGame(false);
            room.sendAnnouncement(`▶️ Partida despausada por ${player.name}.`, null, 0x00FF00, "bold", 2);
        }
    },
    {
        name: "swap",
        description: "trocar um jogador de time",
        emoji: "🔄",
        usage: "!swap <nome/id>",
        response: (player: PlayerObject, args: string[]) => {
            if (args.length < 1) {
                room.sendAnnouncement("❌ Uso: !swap <nome/id>", player.id, 0xFF0000, "bold", 0);
                return;
            }

            const targetIdentifier = args[0];
            const targetPlayer = findPlayer(targetIdentifier);

            if (!targetPlayer) {
                room.sendAnnouncement("❌ Jogador não encontrado!", player.id, 0xFF0000, "bold", 0);
                return;
            }

            const newTeam = targetPlayer.team === 1 ? 2 : targetPlayer.team === 2 ? 1 : 1;
            room.setPlayerTeam(targetPlayer.id, newTeam);
            room.sendAnnouncement(`🔄 ${targetPlayer.name} foi movido de time por ${player.name}.`, null, 0x00FFFF, "bold", 2);
        }
    },
    {
        name: "setadmin",
        description: "dar admin para um jogador",
        emoji: "👑",
        usage: "!setadmin <nome/id>",
        response: (player: PlayerObject, args: string[]) => {
            if (args.length < 1) {
                room.sendAnnouncement("❌ Uso: !setadmin <nome/id>", player.id, 0xFF0000, "bold", 0);
                return;
            }

            const targetIdentifier = args[0];
            const targetPlayer = findPlayer(targetIdentifier);

            if (!targetPlayer) {
                room.sendAnnouncement("❌ Jogador não encontrado!", player.id, 0xFF0000, "bold", 0);
                return;
            }

            room.setPlayerAdmin(targetPlayer.id, true);
            room.sendAnnouncement(`👑 ${targetPlayer.name} recebeu admin de ${player.name}.`, null, 0xFFD700, "bold", 2);
        }
    },
    {
        name: "removeadmin",
        description: "remover admin de um jogador",
        emoji: "👤",
        usage: "!removeadmin <nome/id>",
        response: (player: PlayerObject, args: string[]) => {
            if (args.length < 1) {
                room.sendAnnouncement("❌ Uso: !removeadmin <nome/id>", player.id, 0xFF0000, "bold", 0);
                return;
            }

            const targetIdentifier = args[0];
            const targetPlayer = findPlayer(targetIdentifier);

            if (!targetPlayer) {
                room.sendAnnouncement("❌ Jogador não encontrado!", player.id, 0xFF0000, "bold", 0);
                return;
            }

            room.setPlayerAdmin(targetPlayer.id, false);
            room.sendAnnouncement(`👤 Admin removido de ${targetPlayer.name} por ${player.name}.`, null, 0xFFA500, "bold", 2);
        }
    }
];

export function checkAndHandleAdminCommands(player: PlayerObject, message: string): boolean {
    if (!player.admin) return false;
    if (!message.startsWith("!")) return false;

    const parts = message.substring(1).split(" ");
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);

    const command = adminCommands.find((cmd) => cmd.name === commandName);
    if (!command) return false;

    command.response(player, args);
    return true;
}

export function getAdminCommandsList(): string[] {
    return adminCommands.map((cmd) => `${cmd.emoji} ${cmd.usage}: ${cmd.description}`);
}

function findPlayer(identifier: string): PlayerObject | null {
    const playerList = room.getPlayerList();
    
    // Tentar encontrar por ID
    const playerId = parseInt(identifier);
    if (!isNaN(playerId)) {
        const player = playerList.find(p => p.id === playerId);
        if (player) return player;
    }
    
    // Tentar encontrar por nome (case insensitive, partial match)
    const lowerIdentifier = identifier.toLowerCase();
    return playerList.find(p => p.name.toLowerCase().includes(lowerIdentifier)) || null;
}
