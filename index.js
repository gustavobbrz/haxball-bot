// ===============================================================
// === SCRIPT FUTSAL DO DD 24HRS - VERSÃO EGG + MODERADORES ===
// ===============================================================

const HaxballJS = require("haxball.js");
const fetch = require("node-fetch");
const express = require("express");
const fs = require("fs");
const FormData = require("form-data");
const { Buffer } = require("buffer");
const path = require("path");

// ---------------------------------------------------------------
// CONFIGURAÇÃO GERAL (VIA VARIÁVEIS DO PAINEL)
// ---------------------------------------------------------------
const roomName = process.env.ROOM_NAME || "⚫️🟣 FUTSAL DO REDLEY 24HRS 🟣⚫️";
const maxPlayers = parseInt(process.env.MAX_PLAYERS) || 30;
const roomPublic = process.env.PUBLIC === "false" ? false : true; 
const token = process.env.HAXBALL_TOKEN; 

// === SENHAS E COMANDOS ===
// 1. Senha da Sala
const roomPassword = process.env.ROOM_PASS ? process.env.ROOM_PASS : null;

// 2. Senha de DONO (Admin Supremo)
const adminCommand = process.env.ADMIN_PASS || "!virardono";

// 3. Senhas de MODERADORES (3 Vagas)
const modPasswords = [
    process.env.MOD_PASS_1,
    process.env.MOD_PASS_2,
    process.env.MOD_PASS_3
].filter(pass => pass && pass.trim() !== ""); // Remove vazios

// Geo Location
const geo = { 
    code: process.env.GEO_CODE || "BR", 
    lat: parseFloat(process.env.GEO_LAT) || -23.51634162, 
    lon: parseFloat(process.env.GEO_LON) || -46.6460824 
};

// Webhooks e Portas
const WEBHOOK_PORT = process.env.SERVER_PORT || 3003; 
const STATS_FILE_PATH = "./dd_stats.json"; 
const STATUS_MONITOR_FILE_PATH = path.join(__dirname, "status_dd.json");
const ADMIN_SECRET_KEY = process.env.ADMIN_KEY || "8962926258";

// =================== FOTOS & LINKS ===================
const AVATAR_URL_CHAT = "https://media.discordapp.net/attachments/1374313154099810355/1400601050377097267/1000055589-removebg-preview.png?ex=688d3ae0&is=688be960&hm=5377590134455bd9be60dcae67d680fe0fd80a465677b01b33c0a7445e2ea8f9&=&format=webp&quality=lossless";
const AVATAR_URL_LOGS = AVATAR_URL_CHAT;
const AVATAR_URL_REPLAY = AVATAR_URL_CHAT;

const denunciaWebhookURL = "https://discord.com/api/webhooks/1436113130857173143/VyjHhraGyiFHO0xsGLfksALtD0wdFiyqrfyxFD0pXbAvRmYBXONOXxSAqfyJ0lKeBWHe";
const logWebhookURL = "https://discord.com/api/webhooks/1436111431153090623/1DANzAWymIIbeXfKxvWJQCh8Z6ZmfJKcU46y7IuYdw002M8IozdU5vzKtb7tM6BYBMbQ";
const joinWebhookURL = "https://discord.com/api/webhooks/1436111483770765447/2IBt_fUcUyl0ilCN4bUO-c8HXxGpp7GbMFrUAtlgJQDteIDyb4lYjNVhyGJtKlo0lsTr";
const replayWebhookURL = "https://discord.com/api/webhooks/1436111294217326676/WPz8323y_YSUaA7qZjocFZRZ-qgbiuw_pFiX9hJ_pH9gbSrlKouv11fTciy0rNHLYkyh";
const chatWebhookURL = "https://discord.com/api/webhooks/1436111218187309189/YDaAWS03YfhJIqFjoKPTylAVYwUUxO2cw8YM_L1SISoy63Oi8YTFuc0Agx-0qO0Wuq9J";
const banLogWebhookURL = "https://discord.com/api/webhooks/1436111567753187389/BxgJFuFu84ICVqiEK2Q7QT_UuN9XkpaMUwl3Fi72yojSS0u0ONUdgwGugxZy_nsFvoJs";

const ADMIN_ROLE_ID = "1354583450941784154";
const DONO_ROLE_ID = "1354613511208308776";

// ================= FUNÇÕES DE ESTATÍSTICAS =================
const SsEnumForSave = { WI: 1, LS: 2, DR: 3, GL: 5, AS: 6, CS: 8 };
var stats;

function saveStats() {
  if (!stats) return;
  try {
    const statsObject = {};
    for (let [key, value] of stats.entries()) {
      statsObject[key] = {
        wins: value[SsEnumForSave.WI] || 0,
        losses: value[SsEnumForSave.LS] || 0,
        draws: value[SsEnumForSave.DR] || 0,
        goals: value[SsEnumForSave.GL] || 0,
        assists: value[SsEnumForSave.AS] || 0,
        cleanSheets: value[SsEnumForSave.CS] || 0,
        games: (value[SsEnumForSave.WI] || 0) + (value[SsEnumForSave.LS] || 0) + (value[SsEnumForSave.DR] || 0),
      };
    }
    fs.writeFileSync(STATS_FILE_PATH, JSON.stringify(statsObject, null, 2), "utf8");
  } catch (error) { console.error("[STATS] Erro salvar:", error); }
}

function loadStats() {
  try {
    if (fs.existsSync(STATS_FILE_PATH)) {
      const data = fs.readFileSync(STATS_FILE_PATH, "utf8");
      const statsObject = JSON.parse(data);
      const tempMap = new Map();
      for (let playerName in statsObject) {
        const pStats = statsObject[playerName];
        const statsArray = Array(Object.keys(SsEnumForSave).length + 5).fill(0);
        statsArray[SsEnumForSave.WI] = pStats.wins || 0;
        statsArray[SsEnumForSave.LS] = pStats.losses || 0;
        statsArray[SsEnumForSave.DR] = pStats.draws || 0;
        statsArray[SsEnumForSave.GL] = pStats.goals || 0;
        statsArray[SsEnumForSave.AS] = pStats.assists || 0;
        statsArray[SsEnumForSave.CS] = pStats.cleanSheets || 0;
        tempMap.set(playerName, statsArray);
      }
      stats = tempMap;
      console.log(`[STATS] Carregadas.`);
    } else { 
        console.log("[STATS] Arquivo não encontrado. Criando novo banco de dados na memória."); 
        stats = new Map(); 
    }
  } catch (error) { console.error("[STATS] Erro carregar:", error); }
}

// ---------------------------------------------------------------
// INICIALIZAÇÃO
// ---------------------------------------------------------------
if (!token) {
    console.error("ERRO FATAL: Token não fornecido! Verifique as variaveis do servidor.");
    process.exit(1);
}

HaxballJS().then((HBInit) => {
    const room = HBInit({
      roomName, maxPlayers, public: roomPublic, password: roomPassword, geo, token, noPlayer: true,
      puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true }
    });

    const app = express();
    app.use(express.json());

    // --- ROTAS DO WEBHOOK ---
    app.get("/status", (req, res) => {
      try {
        if (room) {
            const playersList = (room.getPlayerList() || []).filter((p) => p && p.id !== 0);
            return res.status(200).json({ online: true, roomName, players: playersList.length, maxPlayers, uptime: Math.floor(process.uptime()) });
        }
        res.status(500).json({ online: false });
      } catch (err) { res.status(500).json({ online: false }); }
    });

    app.post("/discord-chat", (req, res) => {
      try {
        const { author, message } = req.body;
        if (!author || !message) return res.status(400).send({ error: "Faltando dados" });
        room.sendAnnouncement(`[💬 Discord (DD)] ${author}: ${message}`, null, 0xffff00, "bold", 0);
        res.status(200).send({ status: "ok" });
      } catch (error) { res.status(500).send({ error: "Erro interno" }); }
    });

    app.post("/admin-command", (req, res) => {
      const { authorization } = req.headers;
      const { command, author } = req.body;
      if (authorization !== `Bearer ${ADMIN_SECRET_KEY}`) return res.status(403).send({ error: "Acesso negado" });
      if (command === "clearbans") {
          room.clearBans();
          bannedPlayers.clear();
          const clearMsg = `🧹 Todos os bans foram removidos por um admin via Discord (${author}).`;
          room.sendAnnouncement(clearMsg, null, 0x00ff00, "bold");
          sendToWebhook(banLogWebhookURL, "Sistema de Punições", `\`\`\`${clearMsg}\`\`\``, AVATAR_URL_LOGS);
          res.status(200).send({ message: "Sucesso" });
      } else res.status(400).send({ error: "Comando desconhecido" });
    });

    app.listen(WEBHOOK_PORT, () => console.log(`[DD] Servidor rodando na porta ${WEBHOOK_PORT}`));

    const Team = { SPECTATORS: 0, RED: 1, BLUE: 2 };
    const Ss = SsEnumForSave;
    
    loadStats();
    if (!stats) stats = new Map();

    var gameOcorring = false;
    var officialAdms = [];
    var lastPlayersTouched = [null, null];
    var playersConn = {};
    var reiniColor = [];
    let prefixTeamChatStringss = "t ";

    let lastScores = null;
    let Rposs = 0; let Bposs = 0;
    let gameRecording = { active: false };
    let redPlayers = []; let bluePlayers = [];
    let bannedPlayers = new Map();
    let currentRoomLink = null;

    room.setTeamsLock(true);

    function initPlayerStats(player) {
      if (!stats.has(player.name)) stats.set(player.name, Array(Object.keys(Ss).length + 5).fill(0));
    }

    async function sendToWebhook(url, username, content, avatarUrl) {
      if (!content || content.trim() === "") return Promise.resolve();
      const payload = { username, content, avatar_url: avatarUrl };
      return fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }).catch((error) => console.error(`Erro Webhook:`, error));
    }

    function getDate() {
      let d = new Date();
      return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}-${d.getHours()}h${d.getMinutes()}m`;
    }
    function customTime(time) {
      const totalSeconds = Math.trunc(time);
      return `${Math.floor(totalSeconds / 60)}m${String(totalSeconds % 60).padStart(2, "0")}s`;
    }
    function startRecording() {
      if (gameRecording.active) return;
      try { room.startRecording(); gameRecording.active = true; } catch (e) { console.error("Erro rec:", e); }
    }
    async function sendReplayToDiscord() {
      if (!gameRecording.active) return;
      const replayData = room.stopRecording();
      gameRecording.active = false;
      if (!replayData || replayData.byteLength < 50) return;
      const sc = lastScores || room.getScores() || { red: 0, blue: 0, time: 0 };
      const fileName = `Replay-${getDate()}.hbr2`;
      const rP = (Rposs + Bposs > 0) ? ((Rposs / (Rposs+Bposs)) * 100).toFixed(1) : "0.0";
      const bP = (Rposs + Bposs > 0) ? ((Bposs / (Rposs+Bposs)) * 100).toFixed(1) : "0.0";
      const payload_json = JSON.stringify({
        username: "📹 REPLAY DA PARTIDA", avatar_url: AVATAR_URL_REPLAY, content: "A gravação da partida foi finalizada!",
        embeds: [{
            color: 0x2b2d31, title: roomName, description: "Estatísticas detalhadas:", footer: { text: `Partida de ${getDate()}` },
            fields: [
              { name: `🔴 Time Vermelho`, value: `**Pontuação:** ${sc.red}\n**Jogadores:**\n${redPlayers.join("\n") || "Nenhum"}`, inline: true },
              { name: "⚔️ VS ⚔️", value: "\u200B", inline: true },
              { name: `🔵 Time Azul`, value: `**Pontuação:** ${sc.blue}\n**Jogadores:**\n${bluePlayers.join("\n") || "Nenhum"}`, inline: true },
              { name: "⏱️ Tempo", value: `\`${customTime(sc.time)}\``, inline: true },
              { name: "📊 Posse", value: `\`\`\`diff\n+ Vermelho: ${rP}%\n- Azul: ${bP}%\`\`\``, inline: true },
            ]
        }]
      });
      const form = new FormData();
      form.append("payload_json", payload_json);
      form.append("file", Buffer.from(replayData), { filename: fileName, contentType: "application/octet-stream" });
      try { await fetch(replayWebhookURL, { method: "POST", body: form }); } catch (error) { console.error("Erro replay:", error); }
    }

    room.onRoomLink = function (link) {
      console.log(`✅ SALA ONLINE (DD) | Link: ${link}`);
      console.log(`🔐 Senha Sala: ${roomPassword ? "ATIVA" : "PÚBLICA"} | 👑 Dono: ${adminCommand}`);
      console.log(`🛡️ Moderadores configurados: ${modPasswords.length}`);
      room.setDefaultStadium("Big"); room.setTimeLimit(3); room.setScoreLimit(3); currentRoomLink = link;
      setInterval(() => { try { const players = room.getPlayerList().filter((p) => p.id !== 0); fs.writeFileSync(STATUS_MONITOR_FILE_PATH, JSON.stringify({ playerCount: players.length, maxPlayers, roomLink: currentRoomLink, lastUpdate: new Date().toISOString() }, null, 2)); } catch (e) {} }, 15000);
    };

    room.onPlayerJoin = function (player) {
      console.log(`Entrou: ${player.name}`);
      initPlayerStats(player);
      playersConn[player.name] = player.conn;
      if (room.getPlayerList().filter((p) => p.id !== 0).length === 1) room.setPlayerAdmin(player.id, true);
      room.sendAnnouncement(`👋🏼 Bem-vindo(a) à arena ${roomName}, ${player.name}!`, player.id, 0x00ff00, "bold", 1);
      let ipv4 = "N/A";
      try { ipv4 = player.conn.match(/.{1,2}/g)?.map((v) => String.fromCharCode(parseInt(v, 16))).join("") || "Error"; } catch (e) {}
      const msg = "```" + `📝Info\nNick: ${player.name}\nConn: ${player.conn}\nAuth: ${player.auth}\nIpv4: ${ipv4}\nData: ${getDate()}` + "```";
      sendToWebhook(joinWebhookURL, "Logs de Entrada", msg, AVATAR_URL_LOGS);
      setTimeout(() => { room.sendAnnouncement("🤖 Este servidor usa um bot desenvolvido por Billy. Qualquer bug, chame no Discord: @backsidekickflip", player.id, 0x00ffff, "normal", 0); }, 5000);
    };

    room.onPlayerLeave = function (player) {
      console.log(`Saiu: ${player.name}`);
      room.sendAnnouncement(`👋 O jogador ${player.name} saiu da sala.`, null, 0xffd700, "normal", 0);
      delete playersConn[player.name];
      if (officialAdms.includes(player.name)) officialAdms.splice(officialAdms.indexOf(player.name), 1);
      if (reiniColor.includes(player.name)) reiniColor.splice(reiniColor.indexOf(player.name), 1);
    };

    room.onPlayerTeamChange = function (changedPlayer, byPlayer) {
      if (changedPlayer.team === Team.RED) room.sendAnnouncement(`🔴 ${changedPlayer.name} entrou para o time Vermelho.`, null, 0xffd700, "normal", 0);
      else if (changedPlayer.team === Team.BLUE) room.sendAnnouncement(`🔵 ${changedPlayer.name} entrou para o time Azul.`, null, 0xffd700, "normal", 0);
      else room.sendAnnouncement(`⚪ ${changedPlayer.name} foi para os espectadores.`, null, 0xffd700, "normal", 0);
    };

    room.onPlayerKicked = function (kickedPlayer, reason, byPlayer) {
      if (reason === "Saiu da sala a pedido.") return;
      room.sendAnnouncement(`👢 O jogador ${kickedPlayer.name} foi expulso da sala por ${byPlayer.name}. Motivo: ${reason}`, null, 0xff0000, "bold", 0);
    };

    room.onPlayerChat = function (player, message) {
      message = message.trim();
      console.log(`${player.name}: ${message}`);

      // === COMANDOS PÚBLICOS ===
      if (message === "!ajuda" || message === "!comandos") {
        const help = "📜 COMANDOS DE JOGADOR 📜\n!discord » Link do nosso servidor.\n!sair ou !bb » Sai da sala.\n!denunciar <nick> [motivo]\n!troll <nick> [motivo]";
        room.sendAnnouncement(help, player.id, 0xffffff, "normal", 0);
        if (player.admin) setTimeout(() => room.sendAnnouncement("⭐ Você é admin! Use !ajudaadmin para ver seus comandos.", player.id, 0xffcc00), 100);
        return false;
      }
      if (message === "!ajudaadmin" && player.admin) {
        const admHelp = "--- COMANDOS DE ADMIN ---\n!rr » Reinicia.\n!trocarlado » Troca times.\n!ban #ID [motivo] » Ban.\n!unban <nick> » Unban.\n!limpar » Limpa bans.\n!puxarbola ou !pb » Puxa a bola.";
        room.sendAnnouncement(admHelp, player.id, 0xffcc00, "normal", 0);
        return false;
      }
      if (message === "!discord") {
        room.sendAnnouncement("🔗 Entre no nosso Discord: https://discord.gg/ApkbpMSdTa", player.id, 0x7289da, "bold", 1);
        return false;
      }
      if (message === "!bb" || message === "!sair") {
        room.kickPlayer(player.id, "Saiu da sala a pedido.", false);
        return false;
      }
      if (message.startsWith("!denunciar ") || message.startsWith("!troll ")) {
        const parts = message.split(" ");
        const cmd = parts[0];
        const target = parts[1];
        if (!target) { room.sendAnnouncement(`Uso: ${cmd} <nick> [motivo]`, player.id, 0xffcc00); return false; }
        const reason = parts.slice(2).join(" ") || "Não especificado";
        const tPlayer = room.getPlayerList().find(p => p.name.toLowerCase().includes(target.toLowerCase()));
        if (!tPlayer) { room.sendAnnouncement(`Jogador "${target}" não encontrado.`, player.id, 0xffcc00); return false; }
        const type = cmd === "!denunciar" ? "🚨 DENÚNCIA" : "🤡 TROLL";
        const msg = `${type} de **${player.name}** contra **${tPlayer.name}**.\n**Motivo:** ${reason}\n\n<@&${ADMIN_ROLE_ID}> <@&${DONO_ROLE_ID}>`;
        sendToWebhook(denunciaWebhookURL, "Denúncias", msg, AVATAR_URL_LOGS);
        room.sendAnnouncement(`✅ Sua denúncia contra ${tPlayer.name} foi enviada.`, player.id, 0x00ff00, "bold", 0);
        return false;
      }

      // === LOGIN DONO ===
      if (message === adminCommand) {
        if (!officialAdms.includes(player.name)) officialAdms.push(player.name);
        if (!reiniColor.includes(player.name)) reiniColor.push(player.name);
        room.setPlayerAdmin(player.id, true);
        room.sendAnnouncement(`👑 ${player.name}, Fundador autenticado!`, null, 0xffd700, "bold", 2);
        sendToWebhook(logWebhookURL, "Logs Admin", "```" + `[👑] [FUNDADOR] ${player.name} logou (Painel).` + "```", AVATAR_URL_LOGS);
        return false;
      } 
      
      // === LOGIN MODERADORES (3 SLOTS) ===
      if (modPasswords.includes(message)) {
        room.setPlayerAdmin(player.id, true);
        room.sendAnnouncement(`🛡️ ${player.name}, Moderador autenticado!`, null, 0x00bfff, "bold", 2);
        sendToWebhook(logWebhookURL, "Logs Admin", "```" + `[🛡️] [MODERADOR] ${player.name} logou usando senha de mod.` + "```", AVATAR_URL_LOGS);
        return false;
      }

      if (message.startsWith(prefixTeamChatStringss)) {
        const tMsg = message.substring(prefixTeamChatStringss.length).trim();
        if (player.team !== 0 && tMsg.length > 0) {
          const color = player.team === 1 ? 0xff4c4c : 0x4c9dff;
          const prefix = player.team === 1 ? "[Time 🔴]" : "[Time 🔵]";
          room.getPlayerList().filter(p => p.team === player.team).forEach(p => { room.sendAnnouncement(`${prefix} ${player.name}: ${tMsg}`, p.id, color, "normal", 0); });
        }
        return false;
      }

      // === COMANDOS DE ADMIN (PARA DONO E MODS) ===
      if (player.admin) {
        if (message === "!trocarlado") {
          const all = room.getPlayerList();
          const r = all.filter(p => p.team === 1); const b = all.filter(p => p.team === 2);
          if (r.length === 0 && b.length === 0) { room.sendAnnouncement("Sem jogadores.", player.id, 0xffcc00); return false; }
          r.forEach(p => room.setPlayerTeam(p.id, 2)); b.forEach(p => room.setPlayerTeam(p.id, 1));
          room.sendAnnouncement(`🔄 Times trocados por ${player.name}!`, null, 0x00ff00, "bold", 1);
          return false;
        }
        if (message === "!rr") { room.stopGame(); setTimeout(() => room.startGame(), 100); return false; }
        if (message.startsWith("!ban ")) {
          const tid = parseInt(message.split(" ")[1].replace("#", ""));
          const tp = room.getPlayer(tid);
          if (tp) {
            const r = message.split(" ").slice(2).join(" ") || "Banido por admin";
            bannedPlayers.set(tp.conn, { name: tp.name, banTime: Date.now() });
            room.kickPlayer(tp.id, r, true);
            const bm = `⛔ ${tp.name} banido por ${player.name}. Motivo: ${r}`;
            room.sendAnnouncement(bm, null, 0xff0000, "bold");
            sendToWebhook(banLogWebhookURL, "Punições", `\`\`\`${bm}\`\`\``, AVATAR_URL_LOGS);
          } else room.sendAnnouncement("Jogador não encontrado.", player.id, 0xffcc00);
          return false;
        }
        if (message.startsWith("!unban ")) {
          const tname = message.split(" ").slice(1).join(" ");
          let fConn = null;
          for (const [c, b] of bannedPlayers.entries()) { if (b.name.toLowerCase() === tname.toLowerCase()) { fConn = c; break; } }
          if (fConn) {
            bannedPlayers.delete(fConn); room.clearBan(fConn);
            const ubm = `✅ ${tname} desbanido por ${player.name}.`;
            room.sendAnnouncement(ubm, null, 0x00ff00, "bold");
            sendToWebhook(banLogWebhookURL, "Punições", `\`\`\`${ubm}\`\`\``, AVATAR_URL_LOGS);
          } else room.sendAnnouncement(`"${tname}" não encontrado.`, player.id, 0xffcc00);
          return false;
        }
        if (message === "!limpar") {
          room.clearBans(); bannedPlayers.clear();
          const cm = `🧹 Bans limpos por ${player.name}.`;
          room.sendAnnouncement(cm, null, 0x00ff00, "bold");
          sendToWebhook(banLogWebhookURL, "Punições", `\`\`\`${cm}\`\`\``, AVATAR_URL_LOGS);
          return false;
        }
        if (message === "!puxarbola" || message === "!pb") {
          if (player.position) { room.setDiscProperties(0, { x: player.position.x, y: player.position.y, xspeed: 0, yspeed: 0 }); room.sendAnnouncement("⚽ Bola puxada!", player.id, 0x00ff00, "bold", 0); }
          return false;
        }
      }

      if (!message.startsWith("!")) {
        let dm = `[${player.team === 1 ? "🔴" : (player.team === 2 ? "🔵" : "⚪ Spec")}] **${player.name}**: ${message}`;
        sendToWebhook(chatWebhookURL, "Chat In-Game", dm, AVATAR_URL_CHAT);
      }
      if (reiniColor.includes(player.name)) { room.sendAnnouncement(`[👑] ${player.name}: ${message}`, undefined, 0xff0000, "bold"); return false; }
      return true;
    };

    room.onGameStart = function (by) {
      gameOcorring = true; Rposs = 0; Bposs = 0; lastPlayersTouched = [null, null]; lastScores = null;
      redPlayers = room.getPlayerList().filter(p => p.team === 1).map(p => p.name); bluePlayers = room.getPlayerList().filter(p => p.team === 2).map(p => p.name);
      startRecording();
    };
    room.onGameStop = function (by) {
      gameOcorring = false; lastScores = room.getScores(); sendReplayToDiscord();
      if (!by && lastScores && lastScores.time > 0) {
        if (lastScores.red === lastScores.blue) room.sendAnnouncement(`🤝 FIM DE JOGO! Empate em ${lastScores.red} a ${lastScores.blue}!`, null, 0xffd700, "bold", 2);
        else { const w = lastScores.red > lastScores.blue ? "Time Vermelho 🔴" : "Time Azul 🔵"; room.sendAnnouncement(`🏆 FIM DE JOGO! Vitória do ${w} por ${lastScores.red} a ${lastScores.blue}!`, null, 0xffd700, "bold", 2); }
      }
    };
});
