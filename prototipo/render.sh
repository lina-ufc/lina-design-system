#!/bin/sh
# Uso: render.sh <arquivo.html> <nome>
# Captura a página inteira em 1440 px (desktop) e 390 px (celular) com o Chrome sem janela.
# O Chrome sem janela não abre com menos de 500 px: o celular é a página num iframe de 390 px,
# recortado depois.
set -e
cd "$(dirname "$0")/.."
chrome="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
alt=30000  # altura da janela; aparar.py corta a sobra
mkdir -p prototipo/render
url="file://$PWD/$1"
moldura="prototipo/render/_celular.html"
printf '<body style="margin:0"><iframe src="%s" width="390" height="%s" style="border:0;display:block"></iframe>' "$url" "$alt" > "$moldura"
for par in desktop:1440:$url celular:500:file://$PWD/$moldura; do
  tipo=${par%%:*}; resto=${par#*:}; larg=${resto%%:*}; alvo=${resto#*:}
  nome="prototipo/render/$2-$tipo.png"
  "$chrome" --headless --disable-gpu --hide-scrollbars --virtual-time-budget=8000 \
    --window-size="$larg,$alt" --screenshot="$PWD/$nome" "$alvo" >/dev/null 2>&1
  [ "$tipo" = celular ] && python3 -c "from PIL import Image;i=Image.open('$nome');i.crop((0,0,390,i.height)).save('$nome')"
  python3 prototipo/aparar.py "$nome"
done
rm -f "$moldura"
