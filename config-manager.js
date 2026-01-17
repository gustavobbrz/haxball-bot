const fs = require("fs");
const path = require("path");

const CONFIG_DIR = path.join(process.cwd(), "configs");
const DEFAULT_CONFIG_FILE = path.join(CONFIG_DIR, "default.json");

// Garante que a pasta de configs existe
function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

// Carrega a configuração principal
function loadConfig() {
  ensureConfigDir();

  try {
    if (fs.existsSync(DEFAULT_CONFIG_FILE)) {
      const data = fs.readFileSync(DEFAULT_CONFIG_FILE, "utf8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Erro ao carregar config.json:", e.message);
  }

  // Config padrão
  return {
    port: process.env.PORT || 3002,
    adminSecret: process.env.ADMIN_SECRET || "change_me_secret",
    rooms: []
  };
}

// Salva configuração
function saveConfig(config) {
  ensureConfigDir();
  fs.writeFileSync(DEFAULT_CONFIG_FILE, JSON.stringify(config, null, 2), "utf8");
}

// Obtém configuração de uma sala específica
function getRoomConfig(roomId, config) {
  return config.rooms.find(r => r.id === roomId);
}

// Adiciona/atualiza sala na config
function updateRoomConfig(roomId, roomConfig, config) {
  const index = config.rooms.findIndex(r => r.id === roomId);
  if (index >= 0) {
    config.rooms[index] = { ...config.rooms[index], ...roomConfig, id: roomId };
  } else {
    config.rooms.push({ id: roomId, ...roomConfig });
  }
  saveConfig(config);
}

// Remove sala da config
function deleteRoomConfig(roomId, config) {
  config.rooms = config.rooms.filter(r => r.id !== roomId);
  saveConfig(config);
}

module.exports = {
  loadConfig,
  saveConfig,
  getRoomConfig,
  updateRoomConfig,
  deleteRoomConfig,
  ensureConfigDir
};
