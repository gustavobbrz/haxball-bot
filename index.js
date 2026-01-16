const HaxballJS = require("haxball.js");
const express = require("express");
const fs = require("fs");
const path = require("path");

let config;
try { config = require("./config.json"); } catch (e) { console.error("Missing config.json - copy config.json.example to config.json and fill tokens."); process.exit(1); }

const carregarLogicaFutsal = require("./src/futsal.js");

const app = express();
app.use(express.json());

const roomsMap = new Map();

async function main() {
  const HBInit = await HaxballJS();

  for (const rcfg of (config.rooms || [])) {
    if (!rcfg.token || rcfg.token === "vazio") {
      console.log(`[ROOM ${rcfg.id}] Pulada: Sem token.`);
      continue;
    }

    const room = HBInit({
      roomName: rcfg.roomName || `Futsal #${rcfg.id}`,
      maxPlayers: rcfg.maxPlayers || 30,
      public: rcfg.public !== false,
      geo: rcfg.geo || undefined,
      token: rcfg.token,
      noPlayer: true,
      puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true }
    });

    roomsMap.set(rcfg.id, room);
    carregarLogicaFutsal(room, rcfg.id, config);

    room.onRoomLink = (link) => console.log(`[ROOM ${rcfg.id}] ONLINE: ${link}`);
  }

  app.get("/status", (req, res) => {
    try {
      const out = [];
      roomsMap.forEach((room, id) => {
        const players = (room.getPlayerList() || []).filter(p => p && p.id !== 0);
        out.push({ id, players: players.length });
      });
      res.status(200).json({ online: true, rooms: out });
    } catch (err) { res.status(500).json({ online: false }); }
  });

  app.post("/discord-chat", (req, res) => {
    try {
      const { roomId, author, message } = req.body;
      const room = roomsMap.get(roomId);
      if (!room) return res.status(404).send({ error: "Sala não encontrada" });
      room.sendAnnouncement(`[💬 Discord] ${author}: ${message}`, null, 0xffff00, "bold", 0);
      res.status(200).send({ status: "ok" });
    } catch (error) { res.status(500).send({ error: "Erro interno" }); }
  });

  app.post("/admin-command", (req, res) => {
    try {
      const auth = req.headers.authorization;
      if (auth !== `Bearer ${config.adminSecret}`) return res.status(403).send({ error: "Acesso negado" });
      const { roomId, command } = req.body;
      const room = roomsMap.get(roomId);
      if (!room) return res.status(404).send({ error: "Sala não encontrada" });

      if (command === "clearbans") {
        try { room.clearBans(); } catch (e) {}
        return res.status(200).send({ message: "Sucesso" });
      }
      res.status(400).send({ error: "Comando desconhecido" });
    } catch (e) { res.status(500).send({ error: "Erro" }); }
  });

  const port = config.port || 3002;
  app.listen(port, () => console.log(`API rodando na porta ${port}`));
}

main().catch(err => { console.error(err); process.exit(1); });
