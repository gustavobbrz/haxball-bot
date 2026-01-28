#!/bin/bash
# Script para iniciar sala X3 NIVEL

export ROOM_TYPE="x3-nivel"
export WEBHOOK_X3_NIVEL="${WEBHOOK_X3_NIVEL:-}"

echo "🔥 Iniciando HAX HOST - FUTSAL X3 NIVEL 🔥"
node dist/index.js
