// ===============================================================
// === SCRIPT MULTI-SALA - VERSÃO CORRIGIDA (ADMIN SEPARADO) ===
// ===============================================================

const HaxballJS = require("haxball.js");
const fetch = require("node-fetch");
const express = require("express");
const fs = require("fs");
const FormData = require("form-data");
const { Buffer } = require("buffer");
const path = require("path");

// ---------------------------------------------------------------
// CONFIGURAÇÃO GLOBAL (Webhooks e Senhas Compartilhadas)
// ---------------------------------------------------------------
const STATS_FILE_PATH = path.join(__dirname, "dd_stats.json");
const STATUS_MONITOR_FILE_PATH = path.join(__dirname, "status_dd.json");
const WEBHOOK_PORT = process.env.SERVER_PORT || 8000;
const ADMIN_SECRET_KEY = process.env.ADMIN_KEY || "8962926258";

// Senhas de MOD (Essas continuam globais, funcionam em ambas as salas)
const modPasswords = [
    process.env.MOD_PASS_1,
    process.env.MOD_PASS_2,
    process.env.MOD_PASS_3
].filter(pass => pass && pass.trim() !== "");

// Webhooks
const AVATAR_URL_CHAT = "https://media.discordapp.net/attachments/1374313154099810355/1400601050377097267/1000055589-removebg-preview.png";
const AVATAR_URL_LOGS = AVATAR_URL_CHAT;
const AVATAR_URL_REPLAY = AVATAR_URL_CHAT;

const denunciaWebhookURL = process.env.WH_DENUNCIA || "";
const logWebhookURL = process.env.WH_LOGS || "";
const joinWebhookURL = process.env.WH_JOIN || "";
const replayWebhookURL = process.env.WH_REPLAY || "";
const chatWebhookURL = process.env.WH_CHAT || "";
const banLogWebhookURL = process.env.WH_BAN || "";
const ADMIN_ROLE_ID = "1354583450941784154";

// Lista global de salas ativas
const activeRooms = [];

// ================= FUNÇÕES DE ESTATÍSTICAS (COMPARTILHADAS) =================
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
            };
        }
        fs.writeFileSync(STATS_FILE_PATH, JSON.stringify(statsObject, null, 2), "utf8");
    } catch (error) { console.error("[STATS] Erro salvar:", error.message); }
}

function loadStats() {
    try {
        if (fs.existsSync(STATS_FILE_PATH)) {
            const data = fs.readFileSync(STATS_FILE_PATH, "utf8");
            const statsObject = JSON.parse(data);
            const tempMap = new Map();
            for (let playerName in statsObject) {
                const pStats = statsObject[playerName];
                const statsArray = Array(20).fill(0);
                statsArray[SsEnumForSave.WI] = pStats.wins || 0;
                statsArray[SsEnumForSave.LS] = pStats.losses || 0;
                statsArray[SsEnumForSave.DR] = pStats.draws || 0;
                statsArray[SsEnumForSave.GL] = pStats.goals || 0;
                statsArray[SsEnumForSave.AS] = pStats.assists || 0;
                statsArray[SsEnumForSave.CS] = pStats.cleanSheets || 0;
                tempMap.set(playerName, statsArray);
            }
            stats = tempMap;
            console.log(`[STATS] Carregadas com sucesso.`);
        } else {
            console.log("[STATS] Arquivo novo criado.");
            stats = new Map();
            saveStats();
        }
    } catch (error) { console.error("[STATS] Erro carregar:", error.message); stats = new Map(); }
}
loadStats();

// ===============================================================
// 🏭 FÁBRICA DE BOT (Lógica da Sala)
// ===============================================================
// ATUALIZADO: Agora aceita configAdminPass e configRoomPass como argumentos
async function iniciarBot(configToken, configName, configMaxPlayers, configPublic, configAdminPass, configRoomPass, isSecondary = false) {
    
    // 1. Verificação de Segurança
    if (!configToken || configToken.trim() === "") {
        if (isSecondary) console.log(`[INFO] Sala Secundária não configurada. Ignorando...`);
        else console.error(`[ERRO] Token da Sala Principal ausente! Verifique o Painel.`);
        return;
    }

    // Configurações Locais
    const roomName = configName || "🏆 SALA DE FUTSAL 🏆";
    const maxPlayers = parseInt(configMaxPlayers) || 20;
    const isPublic = configPublic === "false" ? false : true;
    
    // Define a senha de admin local desta sala (padrão !virardono se não tiver config)
    const localAdminCommand = configAdminPass || "!virardono";
    
    // Define a senha da sala local (null se vazio)
    const localRoomPassword = configRoomPass ? configRoomPass : null;

    // Geo Location
    const geo = {
        code: process.env.GEO_CODE || "BR",
        lat: parseFloat(process.env.GEO_LAT) || -23.51,
        lon: parseFloat(process.env.GEO_LON) || -46.64
    };

    console.log(`🚀 Iniciando: ${roomName}...`);

    HaxballJS().then((HBInit) => {
        const room = HBInit({
            roomName: roomName,
            maxPlayers: maxPlayers,
            public: isPublic,
            password: localRoomPassword, // USA A SENHA ESPECÍFICA DA SALA
            geo: geo,
            token: configToken,
            noPlayer: true,
            puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'], headless: true }
        });

        activeRooms.push(room);

        // ================= VARIAVEIS LOCAIS =================
        const Team = { SPECTATORS: 0, RED: 1, BLUE: 2 };
        let gameOcorring = false;
        let officialAdms = [];
        let playersConn = {};
        let reiniColor = [];
        let prefixTeamChatStringss = "t ";
        let lastScores = null;
        let Rposs = 0; let Bposs = 0;
        let gameRecording = { active: false };
        let redPlayers = []; let bluePlayers = [];
        let bannedPlayers = new Map();
        let currentRoomLink = null;

        room.setTeamsLock(true);

        // ================= HELPER FUNCTIONS =================
        function initPlayerStats(player) {
            if (!stats.has(player.name)) stats.set(player.name, Array(20).fill(0));
        }

        async function sendToWebhook(url, username, content, avatarUrl) {
            if (!url || !url.startsWith("http")) return;
            if (!content || content.trim() === "") return;
            const finalUsername = `${username} | ${isSecondary ? 'Sala 2' : 'Sala 1'}`;
            const payload = { username: finalUsername, content, avatar_url: avatarUrl };
            try {
                await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
            } catch (error) { console.error(`Erro Webhook:`, error.message); }
        }

        function getDate() {
            let d = new Date();
            return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()} ${d.getHours()}h${d.getMinutes()}m`;
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
            if (!replayWebhookURL || !replayWebhookURL.startsWith("http")) return;

            const sc = lastScores || room.getScores() || { red: 0, blue: 0, time: 0 };
            const fileName = `Replay-${getDate().replace(/\s/g, '_')}.hbr2`;
            const rP = (Rposs + Bposs > 0) ? ((Rposs / (Rposs+Bposs)) * 100).toFixed(1) : "0.0";
            const bP = (Rposs + Bposs > 0) ? ((Bposs / (Rposs+Bposs)) * 100).toFixed(1) : "0.0";

            const payload_json = JSON.stringify({
                username: `📹 REPLAY (${roomName})`, avatar_url: AVATAR_URL_REPLAY, content: "A gravação da partida foi finalizada!",
                embeds: [{
                    color: 0x2b2d31, title: roomName, description: "Estatísticas:", footer: { text: `Partida de ${getDate()}` },
                    fields: [
                        { name: `🔴 Time Vermelho`, value: `**Placar:** ${sc.red}\n**Jogadores:**\n${redPlayers.join("\n") || "-"}`, inline: true },
                        { name: `🔵 Time Azul`, value: `**Placar:** ${sc.blue}\n**Jogadores:**\n${bluePlayers.join("\n") || "-"}`, inline: true },
                        { name: "⏱️ Tempo", value: `\`${customTime(sc.time)}\``, inline: true },
                        { name: "📊 Posse", value: `\`\`\`diff\n+ Red: ${rP}%\n- Blue: ${bP}%\`\`\``, inline: false },
                    ]
                }]
            });

            const form = new FormData();
            form.append("payload_json", payload_json);
            form.append("file", Buffer.from(replayData), { filename: fileName, contentType: "application/octet-stream" });

            try { await fetch(replayWebhookURL, { method: "POST", body: form }); } catch (error) { console.error("Erro replay:", error); }
        }

        // ================= EVENTOS DA SALA =================
        room.onRoomLink = function (link) {
            console.log(`✅ ${roomName} ONLINE | Link: ${link}`);
            currentRoomLink = link;
            
            if (!isSecondary) {
                setInterval(() => {
                    try {
                        const players = room.getPlayerList().filter((p) => p.id !== 0);
                        fs.writeFileSync(STATUS_MONITOR_FILE_PATH, JSON.stringify({ playerCount: players.length, maxPlayers, roomLink: currentRoomLink, lastUpdate: new Date().toISOString() }, null, 2));
                    } catch (e) {}
                }, 15000);
            }
        };

        room.onPlayerJoin = function (player) {
            console.log(`[${roomName}] Entrou: ${player.name}`);
            initPlayerStats(player);
            playersConn[player.name] = player.conn;
            
            if (room.getPlayerList().filter((p) => p.id !== 0).length === 1) room.setPlayerAdmin(player.id, true);
            
            room.sendAnnouncement(`👋🏼 Bem-vindo(a) à arena ${roomName}, ${player.name}!`, player.id, 0x00ff00, "bold", 1);
            
            const msg = "```" + `📝Info (${roomName})\nNick: ${player.name}\nConn: ${player.conn}\nAuth: ${player.auth}\nData: ${getDate()}` + "```";
            sendToWebhook(joinWebhookURL, "Logs de Entrada", msg, AVATAR_URL_LOGS);
        };

        room.onPlayerLeave = function (player) {
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
            room.sendAnnouncement(`👢 ${kickedPlayer.name} expulso por ${byPlayer.name}. Motivo: ${reason}`, null, 0xff0000, "bold", 0);
        };

        room.onPlayerChat = function (player, message) {
            message = message.trim();
            console.log(`[${roomName}] ${player.name}: ${message}`);

            // === COMANDOS ===
            if (message === "!ajuda" || message === "!comandos") {
                const help = "📜 COMANDOS 📜\n!discord » Link Discord.\n!bb » Sai da sala.\n!t mensagem » Chat de time.\n!denunciar <nick> [motivo]";
                room.sendAnnouncement(help, player.id, 0xffffff, "normal", 0);
                if (player.admin) setTimeout(() => room.sendAnnouncement("⭐ ADMIN: !rr, !trocarlado, !ban #ID, !unban nick, !limpar, !pb", player.id, 0xffcc00), 100);
                return false;
            }
            
            if (message === "!discord") {
                room.sendAnnouncement("🔗 Entre no nosso Discord: https://discord.gg/tVWmwXjjWx", player.id, 0x7289da, "bold", 1);
                return false;
            }
            
            if (message === "!bb" || message === "!sair") {
                room.kickPlayer(player.id, "Saiu da sala a pedido.", false);
                return false;
            }
            
            if (message.startsWith("!denunciar ") || message.startsWith("!troll ")) {
                const parts = message.split(" ");
                const target = parts[1];
                if (!target) { room.sendAnnouncement(`Uso: !denunciar <nick> [motivo]`, player.id, 0xffcc00); return false; }
                const reason = parts.slice(2).join(" ") || "Não especificado";
                const tPlayer = room.getPlayerList().find(p => p.name.toLowerCase().includes(target.toLowerCase()));
                if (!tPlayer) { room.sendAnnouncement(`Jogador "${target}" não encontrado.`, player.id, 0xffcc00); return false; }
                
                const msg = `🚨 DENÚNCIA (${roomName}) de **${player.name}** contra **${tPlayer.name}**.\n**Motivo:** ${reason}\n<@&${ADMIN_ROLE_ID}>`;
                sendToWebhook(denunciaWebhookURL, "Denúncias", msg, AVATAR_URL_LOGS);
                room.sendAnnouncement(`✅ Denúncia enviada!`, player.id, 0x00ff00, "bold", 0);
                return false;
            }

            // AQUI VERIFICA A SENHA LOCAL DA SALA (ADMIN_PASS ou ADMIN_PASS_2)
            if (message === localAdminCommand) {
                if (!officialAdms.includes(player.name)) officialAdms.push(player.name);
                if (!reiniColor.includes(player.name)) reiniColor.push(player.name);
                room.setPlayerAdmin(player.id, true);
                room.sendAnnouncement(`👑 ${player.name} Autenticado como DONO!`, null, 0xffd700, "bold", 2);
                sendToWebhook(logWebhookURL, "Logs Admin", `👑 **${player.name}** virou DONO na ${roomName}.`, AVATAR_URL_LOGS);
                return false;
            } 
            
            if (modPasswords.includes(message)) {
                room.setPlayerAdmin(player.id, true);
                room.sendAnnouncement(`🛡️ ${player.name} Autenticado como MODERADOR!`, null, 0x00bfff, "bold", 2);
                sendToWebhook(logWebhookURL, "Logs Admin", `🛡️ **${player.name}** virou MOD na ${roomName}.`, AVATAR_URL_LOGS);
                return false;
            }

            if (message.startsWith(prefixTeamChatStringss)) {
                const tMsg = message.substring(prefixTeamChatStringss.length).trim();
                if (player.team !== 0 && tMsg.length > 0) {
                    const color = player.team === 1 ? 0xff4c4c : 0x4c9dff;
                    const prefix = player.team === 1 ? "[🔴 TEAM]" : "[🔵 TEAM]";
                    room.getPlayerList().filter(p => p.team === player.team).forEach(p => { 
                        room.sendAnnouncement(`${prefix} ${player.name}: ${tMsg}`, p.id, color, "normal", 0); 
                    });
                }
                return false;
            }

            if (player.admin) {
                if (message === "!trocarlado") {
                    const all = room.getPlayerList();
                    const r = all.filter(p => p.team === 1); const b = all.filter(p => p.team === 2);
                    r.forEach(p => room.setPlayerTeam(p.id, 2)); b.forEach(p => room.setPlayerTeam(p.id, 1));
                    room.sendAnnouncement(`🔄 Times Invertidos!`, null, 0x00ff00, "bold", 1);
                    return false;
                }
                
                if (message === "!rr") { 
                    room.stopGame(); 
                    setTimeout(() => room.startGame(), 100); 
                    return false; 
                }
                
                if (message.startsWith("!ban ")) {
                    const tid = parseInt(message.split(" ")[1].replace("#", ""));
                    const tp = room.getPlayer(tid);
                    if (tp) {
                        const r = message.split(" ").slice(2).join(" ") || "Banido por admin";
                        bannedPlayers.set(tp.conn, { name: tp.name, banTime: Date.now() });
                        room.kickPlayer(tp.id, r, true);
                        const bm = `⛔ ${tp.name} banido por ${player.name}. Motivo: ${r}`;
                        room.sendAnnouncement(bm, null, 0xff0000, "bold");
                        sendToWebhook(banLogWebhookURL, "Punições", `\`\`\`${bm} (${roomName})\`\`\``, AVATAR_URL_LOGS);
                    } else room.sendAnnouncement("Jogador não encontrado.", player.id, 0xffcc00);
                    return false;
                }
                
                if (message.startsWith("!unban ")) {
                    const tname = message.split(" ").slice(1).join(" ");
                    let fConn = null;
                    for (const [c, b] of bannedPlayers.entries()) { 
                        if (b.name.toLowerCase() === tname.toLowerCase()) { fConn = c; break; } 
                    }
                    if (fConn) {
                        bannedPlayers.delete(fConn); room.clearBan(fConn);
                        const ubm = `✅ ${tname} desbanido por ${player.name}.`;
                        room.sendAnnouncement(ubm, null, 0x00ff00, "bold");
                        sendToWebhook(banLogWebhookURL, "Punições", `\`\`\`${ubm} (${roomName})\`\`\``, AVATAR_URL_LOGS);
                    } else room.sendAnnouncement(`"${tname}" não achado nos bans recentes.`, player.id, 0xffcc00);
                    return false;
                }
                
                if (message === "!limpar") {
                    room.clearBans(); bannedPlayers.clear();
                    const cm = `🧹 Bans limpos por ${player.name}.`;
                    room.sendAnnouncement(cm, null, 0x00ff00, "bold");
                    return false;
                }
                
                if (message === "!puxarbola" || message === "!pb") {
                    if (player.position) { 
                        room.setDiscProperties(0, { x: player.position.x, y: player.position.y, xspeed: 0, yspeed: 0 }); 
                        room.sendAnnouncement("⚽ Bola puxada!", player.id, 0x00ff00, "bold", 0); 
                    }
                    return false;
                }
            }

            if (!message.startsWith("!")) {
                let dm = `[${roomName}] [${player.team === 1 ? "🔴" : (player.team === 2 ? "🔵" : "⚪")}] **${player.name}**: ${message}`;
                sendToWebhook(chatWebhookURL, "Chat In-Game", dm, AVATAR_URL_CHAT);
            }
            
            if (reiniColor.includes(player.name)) { 
                room.sendAnnouncement(`👑 ${player.name}: ${message}`, undefined, 0xff0000, "bold"); 
                return false; 
            }
            return true;
        };

        room.onGameStart = function (by) {
            gameOcorring = true; Rposs = 0; Bposs = 0; lastPlayersTouched = [null, null]; lastScores = null;
            redPlayers = room.getPlayerList().filter(p => p.team === 1).map(p => p.name); 
            bluePlayers = room.getPlayerList().filter(p => p.team === 2).map(p => p.name);
            startRecording();
        };

        room.onGameStop = function (by) {
            gameOcorring = false; 
            lastScores = room.getScores(); 
            sendReplayToDiscord();
            
            if (lastScores && lastScores.time > 0) {
                if (lastScores.red === lastScores.blue) room.sendAnnouncement(`🤝 EMPATE! ${lastScores.red} - ${lastScores.blue}`, null, 0xffd700, "bold", 2);
                else { 
                    const w = lastScores.red > lastScores.blue ? "🔴 VERMELHO" : "🔵 AZUL"; 
                    room.sendAnnouncement(`🏆 FIM! Vitória do ${w} (${lastScores.red} - ${lastScores.blue})`, null, 0xffd700, "bold", 2); 
                }
            }
            saveStats();
        };
    });
}

// ===============================================================
// 🚀 INICIALIZAÇÃO DAS SALAS (CORRIGIDO)
// ===============================================================

// Sala 1 (Configuração Padrão)
// Params: Token, Nome, MaxPlayers, Public, AdminPass, RoomPass, isSecondary
iniciarBot(
    process.env.HAXBALL_TOKEN, 
    process.env.ROOM_NAME, 
    process.env.MAX_PLAYERS, 
    process.env.PUBLIC, 
    process.env.ADMIN_PASS, // Senha Admin Sala 1
    process.env.ROOM_PASS,  // Senha Sala 1
    false
);

// Sala 2 (Configuração Secundária)
iniciarBot(
    process.env.HAXBALL_TOKEN_2, 
    process.env.ROOM_NAME_2, 
    process.env.MAX_PLAYERS_2, 
    process.env.PUBLIC, 
    process.env.ADMIN_PASS_2, // Senha Admin Sala 2
    process.env.PASSWORD_2,   // Senha Sala 2 (Entrada)
    true
);


// ===============================================================
// 🌐 SERVIDOR EXPRESS (Controla Webhooks para AMBAS as salas)
// ===============================================================
const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('Bots Haxball Rodando!'));

// Webhook para mandar msg do Discord para as salas
app.post("/discord-chat", (req, res) => {
    const { author, message } = req.body;
    if (!author || !message) return res.status(400).send({ error: "Faltando dados" });
    
    // Manda para TODAS as salas ativas
    activeRooms.forEach(room => {
        try {
            room.sendAnnouncement(`[💬 Discord] ${author}: ${message}`, null, 0xffff00, "bold", 0);
        } catch (e) { console.error("Erro enviando msg Discord para sala:", e); }
    });
    res.status(200).send({ status: "ok" });
});

// Comandos de Admin via Webhook
app.post("/admin-command", (req, res) => {
    const { authorization } = req.headers;
    const { command, author } = req.body;
    if (authorization !== `Bearer ${ADMIN_SECRET_KEY}`) return res.status(403).send({ error: "Acesso negado" });
    
    if (command === "clearbans") {
        activeRooms.forEach(room => {
            room.clearBans();
            room.sendAnnouncement(`🧹 Todos os bans removidos remotamente por ${author}.`, null, 0x00ff00, "bold");
        });
        res.status(200).send({ message: "Sucesso em todas as salas" });
    } else res.status(400).send({ error: "Comando desconhecido" });
});

app.listen(WEBHOOK_PORT, () => console.log(`[SERVER] Webserver rodando na porta ${WEBHOOK_PORT}`));
