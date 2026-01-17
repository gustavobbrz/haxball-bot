#!/bin/bash
# Script de inicialização para Pterodactyl Panel
# Coloque este arquivo na raiz do projeto com permissão de execução

echo "🚀 Iniciando Haxball Bot..."

# Instala dependências se necessário
if [ ! -d "node_modules" ]; then
  echo "📦 Instalando dependências..."
  npm install
fi

# Cria pasta de configs se não existir
if [ ! -d "configs" ]; then
  echo "📁 Criando pasta de configurações..."
  mkdir -p configs
fi

# Cria arquivo de config padrão se não existir
if [ ! -f "configs/default.json" ]; then
  echo "⚙️  Criando configuração padrão..."
  cat > configs/default.json << 'EOF'
{
  "version": "2.0.0",
  "port": 3002,
  "adminSecret": "change_me_with_a_secure_secret",
  "rooms": [],
  "webhooks": {}
}
EOF
fi

# Inicia o servidor
echo "✅ Iniciando servidor..."
npm start
