"""Confere os modelos LaTeX em templates/documento-a4/latex/ e latex/out/: PDF de 3 páginas A4, só Outfit e JetBrainsMono
embutidas, log limpo, só pacotes da lista, exemplos sem comandos soltos, imagens sem distorção.
Uso: python3 templates/documento-a4/check_latex.py   (depois de sh templates/documento-a4/latex/latex.sh)"""
import glob, os, re, subprocess, sys

D = os.path.dirname(os.path.abspath(__file__))
L = os.path.join(D, 'latex')
OUT = os.path.join(L, 'out')
PACOTES = {'fontspec', 'polyglossia', 'geometry', 'xcolor', 'graphicx', 'fancyhdr', 'titlesec', 'multicol', 'tabularx',
           'array', 'booktabs', 'enumitem', 'caption', 'ragged2e', 'setspace', 'microtype', 'etoolbox', 'xparse',
           'tikz', 'eso-pic', 'hyperref', 'url'}
PROIBIDOS = r'\\(vspace|hspace|fontsize|color|newpage|setlength)\b'  # o que a classe faz, o exemplo não repete
# Texto que deve estar em cada página (mesmas quebras do HTML). Estender nas Tasks 2 e 3.
QUEBRAS = {'Relatorio': [['Relatório institucional', 'Relatório anual de atividades 2026'],
                         ['1 · Apresentação', 'Indicadores do ano'],
                         ['5 · Considerações finais', 'Equipe', 'contato@lina.ufc.br']],
          'Artigo': [['Cadernos LINA · v. 2 · n. 1 · 2026 · p. 1–18', 'Resumo', 'Palavras-chave', '1 · Introdução', 'DOI 10.0000/cl.2026.0001'],
                     ['Sobrenome et al. · Título abreviado do artigo', '2 · Método', '[ figura ]', '3 · Resultados', 'Tabela 1.', 'Aldeota'],
                     ['5 · Conclusão', 'Agradecimentos', 'Referências', 'BERTALANFFY', 'Correspondência', 'Licença']]}
erros = []


def run(*cmd):
    return subprocess.run(cmd, capture_output=True, text=True).stdout


def sem_comentarios(t):
    return re.sub(r'(?<!\\)%.*', '', t)


def le(p):
    return sem_comentarios(open(p, encoding='utf-8').read())


tex = sorted(glob.glob(os.path.join(L, 'LINA-*.tex')))
cls = os.path.join(L, 'lina.cls')
if not tex:
    erros.append('nenhum latex/LINA-*.tex')
if not os.path.exists(cls):
    erros.append('falta latex/lina.cls')

for p in tex + ([cls] if os.path.exists(cls) else []):
    nome, t = os.path.basename(p), le(p)
    for m in re.finditer(r'\\(?:RequirePackage|usepackage)(?:\[[^\]]*\])?\{([^}]*)\}', t):
        for pac in m.group(1).split(','):
            if pac.strip() not in PACOTES:
                erros.append(f'{nome}: pacote fora da lista: {pac.strip()}')
    for m in re.finditer(r'\\includegraphics\[([^\]]*)\]', t):
        if 'width' in m.group(1) and 'height' in m.group(1):
            erros.append(f'{nome}: \\includegraphics com width e height juntos (distorce)')
    if p != cls:
        for m in re.finditer(PROIBIDOS, t):
            erros.append(f'{nome}: comando proibido no exemplo: {m.group(0)}')

for f in ('lina.cls', 'fontes/OFL.txt', 'fontes/OFL-JetBrainsMono.txt', 'logos/lina-horizontal-ferro.pdf'):
    if not os.path.exists(os.path.join(OUT, f)):
        erros.append(f'falta latex/out/{f}')

for p in tex:
    nome = os.path.basename(p)[:-4]
    modelo = nome.split('-', 1)[1]
    pdf, log = (os.path.join(OUT, nome + e) for e in ('.pdf', '.log'))
    if not os.path.exists(pdf):
        erros.append(f'{nome}: falta out/{nome}.pdf')
        continue
    info = run('pdfinfo', pdf)
    if not re.search(r'^Pages:\s+3$', info, re.M):
        erros.append(f'{nome}: não tem 3 páginas')
    m = re.search(r'Page size:\s+([\d.]+) x ([\d.]+) pts', info)
    if not m or abs(float(m.group(1)) - 595.28) > 1 or abs(float(m.group(2)) - 841.89) > 1:
        erros.append(f'{nome}: página não é A4 ({m.group(0) if m else "?"})')
    for linha in run('pdffonts', pdf).splitlines()[2:]:
        c = linha.split()
        if not c:
            continue
        if not re.match(r'(?:[A-Z]{6}\+)?(Outfit|JetBrainsMono)', c[0]):
            erros.append(f'{nome}: fonte fora das duas famílias: {c[0]}')
        e = re.search(r'(yes|no)\s+(?:yes|no)\s+(?:yes|no)\s+\d+\s+\d+$', linha)  # emb sub uni objeto
        if not e or e.group(1) != 'yes':
            erros.append(f'{nome}: fonte não embutida: {c[0]}')
    for i, esperado in enumerate(QUEBRAS.get(modelo, []), 1):
        pagina = run('pdftotext', '-f', str(i), '-l', str(i), '-layout', pdf, '-')
        pagina = ' '.join(pagina.lower().split())  # sem caixa alta nem quebras de linha
        for s in esperado:
            if s.lower() not in pagina:
                erros.append(f'{nome}: página {i} sem "{s}"')
    if os.path.exists(log):
        t = open(log, encoding='utf-8', errors='replace').read()
        for s in ('Missing character', 'undefined', 'not found'):
            if s in t:
                erros.append(f'{nome}.log: contém "{s}"')
        for m in re.finditer(r'Overfull \\hbox \(([\d.]+)pt', t):
            if float(m.group(1)) > 1:
                erros.append(f'{nome}.log: Overfull \\hbox de {m.group(1)} pt')
    else:
        erros.append(f'{nome}: falta out/{nome}.log')

if erros:
    print('\n'.join(erros))
    sys.exit(1)
print(f'ok: {len(tex)} modelos')
