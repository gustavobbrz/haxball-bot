const configManager = require("./config-manager.js");
const RoomManager = require("./room-manager.js");
const APIServer = require("./api-server.js");

async function main() {
  console.log("🚀 Iniciando servidor Haxball...");

  // Carrega configuração
  let config = configManager.loadConfig();
  console.log(`✅ Configuração carregada. Versão: ${config.version || "1.0"}`);

  // Inicializa gerenciador de salas
  const roomManager = new RoomManager(config);
  await roomManager.initialize();
  console.log("✅ Gerenciador de salas inicializado");

  // Inicia salas configuradas
  console.log(`📋 Iniciando ${config.rooms.length} sala(s)...`);
  for (const roomConfig of config.rooms) {
    if (roomConfig.token && roomConfig.token !== "vazio") {
      await roomManager.createRoom(roomConfig.id, roomConfig);
    }
  }

  // Inicia API REST
  const apiServer = new APIServer(roomManager, configManager, config);
  const port = config.port || 3002;
  apiServer.start(port);

  console.log("\n========================================");
  console.log("🎮 Servidor Haxball pronto para uso!");
  console.log("========================================");
  console.log(`Endpoints disponíveis:`);
  console.log(`  GET  /health             - Verificar status`);
  console.log(`  GET  /status             - Status de todas as salas`);
  console.log(`  GET  /rooms              - Listar salas`);
  console.log(`  POST /rooms              - Criar/atualizar sala`);
  console.log(`  DELETE /rooms/:id        - Deletar sala`);
  console.log(`  POST /discord-chat       - Enviar mensagem para sala`);
  console.log(`  POST /admin-command      - Executar comando`);
  console.log("========================================\n");
}

main().catch(err => {
  console.error("❌ Erro fatal:", err);
  process.exit(1);
});
