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
};