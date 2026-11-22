"""Gera as seções de Apresentação do capítulo 8: downloads, uso e catálogo de layouts.
Rodar depois de publicar o template e os pacotes (downloads/empacotar.py): python3 capitulos/8-templates/_gerar.py"""
import os, re, subprocess, zipfile
from html import escape
AQUI = os.path.dirname(os.path.abspath(__file__)); R = os.path.dirname(os.path.dirname(AQUI))
T = 'templates/apresentacao'
PPTX, PDF = f'{T}/LINA-Apresentacao-exemplo.pptx', f'{T}/LINA-Apresentacao-exemplo.pdf'

# Layout de cada slide do exemplo (slideN.xml → slideLayoutM.xml → nome).
z = zipfile.ZipFile(os.path.join(R, PPTX))
nome_lay = lambda f: re.search(r'<p:cSld name="([^"]+)"', z.read(f).decode()).group(1)
slides = sorted((int(re.search(r'(\d+)', n).group(1)), n) for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml', n))
lay = {}
for i, n in slides:
    rel = z.read(n.replace('slides/', 'slides/_rels/') + '.rels').decode()
    lay[i] = nome_lay('ppt/slideLayouts/' + re.search(r'slideLayouts/(slideLayout\d+\.xml)', rel).group(1))

# Miniaturas: primeira ocorrência de cada layout e as páginas de ícones (rótulo começa por "Ícones · copiar").
os.makedirs(os.path.join(AQUI, 'img'), exist_ok=True)
def mini(i, nome):
    out = os.path.join(AQUI, 'img', nome)
    subprocess.run(['pdftoppm', '-f', str(i), '-l', str(i), '-singlefile', '-jpeg', '-jpegopt', 'quality=85',
                    '-scale-to-x', '640', '-scale-to-y', '-1', os.path.join(R, PDF), out[:-4]], check=True)
    return f'capitulos/8-templates/img/{nome}'
primeiro = {}
for i, l in lay.items(): primeiro.setdefault(l, i)
icones = [i for i, n in slides if 'Ícones · copiar' in z.read(n).decode()]

FAM = [('Abertura', 'Capa, sumário e aberturas de seção.'), ('Texto', 'Argumento em uma a três colunas, equação, conclusões e o slide livre.'),
       ('Ícones', 'Recursos, etapas de processo e lista com imagem.'), ('Imagem', 'Fotos, figuras, mosaico e vídeo.'),
       ('Dados', 'Gráficos, números-chave, comparação e tabela.'), ('Encerramento', 'Agradecimento e contato.')]
CSS = '''<style>
.dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin:12px 0 20px}
.dl a{display:grid;gap:4px;padding:16px 18px;border-radius:var(--radius-xl);box-shadow:inset 0 0 0 1px var(--fio);text-decoration:none;color:inherit}
.dl a:hover{box-shadow:inset 0 0 0 2px var(--ferro)}.dl b{font-weight:500;color:var(--ferro)}
.lay{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px;margin:8px 0 20px}
.lay figure{margin:0}.lay img{width:100%;display:block;border-radius:6px;box-shadow:0 0 0 1px var(--fio)}
.passos{margin:8px 0 20px;padding-left:1.4em;display:grid;gap:6px}
</style>'''

def tam(p):
    b = os.path.getsize(os.path.join(R, p))
    return f'{b / 1e6:.1f} MB'.replace('.', ',') if b > 1e6 else f'{b // 1000} kB'
DL = [(f'{T}/LINA-Apresentacao.potx', 'Modelo · .potx', 'Só os 32 layouts, sem slides. Abre como apresentação nova no PowerPoint.'),
      (PPTX, 'Exemplo · .pptx', f'{len(slides)} slides: um por layout, o guia e as páginas de ícones. Abre no Keynote, Google Slides e Impress.'),
      (PDF, 'Exemplo · .pdf', 'Para consultar sem abrir um editor.'),
      ('downloads/LINA-Apresentacao-HTML.zip', 'Deck HTML · .zip', 'Os mesmos layouts para apresentar no navegador, sem internet.'),
      ('downloads/LINA-Fontes-e-Icones.zip', 'Fontes e ícones · .zip', 'Outfit e JetBrains Mono (OFL) e Phosphor nos seis pesos (MIT).')]
# No site (GitHub Actions), os arquivos da release saem da página da release; o pacote de fontes, do próprio site.
REL = os.environ.get('RELEASE_URL', '')
VER = re.search(r'^## (\d[\d.]*)', open(os.path.join(R, T, 'CHANGELOG.md'), encoding='utf-8').read(), re.M).group(1)
href = lambda p: REL + os.path.basename(p) if REL and not p.startswith('downloads/LINA-Fontes') else p
hist = REL.replace('/download/', '/tag/').rstrip('/') if REL else f'{T}/CHANGELOG.md'
cards = ''.join(f'<a href="{escape(href(p))}" download><b>{t}</b><span class="p" style="margin:0">{d}</span><span class="mono cap">{os.path.basename(p)} · {tam(p)}</span></a>' for p, t, d in DL)

apres = f'''{CSS}<h2>Apresentação</h2>
<p class="p">Template 16:9, desenhado em 1920 × 1080, com 32 layouts em seis famílias. O mesmo conjunto existe em PowerPoint e em HTML: os dois saem do mesmo gerador e têm as mesmas medidas.</p>
<p class="p mono">Versão {VER} · <a href="{escape(hist)}">histórico de versões</a> · <a href="https://github.com/lina-ufc/lina-design-system/releases">versões anteriores</a></p>
<div class="dl">{cards}</div>
<h3 style="margin-top:20px">Como usar</h3>
<ol class="passos p">
<li>Instale a Outfit e a JetBrains Mono antes de abrir os arquivos.</li>
<li>PowerPoint: abra o <span class="mono">.potx</span>, que cria uma apresentação nova. Keynote, Google Slides e Impress: abra o <span class="mono">.pptx</span> de exemplo e apague os slides que não usar.</li>
<li>Novo slide: escolha o layout pelo número. O primeiro algarismo é a família, o segundo a variação (<span class="mono">4.5 Duas imagens</span>).</li>
<li>Preencha os espaços sem mover nem redimensionar as caixas. Se a composição não couber, troque de layout; para diagramas livres, use <span class="mono">2.6 Só título</span>.</li>
<li>Ícones: copie das quatro páginas no fim do exemplo e cole no slide. Um tratamento por slide.</li>
<li>Rodapé: Inserir › Cabeçalho e Rodapé › Rodapé, com o título abreviado, em todos os slides.</li>
<li>Antes de apresentar, apague o guia e as páginas de ícones. Ao salvar, incorpore as fontes.</li>
</ol>
<h3 style="margin-top:20px">Deck HTML</h3>
<p class="p">Descompacte e abra <span class="mono">Apresentacao.dc.html</span> no navegador. Setas passam os slides; G mostra a grade. Cada slide é uma <span class="mono">&lt;section&gt;</span> no arquivo: edite os textos num editor de texto e troque as imagens na pasta <span class="mono">img/</span>, mantendo os nomes.</p>'''

blocos = ''
for k, (fam, desc) in enumerate(FAM, 1):
    ls = sorted((l for l in primeiro if l.startswith(f'{k}.')), key=lambda l: int(l.split()[0].split('.')[1]))
    figs = ''.join(f'<figure><img src="{mini(primeiro[l], l.split()[0].replace(".", "-") + ".jpg")}" alt="{escape(l)}" loading="lazy"><p class="cap mono">{escape(l)}</p></figure>' for l in ls)
    blocos += f'<h3 style="margin-top:20px">{k} · {fam}</h3><p class="cap">{desc}</p><div class="lay">{figs}</div>'
figs = ''.join(f'<figure><img src="{mini(i, f"icones-{j}.jpg")}" alt="Página de ícones {j}" loading="lazy"></figure>' for j, i in enumerate(icones, 1))
layouts = f'''<h2>Layouts</h2>
<p class="p">Os layouts têm nome numerado, <span class="mono">família.variação</span>, e aparecem nessa ordem na lista de layouts do editor. As miniaturas vêm do arquivo de exemplo.</p>
{blocos}<h3 style="margin-top:20px">Páginas de ícones</h3>
<p class="cap">No fim do exemplo: os tratamentos sólido, cheio, claro e simples e os pares duotone, prontos para copiar.</p><div class="lay">{figs}</div>'''

for nome, h in [('2-apresentacoes', apres), ('3-layouts', layouts)]:
    open(os.path.join(AQUI, nome + '.html'), 'w').write(h + '\n')
print('layouts', len(primeiro), '· páginas de ícones', len(icones))
