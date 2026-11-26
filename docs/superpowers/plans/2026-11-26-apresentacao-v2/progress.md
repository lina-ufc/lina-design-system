# Apresentação v2 — progresso

**Última atualização:** 2026-11-26, branch `main`. Índice: [`README.md`](README.md).

## Como atualizar este arquivo

1. Atualizar só depois que a checagem da tarefa passar.
2. Marcar o checkbox da tarefa e acrescentar o SHA curto do commit.
3. Atualizar a linha do plano na tabela de resumo (barra e contagem).
4. Acrescentar uma linha datada no changelog.
5. Tarefa adiada ou abandonada: checkbox desmarcado e o motivo na mesma linha.
6. Nunca marcar um plano como concluído com tarefa desmarcada.

## Resumo

`[███░░░░░░░]` planos 01 e 02 concluídos; 03 escrito.

| Plano | Progresso | Tarefas | Estado |
| --- | --- | --- | --- |
| 01 — base-e-abertura | `[██████████]` | 2/2 | Concluído 2026-11-26 |
| 02 — texto-e-icones | `[██████████]` | 4/4 | Concluído 2026-11-26 |
| 03 — imagem | `[░░░░░░░░░░]` | 0/3 | Escrito |
| 04 — dados-e-fim | `[░░░░░░░░░░]` | — | Não escrito |
| 05 — deck-html | `[░░░░░░░░░░]` | — | Não escrito |
| 06 — site-e-versao | `[░░░░░░░░░░]` | — | Não escrito |

## Plano 01 — base-e-abertura

`[██████████]` 100% — 2 de 2 tarefas.

- [x] **Task 1** — Núcleo paramétrico (`param.js`) e `check.js` — `60e3fcb`, check ok
- [x] **Task 2** — Família 1 no `build.js`, aliases, exemplo e render — `bb4a62e`, validate ok (.pptx e .potx), distorcidas 0, check ok, 10 páginas vistas; DECK com os 4 nomes antigos gera

Desvios: `1.2 Capa` com `Autores *` vale no mínimo 2 autores; título longo vai como trecho com `fontSize` 56 (HTML e .pptx); `Número i` do sumário com 80 px; `s()` não devolve `sl` (decks usam o 3º argumento); chave de `fill` sem placeholder dá erro em todos os layouts.

## Plano 02 — texto-e-icones

`[██████████]` 100% — 4 de 4 tarefas.

- [x] **Task 1** — Ajustes do núcleo: N pelas chaves, `itens` devolvido, imagem do fill na caixa do placeholder — `941842b`, check ok
- [x] **Task 2** — Família 2 (2.1–2.6) e aliases — `b29b46e`, validate ok, distorcidas 0, check ok, prancha vista
- [x] **Task 3** — Família 3 (3.1–3.3) e aliases — `40fd4e0`, idem; deck descartável com 12 marcos, 7 etapas e lista de 7 sem sobreposição
- [x] **Task 4** — Componentes e slides de componentes — `5b4c1ec`, idem; HTML visto pelo orquestrador no plano 05

Desvios: rótulo da declaração A em damasco (turquesa sobre turquesa fundo dava 2,6:1); `2.1` e `2.6` continuam em `layout()`; formas redondas e vazadas também no `obj()` do `html.js`; `post.py` dá fundo nata a `Ilustração i`; `comp` vai ao `DECK`.

## Plano 03 — imagem

`[░░░░░░░░░░]` 0% — 0 de 3 tarefas.

- [ ] **Task 1** — Imagem no fill: `cover`, `fit`, vídeo
- [ ] **Task 2** — Família 4 (4.1–4.8) e aliases
- [ ] **Task 3** — Degradês da 4.7 · título

## Changelog

- 2026-11-26 — conjunto criado; plano 01 escrito.
- 2026-11-26 — plano 01 concluído (`60e3fcb`, `bb4a62e`); plano 02 escrito.
- 2026-11-26 — plano 02 concluído (`941842b`…`5b4c1ec`); plano 03 escrito.
