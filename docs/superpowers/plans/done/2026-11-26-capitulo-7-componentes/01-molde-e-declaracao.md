# Plano 01 — molde e 7.1 Declaração

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Abrir o capítulo 7 com a seção 7.1 Declaração no molde que as outras oito seções vão repetir, e obter a aprovação do usuário sobre esse molde.

**Architecture:** Seção como fragmento HTML em `capitulos/7-componentes/`, registrada em `sistema.json`, montada por `python3 sistema.py`. Imagens são recortes PNG dos PDFs de exemplo já publicados, feitos por um script que as próximas seções reaproveitam.

**Tech Stack:** HTML/CSS do site (`site.css`), `sistema.py`, `pdftoppm` (poppler), `magick` (ImageMagick).

**Spec:** [`../../../specs/done/2026-11-26-capitulo-7-componentes-design.md`](../../../specs/done/2026-11-26-capitulo-7-componentes-design.md)

## Global Constraints

- Regras da marca em `SKILL.md` e `README.md` vencem; etiqueta e rótulo de dado ficam em 11 px.
- Texto sem frases de oposição ("não é X, é Y"), sem travessões; revisar com a skill `humanizer`.
- Nunca redesenhar uma peça à mão: imagem vem do PDF gerado.
- Não alterar `templates/**` (geradores, estilos, exemplos).
- Imagem nunca distorcida: `width`/`height` do `<img>` iguais ao tamanho do PNG.
- Celular (375 px): nenhum elemento da seção corta conteúdo na horizontal.
- Português em tudo; caveman e ponytail valem para o agente, não para o texto do site.

## Review Focus

- PDF de exemplo regenerado com outra paginação: o script deve falhar alto (página sem o texto esperado), não recortar a peça errada. Tarefa 1, passo 2.
- Imagem larga demais no celular: precisa encolher (`width:100%;height:auto`), sem rolagem lateral. Tarefa 3, passo 3.
- Nome em "como pedir" que não existe no código: o agente usaria um estilo inexistente. Tarefa 3, passo 2.
- Leitor de tela: `alt` descreve a peça e o que se vê nela, não "imagem". Tarefa 2, passo 1.
- Regra no texto que contradiz o gerador (cor, medida, quantidade). Tarefa 3, passo 2.

---

### Tarefa 1: script de recortes e imagens da 7.1

**Files:**
- Create: `capitulos/7-componentes/_recortes.sh`
- Create: `capitulos/7-componentes/img/declaracao-slide.png`, `capitulos/7-componentes/img/declaracao-a4.png`

**Interfaces:**
- Produces: `sh capitulos/7-componentes/_recortes.sh` regenera todos os recortes do capítulo. Dentro dele, a função
  `recorta <pdf> <pagina> <texto-esperado> <x> <y> <w> <h> <saida>`: rasteriza a página a 144 dpi
  (slide 1920 px de largura, A4 ~1191 px), confere com `pdftotext` que `<texto-esperado>` está na página
  (sai com erro se não), recorta `<w>x<h>+<x>+<y>` e grava `capitulos/7-componentes/img/<saida>.png`.
  Planos 02 e 03 só acrescentam linhas `recorta ...`.

- [ ] **Passo 1: escrever o script** com a função acima e duas chamadas:
  - slide: `templates/apresentacao/LINA-Apresentacao-exemplo.pdf`, página 25, texto `Declaração-chave`,
    recorte cobrindo os quatro blocos (padrão, A, B, C) com as legendas, sem cabeçalho do slide → `declaracao-slide`.
  - A4: `templates/documento-a4/LINA-POP-exemplo.pdf`, página 1, texto `Atenção`, recorte da caixa
    Atenção com ~24 px de folga em volta → `declaracao-a4`.
  Coordenadas: medir na página rasterizada.

- [ ] **Passo 2: testar a falha** trocando a página do slide para 24:
  Run: `sh capitulos/7-componentes/_recortes.sh`
  Expected: sai com código ≠ 0 e mensagem citando `Declaração-chave` e a página 24. Voltar para 25.

- [ ] **Passo 3: rodar e olhar**
  Run: `sh capitulos/7-componentes/_recortes.sh && file capitulos/7-componentes/img/*.png`
  Expected: dois PNG; abrir cada um e conferir que a peça inteira está no recorte, sem corte de texto.

### Tarefa 2: fragmento 7.1 e registro no `sistema.json`

**Files:**
- Create: `capitulos/7-componentes/1-declaracao.html`
- Modify: `sistema.json` (capítulo 7 `desc`; nova entrada)

**Interfaces:**
- Consumes: PNGs da Tarefa 1.
- Produces: o molde. Marcação que as próximas seções copiam, na ordem:
  `<h2>` nome · `<p class="lead">` para quê · grade de duas colunas `minmax(0,1fr)` com um `<figure class="fig">`
  por formato (`<img>` + `<figcaption class="cap">` "Slide" / "Documento A4") · `<h3>Regra</h3>` + `<ul class="regras">`
  · `<h3>Não fazer</h3>` + `<ul class="regras">` · `<h3>Como pedir</h3>` + `<dl class="spec">` com `dt` Slide,
  Word, LaTeX e `dd` com nomes em `<code class="mono">`. A grade vira uma coluna abaixo de 600 px.

- [ ] **Passo 1: escrever o fragmento** com este conteúdo (valores lidos do código; texto final passa pelo `humanizer`):
  - Para quê: destacar a frase que o público deve guardar (slide) ou um aviso de risco (POP). Mesma peça, dois usos.
  - Regra:
    - rótulo curto em cima ou à frente, texto em destaque; slide: rótulo mono em caixa alta, frase em Medium;
      A4: rótulo "Atenção." em ferro, negrito, na mesma linha do texto.
    - slide padrão: fio ferro de 3 px acima do rótulo, sem fundo.
    - slide preenchido, cantos de ¼: A turquesa fundo com texto creme e rótulo damasco; B damasco com texto
      umbro e rótulo ferro; C turquesa com texto e rótulo umbro.
    - A4: caixa nata, cantos de 11 px, margem interna 16 × 20 px, 28 px acima.
    - uma por página no A4 (regra do exemplo POP); uma por slide (proposta, marcar para o usuário aprovar).
  - Não fazer: painel ferro (o vermelho fica para títulos e rótulos); duas declarações no mesmo slide ou página.
  - Como pedir:
    - Slide: copiar do slide 25 do exemplo para um slide com layout "2.6 Só título"; agente:
      `comp.declaracao(sl, [x, y, w, h], { rotulo, texto, cor })`, `cor` vazio, `'A'`, `'B'` ou `'C'`.
    - Word: tabela no estilo `LINA Atenção`, parágrafo `LINA Atenção Texto`, rótulo com o estilo de caractere `LINA Atenção Rótulo`.
    - LaTeX: `\begin{atencao} \rotuloatencao{Atenção.} texto \end{atencao}`.
  - `alt` de cada imagem descrevendo o que se vê (ex.: "Quatro declarações-chave no slide: padrão com fio
    ferro e as variantes preenchidas A turquesa fundo, B damasco e C turquesa").

- [ ] **Passo 2: CSS do molde**, só se as classes existentes não bastarem: uma regra em `site.css` para a
  grade de duas colunas e a quebra em 600 px. Nada além.

- [ ] **Passo 3: registrar no `sistema.json`**
  - capítulo 7 `desc`: `"Peças de conteúdo para slides e documentos: declaração, tabela, legenda, número, passos, nota, cabeçalho e rodapé, cartão e tile."`
  - entrada nova antes da primeira do capítulo 8: `{"cap": "7", "nome": "7.1 Declaração", "sub": "Frase a guardar no slide, aviso no documento", "secao": "capitulos/7-componentes/1-declaracao.html"}`

- [ ] **Passo 4: gerar**
  Run: `python3 sistema.py`
  Expected: `9 capítulos (...); 40 entradas; ... links entre seções`, sem linha de link quebrado.

### Tarefa 3: verificação e aprovação do molde

**Files:** nenhum novo; registro em `records/01-molde-e-declaracao-ledger.md`.

- [ ] **Passo 1: humanizer** no texto da seção (modo arquivo, só prosa); reler sem travessão nem "não é X, é Y".

- [ ] **Passo 2: nomes contra o código**
  Run: `grep -c "declaracao(sl" templates/apresentacao/potx/build.js; grep -c "'LINA Atenção'\|'LINA Atenção Texto'\|'LINA Atenção Rótulo'" templates/documento-a4/word/build.js; grep -c "newenvironment{atencao}\|newcommand\\\\rotuloatencao" templates/documento-a4/latex/lina.cls`
  Expected: cada contagem ≥ 1. Conferir também cores de `DECL` (`build.js:104`) contra a regra escrita.

- [ ] **Passo 3: navegador** (`preview_start` "site"): `7-componentes.html` em desktop e a 375 px.
  Expected: sumário sem "em breve" no 7; imagens inteiras; nenhum elemento com `scrollWidth > clientWidth`
  e `overflow-x:hidden` na seção; nenhum `<img>` com proporção diferente do PNG.

- [ ] **Passo 4: mostrar ao usuário** captura desktop e celular da 7.1. Perguntar se o molde vale para as
  outras oito e se a regra "uma por slide" fica. Registrar a resposta no ledger e no `progress.md`.
  Plano 02 só é escrito depois dessa resposta.
