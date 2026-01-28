// Comandos estendidos para jogadores
// Adiciona !denunciar e outros comandos novos

import { room } from "./index.js";
import { handleReportCommand, sendChatToDiscord } from "./haxball-discord-integration.js";

interface Command {
    name: string;
    description: string;
    emoji: string;
    usage: string;
    response: (player: PlayerObject, args: string[]) => void;
}

// Comandos adicionais
const extendedCommands: Command[] = [
    {
        name: "denunciar",
        description: "denunciar um jogador por comportamento inadequado",
        emoji: "🚨",
        usage: "!denunciar <nome> <motivo>",
        response: (player: PlayerObject, args: string[]) => {
            if (args.length < 2) {
                room.sendAnnouncement(
                    "❌ Uso: !denunciar <nome> <motivo>",
                    player.id,
                    0xFF0000,
                    "bold",
                    1
                );
                room.sendAnnouncement(
                    "Exemplo: !denunciar João Estava usando hack",
                    player.id,
                    0xFFFF00,
                    "normal",
                    0
                );
                return;
            }

            const reportedName = args[0];
            const reason = args.slice(1).join(" ");

            handleReportCommand(
                player as any,
                reportedName,
                reason,
                room
            );
        }
    },
    {
        name: "discord",
        description: "ver link do servidor Discord",
        emoji: "💬",
        usage: "!discord",
        response: (player: PlayerObject, args: string[]) => {
            room.sendAnnouncement("═══════════════════════════════════════", player.id, 0xFFFFFF, "bold", 0);
            room.sendAnnouncement("💬 DISCORD DO ARENA CUP", player.id, 0x7289DA, "bold", 2);
            room.sendAnnouncement("═══════════════════════════════════════", player.id, 0xFFFFFF, "bold", 0);
            room.sendAnnouncement("", player.id, 0xFFFFFF, "normal", 0);
            room.sendAnnouncement("🔗 Link: https://discord.gg/vHwf9s7U6F", player.id, 0x00FFFF, "bold", 1);
            room.sendAnnouncement("", player.id, 0xFFFFFF, "normal", 0);
            room.sendAnnouncement("✨ Benefícios de entrar:", player.id, 0xFFFF00, "bold", 1);
            room.sendAnnouncement("  • Notificações de partidas", player.id, 0xFFFFFF, "normal", 0);
            room.sendAnnouncement("  • Chat com outros jogadores", player.id, 0xFFFFFF, "normal", 0);
            room.sendAnnouncement("  • Sistema de tickets para suporte", player.id, 0xFFFFFF, "normal", 0);
            room.sendAnnouncement("  • Estatísticas e rankings", player.id, 0xFFFFFF, "normal", 0);
            room.sendAnnouncement("═══════════════════════════════════════", player.id, 0xFFFFFF, "bold", 0);
        }
    },
    {
        name: "regras",
        description: "ver as regras da sala",
        emoji: "📜",
        usage: "!regras",
        response: (player: PlayerObject, args: string[]) => {
            room.sendAnnouncement("═══════════════════════════════════════", player.id, 0xFFFFFF, "bold", 0);
            room.sendAnnouncement("📜 REGRAS DA SALA", player.id, 0xFFD700, "bold", 2);
            room.sendAnnouncement("═══════════════════════════════════════", player.id, 0xFFFFFF, "bold", 0);
            room.sendAnnouncement("", player.id, 0xFFFFFF, "normal", 0);
            room.sendAnnouncement("1️⃣ Respeite todos os jogadores", player.id, 0xFFFFFF, "bold", 1);
            room.sendAnnouncement("2️⃣ Não use palavrões ou ofensas", player.id, 0xFFFFFF, "bold", 1);
            room.sendAnnouncement("3️⃣ Não faça spam no chat", player.id, 0xFFFFFF, "bold", 1);
            room.sendAnnouncement("4️⃣ Não use hacks ou trapaças", player.id, 0xFFFFFF, "bold", 1);
            room.sendAnnouncement("5️⃣ Não fique AFK (ausente) durante partidas", player.id, 0xFFFFFF, "bold", 1);
            room.sendAnnouncement("6️⃣ Jogue limpo e se divirta!", player.id, 0xFFFFFF, "bold", 1);
            room.sendAnnouncement("", player.id, 0xFFFFFF, "normal", 0);
            room.sendAnnouncement("⚠️ Violações podem resultar em kick ou ban", player.id, 0xFF0000, "bold", 1);
            room.sendAnnouncement("🚨 Use !denunciar para reportar jogadores", player.id, 0xFFFF00, "bold", 1);
            room.sendAnnouncement("═══════════════════════════════════════", player.id, 0xFFFFFF, "bold", 0);
        }
    },
    {
        name: "help",
        description: "ver lista de comandos",
        emoji: "❓",
        usage: "!help",
        response: (player: PlayerObject, args: string[]) => {
            room.sendAnnouncement("═══════════════════════════════════════", player.id, 0xFFFFFF, "bold", 0);
            room.sendAnnouncement("❓ COMANDOS DISPONÍVEIS", player.id, 0x00FFFF, "bold", 2);
            room.sendAnnouncement("═══════════════════════════════════════", player.id, 0xFFFFFF, "bold", 0);
            room.sendAnnouncement("", player.id, 0xFFFFFF, "normal", 0);
            
            // Comandos de jogador
            room.sendAnnouncement("🎮 COMANDOS DE JOGADOR:", player.id, 0xFFFF00, "bold", 1);
            extendedCommands.forEach(cmd => {
                room.sendAnnouncement(`  ${cmd.emoji} ${cmd.usage}`, player.id, 0xFFFFFF, "normal", 0);
            });
            
            room.sendAnnouncement("", player.id, 0xFFFFFF, "normal", 0);
            
            // Comandos de admin (se for admin)
            if (player.admin) {
                room.sendAnnouncement("👑 COMANDOS DE ADMIN:", player.id, 0xFFD700, "bold", 1);
                room.sendAnnouncement("  👢 !kick <nome/id> [motivo]", player.id, 0xFFFFFF, "normal", 0);
                room.sendAnnouncement("  🔨 !ban <nome/id> [motivo]", player.id, 0xFFFFFF, "normal", 0);
                room.sendAnnouncement("  🔇 !mute <nome/id>", player.id, 0xFFFFFF, "normal", 0);
                room.sendAnnouncement("  🧹 !clearbans", player.id, 0xFFFFFF, "normal", 0);
                room.sendAnnouncement("  🔄 !rr - Reiniciar partida", player.id, 0xFFFFFF, "normal", 0);
                room.sendAnnouncement("  ⏸️ !pause - Pausar partida", player.id, 0xFFFFFF, "normal", 0);
                room.sendAnnouncement("  ▶️ !unpause - Despausar partida", player.id, 0xFFFFFF, "normal", 0);
                room.sendAnnouncement("  🔄 !swap <nome/id> - Trocar de time", player.id, 0xFFFFFF, "normal", 0);
                room.sendAnnouncement("  👑 !setadmin <nome/id>", player.id, 0xFFFFFF, "normal", 0);
                room.sendAnnouncement("  👤 !removeadmin <nome/id>", player.id, 0xFFFFFF, "normal", 0);
            }
            
            room.sendAnnouncement("", player.id, 0xFFFFFF, "normal", 0);
            room.sendAnnouncement("💬 Entre no Discord: !discord", player.id, 0x7289DA, "bold", 1);
            room.sendAnnouncement("═══════════════════════════════════════", player.id, 0xFFFFFF, "bold", 0);
        }
    },
    {
        name: "afk",
        description: "marcar-se como AFK",
        emoji: "💤",
        usage: "!afk",
        response: (player: PlayerObject, args: string[]) => {
            room.setPlayerTeam(player.id, 0); // Mover para spec
            room.sendAnnouncement(`💤 ${player.name} está AFK`, null, 0xFFFF00, "normal", 1);
        }
    },
    {
        name: "bb",
        description: "sair da sala",
        emoji: "👋",
        usage: "!bb",
        response: (player: PlayerObject, args: string[]) => {
            room.sendAnnouncement(`👋 ${player.name} saiu da sala. Até logo!`, null, 0xFFFF00, "normal", 1);
            room.kickPlayer(player.id, "Saiu voluntariamente", false);
        }
    },
    {
        name: "github",
        description: "ver repositório do código",
        emoji: "💻",
        usage: "!github",
        response: (player: PlayerObject, args: string[]) => {
            room.sendAnnouncement("═══════════════════════════════════════", player.id, 0xFFFFFF, "bold", 0);
            room.sendAnnouncement("💻 CÓDIGO OPEN SOURCE", player.id, 0x00FF00, "bold", 2);
            room.sendAnnouncement("═══════════════════════════════════════", player.id, 0xFFFFFF, "bold", 0);
            room.sendAnnouncement("", player.id, 0xFFFFFF, "normal", 0);
            room.sendAnnouncement("🔗 GitHub: https://github.com/gustavobbrz/server", player.id, 0x00FFFF, "bold", 1);
            room.sendAnnouncement("", player.id, 0xFFFFFF, "normal", 0);
            room.sendAnnouncement("⭐ Dê uma estrela no repositório!", player.id, 0xFFFF00, "bold", 1);
            room.sendAnnouncement("═══════════════════════════════════════", player.id, 0xFFFFFF, "bold", 0);
        }
    },
    {
        name: "stats",
        description: "ver estatísticas da sala",
        emoji: "📊",
        usage: "!stats",
        response: (player: PlayerObject, args: string[]) => {
            const playerList = room.getPlayerList();
            const scores = room.getScores();
            
            room.sendAnnouncement("═══════════════════════════════════════", player.id, 0xFFFFFF, "bold", 0);
            room.sendAnnouncement("📊 ESTATÍSTICAS DA SALA", player.id, 0x00FFFF, "bold", 2);
            room.sendAnnouncement("═══════════════════════════════════════", player.id, 0xFFFFFF, "bold", 0);
            room.sendAnnouncement("", player.id, 0xFFFFFF, "normal", 0);
            room.sendAnnouncement(`👥 Jogadores: ${playerList.length}`, player.id, 0xFFFFFF, "bold", 1);
            
            if (scores) {
                room.sendAnnouncement(`⚽ Placar: 🔴 ${scores.red} x ${scores.blue} 🔵`, player.id, 0xFFFFFF, "bold", 1);
                room.sendAnnouncement(`⏱️ Tempo: ${Math.floor(scores.time / 60)}:${(scores.time % 60).toString().padStart(2, '0')}`, player.id, 0xFFFFFF, "bold", 1);
            }
            
            room.sendAnnouncement("═══════════════════════════════════════", player.id, 0xFFFFFF, "bold", 0);
        }
    }
];

// Verificar e processar comandos estendidos
export function checkAndHandleExtendedCommands(player: PlayerObject, message: string): boolean {
    if (!message.startsWith("!")) return false;

    const parts = message.substring(1).split(" ");
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);

    const command = extendedCommands.find((cmd) => cmd.name === commandName);
    if (!command) return false;

    command.response(player, args);
    return true;
}

// Obter lista de comandos estendidos
export function getExtendedCommandsList(): string[] {
    return extendedCommands.map((cmd) => `${cmd.emoji} ${cmd.usage}: ${cmd.description}`);
}

// Enviar chat para Discord (opcional)
export function handleChatToDiscord(player: PlayerObject, message: string): void {
    // Não enviar comandos
    if (message.startsWith("!")) return;
    
    sendChatToDiscord(player as any, message);
}
