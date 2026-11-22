#!/bin/sh
# Gera o template e os arquivos de download.
# Saída em templates/apresentacao/: .potx, -exemplo.pptx, -exemplo.pdf, Apresentacao.dc.html + img/;
# em downloads/: LINA-Apresentacao-HTML.zip e LINA-Fontes-e-Icones.zip. Tudo gerado fica fora do git.
# Precisa de: node (npm ci nesta pasta), python3 com lxml, defusedxml e pillow, soffice (LibreOffice) para o PDF.
set -e
cd "$(dirname "$0")"
[ -d node_modules ] || npm ci --no-audit --no-fund
mkdir -p out
node build.js
NODE_PATH=$PWD/node_modules node vendor/apply_theme.js out/LINA-Apresentacao.pptx theme.json
python3 post.py out/LINA-Apresentacao.pptx
python3 vendor/office/validate.py out/LINA-Apresentacao.pptx | tail -1
python3 vendor/office/validate.py out/LINA-Apresentacao.potx | tail -1
python3 aspect.py out/LINA-Apresentacao.pptx  # falha se alguma imagem estiver distorcida

T=..
cp out/LINA-Apresentacao.potx $T/LINA-Apresentacao.potx
cp out/LINA-Apresentacao.pptx $T/LINA-Apresentacao-exemplo.pptx
rm -rf $T/img && cp -R out/html/img $T/img && cp out/html/Apresentacao.dc.html $T/
python3 embed-deck-stage.py $T/Apresentacao.dc.html $T/deck-stage.js
soffice --headless --convert-to pdf --outdir out $T/LINA-Apresentacao-exemplo.pptx >/dev/null && cp out/LINA-Apresentacao-exemplo.pdf $T/
python3 ../../../downloads/empacotar.py
