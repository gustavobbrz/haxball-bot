#!/bin/bash
# Script para iniciar sala X3 NOOBS

export ROOM_TYPE="x3-noobs"
export WEBHOOK_X3_NOOBS="${WEBHOOK_X3_NOOBS:-}"

echo "🔥 Iniciando HAX HOST - FUTSAL X3 NOOBS 🔥"
node dist/index.js
