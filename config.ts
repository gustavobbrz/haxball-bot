export interface RoomConfig {
  roomName: string;
  maxPlayers: number;
  scoreLimit: number;
  timeLimit: number;
  discordLink: string;
  port: number;
  geo: {
    code: string;
    lat: number;
    lon: number;
  };
  webhooks: {
    join: string;
    leave: string;
    game: string;
    admin: string;
    denuncias: string;
    chat: string;
  };
  roomType: 'x1' | 'x3-nivel' | 'x3-noobs' | 'x4';
}

export const roomConfigs: Record<string, RoomConfig> = {
  'x3-nivel': {
    roomName: "🥦 HAXHOST | FUTSAL X3 | NÍVEL 🥦",
    maxPlayers: 30,
    scoreLimit: 3,
    timeLimit: 3,
    discordLink: "https://discord.gg/vHwf9s7U6F",
    port: 3000,
    geo: { code: "BR", lat: -23.5475, lon: -46.6361 }, // SP Data Center
    webhooks: {
      join: process.env.WEBHOOK_X3_NIVEL_JOIN || "",
      leave: process.env.WEBHOOK_X3_NIVEL_LEAVE || "",
      game: process.env.WEBHOOK_X3_NIVEL_GAME || "",
      admin: process.env.WEBHOOK_X3_NIVEL_ADMIN || "",
      denuncias: process.env.WEBHOOK_X3_NIVEL_DENUNCIAS || "",
      chat: process.env.WEBHOOK_X3_NIVEL_CHAT || ""
    },
    roomType: 'x3-nivel'
  },
  'x3-noobs': {
    roomName: "🥦 HAXHOST | FUTSAL X3 | NOOBS 🥦",
    maxPlayers: 30,
    scoreLimit: 3,
    timeLimit: 3,
    discordLink: "https://discord.gg/vHwf9s7U6F",
    port: 3001,
    geo: { code: "BR", lat: -23.5475, lon: -46.6361 }, // SP Data Center
    webhooks: {
      join: process.env.WEBHOOK_X3_NOOBS_JOIN || "",
      leave: process.env.WEBHOOK_X3_NOOBS_LEAVE || "",
      game: process.env.WEBHOOK_X3_NOOBS_GAME || "",
      admin: process.env.WEBHOOK_X3_NOOBS_ADMIN || "",
      denuncias: process.env.WEBHOOK_X3_NOOBS_DENUNCIAS || "",
      chat: process.env.WEBHOOK_X3_NOOBS_CHAT || ""
    },
    roomType: 'x3-noobs'
  },
  'x1': {
    roomName: "🥦 HAXHOST | FUTSAL X1 | 🥦",
    maxPlayers: 20,
    scoreLimit: 3,
    timeLimit: 3,
    discordLink: "https://discord.gg/vHwf9s7U6F",
    port: 3002,
    geo: { code: "BR", lat: -23.5475, lon: -46.6361 }, // SP Data Center
    webhooks: {
      join: process.env.WEBHOOK_X1_JOIN || "",
      leave: process.env.WEBHOOK_X1_LEAVE || "",
      game: process.env.WEBHOOK_X1_GAME || "",
      admin: process.env.WEBHOOK_X1_ADMIN || "",
      denuncias: process.env.WEBHOOK_X1_DENUNCIAS || "",
      chat: process.env.WEBHOOK_X1_CHAT || ""
    },
    roomType: 'x1'
  },
  'x4': {
    roomName: "🥦 HAXHOST | FUTSAL X4 | 🥦",
    maxPlayers: 22,
    scoreLimit: 3,
    timeLimit: 5,
    discordLink: "https://discord.gg/vHwf9s7U6F",
    port: 3003,
    geo: { code: "BR", lat: -23.5475, lon: -46.6361 }, // SP Data Center
    webhooks: {
      join: process.env.WEBHOOK_X4_JOIN || "",
      leave: process.env.WEBHOOK_X4_LEAVE || "",
      game: process.env.WEBHOOK_X4_GAME || "",
      admin: process.env.WEBHOOK_X4_ADMIN || "",
      denuncias: process.env.WEBHOOK_X4_DENUNCIAS || "",
      chat: process.env.WEBHOOK_X4_CHAT || ""
    },
    roomType: 'x4'
  }
};

// ==========================================================
// NÃO ESQUEÇA DE COPIAR ESSA PARTE FINAL AQUI EMBAIXO !!!
// É ELA QUE ARRUMA O SEU ERRO!
// ==========================================================
export function getRoomConfig(): RoomConfig {
  const args = process.argv.slice(2);
  
  // Tenta achar a sala pelos argumentos (ex: npm start x4)
  for (const arg of args) {
    if (roomConfigs[arg]) {
      return roomConfigs[arg];
    }
  }

  // Tenta achar pela variável de ambiente do Pterodactyl
  if (process.env.ROOM_TYPE && roomConfigs[process.env.ROOM_TYPE]) {
    return roomConfigs[process.env.ROOM_TYPE];
  }

  // Se não achar nada, usa x1 pra não crashar
  console.log("⚠️ Nenhuma sala especificada. Usando X1 como padrão.");
  return roomConfigs['x1'];
}
