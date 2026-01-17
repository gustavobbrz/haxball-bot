# 🐳 GUIA DE CONFIGURAÇÃO NO PTERODACTYL PANEL

## ✅ CHECKLIST PASSO A PASSO

### Passo 1: Criar Novo Servidor no Painel

1. Acesse seu **Pterodactyl Admin Panel**
2. Vá em: **Servers** → **Create New**
3. Preencha os dados:
   ```
   Server Name: Haxball Bot
   User: (seu usuário)
   Egg: Node.js Application (ou Custom)
   Docker Image: node:16-alpine
   Startup Command: npm install && npm start
   ```

### Passo 2: Configurar Memory e CPU

```
Memory: 2048 MB (ou mais se tiver salas múltiplas)
Swap: 512 MB
Disk Space: 5 GB
CPU Limit: 100% (ou 1 core se tiver limite)
```

### Passo 3: Configurar Startup Command

No painel, em **Settings → Startup**:

```
npm install && npm start
```

### Passo 4: Configurar Variáveis de Ambiente

Em **Settings → Variables**, configure:

| Chave | Valor | Descrição |
|-------|-------|-----------|
| PORT | 3002 | Porta da API |
| ADMIN_SECRET | seu_secret_super_seguro_aqui | Token de autenticação |
| NODE_ENV | production | Modo produção |

**⚠️ Importante:** Use um secret FORTE e ÚNICO!

### Passo 5: Criar o Servidor

- Clique em **Create Server**
- Aguarde o servidor ser criado (2-3 minutos)

### Passo 6: Fazer Deploy do Código

Opção A - Via Git (Recomendado):
```bash
# No console/terminal do servidor Pterodactyl
cd /var/www/pterodactyl/servidores/seu_servidor
git clone https://github.com/gustavobbrz/haxball-bot .
```

Opção B - Via SFTP:
1. Use um cliente SFTP (FileZilla, WinSCP)
2. Conecte ao servidor Pterodactyl
3. Copie todos os arquivos para o diretório do servidor

### Passo 7: Instalar Dependências

No **Console do Pterodactyl**, execute:
```bash
npm install
```

Ou deixe que o startup command faça automaticamente quando iniciar.

### Passo 8: Iniciar o Servidor

1. Vá até o servidor no painel
2. Clique em **Start**
3. Aguarde 30-60 segundos
4. Verifique os **Logs** procurando por:
   ```
   ✅ [ROOM X] ONLINE: https://www.haxball.com/?c=...
   ✅ 🎮 Servidor Haxball pronto para uso!
   ```

---

## 📊 VERIFICAR STATUS

### Via Browser
```
http://seu_ip_pterodactyl:3002/health
```

### Via Curl
```bash
curl http://seu_ip_pterodactyl:3002/status
```

---

## 🎮 CRIAR SALAS NO PTERODACTYL

Após o servidor estar online, crie salas via API:

### Criar Sala 1
```bash
curl -X POST http://seu_ip_pterodactyl:3002/rooms \
  -H "Authorization: Bearer seu_secret_super_seguro_aqui" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "token": "thr1.COLOQUE_AQUI_SEU_TOKEN_1",
    "roomName": "🔴⚫ FUTSAL VEM TRANQUILO ⚫🔴",
    "maxPlayers": 30,
    "public": true,
    "geo": { "code": "BR" }
  }'
```

### Criar Sala 2
```bash
curl -X POST http://seu_ip_pterodactyl:3002/rooms \
  -H "Authorization: Bearer seu_secret_super_seguro_aqui" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 2,
    "token": "thr1.COLOQUE_AQUI_SEU_TOKEN_2",
    "roomName": "🔴⚫ FUTSAL VEM TRANQUILO #2 ⚫🔴",
    "maxPlayers": 30,
    "public": true,
    "geo": { "code": "BR" }
  }'
```

---

## ✅ VERIFICAR SALAS

```bash
curl http://seu_ip_pterodactyl:3002/status
```

Resposta esperada:
```json
{
  "online": true,
  "rooms": [
    {
      "id": 1,
      "players": 0,
      "status": "online"
    },
    {
      "id": 2,
      "players": 0,
      "status": "online"
    }
  ]
}
```

---

## 🔧 GERENCIAR SALAS

### Reiniciar Sala
```bash
curl -X POST http://seu_ip_pterodactyl:3002/admin-command \
  -H "Authorization: Bearer seu_secret_super_seguro_aqui" \
  -H "Content-Type: application/json" \
  -d '{"roomId": 1, "command": "restart"}'
```

### Deletar Sala
```bash
curl -X DELETE http://seu_ip_pterodactyl:3002/rooms/1 \
  -H "Authorization: Bearer seu_secret_super_seguro_aqui"
```

### Limpar Banimentos
```bash
curl -X POST http://seu_ip_pterodactyl:3002/admin-command \
  -H "Authorization: Bearer seu_secret_super_seguro_aqui" \
  -H "Content-Type: application/json" \
  -d '{"roomId": 1, "command": "clearbans"}'
```

---

## 📝 CONFIGURAÇÃO AVANÇADA

### Adicionar Webhooks Discord

1. Obtenha webhooks do Discord
2. Edite `configs/default.json` no servidor
3. Adicione os URLs:

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

4. Salve e reinicie o servidor

---

## 🆘 TROUBLESHOOTING

### Servidor não inicia
- Verifique os logs no painel
- Procure por erros de sintaxe
- Confirme que NODE_ENV está correto

### Salas não ficam online
- Verificar tokens em `configs/default.json`
- Tokens devem começar com `thr1.`
- Obter novos em https://www.haxball.com/headless

### API retorna 403
- Verificar se `ADMIN_SECRET` está correto
- Header deve ser: `Authorization: Bearer seu_secret`

### Porta 3002 já em uso
- Mudar `PORT` nas variáveis de ambiente
- Ou usar outra porta: `PORT=3003 npm start`

---

## 📋 CHECKLIST FINAL

- [ ] Servidor criado no Pterodactyl
- [ ] Startup Command configurado
- [ ] Variáveis de ambiente definidas
- [ ] Código deployado (git ou SFTP)
- [ ] npm install executado
- [ ] Servidor iniciado
- [ ] Logs verificados (ONLINE presente)
- [ ] Salas criadas via API
- [ ] Status verificado (/status)
- [ ] Tudo funcionando! ✅

---

## 🎯 PRÓXIMAS AÇÕES

1. [x] Refatoração completa
2. [x] Commit no GitHub
3. [ ] Deploy no Pterodactyl (AGORA)
4. [ ] Criar salas
5. [ ] Compartilhar links
6. [ ] Integrar Discord (opcional)
7. [ ] Monitorar em produção

---

**Pronto! Siga o passo a passo acima e seu servidor Haxball estará online no Pterodactyl!** 🚀

Para dúvidas, consulte os outros arquivos de documentação.
