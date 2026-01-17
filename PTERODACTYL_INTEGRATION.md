/**
 * Guia de Integração com Pterodactyl Panel
 * 
 * Este arquivo contém exemplos de como integrar o Haxball Bot
 * com o Pterodactyl Panel para gerenciar salas via webhook
 */

// ==========================================
// 1. CONFIGURAÇÃO NO PTERODACTYL
// ==========================================

/*
1. No painel Pterodactyl, vá para:
   - Servers > Seu Servidor > Startup

2. Configure o Startup Command como:
   npm install && npm start

3. Configure as variáveis de ambiente:
   - PORT: 3002
   - ADMIN_SECRET: seu_secret_super_seguro

4. Salve e reinicie o servidor
*/

// ==========================================
// 2. CRIAR SALA VIA WEBHOOK
// ==========================================

const HAXBALL_API = "http://localhost:3002";
const ADMIN_SECRET = "seu_secret_super_seguro";

// Exemplo de função para criar sala
async function criarSalaPeloWebhook(roomData) {
  try {
    const response = await fetch(`${HAXBALL_API}/rooms`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ADMIN_SECRET}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: roomData.id,
        roomName: roomData.name,
        maxPlayers: roomData.maxPlayers || 30,
        token: roomData.token,
        public: true,
        geo: { code: "BR" }
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Sala criada: ${data.id}`);
      return data;
    } else {
      console.error(`❌ Erro ao criar sala: ${data.error}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Erro na requisição: ${error.message}`);
    return null;
  }
}

// ==========================================
// 3. EXEMPLO DE USO COM DISCORD BOT
// ==========================================

/*
// Em um Discord bot (usando discord.js):

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('criar_sala')
    .setDescription('Cria uma sala de Haxball')
    .addIntegerOption(option =>
      option.setName('id')
        .setDescription('ID da sala')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('token')
        .setDescription('Token Haxball')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('nome')
        .setDescription('Nome da sala')
        .setRequired(true)),

  async execute(interaction) {
    const id = interaction.options.getInteger('id');
    const token = interaction.options.getString('token');
    const nome = interaction.options.getString('nome');

    await interaction.deferReply();

    const resultado = await criarSalaPeloWebhook({
      id, token, name: nome
    });

    if (resultado) {
      await interaction.editReply(`✅ Sala criada com sucesso!`);
    } else {
      await interaction.editReply(`❌ Erro ao criar sala.`);
    }
  }
};
*/

// ==========================================
// 4. VERIFICAR STATUS
// ==========================================

async function verificarStatus() {
  try {
    const response = await fetch(`${HAXBALL_API}/status`);
    const data = await response.json();
    
    console.log("📊 Status das Salas:");
    data.rooms.forEach(room => {
      console.log(`  [Sala ${room.id}] ${room.players} jogadores online`);
    });
  } catch (error) {
    console.error(`❌ Erro ao verificar status: ${error.message}`);
  }
}

// ==========================================
// 5. REINICIAR SALA
// ==========================================

async function reiniciarSala(roomId) {
  try {
    const response = await fetch(`${HAXBALL_API}/admin-command`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ADMIN_SECRET}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        roomId: roomId,
        command: "restart"
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Sala ${roomId} reiniciada`);
    } else {
      console.error(`❌ Erro: ${data.error}`);
    }
  } catch (error) {
    console.error(`❌ Erro na requisição: ${error.message}`);
  }
}

// ==========================================
// 6. DELETAR SALA
// ==========================================

async function deletarSala(roomId) {
  try {
    const response = await fetch(`${HAXBALL_API}/rooms/${roomId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${ADMIN_SECRET}`
      }
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Sala ${roomId} deletada`);
    } else {
      console.error(`❌ Erro: ${data.error}`);
    }
  } catch (error) {
    console.error(`❌ Erro na requisição: ${error.message}`);
  }
}

// ==========================================
// 7. EXPORTAR PARA USO
// ==========================================

module.exports = {
  criarSalaPeloWebhook,
  verificarStatus,
  reiniciarSala,
  deletarSala
};

// ==========================================
// ENDPOINTS DISPONÍVEIS
// ==========================================

/*
GET /health
  - Verificar se servidor está vivo

GET /status
  - Ver todas as salas online

GET /rooms
  - Listar configuração de salas

POST /rooms
  - Criar/atualizar sala
  - Requer: Authorization: Bearer <ADMIN_SECRET>
  - Body: { id, roomName, maxPlayers, token, public, geo }

DELETE /rooms/:id
  - Deletar sala
  - Requer: Authorization: Bearer <ADMIN_SECRET>

POST /admin-command
  - Executar comando (restart, clearbans)
  - Requer: Authorization: Bearer <ADMIN_SECRET>
  - Body: { roomId, command }

POST /discord-chat
  - Enviar mensagem para sala
  - Body: { roomId, author, message }
*/
