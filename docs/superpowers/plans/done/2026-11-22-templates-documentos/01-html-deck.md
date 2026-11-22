# 01 · HTML do Documento A4 vira deck paginado, com texto justificado

> **Para agentes:** usar `superpowers:executing-plans` (ou `subagent-driven-development`). Passos em checkbox. Atualizar `progress.md` ao fim de cada tarefa verificada.

**Goal:** O `DocumentoA4.dc.html` passa a ser um deck A4 (uma página por vez, como a apresentação), com texto corrido justificado e hifenizado, e o site mostra esse deck na 8.2.

**Architecture:** As 9 páginas viram `<section>` filhas de `<deck-stage width="794" height="1123">`, reaproveitando o `deck-stage.js` da apresentação. Uma regra CSS única justifica o texto corrido. O site já aceita `<!--quadro caminho LxA-->` dentro de fragmento (`sistema.py`, função `moldura`).

**Tech Stack:** HTML/CSS, `deck-stage.js`, Python 3 stdlib para a checagem.

**Spec:** `docs/superpowers/specs/2026-11-22-templates-documentos-design.md`

## Global Constraints

- Português em textos e comentários (CLAUDE.md §0).
- Página 794 × 1123 px (A4 a 96 dpi). Medidas do desenho não mudam nesta etapa.
- Texto corrido justificado com `hyphens:auto` e `lang="pt-BR"`. Títulos, rótulos, legendas curtas, tabelas e cabeçalhos à esquerda; números à direita continuam à direita.
- Não redesenhar nada: só reorganizar o arquivo em deck e mudar alinhamento.

## Review Focus

1. Parágrafo justificado em coluna estreita do artigo (2 colunas): sem buracos grandes. Teste: `check_html.py` exige `hyphens:auto` na regra de justificação; conferência visual da página 4.
2. Abrir direto numa página (`#5`): o deck deve abrir nela. Teste: abrir `…#5` no navegador e conferir `data-label` "Artigo · meio".
3. Quadro no site em 375 px: sem rolagem lateral. Teste: `resize_window` mobile e `scrollWidth <= innerWidth`.
4. Deck no quadro sem a coluna de miniaturas. Teste: atributo `no-rail` presente no `deck-stage` dentro do iframe.
5. Legendas e tabelas não podem ficar justificadas por herança. Teste: `check_html.py` verifica que a regra só pega `p` de corpo (classe ou seletor dedicado).

---

### Task 1: Deck A4

**Files:**
- Modify: `templates/documento-a4/DocumentoA4.dc.html`
- Create: `templates/documento-a4/check_html.py`

**Interfaces:**
- Produces: deck com 9 seções na ordem Relatório (entrada, meio, finalização), Artigo (idem), POP (idem); `data-label` "Relatório · entrada" etc.; abre no slide N por `#N`.

- [ ] **Step 1: Escrever `check_html.py`** (stdlib): existe `<deck-stage width="794" height="1123">`; exatamente 9 `<section>` filhas diretas, com os 9 `data-label` esperados em ordem; `<html lang="pt-BR">`; o texto "Como usar este template" não aparece; `deck-stage.js` é carregado.
- [ ] **Step 2: Rodar** `python3 templates/documento-a4/check_html.py` — Expected: FAIL.
- [ ] **Step 3: Converter.** Envolver as 9 páginas no `deck-stage` (referência a `../apresentacao/deck-stage.js`, como a apresentação usa); tirar sombra, fundo de mesa e rótulos entre páginas (viram `data-label`); remover o cartão "Como usar" (o conteúdo vai para a seção Uso do site no subplano 05).
- [ ] **Step 4: Rodar** o check — Expected: PASS. Abrir `templates/documento-a4/DocumentoA4.dc.html#1` a `#9` no navegador e olhar as 9 páginas.
- [ ] **Step 5: Commit** `Documento A4: deck paginado` e marcar no `progress.md`.

### Task 2: Texto corrido justificado

**Files:**
- Modify: `templates/documento-a4/DocumentoA4.dc.html`, `templates/documento-a4/check_html.py`

- [ ] **Step 1: Estender `check_html.py`:** existe exatamente uma regra de justificação (`text-align:justify` + `hyphens:auto`) com seletor de corpo; nenhum `h1`, `h2`, legenda (`Figura`, `Tabela`, `Fonte:`), célula de tabela ou rótulo mono fica sob esse seletor.
- [ ] **Step 2: Rodar** — Expected: FAIL.
- [ ] **Step 3: Aplicar** a classe/seletor de corpo aos parágrafos de texto corrido das 9 páginas (relatório, artigo nas duas colunas, resumo, passos do POP, referências).
- [ ] **Step 4: Rodar** o check — Expected: PASS. Renderizar as 9 páginas e olhar justificação e hifenização, em especial artigo (páginas 4–6).
- [ ] **Step 5: Commit** `Documento A4: texto corrido justificado` e marcar no `progress.md`.

### Task 3: Deck no site

**Files:**
- Modify: `capitulos/8-templates/2-documentos-a4.html`

- [ ] **Step 1:** Trocar `<!--quadro templates/documento-a4/DocumentoA4.dc.html 1280x900-->` por `…794x1123-->`; texto "O modelo completo." vira "Setas passam as páginas." (passar pelo `humanizer`).
- [ ] **Step 2:** `python3 sistema.py` sem link quebrado; abrir `8-templates.html#s-documentos-a4` no navegador: quadro com uma página, sem coluna de miniaturas (`no-rail`), setas funcionam; em 375 px sem rolagem lateral.
- [ ] **Step 3: Commit** `Site 8.2: documento A4 como deck` e marcar no `progress.md`.
