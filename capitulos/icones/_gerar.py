# Gera os fragmentos do capítulo 8 com os SVGs Phosphor embutidos (para herdar cor por CSS).
# Uso: python3 capitulos/icones/_gerar.py   (depois: python3 sistema.py)
import os, re

AQUI = os.path.dirname(os.path.abspath(__file__))
PH = os.path.join(AQUI, '..', '..', 'assets', 'icons', 'phosphor')

ICONES = ['chart-line', 'cpu', 'camera', 'database', 'users', 'bell', 'atom', 'cube',
          'map-trifold', 'buildings', 'plant', 'graduation-cap', 'ruler', 'stack', 'lightbulb', 'flask']
PESOS = [
    ('thin', 'Thin', 'Só em tamanho grande (64 px ou mais): capas, aberturas, fundos.'),
    ('light', 'Light', 'Grande e médio, ao lado de texto em Outfit Light.'),
    ('regular', 'Regular', 'O peso padrão: interface, documento, slide.'),
    ('bold', 'Bold', 'Tamanho pequeno (até 20 px) e sobre fundo de cor.'),
    ('fill', 'Fill', 'Estado ativo, ladrilho sólido, marcador.'),
    ('duotone', 'Duotone', 'Destaque e ilustração: traço numa cor, plano em outra.'),
]


def svg(peso, nome):
    s = open(os.path.join(PH, peso, nome + '.svg')).read()
    # o plano do duotone vira classe .dt para receber a segunda cor
    return s.replace(' opacity="0.2"', ' class="dt"').replace('<svg ', '<svg aria-hidden="true" ', 1)


def linha(peso, nomes=ICONES):
    return ''.join(f'<span class="ic" title="{n}">{svg(peso, n)}</span>' for n in nomes)


# traço, plano, fundo, rótulo, nome, texto
DUO = [
    ('--ferro', '--damasco', '--creme', '--umbro', 'Quente', 'ferro · damasco sobre creme. O par padrão.'),
    ('--umbro', '--areia', '--creme', '--umbro', 'Terra', 'umbro · areia sobre creme. Sóbrio, para texto longo.'),
    ('--turquesa-fundo', '--turquesa', '--creme', '--turquesa-fundo', 'Frio', 'turquesa fundo · turquesa sobre creme. Dado, relação, interação.'),
    ('--ferro', '--creme', '--damasco', '--umbro', 'Painel', 'ferro · creme sobre damasco. Chamadas e destaques.'),
    ('--creme', '--ferro-fundo', '--ferro', '--creme', 'Capa', 'creme · ferro fundo sobre ferro. Capas e faixas.'),
    ('--turquesa-tinta', '--creme', '--turquesa', '--turquesa-tinta', 'Dado', 'turquesa tinta · creme sobre turquesa. Gráficos e painéis frios.'),
    ('--areia', '--ferro-fundo', '--umbro', '--areia', 'Noturno', 'areia · ferro fundo sobre umbro. Rodapé, peças escuras.'),
]
EVITAR = [
    ('--ferro', '--turquesa', '--creme', '--umbro', 'Vibra', 'ferro · turquesa: matizes quase complementares de valor parecido; a borda pulsa.'),
    ('--damasco', '--areia', '--creme', '--umbro', 'Some', 'damasco · areia sobre creme: três tons vizinhos, o ícone desaparece.'),
]
SEIS = ['chart-line', 'users', 'atom', 'cube', 'buildings', 'lightbulb']


def cartoes(lista):
    out = ''
    for tr, dt, bg, rot, nome, txt in lista:
        out += (f'<div style="background:var({bg});--tr:var({tr});--dt:var({dt});--rot:var({rot})">'
                f'<div class="icl">{linha("duotone", SEIS)}</div>'
                f'<span class="cap"><b>{nome}</b> · {txt}</span></div>')
    return out


F = {}
F['1-phosphor'] = f'''<h2>Phosphor</h2>
<p class="p">O vocabulário de ícones do LINA é o <a href="https://phosphoricons.com" target="_blank">Phosphor</a>: cerca de 1.500 desenhos em linha, de formas arredondadas e amigáveis, cada um em seis pesos. Licença MIT: uso livre, inclusive comercial, sem crédito obrigatório.</p>
<p class="p">A grade é de 256 unidades, desenhada para 24 px na tela. No peso regular o traço tem 16 unidades (1,5 px a 24 px), mais leve que o texto em Outfit Medium e próximo do Light. Pontas e cantos são redondos, como as células da marca.</p>
<div class="prancha"><div class="fig"><div class="icl">{linha("regular")}</div></div></div>'''

F['2-pesos'] = f'''<h2>Seis pesos</h2>
<p class="regra">Um peso por peça: não misturar regular e bold na mesma página ou slide.</p>
<p class="p">O mesmo desenho em seis espessuras. A exceção é o estado ativo, que passa do regular ao fill.</p>
<div class="prancha pesos-ic">{''.join(f'<div class="fig"><span><b>{n}</b><span class="cap">{t}</span></span><div class="icl">{linha(k)}</div></div>' for k, n, t in PESOS)}</div>
<h3>Medidas</h3>
<p class="p">Quanto menor o ícone, mais pesado o traço, para manter a mesma presença visual.</p>
<div class="prancha"><div class="fig"><div class="tam">{''.join(f'<div><span style="width:{s}px;height:{s}px;display:block">{svg(k, "atom")}</span><span class="dado">{s} px · {k}</span></div>' for s, k in [(16, 'bold'), (20, 'bold'), (24, 'regular'), (32, 'regular'), (48, 'light'), (96, 'thin')])}</div></div></div>'''

F['3-duotone'] = f'''<h2>Duotone em cor</h2>
<p class="regra">As combinações seguem os <a href="cores.html#s-contrastes-a-usar">pares de trabalho</a>: o traço tem o contraste de leitura, o plano é superfície.</p>
<p class="p">O duotone separa o ícone em duas camadas: o traço e um plano por trás dele. No Phosphor o plano é a mesma cor com 20% de opacidade; no LINA ele recebe uma segunda cor da paleta, cheia.</p>
<h3>Faça e não faça</h3>
<div class="faca-nao duo-fn"><div class="faca"><div class="prancha duo">{cartoes(DUO)}</div></div>
<div class="nao"><p class="p">Os mesmos limites dos <a href="cores.html#s-contrastes-a-evitar">contrastes a evitar</a> valem para traço e plano.</p><div class="prancha duo">{cartoes(EVITAR)}</div></div></div>'''

F['4-opacidade-original'] = f'''<h2>Opacidade original</h2>
<p class="regra">Quando houver uma cor só (impressão a um cor, documento em preto), usar o duotone de fábrica: o plano é a cor do traço a 20%.</p>
<div class="prancha"><div class="fig"><div class="icl">{linha("duotone")}</div></div></div>'''

F['5-tratamentos'] = f'''<h2>Tratamentos</h2>
<p class="regra">Num slide ou peça, um tratamento só.</p>
<p class="p">O ladrilho é um quadrado de cantos de ¼ do lado, a regra do logotipo.</p>
<div class="prancha tratos">{''.join(f'<div class="fig"><p class="k">{n}</p><p class="cap">{t}</p><div class="tiles">{"".join(f"<div class={chr(34)}tile {c}{chr(34)}>{svg(p, i)}</div>" for i in ICONES[:8])}</div></div>' for c, p, n, t in [
    ('t-solido', 'regular', 'Sólido', 'Creme sobre ladrilho ferro, peso regular. Ícones de recurso e ferramentas.'),
    ('t-solido', 'fill', 'Sólido cheio', 'Creme sobre ferro, peso fill. Marcadores e estados ativos.'),
    ('t-claro', 'regular', 'Claro', 'Ferro sobre ladrilho damasco. Listas com imagem.'),
    ('t-duo', 'duotone', 'Duotone', 'Ferro e damasco sobre creme. Destaques e aberturas de seção.'),
    ('t-simples', 'regular', 'Simples', 'Ferro, sem ladrilho. Processos, conclusões, texto corrido.'),
])}</div>'''

F['6-arquivos'] = f'''<h2>Arquivos e regras</h2>
<p class="regra">Nenhum emoji. Nenhum outro conjunto de ícones na mesma peça.</p>
<p class="p">Os SVGs ficam em <span class="mono">assets/icons/phosphor/&lt;peso&gt;/&lt;nome&gt;.svg</span>, copiados de <a href="https://phosphoricons.com" target="_blank">phosphoricons.com</a> sem alteração, com a licença MIT ao lado. Ícone novo: baixar o mesmo nome nos seis pesos. Todos usam <span class="mono">fill="currentColor"</span> e herdam a cor do texto.</p>
<p class="p">Para o duotone em duas cores, a camada de 20% (<span class="mono">opacity="0.2"</span>) recebe a segunda cor com opacidade 1. No PowerPoint: inserir o SVG, converter em forma e pintar a camada clara.</p>'''

F['7-baixar-icones'] = '''<h2>Baixar</h2>
<div class="dl"><a href="downloads/LINA-Icones.zip" download><b>Ícones · .zip</b><span class="p" style="margin:0">Os ícones Phosphor usados pelo LINA nos seis pesos, em SVG, com a licença MIT.</span><span class="mono cap">LINA-Icones.zip · 66 kB</span></a></div>'''

for nome, html in F.items():
    open(os.path.join(AQUI, nome + '.html'), 'w').write(html + '\n')
print('fragmentos:', ', '.join(F))
