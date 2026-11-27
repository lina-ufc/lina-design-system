"""Gera o documento do sistema LINA a partir de sistema.json.

- Cada capítulo vira uma página: <n>-<nome>.html. O capítulo 0 (Preâmbulo) é index.html, com o mapa do documento.
- Links entre seções (href="<página>#s-<seção>") são conferidos; cada seção ganha "Citado em" com quem aponta para ela.
- Entrada com "secao" (fragmento HTML em capitulos/) entra no corpo da página;
  entrada com "arquivo" (+ "vista") entra num quadro (decks, documentos inteiros).

Uso: python3 sistema.py
Falha se alguma entrada apontar para arquivo inexistente.
"""
import json
import re
import sys
import unicodedata
from html import escape
from pathlib import Path
from urllib.parse import quote

RAIZ = Path(__file__).parent
S = json.loads((RAIZ / 'sistema.json').read_text())
CAPS, ENTS = S['capitulos'], S['entradas']

faltam = [e.get('secao') or e['arquivo'] for e in ENTS if not (RAIZ / (e.get('secao') or e['arquivo'])).exists()]
if faltam:
    sys.exit('arquivos inexistentes:\n  ' + '\n  '.join(faltam))


def slug(t):
    t = unicodedata.normalize('NFKD', t).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', t).strip('-')


def entradas(c):
    return [e for e in ENTS if e['cap'] == c['id']]


def pagina_de(c):  # o capítulo 0 (Preâmbulo) é a home
    return 'index.html' if c['id'] == '0' else f'{c["id"]}-{slug(c["nome"])}.html'


# Endereço de cada entrada: âncora na página do capítulo ou quadro no índice.
n = 0
for c in CAPS:
    for e in entradas(c):
        if 'secao' in e:
            e['id'] = 's-' + Path(e['secao']).stem.split('-', 1)[1]
            e['href'] = f'{pagina_de(c)}#{e["id"]}'
        else:
            e['id'] = f'e{n}'
            e['href'] = f'{pagina_de(c)}#{e["id"]}'
        n += 1


def num_nome(e):
    m = re.match(r'([\d.]+)\s+(.*)', e['nome'])
    return m.groups() if m else ('', e['nome'])


def nav(atual):
    itens = ''
    for c in CAPS:
        sub = ''.join(f'<li><a href="{e["href"]}">{escape(e["nome"])}</a></li>' for e in entradas(c))
        href = pagina_de(c)
        cls = ' class="atual"' if c is atual else ''
        breve = '' if sub else '<small class="breve">em breve</small>'
        itens += f'<li{cls}><a class="cap" href="{href}"><span>{c["id"]}</span>{escape(c["nome"])}{breve}</a><ol>{sub}</ol></li>'
    return (f'<aside><a class="logo" href="index.html"><img src="assets/logos/sand/lina-horizontal-ferro.svg" alt="LINA"></a>'
            f'<p class="tit">Sistema de design</p><details class="sum"><summary>Sumário</summary><ol>{itens}</ol></details></aside>')


def html(titulo, atual, main, script=''):
    return f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{escape(titulo)}</title>
<!-- Gerado por sistema.py a partir de sistema.json. Não edite à mão. -->
<link rel="stylesheet" href="styles.css"><link rel="stylesheet" href="site.css">
</head><body>
{nav(atual)}
{main}
<script>
// Sumário aberto em tela larga; no celular, recolhido.
if (matchMedia('(min-width:821px)').matches) document.querySelector('details.sum').open = true;
{script}
</script>
</body></html>
'''


# ---- quadro (arquivo inteiro em iframe) ----
def quadro(e):
    url = quote(e['arquivo'])
    cab = (f'<header><p class="k">{escape(e["nome"])}</p>'
           f'<p class="sub">{escape(e["sub"])}</p>'
           f'<p class="arq"><a href="{url}" target="_blank">{escape(e["arquivo"])} ↗</a></p></header>')
    if not e.get('vista'):
        return f'<article id="{e["id"]}">{cab}</article>'
    return f'<article id="{e["id"]}">{cab}{moldura(e["arquivo"], e["vista"], e["nome"])}</article>'


# Também dentro de uma seção: <!--quadro caminho LxA--> vira a moldura (exemplo de template no meio do texto).
def moldura(arquivo, vista, titulo):
    w, h = vista.split('x')
    # _snthumb: o deck-stage abre sem a coluna de miniaturas (no-rail); outros arquivos ignoram.
    v = int((RAIZ / arquivo).stat().st_mtime)
    return (f'<div class="fr" data-w="{w}" data-h="{h}">'
            f'<iframe src="{quote(arquivo)}?v={v}&_snthumb=1" loading="lazy" width="{w}" height="{h}" title="{escape(titulo)}"></iframe></div>')


AJUSTA = '''
// Cada quadro mostra o arquivo no tamanho nativo (data-w × data-h), reduzido à largura da coluna.
const ajusta = () => document.querySelectorAll('.fr').forEach((f) => {
  const k = Math.min(1, f.parentNode.clientWidth / f.dataset.w);
  f.style.height = f.dataset.h * k + 'px';
  f.style.width = f.dataset.w * k + 'px';
  f.firstChild.style.transform = `scale(${k})`;
});
new ResizeObserver(ajusta).observe(document.querySelector('main'));
// Conteúdo maior que a vista declarada: o quadro cresce até caber (só com servidor; em file:// fica a vista declarada).
const mede = (i) => {
  try {
    const d = i.contentDocument.documentElement, f = i.parentNode;
    f.dataset.w = i.width = Math.max(+f.dataset.w, d.scrollWidth);
    f.dataset.h = i.height = Math.max(+f.dataset.h, d.scrollHeight);
    ajusta();
  } catch (e) {}
};
const observa = (i) => {
  try { new i.contentWindow.ResizeObserver(() => mede(i)).observe(i.contentDocument.body); } catch (e) {}
};
document.querySelectorAll('.fr iframe').forEach((i) => { i.addEventListener('load', () => observa(i)); observa(i); });
'''
# ---- fragmentos, links e "citado em" ----
POR_ID = {(pagina_de(c), e['id']): e for c in CAPS for e in entradas(c)}
frags, citado, quebrados = {}, {}, []
for c in CAPS:
    for e in entradas(c):
        if 'secao' not in e:
            continue
        f = frags[e['id']] = (RAIZ / e['secao']).read_text()
        for pag, ancora in re.findall(r'href="([\w.-]*\.html)?#(s-[\w-]+)"', f):
            alvo = POR_ID.get((pag or pagina_de(c), ancora))
            if not alvo:
                quebrados.append(f'{e["secao"]}: {pag}#{ancora}')
            elif alvo is not e and e not in citado.setdefault(id(alvo), []):
                citado[id(alvo)].append(e)
if quebrados:
    sys.exit('links quebrados:\n  ' + '\n  '.join(quebrados))


def citado_em(e):
    fontes = citado.get(id(e))
    if not fontes:
        return ''
    return '<p class="citado">Citado em ' + ' · '.join(f'<a href="{f["href"]}">{escape(f["nome"])}</a>' for f in fontes) + '</p>'


# ---- mapa (na home) ----
mapa = ''
for c in CAPS[1:]:
    lista = ''.join(f'<li><a href="{e["href"]}">{escape(e["nome"])}</a></li>' for e in entradas(c))
    mapa += (f'<li><a class="cap" href="{pagina_de(c)}"><span class="num">{c["id"]}</span>{escape(c["nome"])}</a>'
             f'<p>{escape(c["desc"])}</p><ol>{lista}</ol></li>')
mapa = f'<section class="mapa"><h2>O documento</h2><ol>{mapa}</ol></section>\n'

# ---- páginas de capítulo ----
for c in CAPS:
    corpo, vistos = '', set()

    def uma_vez(m):  # o mesmo <script src> em várias seções: carrega só na primeira
        if m.group(1) in vistos:
            return ''
        vistos.add(m.group(1))
        return m.group(0)

    for e in entradas(c):
        if 'secao' in e:
            num, _ = num_nome(e)
            frag = re.sub(r'<script src="([^"]+)"></script>', uma_vez, frags[e['id']])
            frag = re.sub(r'<!--quadro (\S+) (\d+x\d+)-->', lambda m: moldura(m[1], m[2], e['nome']), frag)
            corpo += f'<section id="{e["id"]}"><p class="num">{num}</p>{frag}{citado_em(e)}</section>\n'
        else:
            corpo += f'<section class="quadro">{quadro(e)}</section>\n'
    corpo = corpo or '<p class="vazio">Em breve.</p>'
    if c['id'] == '0':
        corpo += mapa
    i = CAPS.index(c)
    ant = CAPS[i - 1] if i else None
    prox = CAPS[i + 1] if i + 1 < len(CAPS) else None
    link = lambda k, seta: (f'<a href="{pagina_de(k)}">{seta} {k["id"]} · {escape(k["nome"])}</a>'
                            if k else '<span></span>')
    titulo = 'Sistema LINA' if c['id'] == '0' else f'{c["nome"]} · Sistema LINA'
    main = (f'<main class="capitulo"><header><p class="num">{c["id"]}</p><h1>{escape(c["nome"])}</h1>'
            f'<p class="desc">{escape(c["desc"])}</p></header>\n{corpo}'
            f'<nav class="vizinhos">{link(ant, "←")}{link(prox, "→")}</nav></main>')
    (RAIZ / pagina_de(c)).write_text(html(titulo, c, main, AJUSTA))

n_links = sum(map(len, citado.values()))
print(f'{len(CAPS)} capítulos ({", ".join(pagina_de(c) for c in CAPS)}); {len(ENTS)} entradas; {n_links} links entre seções')

# ---- llms.txt ----
BASE = 'https://lina-ufc.github.io/lina-design-system/'
AGENTES = [
    ('SKILL.md', 'Índice por assunto: onde está cada regra do sistema.'),
    ('tokens/lina.tokens.json', 'Cores e tokens em JSON, gerado de assets/lina-palette.js.'),
    ('assets/lina-palette.js', 'Fonte única da paleta.'),
    ('sistema.json', 'Índice do site: capítulos e entradas.'),
    ('README.md', 'Visão geral do repositório e da marca.'),
]
llms = ['# Sistema de design LINA', '',
        '> Sistema de design do LINA (UFC): logotipo, cores, padrões, tipografia, ícones, componentes e templates, '
        'documentado neste site e pronto para consulta por agentes.']
n_llms = 0
for c in CAPS:
    llms += ['', f'## {c["id"]} · {c["nome"]}', c['desc'], '']
    for e in entradas(c):
        llms.append(f'- [{e["nome"]}]({BASE}{quote(e["href"], safe="#/")})' + (f': {e["sub"]}' if e.get('sub') else ''))
        n_llms += 1
llms += ['', '## Para agentes', ''] + [f'- [{a}]({BASE}{a}): {d}' for a, d in AGENTES]
(RAIZ / 'llms.txt').write_text('\n'.join(llms) + '\n')
print(f'llms.txt: {n_llms + len(AGENTES)} links')
