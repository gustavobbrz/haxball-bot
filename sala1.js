let HBInit;
try {
    const lib = require('haxball.js');
    if (typeof lib === 'function') HBInit = lib;
    else if (lib.HBInit) HBInit = lib.HBInit;
    else if (lib.default) HBInit = lib.default;
    else process.exit(1);
} catch (e) { console.error(e); process.exit(1); }

const nomeSala = process.env.ROOM_NAME || "Sala 1";
const tokenSala = process.env.HAXBALL_TOKEN;

if (!tokenSala) { console.error("Token vazio"); process.exit(1); }

console.log("Tentando conectar...");

try {
    const sala = HBInit({
        roomName: nomeSala,
        maxPlayers: parseInt(process.env.MAX_PLAYERS) || 16,
        public: true,
        noPlayer: true,
        token: tokenSala,
        password: process.env.ROOM_PASS || null,
        // === CORREÇÃO DE MEMÓRIA E GPU ===
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage', // <--- ESSA É A SALVAÇÃO
                '--disable-gpu',
                '--no-first-run',
                '--no-zygote'
            ]
        }
        // =================================
    });

    sala.onRoomLink = function(link) {
        console.log(`SUCESSO! Link: ${link}`);
    };

    sala.onPlayerChat = function(player, message) {
        if (message === process.env.ADMIN_PASS) {
            sala.setPlayerAdmin(player.id, true);
            return false;
        }
    };
} catch (error) {
    console.error("ERRO FATAL:", error);
}
