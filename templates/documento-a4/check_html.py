"""Confere o deck do Documento A4: 9 páginas A4 em deck-stage, sem o cartão de instruções.
Uso: python3 templates/documento-a4/check_html.py"""
import os, re, sys

h = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'DocumentoA4.dc.html'), encoding='utf-8').read()
ROTULOS = [f'{d} · {p}' for d in ('Relatório', 'Artigo', 'POP') for p in ('entrada', 'meio', 'finalização')]
erros = []
if '<html lang="pt-BR">' not in h:
    erros.append('falta <html lang="pt-BR">')
deck = re.search(r'<x-import component-from-global-scope="deck-stage" from="[^"]*deck-stage\.js" width="794" height="1123"[^>]*>(.*)</x-import>', h, re.S)
if not deck:
    erros.append('falta x-import do deck-stage 794 × 1123')
else:
    rotulos = re.findall(r'<section data-page="" data-label="([^"]+)"', deck.group(1))
    if rotulos != ROTULOS:
        erros.append(f'páginas fora de ordem ou faltando: {rotulos}')
    if re.sub(r'<section data-page.*?</section>', '', deck.group(1), flags=re.S).strip():
        erros.append('há conteúdo no deck fora das seções')
if 'Como usar este template' in h:
    erros.append('cartão "Como usar" ainda presente')
# Texto corrido: uma regra só (.tc), justificada e hifenizada; títulos, legendas e tabelas fora dela.
if len(re.findall(r'\.tc\{text-align:justify;hyphens:auto;-webkit-hyphens:auto\}', h)) != 1:
    erros.append('falta a regra única .tc (justify + hyphens:auto)')
tc = re.findall(r'<(\w+)[^>]*class="tc"[^>]*>(.{0,40})', h)
if len(tc) < 20:
    erros.append(f'só {len(tc)} blocos de texto corrido marcados com .tc')
for tag, txt in tc:
    if tag in ('h1', 'h2', 'td', 'th') or re.match(r'(<[^>]+>)*(Figura|Tabela|Fonte:)', txt):
        erros.append(f'.tc em título, legenda ou tabela: <{tag}> {txt}')
print('\n'.join(erros) or f'ok: 9 páginas no deck, {len(tc)} blocos justificados')
sys.exit(1 if erros else 0)
