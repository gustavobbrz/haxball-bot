# 🎮 Haxball Bot - Gerenciador de Salas

Sistema completo para gerenciar salas de Haxball com API REST integrada. Perfeito para integração com Pterodactyl Panel.

## 📋 Características

✅ **Criação dinâmica de salas** via API  
✅ **Gerenciamento em tempo real** - criar, deletar, reiniciar salas  
✅ **Autenticação segura** com Bearer token  
✅ **Estatísticas** de jogadores online  
✅ **Integração Discord** - webhooks para chat e logs  
✅ **Configuração persistente** em arquivo JSON  
✅ **Auto-start** de salas na inicialização  

## 🚀 Como Usar

### 1. **Configuração Inicial**

```bash
npm install
```

### 2. **Configurar Salas**

Edite `configs/default.json`:

```json
{
  "port": 3002,
  "adminSecret": "seu_secret_super_seguro",
  "rooms": [
    {
      "id": 1,
      "token": "thr1.SEU_TOKEN_AQUI",
      "roomName": "Minha Sala #1",
      "maxPlayers": 30,
      "public": true,
      "geo": { "code": "BR" }
    }
  ]
}
```

### 3. **Iniciar Servidor**

```bash
npm start
```

Ou com PM2 (para background permanente):

```bash
npm install -g pm2
pm2 start index.js --name "haxball-bot"
pm2 save
```

## 📡 API REST

### Verificar Status

```bash
curl http://localhost:3002/health
```

### Listar Salas

```bash
curl http://localhost:3002/status
```

### Criar/Atualizar Sala

```bash
curl -X POST http://localhost:3002/rooms \
  -H "Authorization: Bearer seu_secret_super_seguro" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "roomName": "Minha Sala",
    "maxPlayers": 30,
    "token": "thr1.SEU_TOKEN",
    "public": true,
    "geo": { "code": "BR" }
  }'
```

### Deletar Sala

```bash
curl -X DELETE http://localhost:3002/rooms/1 \
  -H "Authorization: Bearer seu_secret_super_seguro"
```

### Reiniciar Sala

```bash
curl -X POST http://localhost:3002/admin-command \
  -H "Authorization: Bearer seu_secret_super_seguro" \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": 1,
    "command": "restart"
  }'
```

### Limpar Banimentos

```bash
curl -X POST http://localhost:3002/admin-command \
  -H "Authorization: Bearer seu_secret_super_seguro" \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": 1,
    "command": "clearbans"
  }'
```

### Enviar Mensagem do Discord

```bash
curl -X POST http://localhost:3002/discord-chat \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": 1,
    "author": "Admin",
    "message": "Olá galera!"
  }'
```

## 🐳 Pterodactyl Panel

### Configurar Startup Command

Nas configurações do servidor no Pterodactyl, defina:

```
npm start
```

### Variáveis de Ambiente

Você pode usar variáveis de ambiente em vez de arquivo de config:

```bash
PORT=3002
ADMIN_SECRET=seu_secret_seguro
```

## 📁 Estrutura de Arquivos

```
haxball-bot/
├── index.js              # Entrada principal
├── config-manager.js     # Gerencia configurações
├── room-manager.js       # Gerencia salas
├── api-server.js         # Servidor API REST
├── package.json          # Dependências
├── src/
│   └── futsal.js         # Lógica do futsal
└── configs/
    └── default.json      # Configuração das salas
```

## 🔐 Segurança

- Use um `adminSecret` forte e único
- Não compartilhe seus tokens Haxball
- Use variáveis de ambiente no Pterodactyl
- Apenas endpoints públicos (`/health`, `/status`) não precisam de autenticação

## 📝 Notas

- A configuração é carregada de `configs/default.json`
- Mudanças pela API são salvas automaticamente
- Salas com token inválido são puladas na inicialização
- Logs mostram status de cada sala

## 🆘 Troubleshooting

**Erro: "Missing config.json"**
- Crie a pasta `configs/` e adicione `default.json`

**Sala não inicia**
- Verifique se o token está correto em `config.json`
- Verifique logs para erros específicos

**API retorna 403**
- Verifique o `adminSecret` no header `Authorization: Bearer`

---

**Desenvolvido para Pterodactyl Panel** 🔥
