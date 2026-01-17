# 🔧 RECONFIGURAR SERVIDOR EXISTENTE NO PTERODACTYL

## ✅ PASSO A PASSO - Seu Servidor "FUTSAL DO BILLY"

### Passo 1: Acessar o Servidor

1. No Pterodactyl Admin, vá em **Servers**
2. Clique em **FUTSAL DO BILLY / HAXHOSTING**
3. Vá na aba **Startup**

---

### Passo 2: Atualizar Startup Command

Atual:
```
node index.js
```

Mudar para:
```
npm install && npm start
```

**Salvar!**

---

### Passo 3: Configurar Variáveis de Ambiente

1. Ainda em **Startup**, vá na aba **Variables**
2. Configure/Atualize:

| Chave | Valor |
|-------|-------|
| **PORT** | 3002 |
| **ADMIN_SECRET** | seu_secret_super_seguro_aqui |
| **NODE_ENV** | production |

⚠️ **Importante:** Use um secret FORTE e ÚNICO (ex: `haxball_admin_2024_abc123xyz789`)

**Salvar cada uma!**

---

### Passo 4: Verificar Build Configuration

1. Vá na aba **Build Configuration**
2. Verifique:
   - Memory: 2048 MB (ou mais)
   - Disk Space: 5 GB
   - CPU: Sem limite ou 1 core

⚠️ Se precisar aumentar, edite e salve.

---

### Passo 5: Parar o Servidor

1. Vá em **Console**
2. Clique em **Stop**
3. Aguarde parar completamente

---

### Passo 6: Fazer Deploy do Novo Código

Opção A - Via Console do Pterodactyl (Recomendado):

1. Ainda em **Console**, vá na aba **Command**
2. Execute:

```bash
rm -rf * && git clone https://github.com/gustavobbrz/haxball-bot . && npm install
```

Aguarde até ver `npm install` completar.

Opção B - Via SFTP:

1. Conecte via SFTP (FileZilla, WinSCP)
2. Delete todos os arquivos antigos
3. Copie os novos arquivos do seu PC para o servidor

Opção C - Manual no Console:

```bash
cd /var/www/pterodactyl/servers/SEU_SERVIDOR_ID
git clone https://github.com/gustavobbrz/haxball-bot .
npm install
```

---

### Passo 7: Iniciar o Servidor

1. Vá para **Console**
2. Clique em **Start**
3. Aguarde 30-60 segundos
4. Procure nos logs por:

```
✅ [ROOM X] ONLINE: https://www.haxball.com/?c=...
✅ 🎮 Servidor Haxball pronto para uso!
```

---

## 📋 CRIAR SALAS

Após servidor estar online, execute (em seu PC ou terminal):

### Sala 1
```bash
curl -X POST http://seu_ip_pterodactyl:3002/rooms \
  -H "Authorization: Bearer seu_secret_super_seguro_aqui" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "token": "thr1.SEU_TOKEN_1_AQUI",
    "roomName": "🔴⚫ FUTSAL VEM TRANQUILO ⚫🔴",
    "maxPlayers": 30,
    "public": true,
    "geo": { "code": "BR" }
  }'
```

### Sala 2
```bash
curl -X POST http://seu_ip_pterodactyl:3002/rooms \
  -H "Authorization: Bearer seu_secret_super_seguro_aqui" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 2,
    "token": "thr1.SEU_TOKEN_2_AQUI",
    "roomName": "🔴⚫ FUTSAL VEM TRANQUILO #2 ⚫🔴",
    "maxPlayers": 30,
    "public": true,
    "geo": { "code": "BR" }
  }'
```

---

## ✅ VERIFICAR STATUS

```bash
curl http://seu_ip_pterodactyl:3002/status
```

Resposta esperada:
```json
{
  "online": true,
  "rooms": [
    {"id": 1, "players": 0, "status": "online"},
    {"id": 2, "players": 0, "status": "online"}
  ]
}
```

---

## 🎯 GERENCIAR SALAS

### Reiniciar Sala 1
```bash
curl -X POST http://seu_ip_pterodactyl:3002/admin-command \
  -H "Authorization: Bearer seu_secret_super_seguro_aqui" \
  -H "Content-Type: application/json" \
  -d '{"roomId": 1, "command": "restart"}'
```

### Limpar Bans
```bash
curl -X POST http://seu_ip_pterodactyl:3002/admin-command \
  -H "Authorization: Bearer seu_secret_super_seguro_aqui" \
  -H "Content-Type: application/json" \
  -d '{"roomId": 1, "command": "clearbans"}'
```

### Deletar Sala 1
```bash
curl -X DELETE http://seu_ip_pterodactyl:3002/rooms/1 \
  -H "Authorization: Bearer seu_secret_super_seguro_aqui"
```

---

## 🆘 TROUBLESHOOTING

### Servidor não inicia após reconfiguração?
- Volte em **Startup** e verifique o comando
- Verifique os logs para erros

### Salas não ficam online?
- Verificar tokens em `configs/default.json`
- Executar `npm install` novamente
- Reiniciar o servidor

### Porta 3002 já em uso?
- Alterar PORT para 3003 ou outra em **Variables**

### Erro de "npm not found"?
- Verificar se Docker image tem Node.js
- Usar: `node:16-alpine` ou `node:18-alpine`

---

## 📝 CHECKLIST FINAL

- [ ] Startup Command alterado para `npm install && npm start`
- [ ] Variáveis de ambiente configuradas (PORT, ADMIN_SECRET, NODE_ENV)
- [ ] Build Configuration verificada (Memory, Disk)
- [ ] Servidor parado
- [ ] Novo código deployado
- [ ] Servidor iniciado
- [ ] Logs verificados (ONLINE presente)
- [ ] Salas criadas
- [ ] Status verificado
- [ ] ✅ Tudo funcionando!

---

**Pronto! Seu servidor foi reconfigurado com a nova estrutura!** 🚀

Qualquer dúvida, me avisa! 💬
