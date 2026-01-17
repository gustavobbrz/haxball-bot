/**
 * Exemplo: Integração com Webhook do Pterodactyl
 * 
 * O Pterodactyl permite configurar webhooks que são chamados
 * em eventos como start, stop, crash do servidor.
 * 
 * Este arquivo contém exemplos de como usar isso
 */

// ==================================================
// 1. WEBHOOK PTERODACTYL - QUANDO SERVIDOR INICIA
// ==================================================

/*
Quando você configura um webhook no Pterodactyl, ele faz uma 
requisição HTTP para uma URL externa quando eventos ocorrem.

CONFIGURAÇÃO NO PTERODACTYL:
1. Vá em: Settings > Webhooks
2. Crie um novo webhook
3. Configure como:
   - URL: http://seu_dominio.com/webhook/pterodactyl
   - Events: Console Output
   - Secret: qualquer coisa

Payload recebido:
{
  "event": "console",
  "server": "uuid-do-servidor",
  "data": {
    "line": "[ROOM 1] ONLINE: https://www.haxball.com/?c=..."
  }
}
*/

// ==================================================
// 2. EXEMPLO DE SERVIDOR QUE RECEBE WEBHOOK
// ==================================================

const express = require('express');
const app = express();
app.use(express.json());

// Recebe webhook do Pterodactyl
app.post('/webhook/pterodactyl', (req, res) => {
  const event = req.body.event;
  const data = req.body.data;

  console.log(`📨 Webhook recebido: ${event}`);

  if (event === 'console') {
    const line = data.line;

    // Detecta quando sala fica online
    if (line.includes('ONLINE:')) {
      const roomId = line.match(/\[ROOM (\d+)\]/)?.[1];
      const roomLink = line.match(/ONLINE: (.+)/)?.[1];

      if (roomId && roomLink) {
        console.log(`✅ Sala ${roomId} ficou online!`);
        console.log(`   Link: ${roomLink}`);

        // Aqui você pode:
        // 1. Enviar notificação para Discord
        // 2. Notificar clientes via WebSocket
        // 3. Registrar em banco de dados
        // 4. Atualizar painel web
      }
    }

    // Detecta erros
    if (line.toLowerCase().includes('error')) {
      console.log(`❌ Erro detectado: ${line}`);
    }
  }

  res.status(200).json({ status: 'ok' });
});

// ==================================================
// 3. NOTIFICAR DISCORD QUANDO SALA FICA ONLINE
// ==================================================

const fetch = require('node-fetch');

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/SEU_WEBHOOK';

async function notificarSalaOnline(roomId, roomLink) {
  try {
    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: '🎮 Haxball Bot',
        avatar_url: 'https://cdn.discordapp.com/emojis/...',
        embeds: [{
          color: 0x00FF00,
          title: `✅ Sala ${roomId} Online!`,
          description: `[Clique aqui para entrar](${roomLink})`,
          timestamp: new Date().toISOString()
        }]
      })
    });

    console.log(`📨 Discord notificado!`);
  } catch (error) {
    console.error(`❌ Erro ao notificar Discord:`, error);
  }
}

// ==================================================
// 4. WORKFLOW COMPLETO - INICIAR SALA + NOTIFICAR
// ==================================================

/*
FLUXO:
1. Admin clica "Start" no Pterodactyl
2. Servidor Haxball inicia
3. Salas carregam e ficam online
4. Webhook detecta "ONLINE:" nos logs
5. Função notificarSalaOnline() é chamada
6. Mensagem enviada para Discord
7. Admin vê confirmação

CÓDIGO PARA ADICIONAR AO app.js:

app.post('/webhook/pterodactyl', async (req, res) => {
  const event = req.body.event;
  const data = req.body.data;

  if (event === 'console' && data.line.includes('ONLINE:')) {
    const roomId = data.line.match(/\[ROOM (\d+)\]/)?.[1];
    const roomLink = data.line.match(/ONLINE: (.+)/)?.[1];

    if (roomId && roomLink) {
      await notificarSalaOnline(roomId, roomLink);
    }
  }

  res.status(200).json({ status: 'ok' });
});
*/

// ==================================================
// 5. EXEMPLO AVANÇADO - WEBHOOK COM AUTENTICAÇÃO
// ==================================================

const crypto = require('crypto');

function verificarSignature(req, secret) {
  // O Pterodactyl envia um header X-Pterodactyl-Signature
  const signature = req.headers['x-pterodactyl-signature'];
  if (!signature) return false;

  // Calcular HMAC
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  return hmac === signature;
}

app.post('/webhook/pterodactyl-seguro', (req, res) => {
  const secret = 'seu_webhook_secret';

  if (!verificarSignature(req, secret)) {
    return res.status(401).json({ error: 'Assinatura inválida' });
  }

  // Webhook verificado, processar...
  console.log('✅ Webhook verificado!');

  res.status(200).json({ status: 'ok' });
});

// ==================================================
// 6. REGISTRAR EVENTOS EM BANCO DE DADOS
// ==================================================

/*
Se você tiver um banco de dados (MongoDB, PostgreSQL, etc),
pode registrar cada evento:

async function registrarEvento(event, data) {
  await Event.create({
    type: event,
    data: data,
    timestamp: new Date(),
    status: 'processado'
  });
}

app.post('/webhook/pterodactyl', async (req, res) => {
  const event = req.body.event;
  const data = req.body.data;

  // Registrar evento
  await registrarEvento(event, data);

  // Processar
  if (event === 'console' && data.line.includes('ONLINE:')) {
    const roomId = data.line.match(/\[ROOM (\d+)\]/)?.[1];
    const roomLink = data.line.match(/ONLINE: (.+)/)?.[1];
    if (roomId && roomLink) {
      await notificarSalaOnline(roomId, roomLink);
    }
  }

  res.status(200).json({ status: 'ok' });
});
*/

// ==================================================
// 7. VERIFICAR SAÚDE DO SERVIDOR VIA WEBHOOK
// ==================================================

/*
Pterodactyl pode enviar heartbeats periodicamente.
Use para verificar se o servidor está respondendo.

CONFIGURAR EM PTERODACTYL:
- Frequência: A cada 30 segundos
- Evento: Server Heartbeat

No código:
app.post('/webhook/pterodactyl', (req, res) => {
  if (req.body.event === 'console') {
    // Atualizar "last_heartbeat" no banco
    Server.findByIdAndUpdate(serverId, {
      last_heartbeat: new Date()
    });
  }

  res.status(200).json({ status: 'ok' });
});
*/

// ==================================================
// 8. INTEGRAÇÃO COM PAINEL WEB
// ==================================================

/*
Você pode usar WebSocket para notificar seu painel web
em tempo real quando salas ficam online.

// broadcast.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

function notificarClientes(event, data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ event, data }));
    }
  });
}

// Em app.js
app.post('/webhook/pterodactyl', (req, res) => {
  const event = req.body.event;
  const data = req.body.data;

  if (event === 'console' && data.line.includes('ONLINE:')) {
    // Notificar clientes conectados ao WebSocket
    notificarClientes('room_online', {
      roomId: data.line.match(/\[ROOM (\d+)\]/)?.[1],
      link: data.line.match(/ONLINE: (.+)/)?.[1]
    });
  }

  res.status(200).json({ status: 'ok' });
});
*/

module.exports = {
  notificarSalaOnline,
  verificarSignature
};

console.log(`
╔═════════════════════════════════════════════╗
║   Webhook do Pterodactyl Configurado       ║
║                                             ║
║   Endpoints:                                ║
║   POST /webhook/pterodactyl                 ║
║   POST /webhook/pterodactyl-seguro          ║
╚═════════════════════════════════════════════╝
`);
