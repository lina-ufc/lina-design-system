# 02 — Famílias 2 (Texto) e 3 (Ícones), componentes

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** famílias 2 e 3 viram `FAM` paramétricas como a família 1; nomes antigos por alias; componentes viram funções do gerador.

**Architecture:** mesmo padrão do plano 01 (`FAM`, `ALIAS`, `s()` adiado, `flushLayouts`). Marcas que variam por item (marco feito/futuro) não cabem no master: a família ganha `desenha(sl, itens, n)`, chamado na criação do slide, que acrescenta formas. Componentes são funções `comp.*(sl, …)` que só usam `sl.addText` (formas com `shape`) e `sl.addImage`, para o `html.js` desenhar o mesmo.

**Tech Stack:** Node 20, pptxgenjs 4, sharp.

**Spec:** [`../../specs/2026-11-26-apresentacao-layouts-parametricos.md`](../../specs/2026-11-26-apresentacao-layouts-parametricos.md). Geometria: funções `texto`, `colunas`, `lista`, `tempo`, `tempoVertical`, `equacao`, `soTitulo`, `recursos`, `processo`, `ilustracoes`, `compDeclaracao`, `compCartoes` (e as que elas chamam) do catálogo [`2026-11-26-miniaturas-apresentacao.html`](../../specs/2026-11-26-miniaturas-apresentacao.html).

**O que o 01 ensinou:** `s()` não devolve `sl`; chave de `fill` sem placeholder dá erro; nome com N sai de `nomeLayout`; ordem do master é número, depois N; `.potx` só leva as variações que o exemplo usa, então todo arranjo que deve estar no `.potx` precisa de um slide de exemplo.

## Global Constraints

- As do plano 01 (grade, tipos, tokens, `distorcidas: 0`, `validate.py`, erros explícitos, português).
- Ícones: só Phosphor regular (`assets/icons/phosphor`); PNG gerado em `assets()` como os atuais (`gen/<nome>-<tag>.png`). Nome que faltar no DS fica para o plano 04: usar só ícones existentes.
- Declaração-chave preenchida fora do vermelho, três cores: A turquesa fundo (`C.turquesaFundo`) com texto creme; B damasco com texto umbro; C turquesa (`C.turquesa`) com texto umbro. Padrão: fio ferro + rótulo mono + frase Medium.

## Review Focus

- Deck antigo com `2.2 Duas colunas`, `2.3 Três colunas`, `2.5 Conclusões`, `2.4 Equação`, `3.1`, `3.2`, `3.3 Ícones · lista e imagem` gera pelo alias com o mesmo texto e os mesmos ícones visíveis (ícone ferro nunca sobre tile ferro).
- Ícone passado no `fill` com caixa calculada para a geometria antiga: o slide usa a caixa do placeholder novo, no .pptx e no HTML.
- Lista e processo com N que não divide 12 (5, 7): largura útil repartida por igual, nada sai da grade à direita.
- Linha do tempo com 12 marcos: duas linhas, rótulos não se sobrepõem.
- Componente no HTML: forma com `shape` (tile arredondado, ponto redondo) aparece igual ao .pptx.

---

### Task 1: Ajustes do núcleo

**Files:** Modify `templates/apresentacao/potx/param.js`, `check.js`, `build.js` (replay do `s()`), `html.js` (forma elíptica em `textBox`).

**Interfaces:**
- `resolve(...)` passa a devolver também `itens` (a lista original, ou `undefined`).
- Sem `itens` e sem `fam.n`, com `fam.campo`: `n` = quantidade de chaves `` `${campo} \d+` `` no `fill`, se houver alguma.
- No replay do `s()`: valor de `fill` com `img` e placeholder correspondente recebe `box` = caixa do placeholder (x, y, w, h do layout), mantendo `sizing` do valor.
- `html.js`: `textBox` com `o.shape === 'ellipse'` usa `border-radius:50%`.

- [ ] **Step 1:** asserts novos em `check.js`: `resolve('9.1 Teste', { 'Item 1': 'a', 'Item 2': 'b', 'Item 3': 'c' }, …).n === 3`; `resolve('9.1 Teste', { itens: ['a'] }, …).itens` igual a `['a']`.
- [ ] **Step 2:** `node check.js` falha nos asserts novos.
- [ ] **Step 3:** implementar; `node check.js` → `check ok`.
- [ ] **Step 4:** commit `Apresentação v2: N pelas chaves, itens devolvidos, imagem na caixa do placeholder`.

### Task 2: Família 2

**Files:** Modify `build.js` (layouts `2.x` antigos saem de `layout(...)`, entram em `FAM`; exemplos; `ALIAS`).

| Base | Faixa · unidade | Placeholders por item `i` | Notas |
| --- | --- | --- | --- |
| `2.1 Texto` | — | `Rótulo`, `Título`, `Texto` | igual |
| `2.2 Colunas` | 2–4 · `colunas` | `Subtítulo i`, `Texto i` | fio fioForte; N = 4 texto 26 |
| `2.2 Colunas · numeradas` | 2–4 · `colunas` | `Número i`, `Subtítulo i`, `Texto i` | numera |
| `2.2 Colunas · ícones` | 2–4 · `colunas` | `Ícone i` (pic 56, ferro simples), `Número i`, `Subtítulo i`, `Texto i` | fio umbro 2; antigo 2.5 |
| `2.3 Lista` | 1–10 · `itens` | tile ferro com `Número i` creme, `Item i`, `Texto i` | 1 coluna até 5, 2 acima |
| `2.3 Lista · ícones` | 1–10 · `itens` | tile damasco + `Ícone i` (ferro), `Item i`, `Texto i` | idem |
| `2.3 Lista · marcador` | 1–10 · `itens` | ponto ferro (elipse), `Item i` | idem |
| `2.3 Lista · imagem` | 1–5 · `itens` | como `2.3 Lista` + `Imagem` sangrada à direita | 1 coluna |
| `2.3 Lista · ícones e imagem` | 1–5 · `itens` | como `2.3 Lista · ícones` + `Imagem` | alvo do antigo 3.3 |
| `2.4 Linha do tempo` | 2–12 · `marcos` | `Data i` (mono), `Marco i`, `Texto i` | 1 linha até 6, 2 acima; célula LINA vazada no master; `desenha` preenche a célula dos itens com `feito: true` |
| `2.4 Linha do tempo · vertical` | 2–6 · `marcos` | idem + `Imagem` à direita | eixo vertical na coluna |
| `2.5 Equação` | — | `Equação`, `Nota` | antigo 2.4 |
| `2.6 Só título` | — | `Rótulo`, `Título` | igual |

Aliases: `'2.2 Duas colunas'` → `2.2 Colunas` (conv: `Coluna i` → `Texto i`); `'2.3 Três colunas'` → `2.2 Colunas`; `'2.5 Conclusões'` → `2.2 Colunas · ícones`; `'2.4 Equação'` → `2.5 Equação`.

- [ ] **Step 1:** construtores e aliases.
- [ ] **Step 2:** exemplos na ordem do catálogo: `2.1`; `2.2` com 2; `· numeradas` com 3; `· ícones` com 4; `2.3 Lista · imagem` com 4; `· ícones` com 9; `· marcador` com 5; `2.3 Lista` com 6; `· ícones e imagem` com 3; `2.4` com 5 (2 feitos) e 10; `· vertical` com 5; `2.5`; `2.6`. Apagar exemplos antigos da família 2 e o slide de guia passa a usar `2.2 Colunas`.
- [ ] **Step 3:** `sh templates/apresentacao/potx/make.sh` → `All validations PASSED!` ×2, `distorcidas: 0`, `check ok`; `check.js` passa a exigir presentes `2.2 Colunas · 2 colunas`, `2.4 Linha do tempo · 10 marcos`, `2.5 Equação`; ausentes `2.3 Três colunas`, `2.5 Conclusões`.
- [ ] **Step 4:** render `pdftoppm -r 40` das páginas da família 2 e conferir contra o catálogo.
- [ ] **Step 5:** commit `Apresentação v2: família 2 paramétrica`.

### Task 3: Família 3

| Base | Faixa · unidade | Placeholders | Notas |
| --- | --- | --- | --- |
| `3.1 Ícones · recursos` | 2–8 · `recursos` | tile ferro + `Ícone i` (creme), `Subtítulo i`, `Texto i` | até 4 numa linha; acima, 2 linhas com tile menor |
| `3.2 Ícones · processo` | 2–12 · `etapas` | `Ícone i` (ferro), `Número i`, `Subtítulo i`, `Texto i`, fio entre etapas | largura útil ÷ N por linha; acima de 6, 2 linhas |
| `3.3 Ícones · ilustrações` | 2–4 · `ilustrações` | `Ilustração i` (pic 380), `Subtítulo i`, `Texto i` | novo |

Aliases: `'3.3 Ícones · lista e imagem'` → `2.3 Lista · ícones e imagem` (conv: `Subtítulo i` → `Item i`). `3.1` e `3.2` mantêm o nome e as chaves.

- [ ] **Step 1:** construtores, alias, exemplos (`3.1` com 4, 6, 8; `3.2` com 5 e 8; `3.3` com 4, ilustração = `gen/provisoria.png`).
- [ ] **Step 2:** make e checagens como na Task 2; `check.js` exige `3.2 Ícones · processo · 8 etapas`.
- [ ] **Step 3:** render e conferência.
- [ ] **Step 4:** commit `Apresentação v2: família 3 paramétrica`.

### Task 4: Componentes

**Files:** Modify `build.js` (objeto `comp`, passado ao `DECK`; dois slides de exemplo em `2.6 Só título`).

**Interfaces (produz, usado pelos planos 03–04 e pelos decks):**
- `comp.declaracao(sl, [x, y, w, h], { rotulo, texto, cor })`: `cor` `undefined` = padrão; `'A' | 'B' | 'C'` = preenchida.
- `comp.cartao(sl, box, { titulo, texto, icone? })`: fundo nata, cantos `R`.
- `comp.tileNumero(sl, x, y, s, i, cor = C.ferro)`; `comp.tileIcone(sl, x, y, s, icone, cor = C.damasco)` (ícone ferro sobre damasco, creme sobre ferro/turquesa fundo).
- `comp.numeroSeta(sl, box, antes, depois, unidade)`: dois números Outfit ExtraBold e seta (`arrow-right` não existe no DS ainda: seta como texto `→` em Outfit).
- `comp.legenda(sl, caixaDaFigura, texto)`: mono 18, 12 px abaixo da figura.
- `comp.legendaCores(sl, x, y, [[cor, rotulo], …])`: quadrados de 24 com rótulo mono 18.
- `comp.marcador(sl, x, y, texto)`: ponto ferro + texto.

- [ ] **Step 1:** implementar; slide 1 = três declarações preenchidas (A, B, C) + uma padrão; slide 2 = cartões, tiles, número com seta, legendas e marcador, como `compCartoes` do catálogo.
- [ ] **Step 2:** make e checagens; render das duas páginas; HTML: `grep -c` não basta, abrir as duas seções no navegador (`templates/apresentacao/Apresentacao.dc.html`) ou deixar para o orquestrador.
- [ ] **Step 3:** commit `Apresentação v2: componentes do gerador`.
