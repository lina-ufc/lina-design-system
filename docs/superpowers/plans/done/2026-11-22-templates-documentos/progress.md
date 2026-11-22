# Templates de documentos A4 — progresso

**Última atualização:** 2026-11-23, branch `main`. Spec e plano em `5624fcb`; execução em `main`. Índice: [`README.md`](README.md).

## Como atualizar este arquivo

1. Atualizar só depois que a checagem da tarefa passar.
2. Marcar o checkbox da tarefa e acrescentar o SHA curto do commit.
3. Atualizar a linha do plano na tabela de resumo (barra e contagem).
4. Acrescentar uma linha datada no changelog.
5. Tarefa adiada ou abandonada: checkbox desmarcado e o motivo na mesma linha.
6. Nunca marcar um plano como concluído com tarefa desmarcada.

## Resumo

`[██████████]` 100% — 18 de 18 tarefas. Conjunto concluído e movido para `done/`.

| Plano | Progresso | Tarefas | Estado |
| --- | --- | --- | --- |
| 01 — html-deck | `[██████████]` | 3/3 | Concluído 2026-11-22 |
| 02 — word | `[██████████]` | 4/4 | Concluído 2026-11-22 |
| 03 — latex | `[██████████]` | 4/4 | Concluído 2026-11-22; folhas aprovadas pelo usuário |
| 04 — conferencia-e-release | `[██████████]` | 4/4 | Concluído 2026-11-23; release `documentos-v1.0.0` |
| 05 — site | `[██████████]` | 3/3 | Concluído 2026-11-23; site publicado |

## Plano 01 — html-deck

`[██████████]` 100% — 3 de 3 tarefas.

Branch `main`, base `5624fcb`.

- [x] **Task 1** — Deck A4 — `83a069c`, check_html ok, 9 páginas vistas no navegador
- [x] **Task 2** — Texto corrido justificado — `114fd70`, 29 blocos `.tc`, hifenização vista em #4
- [x] **Task 3** — Deck no site — `150e2d8`, quadro 794×1123 sem miniaturas, setas ok, 375 px sem rolagem lateral

Checagens que rodaram: `check_html.py` (Tasks 1 e 2); `sistema.py` e navegador desktop/375 px (Task 3).

## Plano 02 — word

`[██████████]` 100% — 4 de 4 tarefas.

Branch `main`, base `7a35f7e`. API do `docx` 9.16: tem `fonts`, `hyphenation`, SVG com `fallback`, tabela `float`, `TOTAL_PAGES`, `language`, colunas e `titlePage`; estilos de tabela injetados no `styles.xml` (pós-processamento com `fflate`).

- [x] **Task 1** — Base e Relatório — `786a546`, check_word ok, validate ok, distorcidas 0, render 3 páginas; revisão: 2 Important corrigidos em `b230c54`
- [x] **Task 2** — Artigo — `b230c54`, check_word ok (4 arquivos), validate ok, render 3 páginas, Relatório sem regressão; revisão limpa (0 Important), Minors levados à Task 3
- [x] **Task 3** — POP — `87d4d7f`, check_word ok (6 arquivos), validate ok, render 3 páginas com "1 / 3"…"3 / 3", Relatório e Artigo sem regressão; revisão: 1 Important (cabeçalho a 13 px) corrigido em `4fd708d`
- [x] **Task 4** — Conferência e passagem para o 03 — `4fd708d`, folhas HTML × Word conferidas nos 3 modelos, handoff em [`records/02-word-handoff.md`](records/02-word-handoff.md)

## Plano 03 — latex

`[██████████]` 100% — 4 de 4 tarefas.

Branch `main`, base `543fe22`. TeX Live 2026 *basic* local: sem `tcolorbox`, `lastpage`, `svg`, `needspace`, `textpos`.

- [x] **Task 1** — Classe base, `latex.sh`, check e Relatório — `b472cb5`, check_latex ok (3 páginas A4, só Outfit/JetBrainsMono, 0 Overfull, compila em pasta vazia); revisão: 1 Important + 5 correções em `2b85ec8`
- [x] **Task 2** — Artigo — `3973f4e`, check_latex ok (3 modelos), Δ ≤ 4 pt contra o HTML salvo o resumo (hifenização); revisão: correções em `cbeacd8`
- [x] **Task 3** — POP — `bde6b1d`, check confere "1 / 3"…"3 / 3", Atenção com cantos de 11 px, mono 10 pt; revisão: correções em `cbeacd8`
- [x] **Task 4** — Conferência e passagem para o 04 — `4d4e425`, robustez ok (parágrafos e passo extras: só a quebra muda), folhas HTML × Word × LaTeX mostradas, handoff em [`records/03-latex-handoff.md`](records/03-latex-handoff.md)

## Plano 04 — conferencia-e-release

`[██████████]` 100% — 4 de 4 tarefas.

Branch `main`. PDFs de exemplo da release vêm do LaTeX; TeX Live do Ubuntu no runner; ensaio por `workflow_dispatch` antes da tag.

- [x] **Task 1** — `make.sh`, pacotes e `check_pacotes.py` — `73cc037`, `make.sh` 2× com `ok: 5 arquivos`, git status limpo; revisão: 1 Important (pipe mascarava `validate.py`) corrigido em `0f4d6a8`
- [x] **Task 2** — CHANGELOG e workflow — `aa2ac37`, YAML carrega, tag `documentos-v9.9.9` falha e `v1.0.0` passa, publicar só em tag; revisão limpa
- [x] **Task 3** — Teste de digitação no WordCraft — `5b65a21`, Relatório estável ao digitar; numeração do POP é texto literal; Artigo e POP diferem > 3 pt do LibreOffice (`tcMar` em `tblStylePr`), anotado no handoff 02
- [x] **Task 4** — Ensaio e release `documentos-v1.0.0` — ensaio verde (run 45073521188), artifact passa `check_pacotes.py`, PDFs do runner com mesmo texto e quebras dos locais; release publicada com os 5 arquivos (run 45081090119)

## Plano 05 — site

`[██████████]` 100% — 3 de 3 tarefas.

Branch `main`. Só o Baixar da 8.2 é gerado (`_gerar.py`); `site.yml` baixa a release `documentos-v*`.

- [x] **Task 1** — Baixar gerado e `site.yml` — `f0d4c7d`, `_gerar.py` 2× idêntico (`layouts 32`, `documentos 5`), falta de PDF erra, `RELEASE_URL_DOCUMENTOS` ok, YAML carrega, `sistema.py` ok
- [x] **Task 2** — Estrutura e Uso — `54c10c6`, revisão: 1 Important (cabeçalho do Word) corrigido antes do commit; texto aprovado pelo usuário; 375 px sem rolagem lateral
- [x] **Task 3** — Revisão, publicação e memória — `4cac200` + fechamento, run do site 45083528209 verde, 8.2 publicada com Versão 1.0.0 e 5 links da release (HTTP 200), memória `templates-downloads` atualizada

## Estado herdado

- `DocumentoA4.dc.html` com 9 páginas soltas (sem deck), cartão "Como usar" e rótulos entre páginas.
- `sistema.py` já aceita `<!--quadro caminho LxA-->` dentro de fragmento.
- Reorganização do capítulo 8 e remoção das etiquetas de estado feitas em `481558d`.

## Pendências do usuário

1. ~~Ok nas folhas de comparação~~ — dado em 2026-11-22 (folhas HTML × Word × LaTeX do plano 03).
2. ~~Ok explícito para criar a tag `documentos-v1.0.0` e publicar~~ — dado e publicado em 2026-11-23.

## Changelog

- 2026-11-23 — Minors adiados corrigidos: aria-label nos três "Tela cheia ↗", subtítulos Word/LaTeX como heading (role), "texto do rodapé" no Uso, LEIA-ME do zip LaTeX com menus atuais do Overleaf (release 1.0.1). "`LINA Destaque` sem uso" era falso: o exemplo usa o estilo (Relatório 3, Artigo 12; POP não tem ênfase no HTML).
- 2026-11-23 — Push e site publicado (run 45083528209). Plano 05 e conjunto concluídos; pasta e spec em `done/`. Minors adiados: três links "Tela cheia ↗" com o mesmo texto; subtítulos Word/LaTeX do Uso não são heading.
- 2026-11-23 — Task 2 (Estrutura e Uso) concluída, `54c10c6`. Minors adiados: LEIA-ME do zip LaTeX com menus antigos do Overleaf (1.0.1); "sigla do rodapé" imprecisa no Artigo.
- 2026-11-23 — Plano 05, Task 1 (Baixar gerado e `site.yml`) concluída, `f0d4c7d`.
- 2026-11-23 — Plano 05 (site) escrito.
- 2026-11-23 — Release `documentos-v1.0.0` publicada. Plano 04 concluído. Minors adiados: trap EXIT e saída do `validate.py` no `make.sh`; checagem A4 silenciosa no `check_pacotes.py`.
- 2026-11-22 — Task 3 (WordCraft) concluída, `5b65a21`.
- 2026-11-22 — Task 2 (CHANGELOG e workflow) concluída, `aa2ac37`.
- 2026-11-22 — Task 1 (make.sh e pacotes) concluída, `73cc037`, correção `0f4d6a8`.
- 2026-11-22 — Folhas HTML × Word × LaTeX aprovadas pelo usuário. Plano 04 escrito.
- 2026-11-22 — Task 4 concluída, `4d4e425`. Plano 03 concluído.
- 2026-11-22 — Tasks 2 e 3 (Artigo e POP) concluídas num só despacho, `3973f4e` e `bde6b1d`, correção `cbeacd8`. Word: espaçamentos alinhados ao HTML (`b6f1aa2`, `2225370`).
- 2026-11-22 — Task 1 (classe LaTeX e Relatório) concluída, `b472cb5`, correção `2b85ec8`.
- 2026-11-22 — Plano 03 (latex) escrito.
- 2026-11-22 — Task 4 concluída, `4fd708d`; correção da revisão da Task 3. Plano 02 concluído.
- 2026-11-22 — Task 3 (POP) concluída, `87d4d7f`; inclui Minors da revisão da Task 2.
- 2026-11-22 — Task 2 (Artigo) concluída, `b230c54`; inclui correções da revisão da Task 1.
- 2026-11-22 — Task 1 (base e Relatório) concluída, `786a546`.
- 2026-11-22 — Deck HTML dividido em três (Relatório, Artigo, POP), `7a35f7e`.
- 2026-11-22 — Pedido do usuário: deck dividido em três (Relatório, Artigo, POP), lado a lado na 8.2; `check_html.py` ok, desktop e 375 px conferidos.
- 2026-11-22 — Plano 02 (word) escrito.
- 2026-11-22 — Task 3 (deck no site) concluída, `150e2d8`. Plano 01 concluído.
- 2026-11-22 — Task 2 (texto justificado) concluída, `114fd70`.
- 2026-11-22 — Task 1 (deck A4) concluída, `83a069c`.
- 2026-11-22 — Reorganização do site commitada (`481558d`); execução do 01 aberta.
- 2026-11-22 — Conjunto criado; spec aprovada; plano 01 escrito.
