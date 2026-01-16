<<<<<<< HEAD
const HaxballJS = require("haxball.js");
const config = require('./config.json');
const carregarLogicaFutsal = require('./src/futsal.js');

async function iniciarSala(id, token, nome, mapa) {
  if (!token || token === "" || token === "vazio") {
    console.log(`[SALA ${id}] Pulada: Sem token no painel.`);
    return;
  }

  const HBInit = await HaxballJS();
  const room = HBInit({
    roomName: nome || `Futsal do Billy #${id}`,
    token: token,
    public: true,
    noPlayer: true,
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true }
  });

  room.onRoomLink = (link) => console.log(`[SALA ${id}] ONLINE: ${link}`);

  // Carrega toda a lógica (Comandos, Webhooks, Juiz) do seu bot antigo
  carregarLogicaFutsal(room, id, config);

  if (mapa && mapa.trim() !== "") {
    try {
      room.setCustomStadium(mapa);
      console.log(`[SALA ${id}] Arena personalizada aplicada.`);
    } catch (e) {
      console.error(`[SALA ${id}] Erro ao carregar mapa: ${e.message}`);
    }
  }
}

// Inicia as duas salas configuradas no Pterodactyl
iniciarSala(1, config.sala1_token, config.sala1_nome, config.sala1_mapa);
=======
const HaxballJS = require("haxball.js");
const config = require('./config.json');
const carregarLogicaFutsal = require('./src/futsal.js');

async function iniciarSala(id, token, nome, mapa) {
  if (!token || token === "" || token === "vazio") {
    console.log(`[SALA ${id}] Pulada: Sem token no painel.`);
    return;
  }

  const HBInit = await HaxballJS();
  const room = HBInit({
    roomName: nome || `Futsal do Billy #${id}`,
    token: token,
    public: true,
    noPlayer: true,
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true }
  });

  room.onRoomLink = (link) => console.log(`[SALA ${id}] ONLINE: ${link}`);

  // Carrega toda a lógica (Comandos, Webhooks, Juiz) do seu bot antigo
  carregarLogicaFutsal(room, id, config);

  if (mapa && mapa.trim() !== "") {
    try {
      room.setCustomStadium(mapa);
      console.log(`[SALA ${id}] Arena personalizada aplicada.`);
    } catch (e) {
      console.error(`[SALA ${id}] Erro ao carregar mapa: ${e.message}`);
    }
  }
}

// Inicia as duas salas configuradas no Pterodactyl
iniciarSala(1, config.sala1_token, config.sala1_nome, config.sala1_mapa);
>>>>>>> fd5a9074e104487ef4960c56bbba10020d0ae2cf
iniciarSala(2, config.sala2_token, config.sala2_nome, config.sala2_mapa);