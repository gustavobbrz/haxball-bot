// ARQUIVO: discord.ts

// --- FUNÇÕES AJUDANTES (HELPERS) ---

// Converte o IP (String) para Hexadecimal (para o campo Conn)
function stringToHex(str: string): string {
  let hex = '';
  for (let i = 0; i < str.length; i++) {
    hex += '' + str.charCodeAt(i).toString(16);
  }
  return hex.toUpperCase();
}

// Formata a data no estilo: 28-1-2026-3h4m
function getFormattedDate(): string {
  const d = new Date();
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}-${d.getHours()}h${d.getMinutes()}m`;
}

// --- INTERFACES ---

export interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
  footer?: {
    text: string;
  };
  timestamp?: string;
}

export interface DiscordWebhookPayload {
  content?: string;
  embeds?: DiscordEmbed[];
  username?: string;
  avatar_url?: string;
}

// --- FUNÇÃO DE ENVIO (MODERNA & RÁPIDA) ---

export async function sendDiscordWebhook(webhookUrl: string, payload: DiscordWebhookPayload): Promise<void> {
  // Se não tiver link, cancela para não dar erro
  if (!webhookUrl || webhookUrl === "") {
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`[Discord] Erro ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error("[Discord] Falha na conexão (Ignorado):", error);
  }
}

// --- CRIADORES DE EMBEDS (MENSAGENS BONITAS) ---

// 1. Entrada de Jogador (Com Log Completo: IP, Auth, Hex)
export function createPlayerJoinEmbed(player: PlayerObject, roomName: string): DiscordEmbed {
  const playerConnHex = stringToHex(player.conn);
  const dataFormatada = getFormattedDate();

  return {
    title: "🟢 Jogador Entrou",
    color: 0x00FF00, // Verde
    fields: [
      { name: "📝 Info", value: `**Nick:** ${player.name}`, inline: false },
      { name: "Conn (Hex)", value: `\`${playerConnHex}\``, inline: false },
      { name: "Auth", value: `\`${player.auth}\``, inline: false },
      { name: "Ipv4", value: player.conn, inline: true },
      { name: "Data", value: dataFormatada, inline: true },
      { name: "Sala", value: roomName, inline: false }
    ],
    footer: { text: "HaxHost Security Log" },
    timestamp: new Date().toISOString()
  };
}

// 2. Saída de Jogador
export function createPlayerLeaveEmbed(playerName: string, roomName: string): DiscordEmbed {
  return {
    title: "🔴 Jogador Saiu",
    description: `**${playerName}** saiu da sala.`,
    color: 0xFF0000, // Vermelho
    fields: [
      { name: "Sala", value: roomName, inline: true }
    ],
    timestamp: new Date().toISOString()
  };
}

// 3. Resultado de Jogo (Essencial para não quebrar o index.ts)
export function createGameResultEmbed(
  redScore: number,
  blueScore: number,
  redPlayers: string[],
  bluePlayers: string[],
  roomName: string
): DiscordEmbed {
  const winner = redScore > blueScore ? "🔴 Time Vermelho" : "🔵 Time Azul";
  
  return {
    title: "⚽ Resultado da Partida",
    description: `**${winner}** venceu!`,
    color: redScore > blueScore ? 0xFF0000 : 0x0000FF,
    fields: [
      { name: "Placar", value: `🔴 ${redScore} x ${blueScore} 🔵`, inline: false },
      { name: "Time Vermelho", value: redPlayers.join(", ") || "Ninguém", inline: true },
      { name: "Time Azul", value: bluePlayers.join(", ") || "Ninguém", inline: true },
      { name: "Sala", value: roomName, inline: false }
    ],
    timestamp: new Date().toISOString()
  };
}

// 4. Ação de Admin (Kick/Ban)
export function createAdminActionEmbed(
  adminName: string,
  action: string,
  targetPlayer: string,
  reason: string,
  roomName: string
): DiscordEmbed {
  return {
    title: "⚠️ Ação de Admin",
    description: `**${adminName}** executou: ${action}`,
    color: 0xFFA500, // Laranja
    fields: [
      { name: "Alvo", value: targetPlayer, inline: true },
      { name: "Motivo", value: reason || "N/A", inline: true },
      { name: "Sala", value: roomName, inline: false }
    ],
    timestamp: new Date().toISOString()
  };
}
