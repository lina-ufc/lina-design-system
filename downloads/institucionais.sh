#!/bin/sh
# Empacota a release das logos institucionais (tag institucionais-vX.Y.Z), separada da marca LINA.
# Roda na máquina local: os .vectorcraft ficam fora do git e o GitHub Actions não tem o VectorCraft.
#
# Antes, no VectorCraft (ver assets/logos-institutions/CHANGELOG.md, "Como gerar"):
#   downloads/institucionais/*.vectorcraft   logos institucionais abertos dos .ai originais
#
# Uso: sh downloads/institucionais.sh            gera o .zip em downloads/
#      sh downloads/institucionais.sh --publicar também cria a tag e a release no GitHub
# Precisa de: zip, gh.
set -e
cd "$(dirname "$0")/.."
C=assets/logos-institutions/CHANGELOG.md
V=$(grep -m1 '^## ' $C | sed 's/^## *//; s/ .*//')
ls downloads/institucionais/*.vectorcraft >/dev/null 2>&1 || { echo "falta downloads/institucionais/*.vectorcraft (gerar no VectorCraft)"; exit 1; }
T=$(mktemp -d)

# VectorCraft (editável), PNG e SVG brancos.
cp downloads/institucionais/*.vectorcraft assets/logos-institutions/*.png assets/logos-institutions/*.svg "$T/"
rm -f downloads/Logos-Institucionais.zip
(cd "$T" && zip -qr - .) > downloads/Logos-Institucionais.zip
rm -rf "$T"

ls -l downloads/Logos-Institucionais.zip

if [ "$1" = "--publicar" ]; then
  git tag "institucionais-v$V" && git push origin "institucionais-v$V"
  sed -n "/^## $V/,/^## /p" $C | sed '1d;$d' > downloads/notas.md
  gh release create "institucionais-v$V" --title "Logos institucionais $V" --notes-file downloads/notas.md \
    downloads/Logos-Institucionais.zip
  rm downloads/notas.md
fi
