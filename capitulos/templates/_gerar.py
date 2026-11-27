"""Gera a seção Apresentação do capítulo 10 (10.1): estrutura, exemplo, uso e downloads; e o Baixar da 10.2 (Documentos A4).
Rodar depois de publicar o template e os pacotes (downloads/empacotar.py): python3 capitulos/templates/_gerar.py"""
import os, re, sys, zipfile
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

FAM = [('Abertura', 'Capa, sumário e abertura de seção.'), ('Texto', 'Colunas, lista, linha do tempo, equação e o slide livre.'),
       ('Ícones', 'Recursos, etapas de processo e ilustrações.'), ('Imagem', 'Fotos, figuras, mosaico, equipe e vídeo.'),
       ('Dados', 'Gráficos, números-chave, comparação e tabela.'), ('Encerramento', 'Agradecimento, contato e autores.')]
CSS = '<style>.passos{margin:8px 0 20px;padding-left:1.4em;display:grid;gap:6px}</style>'
# Layouts do .potx: o que se distribui. Cada variação por N é um layout (`1.4 Sumário · 12 itens`); a lista mostra o nome sem o N.
zp = zipfile.ZipFile(os.path.join(R, f'{T}/LINA-Apresentacao.potx'))
LAYS = sorted({m for m in (re.search(r'<p:cSld name="([^"]+)"', zp.read(n).decode()).group(1) for n in zp.namelist() if re.fullmatch(r'ppt/slideLayouts/slideLayout\d+\.xml', n)) if re.match(r'\d+\.\d+ ', m)},
              key=lambda l: [int(x) for x in l.split()[0].split('.')] + [l])
BASES = sorted({re.sub(r' · \d+ [^·]+$', '', l) for l in LAYS}, key=lambda l: [int(x) for x in l.split()[0].split('.')] + [l])

def tam(p):
    b = os.path.getsize(os.path.join(R, p))
    return f'{b / 1e6:.1f} MB'.replace('.', ',') if b > 1e6 else f'{b // 1000} kB'
DL = [(f'{T}/LINA-Apresentacao.potx', 'Modelo · .potx', f'Só os {len(LAYS)} layouts, sem slides. Abre como apresentação nova no PowerPoint.'),
      (PPTX, 'Exemplo · .pptx', f'{len(slides)} slides: variações dos layouts, componentes, notas do apresentador, o guia e duas páginas de ícones. Abre no Keynote, Google Slides e Impress.'),
      (PDF, 'Exemplo · .pdf', 'Para consultar sem abrir um editor.'),
      ('downloads/LINA-Apresentacao-HTML.zip', 'Deck HTML · .zip', 'Os mesmos layouts para apresentar no navegador, sem internet, com as fontes e a janela do apresentador.')]
# No site (GitHub Actions), os arquivos da release saem da página da release.
REL = os.environ.get('RELEASE_URL', '')
VER = re.search(r'^## (\d[\d.]*)', open(os.path.join(R, T, 'CHANGELOG.md'), encoding='utf-8').read(), re.M).group(1)
href = lambda p: REL + os.path.basename(p) if REL else p
hist = REL.replace('/download/', '/tag/').rstrip('/') if REL else f'{T}/CHANGELOG.md'
cards = ''.join(f'<a href="{escape(href(p))}" download><b>{t}</b><span class="p" style="margin:0">{d}</span><span class="mono cap">{os.path.basename(p)} · {tam(p)}</span></a>' for p, t, d in DL)

fams = ''.join(f'<li><b>{k} · {fam}</b> <span class="cap">{desc}</span><br><span class="mono cap">'
               + ' · '.join(escape(l) for l in BASES if l.startswith(f'{k}.')) + '</span></li>' for k, (fam, desc) in enumerate(FAM, 1))
H = '<h3>'
# Os seis fundos de capa com a trama (pontilhado de uma cor, vizinha do fundo).
TRAMA = '''<div id="apresentacao-trama" class="prancha"></div>
<script src="assets/lina-geometry.js"></script><script src="assets/lina-dither-field.js"></script><script>{
const T=[['ferro','#A81F0D','#8A1A0B','#FAF5C6'],['umbro','#2A1A12','#3D2418','#FAF5C6'],['turquesa tinta','#14322E','#1F4741','#FAF5C6'],['ferro fundo','#6E1408','#541008','#FAF5C6'],['creme','#FAF5C6','#EFE3A4','#2A1A12'],['damasco','#FDD692','#F2C37A','#2A1A12']];
document.getElementById('apresentacao-trama').innerHTML=T.map(([n,bg,pt,tx])=>'<div class="fig"><div class="trama" style="background:'+bg+';color:'+tx+'"><lina-dither-field colors="'+pt+','+pt+'" still density=".2" cell="4"></lina-dither-field><div><i></i><i></i><span><b></b><b></b><b></b></span></div></div><p class="cap">'+n+'</p></div>').join('');
}</script>'''

apres = f'''<style>.fam{{margin:8px 0 20px;padding:0;list-style:none;display:grid;gap:10px}}</style>{CSS}<h2>Apresentação</h2>
{H}Estrutura</h3>
<p class="p">Template 16:9, desenhado em 1920 × 1080. Um só gerador produz o PowerPoint e o deck HTML: os dois têm os mesmos layouts e as mesmas medidas.</p>
<p class="p">Grade de 12 colunas e 6 linhas sobre a área modular, com margens de 72 px. O rótulo da seção ocupa a faixa do topo; o título começa na primeira linha e o conteúdo na segunda. O rodapé traz o ícone L, o título abreviado e o número do slide. Slides de conteúdo têm fundo branco.</p>
<p class="p">Capa, aberturas de seção e encerramento têm fundo de cor coberto por um <a href="padroes.html#s-monocromaticos">pontilhado de uma cor só</a>, vizinha do fundo (<a href="cores.html#s-estudo-de-contraste">contraste de 1,2 a 1,8 : 1</a>). O pontilhado some antes da faixa de logos. O logotipo completo aparece só na capa e no encerramento; nos outros slides, o ícone no rodapé. Seis fundos possíveis:</p>
{TRAMA}
<p class="p">São {len(LAYS)} layouts em seis famílias. O nome é numerado, <span class="mono">família.variação</span>, e é nessa ordem que aparecem na lista de layouts do editor. Alguns layouts mudam de arranjo com a quantidade de itens: o sumário, a lista, a equipe e os autores têm uma variação por faixa, com o número no nome (<span class="mono">1.4 Sumário · 12 itens</span>). A lista abaixo mostra os {len(BASES)} desenhos de base.</p>
<ul class="fam p">{fams}</ul>
{H}Exemplo</h3>
<p class="p">O exemplo no deck HTML: setas passam os slides. <a href="{T}/Apresentacao.dc.html" target="_blank">Abrir em tela cheia ↗</a></p>
<div class="prancha"><div class="fig"><!--quadro {T}/Apresentacao.dc.html 1920x1080--></div></div>
{H}Uso</h3>
<ol class="passos p">
<li>Instale as fontes (<a href="tipografia.html#s-baixar-tipografia">5.5</a>) antes de abrir os arquivos.</li>
<li>PowerPoint: abra o <span class="mono">.potx</span>, que cria uma apresentação nova. Keynote, Google Slides e Impress: abra o <span class="mono">.pptx</span> de exemplo e apague os slides que não usar.</li>
<li>Novo slide: escolha o layout pelo número. O primeiro algarismo é a família, o segundo a variação (<span class="mono">4.5 Imagens em linha · 2 imagens</span>). Quando o conteúdo tem mais ou menos itens, escolha a variação com o número certo; no gerador, a lista <span class="mono">itens</span> escolhe sozinha.</li>
<li>Preencha os espaços sem mover nem redimensionar as caixas. Se a composição não couber, troque de layout; para diagramas livres, use <span class="mono">2.6 Só título</span>.</li>
<li>Ícones: copie das duas páginas no fim do exemplo (tratamentos e biblioteca) e cole no slide, um tratamento por slide.</li>
<li>Notas: escreva no campo de notas do PowerPoint (ou em <span class="mono">notas</span> no gerador). Ver Notas do apresentador, abaixo.</li>
<li>Rodapé: Inserir › Cabeçalho e Rodapé › Rodapé, com o título abreviado, em todos os slides.</li>
<li>Antes de apresentar, apague o guia e as páginas de ícones. Ao salvar, incorpore as fontes.</li>
</ol>
<p class="p">Para o deck HTML, descompacte o zip e abra <span class="mono">Apresentacao.dc.html</span> no navegador. Setas passam os slides; G mostra a grade, F alterna a tela cheia e N abre a janela do apresentador. Cada slide é uma <span class="mono">&lt;section&gt;</span> no arquivo: edite os textos num editor de texto e troque as imagens na pasta <span class="mono">img/</span>, mantendo os nomes.</p>
{H}Notas do apresentador</h3>
<p class="p">As notas são o texto que só o apresentador vê. No PowerPoint, escreva no campo de notas de cada slide e use o Modo de Apresentação. Com o gerador, passe <span class="mono">notas: '…'</span> no <span class="mono">s()</span> do slide (<span class="mono">\\n</span> separa parágrafos); as notas vão para o .pptx e para o deck HTML.</p>
<p class="p">No deck HTML, a tecla N abre a janela do apresentador: nota do slide atual, o slide atual em tamanho grande, o próximo em miniatura menor com o começo da nota seguinte, cronômetro e relógio. As miniaturas são estáticas: vídeos e animações aparecem parados. P inicia ou pausa o cronômetro, R zera, as setas passam os slides e F ocupa a tela toda. O navegador precisa permitir pop-up para o site. Arraste a janela para a tela do notebook e deixe o deck no projetor.</p>
<div class="prancha imgs"><div class="fig"><img src="capitulos/templates/img/apresentador.png" alt="Janela do apresentador: à esquerda a nota do slide 6, &quot;Quatro blocos. Cite cada um em uma frase e diga quanto tempo leva.&quot;; à direita o slide atual em tamanho grande e, abaixo, o próximo em miniatura menor e apagada, com o aviso de que as miniaturas são estáticas; no topo o cronômetro, os botões e a hora." width="1440" height="904"><p class="cap">Janela do apresentador no slide 6 do exemplo.</p></div></div>
{H}Baixar</h3>
<p class="p mono">Versão {VER} · <a href="{escape(hist)}">histórico de versões</a> · <a href="https://github.com/lina-ufc/lina-design-system/releases">versões anteriores</a></p>
<div class="dl">{cards}</div>
<p class="p">Também: fontes (<a href="tipografia.html#s-baixar-tipografia">5.5</a>), ícones além das páginas do exemplo (<a href="icones.html#s-baixar-icones">6.5</a>) e logos para a faixa de parceiros (<a href="logotipo.html#s-combinacoes-de-cores">1.8</a>).</p>'''

open(os.path.join(AQUI, '1-apresentacao.html'), 'w').write(apres + '\n')
print('layouts', len(LAYS))

# 8.2 Documentos A4: só o bloco Baixar (o resto da página é escrito à mão).
TD = 'templates/documento-a4'
VER_D = re.search(r'^## (\d[\d.]*)', open(os.path.join(R, TD, 'CHANGELOG.md'), encoding='utf-8').read(), re.M).group(1)
REL_D = os.environ.get('RELEASE_URL_DOCUMENTOS', '')
DL_D = [('downloads/LINA-Documentos-Word.zip', 'Word · .zip', 'Modelos .dotx e exemplos .docx dos três documentos.'),
        ('downloads/LINA-Documentos-LaTeX.zip', 'LaTeX · .zip', 'Classe lina.cls, três modelos .tex, fontes e logo. Sobe direto no Overleaf.'),
        (f'{TD}/LINA-Relatorio-exemplo.pdf', 'Relatório · .pdf', 'Exemplo de três páginas, para consultar sem abrir um editor.'),
        (f'{TD}/LINA-Artigo-exemplo.pdf', 'Artigo · .pdf', 'Exemplo de três páginas, para consultar sem abrir um editor.'),
        (f'{TD}/LINA-POP-exemplo.pdf', 'POP · .pdf', 'Exemplo de três páginas, para consultar sem abrir um editor.')]
for p, _, _ in DL_D:
    if not os.path.exists(os.path.join(R, p)): sys.exit('falta: ' + p)
href_d = lambda p: REL_D + os.path.basename(p) if REL_D else p
hist_d = REL_D.replace('/download/', '/tag/').rstrip('/') if REL_D else f'{TD}/CHANGELOG.md'
cards_d = ''.join(f'<a href="{escape(href_d(p))}" download><b>{t}</b><span class="p" style="margin:0">{d}</span><span class="mono cap">{os.path.basename(p)} · {tam(p)}</span></a>' for p, t, d in DL_D)
baixar_d = f'''<p class="p mono">Versão {VER_D} · <a href="{escape(hist_d)}">histórico de versões</a> · <a href="https://github.com/lina-ufc/lina-design-system/releases">versões anteriores</a></p>
<div class="dl">{cards_d}</div>
<p class="p">Também: fontes (<a href="tipografia.html#s-baixar-tipografia">5.5</a>) e logos (<a href="logotipo.html#s-combinacoes-de-cores">1.8</a>).</p>'''
f = os.path.join(AQUI, '2-documentos-a4.html')
h = open(f, encoding='utf-8').read(); k = 'Baixar</h3>\n'
open(f, 'w', encoding='utf-8').write(h[:h.index(k) + len(k)] + baixar_d + '\n')
print('documentos', len(DL_D))
