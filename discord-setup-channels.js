// Script para criar canais adicionais e webhooks no Discord
// Adiciona: #denuncias e #chat-sala para cada categoria de sala

const https = require('https');
const fs = require('fs');
const path = require('path');

// CONFIGURAÇÕES - PREENCHA COM SUAS INFORMAÇÕES
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || 'SEU_TOKEN_DO_BOT_AQUI';
const GUILD_ID = process.env.DISCORD_GUILD_ID || 'SEU_GUILD_ID_AQUI';

// Categorias das salas (você precisa pegar os IDs das categorias no Discord)
const CATEGORIES = {
  'x3-nivel': process.env.CATEGORY_X3_NIVEL || 'ID_CATEGORIA_X3_NIVEL',
  'x3-noobs': process.env.CATEGORY_X3_NOOBS || 'ID_CATEGORIA_X3_NOOBS',
  'x1': process.env.CATEGORY_X1 || 'ID_CATEGORIA_X1',
  'x4': process.env.CATEGORY_X4 || 'ID_CATEGORIA_X4'
};

// Função para fazer requisições à API do Discord
function discordRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'discord.com',
      path: `/api/v10${endpoint}`,
      method: method,
      headers: {
        'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body || '{}'));
        } else {
          reject(new Error(`Discord API Error ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// Criar canal no Discord
async function createChannel(guildId, channelName, categoryId, channelType = 0) {
  console.log(`📝 Criando canal: ${channelName}`);
  
  const channelData = {
    name: channelName,
    type: channelType, // 0 = text channel
    parent_id: categoryId
  };

  try {
    const channel = await discordRequest('POST', `/guilds/${guildId}/channels`, channelData);
    console.log(`✅ Canal criado: ${channel.name} (ID: ${channel.id})`);
    return channel;
  } catch (error) {
    console.error(`❌ Erro ao criar canal ${channelName}:`, error.message);
    return null;
  }
}

// Criar webhook para um canal
async function createWebhook(channelId, webhookName) {
  console.log(`🔗 Criando webhook: ${webhookName}`);
  
  const webhookData = {
    name: webhookName
  };

  try {
    const webhook = await discordRequest('POST', `/channels/${channelId}/webhooks`, webhookData);
    console.log(`✅ Webhook criado: ${webhook.name}`);
    console.log(`   URL: ${webhook.url}`);
    return webhook;
  } catch (error) {
    console.error(`❌ Erro ao criar webhook ${webhookName}:`, error.message);
    return null;
  }
}

// Atualizar arquivo .env com novos webhooks
function updateEnvFile(webhooks) {
  const envPath = path.join(__dirname, '.env');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Adicionar novos webhooks ao arquivo
  envContent += '\n\n# Webhooks adicionais - Gerado automaticamente\n';
  
  for (const [key, url] of Object.entries(webhooks)) {
    envContent += `${key}="${url}"\n`;
  }

  fs.writeFileSync(envPath, envContent);
  console.log('\n✅ Arquivo .env atualizado com novos webhooks!');
}

// Função principal
async function setupChannels() {
  console.log('🚀 Iniciando configuração de canais do Discord...\n');

  const newWebhooks = {};

  for (const [roomType, categoryId] of Object.entries(CATEGORIES)) {
    console.log(`\n📂 Configurando categoria: ${roomType.toUpperCase()}`);
    console.log(`   ID da Categoria: ${categoryId}\n`);

    // Criar canal de denúncias
    const denunciasChannel = await createChannel(
      GUILD_ID,
      `${roomType}-denuncias`,
      categoryId,
      0
    );

    if (denunciasChannel) {
      const denunciasWebhook = await createWebhook(
        denunciasChannel.id,
        `Denúncias ${roomType.toUpperCase()}`
      );
      
      if (denunciasWebhook) {
        const webhookKey = `WEBHOOK_${roomType.toUpperCase().replace('-', '_')}_DENUNCIAS`;
        newWebhooks[webhookKey] = denunciasWebhook.url;
      }
    }

    // Aguardar um pouco para evitar rate limit
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Criar canal de chat da sala
    const chatChannel = await createChannel(
      GUILD_ID,
      `${roomType}-chat-sala`,
      categoryId,
      0
    );

    if (chatChannel) {
      const chatWebhook = await createWebhook(
        chatChannel.id,
        `Chat ${roomType.toUpperCase()}`
      );
      
      if (chatWebhook) {
        const webhookKey = `WEBHOOK_${roomType.toUpperCase().replace('-', '_')}_CHAT`;
        newWebhooks[webhookKey] = chatWebhook.url;
      }
    }

    // Aguardar um pouco para evitar rate limit
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Atualizar arquivo .env
  if (Object.keys(newWebhooks).length > 0) {
    updateEnvFile(newWebhooks);
  }

  console.log('\n✨ Configuração concluída!');
  console.log('\n📋 Resumo dos webhooks criados:');
  for (const [key, url] of Object.entries(newWebhooks)) {
    console.log(`   ${key}: ${url.substring(0, 50)}...`);
  }
}

// Verificar se as variáveis necessárias estão configuradas
if (DISCORD_BOT_TOKEN === 'SEU_TOKEN_DO_BOT_AQUI' || GUILD_ID === 'SEU_GUILD_ID_AQUI') {
  console.error('❌ ERRO: Configure as variáveis de ambiente primeiro!');
  console.error('\nDefina as seguintes variáveis:');
  console.error('  - DISCORD_BOT_TOKEN: Token do seu bot do Discord');
  console.error('  - DISCORD_GUILD_ID: ID do servidor Discord');
  console.error('  - CATEGORY_X3_NIVEL: ID da categoria X3 NIVEL');
  console.error('  - CATEGORY_X3_NOOBS: ID da categoria X3 NOOBS');
  console.error('  - CATEGORY_X1: ID da categoria X1');
  console.error('  - CATEGORY_X4: ID da categoria X4');
  console.error('\nExemplo:');
  console.error('  export DISCORD_BOT_TOKEN="seu_token_aqui"');
  console.error('  export DISCORD_GUILD_ID="seu_guild_id_aqui"');
  console.error('  node discord-setup-channels.js');
  process.exit(1);
}

// Executar
setupChannels().catch(error => {
  console.error('\n❌ Erro fatal:', error);
  process.exit(1);
});
