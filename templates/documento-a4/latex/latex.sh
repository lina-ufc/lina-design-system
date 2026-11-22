#!/bin/sh
# Monta latex/out/ (a pasta que vai para o Overleaf) e compila cada LINA-*.tex com XeLaTeX.
# Uso: sh templates/documento-a4/latex/latex.sh
set -e
cd "$(dirname "$0")"
ASSETS=../../../assets

rm -rf out
mkdir -p out/fontes out/logos
cp lina.cls LINA-*.tex out/
for f in Outfit-Light Outfit-Regular Outfit-Medium Outfit-Bold Outfit-ExtraBold JetBrainsMono-Regular JetBrainsMono-Bold; do
  cp "$ASSETS/fonts/$f.ttf" out/fontes/
done
cp "$ASSETS/fonts/OFL.txt" "$ASSETS/fonts/OFL-JetBrainsMono.txt" out/fontes/

# o SVG traz metadados C2PA; saem antes de converter (o "A" já vem em umbro)
perl -0pe 's/<metadata>.*?<\/metadata>//s' "$ASSETS/logos/sand/lina-horizontal-ferro.svg" \
  | rsvg-convert -f pdf -o out/logos/lina-horizontal-ferro.pdf

# compila numa pasta vazia, como no Overleaf: só o que está em out/
tmp=$(mktemp -d)
cp -R out/. "$tmp"
for t in out/LINA-*.tex; do
  n=$(basename "$t" .tex)
  (cd "$tmp" && latexmk -xelatex -interaction=nonstopmode -halt-on-error "$n.tex" >"$n.latexmk.txt" 2>&1) \
    || { tail -40 "$tmp/$n.log"; exit 1; }
  cp "$tmp/$n.pdf" "$tmp/$n.log" out/
done
rm -rf "$tmp"
