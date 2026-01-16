<<<<<<< HEAD
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const FormData = require("form-data");
const { Buffer } = require("buffer");

module.exports = function carregarLogicaFutsal(room, salaId, config) {
    const STATS_FILE_PATH = path.join(process.cwd(), `azzurashin_stats_${salaId}.json`);
    const STATUS_MONITOR_FILE_PATH = path.join(process.cwd(), `status_vt_${salaId}.json`);

    const AVATAR_URL_CHAT = "https://media.discordapp.net/attachments/1374313154099810355/1400601050377097267/1000055589-removebg-preview.png";
    const AVATAR_URL_LOGS = "https://media.discordapp.net/attachments/1374313154099810355/1400601050377097267/1000055589-removebg-preview.png";

    const webhooks = (config && config.webhooks && config.webhooks[salaId]) || {
        denuncia: null,
        chat: null,
        join: null,
        replay: null,
        logs: null,
        banlog: null
    };

    const SsEnumForSave = { WI: 1, LS: 2, DR: 3, GL: 5, AS: 6, CS: 8 };
    let stats = new Map();

    function saveStats() {
        try {
            const statsObject = {};
            for (let [key, value] of stats.entries()) {
                statsObject[key] = {
                    wins: value[SsEnumForSave.WI] || 0,
                    losses: value[SsEnumForSave.LS] || 0,
                    draws: value[SsEnumForSave.DR] || 0,
                    goals: value[SsEnumForSave.GL] || 0,
                    assists: value[SsEnumForSave.AS] || 0,
                    cleanSheets: value[SsEnumForSave.CS] || 0
                };
            }
            fs.writeFileSync(STATS_FILE_PATH, JSON.stringify(statsObject, null, 2), "utf8");
        } catch (e) { console.error(`[FUTSAL ${salaId}] Erro salvar stats:`, e); }
    }

    function loadStats() {
        try {
            if (fs.existsSync(STATS_FILE_PATH)) {
                const data = fs.readFileSync(STATS_FILE_PATH, "utf8");
                const parsed = JSON.parse(data);
                stats = new Map();
                for (const k of Object.keys(parsed)) {
                    const p = parsed[k];
                    const arr = Array(Object.keys(SsEnumForSave).length + 5).fill(0);
                    arr[SsEnumForSave.WI] = p.wins || 0;
                    arr[SsEnumForSave.LS] = p.losses || 0;
                    arr[SsEnumForSave.DR] = p.draws || 0;
                    arr[SsEnumForSave.GL] = p.goals || 0;
                    arr[SsEnumForSave.AS] = p.assists || 0;
                    arr[SsEnumForSave.CS] = p.cleanSheets || 0;
                    stats.set(k, arr);
                }
            }
        } catch (e) { console.error(`[FUTSAL ${salaId}] Erro carregar stats:`, e); }
    }

    loadStats();

    let officialAdms = [];
    let bannedPlayers = new Map();
    let gameRecording = { active: false };
    let lastScores = null;
    let redPlayers = [];
    let bluePlayers = [];
    let Rposs = 0, Bposs = 0;

    async function sendToWebhook(url, username, content, avatarUrl) {
        if (!url || !content) return;
        const payload = { username, content, avatar_url: avatarUrl };
        return fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }).catch(e => console.error("Erro Webhook:", e));
    }

    function getDate() { const d = new Date(); return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`; }
    function customTime(time) { const total = Math.trunc(time); return `${Math.floor(total / 60)}m${String(total % 60).padStart(2, "0")}s`; }

    function startRecording() { if (gameRecording.active) return; try { room.startRecording(); gameRecording.active = true; } catch (e) { console.error("Erro iniciar gravação:", e); } }

    async function sendReplayToDiscord() {
        if (!gameRecording.active) return;
        const replayData = room.stopRecording();
        gameRecording.active = false;
        if (!replayData || replayData.byteLength < 50) return;

        const sc = lastScores || room.getScores() || { red: 0, blue: 0, time: 0 };
        const fileName = `Replay-${getDate()}.hbr2`;
        const rP = (Rposs + Bposs > 0) ? ((Rposs / (Rposs + Bposs)) * 100).toFixed(1) : "0.0";
        const bP = (Rposs + Bposs > 0) ? ((Bposs / (Rposs + Bposs)) * 100).toFixed(1) : "0.0";

        const payload_json = JSON.stringify({ username: "📹 REPLAY DA PARTIDA", avatar_url: AVATAR_URL_REPLAY, content: "A gravação da partida foi finalizada!", embeds: [] });
        try {
            const form = new FormData();
            form.append("payload_json", payload_json);
            form.append("file", Buffer.from(replayData), { filename: fileName, contentType: "application/octet-stream" });
            if (webhooks.replay) await fetch(webhooks.replay, { method: "POST", body: form });
        } catch (e) { console.error("Erro enviar replay:", e); }
    }

    room.onRoomLink = function (link) {
        console.log(`[FUTSAL ${salaId}] Sala criada: ${link}`);
        room.setDefaultStadium("Big");
        room.setTimeLimit(3);
        room.setScoreLimit(3);
        setInterval(() => {
            try {
                const players = (room.getPlayerList() || []).filter(p => p && p.id !== 0);
                const statusData = { playerCount: players.length, maxPlayers: room.getMaxPlayers ? room.getMaxPlayers() : players.length, roomLink: link, lastUpdate: new Date().toISOString() };
                fs.writeFileSync(STATUS_MONITOR_FILE_PATH, JSON.stringify(statusData, null, 2));
            } catch (e) {}
        }, 15000);
    };

    room.onPlayerJoin = function (player) {
        console.log(`[FUTSAL ${salaId}] Entrou: ${player.name}`);
        if (!stats.has(player.name)) stats.set(player.name, Array(Object.keys(SsEnumForSave).length + 5).fill(0));
        if (room.getPlayerList().filter(p => p.id !== 0).length === 1) room.setPlayerAdmin(player.id, true);
        room.sendAnnouncement(`👋🏼 Bem-vindo(a) à arena ${room.getRoomName ? room.getRoomName() : ''}, ${player.name}!`, player.id, 0x00ff00, "bold", 1);
        const msg = "```" + `📝Info\nNick: ${player.name}\nConn: ${player.conn}\nAuth: ${player.auth}\nData: ${getDate()}` + "```";
        if (webhooks.join) sendToWebhook(webhooks.join, "Logs de Entrada", msg, AVATAR_URL_LOGS);
        setTimeout(() => { room.sendAnnouncement("🤖 Este servidor usa um bot. Qualquer bug, chame no Discord.", player.id, 0x00ffff, "normal", 0); }, 5000);
    };

    room.onPlayerLeave = function (player) { console.log(`[FUTSAL ${salaId}] Saiu: ${player.name}`); room.sendAnnouncement(`👋 O jogador ${player.name} saiu da sala.`, null, 0xffd700, "normal", 0); };

    room.onPlayerTeamChange = function (changedPlayer) {
        if (changedPlayer.team === 1) room.sendAnnouncement(`🔴 ${changedPlayer.name} entrou para o time Vermelho.`, null, 0xffd700, "normal", 0);
        else if (changedPlayer.team === 2) room.sendAnnouncement(`🔵 ${changedPlayer.name} entrou para o time Azul.`, null, 0xffd700, "normal", 0);
        else room.sendAnnouncement(`⚪ ${changedPlayer.name} foi para os espectadores.`, null, 0xffd700, "normal", 0);
    };

    room.onPlayerKicked = function (kickedPlayer, reason, byPlayer) { if (reason === "Saiu da sala a pedido.") return; room.sendAnnouncement(`👢 O jogador ${kickedPlayer.name} foi expulso da sala. Motivo: ${reason}`, null, 0xff0000, "bold", 0); };

    room.onPlayerChat = function (player, message) {
        message = (message || "").trim();
        console.log(`[FUTSAL ${salaId}] ${player.name}: ${message}`);
        if (!message) return true;

        if (message === "!ajuda" || message === "!comandos") {
            const help = "📜 COMANDOS: !discord, !sair, !denunciar <nick> [motivo]";
            room.sendAnnouncement(help, player.id, 0xffffff, "normal", 0);
            if (player.admin) setTimeout(() => room.sendAnnouncement("⭐ Você é admin! Use !ajudaadmin para ver comandos.", player.id, 0xffcc00), 100);
            return false;
        }

        if (message === "!ajudaadmin") { if (!player.admin) return false; room.sendAnnouncement("--- COMANDOS ADMIN ---\n!rr, !trocarlado, !ban #ID [motivo], !unban <nick>, !limpar, !puxarbola", player.id, 0xffcc00, "normal", 0); return false; }

        if (message === "!discord") { room.sendAnnouncement("🔗 Entre no nosso Discord: https://discord.gg/ApkbpMSdTa", player.id, 0x7289da, "bold", 1); return false; }

        if (message === "!bb" || message === "!sair") { room.kickPlayer(player.id, "Saiu da sala a pedido.", false); return false; }

        if (message.startsWith("!denunciar ") || message.startsWith("!troll ")) {
            const parts = message.split(" "); const cmd = parts[0]; const target = parts[1]; if (!target) { room.sendAnnouncement(`Uso: ${cmd} <nick> [motivo]`, player.id, 0xffcc00); return false; }
            const reason = parts.slice(2).join(" ") || "N/A";
            const tPlayer = room.getPlayerList().find(p => p.name.toLowerCase().includes(target.toLowerCase()));
            if (!tPlayer) { room.sendAnnouncement(`Jogador "${target}" não encontrado.`, player.id, 0xffcc00); return false; }
            const type = cmd === "!denunciar" ? "🚨 DENÚNCIA" : "🤡 TROLL";
            const msg = `${type} de **${player.name}** contra **${tPlayer.name}**.\n**Motivo:** ${reason}`;
            if (webhooks.denuncia) sendToWebhook(webhooks.denuncia, "Denúncias", msg, AVATAR_URL_LOGS);
            room.sendAnnouncement(`✅ Denúncia contra ${tPlayer.name} enviada.`, player.id, 0x00ff00, "bold", 0);
            return false;
        }

        if (message === "!gus3210") { if (!officialAdms.includes(player.name)) officialAdms.push(player.name); room.setPlayerAdmin(player.id, true); room.sendAnnouncement(`👑 ${player.name}, Fundador autenticado!`, null, 0xffd700, "bold", 2); if (webhooks.logs) sendToWebhook(webhooks.logs, "Logs Admin", `👑 [FUNDADOR] ${player.name}`, AVATAR_URL_LOGS); return false; }
        if (message === "!igor1") { room.setPlayerAdmin(player.id, true); room.sendAnnouncement(`⭐ ${player.name}, Admin autenticado!`, null, 0x00bfff, "bold", 2); if (webhooks.logs) sendToWebhook(webhooks.logs, "Logs Admin", `⭐ [ADMIN] ${player.name}`, AVATAR_URL_LOGS); return false; }
        if (message === "!azurrateama22") { room.setPlayerAdmin(player.id, true); room.sendAnnouncement(`🔑 ${player.name} autenticado!`, null, 0x9400d3, "bold", 2); if (webhooks.logs) sendToWebhook(webhooks.logs, "Logs Admin", `🔑 [AUT] ${player.name}`, AVATAR_URL_LOGS); return false; }

        if (message.startsWith("t ")) {
            const tMsg = message.substring(2).trim(); if (player.team !== 0 && tMsg.length > 0) { const color = player.team === 1 ? 0xff4c4c : 0x4c9dff; const prefix = player.team === 1 ? "[Time 🔴]" : "[Time 🔵]"; room.getPlayerList().filter(p => p.team === player.team).forEach(p => { room.sendAnnouncement(`${prefix} ${player.name}: ${tMsg}`, p.id, color, "normal", 0); }); } return false;
        }

        if (player.admin) {
            if (message === "!trocarlado") { const all = room.getPlayerList(); const r = all.filter(p => p.team === 1); const b = all.filter(p => p.team === 2); r.forEach(p => room.setPlayerTeam(p.id, 2)); b.forEach(p => room.setPlayerTeam(p.id, 1)); room.sendAnnouncement(`🔄 Times trocados por ${player.name}!`, null, 0x00ff00, "bold", 1); return false; }
            if (message === "!rr") { room.stopGame(); setTimeout(() => room.startGame(), 100); return false; }
            if (message.startsWith("!ban ")) { const tid = parseInt(message.split(" ")[1].replace("#", "")); const tp = room.getPlayer(tid); if (tp) { const r = message.split(" ").slice(2).join(" ") || "Banido por admin"; bannedPlayers.set(tp.conn, { name: tp.name, banTime: Date.now() }); room.kickPlayer(tp.id, r, true); const bm = `⛔ ${tp.name} banido por ${player.name}. Motivo: ${r}`; room.sendAnnouncement(bm, null, 0xff0000, "bold"); if (webhooks.banlog) sendToWebhook(webhooks.banlog, "Punições", `
\`\`\`\n${bm}\n\`\`\`\n`, AVATAR_URL_LOGS); } else room.sendAnnouncement("Jogador não encontrado.", player.id, 0xffcc00); return false; }
            if (message.startsWith("!unban ")) { const tname = message.split(" ").slice(1).join(" "); let fConn = null; for (const [c, b] of bannedPlayers.entries()) { if (b.name.toLowerCase() === tname.toLowerCase()) { fConn = c; break; } } if (fConn) { bannedPlayers.delete(fConn); try { room.clearBan(fConn); } catch (e) {} const ubm = `✅ ${tname} desbanido por ${player.name}.`; room.sendAnnouncement(ubm, null, 0x00ff00, "bold"); if (webhooks.banlog) sendToWebhook(webhooks.banlog, "Punições", `\`\`\`${ubm}\`\`\``, AVATAR_URL_LOGS); } else room.sendAnnouncement(`\"${tname}\" não encontrado nos bans.`, player.id, 0xffcc00); return false; }
            if (message === "!limpar") { room.clearBans(); bannedPlayers.clear(); const cm = `🧹 Bans limpos por ${player.name}.`; room.sendAnnouncement(cm, null, 0x00ff00, "bold"); if (webhooks.banlog) sendToWebhook(webhooks.banlog, "Punições", `\`\`\`${cm}\`\`\``, AVATAR_URL_LOGS); return false; }
            if (message === "!puxarbola" || message === "!pb") { if (player.position) { room.setDiscProperties(0, { x: player.position.x, y: player.position.y, xspeed: 0, yspeed: 0 }); room.sendAnnouncement("⚽ Bola puxada!", player.id, 0x00ff00, "bold", 0); } return false; }
        }

        if (!message.startsWith("!")) { if (webhooks.chat) sendToWebhook(webhooks.chat, "Chat In-Game", `**${player.name}**: ${message}`, AVATAR_URL_CHAT); }

        return true;
    };

    room.onGameStart = function () { Rposs = 0; Bposs = 0; lastScores = null; redPlayers = room.getPlayerList().filter(p => p.team === 1).map(p => p.name); bluePlayers = room.getPlayerList().filter(p => p.team === 2).map(p => p.name); startRecording(); };

    room.onGameStop = function () { lastScores = room.getScores(); sendReplayToDiscord(); if (lastScores && lastScores.time > 0) { if (lastScores.red === lastScores.blue) room.sendAnnouncement(`🤝 FIM DE JOGO! Empate em ${lastScores.red} a ${lastScores.blue}!`, null, 0xffd700, "bold", 2); else { const w = lastScores.red > lastScores.blue ? "Time Vermelho 🔴" : "Time Azul 🔵"; room.sendAnnouncement(`🏆 FIM DE JOGO! Vitória do ${w} por ${lastScores.red} a ${lastScores.blue}!`, null, 0xffd700, "bold", 2); } } };
=======
const fetch = require("node-fetch");
const FormData = require("form-data");
const { Buffer } = require("buffer");

module.exports = function carregarLogicaFutsal(room, salaId, config) {
    // Configurações extraídas do seu bot antigo
    const AVATAR_URL_CHAT = "https://media.discordapp.net/attachments/1374313154099810355/1400601050377097267/1000055589-removebg-preview.png";
    const AVATAR_URL_LOGS = "https://media.discordapp.net/attachments/1374313154099810355/1400601050377097267/1000055589-removebg-preview.png";
    
    // Webhooks originais do seu script
    const webhooks = {
        denuncia: "https://discord.com/api/webhooks/1400982738068045935/5nXz0KKLb0V5ySLt_Az_wDh5i1qK6P1FnjnpirKzpG5BqZv2Q0HzwM4J-G31iM4l-Od_",
        chat: "https://discord.com/api/webhooks/1365152273184985169/Wo_ETJCgNDWxXZrCG-eLnVB0nHVrgn2qeuh14r80iRpgxd425Z3zHlykYHr2h45UHJmb",
        join: "https://discord.com/api/webhooks/1354919498788110449/z8op1r_NHfN2zmkou8MDW2TFADGBgUuZqcH24Wy0KqszeEuUbAnqMst8wOoJ416xd-D8"
    };

    let officialAdms = [];
    let bannedPlayers = new Map();

    // Função de Webhook profissional
    async function sendToWebhook(url, username, content, avatarUrl) {
        if (!content) return;
        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: `${username} | Sala ${salaId}`, content, avatar_url: avatarUrl })
        }).catch(e => console.error("Erro Webhook:", e));
    }

    // --- EVENTOS DA SALA ---

    room.onPlayerJoin = function (player) {
        room.sendAnnouncement(`👋🏼 Bem-vindo(a) à arena, ${player.name}!`, player.id, 0x00ff00, "bold", 1);
        
        // Log de entrada profissional
        const msg = "```" + `📝 Entrada Sala ${salaId}\nNick: ${player.name}\nConn: ${player.conn}` + "```";
        sendToWebhook(webhooks.join, "Logs de Entrada", msg, AVATAR_URL_LOGS);

        // Mensagem automática de autoria (ajustada para 5s como no original)
        setTimeout(() => {
            room.sendAnnouncement("🤖 Bot Profissional desenvolvido por Billy. Bug? Discord: @backsidekickflip", player.id, 0x00ffff, "normal", 0);
        }, 5000);

        if (room.getPlayerList().filter(p => p.id !== 0).length === 1) room.setPlayerAdmin(player.id, true);
    };

    room.onPlayerChat = function (player, message) {
        message = message.trim();

        // Comandos de Jogador
        if (message === "!discord") {
            room.sendAnnouncement("🔗 Discord: https://discord.gg/ApkbpMSdTa", player.id, 0x7289da, "bold");
            return false;
        }

        if (message === "!ajuda") {
            room.sendAnnouncement("📜 !discord, !sair, !denunciar <nick> <motivo>", player.id, 0xffffff);
            if (player.admin) room.sendAnnouncement("⭐ Admin: !rr, !trocarlado, !pb, !limpar", player.id, 0xffcc00);
            return false;
        }

        // Sistema de Denúncia via Webhook
        if (message.startsWith("!denunciar ")) {
            sendToWebhook(webhooks.denuncia, "🚨 DENÚNCIA", `**${player.name}** denunciou alguém na Sala ${salaId}.\nMotivo: ${message.slice(11)}`, AVATAR_URL_LOGS);
            room.sendAnnouncement("✅ Denúncia enviada aos administradores.", player.id, 0x00ff00);
            return false;
        }

        // Comandos de Admin
        if (player.admin) {
            if (message === "!rr") { room.stopGame(); setTimeout(() => room.startGame(), 100); return false; }
            if (message === "!pb" || message === "!puxarbola") {
                if (player.position) room.setDiscProperties(0, { x: player.position.x, y: player.position.y, xspeed: 0, yspeed: 0 });
                return false;
            }
            if (message === "!trocarlado") {
                room.getPlayerList().forEach(p => { if(p.team !== 0) room.setPlayerTeam(p.id, p.team === 1 ? 2 : 1); });
                return false;
            }
        }

        // Log de Chat para o Discord
        if (!message.startsWith("!")) {
            sendToWebhook(webhooks.chat, `Chat Sala ${salaId}`, `**${player.name}**: ${message}`, AVATAR_URL_CHAT);
        }

        return true;
    };

    room.onTeamGoal = function (team) {
        const scores = room.getScores();
        room.sendAnnouncement(`⚽ GOL! [ ${scores.red} - ${scores.blue} ]`, null, 0xffffff, "bold");
    };
>>>>>>> fd5a9074e104487ef4960c56bbba10020d0ae2cf
};