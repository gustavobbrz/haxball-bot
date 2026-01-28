"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAndHandleBadWords = exports.checkAndHandleSpam = void 0;
const commands_js_1 = require("./commands.js");
const index_js_1 = require("./index.js");
const playerConsecutiveMessages = new Map();
const playerMessageTimestamps = new Map();
const rateLimit = 5;
const rateLimitTimeSpan = 4000;
function checkAndHandleSpam(player, message) {
    const playerId = player.id;
    if (!(0, commands_js_1.isCommand)(message) && (isPlayerAboveRateLimit(playerId) || is3rdConsecutiveMessage(playerId, message))) {
        index_js_1.room.kickPlayer(playerId, "Spam", false);
        console.warn(`>>> ${player.name} foi expulso. Razão: spam.`);
        return true;
    }
    return false;
}
exports.checkAndHandleSpam = checkAndHandleSpam;
function isPlayerAboveRateLimit(playerId) {
    const currentTimestamp = Date.now();
    let messageTimestamps = playerMessageTimestamps.get(playerId) || [];
    while (messageTimestamps.length > 0 && currentTimestamp - messageTimestamps[0] > rateLimitTimeSpan)
        messageTimestamps.shift();
    if (messageTimestamps.length >= rateLimit)
        return true;
    messageTimestamps.push(currentTimestamp);
    playerMessageTimestamps.set(playerId, messageTimestamps);
    return false;
}
function is3rdConsecutiveMessage(playerId, message) {
    const messages = playerConsecutiveMessages.get(playerId) || [];
    const lastMessage = messages[messages.length - 1];
    if (lastMessage === message) {
        messages.push(message);
        playerConsecutiveMessages.set(playerId, messages);
        if (messages.length === 3)
            return true;
    }
    else {
        playerConsecutiveMessages.delete(playerId);
        playerConsecutiveMessages.set(playerId, [message]);
    }
    return false;
}
function checkAndHandleBadWords(player, string) {
    if (containsBadWords(string)) {
        index_js_1.room.kickPlayer(player.id, "Intolerância", true);
        console.warn(`>>> ${player.name} foi banido. Razão: intolerância. (${string})`);
        return true;
    }
    return false;
}
exports.checkAndHandleBadWords = checkAndHandleBadWords;
function containsBadWords(message) {
    return Array.from(index_js_1.badWordList).some((word) => removeNumbersAndDiacritics(message).toLowerCase().includes(word));
}
function removeNumbersAndDiacritics(message) {
    message = message.normalize("NFD").replace(/\p{Diacritic}/gu, "");
    const replacements = {
        "0": "o",
        "1": "i",
        "3": "e",
        "4": "a",
        "5": "s",
        "7": "t",
    };
    return message.replace(/[013457]/g, m => replacements[m]);
}
