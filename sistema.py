"""Gera o documento do sistema LINA a partir de sistema.json.

- Cada capítulo vira uma página: <id>.html. A ordem dos capítulos dá o número; "partes" os agrupa no sumário e no mapa.
- index.html é a porta de entrada (capitulos/inicio.html + mapa). Páginas velhas (sistema.json "antigos") viram redirecionamentos.
- Links entre seções (href="<página>#s-<seção>") são conferidos; cada seção ganha "Citado em" com quem aponta para ela.
- Entrada com "secao" (fragmento HTML em capitulos/) entra no corpo da página;
  entrada com "arquivo" (+ "vista") entra num quadro (decks, documentos inteiros).

Uso: python3 sistema.py
Falha se alguma entrada apontar para arquivo inexistente.
"""
import json
import re
import sys
from html import escape
from pathlib import Path
from urllib.parse import quote

RAIZ = Path(__file__).parent
S = json.loads((RAIZ / 'sistema.json').read_text())
CAPS, ENTS, PARTES = S['capitulos'], S['entradas'], {p['id']: p['nome'] for p in S['partes']}
FERR = S['ferramentas']
FB = S['feedback']

faltam = [e.get('secao') or e['arquivo'] for e in ENTS if not (RAIZ / (e.get('secao') or e['arquivo'])).exists()]
faltam += [f['fragmento'] for f in FERR + [FB] if not (RAIZ / f['fragmento']).exists()]
if not (RAIZ / S['inicio']).exists():
    faltam.append(S['inicio'])
if faltam:
    sys.exit('arquivos inexistentes:\n  ' + '\n  '.join(faltam))


def entradas(c):
    return [e for e in ENTS if e['cap'] == c['id']]


def pagina_de(c):
    return f'{c["id"]}.html'


def rot(e):  # "1.3 Nome"
    return f'{e["num"]} {e["nome"]}'


def rotulo_parte(p):  # "I · Princípios"
    return f'{p} · {PARTES[p]}'


# Número do capítulo = posição; da seção = <cap>.<posição no capítulo>. Endereço: âncora na página do capítulo.
n = 0
for i, c in enumerate(CAPS, 1):
    c['n'] = i
    for j, e in enumerate(entradas(c), 1):
        e['num'] = f'{i}.{j}'
        e['id'] = 's-' + Path(e['secao']).stem.split('-', 1)[1] if 'secao' in e else f'e{n}'
        e['href'] = f'{pagina_de(c)}#{e["id"]}'
        n += 1


def nav(atual):
    itens, parte = '', None
    for c in CAPS:
        if c['parte'] != parte:
            parte = c['parte']
            itens += f'<li class="rotulo">{escape(rotulo_parte(parte))}</li>'
        sub = ''.join(f'<li><a href="{e["href"]}">{escape(rot(e))}</a></li>' for e in entradas(c))
        href = pagina_de(c)
        cls = ' class="atual"' if c is atual else ''
        breve = '' if sub else '<small class="breve">em breve</small>'
        atual_a = ' aria-current="page"' if c is atual else ''
        itens += f'<li{cls}><a class="cap" href="{href}"{atual_a}><span>{c["n"]}</span>{escape(c["nome"])}{breve}</a><ol>{sub}</ol></li>'
    itens += '<li class="rotulo">Ferramentas</li>' + ''.join(
        '<li class="atual">' + f'<a class="cap" href="{f["arquivo"]}" aria-current="page"><span></span>{escape(f["nome"])}</a></li>' if f is atual else
        f'<li><a class="cap" href="{f["arquivo"]}"><span></span>{escape(f["nome"])}</a></li>' for f in FERR)
    arq = None if atual is FB else 'index.html' if atual is None else atual['arquivo'] if atual in FERR else pagina_de(atual)
    if arq and S['feedback_url']:
        itens += f'<li><a class="cap" href="feedback.html?pagina={escape(arq)}"><span></span>Apontar erro nesta página</a></li>'
    return (f'<a class="pular" href="#conteudo">Pular para o conteúdo</a><aside aria-label="Sumário"><a class="logo" href="index.html"><img src="assets/logos/sand/lina-horizontal-ferro.svg" alt="LINA"></a>'
            f'<p class="tit">Sistema de design</p><details class="sum" open><summary>Sumário</summary><ol>{itens}</ol></details></aside>')


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
// Sumário aberto no HTML (funciona sem JS); no celular, o JS recolhe.
if (!matchMedia('(min-width:821px)').matches) document.querySelector('details.sum').open = false;
{script}
</script>
</body></html>
'''


# ---- quadro (arquivo inteiro em iframe) ----
def quadro(e):
    url = quote(e['arquivo'])
    cab = (f'<header><p class="k">{escape(rot(e))}</p>'
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
frags, citado, quebrados, fora_do_molde = {}, {}, [], []
MOLDE_H3 = ['Por quê', 'Medidas', 'Faça e não faça', 'Como pedir']  # ver docs/guidelines/molde-de-secao.md
for c in CAPS:
    for e in entradas(c):
        if 'secao' not in e:
            continue
        f = frags[e['id']] = (RAIZ / e['secao']).read_text()
        if c.get('molde') and not e.get('livre'):
            h3 = re.findall(r'<h3[^>]*>(.*?)</h3>', f)
            n_regra = len(re.findall(r'<p class="regra">', f))
            if n_regra != 1:
                fora_do_molde.append(f'molde: {e["secao"]}: esperado um <p class="regra">, achei {n_regra}')
            if n_regra == 1 and '<h3' in f and f.index('<h3') < f.index('<p class="regra">'):
                fora_do_molde.append(f'molde: {e["secao"]}: regra depois de h3')
            if [x for x in MOLDE_H3 if x in h3] != h3 or len(set(h3)) != len(h3):
                fora_do_molde.append(f'molde: {e["secao"]}: h3 {h3} fora de {MOLDE_H3}, nessa ordem')
        for pag, ancora in re.findall(r'href="([\w.-]*\.html)?#(s-[\w-]+)"', f):
            alvo = POR_ID.get((pag or pagina_de(c), ancora))
            if not alvo:
                quebrados.append(f'{e["secao"]}: {pag}#{ancora}')
            elif alvo is not e and e not in citado.setdefault(id(alvo), []):
                citado[id(alvo)].append(e)
        # texto de link que é só número de seção ("5.5") vira o número do alvo
        frags[e['id']] = re.sub(r'(<a href="([\w.-]*\.html)?#(s-[\w-]+)"[^>]*>)\d+\.\d+(</a>)',
                                lambda m: m[1] + POR_ID[k]['num'] + m[4] if (k := (m[2] or pagina_de(c), m[3])) in POR_ID else m[0], f)
# home: só confere os links (a home não entra em "Citado em")
for pag, ancora in re.findall(r'href="([\w.-]*\.html)?#(s-[\w-]+)"', (RAIZ / S['inicio']).read_text()):
    if (pag or 'index.html', ancora) not in POR_ID:
        quebrados.append(f'{S["inicio"]}: {pag or "index.html"}#{ancora}')
if fora_do_molde:
    sys.exit('\n'.join(fora_do_molde))
if quebrados:
    sys.exit('links quebrados:\n  ' + '\n  '.join(quebrados))


def citado_em(e):
    fontes = citado.get(id(e))
    if not fontes:
        return ''
    return '<p class="citado">Citado em ' + ' · '.join(f'<a href="{f["href"]}">{escape(rot(f))}</a>' for f in fontes) + '</p>'


# ---- mapa (na home), por parte ----
mapa = ''
for p in PARTES:
    lis = ''
    for c in (c for c in CAPS if c['parte'] == p):
        lista = ''.join(f'<li><a href="{e["href"]}">{escape(rot(e))}</a></li>' for e in entradas(c))
        breve = '' if lista else '<small class="breve">em breve</small>'
        lis += (f'<li><a class="cap" href="{pagina_de(c)}"><span class="num">{c["n"]}</span>{escape(c["nome"])}{breve}</a>'
                f'<p>{escape(c["desc"])}</p><ol>{lista}</ol></li>')
    mapa += f'<p class="rotulo">{escape(rotulo_parte(p))}</p><ol>{lis}</ol>'
mapa = f'<section class="mapa"><h2>O documento</h2>{mapa}</section>\n'

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
            frag = re.sub(r'<script src="([^"]+)"></script>', uma_vez, frags[e['id']])
            frag = re.sub(r'<!--quadro (\S+) (\d+x\d+)-->', lambda m: moldura(m[1], m[2], e['nome']), frag)
            corpo += f'<section id="{e["id"]}"><p class="num">{e["num"]}</p>{frag}{citado_em(e)}</section>\n'
        else:
            corpo += f'<section class="quadro">{quadro(e)}</section>\n'
    corpo = corpo or '<p class="vazio">Em breve.</p>'
    i = CAPS.index(c)
    ant = CAPS[i - 1] if i else None
    prox = CAPS[i + 1] if i + 1 < len(CAPS) else None
    link = lambda k, seta: (f'<a href="{pagina_de(k)}">{seta} {k["n"]} · {escape(k["nome"])}</a>'
                            if k else '<span></span>')
    titulo = f'{c["nome"]} · Sistema LINA'
    main = (f'<main id="conteudo" class="capitulo"><header><p class="num">{c["n"]}</p><h1>{escape(c["nome"])}</h1>'
            f'<p class="desc">{escape(c["desc"])}</p></header>\n{corpo}'
            f'<nav class="vizinhos">{link(ant, "←")}{link(prox, "→")}</nav></main>')
    (RAIZ / pagina_de(c)).write_text(html(titulo, c, main, AJUSTA))

# ---- páginas das ferramentas: o fragmento (sem título) entra na moldura do site ----
for f in FERR:
    main = (f'<main id="conteudo" class="capitulo"><header><h1>{escape(f["nome"])}</h1><p class="desc">{escape(f["sub"])}</p></header>\n'
            f'<section class="pagina-ferramenta">{(RAIZ / f["fragmento"]).read_text()}</section></main>')
    (RAIZ / f['arquivo']).write_text(html(f'{f["nome"]} · Sistema LINA', f, main))

# ---- feedback: mesma moldura; a URL do Apps Script vai no data-url (vazia = formulário indisponível) ----
main = (f'<main id="conteudo" class="capitulo"><header><h1>{escape(FB["nome"])}</h1><p class="desc">{escape(FB["sub"])}</p></header>\n'
        f'<section class="pagina-ferramenta" data-url="{escape(S["feedback_url"])}">{(RAIZ / FB["fragmento"]).read_text()}</section></main>')
(RAIZ / FB['arquivo']).write_text(html(f'{FB["nome"]} · Sistema LINA', FB, main))

# ---- home: porta de entrada + mapa; âncora velha (index.html#s-…) sem alvo na home vai para os Princípios ----
HOME = '''
if (location.hash && !document.getElementById(location.hash.slice(1))) location.replace('principios.html' + location.hash);
'''
ferr_home = '<h3>Ferramentas</h3><ul class="regras">' + ''.join(f'<li><a href="{f["arquivo"]}">{escape(f["nome"])}</a>: {escape(f["sub"])}</li>' for f in FERR) + '</ul>'
if S['feedback_url']:
    ferr_home += '<h3>Feedback</h3><p>Viu um erro ou sentiu falta de algo? <a href="feedback.html">Conte para a equipe</a>.</p>'
main = f'<main id="conteudo" class="capitulo"><section>{(RAIZ / S["inicio"]).read_text()}{ferr_home}</section>\n{mapa}</main>'
(RAIZ / 'index.html').write_text(html('Sistema LINA', None, main, HOME))

# ---- redirecionamentos das páginas velhas ----
for velha, nova in S['antigos'].items():
    (RAIZ / velha).write_text(f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><title>Página movida · Sistema LINA</title>
<meta http-equiv="refresh" content="0;url={nova}"><link rel="canonical" href="{nova}">
<script>location.replace('{nova}' + location.hash);</script>
</head><body><p>Esta página mudou: <a href="{nova}">{nova}</a>.</p></body></html>
''')
print(f'{len(S["antigos"])} redirecionamentos')

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
    llms += ['', f'## {c["n"]} · {c["nome"]}', c['desc'] + ('' if entradas(c) else ' (em breve)'), '']
    for e in entradas(c):
        llms.append(f'- [{rot(e)}]({BASE}{quote(e["href"], safe="#/")})' + (f': {e["sub"]}' if e.get('sub') else ''))
        n_llms += 1
llms += ['', '## Ferramentas', ''] + [f'- [{f["nome"]}]({BASE}{f["arquivo"]}): {f["sub"]}' for f in FERR]
llms += ['', '## Para agentes', ''] + [f'- [{a}]({BASE}{a}): {d}' for a, d in AGENTES]
(RAIZ / 'llms.txt').write_text('\n'.join(llms) + '\n')
print(f'llms.txt: {n_llms + len(FERR) + len(AGENTES)} links')
