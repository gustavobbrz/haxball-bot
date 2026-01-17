# 🎯 CONFIGURAR VARIÁVEIS NO SEU EGG "Haxball Auto-Git"

## ✅ Você já tem um Egg customizado - Perfeito!

Vejo que seu Egg já está configurado com:
- Git Repo Address (para clonar automaticamente)
- Variáveis de tokens e nomes de salas

---

## 🔧 O QUE VOCÊ PRECISA FAZER

### Na aba **Variables** do seu Egg, configure:

#### 1️⃣ GIT REPO ADDRESS (já configurado)
- ✅ Manter como está: `https://github.com/gustavobbrz/haxball-bot.git`
- Isso faz o clone automático do novo código

#### 2️⃣ PORT (NOVO - Adicionar se não existir)
- **Name:** PORT
- **Environment Variable:** PORT
- **Default Value:** 3002
- **Description:** Porta da API REST
- **Input Rules:** required|integer
- ✅ Salvar

#### 3️⃣ ADMIN_SECRET (NOVO - Adicionar se não existir)
- **Name:** ADMIN_SECRET
- **Environment Variable:** ADMIN_SECRET
- **Default Value:** seu_secret_super_seguro_aqui
- **Description:** Token de autenticação para API
- **Input Rules:** required|string|min:20
- ✅ Salvar

#### 4️⃣ NODE_ENV (NOVO - Adicionar se não existir)
- **Name:** NODE_ENV
- **Environment Variable:** NODE_ENV
- **Default Value:** production
- **Description:** Ambiente de execução
- **Input Rules:** required|string
- ✅ Salvar

#### 5️⃣ TOKEN SALA 01 (Manter/Atualizar)
- ✅ Nome: Token Sala 01
- ✅ Variável: SALA1_TOKEN
- ✅ Valor: seu_token_thr1...
- Descrição: "Token Haxball para Sala 1"
- ✅ Salvar

#### 6️⃣ NOME DA SALA 01 (Manter/Atualizar)
- ✅ Nome: Nome da Sala 01
- ✅ Variável: SALA1_NOME
- ✅ Valor: 🔴⚫ FUTSAL BILLY ⚫🔴
- Descrição: "Nome da sala 1"
- ✅ Salvar

#### 7️⃣ TOKEN SALA 02 (Manter/Atualizar)
- ✅ Nome: Token Sala 02
- ✅ Variável: SALA2_TOKEN
- ✅ Valor: seu_token_thr1...
- Descrição: "Token Haxball para Sala 2"
- ✅ Salvar

#### 8️⃣ NOME DA SALA 02 (Manter/Atualizar)
- ✅ Nome: Nome da Sala 02
- ✅ Variável: SALA2_NOME
- ✅ Valor: 🔴⚫ FUTSAL BILLY #2 ⚫🔴
- Descrição: "Nome da sala 2"
- ✅ Salvar

---

## 📋 RESUMO - Adicionar as Variáveis Novas:

| Variável | Valor |
|----------|-------|
| **PORT** | `3002` |
| **ADMIN_SECRET** | `seu_secret_super_seguro` |
| **NODE_ENV** | `production` |

As outras (tokens e nomes) você já tem. Só precisa atualizar com os novos tokens/nomes se tiver mudado.

---

## ⚠️ IMPORTANTE

O seu Egg "Haxball Auto-Git" vai:
1. ✅ Clonar o repositório automaticamente
2. ✅ Rodar `npm install` automaticamente
3. ✅ Iniciar com o comando que você configurar no Startup

Então você **NÃO** precisa fazer:
- ❌ git clone manual
- ❌ npm install manual
- ❌ Comandos no console

Tudo é automático! 🤖

---

## 🚀 PRÓXIMAS AÇÕES

1. Adicionar as 3 variáveis novas (PORT, ADMIN_SECRET, NODE_ENV)
2. Atualizar tokens das salas se necessário
3. Voltar para o servidor
4. Parar e iniciar o servidor
5. Verificar os logs
6. ✅ Pronto!

---

## 🎯 QUANDO TIVER TUDO CONFIGURADO

Seu servidor vai:
- ✅ Clonar automaticamente da GitHub
- ✅ Instalar dependências automaticamente
- ✅ Iniciar a API na porta 3002
- ✅ Salas começam online automaticamente
- ✅ Tudo gerenciado via API

Você vai criar/deletar/gerenciar salas via curl ou CLI! 💪

---

**Pronto? Qualquer dúvida me chama!** 💬
