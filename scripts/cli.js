/**
 * Scripts úteis para gerenciar o bot via linha de comando
 * Use: node scripts/criar-sala.js
 */

const fs = require("fs");
const path = require("path");

const configManager = require("../config-manager.js");

const command = process.argv[2];
const args = process.argv.slice(3);

async function runCommand() {
  if (command === "criar-sala") {
    criarSala();
  } else if (command === "listar-salas") {
    listarSalas();
  } else if (command === "deletar-sala") {
    deletarSala();
  } else if (command === "help") {
    mostrarAjuda();
  } else {
    console.log("❌ Comando desconhecido. Use: node scripts/cli.js help");
  }
}

function criarSala() {
  if (args.length < 3) {
    console.log("❌ Uso: node scripts/cli.js criar-sala <id> <token> <nome>");
    process.exit(1);
  }

  const id = parseInt(args[0]);
  const token = args[1];
  const nome = args.slice(2).join(" ");

  let config = configManager.loadConfig();

  const novaConfig = {
    id,
    token,
    roomName: nome || `Futsal #${id}`,
    maxPlayers: 30,
    public: true,
    geo: { code: "BR" }
  };

  configManager.updateRoomConfig(id, novaConfig, config);
  console.log(`✅ Sala ${id} criada com sucesso!`);
  console.log(`   Nome: ${novaConfig.roomName}`);
  console.log(`   Token: ${token.substring(0, 10)}...`);
}

function listarSalas() {
  const config = configManager.loadConfig();
  
  if (config.rooms.length === 0) {
    console.log("❌ Nenhuma sala configurada.");
    return;
  }

  console.log("\n📋 Salas Configuradas:");
  console.log("─".repeat(60));
  
  config.rooms.forEach(room => {
    const hasToken = room.token && room.token !== "vazio" ? "✅" : "❌";
    console.log(`${hasToken} [ID ${room.id}] ${room.roomName}`);
    console.log(`   Max Players: ${room.maxPlayers} | Token: ${room.token.substring(0, 15)}...`);
  });
  
  console.log("─".repeat(60) + "\n");
}

function deletarSala() {
  if (args.length < 1) {
    console.log("❌ Uso: node scripts/cli.js deletar-sala <id>");
    process.exit(1);
  }

  const id = parseInt(args[0]);
  let config = configManager.loadConfig();
  
  const existe = config.rooms.find(r => r.id === id);
  if (!existe) {
    console.log(`❌ Sala ${id} não encontrada!`);
    process.exit(1);
  }

  configManager.deleteRoomConfig(id, config);
  console.log(`✅ Sala ${id} deletada com sucesso!`);
}

function mostrarAjuda() {
  console.log(`
╔════════════════════════════════════════════════════════╗
║         Haxball Bot - CLI de Gerenciamento             ║
╚════════════════════════════════════════════════════════╝

COMANDOS:

  criar-sala <id> <token> <nome>
    Cria uma nova sala com as configurações padrão
    Exemplo: node scripts/cli.js criar-sala 1 thr1.ABC... "Minha Sala"

  listar-salas
    Lista todas as salas configuradas
    Exemplo: node scripts/cli.js listar-salas

  deletar-sala <id>
    Deleta uma sala pelo ID
    Exemplo: node scripts/cli.js deletar-sala 1

  help
    Mostra esta mensagem de ajuda

EXEMPLOS DE TOKENS:
  Token deve começar com "thr1."
  Obtém em: https://www.haxball.com/headless

NOTAS:
  - Todas as mudanças são salvas em configs/default.json
  - Reinicie o servidor para carregar as mudanças
  - Use "npm start" para iniciar o servidor

  `);
}

runCommand().catch(err => {
  console.error("❌ Erro:", err.message);
  process.exit(1);
});
