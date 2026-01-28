"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleTeamWin = exports.moveLastOppositeTeamMemberToSpec = exports.moveOneSpecToEachTeam = exports.movePlayerToTeam = void 0;
const afkdetection_js_1 = require("./afkdetection.js");
const index_js_1 = require("./index.js");
function movePlayerToTeam(playerId, teamPlayerIdList) {
    if (teamPlayerIdList.includes(playerId))
        return;
    const oppositeTeamPlayerIdList = teamPlayerIdList === index_js_1.redPlayerIdList ? index_js_1.bluePlayerIdList : index_js_1.redPlayerIdList;
    const teamId = teamPlayerIdList === index_js_1.redPlayerIdList ? 1 : 2;
    index_js_1.room.setPlayerTeam(playerId, teamId);
    teamPlayerIdList.push(playerId);
    if (oppositeTeamPlayerIdList.includes(playerId))
        oppositeTeamPlayerIdList.splice(oppositeTeamPlayerIdList.indexOf(playerId), 1);
    if (index_js_1.specPlayerIdList.includes(playerId))
        index_js_1.specPlayerIdList.splice(index_js_1.specPlayerIdList.indexOf(playerId), 1);
    (0, afkdetection_js_1.setLastPlayerActivityTimestamp)(playerId);
}
exports.movePlayerToTeam = movePlayerToTeam;
function movePlayerToSpec(playerId) {
    index_js_1.room.setPlayerTeam(playerId, 0);
    index_js_1.specPlayerIdList.push(playerId);
    if (index_js_1.redPlayerIdList.includes(playerId))
        index_js_1.redPlayerIdList.splice(index_js_1.redPlayerIdList.indexOf(playerId), 1);
    if (index_js_1.bluePlayerIdList.includes(playerId))
        index_js_1.bluePlayerIdList.splice(index_js_1.bluePlayerIdList.indexOf(playerId), 1);
    (0, afkdetection_js_1.removePlayerFromAfkMapsAndSets)(playerId);
}
function moveOneSpecToEachTeam() {
    const teamPlayerIdLists = [index_js_1.redPlayerIdList, index_js_1.bluePlayerIdList];
    teamPlayerIdLists.forEach(teamPlayerIdList => {
        movePlayerToTeam(index_js_1.specPlayerIdList[0], teamPlayerIdList);
    });
}
exports.moveOneSpecToEachTeam = moveOneSpecToEachTeam;
function moveLastOppositeTeamMemberToSpec(oppositeTeamPlayerIdList) {
    movePlayerToSpec(oppositeTeamPlayerIdList[oppositeTeamPlayerIdList.length - 1]);
}
exports.moveLastOppositeTeamMemberToSpec = moveLastOppositeTeamMemberToSpec;
function handleTeamWin(teamPlayerIdList) {
    if (teamPlayerIdList === index_js_1.redPlayerIdList) {
        if (index_js_1.specPlayerIdList.length === 0)
            return;
        for (let i = 0; i < index_js_1.bluePlayerIdList.length; i++) {
            movePlayerToSpec(index_js_1.bluePlayerIdList[0]);
            movePlayerToTeam(index_js_1.specPlayerIdList[0], index_js_1.bluePlayerIdList);
        }
        return;
    }
    for (let i = 0; i < index_js_1.bluePlayerIdList.length; i++) {
        if (index_js_1.specPlayerIdList.length)
            movePlayerToSpec(index_js_1.redPlayerIdList[0]);
        else
            movePlayerToTeam(index_js_1.redPlayerIdList[0], index_js_1.bluePlayerIdList);
        movePlayerToTeam(index_js_1.bluePlayerIdList[0], index_js_1.redPlayerIdList);
        if (index_js_1.specPlayerIdList.length)
            movePlayerToTeam(index_js_1.specPlayerIdList[0], index_js_1.bluePlayerIdList);
    }
}
exports.handleTeamWin = handleTeamWin;
