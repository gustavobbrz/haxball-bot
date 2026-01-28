# 📋 Guia de Configuração dos Canais Adicionais do Discord

Este guia explica como adicionar os canais de **denúncias** e **chat da sala** para cada categoria do seu servidor Discord.

---

## 🎯 O que será criado

Para cada sala (X3 NIVEL, X3 NOOBS, X1, X4), serão criados:

1. **#[sala]-denuncias** - Canal para receber denúncias de jogadores
2. **#[sala]-chat-sala** - Canal para receber mensagens do chat da sala em tempo real

---

## 🤖 Pré-requisitos

### 1. Criar um Bot no Discord

1. Acesse: https://discord.com/developers/applications
2. Clique em **"New Application"**
3. Dê um nome (ex: "Arena Cup Manager")
4. Vá em **"Bot"** no menu lateral
5. Clique em **"Add Bot"**
6. Em **"Token"**, clique em **"Copy"** para copiar o token
7. **GUARDE ESTE TOKEN COM SEGURANÇA!**

### 2. Configurar Permissões do Bot

1. Ainda na página do bot, vá em **"OAuth2" > "URL Generator"**
2. Selecione os **Scopes**:
   - `bot`
   - `applications.commands`
3. Selecione as **Permissions**:
   - `Manage Channels`
   - `Manage Webhooks`
   - `Send Messages`
   - `Embed Links`
   - `Read Message History`
   - `Manage Messages`
   - `Manage Roles`
4. Copie a URL gerada e abra no navegador
5. Selecione seu servidor e autorize o bot

### 3. Obter IDs Necessários

#### Ativar Modo Desenvolvedor no Discord

1. Discord > Configurações do Usuário > Avançado
2. Ative **"Modo Desenvolvedor"**

#### Copiar ID do Servidor (Guild ID)

1. Clique com botão direito no nome do servidor
2. Clique em **"Copiar ID"**

#### Copiar IDs das Categorias

Para cada categoria das salas:
1. Clique com botão direito na categoria
2. Clique em **"Copiar ID"**

Você precisará dos IDs de:
- Categoria X3 NIVEL
- Categoria X3 NOOBS
- Categoria X1
- Categoria X4

---

## 🚀 Executando o Script

### Método 1: Usando Variáveis de Ambiente (Recomendado)

```bash
# Configure as variáveis
export DISCORD_BOT_TOKEN="seu_token_do_bot_aqui"
export DISCORD_GUILD_ID="id_do_seu_servidor"
export CATEGORY_X3_NIVEL="id_da_categoria_x3_nivel"
export CATEGORY_X3_NOOBS="id_da_categoria_x3_noobs"
export CATEGORY_X1="id_da_categoria_x1"
export CATEGORY_X4="id_da_categoria_x4"

# Execute o script
node discord-setup-channels.js
```

### Método 2: Editando o Script Diretamente

1. Abra o arquivo `discord-setup-channels.js`
2. Edite as constantes no início do arquivo:

```javascript
const DISCORD_BOT_TOKEN = 'seu_token_do_bot_aqui';
const GUILD_ID = 'id_do_seu_servidor';

const CATEGORIES = {
  'x3-nivel': 'id_da_categoria_x3_nivel',
  'x3-noobs': 'id_da_categoria_x3_noobs',
  'x1': 'id_da_categoria_x1',
  'x4': 'id_da_categoria_x4'
};
```

3. Execute:
```bash
node discord-setup-channels.js
```

---

## ✅ O que o Script Faz

1. **Cria os canais** nas categorias especificadas
2. **Cria webhooks** para cada canal
3. **Atualiza o arquivo .env** com as URLs dos webhooks
4. **Exibe um resumo** de tudo que foi criado

---

## 📝 Resultado Esperado

Após executar o script, você verá:

```
🚀 Iniciando configuração de canais do Discord...

📂 Configurando categoria: X3-NIVEL
   ID da Categoria: 123456789...

📝 Criando canal: x3-nivel-denuncias
✅ Canal criado: x3-nivel-denuncias (ID: 987654321...)
🔗 Criando webhook: Denúncias X3-NIVEL
✅ Webhook criado: Denúncias X3-NIVEL
   URL: https://discord.com/api/webhooks/...

📝 Criando canal: x3-nivel-chat-sala
✅ Canal criado: x3-nivel-chat-sala (ID: 987654322...)
🔗 Criando webhook: Chat X3-NIVEL
✅ Webhook criado: Chat X3-NIVEL
   URL: https://discord.com/api/webhooks/...

...

✅ Arquivo .env atualizado com novos webhooks!

✨ Configuração concluída!
```

---

## 🔧 Integração com o Código

Após executar o script, seu arquivo `.env` terá novas variáveis:

```env
# Webhooks adicionais
WEBHOOK_X3_NIVEL_DENUNCIAS="https://discord.com/api/webhooks/..."
WEBHOOK_X3_NIVEL_CHAT="https://discord.com/api/webhooks/..."
WEBHOOK_X3_NOOBS_DENUNCIAS="https://discord.com/api/webhooks/..."
WEBHOOK_X3_NOOBS_CHAT="https://discord.com/api/webhooks/..."
WEBHOOK_X1_DENUNCIAS="https://discord.com/api/webhooks/..."
WEBHOOK_X1_CHAT="https://discord.com/api/webhooks/..."
WEBHOOK_X4_DENUNCIAS="https://discord.com/api/webhooks/..."
WEBHOOK_X4_CHAT="https://discord.com/api/webhooks/..."
```

Para usar no código, adicione ao `config.ts`:

```typescript
webhooks: {
  join: process.env.WEBHOOK_X3_NIVEL_JOIN || "",
  leave: process.env.WEBHOOK_X3_NIVEL_LEAVE || "",
  game: process.env.WEBHOOK_X3_NIVEL_GAME || "",
  admin: process.env.WEBHOOK_X3_NIVEL_ADMIN || "",
  denuncias: process.env.WEBHOOK_X3_NIVEL_DENUNCIAS || "",
  chat: process.env.WEBHOOK_X3_NIVEL_CHAT || ""
}
```

---

## ⚠️ Solução de Problemas

### Erro: "Invalid Bot Token"
- Verifique se o token está correto
- Certifique-se de que não há espaços extras

### Erro: "Missing Permissions"
- Verifique se o bot tem permissão de "Manage Channels" e "Manage Webhooks"
- Reautorize o bot com as permissões corretas

### Erro: "Unknown Channel"
- Verifique se os IDs das categorias estão corretos
- Certifique-se de que o bot está no servidor

### Canais não aparecem
- Aguarde alguns segundos e recarregue o Discord
- Verifique se não há erros no console

---

## 🔒 Segurança

**⚠️ NUNCA compartilhe seu token do bot!**

- Não faça commit do token no GitHub
- Use variáveis de ambiente
- Adicione `.env` ao `.gitignore`
- Se o token vazar, regenere-o imediatamente no Discord Developer Portal

---

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs do script
2. Confirme que todas as permissões estão corretas
3. Teste com um servidor de teste primeiro
4. Consulte a documentação do Discord: https://discord.com/developers/docs

---

**Pronto! Seus canais adicionais estão configurados! 🎉**
