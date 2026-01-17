# 🚀 GUIA DE SETUP RÁPIDO

## ⚡ 5 Minutos para Colocar Online

### Passo 1: Instalar Dependências
```bash
npm install
```

### Passo 2: Conseguir Token Haxball
1. Acesse: https://www.haxball.com/headless
2. Crie uma conta / faça login
3. Crie um novo token
4. Copie o token (formato: `thr1.ABC...`)

### Passo 3: Criar Arquivo de Configuração

Execute:
```bash
node scripts/cli.js criar-sala 1 "thr1.SEU_TOKEN" "Minha Sala"
```

Ou edite `configs/default.json` manualmente:
```json
{
  "port": 3002,
  "adminSecret": "meu_secret_seguro",
  "rooms": [
    {
      "id": 1,
      "token": "thr1.SEU_TOKEN_AQUI",
      "roomName": "Minha Sala",
      "maxPlayers": 30,
      "public": true,
      "geo": { "code": "BR" }
    }
  ]
}
```

### Passo 4: Iniciar Servidor
```bash
npm start
```

Você verá:
```
🚀 Iniciando servidor Haxball...
✅ Configuração carregada
✅ Gerenciador de salas inicializado
📋 Iniciando 1 sala(s)...
[ROOM 1] ONLINE: https://www.haxball.com/?c=...
🎮 Servidor Haxball pronto para uso!
```

### Passo 5: Testar Sala
1. Acesse o link da sala que apareceu nos logs
2. Convide amigos
3. Divirta-se! 🎉

---

## 🐳 Deploy no Pterodactyl

### 1. Clonar Repositório
```bash
git clone https://github.com/gustavobbrz/haxball-bot .
```

### 2. Configurar no Painel

**Startup Command:**
```bash
npm install && npm start
```

**Variáveis de Ambiente:**
- `PORT=3002`
- `ADMIN_SECRET=seu_secret_super_seguro`

### 3. Criar Config via API

Após o servidor estar online, crie a sala:
```bash
curl -X POST http://seu_servidor:3002/rooms \
  -H "Authorization: Bearer seu_secret_super_seguro" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "roomName": "Minha Sala",
    "token": "thr1.SEU_TOKEN",
    "maxPlayers": 30
  }'
```

---

## 📊 Monitorar Salas

### Via Web Browser
```
http://seu_servidor:3002/status
```

### Via Terminal
```bash
curl http://seu_servidor:3002/status
```

Resposta:
```json
{
  "online": true,
  "rooms": [
    {
      "id": 1,
      "players": 12,
      "status": "online"
    }
  ]
}
```

---

## 🎮 Comandos Úteis

### Listar Salas Configuradas
```bash
node scripts/cli.js listar-salas
```

### Criar Sala (CLI)
```bash
node scripts/cli.js criar-sala 1 "thr1.TOKEN" "Nome da Sala"
```

### Deletar Sala
```bash
node scripts/cli.js deletar-sala 1
```

### Ver Ajuda
```bash
node scripts/cli.js help
```

---

## 🔧 Troubleshooting

### Erro: "Sala não inicia"
- ✅ Token está correto?
- ✅ Token começa com `thr1.`?
- ✅ Token não é "vazio"?

**Solução:**
```bash
# Obtenha novo token em https://www.haxball.com/headless
node scripts/cli.js criar-sala 1 "thr1.novo_token" "Sala"
npm start
```

### Erro: "403 Acesso negado"
- ✅ Verifique o `adminSecret` em `configs/default.json`
- ✅ Header correto: `Authorization: Bearer seu_secret`

### Sala não aparece como online
- Aguarde 30-60 segundos após iniciar
- Verifique logs: `npm start`
- Tente reiniciar: `npm start`

---

## 📱 APIs Disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Status do servidor |
| GET | `/status` | Status das salas |
| POST | `/rooms` | Criar/atualizar sala |
| DELETE | `/rooms/:id` | Deletar sala |
| POST | `/admin-command` | Reiniciar/limpar bans |
| POST | `/discord-chat` | Enviar mensagem |

---

## 🎯 Próximos Passos

- [ ] Configurar webhooks Discord
- [ ] Integrar com bot Discord
- [ ] Montar painel web de controle
- [ ] Adicionar sistema de stats
- [ ] Configurar backup automático

---

**Dúvidas?** Veja os arquivos de documentação:
- 📖 `README.md` - Documentação completa
- 🏗️ `ESTRUTURA.md` - Arquitetura do projeto
- 🐳 `PTERODACTYL_INTEGRATION.md` - Integração Pterodactyl
- 📡 `EXEMPLOS_API.http` - Exemplos de API

**Boa sorte com seu servidor! 🚀**
