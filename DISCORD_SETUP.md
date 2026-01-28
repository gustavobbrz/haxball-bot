# 🔔 Configuração de Webhooks do Discord

Este guia explica como configurar webhooks do Discord para receber notificações das suas salas Haxball.

---

## 📋 O que são Webhooks?

Webhooks são URLs especiais que permitem enviar mensagens automaticamente para um canal do Discord. Com eles, você receberá:

- ✅ Notificações quando jogadores entram/saem
- ⚽ Resultados de partidas
- 👑 Logs de ações administrativas
- 📊 Estatísticas em tempo real

---

## 🚀 Como Criar um Webhook

### Passo 1: Acessar Configurações do Canal

1. Abra o Discord
2. Vá até o servidor onde deseja receber as notificações
3. Clique com o botão direito no canal desejado
4. Selecione **"Editar Canal"**

### Passo 2: Criar o Webhook

1. No menu lateral, clique em **"Integrações"**
2. Clique em **"Webhooks"**
3. Clique no botão **"Novo Webhook"**
4. Dê um nome ao webhook (ex: "Haxball X3 Nivel")
5. Escolha um avatar (opcional)
6. Clique em **"Copiar URL do Webhook"**

### Passo 3: Configurar no Servidor

Você tem duas opções:

#### Opção A: Usando Variáveis de Ambiente (Recomendado)

1. Crie um arquivo `.env` na raiz do projeto (se ainda não existir)
2. Adicione a URL do webhook:

```env
WEBHOOK_X3_NIVEL=https://discord.com/api/webhooks/1234567890/ABCDEFGHIJKLMNOPQRSTUVWXYZ
WEBHOOK_X3_NOOBS=https://discord.com/api/webhooks/1234567890/ABCDEFGHIJKLMNOPQRSTUVWXYZ
WEBHOOK_X1=https://discord.com/api/webhooks/1234567890/ABCDEFGHIJKLMNOPQRSTUVWXYZ
WEBHOOK_X4=https://discord.com/api/webhooks/1234567890/ABCDEFGHIJKLMNOPQRSTUVWXYZ
```

#### Opção B: Editando o Arquivo de Configuração

1. Abra o arquivo `config.ts`
2. Encontre a configuração da sala desejada
3. Substitua a URL do webhook:

```typescript
'x3-nivel': {
  roomName: "🔥HAX HOST🔥 FUTSAL X3 NIVEL 🔥",
  maxPlayers: 30,
  scoreLimit: 3,
  timeLimit: 3,
  discordLink: "https://discord.gg/SEU_LINK_AQUI",
  webhookUrl: "https://discord.com/api/webhooks/1234567890/ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  roomType: 'x3-nivel'
}
```

4. Recompile o código: `npm run build`

---

## 🎨 Personalizar Mensagens

As mensagens do Discord são enviadas como **embeds** coloridos. Você pode personalizar:

### Cores dos Embeds

Edite o arquivo `discord.ts`:

```typescript
// Verde para jogador entrando
color: 0x00FF00

// Vermelho para jogador saindo
color: 0xFF0000

// Azul para time azul vencendo
color: 0x0000FF

// Laranja para ações de admin
color: 0xFFA500
```

### Campos das Mensagens

Você pode adicionar ou remover campos editando as funções em `discord.ts`:

```typescript
fields: [
  {
    name: "Sala",
    value: roomName,
    inline: true
  },
  {
    name: "Novo Campo",
    value: "Valor do campo",
    inline: false
  }
]
```

---

## 🧪 Testar Webhooks

Para testar se o webhook está funcionando:

1. Inicie uma sala: `./start-x3-nivel.sh`
2. Entre na sala pelo navegador
3. Verifique se a mensagem apareceu no canal do Discord

Se não funcionar, verifique:
- ✅ A URL do webhook está correta
- ✅ O bot tem permissão para enviar mensagens no canal
- ✅ A variável de ambiente está configurada corretamente
- ✅ O código foi recompilado após as alterações

---

## 🔒 Segurança

**⚠️ IMPORTANTE: Nunca compartilhe suas URLs de webhook!**

- Não faça commit das URLs no GitHub
- Use variáveis de ambiente
- Adicione `.env` ao `.gitignore`
- Se a URL vazar, delete o webhook e crie um novo

---

## 📊 Exemplo de Mensagens

### Jogador Entrando
```
🟢 Jogador Entrou
Gustavo entrou na sala!

Sala: 🔥HAX HOST🔥 FUTSAL X3 NIVEL 🔥
```

### Resultado de Partida
```
⚽ Resultado da Partida
🔴 Time Vermelho venceu a partida!

Placar: 🔴 3 x 2 🔵
Time Vermelho: Gustavo, João, Pedro
Time Azul: Maria, Ana, Carlos

Sala: 🔥HAX HOST🔥 FUTSAL X3 NIVEL 🔥
```

### Ação de Admin
```
⚠️ Ação de Admin
Admin executou uma ação administrativa.

Ação: Kick
Jogador Alvo: Troll123
Motivo: Spam no chat

Sala: 🔥HAX HOST🔥 FUTSAL X3 NIVEL 🔥
```

---

## 🆘 Problemas Comuns

### "Webhook não está enviando mensagens"
- Verifique se a URL está correta
- Certifique-se de que o webhook não foi deletado
- Verifique os logs do servidor para erros

### "Erro 404 ao enviar webhook"
- A URL do webhook está incorreta ou foi deletada
- Crie um novo webhook

### "Erro 401 ou 403"
- O webhook não tem permissão para enviar mensagens
- Verifique as permissões do canal

### "Mensagens duplicadas"
- Você pode estar rodando múltiplas instâncias da mesma sala
- Verifique se não há processos duplicados

---

## 💡 Dicas Avançadas

### Webhooks Separados por Tipo de Evento

Você pode criar webhooks diferentes para cada tipo de evento:

```typescript
webhookJoin: "URL_PARA_ENTRADAS",
webhookLeave: "URL_PARA_SAIDAS",
webhookGame: "URL_PARA_RESULTADOS",
webhookAdmin: "URL_PARA_ACOES_ADMIN"
```

### Rate Limiting

O Discord limita webhooks a 30 mensagens por minuto. Se você ultrapassar, as mensagens serão rejeitadas.

### Menções no Discord

Para mencionar usuários ou roles, adicione ao conteúdo:

```typescript
content: "<@USER_ID>" // Mencionar usuário
content: "<@&ROLE_ID>" // Mencionar role
```

---

**Pronto! Agora suas salas Haxball estão integradas com o Discord! 🎉**
