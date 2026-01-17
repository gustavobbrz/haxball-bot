const express = require("express");

class APIServer {
  constructor(roomManager, configManager, initialConfig) {
    this.app = express();
    this.roomManager = roomManager;
    this.configManager = configManager;
    this.config = initialConfig;

    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(express.json());

    // Middleware de autenticação
    this.app.use((req, res, next) => {
      if (req.path === "/status" || req.path === "/" || req.path === "/health") {
        return next();
      }

      const auth = req.headers.authorization;
      const expectedAuth = `Bearer ${this.config.adminSecret}`;

      if (auth !== expectedAuth) {
        return res.status(403).json({ error: "Acesso negado - Token inválido" });
      }

      next();
    });
  }

  setupRoutes() {
    // Health check
    this.app.get("/health", (req, res) => {
      res.status(200).json({ status: "ok" });
    });

    // Status geral
    this.app.get("/status", (req, res) => {
      try {
        const rooms = this.roomManager.getStatus();
        res.status(200).json({ online: true, rooms });
      } catch (err) {
        res.status(500).json({ online: false, error: err.message });
      }
    });

    // Listar todas as salas
    this.app.get("/rooms", (req, res) => {
      try {
        const rooms = this.config.rooms.map(r => ({
          id: r.id,
          name: r.roomName,
          maxPlayers: r.maxPlayers,
          hasToken: !!(r.token && r.token !== "vazio"),
          online: this.roomManager.getRoom(r.id) !== null
        }));
        res.status(200).json({ rooms });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // Criar/Atualizar sala
    this.app.post("/rooms", (req, res) => {
      try {
        const { id, roomName, maxPlayers, token, public: isPublic, geo } = req.body;

        if (!id) {
          return res.status(400).json({ error: "Campo 'id' é obrigatório" });
        }

        if (!token || token === "vazio") {
          return res.status(400).json({ error: "Token inválido ou vazio" });
        }

        const roomConfig = {
          roomName: roomName || `Futsal #${id}`,
          maxPlayers: maxPlayers || 30,
          public: isPublic !== false,
          geo: geo || { code: "BR" },
          token
        };

        // Atualiza config
        this.configManager.updateRoomConfig(id, roomConfig, this.config);

        // Se já existe, recria. Se não, cria
        if (this.roomManager.getRoom(id)) {
          this.roomManager.recreateRoom(id, roomConfig);
        } else {
          this.roomManager.createRoom(id, roomConfig);
        }

        res.status(200).json({ message: "Sala criada/atualizada com sucesso", id });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // Deletar sala
    this.app.delete("/rooms/:id", (req, res) => {
      try {
        const roomId = parseInt(req.params.id);
        this.roomManager.deleteRoom(roomId);
        this.configManager.deleteRoomConfig(roomId, this.config);
        res.status(200).json({ message: "Sala deletada com sucesso" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // Chat para Discord
    this.app.post("/discord-chat", (req, res) => {
      try {
        const { roomId, author, message } = req.body;
        const room = this.roomManager.getRoom(roomId);

        if (!room) {
          return res.status(404).json({ error: "Sala não encontrada" });
        }

        room.sendAnnouncement(`[💬 Discord] ${author}: ${message}`, null, 0xffff00, "bold", 0);
        res.status(200).json({ status: "ok" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Comandos de admin
    this.app.post("/admin-command", (req, res) => {
      try {
        const { roomId, command } = req.body;
        const room = this.roomManager.getRoom(roomId);

        if (!room) {
          return res.status(404).json({ error: "Sala não encontrada" });
        }

        if (command === "clearbans") {
          try {
            room.clearBans();
            return res.status(200).json({ message: "Banimentos limpos com sucesso" });
          } catch (e) {
            return res.status(500).json({ error: "Erro ao limpar banimentos" });
          }
        }

        if (command === "restart") {
          try {
            const roomConfig = this.configManager.getRoomConfig(roomId, this.config);
            if (roomConfig) {
              this.roomManager.recreateRoom(roomId, roomConfig);
              return res.status(200).json({ message: "Sala reiniciada com sucesso" });
            }
            return res.status(500).json({ error: "Configuração da sala não encontrada" });
          } catch (e) {
            return res.status(500).json({ error: e.message });
          }
        }

        res.status(400).json({ error: "Comando desconhecido" });
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    // 404
    this.app.use((req, res) => {
      res.status(404).json({ error: "Rota não encontrada" });
    });
  }

  start(port) {
    this.app.listen(port, () => {
      console.log(`API rodando na porta ${port}`);
    });
  }

  getApp() {
    return this.app;
  }
}

module.exports = APIServer;
