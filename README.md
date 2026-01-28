# 🤖 Arena Cup Discord Bot

Bot completo de administração para o servidor Discord do Arena Cup, com sistema de tickets, registro automático de players, comandos de administração e monitoramento de salas.

---

## ✨ Funcionalidades

### 🎮 Para Jogadores
- ✅ **Registro automático** ao entrar no servidor
- ✅ **Role de Player** atribuída automaticamente
- ✅ **Sistema de Tickets** para suporte
- ✅ **Perfil de jogador** com estatísticas
- ✅ **Comandos informativos** sobre salas e status
- ✅ **Registro de Auth do Haxball** para rastreamento

### 👑 Para Administradores
- ✅ **Comandos de moderação** (ban, kick)
- ✅ **Sistema de anúncios**
- ✅ **Gerenciamento de tickets**
- ✅ **Monitoramento de salas** em tempo real
- ✅ **Estatísticas do servidor**

### 🎫 Sistema de Tickets
- ✅ **Criação automática** de canais privados
- ✅ **Permissões configuradas** automaticamente
- ✅ **Botão para fechar** ticket
- ✅ **Histórico de tickets** salvo

---

## 🚀 Instalação

### 1. Criar o Bot no Discord

1. Acesse: https://discord.com/developers/applications
2. Clique em **"New Application"**
3. Dê um nome: **"Arena Cup Manager"**
4. Vá em **"Bot"** no menu lateral
5. Clique em **"Add Bot"**
6. Ative as seguintes **Privileged Gateway Intents**:
   - ✅ Presence Intent
   - ✅ Server Members Intent
   - ✅ Message Content Intent
7. Copie o **Token** (guarde com segurança!)

### 2. Convidar o Bot para o Servidor

1. Vá em **"OAuth2" > "URL Generator"**
2. Selecione os **Scopes**:
   - `bot`
   - `applications.commands`
3. Selecione as **Permissions**:
   - Administrator (ou configure manualmente as permissões abaixo)
   
**Permissões Necessárias:**
- Manage Channels
- Manage Roles
- Manage Webhooks
- Kick Members
- Ban Members
- Send Messages
- Manage Messages
- Embed Links
- Attach Files
- Read Message History
- Add Reactions
- Use Slash Commands

4. Copie a URL gerada e abra no navegador
5. Selecione seu servidor e autorize

### 3. Configurar o Servidor Discord

#### Criar Role "Player"
1. Configurações do Servidor > Roles
2. Criar nova role: **"Player"**
3. Copiar o ID da role (clique direito > Copiar ID)

#### Criar Categoria "Tickets"
1. Criar nova categoria: **"🎫 TICKETS"**
2. Configurar permissões:
   - @everyone: ❌ Ver Canal
   - @Admin: ✅ Ver Canal
   - Bot: ✅ Ver Canal
3. Copiar o ID da categoria

#### Criar Canal de Boas-Vindas (Opcional)
1. Criar canal: **"#bem-vindos"** ou **"#geral"**
2. O bot enviará mensagens de boas-vindas aqui

### 4. Instalar Dependências

```bash
cd discord-bot
npm install
```

### 5. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
nano .env
```

Preencha com suas informações:

```env
DISCORD_BOT_TOKEN=seu_token_do_bot_aqui
DISCORD_GUILD_ID=id_do_servidor_aqui
PLAYER_ROLE_ID=id_da_role_player_aqui
TICKETS_CATEGORY_ID=id_da_categoria_tickets_aqui
```

### 6. Iniciar o Bot

```bash
npm start
```

Ou com auto-reload (desenvolvimento):

```bash
npm run dev
```

---

## 📋 Comandos Disponíveis

### 🎮 Comandos de Jogador

| Comando | Descrição | Exemplo |
|---------|-----------|---------|
| `!ajuda` | Mostra lista de comandos | `!ajuda` |
| `!status` | Ver status das salas | `!status` |
| `!salas` | Ver informações das salas | `!salas` |
| `!perfil [@usuario]` | Ver perfil de jogador | `!perfil @João` |
| `!registrar <auth>` | Registrar Auth do Haxball | `!registrar abc123...` |
| `!stats` | Ver estatísticas gerais | `!stats` |
| `!ticket <mensagem>` | Abrir ticket de suporte | `!ticket Preciso de ajuda` |
| `!fecharticket` | Fechar ticket (dentro do canal) | `!fecharticket` |

### 👑 Comandos de Admin

| Comando | Descrição | Exemplo |
|---------|-----------|---------|
| `!ban @usuario <motivo>` | Banir usuário | `!ban @Troll Spam` |
| `!kick @usuario <motivo>` | Expulsar usuário | `!kick @Troll Comportamento` |
| `!anuncio <mensagem>` | Fazer anúncio oficial | `!anuncio Manutenção às 20h` |

---

## 🎫 Como Funciona o Sistema de Tickets

### Para Jogadores

1. **Abrir Ticket:**
   ```
   !ticket Preciso de ajuda com ban
   ```

2. **Um canal privado será criado:**
   - Nome: `ticket-seunome`
   - Apenas você, admins e o bot podem ver
   - Botão para fechar ticket

3. **Conversar com a equipe:**
   - Explique seu problema
   - Aguarde resposta da equipe

4. **Fechar Ticket:**
   - Clique no botão "Fechar Ticket"
   - Ou digite: `!fecharticket`

### Para Admins

1. **Ver tickets ativos:**
   - Vá até a categoria "🎫 TICKETS"
   - Todos os tickets abertos estarão lá

2. **Atender ticket:**
   - Entre no canal do ticket
   - Converse com o jogador

3. **Fechar ticket:**
   - Clique no botão "Fechar Ticket"
   - Ou digite: `!fecharticket`

---

## 🔄 Registro Automático de Players

### Como Funciona

1. **Novo membro entra no servidor**
   - Bot detecta automaticamente
   - Atribui role "Player"
   - Registra no banco de dados
   - Envia mensagem de boas-vindas

2. **Mensagem de Boas-Vindas**
   - Enviada no canal de boas-vindas
   - Enviada por DM para o usuário
   - Contém informações sobre salas e comandos

3. **Registro de Auth do Haxball**
   - Jogador usa: `!registrar <auth>`
   - Auth é salvo no banco de dados
   - Permite rastreamento de estatísticas

### Como Obter o Auth do Haxball

1. Entre em uma sala do Haxball
2. Abra o console (F12)
3. Digite qualquer comando no chat
4. Copie o Auth que aparece no console
5. Use: `!registrar <auth_copiado>`

---

## 📊 Monitoramento de Salas

O bot monitora o status das salas a cada 30 segundos:

- 🟢 **Online** - Sala funcionando
- 🔴 **Offline** - Sala fora do ar
- 👥 **Jogadores** - Quantidade atual/máxima

Use `!status` para ver em tempo real.

---

## 🗄️ Banco de Dados

O bot salva dados em `bot-data.json`:

```json
{
  "registeredPlayers": {
    "user_id": {
      "username": "João#1234",
      "joinedAt": "2026-01-28T...",
      "haxballAuth": "abc123...",
      "stats": {
        "gamesPlayed": 0,
        "wins": 0,
        "losses": 0
      }
    }
  },
  "activeTickets": {
    "channel_id": {
      "userId": "user_id",
      "channelId": "channel_id",
      "reason": "Preciso de ajuda",
      "createdAt": "2026-01-28T..."
    }
  },
  "roomStatus": {
    "x3-nivel": {
      "online": true,
      "players": 15,
      "maxPlayers": 30
    }
  }
}
```

---

## 🔧 Integração com Salas Haxball

Para integrar o bot com as salas Haxball, você pode:

### 1. Adicionar Webhooks para Chat da Sala

No arquivo `config.ts` das salas:

```typescript
webhooks: {
  join: process.env.WEBHOOK_X3_NIVEL_JOIN || "",
  leave: process.env.WEBHOOK_X3_NIVEL_LEAVE || "",
  game: process.env.WEBHOOK_X3_NIVEL_GAME || "",
  admin: process.env.WEBHOOK_X3_NIVEL_ADMIN || "",
  chat: process.env.WEBHOOK_X3_NIVEL_CHAT || ""  // Novo!
}
```

### 2. Enviar Mensagens do Chat para o Discord

No arquivo `index.ts`:

```typescript
room.onPlayerChat = function (player: PlayerObject, message: string): boolean {
  // Enviar para Discord
  if (config.webhooks && config.webhooks.chat) {
    sendDiscordWebhook(config.webhooks.chat, {
      content: `**${player.name}:** ${message}`
    });
  }
  
  // ... resto do código
}
```

---

## 🛠️ Manutenção

### Backup dos Dados

```bash
cp bot-data.json bot-data.backup.json
```

### Limpar Tickets Antigos

Os tickets são deletados automaticamente ao serem fechados.

### Ver Logs

```bash
# Se estiver rodando com pm2
pm2 logs arena-cup-bot

# Se estiver rodando com systemd
journalctl -u arena-cup-bot -f
```

---

## 🚀 Deploy em Produção

### Usando PM2

```bash
npm install -g pm2
pm2 start bot.js --name arena-cup-bot
pm2 save
pm2 startup
```

### Usando Systemd

Criar arquivo `/etc/systemd/system/arena-cup-bot.service`:

```ini
[Unit]
Description=Arena Cup Discord Bot
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/server/discord-bot
ExecStart=/usr/bin/node bot.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Ativar:

```bash
sudo systemctl enable arena-cup-bot
sudo systemctl start arena-cup-bot
sudo systemctl status arena-cup-bot
```

---

## ⚠️ Solução de Problemas

### Bot não responde a comandos

- ✅ Verifique se o **Message Content Intent** está ativado
- ✅ Verifique se o bot tem permissão de ler mensagens
- ✅ Verifique os logs do bot

### Tickets não são criados

- ✅ Verifique se `TICKETS_CATEGORY_ID` está correto
- ✅ Verifique se o bot tem permissão de criar canais
- ✅ Verifique se a categoria existe

### Role não é atribuída automaticamente

- ✅ Verifique se `PLAYER_ROLE_ID` está correto
- ✅ Verifique se o bot tem permissão de gerenciar roles
- ✅ Verifique se a role do bot está acima da role "Player"

### Bot desconecta constantemente

- ✅ Verifique sua conexão com a internet
- ✅ Verifique se o token está correto
- ✅ Verifique os logs para erros

---

## 🔒 Segurança

**⚠️ IMPORTANTE:**

- ❌ **NUNCA** compartilhe seu token do bot
- ❌ **NUNCA** faça commit do arquivo `.env`
- ✅ Adicione `.env` ao `.gitignore`
- ✅ Use variáveis de ambiente em produção
- ✅ Regenere o token se ele vazar

---

## 📞 Suporte

Se tiver problemas:

1. Verifique os logs do bot
2. Consulte a documentação do Discord.js: https://discord.js.org
3. Verifique as permissões do bot
4. Teste em um servidor de desenvolvimento primeiro

---

## 📝 Changelog

### v1.0.0 (28/01/2026)
- ✅ Sistema de tickets completo
- ✅ Registro automático de players
- ✅ Comandos de administração
- ✅ Monitoramento de salas
- ✅ Sistema de perfis e estatísticas
- ✅ Integração com Haxball Auth

---

## 📄 Licença

MIT License - Sinta-se livre para usar e modificar!

---

**Desenvolvido com ❤️ para a comunidade Arena Cup 🇧🇷**
