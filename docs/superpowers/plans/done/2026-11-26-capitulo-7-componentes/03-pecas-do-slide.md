# Plano 03 — peças do slide (7.4, 7.8, 7.9)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Escrever as três seções do capítulo 7 que só existem no slide, no molde aprovado, e fechar o capítulo.

**Architecture:** Igual aos planos 01 e 02. Cada seção é um fragmento `capitulos/7-componentes/N-<slug>.html` com a
estrutura de `1-declaracao.html`, uma figura só (Slide), recortes acrescentados a `_recortes.sh` e uma entrada em
`sistema.json`. Uma tarefa por seção; a última verifica o capítulo inteiro e mostra ao usuário.

**Tech Stack:** HTML do site, `sistema.py`, `_recortes.sh` (`pdftoppm`, `pdftotext`, `magick`).

**Spec:** [`../../../specs/done/2026-11-26-capitulo-7-componentes-design.md`](../../../specs/done/2026-11-26-capitulo-7-componentes-design.md)

## Global Constraints

- Molde aprovado (2026-11-26): estrutura de `capitulos/7-componentes/1-declaracao.html` sem mudar a ordem:
  `<h2>` · `<p class="lead">` · `<div style="display:grid;gap:24px;margin:0 0 14px">` com um
  `<figure class="fig" style="margin:0">` (aqui só Slide) · `<h3>Regra</h3>` · `<h3>Não fazer</h3>` ·
  `<h3>Como pedir</h3>` com `<dl class="spec">` (`dt` Slide, Word, LaTeX).
- `<img>`: `width`/`height` iguais ao PNG; `style="display:block;width:100%;max-width:<metade da largura do PNG>px;height:auto"`.
- `dd` Word e `dd` LaTeX: "Ainda não existe." (spec, tabela das peças).
- Regra vem do código (`templates/apresentacao/potx/build.js`), nunca do texto de exemplo dentro do PDF
  (`memoria/texto-de-exemplo-nao-e-regra.md`). Sem regra de quantidade ou finalidade que o código não imponha.
  Nos planos 01 e 02 isso escapou quatro vezes (legenda da tabela, "uma ação por passo", lead da nota, caixa alta).
- Toda afirmação visual confere com o recorte.
- Unidades: px na referência 1920 × 1080. `X(n)`, formas e caixas recebem px; `P(n)` converte px em pt de fonte;
  `rule(x, y, w, cor, largura)` (`build.js:88`) recebe a **largura do fio em pt** (2 pt = 4 px).
- Regras da marca em `SKILL.md` e `README.md` vencem. Sem travessões, sem "não é X, é Y", nem no `alt`;
  prosa revisada com a skill `humanizer`.
- Não alterar `templates/**` nem `site.css`.
- `_recortes.sh` gera PNG determinístico: rodar o script inteiro não pode mudar nenhum PNG já commitado
  (conferir com `git status capitulos/7-componentes/img`).
- Enquadramento justo, sem vão branco grande (lição da 7.2).
- Celular (375 px): nada corta na horizontal; nenhuma imagem com proporção diferente do PNG.

## Review Focus

- Regra tirada do texto de exemplo do slide 26 ("Altura pelo conteúdo, não fixa.", "Sem ícone: o título sobe.")
  em vez do código: só vale se `cartao()` fizer isso. A altura é o `h` passado; conferir antes de escrever.
- Cor do ícone no tile: `tileIcone` escolhe o PNG creme para ferro, turquesa fundo e umbro, e ferro para
  damasco (`build.js:128-130`). Afirmar a combinação errada é o erro mais provável da 7.9.
- Seta do 7.4 com duas fontes: `numeroSeta` desenha a seta em texto Light umbro; o layout
  "5.3 Números-chave · antes e depois" usa `gen/seta-ferro.png`. Não misturar as duas na mesma regra.
- `Nota N` do 5.3 é texto de apoio, assunto da 7.6; não chamar de peça.
- Seções 7.4, 7.8, 7.9 entram entre as já existentes: a ordem em `sistema.json` segue a numeração.

---

### Tarefa 1: 7.4 Número em destaque

**Files:**
- Modify: `capitulos/7-componentes/_recortes.sh` (uma linha `recorta`)
- Create: `capitulos/7-componentes/4-numero-em-destaque.html`, `img/numero-slide.png`
- Modify: `sistema.json` (entrada entre 7.3 e 7.5)

- [ ] **Passo 1: recorte.** `LINA-Apresentacao-exemplo.pdf` p. 52, texto `Em números` (layout "5.3 Números-chave",
  três números). Do fio ferro de cima até o fim das notas, sem o cabeçalho do slide. Olhar o PNG.
- [ ] **Passo 2: fragmento.** Valores a conferir no código:
  - Layout "5.3 Números-chave" (`build.js:479-484`): 2 a 4 números em colunas iguais; fio ferro de 3 pt acima;
    número em Outfit Bold ferro, 140 px até 3 números e 110 px com 4; rótulo em `S.sub`; nota em Light 24 px.
  - Layout "5.3 Números-chave · antes e depois" (`:486-491`): dois números de 5 colunas e a seta ferro (PNG) no meio.
  - `comp.numeroSeta(sl, [x, y, w, h], antes, depois, unidade)` (`:135`): Bold 96 px ferro, seta " → " em Light umbro,
    unidade em `S.cap` embaixo.
  - Regra comum: número grande em ferro, Bold; o que ele mede vem logo abaixo, menor.
- [ ] **Passo 3:** entrada `{"cap": "7", "nome": "7.4 Número em destaque", "sub": "Número grande em ferro, o que mede abaixo", "secao": "capitulos/7-componentes/4-numero-em-destaque.html"}`
  logo depois da 7.3; `python3 sistema.py` sem link quebrado.

### Tarefa 2: 7.8 Cartão

**Files:** `_recortes.sh`; create `8-cartao.html`, `img/cartao-slide.png`; `sistema.json` (depois da 7.7).

- [ ] **Passo 1: recorte.** p. 26, texto `Cartão com ícone`, os dois cartões (com e sem ícone) lado a lado.
- [ ] **Passo 2: fragmento.** Valores: `comp.cartao(sl, [x, y, w, h], { titulo, texto, icone })` (`build.js:119-125`):
  fundo nata com cantos de 22 px (`R`, `build.js:25`, ¼ de célula); margem interna de 32 px; com `icone`,
  tile damasco de 64 px no canto e o título desce para 120 px; título em `S.sub`, texto em Light 26 px.
- [ ] **Passo 3:** entrada `7.8 Cartão`, sub `Fundo nata, título e texto curto`; `python3 sistema.py`.

### Tarefa 3: 7.9 Tile de ícone

**Files:** `_recortes.sh`; create `9-tile-de-icone.html`, `img/tile-slide.png`; `sistema.json` (depois da 7.8).

- [ ] **Passo 1: recorte.** p. 26, texto `Componentes`, os três tiles de ícone (ferro, turquesa fundo, umbro).
  Incluir o tile damasco do cartão se couber num recorte justo; senão, só os três.
- [ ] **Passo 2: fragmento.** Valores: `comp.tileIcone(sl, x, y, s, icone, cor)` (`build.js:128-134`): quadrado de lado
  `s` com cantos de ¼ do lado; ícone ocupa 56% do lado, centrado; cor padrão damasco com ícone ferro; ferro,
  turquesa fundo e umbro levam ícone creme. Só ícones da lista `ICONS` (erro se faltar o PNG). Nos layouts o tile vem
  de outro helper: "2.3 Lista · ícones" usa `tile()` damasco de 72 px com um campo de imagem "Ícone" de 40 px dentro
  (`build.js:324`), onde a pessoa cola o ícone. Dizer isso no `dd` Slide. Apontar a 7.5 para o tile numerado.
- [ ] **Passo 3:** entrada `7.9 Tile de ícone`, sub `Ícone Phosphor em quadrado de cantos ¼`; `python3 sistema.py`.

### Tarefa 4: verificação do capítulo e aprovação

**Files:** nenhum novo; capturas em `records/03-*.jpg`.

- [ ] **Passo 1: nomes contra o código.** Cada `<code class="mono">` das três seções existe em `build.js`.
- [ ] **Passo 2: script inteiro.** `sh capitulos/7-componentes/_recortes.sh` sem erro; `git status` mostra só os 3 PNG novos.
- [ ] **Passo 3: capítulo completo.** `sistema.json` com 7.1 a 7.9 em ordem; `python3 sistema.py` sem link quebrado e
  sem "em breve" no capítulo 7.
- [ ] **Passo 4: navegador** (servidor em 8771): `7-componentes.html` em 1440 px e 375 px. Nenhum elemento com
  `scrollWidth > clientWidth`; proporção de cada `<img>` igual à do PNG (tolerância 1 px).
- [ ] **Passo 5: mostrar ao usuário** capturas das três seções e pedir aprovação; registrar no `progress.md`.
  Aprovado, o conjunto de planos vai para `done/`.
