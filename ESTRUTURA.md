# 📚 Documentação - Estrutura do Projeto

## 🏗️ Arquitetura

O projeto está organizado em módulos independentes e reutilizáveis:

### 1. **index.js** - Ponto de Entrada
```
├─ Carrega configuração
├─ Inicializa RoomManager
├─ Carrega salas configuradas
├─ Inicia API Server
└─ Exibe menu de boas-vindas
```

### 2. **config-manager.js** - Gerenciamento de Configurações
Responsável por:
- Carregar/salvar configurações em JSON
- Gerenciar configurações por sala
- Criar diretório de configs automaticamente

**Funções principais:**
- `loadConfig()` - Carrega a configuração
- `saveConfig(config)` - Salva a configuração
- `getRoomConfig(roomId, config)` - Obtém config de uma sala
- `updateRoomConfig(roomId, roomConfig, config)` - Atualiza config da sala
- `deleteRoomConfig(roomId, config)` - Remove sala da config

### 3. **room-manager.js** - Gerenciamento de Salas
Classe que gerencia o ciclo de vida das salas Haxball.

**Métodos principais:**
```javascript
- initialize()         // Inicializa HaxballJS
- createRoom()         // Cria nova sala
- deleteRoom()         // Deleta sala
- getRoom()            // Obtém sala
- getStatus()          // Status de todas as salas
- recreateRoom()       // Recria sala (útil para restart)
```

### 4. **api-server.js** - Servidor API REST
Classe Express com endpoints HTTP para gerenciar salas.

**Responsabilidades:**
- Autenticação via Bearer token
- Roteiros de CRUD para salas
- Integração com Discord
- Comandos administrativos

## 🔄 Fluxo de Execução

```
npm start
   ↓
index.js main()
   ↓
loadConfig() → configs/default.json
   ↓
RoomManager.initialize()
   ↓
Para cada room em config.rooms:
   └─ RoomManager.createRoom()
   └─ carregarLogicaFutsal()
   └─ room.onRoomLink()
   ↓
APIServer.start(port)
   ↓
🎮 Servidor pronto para uso
```

## 📝 Configuração (configs/default.json)

```json
{
  "version": "2.0.0",
  "port": 3002,
  "adminSecret": "token_secret_aqui",
  "rooms": [
    {
      "id": 1,
      "token": "thr1.AAABBBCCC...",
      "roomName": "Nome da Sala",
      "maxPlayers": 30,
      "public": true,
      "geo": { "code": "BR" }
    }
  ],
  "webhooks": {
    "1": {
      "chat": "url_webhook_discord",
      "denuncia": "url_webhook_discord",
      "join": "url_webhook_discord",
      "replay": "url_webhook_discord",
      "logs": "url_webhook_discord",
      "banlog": "url_webhook_discord"
    }
  }
}
```

## 🔒 Autenticação

Todos os endpoints que modificam salas requerem:
```
Authorization: Bearer {adminSecret}
```

Exemplo:
```bash
curl -H "Authorization: Bearer seu_secret_aqui" http://localhost:3002/rooms
```

## 📡 Endpoints

### Status (Sem autenticação)
```
GET /health
GET /status
```

### Gerenciamento de Salas (Com autenticação)
```
GET    /rooms
POST   /rooms
DELETE /rooms/:id
POST   /admin-command
POST   /discord-chat
```

## 🐳 Integração Pterodactyl

### Startup Command
```bash
npm install && npm start
```

### Variáveis de Ambiente
```
PORT=3002
ADMIN_SECRET=seu_secret_super_seguro
```

## 🎯 Casos de Uso

### 1. Criar Sala via API
```bash
curl -X POST http://localhost:3002/rooms \
  -H "Authorization: Bearer secret" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "roomName": "Minha Sala",
    "token": "thr1.ABC...",
    "maxPlayers": 30
  }'
```

### 2. Criar Sala via CLI
```bash
node scripts/cli.js criar-sala 1 "thr1.ABC..." "Minha Sala"
```

### 3. Listar Salas
```bash
curl http://localhost:3002/status
```

### 4. Reiniciar Sala
```bash
curl -X POST http://localhost:3002/admin-command \
  -H "Authorization: Bearer secret" \
  -H "Content-Type: application/json" \
  -d '{"roomId": 1, "command": "restart"}'
```

## ⚙️ Configuração Avançada

### Webhooks Discord

Configure em `configs/default.json`:

```json
"webhooks": {
  "1": {
    "chat": "https://discord.com/api/webhooks/...",
    "denuncia": "https://discord.com/api/webhooks/...",
    "join": "https://discord.com/api/webhooks/...",
    "replay": "https://discord.com/api/webhooks/...",
    "logs": "https://discord.com/api/webhooks/...",
    "banlog": "https://discord.com/api/webhooks/..."
  }
}
```

### Customizar Porta

Em `configs/default.json` ou variável `PORT`:
```json
"port": 3002
```

## 🚀 Deploy

### Desenvolvimento
```bash
npm install
npm start
```

### Produção (PM2)
```bash
npm install -g pm2
npm install
pm2 start index.js --name "haxball-bot"
pm2 startup
pm2 save
```

### Docker (Opcional)
```bash
docker run -d \
  -p 3002:3002 \
  -v $(pwd)/configs:/app/configs \
  -e ADMIN_SECRET=secret \
  node:16 npm start
```

## 📊 Monitoramento

### Ver Logs
```bash
npm start
# Ou com PM2:
pm2 logs haxball-bot
```

### Verificar Status
```bash
curl http://localhost:3002/health
```

## 🐛 Troubleshooting

### Sala não inicia
1. Verifique se o token é válido
2. Veja os logs para mensagens de erro
3. Teste o token em https://www.haxball.com/headless

### API retorna 403
- Verifique o `adminSecret`
- Confirme o header `Authorization: Bearer`

### Configuração não salva
- Verifique permissões da pasta `configs/`
- Confirme que o arquivo JSON é válido

## 📦 Dependências Principais

- **haxball.js** - Library do Haxball
- **express** - Framework HTTP
- **node-fetch** - HTTP client
- **form-data** - Multipart form data

## 🔗 Links Úteis

- [Documentação Haxball.js](https://github.com/haxball-community/haxball-js)
- [API Express.js](https://expressjs.com/)
- [Pterodactyl Panel](https://pterodactyl.io/)
- [Discord Webhooks](https://discord.com/developers/docs/resources/webhook)

---

**Última atualização:** January 2026
