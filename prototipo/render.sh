#!/bin/sh
# Uso: render.sh <arquivo.html> <nome>
# Captura a página inteira em 1440 px (desktop) e 390 px (celular) com o Chrome sem janela.
set -e
cd "$(dirname "$0")/.."
chrome="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
alt=30000  # altura da janela; aparar.py corta a sobra
mkdir -p prototipo/render
url="file://$PWD/$1"
for par in desktop:1440 celular:390; do
  nome="prototipo/render/$2-${par%%:*}.png"
  "$chrome" --headless --disable-gpu --hide-scrollbars --virtual-time-budget=8000 \
    --window-size="${par##*:},$alt" --screenshot="$PWD/$nome" "$url" >/dev/null 2>&1
  python3 prototipo/aparar.py "$nome"
done
