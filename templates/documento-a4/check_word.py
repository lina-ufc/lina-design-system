"""Confere os modelos Word (.docx e .dotx) em templates/documento-a4/word/out/: estilos, idioma, hifenização, A4,
corpo sem formatação direta, content type, imagens sem distorção.
Uso: python3 templates/documento-a4/check_word.py"""
import glob, os, re, struct, sys, zipfile
import xml.etree.ElementTree as ET

D = os.path.dirname(os.path.abspath(__file__))
W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
R = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'
BASE = ['LINA Corpo', 'LINA Título', 'LINA Seção', 'LINA Cabeçalho', 'LINA Rodapé']
# Extras por modelo: nome do arquivo contém a chave. Estender aqui nas Tasks 2 e 3.
EXTRA = {'Artigo': ['LINA Resumo', 'LINA Legenda', 'LINA Fonte', 'LINA Referência'],
         'POP': ['LINA Passos', 'LINA Atenção']}
TABELA = {'POP': ['LINA Passos', 'LINA Atenção']}  # estilos de tabela que o document.xml deve referenciar
NUMPAGES = ('POP',)  # campo NUMPAGES em algum footer*.xml
PERMITIDO = {'tblPr': {'tblStyle', 'tblW', 'tblpPr', 'tblLook', 'tblLayout', 'tblOverlap', 'tblInd'},
             'tcPr': {'tcW', 'gridSpan', 'vAlign', 'vMerge'},
             'trPr': {'trHeight', 'cantSplit', 'tblHeader'}}
TOL = 0.01  # mesma tolerância do aspect.py


def local(e):
    return e.tag.rsplit('}', 1)[-1]


def png_size(dados):
    if dados[:8] != b'\x89PNG\r\n\x1a\n':
        return None
    return struct.unpack('>II', dados[16:24])


def confere(caminho, erros, avisos):
    nome = os.path.basename(caminho)
    err = lambda m: erros.append(f'{nome}: {m}')
    dist = 0
    try:
        z = zipfile.ZipFile(caminho)
    except zipfile.BadZipFile:
        err('não é um zip válido')
        return 0
    lido = lambda p: z.read(p).decode('utf-8') if p in z.namelist() else None
    doc, sty, st, ct = (lido(p) for p in ('word/document.xml', 'word/styles.xml', 'word/settings.xml', '[Content_Types].xml'))
    if None in (doc, sty, st, ct):
        err('faltam document.xml, styles.xml, settings.xml ou [Content_Types].xml')
        return 0

    # Estilos pelo nome visível: nome -> (styleId, bloco)
    estilos = {}
    for m in re.finditer(r'<w:style\b([^>]*)>(.*?)</w:style>', sty, re.S):
        n = re.search(r'<w:name w:val="([^"]+)"', m.group(2))
        i = re.search(r'w:styleId="([^"]+)"', m.group(1))
        if n:
            estilos[n.group(1)] = (i.group(1) if i else None, m.group(2))
    extra = [e for k, v in EXTRA.items() if k in nome for e in v]
    for e in BASE + extra:
        if e not in estilos:
            err(f'falta o estilo "{e}"')
    if 'Artigo' in nome and 'LINA Referência' in estilos and 'w:hanging=' not in estilos['LINA Referência'][1]:
        err('LINA Referência sem recuo pendente')
    if 'LINA Corpo' in estilos:
        b = estilos['LINA Corpo'][1]
        if '<w:jc w:val="both"/>' not in b:
            err('LINA Corpo sem <w:jc w:val="both"/>')
        if '<w:lang w:val="pt-BR"' not in b:
            err('LINA Corpo sem <w:lang w:val="pt-BR"')
    for e in (e for k, v in TABELA.items() if k in nome for e in v):
        if e in estilos and not re.search(rf'<w:tblStyle w:val="{re.escape(estilos[e][0] or "")}"', doc):
            err(f'tabela com estilo "{e}" não referenciada no document.xml')
    if any(k in nome for k in NUMPAGES) and not any(
            re.search(r'NUMPAGES', lido(p) or '') for p in z.namelist() if re.fullmatch(r'word/footer\d*\.xml', p)):
        err('falta campo NUMPAGES em footer*.xml')

    h = re.search(r'<w:autoHyphenation(?:\s+w:val="([^"]*)")?\s*/>', st)
    if not h or h.group(1) not in (None, 'true', '1', 'on'):
        err('settings.xml sem w:autoHyphenation ligado')
    pgs = re.findall(r'<w:pgSz\b[^>]*>', doc)
    if not pgs or not all('w:w="11906"' in t and 'w:h="16838"' in t for t in pgs):
        err('há seção que não é A4 (pgSz 11906 × 16838)')
    # corpo, cabeçalhos e rodapés
    partes = [p for p in z.namelist() if re.fullmatch(r'word/(document|header\d*|footer\d*)\.xml', p)]
    for p in partes:
        x = lido(p)
        if 'w:txbxContent' in x:
            err(f'há caixa de texto (w:txbxContent) em {p}')
        for tag in ('w:tblBorders', 'w:tcBorders', 'w:shd'):
            if f'<{tag}' in x:
                err(f'formatação direta de tabela em {p}: {tag}')
        # estilos usados existem em styles.xml
        ids = set(re.findall(r'w:styleId="([^"]+)"', sty))
        for u in sorted(set(re.findall(r'<w:(?:pStyle|rStyle|tblStyle) w:val="([^"]+)"', x)) - ids):
            err(f'{p}: estilo "{u}" usado e ausente em styles.xml')
        # toda tabela traz estilo
        for tb in re.findall(r'<w:tbl>.*?</w:tbl>', x, re.S):
            pr = re.search(r'<w:tblPr>.*?</w:tblPr>', tb, re.S)
            if not pr or '<w:tblStyle ' not in pr.group(0):
                err(f'{p}: tabela sem w:tblStyle')
    quebras = len(re.findall(r'<w:br\b[^>]*w:type="page"', doc))
    if quebras > 2:
        err(f'{quebras} quebras de página manuais (máximo 2)')

    # Formatação direta no corpo, cabeçalhos e rodapés
    viol = []
    try:
        raizes = [ET.fromstring(lido(p)) for p in partes]
    except ET.ParseError as e:
        err(f'XML mal formado: {e}')
        return 0
    for e in (x for raiz in raizes for x in raiz.iter()):
        t = local(e)
        filhos = [local(c) for c in e]
        if t == 'pPr':
            viol += [f'pPr/{c}' for c in filhos if c not in ('pStyle', 'sectPr', 'rPr')]
        elif t == 'rPr':
            viol += [f'rPr/{c}' for c in filhos if c != 'rStyle']
        elif t in PERMITIDO:
            viol += [f'{t}/{c}' for c in filhos if c not in PERMITIDO[t]]
    if viol:
        err(f'{len(viol)} formatação direta no corpo/cabeçalho/rodapé, ex.: ' + ', '.join(viol[:5]))

    # Content type
    tem = lambda s: f'wordprocessingml.{s}.main+xml' in ct
    if nome.endswith('.dotx'):
        if not tem('template') or tem('document'):
            err('.dotx sem content type de template')
    elif not tem('document') or tem('template'):
        err('.docx com content type errado (precisa de document.main+xml, sem template)')

    # Distorção
    for p in z.namelist():
        if not re.fullmatch(r'word/(document|header\d*|footer\d*)\.xml', p):
            continue
        rels = {}
        rp = f'word/_rels/{os.path.basename(p)}.rels'
        if rp in z.namelist():
            for r in ET.fromstring(z.read(rp)):
                rels[r.get('Id')] = r.get('Target', '')
        for d in re.findall(r'<w:drawing>.*?</w:drawing>', lido(p), re.S):
            ex = re.search(r'<wp:extent cx="(\d+)" cy="(\d+)"', d)
            if not ex:
                continue
            cx, cy = int(ex.group(1)), int(ex.group(2))
            for rid in re.findall(r'r:embed="([^"]+)"', d):
                alvo = rels.get(rid, '')
                if alvo.lower().endswith('.svg'):
                    continue  # o SVG vem sempre com PNG de reserva, que é o conferido
                if not alvo.lower().endswith('.png'):
                    err(f'{p}: imagem {alvo or rid} não é PNG nem SVG')
                    continue
                alvo = alvo.lstrip('/') if alvo.startswith('/') else 'word/' + alvo
                if alvo not in z.namelist():
                    err(f'{p}: imagem {alvo} ausente')
                    continue
                tam = png_size(z.read(alvo))
                if not tam or not cy or not tam[1]:
                    err(f'{p}: {alvo} ilegível ou sem altura')
                    continue
                r = (cx / cy) / (tam[0] / tam[1])
                if abs(r - 1) > TOL:
                    dist += 1
                    err(f'{p}: {alvo} distorcida ({cx}×{cy} vs {tam[0]}×{tam[1]})')

    if not any(n.startswith('word/fonts/') for n in z.namelist()):
        avisos.append(f'aviso: {nome} sem word/fonts/ (fontes não embutidas)')
    return dist


erros, avisos, dist = [], [], 0
arquivos = sorted(glob.glob(os.path.join(D, 'word', 'out', '*.docx')) + glob.glob(os.path.join(D, 'word', 'out', '*.dotx')))
if not arquivos:
    erros.append('nenhum .docx/.dotx em templates/documento-a4/word/out/')
for a in arquivos:
    dist += confere(a, erros, avisos)
print('\n'.join(avisos + (erros or [f'ok: {len(arquivos)} arquivos, estilos e formatação conferidos'])))
print(f'distorcidas: {dist}')
sys.exit(1 if erros or dist else 0)
