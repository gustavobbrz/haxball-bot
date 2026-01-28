# 🚀 Guia Rápido de Implementação

Este guia mostra como implementar todas as melhorias no seu projeto Arena Cup.

---

## ✅ O que foi Corrigido

### 1. Webhooks do Discord

**Arquivos Modificados:**
- `playerleaving.ts` - Corrigido webhook de saída
- `index.ts` - Corrigido webhook de resultados
- `admincommands.ts` - Corrigido webhooks de admin
- `config.ts` - Adicionados novos webhooks (denuncias, chat)

**Status:** ✅ **PRONTO PARA USO**

Os webhooks agora funcionam corretamente. Basta recompilar e reiniciar as salas.

---

## 🆕 Novas Funcionalidades Criadas

### 1. Script de Criação de Canais

**Arquivo:** `discord-setup-channels.js`

**O que faz:**
- Cria canais `#denuncias` e `#chat-sala` para cada sala
- Cria webhooks automaticamente
- Atualiza o arquivo `.env`

**Como Usar:**

```bash
# 1. Configure as variáveis de ambiente
export DISCORD_BOT_TOKEN="seu_token_do_bot"
export DISCORD_GUILD_ID="id_do_servidor"
export CATEGORY_X3_NIVEL="id_da_categoria"
export CATEGORY_X3_NOOBS="id_da_categoria"
export CATEGORY_X1="id_da_categoria"
export CATEGORY_X4="id_da_categoria"

# 2. Execute o script
node discord-setup-channels.js
```

**Documentação:** `SETUP_CANAIS_DISCORD.md`

---

### 2. Bot de Administração do Discord

**Pasta:** `discord-bot/`

**Funcionalidades:**
- ✅ Registro automático de novos membros
- ✅ Sistema de tickets
- ✅ Comandos de moderação
- ✅ Monitoramento de salas
- ✅ Perfis de jogadores

**Como Instalar:**

```bash
# 1. Entrar na pasta
cd discord-bot

# 2. Instalar dependências
npm install

# 3. Configurar .env
cp .env.example .env
nano .env

# 4. Iniciar o bot
npm start
```

**Documentação Completa:** `discord-bot/README.md`

---

### 3. Comando !denunciar nas Salas

**Arquivos Criados:**
- `haxball-discord-integration.ts` - Integração completa
- `commands-extended.ts` - Comandos estendidos

**Como Integrar:**

#### Passo 1: Adicionar import no `index.ts`

```typescript
// No topo do arquivo index.ts
import { checkAndHandleExtendedCommands, handleChatToDiscord } from "./commands-extended.js";
```

#### Passo 2: Atualizar `onPlayerChat`

```typescript
room.onPlayerChat = function (player: PlayerObject, message: string): boolean {
  console.log(`${player.name}: ${message}`);
  
  // Verificar comandos estendidos (inclui !denunciar)
  if (checkAndHandleExtendedCommands(player, message)) return false;
  
  // Verificar comandos de admin
  if (checkAndHandleAdminCommands(player, message)) return false;
  
  // Comandos normais
  if (checkAndHandleCommands(player, message)) return false;
  
  // Moderação
  if (checkAndHandleBadWords(player, message)) return false;
  if (checkAndHandleSpam(player, message)) return false;
  
  // Enviar chat para Discord (opcional)
  handleChatToDiscord(player, message);
  
  return true;
}
```

#### Passo 3: Recompilar

```bash
npm run build
```

**Comandos Adicionados:**
- `!denunciar <nome> <motivo>` - Denunciar jogador
- `!discord` - Ver link do Discord
- `!regras` - Ver regras
- `!help` - Lista completa de comandos
- `!afk` - Marcar como AFK
- `!bb` - Sair da sala
- `!github` - Ver repositório
- `!stats` - Ver estatísticas

---

## 📦 Checklist de Implementação

### Fase 1: Correções (CONCLUÍDO ✅)

- [x] Corrigir webhooks de saída
- [x] Corrigir webhooks de resultados
- [x] Corrigir webhooks de admin
- [x] Adicionar novos webhooks ao config
- [x] Compilar código

### Fase 2: Canais do Discord (A FAZER)

- [ ] Criar bot no Discord Developer Portal
- [ ] Obter token do bot
- [ ] Obter IDs das categorias
- [ ] Executar `discord-setup-channels.js`
- [ ] Verificar se os canais foram criados
- [ ] Verificar se o `.env` foi atualizado

### Fase 3: Bot de Administração (A FAZER)

- [ ] Configurar intents do bot
- [ ] Criar role "Player"
- [ ] Criar categoria "Tickets"
- [ ] Instalar dependências (`cd discord-bot && npm install`)
- [ ] Configurar `.env` do bot
- [ ] Iniciar bot (`npm start`)
- [ ] Testar comando `!ajuda`
- [ ] Testar sistema de tickets
- [ ] Testar registro automático

### Fase 4: Comando !denunciar (A FAZER)

- [ ] Adicionar imports no `index.ts`
- [ ] Atualizar `onPlayerChat`
- [ ] Recompilar (`npm run build`)
- [ ] Reiniciar salas
- [ ] Testar comando `!denunciar`
- [ ] Verificar se denúncia aparece no Discord

### Fase 5: Chat ao Vivo (OPCIONAL)

- [ ] Descomentar `handleChatToDiscord` no `onPlayerChat`
- [ ] Recompilar
- [ ] Reiniciar salas
- [ ] Testar mensagens no chat

---

## 🔧 Comandos Úteis

### Compilar Código

```bash
cd /home/ubuntu/server
npm run build
```

### Reiniciar Salas (se usando PM2)

```bash
pm2 restart all
```

### Reiniciar Salas (se usando systemd)

```bash
sudo systemctl restart x3-nivel
sudo systemctl restart x3-noobs
sudo systemctl restart x1
sudo systemctl restart x4
```

### Ver Logs

```bash
# PM2
pm2 logs

# Systemd
journalctl -u x3-nivel -f
```

### Iniciar Bot do Discord

```bash
cd /home/ubuntu/server/discord-bot
npm start
```

### Iniciar Bot com PM2

```bash
cd /home/ubuntu/server/discord-bot
pm2 start bot.js --name arena-cup-bot
pm2 save
```

---

## 🐛 Solução de Problemas

### Erro: "Cannot find module"

```bash
# Reinstalar dependências
npm install
npm run build
```

### Webhooks não funcionam

1. Verificar se o `.env` está configurado
2. Verificar se as URLs dos webhooks estão corretas
3. Verificar se o código foi recompilado
4. Verificar logs para erros

### Bot não responde

1. Verificar se o token está correto
2. Verificar se os intents estão ativados
3. Verificar se o bot está online
4. Verificar logs do bot

### Comando !denunciar não funciona

1. Verificar se o import foi adicionado
2. Verificar se o `onPlayerChat` foi atualizado
3. Verificar se o código foi recompilado
4. Verificar se o webhook de denúncias está configurado

---

## 📁 Estrutura de Arquivos

```
server/
├── ANALISE_E_MELHORIAS.md          # Análise completa do projeto
├── GUIA_IMPLEMENTACAO.md           # Este arquivo
├── SETUP_CANAIS_DISCORD.md         # Guia de setup dos canais
├── discord-setup-channels.js       # Script de criação de canais
├── config.ts                       # ✅ ATUALIZADO
├── index.ts                        # ✅ ATUALIZADO
├── playerleaving.ts                # ✅ ATUALIZADO
├── admincommands.ts                # ✅ ATUALIZADO
├── haxball-discord-integration.ts  # 🆕 NOVO
├── commands-extended.ts            # 🆕 NOVO
├── config-updated.ts               # 🆕 BACKUP
└── discord-bot/                    # 🆕 NOVO
    ├── bot.js
    ├── package.json
    ├── .env.example
    └── README.md
```

---

## 🎯 Próximos Passos

1. **Testar as correções**
   - Reiniciar as salas
   - Verificar se os webhooks funcionam
   - Testar entrada/saída de jogadores

2. **Configurar o bot**
   - Seguir o guia em `discord-bot/README.md`
   - Testar todos os comandos
   - Verificar registro automático

3. **Criar canais adicionais**
   - Seguir o guia em `SETUP_CANAIS_DISCORD.md`
   - Executar o script
   - Verificar se os webhooks foram criados

4. **Implementar !denunciar**
   - Seguir as instruções acima
   - Testar o comando
   - Verificar se as denúncias aparecem no Discord

5. **Ler análise completa**
   - Abrir `ANALISE_E_MELHORIAS.md`
   - Planejar próximas melhorias
   - Implementar gradualmente

---

## 💡 Dicas

### Performance

- Use PM2 para gerenciar processos
- Configure logs rotativos
- Monitore uso de memória

### Segurança

- Nunca commite o `.env`
- Use variáveis de ambiente em produção
- Mantenha o bot atualizado

### Backup

```bash
# Backup do código
tar -czf backup-$(date +%Y%m%d).tar.gz server/

# Backup do banco de dados do bot
cp discord-bot/bot-data.json discord-bot/bot-data.backup.json
```

### Monitoramento

```bash
# Ver status de todos os processos
pm2 status

# Ver uso de recursos
pm2 monit

# Ver logs em tempo real
pm2 logs --lines 100
```

---

## 📞 Suporte

Se tiver dúvidas ou problemas:

1. Consulte a documentação específica de cada módulo
2. Verifique os logs para erros
3. Teste em um ambiente de desenvolvimento primeiro
4. Faça backup antes de mudanças grandes

---

## ✅ Conclusão

Todas as correções e melhorias estão prontas para serem implementadas. Siga o checklist acima e implemente gradualmente, testando cada fase antes de prosseguir.

**Boa sorte! 🚀**

---

**Última atualização:** 28/01/2026  
**Versão:** 1.0
