# ⚡ Guia Rápido de Comandos

## 👥 Comandos para Jogadores

### Informações
```
!help           - Ver todos os comandos disponíveis
!regras         - Ver as regras da sala
!stats          - Ver estatísticas da sala (jogadores, times, etc)
!discord        - Ver link do servidor Discord
!github         - Ver repositório do código
```

### Ações
```
!afk            - Marcar-se como AFK e ir para espectadores
!bb             - Sair da sala com mensagem de despedida
```

---

## 👑 Comandos para Admins

### Gerenciamento de Jogadores
```
!kick <nome/id> [motivo]        - Expulsar jogador da sala
!ban <nome/id> [motivo]         - Banir jogador permanentemente
!mute <nome/id>                 - Silenciar jogador (aviso)
```

**Exemplos:**
```
!kick Troll123 Comportamento inadequado
!kick 5 Spam
!ban Hacker Uso de cheats
!mute 3
```

### Gerenciamento de Partidas
```
!rr             - Reiniciar a partida atual
!pause          - Pausar a partida
!unpause        - Despausar a partida
```

### Gerenciamento de Times
```
!swap <nome/id>                 - Trocar jogador de time
```

**Exemplos:**
```
!swap Gustavo
!swap 7
```

### Gerenciamento de Admins
```
!setadmin <nome/id>             - Dar permissões de admin
!removeadmin <nome/id>          - Remover permissões de admin
```

**Exemplos:**
```
!setadmin João
!removeadmin 4
```

### Moderação
```
!clearbans      - Limpar todos os bans da sala
```

---

## 🔍 Busca de Jogadores

Os comandos de admin aceitam **nome** ou **ID**:

### Por ID:
```
!kick 5
!ban 3
!swap 7
```

### Por Nome (parcial, case insensitive):
```
!kick gust          (encontra "Gustavo")
!ban troll          (encontra "Troll123")
!swap joão          (encontra "João")
```

---

## 🎨 Exemplos de Uso

### Cenário 1: Jogador fazendo spam
```
Admin: !mute Spammer123
(Jogador recebe aviso)

Se continuar:
Admin: !kick Spammer123 Spam no chat
```

### Cenário 2: Jogador usando hack
```
Admin: !ban Hacker Uso de cheats
(Jogador é banido permanentemente)
```

### Cenário 3: Times desbalanceados
```
Admin: !swap Gustavo
(Gustavo muda de time)
```

### Cenário 4: Partida travada
```
Admin: !rr
(Partida reinicia)
```

### Cenário 5: Dar admin temporário
```
Admin: !setadmin João
(João vira admin)

Depois:
Admin: !removeadmin João
(João volta a ser jogador normal)
```

### Cenário 6: Limpar bans antigos
```
Admin: !clearbans
(Todos os bans são removidos)
```

---

## 🔔 Notificações no Discord

Todas as ações de admin são enviadas para o Discord (se configurado):

### Exemplo de Notificação:
```
⚠️ Ação de Admin
Admin executou uma ação administrativa.

Ação: Kick
Jogador Alvo: Troll123
Motivo: Spam no chat
Sala: 🔥HAX HOST🔥 FUTSAL X3 NIVEL 🔥
```

---

## 📊 Mensagens Automáticas

### Quando um jogador entra:
```
═══════════════════════════════════════
🔥 Bem-vindo(a) Gustavo! 🔥
═══════════════════════════════════════

💬 Entre no nosso Discord para fazer amigos!
🔗 https://discord.gg/SEU_LINK

📜 Digite !regras para ver as regras
❓ Digite !help para ver todos os comandos
═══════════════════════════════════════

🟢 Gustavo entrou na sala!
```

### Quando há um gol:
```
⚽ GOOOOOL! 🔴 Time Vermelho marcou!
📊 Placar: 🔴 3 x 2 🔵
```

### Quando um admin entra:
```
👑 Gustavo é um administrador!
```

---

## 🛡️ Proteções Automáticas

O servidor tem proteções automáticas que **não precisam de comando**:

### Proteção contra AFK
- Jogadores inativos são detectados automaticamente
- São movidos para espectadores ou kickados

### Proteção contra Palavrões
- Nomes e mensagens com palavrões são bloqueados
- Jogador é banido automaticamente

### Proteção contra Spam
- Mensagens repetidas são detectadas
- Jogador recebe aviso ou é kickado

### Proteção contra Multi-conta
- Múltiplas conexões do mesmo IP são bloqueadas
- Segunda conexão é kickada automaticamente

---

## 🎯 Dicas para Admins

### ✅ Boas Práticas:

1. **Sempre dê um motivo** ao kickar/banir
   - Bom: `!kick Troll Spam no chat`
   - Ruim: `!kick Troll`

2. **Use !mute antes de !kick**
   - Dê uma chance ao jogador

3. **Use !swap para balancear times**
   - Não force jogadores a sair

4. **Use !clearbans periodicamente**
   - Dê segundas chances

5. **Use !rr com moderação**
   - Só reinicie se realmente necessário

### ❌ Evite:

1. Abusar dos comandos
2. Kickar sem motivo
3. Banir por erros pequenos
4. Trocar jogadores de time constantemente
5. Reiniciar partidas sem necessidade

---

## 🔒 Segurança

### Comandos de Admin são protegidos:

- ✅ Apenas admins podem usar
- ✅ Não funcionam em outros admins
- ✅ São logados no console
- ✅ São enviados para Discord (se configurado)

### Exemplo de Proteção:
```
Admin1: !kick Admin2
❌ Você não pode kickar um admin!
```

---

## 📱 Como se Tornar Admin

### Método 1: Auth ID (Recomendado)

1. Entre na sala
2. Abra console do navegador (F12)
3. Digite qualquer coisa no chat
4. Copie seu Auth ID do console
5. Peça ao dono para adicionar em `lists/adminlist.txt`
6. Saia e entre novamente na sala
7. Você será admin automaticamente

### Método 2: Comando !setadmin

1. Peça a um admin existente
2. Admin usa: `!setadmin SeuNome`
3. Você vira admin temporariamente
4. Admin é removido ao sair da sala

**Nota:** Método 1 é permanente, Método 2 é temporário.

---

## 🎮 Atalhos de Teclado (Haxball Padrão)

Estes não são comandos do servidor, mas atalhos do Haxball:

```
WASD ou Setas    - Mover jogador
X ou Espaço      - Chutar
C                - Passar (chute fraco)
V                - Trocar câmera
Tab              - Ver placar
```

---

## 💡 Dicas Extras

### Para encontrar ID de um jogador:
1. Digite `!stats` no chat
2. Veja a lista de jogadores
3. Ou olhe no console do navegador

### Para reportar bugs:
1. Use `!github` para ver o repositório
2. Abra uma Issue no GitHub
3. Descreva o problema detalhadamente

### Para sugerir melhorias:
1. Entre no Discord (`!discord`)
2. Sugira no canal apropriado
3. Ou abra uma Issue no GitHub

---

## 📞 Ajuda

Se tiver dúvidas:

1. Digite `!help` na sala
2. Leia o `README.md` no GitHub
3. Entre no Discord da comunidade
4. Abra uma Issue no GitHub

---

**Divirta-se e jogue limpo! ⚽🔥**
