"""Confere os 5 arquivos da release do Documento A4: 2 zips (downloads/) e 3 PDFs de exemplo (templates/documento-a4/).
O zip LaTeX tem de compilar sozinho (XeLaTeX) e os PDFs, 3 páginas A4.
Uso: python3 templates/documento-a4/check_pacotes.py [RAIZ]
RAIZ = pasta que contém downloads/ e templates/documento-a4/ (padrão: raiz do repositório; no CI, o artifact baixado)."""
import os, re, subprocess, sys, tempfile, zipfile

R = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DOWN, DOC = os.path.join(R, 'downloads'), os.path.join(R, 'templates', 'documento-a4')
MODELOS = ['Relatorio', 'Artigo', 'POP']
WORD = 'LINA-Documentos-Word'
TEX = 'LINA-Documentos-LaTeX'
FONTES = ['Outfit-Light', 'Outfit-Regular', 'Outfit-Medium', 'Outfit-Bold', 'Outfit-ExtraBold', 'JetBrainsMono-Regular', 'JetBrainsMono-Bold']
ESPERADO = {
    WORD + '.zip': {f'{WORD}/LINA-{m}{s}' for m in MODELOS for s in ('.dotx', '-exemplo.docx')},
    TEX + '.zip': {f'{TEX}/{a}' for a in ['lina.cls', 'LEIA-ME.txt', 'logos/lina-horizontal-ferro.pdf', 'fontes/OFL.txt', 'fontes/OFL-JetBrainsMono.txt']
                   + [f'LINA-{m}.tex' for m in MODELOS] + [f'fontes/{f}.ttf' for f in FONTES]},
}
PDFS = [f'LINA-{m}-exemplo.pdf' for m in MODELOS]
erros = []

def pdfinfo(p):
    return subprocess.run(['pdfinfo', p], capture_output=True, text=True).stdout

def confere_pdf(p, rotulo):
    i = pdfinfo(p)
    n = re.search(r'^Pages:\s+(\d+)', i, re.M)
    t = re.search(r'^Page size:\s+([\d.]+) x ([\d.]+)', i, re.M)
    if not n or int(n.group(1)) != 3:
        erros.append(f'{rotulo}: esperado 3 páginas, veio {n and n.group(1)}')
    if t and not (abs(float(t.group(1)) - 595.28) < 1 and abs(float(t.group(2)) - 841.89) < 1):
        erros.append(f'{rotulo}: página não é A4 ({t.group(1)} x {t.group(2)})')

arquivos = [os.path.join(DOWN, z) for z in ESPERADO] + [os.path.join(DOC, p) for p in PDFS]
faltam = [a for a in arquivos if not os.path.isfile(a)]
for a in faltam:
    erros.append(f'não existe: {a}')

for z, esp in ESPERADO.items():
    p = os.path.join(DOWN, z)
    if p in faltam: continue
    tem = {n for n in zipfile.ZipFile(p).namelist() if not n.endswith('/')}
    for n in sorted(esp - tem): erros.append(f'{z}: falta {n}')
    for n in sorted(tem - esp): erros.append(f'{z}: sobra {n}')

for pdf in PDFS:
    p = os.path.join(DOC, pdf)
    if p not in faltam: confere_pdf(p, pdf)

zt = os.path.join(DOWN, TEX + '.zip')
if zt not in faltam:
    with tempfile.TemporaryDirectory() as tmp:  # compila como no Overleaf: só o que veio no zip
        zipfile.ZipFile(zt).extractall(tmp)
        pasta = os.path.join(tmp, TEX)
        r = subprocess.run(['latexmk', '-xelatex', '-interaction=nonstopmode', '-halt-on-error', 'LINA-POP.tex'],
                           cwd=pasta, capture_output=True, text=True)
        if r.returncode: erros.append(f'{TEX}.zip: LINA-POP.tex não compilou\n' + r.stdout[-1500:])
        else: confere_pdf(os.path.join(pasta, 'LINA-POP.pdf'), f'{TEX}.zip LINA-POP.pdf')

if erros:
    print('\n'.join(erros)); sys.exit(1)
print('ok: 5 arquivos')
