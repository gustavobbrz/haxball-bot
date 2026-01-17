# 🐳 PTERODACTYL - RESUMO RÁPIDO

## 📋 CONFIGURAÇÃO RÁPIDA (10 minutos)

### 1️⃣ Criar Servidor
- Admin Panel → Servers → Create New
- Nome: Haxball Bot
- Egg: Node.js
- Docker: node:16-alpine

### 2️⃣ Startup Command
```
npm install && npm start
```

### 3️⃣ Variáveis (Environment)
```
PORT=3002
ADMIN_SECRET=seu_secret_super_seguro
NODE_ENV=production
```

### 4️⃣ Deploy
```bash
cd /var/www/pterodactyl/servers/seu_servidor
git clone https://github.com/gustavobbrz/haxball-bot .
npm install
```

### 5️⃣ Iniciar
- Clique "Start" no painel
- Aguarde 30-60 segundos
- Verifique logs por "ONLINE"

---

## ✅ CRIAR SALAS

```bash
curl -X POST http://seu_ip:3002/rooms \
  -H "Authorization: Bearer seu_secret_super_seguro" \
  -H "Content-Type: application/json" \
  -d '{"id": 1, "token": "thr1.ABC...", "roomName": "Sala", "maxPlayers": 30}'
```

---

## 📊 VERIFICAR STATUS

```bash
curl http://seu_ip:3002/status
```

---

## 🎯 PRONTO! 🚀

Seu servidor Haxball está online e gerenciado via API no Pterodactyl!

Para detalhes: Leia PTERODACTYL_SETUP.md
