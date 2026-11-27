# Revisão do site do sistema: diagnóstico e propostas

Data: 2026-11-26. Estado: opções escolhidas (abaixo). Plano em
`docs/superpowers/plans/2026-11-26-revisao-site/`.

## Decisões (2026-11-26)

- **Organização: A1**, quatro partes (Princípios, Fundamentos, Aplicações, Ferramentas e
  recursos).
- **Visual: B1**, manual de construção. Protótipo da página Logotipo antes de aplicar.
- **Ferramentas: C1**, cada ferramenta dentro do fundamento que ela serve. Parâmetros pedidos
  pelo usuário: cores escolhidas só da paleta do sistema, tamanho do canvas, quantidade de
  cores, variação de distribuição (modo, semente, vazio, aglomeração etc.); salvar em SVG.
- **Gerador de logo** = o editor de células do `lina-visual-code` (`grid.html`), que abre com
  o letreiro LINA na grade e deixa mover as células. Vai para o capítulo Logotipo.
- **Agentes: D1** (fonte única de tokens + `SKILL.md` como índice + `llms.txt`). Escolha
  minha por padrão; o usuário não foi perguntado.

Chamadas minhas, a conferir (vindas da revisão do spec):
- Fundo neutro do site = branco, o mesmo dos slides de conteúdo. Nenhuma cor nova na paleta;
  creme, areia e nata continuam tokens, mas deixam de ser o fundo da interface.
- Escopo visual só no site. Templates (potx, A4) e downloads não mudam.
- O contrato dos motores (nomes de parâmetros, unidades) é definido no subplano dos motores e
  é o mesmo para página, linha de comando e estado na URL.
- Editor de células continua livre: a regra (cantos de ¼, côncavo/convexo) é aplicada pelo
  traçador, não bloqueada. Exporta SVG. A checagem de regra vale para as texturas não
  pontilhadas.
- Os motores não usam fonte; a interface das ferramentas passa de Neometric para Outfit.
- Renumeração: os nomes de arquivo antigos (`1-logotipo.html` etc.) viram páginas de
  redirecionamento, para não quebrar links já publicados.
- Conteúdo novo de fundamentos (proteção e tamanho mínimo do logo, grid, voz) entra como
  rascunho marcado como proposta, para o usuário decidir os valores; não trava o resto.
- Motores, fonte única e protótipo visual podem andar em paralelo; reestruturação espera o
  protótipo aprovado.

Base: leitura do site publicado (lina-ufc.github.io/lina-design-system), de `sistema.json`,
`sistema.py`, `site.css`, `SKILL.md`, `README.md`, dos fragmentos em `capitulos/` e do
repositório `lina-visual-code`. Referências externas na seção 5.

Suposição: o "lina-design-code" citado no pedido é o repositório `lina-ufc/lina-visual-code`
(Células, Texturas, Imagens). Não existe outro com esse nome localmente nem no GitHub.

---

## 1. Diagnóstico do design

### O que funciona

- A regra de construção é rigorosa e os diagramas saem do próprio código (`lina-geometry.js`).
  Isso é raro e é o maior ativo do site.
- O molde do capítulo 7 (Regra / Não fazer / Como pedir) é o melhor modelo de seção do site:
  normativo, verificável e já pensado para pessoa e agente.
- O estudo de contraste WCAG (2.4–2.6) e o "Citado em" (rede de referências entre seções)
  dão ao documento uma qualidade de manual técnico.

### Por que parece genérico

**D1. Uma só temperatura de superfície.** Fundo creme `#FAF5C6`, barra lateral nata,
painéis areia. Tudo amarelo-quente, sem plano neutro. O creme é uma das cores da paleta, então
os exemplos ficam sobre uma das cores que deveriam estar sendo demonstradas, e o leitor não vê
como a marca se comporta em branco ou em escuro, onde ela vai ser usada.

**D2. Ferro em todo lugar.** Número da seção, título, fio sob o título, links e "Citado em"
estão todos em ferro. O vermelho, que na marca é o acento, vira textura de fundo. Nada se
destaca porque tudo se destaca.

**D3. O molde de seção repetido sem variação.** Toda seção é `número mono pequeno + título
grande em ferro + fio + parágrafo de 62ch`. É o padrão de qualquer gerador de documentação.
Não há momento de escala: nenhuma prancha inteira, nenhum logo grande, nenhum padrão sangrando.

**D4. Cartões arredondados em fileira.** Os três cartões areia do Preâmbulo e a grade de
cartões do mapa da home são exatamente o sinal mais citado de interface feita por IA (fileira
de cards iguais, mesmo raio, mesmo fundo). O raio desses cartões nem segue a regra de ¼ de
célula da marca.

**D5. A marca não estrutura a página.** A identidade é uma regra de grade (célula, meia
célula, cantos de ¼), mas o layout do site é uma coluna genérica com barra lateral de 260 px.
Os manuais que têm caráter (NASA 1975, MIT Media Lab 2014) fazem o grid da marca virar o grid
da página. Aqui o pontilhado, o ativo visual mais forte, aparece só como ilustração pequena.

**D6. Texto leve e estreito, exemplos pequenos.** Corpo em Outfit 300 a 16 px numa coluna de
62ch dentro de um `main` de até 1240 px: sobra metade da tela à direita. Exemplos de logo com
cerca de 80 px de altura. Leitura cansativa e exemplos que não mostram detalhe.

**D7. A home abre pela teoria.** A primeira coisa que se lê é Bertalanffy, Uyemov e uma
fórmula. Quem chega para baixar o logo ou montar um pôster não sabe em dois segundos o que é o
site nem por onde começar. O conceito é bom, mas é capítulo, não porta de entrada.

---

## 2. Diagnóstico da organização

**O1. Catálogo de elementos, sem caminho de uso.** Os capítulos 1–8 listam o que a marca tem
(logo, cor, padrão, animação, tipo, ícone, componente, template). Falta o eixo "quero fazer X":
pôster, post, crachá, assinatura de e-mail, capa de relatório. 8.3 (pôster e banner) e 8.4
(redes sociais) estão vazios. O sistema descreve peças, mas não guia a elaboração de uma peça.

**O2. Três níveis no mesmo eixo.** Fundamentos de marca (1–6), peças de conteúdo dos templates
(7, componentes de slide e A4) e entregáveis (8) estão numerados como irmãos. Animação (4) tem
duas seções e é, na prática, um modo dos padrões.

**O3. Fundamentos que faltam.** Uso do logo (área de proteção, tamanho mínimo; a margem de ½
célula existe só na memória), grid e espaçamento (`tokens/spacing.css` existe e não tem página),
imagem e fotografia (onde o filtro de imagens entraria), voz e texto, acessibilidade como regra
transversal.

**O4. Três fontes de verdade.** Valores hex em `README.md`, `tokens/colors.css` e nas seções
2.1/2.7. Pares de contraste no README, em 1.8 e em 2.4–2.6. O `SKILL.md` aponta logo, ícones e
geometria, mas não cita tokens, componentes (7) nem templates (8): o agente enxerga metade do
sistema.

**O5. Moldes de seção diferentes por capítulo.** 1–6 livres, 7 com Regra/Não fazer/Como
pedir, 8 com Estrutura/Exemplo/Uso/Baixar. "Não fazer", "Não recomendáveis" e "a evitar" para
a mesma ideia.

**O6. Downloads espalhados.** Seis seções com links de download, versão da release cravada no
HTML (`marca-v1.1.0`).

**O7. Ferramentas fora e desatualizadas.** Nenhuma ferramenta interativa no site. No
`lina-visual-code` os motores estão bons (rodam em node sem DOM, ~40 kB, sem dependências),
mas as paletas internas usam carmim `#9B0A0E` e vinho, a fonte é Neometric, e o mapeamento
da interface para o motor (`engineOptions`, divisões por 100) mora dentro do HTML. Um agente não
consegue reproduzir uma textura sem copiar a página. Não existe gerador de logo por regra: só
`LinaGeometry.wordmark()` (o logotipo fixo) e o editor de células (`grid.html`).

---

## 3. Propostas

Cada bloco tem opções. A recomendação vem primeiro.

### A. Organização

Vale para qualquer opção: **um molde único de seção** — Regra (uma frase normativa), Por quê,
Medidas, Faça / Não faça lado a lado, Como pedir (agente, Slide, Word, LaTeX). É o molde do
capítulo 7 estendido ao resto.

- **A1. Quatro partes (recomendada).**
  I. Princípios: o conceito do Preâmbulo condensado em três ou quatro princípios operáveis
  ("toda forma é união de células", "o acento é raro", ...).
  II. Fundamentos: logotipo (com uso: proteção, mínimo, fundos), cor, tipografia, grid e
  espaço, padrões (com animação dentro), imagem, ícones.
  III. Aplicações: componentes, templates e peças (pôster, redes, assinatura), cada peça com
  "por onde começar".
  IV. Ferramentas e recursos: geradores, downloads num só lugar, tokens, changelog, guia para
  agentes.
  Custo: médio. Renumera capítulos e muda `sistema.json`; os fragmentos são reaproveitados.
- **A2. Capítulos atuais + lacunas.** Mantém 0–8, acrescenta uso do logo, grid, imagem e voz
  nas partes existentes, cria cap. 9 Ferramentas e uma página Downloads. Custo: baixo. Não
  resolve O1 nem O2.
- **A3. Duas áreas separadas** (como Aalto e Wise): Marca (manual) e Kit (templates,
  ferramentas, downloads). Custo: alto, duas navegações para manter.

### B. Design visual

Qualquer opção começa com um protótipo de uma página (Logotipo) renderizado para você aprovar
antes de aplicar no resto.

- **B1. Manual de construção (recomendada).** O grid da marca vira o grid da página: módulo
  de célula visível nas margens e no fundo das pranchas, cantos de ¼ de célula como única
  curvatura, sem cartões. Fundo neutro claro; creme, areia e ferro aparecem só como cores de
  marca em pranchas. Ferro só em rótulo e acento. Números de seção grandes e em mono, à maneira
  do manual da NASA. Exemplos em pranchas de largura total, logo em escala grande. Corpo em
  Outfit 400.
- **B2. Ajuste fino.** Mantém a estrutura atual e corrige os sintomas: fundo neutro, ferro
  só em acento, sem cartões arredondados, corpo 400, exemplos maiores, coluna mais larga.
  Mais barato, mas o caráter continua sendo o de um gerador de documentação.
- **B3. Editorial / pôster.** Cada capítulo abre com uma prancha pontilhada de página inteira
  gerada pelo gerador de padrões, títulos em escala display. O mais expressivo; risco de
  cansar na consulta diária e de pesar no celular.

### C. Ferramentas (geradores)

Vale para qualquer opção:
- Os motores passam a viver neste repositório, em `assets/` ao lado do `lina-geometry.js`
  (que já é idêntico byte a byte): `lina-texture.js`, `lina-image.js`. O `lina-sample.js`
  (190 kB, foto de exemplo) não vem.
- Paletas dos motores trocadas pela paleta atual (lidas dos tokens, não copiadas).
- O mapeamento interface → motor sai do HTML e vira função do motor, para que a página e o
  agente chamem a mesma coisa.
- Um script de linha de comando por motor (`node ferramentas/textura.mjs --modo campo
  --semente 7 --formato 4:5 > saida.svg`), com uma checagem que falha se a regra da célula
  for violada. PNG por `resvg` (única dependência nova, só para rasterizar).
- `SKILL.md` documenta os comandos. O `lina-visual-code` é arquivado com link para cá.

Onde as ferramentas aparecem no site:
- **C1. Cada ferramenta dentro do fundamento que ela serve (recomendada).** Gerador de padrões
  no capítulo Padrões, filtro em Imagem, gerador de logo em Logotipo; a parte IV lista as três
  com link. A regra e a ferramenta ficam lado a lado.
- **C2. Página de ferramentas separada.** As três como páginas próprias na parte IV, com links
  a partir dos fundamentos. Mais simples de manter; a regra fica longe da ferramenta.
- **C3. Só para agentes.** Motores e linha de comando no repositório, sem interface no site.
  Mínimo, mas pessoas da equipe perdem as ferramentas.

### D. Para agentes

- **D1. Fonte única + índice (recomendada).** Tokens em JSON no formato W3C DTCG gerados a
  partir de `tokens/*.css` (ou o contrário), `README.md` deixa de repetir valores e aponta,
  `SKILL.md` vira índice completo (fundamentos, componentes, templates, ferramentas, comandos),
  `llms.txt` na raiz do site.
- **D2. Só o `SKILL.md` reescrito.** Sem JSON de tokens nem `llms.txt`.

---

## 4. Plano de implementação (esboço, a detalhar depois das escolhas)

Formato de `CLAUDE.md` §9: pasta `docs/superpowers/plans/2026-11-26-revisao-site/` com
`progress.md` e um subplano por vez.

1. **Motores** — trazer `lina-texture.js` e `lina-image.js`, paleta dos tokens, extrair o
   mapeamento, scripts de linha de comando e checagem da regra. Verificar: textura e imagem
   geradas em node batem com as da página; checagem passa. Independe de A e B.
2. **Fonte única** — tokens e `README.md`/`SKILL.md` (opção D). Verificar: nenhum hex
   duplicado fora dos tokens.
3. **Protótipo visual** — página Logotipo na opção B escolhida, render em desktop e celular.
   Verificar: aprovação sua.
4. **Estrutura** — nova organização (opção A) em `sistema.json`, molde único de seção,
   renumeração. Verificar: `sistema.py` sem link quebrado.
5. **Aplicar o visual** a todas as páginas. Verificar: render de cada capítulo, revisão de
   acessibilidade.
6. **Ferramentas no site** (opção C) com as interfaces portadas do `lina-visual-code`.
   Verificar: desktop e celular, estado na URL funcionando.
7. **Lacunas de conteúdo** — uso do logo, grid e espaço, imagem, voz. Texto seu para revisar.
8. **Arquivar** o `lina-visual-code` com link para cá.

---

## 5. Referências

Manuais e identidades:
- NASA Graphics Standards Manual (Danne & Blackburn, 1975): grid e numeração como identidade,
  uma regra verificável por página.
- MIT Media Lab (Pentagram, 2014): um mecanismo de grade gera glifos para todos os grupos.
- Cooper Hewitt (Pentagram, 2014) e Whitney (Experimental Jetset, 2013): o tipo da marca como
  protagonista.
- Casa da Música (Sagmeister & Walsh, 2007): ferramenta que extrai cores de imagens, o caso
  mais próximo dos geradores do LINA.
- TU Delft brandbook: marca, arquitetura de marca, mídia, toolkit por faculdade.
- Aalto e Wise: marca e sistema de produto como áreas separadas.
- Nenhuma identidade institucional pesquisada oferece gerador público online. Seria diferencial
  do LINA, não convenção.

Método:
- Nathan Curtis / EightShapes, "Documenting Components": exemplos em contexto, faça/não faça
  em contraste.
- Brad Frost, Atomic Design: as páginas (aplicações) são onde o sistema é testado.
- Alla Kholmatova, Design Systems: padrões perceptivos (tom visual) separados dos funcionais.
- Figma, Design Systems 103: abrir pelos princípios e documentar o porquê.
- Estrutura que as fontes compartilham: princípios, fundamentos, componentes, aplicações,
  recursos, changelog.

Agentes:
- DESIGN.md (Google Labs, alfa): tokens em YAML + seções fixas + linter.
- W3C Design Tokens (DTCG), versão estável 2025.10.
- llms.txt: índice em markdown na raiz do site.
- Registro shadcn + MCP: componentes como código instaláveis por agente.

Sinais de estética genérica: 925studios.co, "AI slop design tells"; lista anti-slop do
ux-skill. Coincidem em fileira de cards iguais, mesmo raio em tudo, fonte sem decisão, ícone e
copy genéricos.
