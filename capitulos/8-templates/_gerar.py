"""Gera a seção Apresentação do capítulo 8 (8.1): estrutura, exemplo, uso e downloads.
Rodar depois de publicar o template e os pacotes (downloads/empacotar.py): python3 capitulos/8-templates/_gerar.py"""
import os, re, zipfile
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

FAM = [('Abertura', 'Capa, sumário e aberturas de seção.'), ('Texto', 'Argumento em uma a três colunas, equação, conclusões e o slide livre.'),
       ('Ícones', 'Recursos, etapas de processo e lista com imagem.'), ('Imagem', 'Fotos, figuras, mosaico e vídeo.'),
       ('Dados', 'Gráficos, números-chave, comparação e tabela.'), ('Encerramento', 'Agradecimento e contato.')]
CSS = '<style>.passos{margin:8px 0 20px;padding-left:1.4em;display:grid;gap:6px}</style>'
LAYS = sorted(set(lay.values()), key=lambda l: [int(x) for x in l.split()[0].split('.')])

def tam(p):
    b = os.path.getsize(os.path.join(R, p))
    return f'{b / 1e6:.1f} MB'.replace('.', ',') if b > 1e6 else f'{b // 1000} kB'
DL = [(f'{T}/LINA-Apresentacao.potx', 'Modelo · .potx', 'Só os 32 layouts, sem slides. Abre como apresentação nova no PowerPoint.'),
      (PPTX, 'Exemplo · .pptx', f'{len(slides)} slides: um por layout, o guia e as páginas de ícones. Abre no Keynote, Google Slides e Impress.'),
      (PDF, 'Exemplo · .pdf', 'Para consultar sem abrir um editor.'),
      ('downloads/LINA-Apresentacao-HTML.zip', 'Deck HTML · .zip', 'Os mesmos layouts para apresentar no navegador, sem internet.')]
# No site (GitHub Actions), os arquivos da release saem da página da release.
REL = os.environ.get('RELEASE_URL', '')
VER = re.search(r'^## (\d[\d.]*)', open(os.path.join(R, T, 'CHANGELOG.md'), encoding='utf-8').read(), re.M).group(1)
href = lambda p: REL + os.path.basename(p) if REL else p
hist = REL.replace('/download/', '/tag/').rstrip('/') if REL else f'{T}/CHANGELOG.md'
cards = ''.join(f'<a href="{escape(href(p))}" download><b>{t}</b><span class="p" style="margin:0">{d}</span><span class="mono cap">{os.path.basename(p)} · {tam(p)}</span></a>' for p, t, d in DL)

fams = ''.join(f'<li><b>{k} · {fam}</b> <span class="cap">{desc}</span><br><span class="mono cap">'
               + ' · '.join(escape(l) for l in LAYS if l.startswith(f'{k}.')) + '</span></li>' for k, (fam, desc) in enumerate(FAM, 1))
H = '<h2 class="h" style="font-size:18px;margin:26px 0 6px">'
# Os seis fundos de capa com a trama (pontilhado de uma cor, vizinha do fundo).
TRAMA = '''<div id="apresentacao-trama" style="display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px;margin:12px 0 20px"></div>
<script src="assets/lina-geometry.js"></script><script src="assets/lina-dither-field.js"></script><script>{
const T=[['ferro','#A81F0D','#8A1A0B','#FAF5C6'],['umbro','#2A1A12','#3D2418','#FAF5C6'],['turquesa tinta','#14322E','#1F4741','#FAF5C6'],['ferro fundo','#6E1408','#541008','#FAF5C6'],['creme','#FAF5C6','#EFE3A4','#2A1A12'],['damasco','#FDD692','#F2C37A','#2A1A12']];
document.getElementById('apresentacao-trama').innerHTML=T.map(([n,bg,pt,tx])=>'<div class="fig"><div style="position:relative;aspect-ratio:16/9;background:'+bg+';border-radius:6px;overflow:hidden"><lina-dither-field colors="'+pt+','+pt+'" still density=".2" cell="4" style="position:absolute;inset:0;display:block;-webkit-mask-image:linear-gradient(#000 55%,transparent 80%);mask-image:linear-gradient(#000 55%,transparent 80%)"></lina-dither-field><div style="position:absolute;left:9px;bottom:16px;right:9px;color:'+tx+'"><div style="height:5px;width:70%;background:currentColor;border-radius:2px"></div><div style="height:5px;width:45%;background:currentColor;border-radius:2px;margin-top:3px"></div><div style="display:flex;gap:4px;margin-top:8px">'+'<span style="width:10px;height:4px;background:currentColor;opacity:.7;border-radius:1px"></span>'.repeat(3)+'</div></div></div><p class="cap">'+n+'</p></div>').join('');
}</script>'''

apres = f'''<style>.fam{{margin:8px 0 20px;padding:0;list-style:none;display:grid;gap:10px}}</style>{CSS}<h2>Apresentação</h2>
{H}Estrutura</h2>
<p class="p">Template 16:9, desenhado em 1920 × 1080. Um só gerador produz o PowerPoint e o deck HTML: os dois têm os mesmos layouts e as mesmas medidas.</p>
<p class="p">Grade de 12 colunas e 6 linhas sobre a área modular, com margens de 72 px. O rótulo da seção ocupa a faixa do topo; o título começa na primeira linha e o conteúdo na segunda. O rodapé traz o ícone L, o título abreviado e o número do slide. Slides de conteúdo têm fundo branco.</p>
<p class="p">Capa, aberturas de seção e encerramento têm fundo de cor coberto por um <a href="3-padroes.html#s-monocromaticos">pontilhado de uma cor só</a>, vizinha do fundo (<a href="2-cores.html#s-estudo-de-contraste">contraste de 1,2 a 1,8 : 1</a>). O pontilhado some antes da faixa de logos. O logotipo completo aparece só na capa e no encerramento; nos outros slides, o ícone no rodapé. Seis fundos possíveis:</p>
{TRAMA}
<p class="p">São {len(LAYS)} layouts em seis famílias. O nome é numerado, <span class="mono">família.variação</span>, e é nessa ordem que aparecem na lista de layouts do editor.</p>
<ul class="fam p">{fams}</ul>
{H}Exemplo</h2>
<p class="p">O exemplo no deck HTML: setas passam os slides. <a href="{T}/Apresentacao.dc.html" target="_blank">Abrir em tela cheia ↗</a></p>
<!--quadro {T}/Apresentacao.dc.html 1920x1080-->
{H}Uso</h2>
<ol class="passos p">
<li>Instale as fontes (<a href="5-tipografia.html#s-composicoes">5.5</a>) antes de abrir os arquivos.</li>
<li>PowerPoint: abra o <span class="mono">.potx</span>, que cria uma apresentação nova. Keynote, Google Slides e Impress: abra o <span class="mono">.pptx</span> de exemplo e apague os slides que não usar.</li>
<li>Novo slide: escolha o layout pelo número. O primeiro algarismo é a família, o segundo a variação (<span class="mono">4.5 Duas imagens</span>).</li>
<li>Preencha os espaços sem mover nem redimensionar as caixas. Se a composição não couber, troque de layout; para diagramas livres, use <span class="mono">2.6 Só título</span>.</li>
<li>Ícones: copie das quatro páginas no fim do exemplo e cole no slide, um tratamento por slide.</li>
<li>Rodapé: Inserir › Cabeçalho e Rodapé › Rodapé, com o título abreviado, em todos os slides.</li>
<li>Antes de apresentar, apague o guia e as páginas de ícones. Ao salvar, incorpore as fontes.</li>
</ol>
<p class="p">Para o deck HTML, descompacte o zip e abra <span class="mono">Apresentacao.dc.html</span> no navegador. Setas passam os slides; G mostra a grade. Cada slide é uma <span class="mono">&lt;section&gt;</span> no arquivo: edite os textos num editor de texto e troque as imagens na pasta <span class="mono">img/</span>, mantendo os nomes.</p>
{H}Baixar</h2>
<p class="p mono">Versão {VER} · <a href="{escape(hist)}">histórico de versões</a> · <a href="https://github.com/lina-ufc/lina-design-system/releases">versões anteriores</a></p>
<div class="dl">{cards}</div>
<p class="p">Também: fontes (<a href="5-tipografia.html#s-composicoes">5.5</a>), ícones além das páginas do exemplo (<a href="6-icones.html#s-arquivos">6.5</a>) e logos para a faixa de parceiros (<a href="1-logotipo.html#s-combinacoes-de-cores">1.8</a>).</p>'''

open(os.path.join(AQUI, '1-apresentacao.html'), 'w').write(apres + '\n')
print('layouts', len(LAYS))
