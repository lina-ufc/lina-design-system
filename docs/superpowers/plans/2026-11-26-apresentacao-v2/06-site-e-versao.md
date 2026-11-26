# 06 — Regressão, documentação, site e versão 2.0.0

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** provar que decks antigos geram com a v2, documentar a v2 (README do template, CHANGELOG 2.0.0) e atualizar a página 8.1 do site com os novos layouts, as notas do apresentador e um print da janela. Push, tag e release ficam para o usuário autorizar.

**Architecture:** nada novo no gerador. A página 8.1 é gerada por `capitulos/8-templates/_gerar.py` a partir do `.pptx` de exemplo: editar o gerador, nunca o HTML gerado à mão. O documento do site sai de `python3 sistema.py`.

**Spec:** [`../../specs/2026-11-26-apresentacao-layouts-parametricos.md`](../../specs/2026-11-26-apresentacao-layouts-parametricos.md) (regressão local, catálogo, notas, `dist/`).

**O que o 05 ensinou:** o painel do navegador bloqueia `window.open`; teste do apresentador vale com stub (iframe). Chrome headless trava em slides com `<lina-dither-field>`: capturar só slides sem trama ou servir cópia sem ela. `site.yml` agora copia `fonts.css`, `fonts/`, `apresentador.js` e `transicao.js` do zip da release, então o deploy do site falha até sair a release 2.0.0.

## Global Constraints

- As dos planos anteriores. Português em tudo; texto do site e do README no tom dos textos atuais (frases curtas, sem marketing); revisar com a skill `humanizer`.
- Pastas do Drive (CNR e Vision) são **somente leitura**: copiar para o scratchpad antes de rodar qualquer coisa.
- Sem download, sem push, sem tag.
- Imagem nova do site: PNG ou WebP leve (< 300 KB), `alt` descritivo, nunca distorcida (`aspect.py`).

## Review Focus

- Deck antigo (CNR, Vision 01–05) gera sem erro com nomes antigos de layout; diferenças visuais listadas, nenhuma quebra.
- Página 8.1: contagem de layouts e lista de famílias batem com o `.potx`; nada cita `1.1 Abertura`, `4.3` à esquerda, `4.9 Vídeo` nem "quatro páginas de ícones".
- Print da janela do apresentador legível no celular.
- `python3 sistema.py` sem link quebrado.

---

### Task 1: Regressão local CNR e Vision

Pastas: `…/APRESENTAÇÕES/[2026-11-13] CNR - Digital transformation for cultural heritage` e `…/APRESENTAÇÕES/[2026-11-23] Vision Project Seminar` (palestras 01–05). Colchetes quebram glob: `cd "$d"` antes de `find`.

- [ ] **Step 1:** descobrir como cada deck roda (CNR: `cnr.js` como `DECK`; Vision: `deck.js` + `lib.js`). Copiar para `scratchpad/regressao/<nome>/` com os assets que o deck usa.
- [ ] **Step 2:** gerar cada um com o `build.js` atual (`DECK=… node build.js` ou o fluxo do próprio deck apontado para o gerador do repo). Registrar: erro ou não, nº de slides antes (PDF existente na pasta) e depois.
- [ ] **Step 3:** renderizar (`pdftoppm -r 40`) e montar uma prancha por deck lado a lado com o PDF antigo; listar diferenças. Quebra (erro, texto fora da caixa, imagem sumida) é bug do gerador: corrigir no `build.js` com o menor diff e rodar `make.sh` (validate ×2, `distorcidas: 0`, `check ok`).
- [ ] **Step 4:** registro em `records/06-regressao.md` (tabela deck × slides × diferenças). Commit `Apresentação v2: regressão CNR e Vision` (só se houve correção ou registro).

### Task 2: README do template e CHANGELOG 2.0.0

- [ ] **Step 1:** `templates/apresentacao/README.md`: seção **Layouts** com as famílias e a regra do N (nome `'<base> · <n> <unidade>'`, faixa de cada família, o que muda com N, aliases dos nomes antigos e erro de nome sem equivalente); API `s('<layout>', fill, extra)` com `itens`, `notas`, imagem `cover`/`fit`, vídeo no `fill`, `alt`; `opcoes = { lang, transicoes }`; componentes `comp.*`; par de cores do gráfico de duas séries (ferro + turquesa fundo) e papéis da legenda de cores; deck HTML (N abre apresentador, transições opcionais, `fonts/` no zip); `sl.html`/`pptOnly`. Tirar o que ficou falso.
- [ ] **Step 2:** `templates/apresentacao/CHANGELOG.md`: entrada `## 2.0.0 · 2026-11-26` (maior: layouts removidos/renomeados). Lista curta: layouts paramétricos e contagem final, aliases, removidos (`1.1 Abertura · logo`, `4.3` imagem à esquerda, `4.9 Vídeo`), novos (4.7 com título e degradês, 5.3 antes e depois, 5.5 texto, encerramentos com N), componentes, notas, apresentador, transições, `lang`/`alt`, pacote offline com STIX Two Math, bugs (gráfico multissérie e tabela no HTML, vídeo sem caixa cinza no PDF).
- [ ] **Step 3:** conferir com `git diff` que nada além do pedido mudou. Commit `Apresentação v2: README e CHANGELOG 2.0.0`.

### Task 3: Página 8.1 do site e print do apresentador

- [ ] **Step 1:** print da janela do apresentador: servir `templates/apresentacao/` por `python3 -m http.server`, cópia sem `<lina-dither-field>` se precisar, stub de `window.open` por iframe em tela cheia (1440×904), ir a um slide com nota (sumário ou 4.1) e capturar a janela. Salvar em `capitulos/8-templates/img/apresentador.png` (ou a pasta que o site já usa para imagens, se houver), < 300 KB.
- [ ] **Step 2:** `capitulos/8-templates/_gerar.py`: contagem e lista de famílias lidas do `.pptx`/`.potx` (não fixas no texto); seção **Uso** atualizada (duas páginas de ícones; slide com N escolhe a variação pelo nome; notas no campo de notas do PowerPoint ou em `notas` no gerador); nova subseção **Notas do apresentador** (como escrever; no PowerPoint, Modo de Apresentação; no deck HTML, tecla N abre a janela com nota atual, começo da próxima, miniaturas e cronômetro; o navegador precisa permitir pop-up) com o print e `alt`; Baixar com a versão lida do CHANGELOG e descrições sem "32 layouts".
- [ ] **Step 3:** rodar `python3 downloads/empacotar.py`, `python3 capitulos/8-templates/_gerar.py`, `python3 sistema.py` (sem link quebrado). Conferir que `LINA-Fontes.zip` levar STIX não contradiz a página 5 (tipografia): se contradiz, ajustar o texto da 5.5 com uma linha.
- [ ] **Step 4:** abrir a página 8.1 no navegador (desktop e 375 px): print visível, deck do exemplo roda, downloads apontam para arquivos existentes. Commit `Apresentação v2: página 8.1 com layouts e notas do apresentador`.

### Task 4 (orquestrador): revisão e pedido de publicação

- [ ] **Step 1:** `design:design-critique` e `design:accessibility-review` na página 8.1.
- [ ] **Step 2:** perguntar ao usuário: push da `main`, tag `apresentacao-v2.0.0` (gera release e destrava o `site.yml`).
