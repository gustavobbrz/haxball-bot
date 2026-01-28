// Integração entre Haxball e Discord Bot
// Envia eventos do Haxball para o Discord Bot processar

import { sendDiscordWebhook, DiscordWebhookPayload } from "./discord.js";
import { getRoomConfig } from "./config.js";

// Interface para dados do jogador expandida
interface PlayerData {
  id: number;
  name: string;
  auth: string;
  conn: string;
  team: number;
  admin: boolean;
}

// Interface para estatísticas de partida
interface MatchStats {
  redScore: number;
  blueScore: number;
  redPlayers: string[];
  bluePlayers: string[];
  duration: number;
  winner: 'red' | 'blue';
}

// Enviar mensagem de chat para o Discord
export function sendChatToDiscord(player: PlayerData, message: string): void {
  const config = getRoomConfig();
  
  if (!config.webhooks || !config.webhooks.chat) return;
  
  // Não enviar comandos para o Discord
  if (message.startsWith('!')) return;
  
  const payload: DiscordWebhookPayload = {
    username: `${player.name} (${config.roomType.toUpperCase()})`,
    content: message,
    avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=random`
  };
  
  sendDiscordWebhook(config.webhooks.chat, payload).catch(err => 
    console.error("Erro ao enviar chat para Discord:", err)
  );
}

// Enviar denúncia para o Discord
export function sendReportToDiscord(
  reporter: PlayerData, 
  reported: PlayerData, 
  reason: string
): void {
  const config = getRoomConfig();
  
  if (!config.webhooks || !config.webhooks.denuncias) return;
  
  const payload: DiscordWebhookPayload = {
    embeds: [{
      title: "🚨 Nova Denúncia",
      color: 0xFF0000,
      fields: [
        {
          name: "Denunciante",
          value: `**${reporter.name}**\nAuth: \`${reporter.auth}\``,
          inline: true
        },
        {
          name: "Denunciado",
          value: `**${reported.name}**\nAuth: \`${reported.auth}\``,
          inline: true
        },
        {
          name: "Motivo",
          value: reason,
          inline: false
        },
        {
          name: "Sala",
          value: config.roomName,
          inline: true
        },
        {
          name: "Data/Hora",
          value: new Date().toLocaleString('pt-BR'),
          inline: true
        }
      ],
      footer: {
        text: "Sistema de Denúncias - Arena Cup"
      },
      timestamp: new Date().toISOString()
    }]
  };
  
  sendDiscordWebhook(config.webhooks.denuncias, payload).catch(err =>
    console.error("Erro ao enviar denúncia para Discord:", err)
  );
}

// Enviar estatísticas de partida detalhadas
export function sendMatchStatsToDiscord(stats: MatchStats): void {
  const config = getRoomConfig();
  
  if (!config.webhooks || !config.webhooks.game) return;
  
  const winnerTeam = stats.winner === 'red' ? '🔴 Time Vermelho' : '🔵 Time Azul';
  const winnerColor = stats.winner === 'red' ? 0xFF0000 : 0x0000FF;
  
  const payload: DiscordWebhookPayload = {
    embeds: [{
      title: "⚽ Partida Finalizada",
      description: `**${winnerTeam}** venceu a partida!`,
      color: winnerColor,
      fields: [
        {
          name: "📊 Placar Final",
          value: `🔴 ${stats.redScore} x ${stats.blueScore} 🔵`,
          inline: false
        },
        {
          name: "🔴 Time Vermelho",
          value: stats.redPlayers.join(", ") || "Ninguém",
          inline: true
        },
        {
          name: "🔵 Time Azul",
          value: stats.bluePlayers.join(", ") || "Ninguém",
          inline: true
        },
        {
          name: "⏱️ Duração",
          value: `${Math.floor(stats.duration / 60)}:${(stats.duration % 60).toString().padStart(2, '0')}`,
          inline: true
        },
        {
          name: "🎮 Sala",
          value: config.roomName,
          inline: true
        }
      ],
      footer: {
        text: "Arena Cup - Sistema de Estatísticas"
      },
      timestamp: new Date().toISOString()
    }]
  };
  
  sendDiscordWebhook(config.webhooks.game, payload).catch(err =>
    console.error("Erro ao enviar estatísticas para Discord:", err)
  );
}

// Notificar Discord Bot sobre novo jogador (para registro automático)
export function notifyNewPlayerToBot(player: PlayerData): void {
  const config = getRoomConfig();
  
  // Aqui você pode implementar uma API ou webhook específico para o bot
  // Por enquanto, vamos usar o webhook de entrada
  if (!config.webhooks || !config.webhooks.join) return;
  
  const payload: DiscordWebhookPayload = {
    embeds: [{
      title: "🆕 Novo Jogador Detectado",
      color: 0x00FF00,
      fields: [
        {
          name: "Nome",
          value: player.name,
          inline: true
        },
        {
          name: "Auth",
          value: `\`${player.auth}\``,
          inline: true
        },
        {
          name: "Sala",
          value: config.roomName,
          inline: false
        },
        {
          name: "💡 Dica",
          value: "Se este jogador ainda não está registrado no Discord, peça para ele usar `!registrar " + player.auth + "`",
          inline: false
        }
      ],
      timestamp: new Date().toISOString()
    }]
  };
  
  sendDiscordWebhook(config.webhooks.join, payload).catch(err =>
    console.error("Erro ao notificar novo jogador:", err)
  );
}

// Atualizar status da sala no Discord Bot
export function updateRoomStatus(
  online: boolean, 
  playerCount: number, 
  maxPlayers: number
): void {
  // Aqui você pode implementar uma API REST para o bot
  // ou usar um webhook específico para atualizações de status
  
  console.log(`📊 Status da sala atualizado: ${online ? 'Online' : 'Offline'} - ${playerCount}/${maxPlayers} jogadores`);
  
  // TODO: Implementar chamada para API do bot
  // Exemplo: POST http://localhost:3000/api/room-status
  // Body: { roomType: config.roomType, online, playerCount, maxPlayers }
}

// Comando !denunciar para jogadores
export function handleReportCommand(
  reporter: PlayerData,
  reportedName: string,
  reason: string,
  room: RoomObject
): boolean {
  // Encontrar jogador denunciado
  const playerList = room.getPlayerList();
  const reported = playerList.find(p => 
    p.name.toLowerCase().includes(reportedName.toLowerCase())
  );
  
  if (!reported) {
    room.sendAnnouncement(
      "❌ Jogador não encontrado! Use: !denunciar <nome> <motivo>",
      reporter.id,
      0xFF0000,
      "bold",
      1
    );
    return false;
  }
  
  // Não permitir denunciar a si mesmo
  if (reported.id === reporter.id) {
    room.sendAnnouncement(
      "❌ Você não pode denunciar a si mesmo!",
      reporter.id,
      0xFF0000,
      "bold",
      1
    );
    return false;
  }
  
  // Não permitir denunciar admins
  if (reported.admin) {
    room.sendAnnouncement(
      "❌ Você não pode denunciar um administrador!",
      reporter.id,
      0xFF0000,
      "bold",
      1
    );
    return false;
  }
  
  // Enviar denúncia
  sendReportToDiscord(
    reporter,
    reported as PlayerData,
    reason || "Sem motivo especificado"
  );
  
  // Confirmar para o denunciante
  room.sendAnnouncement(
    "✅ Denúncia enviada! A equipe irá analisar.",
    reporter.id,
    0x00FF00,
    "bold",
    2
  );
  
  // Notificar admins na sala
  playerList.filter(p => p.admin).forEach(admin => {
    room.sendAnnouncement(
      `🚨 ${reporter.name} denunciou ${reported.name}: ${reason}`,
      admin.id,
      0xFF0000,
      "bold",
      1
    );
  });
  
  console.log(`🚨 Denúncia: ${reporter.name} -> ${reported.name}: ${reason}`);
  
  return true;
}
