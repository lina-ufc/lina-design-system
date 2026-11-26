# 04 — Famílias 5 (Dados), 6 (Encerramento) e páginas de ícones

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** fecha o catálogo: famílias 5 e 6 paramétricas, gráfico de várias séries e tabela corrigidos no HTML, páginas de ícones presentes no HTML e no PDF.

**Architecture:** mesmo padrão dos planos 01–03 (`FAM`, `ALIAS`, `s()` adiado, `desenha`/`arranja`, `comp`). Tabela ganha helper `comp.tabela`; as páginas de ícones deixam de usar `pres.addSlide` direto e passam por `s()`, para entrar no HTML.

**Tech Stack:** Node 20, pptxgenjs 4, sharp.

**Spec:** [`../../specs/2026-11-26-apresentacao-layouts-parametricos.md`](../../specs/2026-11-26-apresentacao-layouts-parametricos.md). Geometria: `grafico`, `leituras`, `numeros`, `comparacao`, `tabela`, `encerramento`, `encAutores`, `tratamentos`, `biblioteca` do catálogo [`2026-11-26-miniaturas-apresentacao.html`](../../specs/2026-11-26-miniaturas-apresentacao.html).

**O que o 03 ensinou:** pptxgenjs grava `<a:noFill/>` nos placeholders dos slides, que anula herança do layout (o `post.py` precisa tocar layout e slide); placeholder de imagem que não recebe preenchimento fica vazio e não aparece; `prepara()` assíncrono antes do replay resolve tudo que precisa de sharp.

## Global Constraints

- As dos planos anteriores.
- Gráfico de duas séries: ferro + turquesa fundo (par fixo; documentar no README no plano 06).
- Papéis de cor por categoria (legenda de cores): foco ferro, resultado turquesa fundo, referência umbro.
- Ícones: só os 25 de `assets/icons/phosphor/regular` (e pesos irmãos). Os que faltam no DS (`warning`, `arrow-right`, `thermometer`…) **não** entram neste plano: baixá-los é download e precisa do aval do usuário; a 7.2 mostra os existentes e aponta para phosphoricons.com e `assets/icons/phosphor`.

## Review Focus

- `5.1` com duas séries de barras: as duas aparecem no HTML, agrupadas, com legenda; com linhas, idem.
- `5.3` com 4 números longos (`1.234,5`): fonte 110 cabe na coluna de 3 módulos.
- `5.5` tabela com coluna destacada: preenchimento só na coluna, cabeçalho incluso, igual no HTML.
- `6.2` com 9 a 12 autores: três colunas sem sair da largura útil; com 1 a 3, centrada.
- Deck antigo com `6.2 Encerramento · autores` (`Autores 1`, `Autores 2`) e `5.3 Números-chave` com 3 números: gera igual.

---

### Task 1: Família 5 e bugs

| Base | Faixa · unidade | Placeholders | Notas |
| --- | --- | --- | --- |
| `5.1 Gráfico` | — | `Rótulo`, `Título`, `Gráfico`, `Fonte` | exemplo com duas séries de barras |
| `5.2 Gráfico e leituras` | — | igual hoje | |
| `5.3 Números-chave` | 2–4 · `números` | `Número i`, `Rótulo i`, `Nota i` | 140 px; com 4, 110 |
| `5.3 Números-chave · antes e depois` | — | `Número 1`, `Número 2`, `Rótulo 1`, `Rótulo 2`, `Nota` | seta ferro entre os números (forma `rightArrow` ou texto `→` Outfit; o HTML precisa desenhar igual) |
| `5.4 Comparação` | — | igual hoje | |
| `5.5 Tabela` | — | `Rótulo`, `Título`, `Tabela`, `Fonte` | |
| `5.5 Tabela · texto` | — | `Rótulo`, `Título`, `Texto` (Medium 40, colunas 0–3), `Tabela` (colunas 4–11), `Fonte` | CNR |

- [ ] **Step 1:** `comp.tabela(sl, { cab: [...], linhas: [[...]], destaque?: indiceDaColuna, colW?: [...] }, placeholder = 'Tabela')`: estilo da tabela atual do exemplo (cabeçalho Medium com fio umbro, células Light/mono com fio fioForte), coluna `destaque` com fundo nata e texto Medium; sempre preenche o placeholder (corrige o placeholder vazio).
- [ ] **Step 2:** `html.js` `chart()`: barras com várias séries (grupos lado a lado, cores de `chartColors` por série quando `series.length > 1`, legenda como a das linhas); `table()`: fundo da célula (`options.fill`).
- [ ] **Step 3:** construtores, alias (nenhum nome muda, só `5.3` ganha N por chaves `Número i`), exemplos na ordem do catálogo: `5.1` com duas séries; `5.2`; `5.3 · antes e depois`; `5.3` com 3 e 4; `5.4`; `5.5` com coluna destacada; `5.5 · texto`.
- [ ] **Step 4:** make → validate ×2, `distorcidas: 0`, `check ok` (`check.js` exige `5.3 Números-chave · 4 números`, `5.5 Tabela · texto`); render e prancha.
- [ ] **Step 5:** commit `Apresentação v2: família 5, gráfico multissérie e tabela`.

### Task 2: Família 6

| Base | Faixa · unidade | Placeholders | Notas |
| --- | --- | --- | --- |
| `6.1 Encerramento` | 2–4 · `logos` · padrão 2 | `Título`, `Apresentador`, `Contato`, `Logo i` (parceiros, i = 1…n−2) | UFC + IAUD + parceiros centrados como grupo |
| `6.2 Encerramento · autores` | 1–12 · `autores` · padrão 2 | `Título`, `Autores c` | ≤ 3: uma coluna centrada; 4–8: duas com a calha no centro (direita alinhada à direita, esquerda à esquerda, como hoje); 9–12: três; `n` conta linhas de `Autores *` |

- [ ] **Step 1:** construtores; exemplos `6.1` com 3 logos; `6.2` com 3 e 8 autores.
- [ ] **Step 2:** make e checagens; `check.js` exige `6.2 Encerramento · autores · 8 autores`; render.
- [ ] **Step 3:** commit `Apresentação v2: família 6 paramétrica`.

### Task 3: Páginas de ícones

- [ ] **Step 1:** `iconPages()` passa a usar `s('2.6 Só título', …, extra)` com `sl.addImage` (entra no HTML e no PDF). Duas páginas, como o catálogo: **7.1 Tratamentos** (os 11 de `TRAT`, um ícone por tratamento, nome em mono embaixo) e **7.2 Biblioteca** (os ícones de `BIB` em sólido, nome em mono, e uma linha: "Mais de 1.500 ícones em phosphoricons.com; os do LINA estão em assets/icons/phosphor"). As quatro páginas antigas de copiar e colar saem (a 7.1 também serve para copiar).
- [ ] **Step 2:** make, checagens, render das duas páginas; HTML tem as duas seções.
- [ ] **Step 3:** commit `Apresentação v2: páginas de ícones no HTML e no PDF`.
