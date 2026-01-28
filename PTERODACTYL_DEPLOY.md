# 🚀 Guia de Deploy no Pterodactyl

Este guia explica passo a passo como fazer o deploy das 4 salas Haxball no seu painel Pterodactyl.

---

## 📋 Pré-requisitos

- ✅ Painel Pterodactyl configurado e funcionando
- ✅ Acesso admin ao painel
- ✅ 4 tokens do Haxball Headless (um para cada sala)
- ✅ Servidor com Node.js 18+ instalado

---

## 🎯 Visão Geral

Você vai criar **4 servidores separados** no Pterodactyl, um para cada sala:

1. **Servidor 1:** 🔥HAX HOST🔥 FUTSAL X3 NIVEL 🔥
2. **Servidor 2:** 🔥HAX HOST🔥 FUTSAL X3 NOOBS🔥
3. **Servidor 3:** 🔥HAX HOST🔥 FUTSAL X1 🔥
4. **Servidor 4:** 🔥HAX HOST 🔥FUTSAL X4  🔥

---

## 📦 Passo 1: Criar os Servidores

### 1.1. Acessar o Painel Admin

1. Faça login no painel Pterodactyl como **admin**
2. Vá em **Servers** → **Create New**

### 1.2. Configurações Básicas (Repita para cada sala)

**Server Owner:**
- Selecione o usuário dono do servidor

**Server Name:**
- Sala 1: `Haxball X3 Nivel`
- Sala 2: `Haxball X3 Noobs`
- Sala 3: `Haxball X1`
- Sala 4: `Haxball X4`

**Description:**
- `Servidor Haxball com sistema de admin e Discord`

### 1.3. Configurações de Alocação

**Default Allocation:**
- Selecione um IP e porta disponível
- Cada servidor precisa de uma porta diferente

### 1.4. Configurações de Recursos

**CPU Limit:** `100%` (ou conforme sua necessidade)
**Memory:** `512 MB` (mínimo recomendado)
**Disk Space:** `2048 MB`
**Database Limit:** `0` (não precisa)
**Allocation Limit:** `1`

### 1.5. Configuração do Egg

**Nest:** `Generic`
**Egg:** `Node.js Generic`

**Docker Image:**
```
ghcr.io/parkervcp/yolks:nodejs_18
```

**Startup Command:**
- Sala X3 Nivel: `./start-x3-nivel.sh`
- Sala X3 Noobs: `./start-x3-noobs.sh`
- Sala X1: `./start-x1.sh`
- Sala X4: `./start-x4.sh`

---

## 📁 Passo 2: Upload dos Arquivos

### 2.1. Preparar os Arquivos Localmente

No seu computador, clone o repositório:

```bash
git clone https://github.com/gustavobbrz/server.git
cd server
npm install
npm run build
```

### 2.2. Arquivos Necessários

Você precisa fazer upload dos seguintes arquivos/pastas:

```
server/
├── dist/                    # Pasta com código compilado
├── lists/                   # Listas de admin e palavrões
│   ├── adminlist.txt
│   └── badwords.txt
├── stadiums/                # Mapas do Haxball
│   ├── practice.hbs
│   ├── futsal2x2.hbs
│   └── futsal3x3.hbs
├── node_modules/            # Dependências (ou instalar no servidor)
├── package.json
├── package-lock.json
├── token.txt                # Token do Haxball (CRIAR PARA CADA SALA)
├── start-x3-nivel.sh
├── start-x3-noobs.sh
├── start-x1.sh
└── start-x4.sh
```

### 2.3. Upload via Painel

**Opção A: Upload Manual**

1. Acesse o painel do servidor
2. Vá em **Files**
3. Faça upload dos arquivos e pastas
4. Certifique-se de manter a estrutura de diretórios

**Opção B: SFTP**

1. Use um cliente SFTP (FileZilla, WinSCP, etc)
2. Conecte usando as credenciais do painel
3. Faça upload de todos os arquivos

**Opção C: Git Clone (Recomendado)**

1. Acesse o console do servidor
2. Execute:
```bash
git clone https://github.com/gustavobbrz/server.git .
npm install
npm run build
chmod +x start-*.sh
```

---

## 🔑 Passo 3: Configurar Tokens

### 3.1. Obter Tokens do Haxball

1. Acesse: https://haxball.com/headlesstoken
2. Faça login com sua conta Haxball
3. Gere **4 tokens** (um para cada sala)
4. Copie cada token

### 3.2. Configurar Token em Cada Servidor

**Para cada servidor:**

1. Acesse **Files** no painel
2. Edite o arquivo `token.txt`
3. Cole o token correspondente
4. Salve o arquivo

**IMPORTANTE:** Cada sala precisa de um token diferente!

---

## ⚙️ Passo 4: Configurar Variáveis de Ambiente

### 4.1. Acessar Variáveis

1. Vá em **Startup** no painel do servidor
2. Role até **Variables**

### 4.2. Configurar ROOM_TYPE

Para cada servidor, configure a variável `ROOM_TYPE`:

- **Servidor 1:** `x3-nivel`
- **Servidor 2:** `x3-noobs`
- **Servidor 3:** `x1`
- **Servidor 4:** `x4`

### 4.3. Configurar Webhooks (Opcional)

Se quiser usar webhooks do Discord, adicione as variáveis:

- `WEBHOOK_X3_NIVEL`
- `WEBHOOK_X3_NOOBS`
- `WEBHOOK_X1`
- `WEBHOOK_X4`

**Como adicionar variável:**
1. Clique em **Add Variable**
2. **Name:** `WEBHOOK_X3_NIVEL`
3. **Value:** `https://discord.com/api/webhooks/...`
4. **Description:** `Webhook do Discord para sala X3 Nivel`

---

## 👑 Passo 5: Configurar Admins

### 5.1. Obter seu Auth ID

1. Entre em qualquer sala Haxball
2. Abra o console do navegador (F12)
3. Digite qualquer coisa no chat
4. Procure no console por algo como: `auth: "abc123xyz"`
5. Copie o Auth ID

### 5.2. Adicionar ao adminlist.txt

1. Acesse **Files** → **lists** → **adminlist.txt**
2. Adicione seu Auth ID (um por linha)
3. Salve o arquivo

Exemplo:
```
abc123xyz
def456uvw
ghi789rst
```

---

## 🎮 Passo 6: Iniciar os Servidores

### 6.1. Verificar Permissões

Certifique-se de que os scripts têm permissão de execução:

1. Acesse o console do servidor
2. Execute:
```bash
chmod +x start-*.sh
```

### 6.2. Iniciar Cada Servidor

1. Vá em **Console** no painel
2. Clique em **Start**
3. Aguarde a mensagem com o link da sala

Você verá algo como:
```
═══════════════════════════════════════
🔥 SALA: 🔥HAX HOST🔥 FUTSAL X3 NIVEL 🔥
🔗 LINK: https://www.haxball.com/play?c=XXXXX
═══════════════════════════════════════
```

### 6.3. Verificar se Está Funcionando

1. Copie o link da sala
2. Abra no navegador
3. Entre na sala
4. Teste os comandos: `!help`, `!discord`, `!regras`

---

## 🔧 Passo 7: Configurações Avançadas

### 7.1. Auto-Restart

Configure o servidor para reiniciar automaticamente em caso de crash:

1. Vá em **Startup**
2. Ative **Auto Restart**

### 7.2. Backup Automático

Configure backups regulares:

1. Vá em **Backups**
2. Configure agendamento automático
3. Mantenha pelo menos 3 backups

### 7.3. Monitoramento

Use o console para monitorar:
- Entrada/saída de jogadores
- Erros ou problemas
- Performance do servidor

---

## 📊 Estrutura Final no Pterodactyl

```
/home/container/
├── dist/
│   ├── index.js
│   ├── config.js
│   ├── commands.js
│   ├── admincommands.js
│   ├── discord.js
│   └── ... (outros arquivos compilados)
├── lists/
│   ├── adminlist.txt
│   └── badwords.txt
├── stadiums/
│   ├── practice.hbs
│   ├── futsal2x2.hbs
│   └── futsal3x3.hbs
├── node_modules/
├── package.json
├── token.txt
├── start-x3-nivel.sh
├── start-x3-noobs.sh
├── start-x1.sh
└── start-x4.sh
```

---

## 🆘 Solução de Problemas

### Erro: "Permission denied"
```bash
chmod +x start-*.sh
```

### Erro: "Token inválido"
- Verifique se o token está correto no `token.txt`
- Gere um novo token em https://haxball.com/headlesstoken

### Erro: "Cannot find module"
```bash
npm install
```

### Erro: "Port already in use"
- Cada servidor precisa de uma porta diferente
- Configure portas diferentes no Pterodactyl

### Servidor não inicia
1. Verifique os logs no console
2. Certifique-se de que o `token.txt` existe
3. Verifique se o Node.js está instalado
4. Execute `npm run build` novamente

### Webhooks não funcionam
1. Verifique se a URL do webhook está correta
2. Teste o webhook manualmente
3. Verifique as variáveis de ambiente

---

## 🔄 Atualizar o Servidor

Para atualizar o código:

```bash
# No console do servidor
git pull origin main
npm install
npm run build
```

Depois, reinicie o servidor no painel.

---

## 📝 Checklist de Deploy

Use este checklist para cada sala:

- [ ] Servidor criado no Pterodactyl
- [ ] Arquivos enviados via Git/SFTP
- [ ] `npm install` executado
- [ ] `npm run build` executado
- [ ] `token.txt` configurado com token único
- [ ] Variável `ROOM_TYPE` configurada
- [ ] Scripts `.sh` com permissão de execução
- [ ] `adminlist.txt` configurado com Auth IDs
- [ ] Webhook do Discord configurado (opcional)
- [ ] Servidor iniciado com sucesso
- [ ] Link da sala funcionando
- [ ] Comandos testados (!help, !discord)
- [ ] Auto-restart ativado
- [ ] Backup configurado

---

## 🎉 Pronto!

Suas 4 salas Haxball estão rodando no Pterodactyl!

**Links Úteis:**
- 📚 [README Principal](README.md)
- 🔔 [Guia de Discord](DISCORD_SETUP.md)
- 🐛 [Reportar Problemas](https://github.com/gustavobbrz/server/issues)

**Suporte:**
- Discord da comunidade
- Issues no GitHub
- Logs do console do Pterodactyl

---

**Desenvolvido com ❤️ para a comunidade Haxball brasileira 🇧🇷**
