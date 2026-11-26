# 01 — Base paramétrica e família 1 (Abertura)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** layouts viram funções de N; a família 1 (1.1–1.5) passa a ser gerada assim, e os nomes antigos da família continuam aceitos por alias.

**Architecture:** `potx/param.js` (puro, sem pptxgenjs) resolve nome de layout + preenchimento em `{ base, n, name, fill }`. `build.js` registra famílias em `FAM` (construtor por N), adia os `s()` até saber quais layouts o deck usa, define esses layouts em ordem numérica e só então cria os slides. Layouts antigos das famílias 2–6 continuam no `layout(...)` atual até os planos 02–04.

**Tech Stack:** Node 20, pptxgenjs 4, sharp; `node:assert` para o check.

**Spec:** [`../../specs/2026-11-26-apresentacao-layouts-parametricos.md`](../../specs/2026-11-26-apresentacao-layouts-parametricos.md). Geometria de cada variação: funções `capa`, `capaImagem`, `sumario`, `secao` do catálogo [`2026-11-26-miniaturas-apresentacao.html`](../../specs/2026-11-26-miniaturas-apresentacao.html) (linhas ~116–160), traduzidas para `ph()`/`rule()`/`col()`/`row()` do `build.js`.

## Global Constraints

- Grade: margem 72, calha 24, 12 col de 126, 6 linhas de 120 a partir de y = 132; rodapé em y = 996. Usar `col()`, `row()`, `CT`, `CB`, `TY`.
- Tipos: rótulo JetBrains Mono 25 ferro; título Outfit ExtraBold 60 (capa 72; capa com título longo 56); subtítulo Medium 32; texto Light 28.
- Cores só de `C` (tokens).
- `aspect.py` imprime `distorcidas: 0`; `validate.py` passa no .pptx e no .potx.
- Nome de layout com N: `` `${base} · ${n} ${unidade}` `` (ex.: `1.4 Sumário · 9 itens`); sem sufixo quando `n === padrao` da família ou a família não tem faixa.
- Nome antigo sem equivalente: `Error` com a sugestão; nunca troca de layout em silêncio.
- Comentários e mensagens de erro em português.

## Review Focus

- N fora da faixa (`1.4 Sumário` com 0 ou 19 itens): erro claro com a faixa aceita.
- Chave de `fill` que não é placeholder do layout resolvido: erro com o nome do layout (hoje some em silêncio).
- Deck antigo (`DECK=…`) chamando `1.4 Capa · autores`, `1.5 Sumário`, `1.6 Sumário · lista`, `1.7 Seção`: gera pelo alias, mesmo texto.
- Ordem dos layouts no master: numérica, depois por N (`1.4 Sumário · 4 itens` antes de `· 12 itens`).
- Animação de entrada do HTML: só capas (`1.2`, `1.3`); hoje o regex `^1\.[2-4] ` pegaria o sumário novo.

---

### Task 1: Núcleo paramétrico

**Files:**
- Create: `templates/apresentacao/potx/param.js`
- Create: `templates/apresentacao/potx/check.js`

**Interfaces:**
- Produces (`module.exports = { resolve, nomeLayout, pad }`):
  - Família: `{ faixa?: [min, max], padrao?: number, unidade?: string, campo?: string, numera?: boolean, n?: (fill) => number, itens?: (itens, n) => object, build: (n) => objects[], opts?: (n) => { bg, foot } }`.
  - `nomeLayout(base: string, n: number, fam: object) -> string`.
  - `resolve(m: string, fill: object, FAM: object, ALIAS: object) -> { base, n, name, fill }`. Passos: (1) `ALIAS[m]` = `{ para, conv? }` ou `{ erro }`: `erro` lança `Error(erro)`; senão `fill = conv ? conv(fill) : fill`, `m = para`. (2) `m` no formato `` `${base} · ${n} ${unidade}` `` com `base` em `FAM` vale como base + N fixo. (3) `m` fora de `FAM`: `Error("layout '<m>' não existe")`. (4) `n = fill.itens?.length ?? fam.n?.(fill) ?? fam.padrao ?? 1`. (5) faixa violada: `Error("'<base>' aceita <min>–<max> <unidade>, recebeu <n>")`. (6) `itens` expande: `fam.itens(itens, n)` se existir; senão item `i` string vira `{ [`${fam.campo} ${i+1}`]: s }`, objeto vira `{ [`${k} ${i+1}`]: v }` para cada chave; com `fam.numera`, `Número i` = `pad(i+1)` quando ausente. `itens` sai do `fill` devolvido.
  - `pad(i) -> '01'…`.

- [ ] **Step 1: Escrever `check.js` com asserts** sobre uma `FAM` de teste (`'9.1 Teste'`: faixa [1, 6], unidade `'itens'`, campo `'Item'`, numera; `'9.2 Fixo'`: sem faixa) e `ALIAS` (`'9.0 Velho'` → `{ para: '9.1 Teste', conv: (f) => ({ itens: f.Itens.split('\n') }) }`, `'9.9 Morto'` → `{ erro: "'9.9 Morto' saiu; use '9.2 Fixo'" }`):
  - `resolve('9.1 Teste', { itens: ['a', 'b'] }, …)` → `name === '9.1 Teste · 2 itens'`, `fill` igual a `{ 'Item 1': 'a', 'Item 2': 'b', 'Número 1': '01', 'Número 2': '02' }`.
  - `resolve('9.1 Teste', { itens: [{ Item: 'a', Descrição: 'd' }] }, …).fill['Descrição 1'] === 'd'`.
  - `resolve('9.1 Teste · 3 itens', { 'Item 1': 'x' }, …).n === 3`.
  - `resolve('9.0 Velho', { Itens: 'a\nb\nc' }, …).name === '9.1 Teste · 3 itens'`.
  - `assert.throws(() => resolve('9.9 Morto', {}, …), /use '9.2 Fixo'/)`; `/não existe/` para `'9.3 Nada'`; `/aceita 1–6 itens, recebeu 7/` para 7 itens.
  - `resolve('9.2 Fixo', { Título: 't' }, …).name === '9.2 Fixo'`.
  - Se existir `out/layouts.json` (Task 2), checa também: contém `1.1 Abertura`, `1.2 Capa`, `1.4 Sumário · 4 itens`, `1.5 Seção`; não contém `1.4 Capa · autores`, `1.6 Sumário · lista`, `1.7 Seção`; nomes em ordem numérica.
- [ ] **Step 2:** `node check.js` falha (`Cannot find module './param.js'`).
- [ ] **Step 3: Implementar `param.js`.**
- [ ] **Step 4:** `node check.js` imprime `check ok`.
- [ ] **Step 5: Commit** `Apresentação v2: núcleo paramétrico (param.js) e check`.

### Task 2: Família 1 no gerador

**Files:**
- Modify: `templates/apresentacao/potx/build.js` (layouts 1.1–1.7 em `defineLayouts`, `s()` em `examples`, `flushLayouts`, bloco final)
- Modify: `templates/apresentacao/potx/html.js:125` (regex da animação de entrada → `/^1\.[23] /`)
- Modify: `templates/apresentacao/potx/make.sh` (rodar `node check.js` depois do `aspect.py`)

**Interfaces:**
- Consumes: `resolve`, `nomeLayout`, `pad` de `param.js`.
- Produces (usados pelos planos 02–04): `FAM` (objeto de famílias no formato da Task 1), `ALIAS` (nome antigo → `{ para, conv? } | { erro }`), `s(m, fill, extra)` adiado (mesma assinatura de hoje; não retorna `sl`), objeto passado ao `DECK` ganha `FAM`, `pad`.

Famílias (geometria do catálogo):

| Base | Faixa · unidade · padrão | Placeholders | Observação |
| --- | --- | --- | --- |
| `1.1 Abertura` | — | — | como hoje |
| `1.2 Capa` | 1–9 · `autores` · 1 | `Evento`, `Título`, n = 1: `Apresentador`, `Coautores`; n ≥ 2: `Autores c` (c = 1…⌈n/3⌉, 3 nomes por coluna de 4 módulos, `S.sub` creme); sempre `Logo 1`, `Logo 2` (pic, parceiros à direita do IAUD, altura 93, mesma linha) | `itens` de nomes viram colunas `'a\nb\nc'`; `n(fill)` conta linhas de `Autores *`; `Título` com mais de 60 caracteres recebe `fontSize: P(56)` no `addText` |
| `1.3 Capa · imagem` | 1–6 · `autores` · 3 | `Imagem`, `Evento`, `Título`, `Autores 1` (3 módulos), `Autores 2` (4 módulos, só n > 3) | como o `1.3` atual |
| `1.4 Sumário` | 1–18 · `itens` | n ≤ 6: faixas `(CB − TY)/n` à direita (col 5–11), `Número i`, `Item i`, `Descrição i` (só n ≤ 5), título à esquerda; n ≥ 7: `header()`, 2 colunas até 12, 3 até 18, `Número i`, `Item i` | campo `Item`, numera |
| `1.5 Seção` | — | `Número`, `Título`, `Descrição` | antigo `1.7 Seção` |

Aliases: `'1.4 Capa · autores'` → `1.2 Capa`; `'1.6 Sumário · lista'` → `1.4 Sumário` (conv: `Item i`/`Descrição i` → `itens`); `'1.5 Sumário'` → `1.4 Sumário` (conv: `Itens` string separa por `\n`; lista de trechos guarda os `text` sem `fontFace` mono); `'1.7 Seção'` → `1.5 Seção`.

- [ ] **Step 1: `s()` adiado.** `s(m, fill, extra)` faz `resolve` e empilha `{ name, base, n, fill, extra }`; chave de `fill` sem placeholder no layout resolvido lança `Error("'<chave>' não é espaço de '<name>'")` (checar depois de construir o layout). Depois de `examples()` (e do `DECK`), `flushLayouts()` define os layouts antigos de `PEND` e os de `FAM` usados, juntos, ordenados por número e depois por N; só então cria os slides (código atual do `s()`) e as páginas de ícones.
- [ ] **Step 2: Construtores de `1.1`–`1.5`** em `FAM`; apagar `layout('1.4 Capa · autores' | '1.5 Sumário' | '1.6 Sumário · lista' | '1.7 Seção')` e os antigos `1.1`–`1.3`. Logo de parceiro no exemplo: PNG gerado em `assets()` (`gen/logo-parceiro.png`, retângulo creme vazado, texto "Logo parceiro" em mono, proporção 3:1).
- [ ] **Step 3: Exemplos da família 1**, na ordem do catálogo: `1.1`; `1.2` com apresentador e coautores; `1.2` com 6 autores e 1 logo de parceiro; `1.2` com título de 4 linhas e 2 logos; `1.3` com 6 autores; `1.4` com 4, 6, 12 e 18 itens (faixas no máximo de cada arranjo); `1.5`. Apagar os exemplos antigos de `1.4`–`1.7`.
- [ ] **Step 4: Checagens.** `sh make.sh` termina; saída com `distorcidas: 0`, `validate.py` ok nos dois arquivos e `check ok`. `DECK` de teste em `/tmp` usando os quatro nomes antigos gera sem erro.
- [ ] **Step 5: Render.** `pdftoppm -r 40 -png -f 1 -l 12 ../LINA-Apresentacao-exemplo.pdf out/r01` e olhar cada página da família 1 contra o catálogo (texto dentro da caixa, nada na faixa 72–108 além do rótulo, logos alinhadas). Abrir `../Apresentacao.dc.html` no navegador e conferir os mesmos slides.
- [ ] **Step 6: Commit** `Apresentação v2: família 1 paramétrica e aliases`.
