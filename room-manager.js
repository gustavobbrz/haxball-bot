const HaxballJS = require("haxball.js");
const carregarLogicaFutsal = require("./src/futsal.js");

class RoomManager {
  constructor(config) {
    this.config = config;
    this.rooms = new Map();
    this.hbInit = null;
  }

  async initialize() {
    this.hbInit = await HaxballJS();
  }

  async createRoom(roomId, roomConfig) {
    if (this.rooms.has(roomId)) {
      console.log(`[ROOM ${roomId}] Já existe`);
      return null;
    }

    if (!roomConfig.token || roomConfig.token === "vazio" || !roomConfig.token.trim()) {
      console.log(`[ROOM ${roomId}] Pulada: Sem token válido`);
      return null;
    }

    try {
      const room = this.hbInit({
        roomName: roomConfig.roomName || `Futsal #${roomId}`,
        maxPlayers: roomConfig.maxPlayers || 30,
        public: roomConfig.public !== false,
        geo: roomConfig.geo || undefined,
        token: roomConfig.token,
        noPlayer: true,
        puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true }
      });

      this.rooms.set(roomId, room);

      // Carrega lógica do futsal
      carregarLogicaFutsal(room, roomId, this.config);

      room.onRoomLink = (link) => {
        console.log(`[ROOM ${roomId}] ONLINE: ${link}`);
      };

      return room;
    } catch (error) {
      console.error(`[ROOM ${roomId}] Erro ao criar: ${error.message}`);
      return null;
    }
  }

  async deleteRoom(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    try {
      if (room.disconnect) {
        room.disconnect();
      }
      this.rooms.delete(roomId);
      console.log(`[ROOM ${roomId}] Deletada`);
      return true;
    } catch (error) {
      console.error(`[ROOM ${roomId}] Erro ao deletar: ${error.message}`);
      return false;
    }
  }

  getRoom(roomId) {
    return this.rooms.get(roomId) || null;
  }

  getStatus() {
    const out = [];
    this.rooms.forEach((room, id) => {
      try {
        const players = (room.getPlayerList() || []).filter(p => p && p.id !== 0);
        out.push({
          id,
          players: players.length,
          status: "online"
        });
      } catch (e) {
        out.push({ id, players: 0, status: "error" });
      }
    });
    return out;
  }

  getAllRooms() {
    return Array.from(this.rooms.values());
  }

  async recreateRoom(roomId, newConfig) {
    await this.deleteRoom(roomId);
    return this.createRoom(roomId, newConfig);
  }
}

module.exports = RoomManager;
