#!/bin/sh
# Empacota a release de marca (tag marca-vX.Y.Z). Roda na máquina local: o GitHub Actions não tem o VectorCraft.
#
# Antes, no VectorCraft (ver assets/logos/CHANGELOG.md, "Como gerar"):
#   downloads/LINA-Marca.vectorcraft   uma prancheta por forma + construção, paleta como amostras globais
#   downloads/LINA-Cores.ase           paleta (Window > Swatches > Save Swatch Library, grupos LINA)
#   downloads/institucionais/*.vectorcraft   logos institucionais abertos dos .ai originais
#
# Uso: sh downloads/marca.sh            gera os .zip em downloads/
#      sh downloads/marca.sh --publicar também cria a tag e a release no GitHub
# Precisa de: rsvg-convert (brew install librsvg), zip, gh.
set -e
cd "$(dirname "$0")/.."
V=$(grep -m1 '^## ' assets/logos/CHANGELOG.md | sed 's/^## *//; s/ .*//')
for f in downloads/LINA-Marca.vectorcraft downloads/LINA-Cores.ase; do
  [ -f "$f" ] || { echo "falta $f (gerar no VectorCraft)"; exit 1; }
done
T=$(mktemp -d)

# Logos LINA: SVG original, PNG transparente de 2000 px no lado maior, PDF vetorial.
mkdir -p "$T/logos/svg" "$T/logos/png" "$T/logos/pdf"
for s in assets/logos/sand/*.svg; do
  n=$(basename "$s" .svg)
  cp "$s" "$T/logos/svg/"
  rsvg-convert -a -w 2000 -h 2000 "$s" -o "$T/logos/png/$n.png"
  rsvg-convert -f pdf "$s" -o "$T/logos/pdf/$n.pdf"
done
cat > "$T/logos/LEIA-ME.txt" <<EOF
Logos LINA, versão $V. Regras de uso: https://lina-ufc.github.io/lina-design-system/1-logotipo.html

svg/  para web, Figma, VectorCraft, Inkscape, PowerPoint (Inserir > Imagens).
png/  fundo transparente, 2000 px no lado maior: Word, Google Docs, Canva, redes sociais.
pdf/  vetorial, para gráfica e LaTeX.

Nome: lina-<forma>-<cor>; "-sobre-" indica fundo incluído.
Para criar variações a partir da regra de construção, use LINA-Marca.vectorcraft.
Uso restrito a membros e parceiros do LINA (ver LICENSE do repositório).
EOF
rm -f downloads/LINA-Logos.zip
(cd "$T/logos" && zip -qr - .) > downloads/LINA-Logos.zip

# Institucionais: VectorCraft (editável), PNG e SVG brancos.
mkdir -p "$T/inst"
cp downloads/institucionais/*.vectorcraft assets/logos-institutions/*.png assets/logos-institutions/*.svg "$T/inst/"
rm -f downloads/Logos-Institucionais.zip
(cd "$T/inst" && zip -qr - .) > downloads/Logos-Institucionais.zip
rm -rf "$T"

ls -l downloads/LINA-Marca.vectorcraft downloads/LINA-Cores.ase downloads/LINA-Logos.zip downloads/Logos-Institucionais.zip

if [ "$1" = "--publicar" ]; then
  git tag "marca-v$V" && git push origin "marca-v$V"
  sed -n "/^## $V/,/^## /p" assets/logos/CHANGELOG.md | sed '1d;$d' > downloads/notas.md
  gh release create "marca-v$V" --title "Marca $V" --notes-file downloads/notas.md \
    downloads/LINA-Marca.vectorcraft downloads/LINA-Cores.ase downloads/LINA-Logos.zip downloads/Logos-Institucionais.zip
  rm downloads/notas.md
fi
