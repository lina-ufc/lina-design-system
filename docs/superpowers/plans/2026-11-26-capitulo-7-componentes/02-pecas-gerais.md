# Plano 02 — peças gerais (7.2, 7.3, 7.5, 7.6, 7.7)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Escrever as cinco seções do capítulo 7 que existem no A4 (e quase todas no slide), no molde aprovado da 7.1.

**Architecture:** Igual ao plano 01. Cada seção é um fragmento `capitulos/7-componentes/N-<slug>.html` que copia a estrutura de `1-declaracao.html`, com recortes acrescentados a `_recortes.sh` e uma entrada em `sistema.json`. Uma tarefa por seção; a última verifica tudo e mostra ao usuário.

**Tech Stack:** HTML do site, `sistema.py`, `_recortes.sh` (`pdftoppm`, `pdftotext`, `magick`).

**Spec:** [`../../specs/2026-11-26-capitulo-7-componentes-design.md`](../../specs/2026-11-26-capitulo-7-componentes-design.md)

## Global Constraints

- Molde aprovado (2026-11-26): copiar a estrutura de `capitulos/7-componentes/1-declaracao.html` sem mudar a ordem:
  `<h2>` · `<p class="lead">` · `<div style="display:grid;gap:24px;margin:0 0 14px">` com um
  `<figure class="fig" style="margin:0">` por formato (slide primeiro) · `<h3>Regra</h3>` · `<h3>Não fazer</h3>` ·
  `<h3>Como pedir</h3>` com `<dl class="spec">` (`dt` Slide, Word, LaTeX).
- `<img>`: `width`/`height` iguais ao PNG; `style="display:block;width:100%;max-width:<metade da largura do PNG>px;height:auto"`.
- Regra vem do gerador (`build.js`, estilos do Word, `lina.cls`), nunca do texto de exemplo dentro dos PDFs
  (`memoria/texto-de-exemplo-nao-e-regra.md`). Sem regra de quantidade que o código não imponha.
- Toda afirmação visual da regra confere com o recorte (lição da 7.1: "caixa alta" que o gerador não faz).
- Peça ausente num formato: o `dd` desse formato diz "Ainda não existe." e a seção mostra uma figura só.
- Imagem do A4: os PDFs publicados em `templates/documento-a4/` são os do LaTeX (não há PDF do Word). Usar esses, como na 7.1.
- Regras da marca em `SKILL.md` e `README.md` vencem. Sem travessões, sem "não é X, é Y"; prosa revisada com a skill `humanizer`.
- Não alterar `templates/**` nem `site.css`.
- Celular (375 px): nada corta na horizontal; nenhuma imagem com proporção diferente do PNG.
- Medidas: px no slide (referência 1920 × 1080), px ou pt no A4 como o código as escreve.

## Review Focus

- Recorte de página inteira (7.7) a 144 dpi pesa demais: PNG acima de ~400 KB deve ser reduzido com `magick -resize 50%` na própria função ou numa chamada à parte. Tarefa 5, passo 1.
- Nome de estilo do Word escrito com o `id` (`LINATabela`) em vez do `name` (`LINA Tabela`): o usuário não acha no Word. Cada tarefa, "como pedir".
- Campo de layout chamado `Nota` no slide confundido com a peça Nota: a 7.6 diz que o slide não tem a peça. Tarefa 4.
- Página do PDF errada ao repaginar: cada `recorta` usa o texto de conferência dado abaixo. Todas as tarefas, passo 1.
- Seção 7.4 ainda ausente (plano 03): sumário salta de 7.3 para 7.5 por enquanto. Aceito; não renumerar.

---

### Tarefa 1: 7.2 Tabela

**Files:**
- Modify: `capitulos/7-componentes/_recortes.sh` (duas linhas `recorta`)
- Create: `capitulos/7-componentes/2-tabela.html`, `img/tabela-slide.png`, `img/tabela-a4.png`
- Modify: `sistema.json` (entrada depois da 7.1)

- [ ] **Passo 1: recortes.** Slide: `LINA-Apresentacao-exemplo.pdf` p. 55, texto `Coluna destacada`, tabela inteira
  com a legenda, sem cabeçalho do slide. A4: `LINA-POP-exemplo.pdf` p. 2, texto `Parâmetros por escala`, do título
  "Tabela 1." até o último fio, ~24 px de folga. Rodar o script; olhar os dois PNG.
- [ ] **Passo 2: fragmento.** Valores a conferir no código:
  - Slide `comp.tabela` (`potx/build.js:136`): cabeçalho Outfit Medium com fio umbro 1 pt embaixo; células Light;
    da 2ª coluna em diante JetBrains Mono com recuo de 20 px; fio fio-forte 0,75 pt entre linhas; sem bordas laterais;
    `destaque` pinta uma coluna de nata com texto ferro. Layouts `5.5 Tabela` e `5.5 Tabela · texto`.
  - Word `LINA Tabela`, `LINA Título de Tabela`, `LINA Mono Célula`, `LINA Tabela Registro` (`word/build.js:153-218`).
  - LaTeX `\begin{tabela}{cols}`, `\titulotabela`, `\registro{n}`, `\chamadatabela` (`lina.cls:190-264`).
  - Regra comum: fio forte em cima, fios finos entre linhas, nenhum fio vertical; título acima da tabela; números em mono.
- [ ] **Passo 3:** entrada `{"cap": "7", "nome": "7.2 Tabela", "sub": "Fios horizontais, números em mono", "secao": "capitulos/7-componentes/2-tabela.html"}`; `python3 sistema.py` sem link quebrado.

### Tarefa 2: 7.3 Legenda e fonte

**Files:** `_recortes.sh`; create `3-legenda-e-fonte.html`, `img/legenda-slide.png`, `img/legenda-a4.png`; `sistema.json`.

- [ ] **Passo 1: recortes.** Slide: p. 40, texto `Fonte: LINA, 2026.`, figura com a legenda e a fonte.
  A4: `LINA-Relatorio-exemplo.pdf` p. 2, texto `Figura 1.`, base da figura até a linha da fonte.
- [ ] **Passo 2: fragmento.** Valores:
  - Slide `comp.legenda` (`build.js:131`, 12 px abaixo da figura), `comp.legendaCores` (`:133`, quadrado de 24 px sem canto),
    estilo `S.cap` (JetBrains Mono 18 px umbro); placeholders `Legenda` e `Fonte` dos layouts.
  - Word `LINA Legenda` (parágrafo), `LINA Fonte` (caractere, mono 11 px umbro 75%), rótulo "Figura n." em `LINA Destaque`.
  - LaTeX `\legenda{}`, `\fonte{}` (`lina.cls:108, 154`).
  - Regra comum: legenda colada abaixo da figura, alinhada à esquerda; fonte em mono, mais clara.
- [ ] **Passo 3:** entrada `7.3 Legenda e fonte`, sub `Abaixo da figura, fonte em mono`; `python3 sistema.py`.

### Tarefa 3: 7.5 Passos

**Files:** `_recortes.sh`; create `5-passos.html`, `img/passos-slide.png`, `img/passos-a4.png`; `sistema.json`.

- [ ] **Passo 1: recortes.** Slide: p. 30, texto `Do levantamento ao painel`, as cinco etapas numeradas.
  A4: `LINA-POP-exemplo.pdf` p. 1, texto `Cada passo começa com um verbo`, os passos 01 a 03 ou os que couberem na página.
- [ ] **Passo 2: fragmento.** Valores:
  - Slide: não há `comp.passos`. Mostrar o layout `3.2 Ícones · processo` (número em mono ferro, fio fio-forte 2 px entre
    etapas) e citar `comp.tileNumero(…)` (`build.js:119`, número de 2 dígitos em tile ferro com cantos de ¼).
  - Word `LINA Passos` (tabela), `LINA Passo` (parágrafo), `LINA Passo Número` (caractere, mono negrito ferro).
  - LaTeX `\begin{passos} \item … \end{passos}` (`lina.cls:270`); contagem continua entre ambientes.
  - Regra comum: número com dois dígitos em mono ferro, à esquerda; um passo, uma ação; a numeração não reinicia
    (é o que o LaTeX faz; conferir no Word antes de escrever como regra dos dois).
- [ ] **Passo 3:** entrada `7.5 Passos`, sub `Número em mono, uma ação por passo`; `python3 sistema.py`.

### Tarefa 4: 7.6 Nota

**Files:** `_recortes.sh`; create `6-nota.html`, `img/nota-a4.png`; `sistema.json`.

- [ ] **Passo 1: recorte.** Só A4: `LINA-POP-exemplo.pdf` p. 2, texto `Valores de referência`, a nota com o fim da tabela acima
  (mostra a relação entre as duas).
- [ ] **Passo 2: fragmento.** Uma figura só (Documento A4). Valores: Word `LINA Nota` (9 pt, umbro 75%, 8 px antes);
  LaTeX `\nota{}` (`lina.cls:280`). `dd` Slide: "Ainda não existe." e uma frase dizendo que o campo `Nota` de alguns
  layouts é texto de apoio, outra coisa.
- [ ] **Passo 3:** entrada `7.6 Nota`, sub `Observação curta, abaixo do que comenta`; `python3 sistema.py`.

### Tarefa 5: 7.7 Cabeçalho e rodapé

**Files:** `_recortes.sh`; create `7-cabecalho-e-rodape.html`, `img/cabecalho-slide.png`, `img/cabecalho-a4.png`; `sistema.json`.

- [ ] **Passo 1: recortes de página inteira**, reduzidos à metade (Review Focus). Slide: p. 24, texto
  `Título abreviado do trabalho`. A4: `LINA-POP-exemplo.pdf` p. 1, texto `POP-04`.
- [ ] **Passo 2: fragmento.** Valores:
  - Slide: barra de rodapé de 84 px em ferro na base (`footer`, `build.js:91`), marca creme à esquerda, texto do
    rodapé em Outfit Medium creme, número da página em mono creme à direita; capa e seção sem rodapé. Cabeçalho do
    slide = rótulo mono ferro + título (`header()`, `:86`).
  - Word `LINA Cabeçalho` (logo à esquerda, texto mono à direita, fio fio-forte embaixo), `LINA Rodapé` (mono 11 px,
    umbro 70%, sigla à esquerda, página à direita).
  - LaTeX `\siglarodape{}`, `\cabecalhoprimeira{}`, `\titulocurto` (`lina.cls:100-222`).
  - Regra comum: identificação à esquerda, número da página à direita, em mono; capa sem rodapé.
- [ ] **Passo 3:** entrada `7.7 Cabeçalho e rodapé`, sub `Identificação à esquerda, página à direita`; `python3 sistema.py`.

### Tarefa 6: verificação e aprovação

**Files:** nenhum novo; capturas em `records/02-*.jpg`.

- [ ] **Passo 1: nomes contra o código.** Para cada `<code class="mono">` das cinco seções, `grep` no gerador citado; cada um ≥ 1.
- [ ] **Passo 2: script inteiro.** `sh capitulos/7-componentes/_recortes.sh` regenera os 11 PNG sem erro; `git status` sem PNG alterado além dos novos.
- [ ] **Passo 3: navegador** (`preview_start` "site-8771"): `7-componentes.html` em 1440 px e 375 px. Nenhum elemento com
  `scrollWidth > clientWidth`; proporção de cada `<img>` igual à do PNG.
- [ ] **Passo 4: mostrar ao usuário** capturas das cinco seções e pedir aprovação; registrar no `progress.md`. Plano 03 só depois.
