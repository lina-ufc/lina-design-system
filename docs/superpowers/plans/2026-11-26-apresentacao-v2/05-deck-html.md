# 05 — Deck HTML: notas, apresentador, transições, pacote offline, idioma

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** o deck HTML do template passa a ter o que o Vision montou por fora: notas do apresentador (.pptx e HTML), janela do apresentador (N), transições opcionais, fontes junto para abrir offline, `lang` e `alt` corretos.

**Architecture:** notas entram pelo `fill` (`notas: 'texto'`), saem no `.pptx` por `addNotes` e no HTML como `<script type="application/json" id="speaker-notes">` (array por slide; o `deck-stage.js` já lê). `apresentador.js` e `transicao.js` vêm do Vision para `templates/apresentacao/potx/` e o `make.sh` os copia ao lado do HTML, como faz com `lina-geometry.js`. O pacote continua **plano** (mesmos nomes de hoje na raiz do zip, que o `site.yml` copia), só ganha `fonts.css`, `fonts/`, os dois scripts e `img/miniaturas/`. Opções do deck num objeto `opcoes` (`{ lang: 'pt-BR', transicoes: false }`) que o módulo `DECK` pode alterar; o `build.js` grava `out/opcoes.json` para o `post.py`.

**Tech Stack:** Node 20, pptxgenjs 4, Python 3, poppler (`pdftoppm`).

**Spec:** [`../../specs/2026-11-26-apresentacao-layouts-parametricos.md`](../../specs/2026-11-26-apresentacao-layouts-parametricos.md), itens 4–8 do Escopo.

**Fonte do Vision** (`…/APRESENTAÇÕES/[2026-11-23] Vision Project Seminar/`, abreviado `V/`): `V/apresentador.js` (133 linhas; N abre popup com nota atual, miniatura da próxima e cronômetro; ouve `slidechange` do `deck-stage`; lê `#speaker-notes`; miniaturas `assets/miniaturas/s-NN.jpg?v=lastModified`), `V/transicao.js` (107 linhas; pareia filhos de slides vizinhos no `slidechange`; respeita `prefers-reduced-motion`), `V/build.sh` (receita de `dist/`, fontes e miniaturas por `pdftoppm -jpeg -scale-to 960`), `V/memoria/notas-html.md` e `V/memoria/transicoes-html.md` (armadilhas: popup que abre como aba exige reiniciar o Chrome; nunca limpar estilo por propriedade, salvar `cssText`; só imagem escala, texto só translada; navegador de teste bloqueia popup de agente: testar com stub de `window.open`).

## Global Constraints

- As dos planos anteriores.
- Sem dependência nova. Tudo funciona por `file://` e sem internet.
- Teclas: N abre o apresentador; F tela cheia (já existe no `html.js`; tirar o F duplicado do `apresentador.js`); G grade; H miniaturas.
- Apresentador mostra a nota atual, **o começo da nota seguinte** (primeira linha, em cinza) e a miniatura do próximo slide; cronômetro; sem contagem regressiva (decisão do Vision).
- Fontes no pacote: Outfit (Light, Medium, ExtraBold), JetBrains Mono Regular, STIX Two Math (copiar `/System/Library/Fonts/Supplemental/STIXTwoMath.otf` para `assets/fonts/` com a licença OFL do STIX; na CI não há macOS, então o arquivo entra no git), cada uma com seu OFL.
- `lang`: `<html lang>` e `lang` do texto no `post.py` vêm de `opcoes.lang` (padrão `pt-BR`); hoje o `post.py` fixa `pt-BR`.
- `alt`: imagem com `altText` (ou `alt` no valor do `fill`) sai com esse `alt` no HTML; decorativas (trama, logos repetidas) `alt=""` com `aria-hidden`.

## Review Focus

- Deck sem nenhuma nota: nada de apresentador injetado, nenhum erro no console, N não faz nada.
- Nota com `<`, `&` e aspas: JSON escapado (`<` vira `<`), aparece literal na janela.
- Transições desligadas (padrão): nenhum `transicao.js` no HTML; ligadas e `prefers-reduced-motion: reduce`: troca seca.
- Zip `LINA-Apresentacao-HTML.zip` aberto num computador sem as fontes instaladas: Outfit e JetBrains Mono aparecem (vindo de `fonts.css`).
- `DECK` antigo (CNR, Vision) sem `opcoes`: gera como antes (pt-BR, sem transição).

---

### Task 1: Notas e idioma

**Files:** Modify `templates/apresentacao/potx/build.js`, `html.js`, `post.py`, `check.js`.

**Interfaces:**
- `fill.notas: string` (parágrafos separados por `\n`): tirado do `fill` antes da checagem de placeholders; replay chama `real.addNotes(notas)`; registro do HTML guarda `rec.notas`.
- `opcoes = { lang: 'pt-BR', transicoes: false }` no `build.js`, passado ao `DECK` (que pode mudar os campos) e gravado em `out/opcoes.json`; `post.py` lê o `lang` de lá (sem o arquivo, `pt-BR`).
- `html.js`: `<html lang="${opcoes.lang}">`; se alguma nota existir, `<script type="application/json" id="speaker-notes">` com o array (um item por seção, `''` sem nota; escapar `<`).

- [ ] **Step 1:** `check.js`: depois do build, `out/opcoes.json` tem `lang`; o HTML gerado (`../Apresentacao.dc.html`) tem `lang="pt-BR"` e um `#speaker-notes` com tantos itens quantas `<section>`.
- [ ] **Step 2:** implementar; notas em alguns slides do exemplo (capa, sumário, um de imagem, encerramento), escritas como o apresentador falaria. Os slides do guia explicam `notas`.
- [ ] **Step 3:** `alt` e `aria-hidden` como em Global Constraints.
- [ ] **Step 4:** make → validate ×2, `distorcidas: 0`, `check ok`; abrir o `.pptx` com python-pptx ou unzip e confirmar `notesSlide` nos slides com nota. Commit `Apresentação v2: notas do apresentador, lang e alt`.

### Task 2: Apresentador e transições

**Files:** Create `templates/apresentacao/potx/apresentador.js`, `templates/apresentacao/potx/transicao.js` (cópias adaptadas do Vision, comentários em português). Modify `html.js` (injeta os scripts), `make.sh` (copia os dois para `templates/apresentacao/`; gera `../img/miniaturas/s-NN.jpg` do PDF com `pdftoppm -jpeg -scale-to 960` depois do `soffice`).

- [ ] **Step 1:** adaptar `apresentador.js`: caminhos `img/miniaturas/` (não `assets/`), sem a tecla F, com o começo da próxima nota; fonte por `fonts.css` local.
- [ ] **Step 2:** `transicao.js` só entra quando `opcoes.transicoes`. Ligar no deck de exemplo.
- [ ] **Step 3:** teste no navegador servido por `python3 -m http.server`: stub de `window.open` (iframe) para checar que N monta a janela com nota atual, começo da próxima e miniatura; passar slides e ver a nota acompanhar. Envolver `Element.prototype.animate` e confirmar que nenhum texto recebe `scale(`. Registrar o que não deu para testar.
- [ ] **Step 4:** commit `Apresentação v2: janela do apresentador e transições`.

### Task 3: Pacote offline

**Files:** Create `templates/apresentacao/potx/fonts.css` (ou gerado pelo `make.sh`), `assets/fonts/STIXTwoMath.otf` + `assets/fonts/OFL-STIXTwoMath.txt`. Modify `make.sh` (copia `fonts.css` e as cinco fontes para `templates/apresentacao/fonts/`), `html.js` (`<link rel="stylesheet" href="./fonts.css">`), `downloads/empacotar.py` (zip leva `fonts.css`, `fonts/`, `apresentador.js`, `transicao.js`, `img/miniaturas/`), `.github/workflows/site.yml` (copia os mesmos para `templates/apresentacao/`), `.gitignore` (gerados novos fora do git).

- [ ] **Step 1:** `fonts.css`: `@font-face` com `local()` e depois `url(fonts/…)`, nomes iguais aos de `F` no `build.js` (`'Outfit Light'`, `'Outfit Medium'`, `'Outfit ExtraBold'`, `'JetBrains Mono'`, `'STIX Two Math'`).
- [ ] **Step 2:** make; `python3 downloads/empacotar.py`; descompactar o zip em `/tmp/zip-teste` e abrir `Apresentacao.dc.html` por `file://` no Chrome headless (screenshot de 2 slides); as fontes vêm de `fonts/` (conferir no `document.fonts` ou no screenshot).
- [ ] **Step 3:** commit `Apresentação v2: pacote HTML offline com fontes`.
