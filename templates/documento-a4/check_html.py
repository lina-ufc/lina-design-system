"""Confere os três decks do Documento A4 (Relatório, Artigo, POP): 3 páginas A4 cada em deck-stage, sem o cartão de instruções.
Uso: python3 templates/documento-a4/check_html.py"""
import os, re, sys

D = os.path.dirname(os.path.abspath(__file__))
erros, total = [], 0
for arq, doc in (('Relatorio', 'Relatório'), ('Artigo', 'Artigo'), ('POP', 'POP')):
    h = open(os.path.join(D, f'DocumentoA4-{arq}.dc.html'), encoding='utf-8').read()
    err = lambda m: erros.append(f'{arq}: {m}')
    if '<html lang="pt-BR">' not in h:
        err('falta <html lang="pt-BR">')
    deck = re.search(r'<x-import component-from-global-scope="deck-stage" from="[^"]*deck-stage\.js" width="794" height="1123"[^>]*>(.*)</x-import>', h, re.S)
    if not deck:
        err('falta x-import do deck-stage 794 × 1123')
    else:
        rotulos = re.findall(r'<section data-page="" data-label="([^"]+)"', deck.group(1))
        if rotulos != [f'{doc} · {p}' for p in ('entrada', 'meio', 'finalização')]:
            err(f'páginas fora de ordem ou faltando: {rotulos}')
        if re.sub(r'<section data-page.*?</section>', '', deck.group(1), flags=re.S).strip():
            err('há conteúdo no deck fora das seções')
    if 'Como usar este template' in h:
        err('cartão "Como usar" ainda presente')
    # Texto corrido: uma regra só (.tc), justificada e hifenizada; títulos, legendas e tabelas fora dela.
    if len(re.findall(r'\.tc\{text-align:justify;hyphens:auto;-webkit-hyphens:auto\}', h)) != 1:
        err('falta a regra única .tc (justify + hyphens:auto)')
    tc = re.findall(r'<(\w+)[^>]*class="tc"[^>]*>(.{0,40})', h)
    if len(tc) < 3:
        err(f'só {len(tc)} blocos de texto corrido marcados com .tc')
    for tag, txt in tc:
        if tag in ('h1', 'h2', 'td', 'th') or re.match(r'(<[^>]+>)*(Figura|Tabela|Fonte:)', txt):
            err(f'.tc em título, legenda ou tabela: <{tag}> {txt}')
    total += len(tc)
print('\n'.join(erros) or f'ok: 3 decks de 3 páginas, {total} blocos justificados')
sys.exit(1 if erros else 0)
