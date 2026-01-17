# ⚡ REFERÊNCIA RÁPIDA - HAXBALL BOT

## 🎯 INÍCIO RÁPIDO (Copie e cole)

### 1. Instalar
```bash
npm install
```

### 2. Criar Sala
```bash
node scripts/cli.js criar-sala 1 "thr1.SEU_TOKEN" "Minha Sala"
```

### 3. Iniciar
```bash
npm start
```

**Pronto!** Procure nos logs por: `[ROOM 1] ONLINE:`

---

## 📡 COMANDOS API

### Criar Sala
```bash
curl -X POST http://localhost:3002/rooms \
  -H "Authorization: Bearer seu_secret" \
  -H "Content-Type: application/json" \
  -d '{"id": 1, "token": "thr1.ABC", "roomName": "Sala", "maxPlayers": 30}'
```

### Ver Status
```bash
curl http://localhost:3002/status
```

### Reiniciar Sala
```bash
curl -X POST http://localhost:3002/admin-command \
  -H "Authorization: Bearer seu_secret" \
  -H "Content-Type: application/json" \
  -d '{"roomId": 1, "command": "restart"}'
```

### Deletar Sala
```bash
curl -X DELETE http://localhost:3002/rooms/1 \
  -H "Authorization: Bearer seu_secret"
```

### Limpar Bans
```bash
curl -X POST http://localhost:3002/admin-command \
  -H "Authorization: Bearer seu_secret" \
  -H "Content-Type: application/json" \
  -d '{"roomId": 1, "command": "clearbans"}'
```

---

## 🖥️ COMANDOS CLI

```bash
# Listar salas
node scripts/cli.js listar-salas

# Criar sala
node scripts/cli.js criar-sala 1 "thr1.TOKEN" "Nome Sala"

# Deletar sala
node scripts/cli.js deletar-sala 1

# Ajuda
node scripts/cli.js help
```

---

## 📁 ARQUIVOS IMPORTANTES

| Arquivo | Descrição |
|---------|-----------|
| `index.js` | Ponto de entrada |
| `config-manager.js` | Gerencia configs |
| `room-manager.js` | Gerencia salas |
| `api-server.js` | Servidor HTTP |
| `configs/default.json` | Configuração |
| `scripts/cli.js` | CLI |

---

## 🐳 PTERODACTYL

### Startup Command
```
npm install && npm start
```

### Variáveis
```
PORT=3002
ADMIN_SECRET=seu_secret_super_seguro
```

### Usar API
```bash
curl -X POST http://seu_ip:3002/rooms \
  -H "Authorization: Bearer seu_secret" \
  -H "Content-Type: application/json" \
  -d '{"id": 1, "token": "thr1.ABC", "roomName": "Sala"}'
```

---

## 🔧 CONFIGURAÇÃO

Edite `configs/default.json`:

```json
{
  "port": 3002,
  "adminSecret": "seu_secret",
  "rooms": [
    {
      "id": 1,
      "token": "thr1.ABC...",
      "roomName": "Minha Sala",
      "maxPlayers": 30,
      "public": true,
      "geo": { "code": "BR" }
    }
  ]
}
```

---

## 📊 ENDPOINTS

```
GET  /health              Status do servidor
GET  /status              Salas online
GET  /rooms               Listar salas (auth)
POST /rooms               Criar sala (auth)
DELETE /rooms/:id         Deletar (auth)
POST /admin-command       Comando (auth)
POST /discord-chat        Mensagem Discord
```

---

## 🔒 AUTENTICAÇÃO

Todos os endpoints privados requerem:

```bash
-H "Authorization: Bearer seu_secret"
```

---

## 🆘 ERROS COMUNS

### Sala não inicia
```bash
# Verificar token em configs/default.json
# Token começa com thr1.?
# Obter novo: https://www.haxball.com/headless
```

### API retorna 403
```bash
# Verificar adminSecret
# Header correto: Authorization: Bearer secret
```

### Porta em uso
```bash
# Alterar PORT em configs/default.json
# Ou: PORT=3003 npm start
```

---

## 📚 DOCUMENTAÇÃO

| Para... | Leia |
|---|---|
| Começar rápido | QUICKSTART.md |
| Entender tudo | README.md |
| Detalhes técnicos | ESTRUTURA.md |
| Pterodactyl | PTERODACTYL_INTEGRATION.md |
| Exemplos API | EXEMPLOS_API.http |
| Visualmente | DIAGRAMA_ARQUITETURA.md |

---

## 💡 DICAS

### Testar localmente
```bash
npm start
# Em outro terminal:
curl http://localhost:3002/status
```

### Ver logs
```bash
npm start
# Procure por: [ROOM X] ONLINE
# Ou: Error
```

### Criar múltiplas salas
```bash
node scripts/cli.js criar-sala 1 "token1" "Sala 1"
node scripts/cli.js criar-sala 2 "token2" "Sala 2"
npm start
```

---

## 🚀 DEPLOY PTERODACTYL

1. Clone o repositório
2. Configure Startup: `npm install && npm start`
3. Configure variáveis (PORT, ADMIN_SECRET)
4. Clique Start
5. Crie salas via API

---

## ⚙️ CONFIG JSON

```json
{
  "version": "2.0.0",
  "port": 3002,
  "adminSecret": "seu_secret_aqui",
  "rooms": [
    {
      "id": 1,
      "token": "thr1.SEU_TOKEN",
      "roomName": "Nome Sala",
      "maxPlayers": 30,
      "public": true,
      "geo": { "code": "BR" }
    }
  ],
  "webhooks": {
    "1": {
      "chat": "https://discord.com/api/webhooks/...",
      "denuncia": null,
      "join": null,
      "replay": null,
      "logs": null,
      "banlog": null
    }
  }
}
```

---

## 📖 COMANDOS RÁPIDOS

```bash
# Instalar tudo
npm install

# Iniciar servidor
npm start

# Ver status
curl http://localhost:3002/status

# Criar sala
node scripts/cli.js criar-sala 1 "thr1.ABC" "Sala"

# Listar salas
node scripts/cli.js listar-salas

# Deletar sala
node scripts/cli.js deletar-sala 1

# Ajuda CLI
node scripts/cli.js help
```

---

## 🎯 FLUXO TÍPICO

```
1. npm install              ← Instalar deps
2. npm start                ← Iniciar servidor
3. Criar sala (API ou CLI)  ← Sala sobe
4. curl /status             ← Verificar
5. Compartilhar link        ← Pronto!
```

---

## 🔄 REINICIAR SALA

### Via API
```bash
curl -X POST http://localhost:3002/admin-command \
  -H "Authorization: Bearer secret" \
  -H "Content-Type: application/json" \
  -d '{"roomId": 1, "command": "restart"}'
```

### Via CLI
```bash
# Deletar e recriar
node scripts/cli.js deletar-sala 1
# Editar configs/default.json
npm start
```

---

## 📊 STATUS

```bash
# Verificar vivo
curl http://localhost:3002/health

# Ver todas as salas e jogadores
curl http://localhost:3002/status

# Resposta:
# {"online": true, "rooms": [{"id": 1, "players": 5, "status": "online"}]}
```

---

## 🎉 AGORA VOCÊ SABE!

✅ Instalar  
✅ Criar salas  
✅ Usar API  
✅ Usar CLI  
✅ Deploy Pterodactyl  
✅ Troubleshoot  

**Próximo passo:** `npm install && npm start`

---

**Referência Rápida - January 2026**  
**Para mais info:** Veja README.md ou QUICKSTART.md
