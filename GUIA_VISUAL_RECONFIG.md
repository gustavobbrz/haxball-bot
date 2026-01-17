# 📸 GUIA VISUAL - Reconfigurar Servidor no Pterodactyl

## 🎯 SEU SERVIDOR: "FUTSAL DO BILLY / HAXHOSTING"

---

## ETAPA 1: Ir para Startup

```
Pterodactyl Panel
    ↓
Servers (no menu lateral)
    ↓
FUTSAL DO BILLY / HAXHOSTING (clicar)
    ↓
Aba "Startup" (clicar)
```

---

## ETAPA 2: Atualizar Startup Command

### Local: Aba "Startup" → Campo "Startup Command"

**ANTES:**
```
node index.js
```

**DEPOIS:**
```
npm install && npm start
```

✅ Salvar/Update

---

## ETAPA 3: Configurar Variáveis de Ambiente

### Local: Aba "Startup" → "Variables"

Você verá variáveis como:
- PORT
- ADMIN_SECRET
- NODE_ENV
- etc

### Configurar Cada Uma:

#### 1️⃣ PORT
- **Chave:** PORT
- **Valor:** `3002`
- ✅ Salvar

#### 2️⃣ ADMIN_SECRET
- **Chave:** ADMIN_SECRET
- **Valor:** `seu_secret_super_seguro_aqui`
  - Exemplo: `haxball_admin_billy_2024_xyz789`
- ✅ Salvar

#### 3️⃣ NODE_ENV
- **Chave:** NODE_ENV
- **Valor:** `production`
- ✅ Salvar

---

## ETAPA 4: Verificar Build Configuration

### Local: Aba "Build Configuration"

Verificar:
- ✅ Memory: 2048 MB (ou mais)
- ✅ Disk Space: 5 GB
- ✅ CPU: Unlimited (ou 1 core)

Se precisar alterar, edite e salve.

---

## ETAPA 5: Parar o Servidor

### Local: Aba "Console"

1. Vá em **Console**
2. Clique em **Stop**
3. Aguarde parar completamente
4. Status deve mudar para "Offline"

---

## ETAPA 6: Fazer Deploy do Novo Código

### Opção A: Via Console (RECOMENDADO)

1. Em **Console**, vá na aba **Command**
2. Cole este comando:

```bash
rm -rf * && git clone https://github.com/gustavobbrz/haxball-bot . && npm install
```

3. Pressione Enter
4. Aguarde completar (2-3 minutos)

Você deve ver:
```
Cloning into '.'...
npm WARN ...
npm notice created a lockfile as package-lock.json
added 100+ packages
```

### Opção B: Via SFTP

1. Use FileZilla ou WinSCP
2. Conecte ao servidor
3. Delete todos os arquivos antigos
4. Copie os novos do seu PC

---

## ETAPA 7: Iniciar o Servidor

### Local: Aba "Console"

1. Clique em **Start**
2. Aguarde 30-60 segundos
3. Veja nos logs:

```
✅ 🚀 Iniciando servidor Haxball...
✅ ✅ Configuração carregada
✅ ✅ Gerenciador de salas inicializado
✅ 📋 Iniciando 0 sala(s)...
✅ API rodando na porta 3002
✅ 🎮 Servidor Haxball pronto para uso!
```

---

## ETAPA 8: Criar Salas

### Execute em seu PC (ou terminal do servidor):

**Sala 1:**
```bash
curl -X POST http://seu_ip_pterodactyl:3002/rooms \
  -H "Authorization: Bearer seu_secret_super_seguro_aqui" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "token": "thr1.COLOQUE_SEU_TOKEN_1",
    "roomName": "🔴⚫ FUTSAL BILLY ⚫🔴",
    "maxPlayers": 30,
    "public": true,
    "geo": { "code": "BR" }
  }'
```

**Sala 2:**
```bash
curl -X POST http://seu_ip_pterodactyl:3002/rooms \
  -H "Authorization: Bearer seu_secret_super_seguro_aqui" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 2,
    "token": "thr1.COLOQUE_SEU_TOKEN_2",
    "roomName": "🔴⚫ FUTSAL BILLY #2 ⚫🔴",
    "maxPlayers": 30,
    "public": true,
    "geo": { "code": "BR" }
  }'
```

---

## ETAPA 9: Verificar Status

### Execute:

```bash
curl http://seu_ip_pterodactyl:3002/status
```

### Resposta esperada:

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

✅ Se tiver salas, está funcionando!

---

## 🎯 PRONTO!

Seu servidor foi reconfigurado com:
- ✅ Nova estrutura modular
- ✅ API REST completa
- ✅ CLI para gerenciar
- ✅ Salas criadas e online
- ✅ Pronto para jogadores

---

## 💡 PRÓXIMAS AÇÕES

1. [x] Atualizar Startup Command
2. [x] Configurar Variáveis
3. [x] Deploy do novo código
4. [x] Iniciar servidor
5. [x] Criar salas
6. [ ] Compartilhar links das salas com players
7. [ ] Configurar Discord webhooks (opcional)
8. [ ] Monitorar em produção

---

## 🆘 PROBLEMAS?

**Servidor não inicia?**
- Verificar logs no Console
- Procurar por mensagens de erro
- Executar `npm install` novamente

**Salas não ficam online?**
- Verificar token (deve começar com `thr1.`)
- Verificar se não está repetido em duas salas
- Obter novo token em https://www.haxball.com/headless

**Erro de autenticação (403)?**
- Verificar ADMIN_SECRET
- Verificar se o header Bearer está correto
- Usar aspas simples ao copiar token

---

**Sucesso! Seu servidor está reconfigurado e online! 🚀**
