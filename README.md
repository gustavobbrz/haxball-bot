# 🔥 HAX HOST - Servidor Haxball Profissional 🔥

Servidor de Haxball com 4 salas personalizadas no estilo Amebas, com sistema completo de administração, webhooks do Discord e moderação automática.

---

## 🎮 Salas Disponíveis

1. **🔥HAX HOST🔥 FUTSAL X3 NIVEL 🔥** - Sala para jogadores experientes (3x3)
2. **🔥HAX HOST🔥 FUTSAL X3 NOOBS🔥** - Sala para iniciantes (3x3)
3. **🔥HAX HOST🔥 FUTSAL X1 🔥** - Sala para duelos 1x1
4. **🔥HAX HOST 🔥FUTSAL X4  🔥** - Sala para partidas grandes (4x4)

---

## ✨ Funcionalidades

### 🎯 Sistema de Jogo
- Inicia e para partidas automaticamente
- Move jogadores automaticamente dependendo do número de usuários
- Time vencedor sempre vai para o time vermelho
- Modo de treino quando há apenas um jogador esperando
- Suporte para múltiplos estádios (1x1, 2x2, 3x3, 4x4)

### 🛡️ Moderação Automática
- Expulsa jogadores AFK automaticamente
- Bane jogadores com palavrões no nome ou mensagens
- Detecta e expulsa spammers
- Impede múltiplas conexões do mesmo IP
- Sistema de admin com permissões especiais

### 👑 Comandos de Admin
- `!kick <nome/id> [motivo]` - Expulsar jogador
- `!ban <nome/id> [motivo]` - Banir jogador
- `!mute <nome/id>` - Silenciar jogador
- `!clearbans` - Limpar todos os bans
- `!rr` - Reiniciar partida
- `!pause` - Pausar partida
- `!unpause` - Despausar partida
- `!swap <nome/id>` - Trocar jogador de time
- `!setadmin <nome/id>` - Dar admin para jogador
- `!removeadmin <nome/id>` - Remover admin de jogador

### 💬 Comandos de Jogadores
- `!help` - Ver lista de comandos
- `!discord` - Ver link do Discord
- `!regras` - Ver regras da sala
- `!stats` - Ver estatísticas da sala
- `!afk` - Marcar-se como AFK
- `!bb` - Sair da sala
- `!github` - Ver repositório do código

### 🔔 Integração com Discord
- Notificações quando jogadores entram/saem
- Resultados de partidas enviados automaticamente
- Logs de ações administrativas
- Embeds personalizados e coloridos

### 🎨 Mensagens Personalizadas
- Boas-vindas estilizadas para novos jogadores
- Convites para o Discord
- Anúncios de gols e vitórias
- Mensagens de admin destacadas

---

## 🚀 Instalação

### Requisitos
- Node.js 18+ 
- npm ou pnpm
- Token do Haxball Headless (https://haxball.com/headlesstoken)

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/gustavobbrz/server.git
cd server
```

2. **Instale as dependências**
```bash
npm install
# ou
pnpm install
```

3. **Configure o token do Haxball**
Edite o arquivo `token.txt` e cole seu token:
```bash
echo "SEU_TOKEN_AQUI" > token.txt
```

4. **Configure os webhooks do Discord (opcional)**
```bash
cp .env.example .env
# Edite o arquivo .env com seus webhooks
```

5. **Configure a lista de admins**
Edite `lists/adminlist.txt` e adicione os IDs públicos dos admins (um por linha):
```
AUTH_ID_ADMIN_1
AUTH_ID_ADMIN_2
```

6. **Compile o TypeScript**
```bash
npm run build
```

7. **Inicie uma sala**
```bash
# Sala X3 NIVEL
./start-x3-nivel.sh

# Sala X3 NOOBS
./start-x3-noobs.sh

# Sala X1
./start-x1.sh

# Sala X4
./start-x4.sh
```

---

## 🐳 Deploy no Pterodactyl

### Configuração no Painel

1. **Criar 4 servidores** (um para cada sala)

2. **Configurar cada servidor:**
   - **Docker Image:** `ghcr.io/parkervcp/yolks:nodejs_18`
   - **Startup Command:** `./start-x3-nivel.sh` (ajustar para cada sala)
   - **Working Directory:** `/home/container`

3. **Variáveis de Ambiente:**
   ```
   ROOM_TYPE=x3-nivel
   WEBHOOK_X3_NIVEL=https://discord.com/api/webhooks/...
   ```

4. **Upload dos arquivos:**
   - Faça upload de todo o conteúdo do repositório
   - Certifique-se de que o `token.txt` está configurado
   - Verifique se os scripts `.sh` têm permissão de execução

5. **Iniciar os servidores**

### Estrutura de Diretórios no Pterodactyl
```
/home/container/
├── dist/                 # Código compilado
├── lists/               # Listas de admin e palavrões
├── stadiums/            # Mapas do Haxball
├── token.txt            # Token do Haxball
├── start-x3-nivel.sh    # Script de inicialização
├── start-x3-noobs.sh
├── start-x1.sh
├── start-x4.sh
└── package.json
```

---

## 🔧 Configuração Avançada

### Personalizar Link do Discord
Edite o arquivo `config.ts` e altere os links:
```typescript
discordLink: "https://discord.gg/SEU_CONVITE"
```

### Adicionar/Remover Palavrões
Edite `lists/badwords.txt` (uma palavra por linha)

### Ajustar Limites de Tempo/Gols
Edite `config.ts`:
```typescript
scoreLimit: 3,  // Gols para vencer
timeLimit: 3,   // Minutos de partida
```

### Modificar Mapas
Coloque seus arquivos `.hbs` na pasta `stadiums/`

---

## 📊 Estrutura do Projeto

```
server/
├── index.ts              # Arquivo principal
├── config.ts             # Configurações das salas
├── commands.ts           # Comandos de jogadores
├── admincommands.ts      # Comandos de admin
├── discord.ts            # Integração com Discord
├── playerjoining.ts      # Lógica de entrada de jogadores
├── playerleaving.ts      # Lógica de saída de jogadores
├── teammanagement.ts     # Gerenciamento de times
├── moderation.ts         # Sistema de moderação
├── afkdetection.ts       # Detecção de AFK
├── lists/
│   ├── adminlist.txt     # IDs de admins
│   └── badwords.txt      # Lista de palavrões
└── stadiums/
    ├── practice.hbs      # Mapa de treino
    ├── futsal2x2.hbs     # Mapa 2x2
    └── futsal3x3.hbs     # Mapa 3x3
```

---

## 🎯 Como Obter o Auth ID para Admin

1. Entre na sala do Haxball
2. Digite no chat: `/avatar` (qualquer comando funciona)
3. Copie o Auth ID que aparece no console do navegador (F12)
4. Cole o Auth ID no arquivo `lists/adminlist.txt`

---

## 🔗 Links Úteis

- **Haxball Headless Token:** https://haxball.com/headlesstoken
- **Documentação Haxball.js:** https://github.com/mertushka/haxball.js
- **Discord Webhooks:** https://support.discord.com/hc/en-us/articles/228383668

---

## 📝 Licença

MIT License - Sinta-se livre para usar e modificar!

---

## 🤝 Contribuindo

Pull requests são bem-vindos! Para mudanças grandes, abra uma issue primeiro para discutir o que você gostaria de mudar.

---

## 💡 Suporte

Se tiver problemas ou dúvidas:
1. Abra uma issue no GitHub
2. Entre no Discord da comunidade
3. Verifique os logs do servidor

---

**Desenvolvido com ❤️ para a comunidade Haxball brasileira 🇧🇷**
