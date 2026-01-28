// Bot de Administração do Discord - Arena Cup
// Gerencia salas, tickets, registro de players e comandos administrativos

const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Configurações
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || 'SEU_TOKEN_AQUI';
const GUILD_ID = process.env.DISCORD_GUILD_ID || 'SEU_GUILD_ID_AQUI';
const PLAYER_ROLE_ID = process.env.PLAYER_ROLE_ID || 'ID_ROLE_PLAYER';
const TICKETS_CATEGORY_ID = process.env.TICKETS_CATEGORY_ID || 'ID_CATEGORIA_TICKETS';

// Arquivo para armazenar dados
const DATA_FILE = path.join(__dirname, 'bot-data.json');

// Dados do bot (players registrados, tickets, etc)
let botData = {
  registeredPlayers: {},
  activeTickets: {},
  roomStatus: {
    'x3-nivel': { online: false, players: 0, maxPlayers: 30 },
    'x3-noobs': { online: false, players: 0, maxPlayers: 30 },
    'x1': { online: false, players: 0, maxPlayers: 20 },
    'x4': { online: false, players: 0, maxPlayers: 22 }
  }
};

// Carregar dados salvos
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      botData = { ...botData, ...JSON.parse(data) };
      console.log('✅ Dados carregados do arquivo');
    }
  } catch (error) {
    console.error('❌ Erro ao carregar dados:', error);
  }
}

// Salvar dados
function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(botData, null, 2));
  } catch (error) {
    console.error('❌ Erro ao salvar dados:', error);
  }
}

// Criar cliente do Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ]
});

// Quando o bot estiver pronto
client.once('ready', () => {
  console.log('═══════════════════════════════════════');
  console.log(`🤖 Bot conectado: ${client.user.tag}`);
  console.log('═══════════════════════════════════════');
  
  loadData();
  
  // Atualizar status do bot
  client.user.setActivity('Arena Cup | !ajuda', { type: 'WATCHING' });
  
  // Verificar status das salas a cada 30 segundos
  setInterval(checkRoomStatus, 30000);
});

// Quando um novo membro entrar no servidor
client.on('guildMemberAdd', async (member) => {
  console.log(`👤 Novo membro: ${member.user.tag}`);
  
  try {
    // Dar role de player automaticamente
    const playerRole = member.guild.roles.cache.get(PLAYER_ROLE_ID);
    if (playerRole) {
      await member.roles.add(playerRole);
      console.log(`✅ Role "Player" adicionada para ${member.user.tag}`);
    }
    
    // Registrar player
    botData.registeredPlayers[member.id] = {
      username: member.user.tag,
      joinedAt: new Date().toISOString(),
      haxballAuth: null,
      stats: {
        gamesPlayed: 0,
        wins: 0,
        losses: 0
      }
    };
    saveData();
    
    // Enviar mensagem de boas-vindas
    const welcomeEmbed = new EmbedBuilder()
      .setColor(0x00FF00)
      .setTitle('🎉 Bem-vindo ao Arena Cup!')
      .setDescription(`Olá ${member.user}, seja bem-vindo ao nosso servidor!`)
      .addFields(
        { name: '🎮 Salas Disponíveis', value: 'X3 NIVEL, X3 NOOBS, X1, X4', inline: false },
        { name: '📋 Comandos', value: 'Digite `!ajuda` para ver todos os comandos', inline: false },
        { name: '🎫 Precisa de Ajuda?', value: 'Use `!ticket` para abrir um ticket de suporte', inline: false }
      )
      .setTimestamp();
    
    // Enviar no canal de boas-vindas (se existir)
    const welcomeChannel = member.guild.channels.cache.find(ch => ch.name === 'bem-vindos' || ch.name === 'geral');
    if (welcomeChannel) {
      await welcomeChannel.send({ embeds: [welcomeEmbed] });
    }
    
    // Enviar DM para o usuário
    try {
      await member.send({ embeds: [welcomeEmbed] });
    } catch (error) {
      console.log('❌ Não foi possível enviar DM para o usuário');
    }
    
  } catch (error) {
    console.error('❌ Erro ao processar novo membro:', error);
  }
});

// Quando uma mensagem for enviada
client.on('messageCreate', async (message) => {
  // Ignorar mensagens de bots
  if (message.author.bot) return;
  
  // Verificar se é um comando
  if (!message.content.startsWith('!')) return;
  
  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  
  // Processar comandos
  try {
    switch (command) {
      case 'ajuda':
      case 'help':
        await handleHelpCommand(message);
        break;
        
      case 'status':
        await handleStatusCommand(message);
        break;
        
      case 'salas':
      case 'rooms':
        await handleRoomsCommand(message);
        break;
        
      case 'ticket':
        await handleTicketCommand(message, args);
        break;
        
      case 'fecharticket':
      case 'closeticket':
        await handleCloseTicketCommand(message);
        break;
        
      case 'perfil':
      case 'profile':
        await handleProfileCommand(message, args);
        break;
        
      case 'registrar':
      case 'register':
        await handleRegisterCommand(message, args);
        break;
        
      case 'stats':
      case 'estatisticas':
        await handleStatsCommand(message);
        break;
        
      // Comandos de Admin
      case 'ban':
        if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
          return message.reply('❌ Você não tem permissão para usar este comando!');
        }
        await handleBanCommand(message, args);
        break;
        
      case 'kick':
        if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
          return message.reply('❌ Você não tem permissão para usar este comando!');
        }
        await handleKickCommand(message, args);
        break;
        
      case 'anuncio':
      case 'announce':
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
          return message.reply('❌ Você não tem permissão para usar este comando!');
        }
        await handleAnnounceCommand(message, args);
        break;
        
      default:
        // Comando não reconhecido
        break;
    }
  } catch (error) {
    console.error(`❌ Erro ao processar comando ${command}:`, error);
    message.reply('❌ Ocorreu um erro ao processar seu comando. Tente novamente mais tarde.');
  }
});

// Comando: !ajuda
async function handleHelpCommand(message) {
  const embed = new EmbedBuilder()
    .setColor(0x00FFFF)
    .setTitle('📋 Comandos do Arena Cup Bot')
    .setDescription('Lista de comandos disponíveis')
    .addFields(
      { 
        name: '🎮 Comandos de Jogador', 
        value: '`!status` - Ver status das salas\n`!salas` - Ver informações das salas\n`!perfil [@usuario]` - Ver perfil de jogador\n`!registrar <auth>` - Registrar seu Auth do Haxball\n`!stats` - Ver suas estatísticas\n`!ticket <mensagem>` - Abrir ticket de suporte', 
        inline: false 
      },
      { 
        name: '👑 Comandos de Admin', 
        value: '`!ban @usuario <motivo>` - Banir usuário\n`!kick @usuario <motivo>` - Expulsar usuário\n`!anuncio <mensagem>` - Fazer anúncio', 
        inline: false 
      },
      { 
        name: '🎫 Sistema de Tickets', 
        value: 'Use `!ticket` para abrir um ticket de suporte. Um canal privado será criado para você conversar com a equipe.', 
        inline: false 
      }
    )
    .setFooter({ text: 'Arena Cup - Bot de Administração' })
    .setTimestamp();
  
  await message.reply({ embeds: [embed] });
}

// Comando: !status
async function handleStatusCommand(message) {
  const embed = new EmbedBuilder()
    .setColor(0x00FF00)
    .setTitle('📊 Status das Salas')
    .setDescription('Status atual de todas as salas do Arena Cup')
    .setTimestamp();
  
  for (const [roomName, status] of Object.entries(botData.roomStatus)) {
    const statusEmoji = status.online ? '🟢' : '🔴';
    const statusText = status.online ? 'Online' : 'Offline';
    
    embed.addFields({
      name: `${statusEmoji} ${roomName.toUpperCase()}`,
      value: `Status: **${statusText}**\nJogadores: **${status.players}/${status.maxPlayers}**`,
      inline: true
    });
  }
  
  await message.reply({ embeds: [embed] });
}

// Comando: !salas
async function handleRoomsCommand(message) {
  const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('🎮 Salas Disponíveis')
    .setDescription('Informações sobre as salas do Arena Cup')
    .addFields(
      { name: '🔥 X3 NIVEL', value: 'Sala para jogadores experientes (3x3)\nMáx: 30 jogadores', inline: true },
      { name: '🌱 X3 NOOBS', value: 'Sala para iniciantes (3x3)\nMáx: 30 jogadores', inline: true },
      { name: '⚔️ X1', value: 'Sala para duelos 1v1\nMáx: 20 jogadores', inline: true },
      { name: '🏟️ X4', value: 'Sala para partidas grandes (4x4)\nMáx: 22 jogadores', inline: true }
    )
    .setFooter({ text: 'Use !status para ver o status atual das salas' })
    .setTimestamp();
  
  await message.reply({ embeds: [embed] });
}

// Comando: !ticket
async function handleTicketCommand(message, args) {
  const reason = args.join(' ') || 'Sem motivo especificado';
  
  try {
    const guild = message.guild;
    const ticketCategory = guild.channels.cache.get(TICKETS_CATEGORY_ID);
    
    if (!ticketCategory) {
      return message.reply('❌ Categoria de tickets não configurada! Contate um administrador.');
    }
    
    // Verificar se o usuário já tem um ticket aberto
    const existingTicket = Object.values(botData.activeTickets).find(t => t.userId === message.author.id);
    if (existingTicket) {
      return message.reply(`❌ Você já tem um ticket aberto: <#${existingTicket.channelId}>`);
    }
    
    // Criar canal do ticket
    const ticketChannel = await guild.channels.create({
      name: `ticket-${message.author.username}`,
      type: ChannelType.GuildText,
      parent: ticketCategory,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [PermissionFlagsBits.ViewChannel]
        },
        {
          id: message.author.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
        },
        {
          id: client.user.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
        }
      ]
    });
    
    // Adicionar permissão para admins
    const adminRole = guild.roles.cache.find(role => role.permissions.has(PermissionFlagsBits.Administrator));
    if (adminRole) {
      await ticketChannel.permissionOverwrites.create(adminRole, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true
      });
    }
    
    // Salvar ticket
    botData.activeTickets[ticketChannel.id] = {
      userId: message.author.id,
      channelId: ticketChannel.id,
      reason: reason,
      createdAt: new Date().toISOString()
    };
    saveData();
    
    // Enviar mensagem no canal do ticket
    const ticketEmbed = new EmbedBuilder()
      .setColor(0xFFFF00)
      .setTitle('🎫 Ticket de Suporte')
      .setDescription(`Ticket criado por ${message.author}`)
      .addFields(
        { name: 'Motivo', value: reason, inline: false },
        { name: 'Instruções', value: 'Um membro da equipe irá atendê-lo em breve.\nPara fechar este ticket, use `!fecharticket`', inline: false }
      )
      .setTimestamp();
    
    const closeButton = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('close_ticket')
          .setLabel('Fechar Ticket')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('🔒')
      );
    
    await ticketChannel.send({ embeds: [ticketEmbed], components: [closeButton] });
    
    // Confirmar criação
    await message.reply(`✅ Ticket criado! Acesse: ${ticketChannel}`);
    
  } catch (error) {
    console.error('❌ Erro ao criar ticket:', error);
    message.reply('❌ Erro ao criar ticket. Tente novamente mais tarde.');
  }
}

// Comando: !fecharticket
async function handleCloseTicketCommand(message) {
  const ticket = botData.activeTickets[message.channel.id];
  
  if (!ticket) {
    return message.reply('❌ Este não é um canal de ticket!');
  }
  
  try {
    // Enviar mensagem de encerramento
    const closeEmbed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle('🔒 Ticket Fechado')
      .setDescription('Este ticket será deletado em 5 segundos...')
      .setTimestamp();
    
    await message.channel.send({ embeds: [closeEmbed] });
    
    // Aguardar 5 segundos e deletar
    setTimeout(async () => {
      delete botData.activeTickets[message.channel.id];
      saveData();
      await message.channel.delete();
    }, 5000);
    
  } catch (error) {
    console.error('❌ Erro ao fechar ticket:', error);
    message.reply('❌ Erro ao fechar ticket.');
  }
}

// Comando: !perfil
async function handleProfileCommand(message, args) {
  const targetUser = message.mentions.users.first() || message.author;
  const playerData = botData.registeredPlayers[targetUser.id];
  
  if (!playerData) {
    return message.reply('❌ Este jogador não está registrado!');
  }
  
  const embed = new EmbedBuilder()
    .setColor(0x9B59B6)
    .setTitle(`👤 Perfil de ${targetUser.username}`)
    .setThumbnail(targetUser.displayAvatarURL())
    .addFields(
      { name: 'Discord', value: targetUser.tag, inline: true },
      { name: 'Registrado em', value: new Date(playerData.joinedAt).toLocaleDateString('pt-BR'), inline: true },
      { name: 'Auth Haxball', value: playerData.haxballAuth || 'Não registrado', inline: false },
      { name: '📊 Estatísticas', value: `Partidas: ${playerData.stats.gamesPlayed}\nVitórias: ${playerData.stats.wins}\nDerrotas: ${playerData.stats.losses}`, inline: false }
    )
    .setTimestamp();
  
  await message.reply({ embeds: [embed] });
}

// Comando: !registrar
async function handleRegisterCommand(message, args) {
  if (args.length === 0) {
    return message.reply('❌ Uso: `!registrar <seu_auth_haxball>`\n\nPara obter seu Auth, entre em uma sala e digite qualquer comando no chat. O Auth aparecerá no console (F12).');
  }
  
  const auth = args[0];
  
  if (!botData.registeredPlayers[message.author.id]) {
    botData.registeredPlayers[message.author.id] = {
      username: message.author.tag,
      joinedAt: new Date().toISOString(),
      haxballAuth: auth,
      stats: { gamesPlayed: 0, wins: 0, losses: 0 }
    };
  } else {
    botData.registeredPlayers[message.author.id].haxballAuth = auth;
  }
  
  saveData();
  
  const embed = new EmbedBuilder()
    .setColor(0x00FF00)
    .setTitle('✅ Auth Registrado!')
    .setDescription(`Seu Auth do Haxball foi registrado com sucesso!`)
    .addFields(
      { name: 'Auth', value: `\`${auth}\``, inline: false },
      { name: 'Benefícios', value: '• Suas estatísticas serão rastreadas\n• Você receberá notificações personalizadas\n• Acesso a comandos exclusivos', inline: false }
    )
    .setTimestamp();
  
  await message.reply({ embeds: [embed] });
}

// Comando: !stats
async function handleStatsCommand(message) {
  const embed = new EmbedBuilder()
    .setColor(0x3498DB)
    .setTitle('📊 Estatísticas Gerais do Arena Cup')
    .addFields(
      { name: '👥 Players Registrados', value: Object.keys(botData.registeredPlayers).length.toString(), inline: true },
      { name: '🎫 Tickets Ativos', value: Object.keys(botData.activeTickets).length.toString(), inline: true },
      { name: '🎮 Salas Online', value: Object.values(botData.roomStatus).filter(s => s.online).length.toString(), inline: true }
    )
    .setTimestamp();
  
  await message.reply({ embeds: [embed] });
}

// Comando: !ban (Admin)
async function handleBanCommand(message, args) {
  const targetUser = message.mentions.users.first();
  if (!targetUser) {
    return message.reply('❌ Mencione um usuário para banir!');
  }
  
  const reason = args.slice(1).join(' ') || 'Sem motivo especificado';
  
  try {
    const member = message.guild.members.cache.get(targetUser.id);
    await member.ban({ reason });
    
    const embed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle('🔨 Usuário Banido')
      .addFields(
        { name: 'Usuário', value: targetUser.tag, inline: true },
        { name: 'Admin', value: message.author.tag, inline: true },
        { name: 'Motivo', value: reason, inline: false }
      )
      .setTimestamp();
    
    await message.reply({ embeds: [embed] });
  } catch (error) {
    console.error('❌ Erro ao banir:', error);
    message.reply('❌ Erro ao banir usuário.');
  }
}

// Comando: !kick (Admin)
async function handleKickCommand(message, args) {
  const targetUser = message.mentions.users.first();
  if (!targetUser) {
    return message.reply('❌ Mencione um usuário para expulsar!');
  }
  
  const reason = args.slice(1).join(' ') || 'Sem motivo especificado';
  
  try {
    const member = message.guild.members.cache.get(targetUser.id);
    await member.kick(reason);
    
    const embed = new EmbedBuilder()
      .setColor(0xFFA500)
      .setTitle('👢 Usuário Expulso')
      .addFields(
        { name: 'Usuário', value: targetUser.tag, inline: true },
        { name: 'Admin', value: message.author.tag, inline: true },
        { name: 'Motivo', value: reason, inline: false }
      )
      .setTimestamp();
    
    await message.reply({ embeds: [embed] });
  } catch (error) {
    console.error('❌ Erro ao expulsar:', error);
    message.reply('❌ Erro ao expulsar usuário.');
  }
}

// Comando: !anuncio (Admin)
async function handleAnnounceCommand(message, args) {
  if (args.length === 0) {
    return message.reply('❌ Uso: `!anuncio <mensagem>`');
  }
  
  const announcement = args.join(' ');
  
  const embed = new EmbedBuilder()
    .setColor(0xFFD700)
    .setTitle('📢 Anúncio Oficial')
    .setDescription(announcement)
    .setFooter({ text: `Anunciado por ${message.author.tag}` })
    .setTimestamp();
  
  await message.channel.send({ embeds: [embed] });
  await message.delete();
}

// Verificar status das salas (simulado - você pode integrar com API real)
async function checkRoomStatus() {
  // Aqui você pode fazer requisições HTTP para verificar o status real das salas
  // Por enquanto, vamos simular
  console.log('🔄 Verificando status das salas...');
  
  // Exemplo: você pode fazer requisições para os IPs das salas
  // ou verificar através de webhooks/API
}

// Lidar com interações de botões
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;
  
  if (interaction.customId === 'close_ticket') {
    const ticket = botData.activeTickets[interaction.channel.id];
    
    if (!ticket) {
      return interaction.reply({ content: '❌ Este não é um canal de ticket!', ephemeral: true });
    }
    
    // Verificar se é o dono do ticket ou admin
    if (interaction.user.id !== ticket.userId && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: '❌ Você não tem permissão para fechar este ticket!', ephemeral: true });
    }
    
    await interaction.reply('🔒 Fechando ticket...');
    
    setTimeout(async () => {
      delete botData.activeTickets[interaction.channel.id];
      saveData();
      await interaction.channel.delete();
    }, 3000);
  }
});

// Login do bot
client.login(BOT_TOKEN).catch(error => {
  console.error('❌ Erro ao fazer login:', error);
  process.exit(1);
});

// Tratamento de erros
process.on('unhandledRejection', error => {
  console.error('❌ Erro não tratado:', error);
});

// Salvar dados ao encerrar
process.on('SIGINT', () => {
  console.log('\n💾 Salvando dados...');
  saveData();
  console.log('👋 Bot desligado!');
  process.exit(0);
});
