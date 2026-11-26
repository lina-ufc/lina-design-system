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
  magick "$TMP"/p-*.png -define png:exclude-chunks=date,time +repage -crop "${w}x${h}+${x}+${y}" +repage "$OUT/$saida.png"
  rm -f "$TMP"/p-*.png
}

recorta templates/apresentacao/LINA-Apresentacao-exemplo.pdf 25 "Declaração-chave" 48 252 1824 610 declaracao-slide
recorta templates/documento-a4/LINA-POP-exemplo.pdf 1 "Atenção" 89 1038 1012 118 declaracao-a4
recorta templates/apresentacao/LINA-Apresentacao-exemplo.pdf 55 "Coluna destacada" 48 262 1824 326 tabela-slide
recorta templates/documento-a4/LINA-POP-exemplo.pdf 2 "Parâmetros por escala" 89 514 1012 290 tabela-a4
recorta templates/apresentacao/LINA-Apresentacao-exemplo.pdf 26 "Legenda colada à figura" 48 860 624 112 legenda-slide
recorta templates/documento-a4/LINA-Relatorio-exemplo.pdf 2 "Figura 1." 89 940 1012 135 legenda-a4
recorta templates/apresentacao/LINA-Apresentacao-exemplo.pdf 30 "Do levantamento ao painel" 48 270 1824 290 passos-slide
recorta templates/documento-a4/LINA-POP-exemplo.pdf 1 "Cada passo começa com um verbo" 89 800 1012 220 passos-a4
recorta templates/documento-a4/LINA-POP-exemplo.pdf 2 "Valores de referência" 89 676 1012 160 nota-a4
recorta templates/apresentacao/LINA-Apresentacao-exemplo.pdf 24 "Título abreviado do trabalho" 0 0 1920 1080 cabecalho-slide
recorta templates/documento-a4/LINA-POP-exemplo.pdf 1 "POP-04" 0 0 1191 1684 cabecalho-a4
