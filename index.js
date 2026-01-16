// HAXHOSTING UNIVERSAL SCRIPT v1.0
const HaxballJS = require("haxball.js");
const fetch = require("node-fetch");
const express = require("express");
const fs = require("fs");
const FormData = require("form-data");
const { Buffer } = require("buffer");
const path = require("path");

// Carrega .env se existir (apenas para testes locais)
try { require('dotenv').config(); } catch(e) {}

// CONFIGURAÇÕES (VÊM DO PAINEL)
const TOKEN = process.env.HB_TOKEN; 
const ROOM_NAME = process.env.HB_ROOM_NAME || "HaxHosting Server";
const MAX_PLAYERS = parseInt(process.env.HB_MAX_PLAYERS) || 20;
const PUBLIC_ROOM = process.env.HB_PUBLIC !== "false"; 
const ADMIN_PASSWORD = process.env.HB_ADMIN_PASSWORD || "123456";
const GEO = { 
    code: process.env.HB_GEO_CODE || "BR", 
    lat: parseFloat(process.env.HB_GEO_LAT) || -23.5505, 
    lon: parseFloat(process.env.HB_GEO_LON) || -46.6333 
};
const WEB_PORT = process.env.SERVER_PORT || 3000;
const WEBHOOK_CHAT = process.env.HB_WEBHOOK_CHAT;
const WEBHOOK_REPLAY = process.env.HB_WEBHOOK_REPLAY;

// INICIALIZAÇÃO
HaxballJS.then((HBInit) => {
  const room = HBInit({
    roomName: ROOM_NAME,
    maxPlayers: MAX_PLAYERS,
    public: PUBLIC_ROOM,
    noPlayer: true,
    token: TOKEN,
    geo: GEO
  });

  // WEB SERVER (STATUS)
  const app = express();
  app.get("/status", (req, res) => {
      res.json({
          online: true,
          name: ROOM_NAME,
          players: room.getPlayerList().length,
          max: MAX_PLAYERS,
          link: `https://www.haxball.com/play?c=${room.getKey()}`
      });
  });
  app.listen(WEB_PORT, () => console.log(`[HaxHosting] WebServer on port ${WEB_PORT}`));

  // EVENTOS BÁSICOS
  room.onRoomLink = (link) => console.log(`[HaxHosting] Sala: ${link}`);
  room.onPlayerJoin = (p) => room.sendAnnouncement(`Bem-vindo à ${ROOM_NAME}, ${p.name}!`, p.id, 0x00FF00, "bold");
  room.onPlayerChat = (p, m) => {
      if(m.startsWith("!admin ") && m.split(" ")[1] === ADMIN_PASSWORD) {
          room.setPlayerAdmin(p.id, true);
          return false;
      }
      return true;
  };
});