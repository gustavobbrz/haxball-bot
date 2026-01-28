#!/bin/bash
# Script para iniciar sala X1

export ROOM_TYPE="x1"
export WEBHOOK_X1="${WEBHOOK_X1:-}"

echo "🔥 Iniciando HAX HOST - FUTSAL X1 🔥"
node dist/index.js
