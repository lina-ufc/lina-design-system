#!/bin/sh
# Empacota a release das logos institucionais (tag institucionais-vX.Y.Z), separada da marca LINA.
# Fonte: assets/logos-institutions/<instituição>/. Cada SVG vira SVG + PNG (2000 px) + PDF;
# PNG na fonte (instituição sem vetor) entra só como PNG.
#
# Uso: sh downloads/institucionais.sh            gera o .zip em downloads/
#      sh downloads/institucionais.sh --publicar também cria a tag e a release no GitHub
# Precisa de: rsvg-convert (brew install librsvg), zip, gh.
set -e
cd "$(dirname "$0")/.."
C=assets/logos-institutions/CHANGELOG.md
V=$(grep -m1 '^## ' $C | sed 's/^## *//; s/ .*//')
T=$(mktemp -d)
SO=""

for d in assets/logos-institutions/*/; do
  i=$(basename "$d")
  mkdir -p "$T/$i/png"
  for s in "$d"*.svg; do
    [ -f "$s" ] || continue
    n=$(basename "$s" .svg)
    mkdir -p "$T/$i/svg" "$T/$i/pdf"
    cp "$s" "$T/$i/svg/"
    rsvg-convert -a -w 2000 -h 2000 "$s" -o "$T/$i/png/$n.png"
    rsvg-convert -f pdf "$s" -o "$T/$i/pdf/$n.pdf"
  done
  for p in "$d"*.png; do [ -f "$p" ] && cp "$p" "$T/$i/png/"; done
  ls "$d"*.svg >/dev/null 2>&1 || SO="$SO $i"
done

cat > "$T/LEIA-ME.txt" <<EOF
Logos institucionais usadas pelo LINA, versão $V.
Fonte: arquivos oficiais de cada instituição. Respeite o manual de marca de cada uma.

<instituição>/svg/  vetor, para web, Figma, VectorCraft, Inkscape, PowerPoint.
<instituição>/png/  2000 px no lado maior: Word, Google Docs, Canva.
<instituição>/pdf/  vetorial, para gráfica e LaTeX.

Nome: <instituição>-<forma>-<cor>; "-sobre-" indica fundo incluído.
Só raster (sem vetor disponível):${SO:- nenhuma}.
Algumas versões brancas da UFC existem só em PNG.
EOF
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
