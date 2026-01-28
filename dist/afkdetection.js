"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePlayerFromAfkMapsAndSets = exports.checkAndHandleInactivePlayers = exports.handlePlayerActivity = exports.setLastPlayerActivityTimestamp = void 0;
const index_js_1 = require("./index.js");
const lastPlayerActivityTimestamp = new Map();
const hasPlayerBeenWarnedToMove = new Set();
function setLastPlayerActivityTimestamp(playerId) {
    lastPlayerActivityTimestamp.set(playerId, Date.now());
}
exports.setLastPlayerActivityTimestamp = setLastPlayerActivityTimestamp;
function handlePlayerActivity(playerId) {
    if (!index_js_1.specPlayerIdList.includes(playerId)) {
        setLastPlayerActivityTimestamp(playerId);
        hasPlayerBeenWarnedToMove.delete(playerId);
    }
}
exports.handlePlayerActivity = handlePlayerActivity;
function checkAndHandleInactivePlayers() {
    for (let [playerId, timestamp] of lastPlayerActivityTimestamp.entries()) {
        if (Date.now() - timestamp >= 5000 && !hasPlayerBeenWarnedToMove.has(playerId)) {
            index_js_1.room.sendAnnouncement(`❗️ ${index_js_1.room.getPlayer(playerId).name}, move-te ou serás expulso!`, playerId, 0xFF0000, "bold", 2);
            hasPlayerBeenWarnedToMove.add(playerId);
        }
        if (Date.now() - timestamp >= 10000)
            index_js_1.room.kickPlayer(playerId, "AFK", false);
    }
}
exports.checkAndHandleInactivePlayers = checkAndHandleInactivePlayers;
function removePlayerFromAfkMapsAndSets(playerId) {
    lastPlayerActivityTimestamp.delete(playerId);
    hasPlayerBeenWarnedToMove.delete(playerId);
}
exports.removePlayerFromAfkMapsAndSets = removePlayerFromAfkMapsAndSets;
