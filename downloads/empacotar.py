"""Gera os pacotes de download do capítulo 8. Rodar depois de publicar o template: python3 downloads/empacotar.py"""
import os, re, zipfile
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
T = os.path.join(R, 'templates/apresentacao')

def zipar(nome, arquivos):  # arquivos: [(origem, caminho no zip)]
    with zipfile.ZipFile(os.path.join(R, 'downloads', nome), 'w', zipfile.ZIP_DEFLATED) as z:
        for o, d in arquivos: z.write(o, d)
    print(nome, len(arquivos), 'arquivos')

# Deck HTML: o .dc.html, os scripts e fontes que ele carrega e só as imagens que ele usa (img/ é dividida com outros decks).
html = open(os.path.join(T, 'Apresentacao.dc.html'), encoding='utf-8').read()
usados = sorted(set(re.findall(r'''(?:img|vendor)/[^"')\s]+''', html)))
base = ['Apresentacao.dc.html', 'deck-stage.js', 'support.js', 'fonts.css', 'apresentador.js', 'transicao.js']
base += sorted(os.path.relpath(os.path.join(r, f), T) for d in ('fonts', 'img/miniaturas') for r, _, fs in os.walk(os.path.join(T, d)) for f in fs if f[0] != '.')  # fontes e miniaturas do apresentador
comuns = ['lina-geometry.js', 'lina-dither-field.js']  # ficam em assets/, o deck os carrega da própria pasta
zipar('LINA-Apresentacao-HTML.zip', [(os.path.join(T, f), 'LINA-Apresentacao-HTML/' + f) for f in base + usados]
      + [(os.path.join(R, 'assets', f), 'LINA-Apresentacao-HTML/' + f) for f in comuns])

# Fontes (Outfit e JetBrains Mono, OFL) e ícones (Phosphor nos seis pesos, MIT), um pacote cada:
# cada um é baixado na página do seu capítulo (5 Tipografia, 6 Ícones).
for nome, pasta in [('LINA-Fontes', 'assets/fonts'), ('LINA-Icones', 'assets/icons/phosphor')]:
    fi = []
    for raiz, _, fs in os.walk(os.path.join(R, pasta)):
        for f in fs:
            if f.startswith('.'): continue
            o = os.path.join(raiz, f); fi.append((o, nome + '/' + os.path.relpath(o, os.path.join(R, pasta))))
    zipar(nome + '.zip', fi)
