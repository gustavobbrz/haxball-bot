"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePlayerLeaving = void 0;
const afkdetection_js_1 = require("./afkdetection.js");
const index_js_1 = require("./index.js");
const teammanagement_js_1 = require("./teammanagement.js");
const discord_js_1 = require("./discord.js");
const config_js_1 = require("./config.js");
function handlePlayerLeaving(player) {
    const playerId = player.id;
    let playerIdList = [];
    const playerList = index_js_1.room.getPlayerList();
    if (index_js_1.redPlayerIdList.includes(playerId) || index_js_1.bluePlayerIdList.includes(playerId)) {
        playerIdList = index_js_1.redPlayerIdList.includes(playerId) ? index_js_1.redPlayerIdList : index_js_1.bluePlayerIdList;
        if (playerList.length !== 0)
            handleTeamPlayerLeaving(playerIdList, playerList);
    }
    else {
        playerIdList = index_js_1.specPlayerIdList;
    }
    playerIdList.splice(playerIdList.indexOf(playerId), 1);
    (0, afkdetection_js_1.removePlayerFromAfkMapsAndSets)(playerId);
    index_js_1.playerConnStrings.delete(playerId);
    if (playerList.length === 0)
        index_js_1.room.stopGame();
    console.log(`>>> ${player.name} saiu da sala.`);
    // Enviar webhook do Discord
    const config = (0, config_js_1.getRoomConfig)();
    if (config.webhooks && config.webhooks.leave) {
        (0, discord_js_1.sendDiscordWebhook)(config.webhooks.leave, {
            embeds: [(0, discord_js_1.createPlayerLeaveEmbed)(player.name, config.roomName)]
        }).catch(err => console.error("Erro ao enviar webhook:", err));
    }
}
exports.handlePlayerLeaving = handlePlayerLeaving;
function handleTeamPlayerLeaving(teamPlayerIdList, playerList) {
    const oppositeTeamPlayerIdList = teamPlayerIdList === index_js_1.redPlayerIdList ? index_js_1.bluePlayerIdList : index_js_1.redPlayerIdList;
    if (playerList.length === 1) {
        (0, index_js_1.restartGameWithCallback)(() => (0, teammanagement_js_1.movePlayerToTeam)(playerList[0].id, index_js_1.redPlayerIdList));
    }
    else if (index_js_1.specPlayerIdList.length === 0) {
        (0, index_js_1.restartGameWithCallback)(() => (0, teammanagement_js_1.moveLastOppositeTeamMemberToSpec)(oppositeTeamPlayerIdList));
    }
    else {
        (0, teammanagement_js_1.movePlayerToTeam)(index_js_1.specPlayerIdList[0], teamPlayerIdList);
        (0, index_js_1.pauseUnpauseGame)();
    }
}
