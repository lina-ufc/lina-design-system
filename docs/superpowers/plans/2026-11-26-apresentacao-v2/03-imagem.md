# 03 — Família 4 (Imagem), `cover`/`fit`/vídeo, degradês da 4.7

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** família 4 paramétrica; imagem nunca distorcida nem com caixa calculada à mão pelo deck; vídeo em loop sem caixa cinza no PDF.

**Architecture:** o valor de imagem no `fill` deixa de precisar de caixa: `{ img: caminho, modo: 'cover' | 'fit' }` (padrão `cover`). No replay do `s()`, já com a caixa do placeholder: `cover` recorta com sharp na proporção da caixa (cache em `gen/`) e preenche o placeholder; `fit` calcula o retângulo contido, centrado, e põe a imagem solta (placeholder fica vazio). `{ video, poster }` vira `addMedia` com `loop` e o retângulo da caixa, sem preencher o placeholder. Arranjos que dependem da proporção de cada imagem (4.5 em linha) usam `desenha`.

**Tech Stack:** Node 20, pptxgenjs 4, sharp.

**Spec:** [`../../specs/2026-11-26-apresentacao-layouts-parametricos.md`](../../specs/2026-11-26-apresentacao-layouts-parametricos.md). Geometria: `lateral`, `grade`, `imagemTexto`, `figLarga`, `emLinha`, `mosaico`, `cheia`, `equipe` do catálogo [`2026-11-26-miniaturas-apresentacao.html`](../../specs/2026-11-26-miniaturas-apresentacao.html).

**O que o 02 ensinou:** o replay já põe a imagem do `fill` na caixa do placeholder e ajusta `sizing`; `desenha(sl, itens, n)` funciona para marcas por item; `html.js` precisa acompanhar toda forma nova no `obj()` e no `textBox`.

## Global Constraints

- As dos planos 01 e 02.
- `aspect.py` → `distorcidas: 0` sempre; nenhuma imagem do exemplo usa o truque `ppt: { w: X(1600), h: X(1000) }`: sai o helper `img(box)` do exemplo, entra `{ img: IMG }`.
- Espaço de imagem que não sangra tem cantos de 22 (regra do `post.py` e do `radius()` do `html.js`); a imagem `fit` solta também.
- Degradê da 4.7 · título: cor ferro fundo `6E1408`, vertical, um de cima (opaco 0,9 → 0, termina logo após o título) e um de baixo (0,85 → 0, cobre só a fonte, fonte ≈ 24 px acima do rodapé).

## Review Focus

- Imagem retrato num espaço paisagem com `cover`: recorte centrado, sem esticar (`aspect.py`), igual no HTML (`object-fit:cover`).
- `fit` com imagem mais larga que a caixa: imagem inteira, centrada na vertical, legenda logo abaixo da imagem e não da caixa (quando a família tiver legenda colada).
- `4.5 Imagens em linha` com proporções 1,33 / 0,75 / 1,5 / 1: mesma altura, soma das larguras + calhas = largura útil, nada sai da margem.
- Deck antigo com `4.5 Duas imagens`, `4.6 Três imagens`, `4.7 Mosaico`, `4.8 Imagem cheia`, `4.9 Vídeo`, `4.2 Texto e grade 2×2`, passando imagens com a caixa antiga: gera pelo alias.
- PDF do exemplo: nenhuma caixa cinza onde houver vídeo; poster no lugar.

---

### Task 1: Imagem no fill

**Files:** Modify `templates/apresentacao/potx/build.js` (replay do `s()`, `assets()`), `html.js` (imagem `fit` e vídeo vindos do `fill`).

**Interfaces (produz):**
- Valor de `fill`: `{ img, modo?: 'cover' | 'fit', posicao?: 'centre' | 'north' }` e `{ video, poster }`. O formato antigo `{ img, box, ppt }` continua aceito (decks CNR/Vision): a caixa é trocada pela do placeholder, como hoje.
- `cobre(caminho, w, h, posicao = 'centre') -> Promise<caminhoRecortado>` (sharp `resize(w, h, { fit: 'cover', position })`, cache `gen/cover-<hash>.png`). Como o `s()` é síncrono e o replay também, pré-calcular os recortes num passo `await` antes do replay (percorrer `SLIDES`, juntar os pedidos, gerar).
- `contido([x, y, w, h], iw, ih) -> [x, y, w, h]` (sharp `metadata()` dá iw, ih).

- [ ] **Step 1:** asserts em `check.js` para `contido([0, 0, 200, 100], 100, 100)` → `[50, 0, 100, 100]` e `contido([0, 0, 100, 200], 200, 100)` → `[0, 75, 100, 50]` (exportar `contido` de `param.js`, é puro).
- [ ] **Step 2:** `node check.js` falha; implementar; passa.
- [ ] **Step 3:** replay com `cover`, `fit`, vídeo; `html.js` desenha o vídeo do `fill` como o `sl.media` em loop (atributos atuais).
- [ ] **Step 4:** commit `Apresentação v2: imagem cover/fit e vídeo no fill`.

### Task 2: Família 4

| Base | Faixa · unidade | Placeholders | Notas |
| --- | --- | --- | --- |
| `4.1 Imagem lateral` | — | `Rótulo`, `Título`, `Texto`, `Legenda` (pic), `Imagem` | geometria atual intacta (Vision usa 25 vezes) |
| `4.1 Imagem lateral · recuada` | 1–3 · `números` | `Rótulo`, `Título`, `Número i`, `Nota i`, `Imagem` (fit), `Legenda` (mono 18, colada à imagem) | figura de artigo inteira |
| `4.1 Imagem lateral · esquerda` | 1–5 · `itens` | imagem sangrada à esquerda; tile numerado + `Item i` + `Texto i` na coluna direita | espelhada |
| `4.2 Texto e grade` | 2, 4, 6 · `imagens` | `Rótulo`, `Título`, `Texto`, `Imagem i` | 6 = 2 × 3; N ímpar: erro "aceita 2, 4 ou 6" |
| `4.3 Imagem e texto` | — | `Rótulo`, `Imagem` (à direita), `Título`, `Texto` | mesma base, imagem muda de lado (CHANGELOG avisa) |
| `4.4 Figura larga` | — | `Rótulo`, `Título`, `Imagem` (aceita vídeo), `Fonte` | |
| `4.5 Imagens em linha` | 2–4 · `imagens` | `Rótulo`, `Título`, `Imagem i`, `Legenda i` | master: espaços iguais; `desenha` com as proporções reais: mesma altura, larguras pela proporção, legendas sob cada uma; placeholders não preenchidos |
| `4.6 Mosaico` | 3, 5 · `imagens` | `Rótulo`, `Título`, `Imagem i` | 5 = 1 grande + 4 pequenas |
| `4.7 Imagem cheia` | — | `Imagem` (obj, até o rodapé) | sem texto |
| `4.7 Imagem cheia · título` | — | `Imagem`, `Rótulo`, `Título` (creme), `Fonte` (creme, mono) | degradês: Task 3 |
| `4.8 Equipe` | 1–24 · `pessoas` | `Retrato i` (cover, `posicao: 'north'`), `Nome i`, `Papel i` | 1 linha até 6, 2 até 16 (8 por linha), 3 até 24; retratos do mesmo tamanho |

Aliases: `'4.2 Texto e grade 2×2'` → `4.2 Texto e grade` (n = 4); `'4.5 Duas imagens'` e `'4.6 Três imagens'` → `4.5 Imagens em linha`; `'4.7 Mosaico'` → `4.6 Mosaico`; `'4.8 Imagem cheia'` → `4.7 Imagem cheia`; `'4.9 Vídeo'` → `4.4 Figura larga` (conv: `Vídeo` → `Imagem`, `Legenda` → `Fonte`).

- [ ] **Step 1:** construtores, aliases, exemplos na ordem do catálogo (`4.1` sangrada; `· recuada` com 3 números; `· esquerda` com 4; `4.2` com 2, 4, 6; `4.3`; `4.4` com vídeo — usar um mp4 curto gerado localmente só se já houver um no repo; senão imagem e anotar; `4.5` com 2 e 4 proporções mistas — gerar provisórias com sharp nas proporções 1,5 / 1,33 / 0,75 / 1; `4.6` com 3 e 5; `4.7` sem texto e com título; `4.8` com 6 e 14, retratos = provisória). Apagar exemplos antigos da família 4.
- [ ] **Step 2:** make → validate ×2, `distorcidas: 0`, `check ok`; `check.js` exige `4.8 Equipe · 14 pessoas`, `4.5 Imagens em linha · 4 imagens`; ausentes `4.9 Vídeo`, `4.6 Três imagens`.
- [ ] **Step 3:** render (prancha com `montage`) e conferência.
- [ ] **Step 4:** commit `Apresentação v2: família 4 paramétrica`.

### Task 3: Degradês da 4.7 · título

Os degradês precisam ficar **acima** da imagem do slide e **abaixo** dos textos, inclusive para quem usa o `.potx` no PowerPoint.

- [ ] **Step 1:** primeira tentativa: o placeholder `Título` (caixa do topo, y = 0 até logo após o título) e o `Fonte` (caixa do pé) ganham `<a:gradFill>` no `spPr` do layout, injetado pelo `post.py` (gradiente linear 90°, `6E1408` com alpha 90 % → 0 % e 85 % → 0 %); o texto fica com margem interna para cair na grade (rótulo em 72, título em 132; fonte a ≈ 24 px do rodapé). Slides herdam o preenchimento.
- [ ] **Step 2:** render do PDF (LibreOffice) mostra os degradês sobre a foto. Se não mostrar, plano B: PNG de degradê gerado com sharp e posto por `desenha` depois da imagem; registrar a escolha.
- [ ] **Step 3:** `html.js`: o mesmo degradê como `background:linear-gradient(...)` nas duas caixas.
- [ ] **Step 4:** make, checagens, render; commit `Apresentação v2: degradês da imagem cheia com título`.
