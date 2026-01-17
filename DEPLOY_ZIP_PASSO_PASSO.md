# 📁 DEPLOY MANUAL NO PTERODACTYL - MÉTODO SFTP

## ✅ Passo 1: Baixar os Arquivos

Na sua pasta local: `c:\Users\murilo\Desktop\haxball-bot\`

Você já tem um arquivo: **haxball-deploy.zip**

Isso contém tudo que você precisa!

---

## ✅ Passo 2: Upload do ZIP no Pterodactyl

1. Pterodactyl → Seu Servidor → **Files**
2. Clique em **Upload**
3. Selecione: `haxball-deploy.zip`
4. Aguarde upload completar

---

## ✅ Passo 3: Limpar e Extrair

1. Vá em **Console** → **Command**
2. Cole este comando:

```bash
rm -rf *
```

3. Pressione Enter (isso deleta tudo)

4. Depois, cole:

```bash
cd /home/container && unzip -o haxball-deploy.zip && rm haxball-deploy.zip && ls -la
```

5. Pressione Enter e aguarde

Você deve ver listados:
```
index.js
config-manager.js
room-manager.js
api-server.js
package.json
configs/
src/
scripts/
```

---

## ✅ Passo 4: Configurar Startup

1. Vá em **Startup**
2. Command deve ser:

```
npm install && npm start
```

3. Salvar

---

## ✅ Passo 5: Variáveis (SE AINDA NÃO FEZ)

Em **Startup** → **Variables**, configure:

- **PORT** = `3002`
- **ADMIN_SECRET** = `seu_secret_super_seguro`
- **NODE_ENV** = `production`

(Já deve estar lá, só confirma)

---

## ✅ Passo 6: Iniciar

1. Clique em **Start**
2. Aguarde 1-2 minutos
3. Procure nos logs por:

```
✅ 🎮 Servidor Haxball pronto para uso!
```

Se vir isso = **SUCESSO!** 🎉

---

## 🆘 Problemas?

### Erro: "unzip: command not found"

Use este comando:

```bash
cd /home/container && tar -xzf haxball-deploy.zip && rm haxball-deploy.zip
```

### Arquivo não subiu?

- Tente novamente: **Files** → **Upload**
- Ou use SFTP (FileZilla, WinSCP)

### Ainda não funciona?

- Verifique se o arquivo `package.json` existe em **Files**
- Se não existir, repita os passos de upload

---

**Tenta esse método! Qualquer erro, me manda a screenshot!** 📸
