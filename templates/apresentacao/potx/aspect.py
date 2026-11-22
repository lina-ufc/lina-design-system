"""Falha se alguma imagem do .pptx estiver distorcida (proporção do quadro ≠ proporção da parte recortada da imagem)."""
import re, sys, zipfile, io, posixpath
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
bad = 0
z = zipfile.ZipFile(sys.argv[1])
for n in sorted(x for x in z.namelist() if re.match(r'ppt/(slides|slideLayouts)/\w+\d+\.xml$', x)):
    x = z.read(n).decode(); rels = z.read(n.replace('/s', '/_rels/s', 1).replace('.xml', '.xml.rels') if False else posixpath.join(posixpath.dirname(n), '_rels', posixpath.basename(n) + '.rels')).decode()
    rid = dict(re.findall(r'Id="([^"]+)"[^>]*Target="([^"]+)"', rels)) | {a: b for b, a in re.findall(r'Target="([^"]+)"[^>]*Id="([^"]+)"', rels)}
    for pic in re.findall(r'<p:pic>.*?</p:pic>', x, re.S):
        e = re.search(r'r:embed="([^"]+)"', pic); ext = re.search(r'<a:ext cx="(\d+)" cy="(\d+)"', pic)
        if not e or not ext or e.group(1) not in rid: continue
        t = rid[e.group(1)]
        if not re.search(r'\.(png|jpe?g)$', t, re.I): continue
        iw, ih = Image.open(io.BytesIO(z.read(posixpath.normpath(posixpath.join(posixpath.dirname(n), t))))).size
        c = {k: int(v) / 1e5 for k, v in re.findall(r'\b([ltrb])="(-?\d+)"', (re.search(r'<a:srcRect[^>]*>', pic) or [''])[0] if re.search(r'<a:srcRect[^>]*>', pic) else '')}
        vis = (iw * (1 - c.get('l', 0) - c.get('r', 0))) / (ih * (1 - c.get('t', 0) - c.get('b', 0)))
        fr = int(ext.group(1)) / int(ext.group(2)); err = abs(fr / vis - 1)
        if err > 0.01: bad += 1; print(f'DISTORCIDA {n} {t} quadro {fr:.3f} imagem {vis:.3f} ({err:.0%})')
print('distorcidas:', bad); sys.exit(1 if bad else 0)
