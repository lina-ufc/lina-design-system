#!/bin/sh
# Regenera os recortes PNG do capítulo 7 a partir dos PDFs de exemplo.
# Uso: sh capitulos/7-componentes/_recortes.sh   (de qualquer pasta)
set -e
RAIZ=$(cd "$(dirname "$0")/../.." && pwd)
cd "$RAIZ"
OUT=capitulos/7-componentes/img
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

# recorta <pdf> <pagina> <texto-esperado> <x> <y> <w> <h> <saida>
# Página a 144 dpi (slide 1920 px de largura, A4 ~1191 px). Falha se o texto não estiver na página.
recorta() {
  pdf=$1; pag=$2; texto=$3; x=$4; y=$5; w=$6; h=$7; saida=$8
  if ! pdftotext -f "$pag" -l "$pag" "$pdf" - | grep -qF -- "$texto"; then
    echo "ERRO: '$texto' não está na página $pag de $pdf (PDF repaginado?)" >&2
    exit 1
  fi
  pdftoppm -r 144 -f "$pag" -l "$pag" -png "$pdf" "$TMP/p"
  magick "$TMP"/p-*.png +repage -crop "${w}x${h}+${x}+${y}" +repage "$OUT/$saida.png"
  rm -f "$TMP"/p-*.png
}

recorta templates/apresentacao/LINA-Apresentacao-exemplo.pdf 25 "Declaração-chave" 48 252 1824 610 declaracao-slide
recorta templates/documento-a4/LINA-POP-exemplo.pdf 1 "Atenção" 89 1038 1012 118 declaracao-a4
