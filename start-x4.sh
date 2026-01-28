#!/bin/bash
# Script para iniciar sala X4

export ROOM_TYPE="x4"
export WEBHOOK_X4="${WEBHOOK_X4:-}"

echo "🔥 Iniciando HAX HOST - FUTSAL X4 🔥"
node dist/index.js
