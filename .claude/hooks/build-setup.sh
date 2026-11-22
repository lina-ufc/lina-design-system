#!/bin/sh
# Instala as dependências do gerador do template se faltarem (node_modules fica fora do git).
D="$CLAUDE_PROJECT_DIR/templates/apresentacao/potx"
if ! command -v npm >/dev/null 2>&1; then echo "build-setup: npm não encontrado."
elif [ -d "$D/node_modules" ]; then echo "build-setup: node_modules ok. Build: sh templates/apresentacao/potx/make.sh"
else (cd "$D" && nohup npm ci --no-audit --no-fund > npm.log 2>&1 &); echo "build-setup: npm ci rodando em segundo plano (log: $D/npm.log)."
fi
