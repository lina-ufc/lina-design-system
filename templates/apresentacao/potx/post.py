"""Pós-processa o .pptx do pptxgenjs: restaura tipos de espaço (imagem, tabela), dá nomes legíveis,
arredonda cantos das imagens que não sangram, cria o espaço de rodapé (Inserir › Cabeçalho e Rodapé)
e grava a versão .potx. Uso: python3 post.py out/LINA-Apresentacao.pptx"""
import posixpath, json, re, sys, zipfile
from xml.sax.saxutils import escape

SRC = sys.argv[1]
W, FOOT_Y, R = 1920, 996, 22
EMU = 6350  # por px de referência (1 px = 1/144 pol)
FOOT_TEXT = __import__('os').environ.get('FOOT', 'Título abreviado do trabalho')
LAYOUTS = {l['name']: l for l in json.load(open('out/layouts.json'))}
LANG = (json.load(open('out/opcoes.json')) if __import__('os').path.exists('out/opcoes.json') else {}).get('lang', 'pt-BR')  # idioma do deck (build.js: opcoes.lang)

FTR = ('<p:sp><p:nvSpPr><p:cNvPr id="{id}" name="Rodapé"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr>'
       '<p:nvPr><p:ph type="ftr" sz="quarter" idx="11"/></p:nvPr></p:nvSpPr><p:spPr>{xfrm}</p:spPr>'
       '<p:txBody><a:bodyPr wrap="none" lIns="0" tIns="0" rIns="0" bIns="0" anchor="ctr"/>{lst}<a:p>{run}</a:p></p:txBody></p:sp>')
XFRM = f'<a:xfrm><a:off x="{132*EMU}" y="{(FOOT_Y+22)*EMU}"/><a:ext cx="{1480*EMU}" cy="{40*EMU}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom>'
LST = ('<a:lstStyle><a:lvl1pPr><a:defRPr sz="1000"><a:solidFill><a:srgbClr val="FAF5C6"/></a:solidFill>'
       '<a:latin typeface="Outfit Medium"/></a:defRPr></a:lvl1pPr></a:lstStyle>')

# Degradê ferro fundo sobre a imagem (4.7 · título): 'cima' opaco 90% → 0, 'baixo' 0 → 85%, no preenchimento do espaço de texto.
def grad(a0, a1):
    c = lambda a: f'<a:srgbClr val="6E1408"><a:alpha val="{a}"/></a:srgbClr>'
    return f'<a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0">{c(a0)}</a:gs><a:gs pos="100000">{c(a1)}</a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill>'
GRAD = {'cima': grad(90000, 0), 'baixo': grad(0, 85000)}
def poe_grad(x, idx, kind):
    i = x.find(f'idx="{idx}"')
    if i < 0: return x
    a = x.rfind('<p:sp>', 0, i); b = x.find('</p:sp>', i) + 7
    return x[:a] + x[a:b].replace('<a:noFill/>', GRAD[kind], 1) + x[b:]

def fix_layout(x):
    name = re.search(r'<p:cSld name="([^"]*)"', x).group(1)
    L = LAYOUTS.get(name)
    if not L: return x, None, None
    for p in L['ph']:
        i = x.find(f'idx="{p["idx"]}"')
        a = x.rfind('<p:sp>', 0, i); b = x.find('</p:sp>', i) + 7
        sp = x[a:b]
        sp = re.sub(r'name="Text \d+"', f'name="{escape(p["name"])}"', sp, count=1)
        t = {'pic': 'pic', 'tbl': 'tbl'}.get(p['type'])
        if t: sp = sp.replace(f'idx="{p["idx"]}"', f'idx="{p["idx"]}" type="{t}"', 1)
        if p['type'] in ('pic', 'obj'):
            bx, by, bw, bh = p['box']
            bleed = bx <= 0 or by <= 0 or bx + bw >= W - 1
            if not bleed and min(bw, bh) > 120:
                adj = round(R / min(bw, bh) * 50000)
                sp = sp.replace('<a:prstGeom prst="rect"><a:avLst></a:avLst></a:prstGeom>',
                                f'<a:prstGeom prst="roundRect"><a:avLst><a:gd name="adj" fmla="val {adj}"/></a:avLst></a:prstGeom>', 1)
            if p['name'].startswith(('Imagem', 'Ilustração')):
                sp = sp.replace('<a:noFill/>', '<a:solidFill><a:srgbClr val="FDF1CF"/></a:solidFill>', 1)
        x = x[:a] + sp + x[b:]
        if p.get('degrade'): x = poe_grad(x, p['idx'], p['degrade'])
    if L['foot']:
        x = x.replace('</p:spTree>', FTR.format(id=900, xfrm=XFRM, lst=LST, run=f'<a:endParaRPr lang="{LANG}"/>') + '</p:spTree>', 1)
    return x, L['foot'], name

with zipfile.ZipFile(SRC) as z:
    files = {n: z.read(n) for n in z.namelist()}
foot_layout, nome_layout = {}, {}
for n in list(files):
    if re.match(r'ppt/slideLayouts/slideLayout\d+\.xml$', n):
        x, foot, nome = fix_layout(files[n].decode())
        files[n] = x.encode(); foot_layout[n.split('/')[-1]] = foot; nome_layout[n.split('/')[-1]] = nome
m = files['ppt/slideMasters/slideMaster1.xml'].decode()
m = m.replace('<p:hf sldNum="0" hdr="0" ftr="0" dt="0"/>', '<p:hf hdr="0" dt="0"/>')  # rodapé e número ligados
files['ppt/slideMasters/slideMaster1.xml'] = m.encode()
if 'type="ftr"' not in m:
    files['ppt/slideMasters/slideMaster1.xml'] = m.replace('</p:spTree>', FTR.format(id=900, xfrm=XFRM, lst=LST, run=f'<a:endParaRPr lang="{LANG}"/>') + '</p:spTree>', 1).encode()
for n in list(files):
    if re.match(r'ppt/slides/slide\d+\.xml$', n):
        rel = files[n.replace('slides/', 'slides/_rels/') + '.rels'].decode()
        lay = re.search(r'slideLayouts/(slideLayout\d+\.xml)', rel).group(1)
        for p in LAYOUTS.get(nome_layout.get(lay), {'ph': []})['ph']:  # o preenchimento do layout não vale se o slide traz <a:noFill/>
            if p.get('degrade'): files[n] = poe_grad(files[n].decode(), p['idx'], p['degrade']).encode()
        if foot_layout.get(lay):
            run = f'<a:r><a:rPr lang="{LANG}"/><a:t>{escape(FOOT_TEXT)}</a:t></a:r>'
            files[n] = files[n].decode().replace('</p:spTree>', FTR.format(id=901, xfrm=XFRM, lst=LST, run=run) + '</p:spTree>', 1).encode()

# Idioma do texto (o pptxgenjs grava en-US).
for n in list(files):
    if re.match(r'ppt/(slides|slideLayouts|slideMasters|notesSlides)/[^/]+\.xml$', n): files[n] = files[n].decode().replace('lang="en-US"', f'lang="{LANG}"').encode()

# Guias da grade modular (mesmos números de build.js). pos em 1/8 pt = px × 4.
M, G, CW, RH, B0 = 72, 24, 126, 120, 132  # B0: início dos módulos, abaixo da faixa do rótulo (72 a 108)
vx = sorted({M + i * (CW + G) for i in range(12)} | {M + i * (CW + G) + CW for i in range(12)})
hy = sorted({M, M + 36} | {B0 + i * (RH + G) for i in range(6)} | {B0 + i * (RH + G) + RH for i in range(6)} | {FOOT_Y})
guides = ''.join(f'<p:guide pos="{x * 4}"/>' for x in vx) + ''.join(f'<p:guide orient="horz" pos="{y * 4}"/>' for y in hy)
v = files['ppt/viewProps.xml'].decode()
v = re.sub(r'<p:guideLst\s*/>|<p:guideLst>.*?</p:guideLst>', f'<p:guideLst>{guides}</p:guideLst>', v, count=1, flags=re.S)
files['ppt/viewProps.xml'] = v.replace('snapToGrid="0"', 'snapToGrid="0" showGuides="1"').encode()

# Vídeos como no HTML: começam sozinhos ao entrar no slide, sem som, em loop. Antes, ids únicos por slide
# (pptxgenjs repete id quando há mídia, e o gatilho do vídeo aponta para o id).
import struct
def mp4_ms(b):  # duração do vídeo: caixa moov (nível de topo) > mvhd
    o = 0
    while b[o + 4:o + 8] != b'moov':
        sz = struct.unpack('>I', b[o:o + 4])[0]; o += struct.unpack('>Q', b[o + 8:o + 16])[0] if sz == 1 else sz
    i = b.find(b'mvhd', o); v = b[i + 4]
    ts, du = struct.unpack('>IQ', b[i + 24:i + 36]) if v else struct.unpack('>II', b[i + 16:i + 24])
    return round(du * 1000 / ts)
TIMING = ('<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>'
          '<p:par><p:cTn id="2" fill="hold"><p:stCondLst><p:cond delay="indefinite"/><p:cond evt="onBegin" delay="0"><p:tn val="2"/></p:cond></p:stCondLst><p:childTnLst>'
          '<p:par><p:cTn id="3" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>{calls}</p:childTnLst></p:cTn></p:par>'
          '</p:childTnLst></p:cTn></p:par>{nodes}</p:childTnLst></p:cTn></p:par></p:tnLst></p:timing>')
CALL = ('<p:par><p:cTn id="{a}" presetID="1" presetClass="mediacall" presetSubtype="0" fill="hold" nodeType="{t}"><p:stCondLst><p:cond delay="0"/></p:stCondLst>'
        '<p:childTnLst><p:cmd type="call" cmd="playFrom(0.0)"><p:cBhvr><p:cTn id="{b}" dur="{ms}" fill="hold"/><p:tgtEl><p:spTgt spid="{sp}"/></p:tgtEl></p:cBhvr></p:cmd></p:childTnLst></p:cTn></p:par>')
NODE = ('<p:video><p:cMediaNode vol="0" mute="1"><p:cTn id="{c}" repeatCount="indefinite" fill="hold"><p:stCondLst><p:cond delay="indefinite"/></p:stCondLst></p:cTn>'
        '<p:tgtEl><p:spTgt spid="{sp}"/></p:tgtEl></p:cMediaNode></p:video>')
for n in list(files):
    if not re.match(r'ppt/slides/slide\d+\.xml$', n): continue
    x = files[n].decode()
    ids = iter(range(2, 10 ** 6))
    x = re.sub(r'(<p:cNvPr id=")(\d+)(")', lambda m: m.group(1) + (m.group(2) if m.group(2) in ('1', '900', '901') else str(next(ids))) + m.group(3), x)
    rel = files[n.replace('slides/', 'slides/_rels/') + '.rels'].decode()
    vids = []
    for m in re.finditer(r'<p:cNvPr id="(\d+)"[^>]*>(?:(?!</p:pic>|<p:cNvPr ).)*?<a:videoFile r:link="(rId\d+)"', x, re.S):
        tgt = re.search(rf'Id="{m.group(2)}"[^>]*Target="\.\./([^"]+)"', rel).group(1)
        vids.append((m.group(1), mp4_ms(files['ppt/' + tgt])))
    if vids and '<p:timing>' not in x:
        k = 4
        calls = ''.join(CALL.format(a=k + 2 * i, b=k + 2 * i + 1, t='afterEffect' if i == 0 else 'withEffect', ms=ms, sp=sp) for i, (sp, ms) in enumerate(vids))
        k += 2 * len(vids)
        nodes = ''.join(NODE.format(c=k + i, sp=sp) for i, (sp, _) in enumerate(vids))
        x = x.replace('</p:clrMapOvr>', '</p:clrMapOvr>' + TIMING.format(calls=calls, nodes=nodes), 1)
    files[n] = x.encode()

# Fontes embutidas (formato EOT em ppt/fonts/*.fntdata, como o PowerPoint grava), para abrir igual em computador sem
# Texto alternativo: o pptxgenjs põe o caminho do arquivo no descr de imagem sem alt (vaza a pasta local e o leitor
# de tela lê o caminho). Imagem sem alt é decorativa (ícone ao lado do texto, marca do rodapé): descr vazio.
for n in list(files):
    if n.startswith('ppt/slide') and n.endswith('.xml'):
        files[n] = re.sub(rb'descr="(?:/|[A-Za-z]:\\)[^"]*"', b'descr=""', files[n])

# as fontes. Origem: LINA_FONTS ou ~/Library/Fonts; fonte ausente é pulada com aviso.
import os
FONTS = os.environ.get('LINA_FONTS', os.path.expanduser('~/Library/Fonts'))
EMBED = {'Outfit Light': 'Outfit-Light.ttf', 'Outfit Medium': 'Outfit-Medium.ttf',
         'Outfit ExtraBold': 'Outfit-ExtraBold.ttf', 'JetBrains Mono': 'JetBrainsMono-Regular.ttf'}
def eot(f):
    tb = {f[12 + 16 * i:16 + 16 * i]: struct.unpack('>II', f[20 + 16 * i:28 + 16 * i]) for i in range(struct.unpack('>H', f[4:6])[0])}
    o = tb[b'OS/2'][0]; h = tb[b'head'][0]; nm = tb[b'name'][0]
    cnt, so = struct.unpack('>HH', f[nm + 2:nm + 6]); names = {}
    for i in range(cnt):
        pl, en, la, nid, ln, of = struct.unpack('>6H', f[nm + 6 + 12 * i:nm + 18 + 12 * i])
        if (pl, en, la) == (3, 1, 0x409): names[nid] = f[nm + so + of:nm + so + of + ln].decode('utf-16-be').encode('utf-16-le')
    body = (f[o + 32:o + 42] + struct.pack('<BBIHH', 1, struct.unpack('>H', f[o + 62:o + 64])[0] & 1, struct.unpack('>H', f[o + 4:o + 6])[0],
            struct.unpack('>H', f[o + 8:o + 10])[0], 0x504C) + struct.pack('<6I', *struct.unpack('>6I', f[o + 42:o + 58] + f[o + 78:o + 86]))
            + struct.pack('<I', struct.unpack('>I', f[h + 8:h + 12])[0]) + bytes(16)
            + b''.join(struct.pack('<HH', 0, len(names[i])) + names[i] for i in (1, 2, 5, 4)) + struct.pack('<HH', 0, 0))
    return struct.pack('<4I', 16 + len(body) + len(f), len(f), 0x00020001, 0) + body + f
emb, rels = '', files['ppt/_rels/presentation.xml.rels'].decode()
for i, (face, fn) in enumerate(EMBED.items(), 1):
    p = os.path.join(FONTS, fn)
    if not os.path.exists(p): print('aviso: fonte não embutida, falta', p); continue
    files[f'ppt/fonts/font{i}.fntdata'] = eot(open(p, 'rb').read())
    rels = rels.replace('</Relationships>', f'<Relationship Id="rIdF{i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/font" Target="fonts/font{i}.fntdata"/></Relationships>')
    emb += f'<p:embeddedFont><p:font typeface="{face}"/><p:regular r:id="rIdF{i}"/><p:bold r:id="rIdF{i}"/></p:embeddedFont>'
if emb:
    files['ppt/_rels/presentation.xml.rels'] = rels.encode()
    pr = files['ppt/presentation.xml'].decode().replace('<p:presentation ', '<p:presentation embedTrueTypeFonts="1" ', 1)
    files['ppt/presentation.xml'] = re.sub(r'(<p:notesSz [^>]*/>)', r'\1<p:embeddedFontLst>' + emb.replace('\\', r'\\') + '</p:embeddedFontLst>', pr, count=1).encode()
    ct = files['[Content_Types].xml'].decode()
    if 'fntdata' not in ct: files['[Content_Types].xml'] = ct.replace('<Default ', '<Default Extension="fntdata" ContentType="application/x-fontdata"/><Default ', 1).encode()

def sem_slides(fs):
    """Cópia do pacote só com master e layouts: tira os slides e tudo que só eles usam (notas, gráficos, mídia)."""
    fs = dict(fs)
    pr = 'ppt/_rels/presentation.xml.rels'
    # Sem slides não há notas: o master de notas sai também (dividia o tema com o master de slides).
    fs[pr] = re.sub(r'<Relationship [^>]*Target="(?:slides|notesMasters)/[^"]*"/>', '', fs[pr].decode()).encode()
    fs['ppt/presentation.xml'] = re.sub(r'<p:(sldIdLst|notesMasterIdLst)>.*?</p:\1>', '', fs['ppt/presentation.xml'].decode(), flags=re.S).encode()
    # Mantém só as partes alcançáveis a partir das relações da raiz.
    vivo, fila = set(), ['_rels/.rels']
    while fila:
        r = fila.pop()
        if r in vivo or r not in fs: continue
        vivo.add(r)
        base = posixpath.dirname(posixpath.dirname(r))
        for alvo, modo in re.findall(r'Target="([^"]+)"(?: TargetMode="(\w+)")?', fs[r].decode()):
            if modo == 'External': continue
            parte = posixpath.normpath(posixpath.join(base, alvo)).lstrip('/')
            vivo.add(parte)
            fila.append(posixpath.join(posixpath.dirname(parte), '_rels', posixpath.basename(parte) + '.rels'))
    vivo |= {'[Content_Types].xml'}
    fs = {n: b for n, b in fs.items() if n in vivo}
    ct = re.sub(r'<Override PartName="/([^"]+)"[^>]*/>', lambda m: m.group(0) if m.group(1) in fs else '', fs['[Content_Types].xml'].decode())
    fs['[Content_Types].xml'] = ct.replace('presentationml.presentation.main+xml', 'presentationml.template.main+xml').encode()
    if 'docProps/app.xml' in fs:
        fs['docProps/app.xml'] = re.sub(r'<(Slides|Notes)>\d+</', r'<\1>0</', fs['docProps/app.xml'].decode()).encode()
    return fs

def write(path, potx=False):
    with zipfile.ZipFile(path, 'w', zipfile.ZIP_DEFLATED) as o:
        for n, b in (sem_slides(files) if potx else files).items():
            o.writestr(n, b)
write(SRC); write(SRC.replace('.pptx', '.potx'), potx=True)
print('ok', sum(1 for v in foot_layout.values() if v), 'layouts com rodapé')
