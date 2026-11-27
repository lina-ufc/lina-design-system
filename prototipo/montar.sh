#!/bin/sh
# Gera o site e copia 1-logotipo.html para prototipo-logotipo.html com a folha b1.css.
set -e
cd "$(dirname "$0")/.."
python3 sistema.py
# ponytail: o último -e tira o <a> aninhado em 8-combinacoes-de-cores.html (parte o 2º item de Baixar); o 05 conserta o fragmento.
sed -e 's|<link rel="stylesheet" href="site.css">|&<link rel="stylesheet" href="prototipo/b1.css">|' \
    -e 's|<title>\(.*\)</title>|<title>\1 · protótipo B1</title>|' \
    -e 's|<a href="5-tipografia.html#s-composicoes">5.5</a>|5.5|' \
    1-logotipo.html > prototipo-logotipo.html
