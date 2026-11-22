#!/bin/sh
# Gera os modelos do Documento A4 e os arquivos da release.
# Saída: downloads/LINA-Documentos-Word.zip e LINA-Documentos-LaTeX.zip; templates/documento-a4/LINA-{Relatorio,Artigo,POP}-exemplo.pdf.
# Tudo gerado fica fora do git. Falha se qualquer checagem falhar.
# Precisa de: node, python3 (3.13, com lxml e defusedxml), latexmk + xelatex, rsvg-convert, perl, pdfinfo.
set -e
cd "$(dirname "$0")"
DL=../../downloads

# Word
[ -d word/node_modules ] || (cd word && npm ci --no-audit --no-fund)
(cd word && node build.js)
python3 check_word.py
for f in word/out/*.dotx word/out/*.docx; do
  out=$(python3 ../apresentacao/potx/vendor/office/validate.py "$f")  # sem pipe: set -e vê o exit do validate.py
  echo "$out" | tail -1
done

# LaTeX
sh latex/latex.sh
python3 check_latex.py
for m in Relatorio Artigo POP; do
  cp "latex/out/LINA-$m.pdf" "LINA-$m-exemplo.pdf"
done

# Pacotes: pasta de topo com o nome do zip, montada em mktemp
tmp=$(mktemp -d)
mkdir -p "$tmp/LINA-Documentos-Word" "$tmp/LINA-Documentos-LaTeX"
cp word/out/*.dotx word/out/*.docx "$tmp/LINA-Documentos-Word/"
(cd latex/out && cp -R lina.cls LINA-*.tex fontes logos "$tmp/LINA-Documentos-LaTeX/")
cat > "$tmp/LINA-Documentos-LaTeX/LEIA-ME.txt" <<'TXT'
Modelos LaTeX do LINA: Relatório, Artigo e POP (A4).
1. Suba este zip no Overleaf: New project > Existing project (.zip).
2. Compilador: XeLaTeX (Settings, engrenagem no canto inferior esquerdo > Compiler). Não use pdfLaTeX.
3. Abra LINA-Relatorio.tex, LINA-Artigo.tex ou LINA-POP.tex, marque como Set as main document (menu ⋯ do arquivo) e confira a opção da classe: \documentclass[relatorio|artigo|pop]{lina}.
4. As fontes Outfit e JetBrains Mono já vão na pasta fontes/, sob a licença OFL (OFL.txt e OFL-JetBrainsMono.txt).
5. Sistema de design e outros modelos: site do LINA, https://lina-ufc.github.io/lina-design-system/
TXT
for z in Word LaTeX; do
  rm -f "$DL/LINA-Documentos-$z.zip"
  (cd "$tmp" && python3 -m zipfile -c "$OLDPWD/$DL/LINA-Documentos-$z.zip" "LINA-Documentos-$z")
done
rm -rf "$tmp"

python3 check_pacotes.py
