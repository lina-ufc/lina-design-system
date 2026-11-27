# Ferramentas em páginas próprias; filtro com os três padrões e cores por tom

Data: 2026-11-27. Continua o plano 06 (`docs/superpowers/plans/2026-11-26-revisao-site/06-ferramentas.md`).

## Pedido do dono (2026-11-27)

1. O filtro de foto oferece os três padrões do design system: Pontilhado, Dispersão e Campo.
2. Cores do filtro: o usuário escolhe 1, 2 ou 3 cores e define qual cor vai para os tons escuros, qual para os médios e qual para os claros.
3. Cada ferramenta abre numa página própria. O índice principal lista um link para cada uma.

## Respostas do dono

| Pergunta | Resposta |
|---|---|
| Quais três padrões | Pontilhado, Dispersão e Campo, os modos do capítulo Padrões |
| Imagem com uma cor | A cor fica sobre fundo transparente |
| Seções 6.9, 7.1 e 2.10 | Viram uma chamada curta: uma frase e um link para a página da ferramenta |
| Onde ficam os links | Página inicial (bloco "Ferramentas") e menu lateral (grupo "Ferramentas") |

## Desenho

### A. Filtro: padrões

- O seletor de filtro passa a ter Pontilhado (`dither`), Dispersão (`scatter`) e Campo (`field`). O Bitmap sai.
  - Suposição: o Bitmap sai porque o dono escolheu os três padrões no lugar dele. A confirmar.
- No motor (`assets/lina-image.js`), os três modos usam a geração do `lina-texture.js`, com o tom da foto no lugar do ruído:
  - Pontilhado já faz isso. É o modo `dither` atual.
  - Campo: o mesmo limiar por célula do `fieldMode`, aplicado à luminância da foto em vez do ruído suave.
  - Dispersão: o posicionamento do `scatter` com densidade local dada pelo tom (escuro tem mais células, claro tem menos).
- Reusar as funções do `lina-texture.js`, exportadas ou compartilhadas, em vez de copiar código.
- O CLI `ferramentas/imagem.mjs` aceita os três modos. O SVG baixado no site continua idêntico ao gerado pelo comando.

### B. Filtro: cores por tom

- Três faixas de tom, com o corte vindo do motor: escuros, médios e claros.
- Proposta de interface:
  - "Quantidade de cores": 1, 2 ou 3.
  - Um `select` por faixa (Escuros, Médios, Claros). Cada um mostra as cores escolhidas e mais "Transparente".
- Padrões por quantidade de cores:
  - 1 cor: Escuros = cor; Médios e Claros = transparente.
  - 2 cores: Escuros = cor 1; Médios = cor 1; Claros = cor 2 (fundo).
  - 3 cores: Escuros = cor 1; Médios = cor 2; Claros = cor 3 (fundo).
- Contraste: a paleta recusa pares vizinhos que estejam em `AVOID`. O aviso usa o caminho de erro que já existe: o motivo aparece no `.status`, as ações ficam desativadas e a prévia anterior fica.
- O hash e o comando ganham os parâmetros das faixas. Nomes a definir no subplano, ex.: `--tones ferro,ferro,creme` com `none` para transparente.

### C. Páginas próprias

- Três páginas na raiz, geradas pelo `sistema.py` com a mesma moldura do site (menu lateral e cabeçalho):
  - `gerador-de-padroes.html`
  - `filtro-de-pontilhado.html`
  - `editor-de-celulas.html`
- O conteúdo de cada página é o fragmento que já existe, movido de `capitulos/…` para uma pasta própria (ex.: `paginas/ferramentas/`).
- Nas páginas próprias o hash fica só com o estado da ferramenta. Some o conflito com a âncora da seção (`#s-gerador`).
- As seções 6.9, 7.1 e 2.10 ficam com uma frase e um link "Abrir o gerador" (ou equivalente). As âncoras continuam válidas.
- Página inicial: bloco "Ferramentas" com os três links e uma linha para cada.
- Menu lateral: grupo "Ferramentas" com os três links em todas as páginas.
- Recursos 11.3 aponta para as páginas novas.
- `llms.txt` lista as três páginas.

## Fora do escopo

- O gerador de padrões não muda de cores (fundo, forma e destaque continuam).
- Fotos maiores que 1600 px seguem em aberto: o comando reduz a foto ou o site só avisa.

## Checagem

- `node --test` passa, com testes novos para os modos `scatter` e `field` e para as faixas de tom no motor de imagem.
- `python3 sistema.py` passa sem link quebrado.
- No navegador:
  - as três páginas no desktop e no celular;
  - o SVG baixado é idêntico ao gerado pelo comando nos três modos;
  - 1, 2 e 3 cores, inclusive com uma faixa transparente.
- O dono vê os renders antes de concluir.
