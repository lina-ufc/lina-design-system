#!/bin/sh
# Gera o site e copia 1-logotipo.html para prototipo-logotipo.html com a folha b1.css.
set -e
cd "$(dirname "$0")/.."
python3 sistema.py
sed -e 's|<link rel="stylesheet" href="site.css">|&<link rel="stylesheet" href="prototipo/b1.css">|' \
    -e 's|<title>\(.*\)</title>|<title>\1 · protótipo B1</title>|' \
    1-logotipo.html > prototipo-logotipo.html
