# ✅ CHECKLIST DE IMPLEMENTAÇÃO

## 🎯 Fase 1: Preparação Local (COMPLETO ✅)

- [x] Estrutura modular criada
  - [x] config-manager.js
  - [x] room-manager.js
  - [x] api-server.js
  
- [x] Arquivos de configuração
  - [x] configs/default.json
  - [x] package.json atualizado
  
- [x] Scripts utilitários
  - [x] scripts/cli.js
  - [x] start.sh (Linux)
  - [x] start.bat (Windows)

- [x] Documentação
  - [x] README.md
  - [x] QUICKSTART.md
  - [x] ESTRUTURA.md
  - [x] PTERODACTYL_INTEGRATION.md
  - [x] EXEMPLOS_API.http
  - [x] DIAGRAMA_ARQUITETURA.md
  - [x] RESUMO_REFATORACAO.md
  - [x] webhook-example.js

---

## 🔧 Fase 2: Testes Locais (RECOMENDADO)

- [ ] Instalar dependências
  ```bash
  npm install
  ```

- [ ] Testar CLI
  ```bash
  node scripts/cli.js help
  ```

- [ ] Criar sala de teste
  ```bash
  node scripts/cli.js criar-sala 1 "thr1.SEU_TOKEN" "Sala Teste"
  ```

- [ ] Iniciar servidor
  ```bash
  npm start
  ```

- [ ] Verificar se sala fica online
  - Procurar por `[ROOM 1] ONLINE:` nos logs
  - Acessar o link da sala

- [ ] Testar endpoints
  ```bash
  curl http://localhost:3002/health
  curl http://localhost:3002/status
  ```

- [ ] Testar criação via API
  ```bash
  curl -X POST http://localhost:3002/rooms \
    -H "Authorization: Bearer seu_secret" \
    -H "Content-Type: application/json" \
    -d '{...}'
  ```

---

## 🐳 Fase 3: Deploy Pterodactyl

### 3.1: Preparar Servidor
- [ ] Criar novo servidor/instância no Pterodactyl
- [ ] Escolher egg Node.js (ou Custom)
- [ ] Nota: Asegurar que tem Node.js 14+

### 3.2: Configurar Startup
- [ ] Ir em: Settings > Startup
- [ ] Startup Command: `npm install && npm start`
- [ ] Salvar

### 3.3: Configurar Variáveis de Ambiente
- [ ] PORT = `3002`
- [ ] ADMIN_SECRET = `seu_secret_super_seguro_aqui`
- [ ] Salvar

### 3.4: Fazer Deploy
- [ ] Clonar repositório no servidor
  ```bash
  cd /path/to/server
  git clone https://github.com/gustavobbrz/haxball-bot .
  ```
  
- [ ] Ou copiar arquivos via SFTP

### 3.5: Criar Arquivo de Configuração
- [ ] Criar `configs/default.json` com salas
  ```json
  {
    "port": 3002,
    "adminSecret": "seu_secret_super_seguro",
    "rooms": []
  }
  ```

### 3.6: Iniciar Servidor
- [ ] Clicar "Start" no Pterodactyl
- [ ] Aguardar 30-60 segundos
- [ ] Ver logs: `npm start` começando
- [ ] Procurar por `🎮 Servidor Haxball pronto para uso!`

---

## 🎮 Fase 4: Gerenciar Salas

### Via API
- [ ] Criar sala
  ```bash
  curl -X POST http://seu_ip:3002/rooms \
    -H "Authorization: Bearer seu_secret" \
    -H "Content-Type: application/json" \
    -d '{
      "id": 1,
      "token": "thr1.ABC...",
      "roomName": "Sala 1",
      "maxPlayers": 30
    }'
  ```

- [ ] Ver status
  ```bash
  curl http://seu_ip:3002/status
  ```

- [ ] Reiniciar sala
  ```bash
  curl -X POST http://seu_ip:3002/admin-command \
    -H "Authorization: Bearer seu_secret" \
    -H "Content-Type: application/json" \
    -d '{"roomId": 1, "command": "restart"}'
  ```

- [ ] Deletar sala
  ```bash
  curl -X DELETE http://seu_ip:3002/rooms/1 \
    -H "Authorization: Bearer seu_secret"
  ```

### Via CLI (Local)
- [ ] `node scripts/cli.js listar-salas`
- [ ] `node scripts/cli.js criar-sala 1 "token" "Nome"`
- [ ] `node scripts/cli.js deletar-sala 1`

---

## 🔗 Fase 5: Integração Discord (OPCIONAL)

- [ ] Criar webhooks Discord
- [ ] Configurar em `configs/default.json`
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

- [ ] Testar webhook de chat
  ```bash
  curl -X POST http://seu_ip:3002/discord-chat \
    -H "Content-Type: application/json" \
    -d '{"roomId": 1, "author": "Bot", "message": "Teste!"}'
  ```

---

## 📊 Fase 6: Monitoramento (OPCIONAL)

- [ ] Configurar logs
- [ ] Ver logs do Pterodactyl regularmente
- [ ] Monitorar uso de CPU/Memória

### Com PM2 (Produção)
- [ ] Instalar PM2: `npm install -g pm2`
- [ ] `pm2 start index.js --name haxball-bot`
- [ ] `pm2 save`
- [ ] `pm2 startup`

---

## 🚨 Troubleshooting

### Problema: Salas não iniciam
- [ ] Verificar token em `configs/default.json`
- [ ] Token começa com `thr1.`?
- [ ] Token não está vazio ou "vazio"?
- [ ] Obter novo token em https://www.haxball.com/headless

### Problema: API retorna 403
- [ ] Verificar `adminSecret`
- [ ] Header correto? `Authorization: Bearer secret`
- [ ] CASE SENSITIVE: Bearer vs bearer

### Problema: Porta já em uso
- [ ] Mudar PORT em `configs/default.json`
- [ ] Ou: `PORT=3003 npm start`
- [ ] Verificar qual processo usa porta: `lsof -i :3002`

### Problema: Node.js não encontrado
- [ ] Instalar Node.js 14+
- [ ] Verificar: `node --version`

### Problema: Arquivo de config não encontra
- [ ] Criar pasta: `mkdir configs`
- [ ] Criar arquivo: `touch configs/default.json`
- [ ] Adicionar conteúdo JSON válido

---

## 📈 Fase 7: Otimizações (FUTURO)

- [ ] Adicionar banco de dados para stats
- [ ] Criar painel web de controle
- [ ] Adicionar autoscaling
- [ ] Configurar backups automáticos
- [ ] Adicionar CI/CD
- [ ] Implementar cache
- [ ] Monitoramento em tempo real
- [ ] Alertas por email/Discord

---

## 🎉 Fase 8: Produção

- [ ] Testar em staging first
- [ ] Backup de configs
- [ ] Documentar processo de deploy
- [ ] Criar runbook para administração
- [ ] Treinar equipe
- [ ] Go live!

---

## 📝 Notas Importantes

### Segurança
- ⚠️ Não compartilhe `adminSecret`
- ⚠️ Não exponha tokens Haxball
- ⚠️ Use HTTPS em produção
- ⚠️ Altere `adminSecret` padrão

### Performance
- 💡 Cada sala = 1 headless browser instance
- 💡 Muitas salas = alto uso de RAM/CPU
- 💡 Monitor recursos do servidor

### Backup
- 📦 Faça backup de `configs/default.json`
- 📦 Faça backup de stats (se tiver)
- 📦 Faça backup de logs

---

## 🔍 Verificação Final

```bash
# 1. Verificar arquivos criados
ls -la

# 2. Verificar estrutura
tree configs/ src/ scripts/

# 3. Verificar dependências
npm list

# 4. Iniciar test
npm start

# 5. Testar em outra aba
curl http://localhost:3002/health

# 6. Criar sala de teste
node scripts/cli.js criar-sala 1 "thr1.TEST" "Test"

# 7. Ver logs
npm start (procurar por ONLINE)

# 8. Deletar sala de teste
node scripts/cli.js deletar-sala 1
```

---

## ✨ Status Atual

**Data:** January 16, 2026  
**Status:** ✅ REFATORAÇÃO COMPLETA  
**Pronto para:** Testes locais → Deploy Pterodactyl  
**Próximo passo:** Executar Fase 2 (Testes Locais)

---

**Boa sorte! 🚀**
