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

`[█████████░]` planos 01–05 concluídos; 06 em 3/4 (falta publicar).

| Plano | Progresso | Tarefas | Estado |
| --- | --- | --- | --- |
| 01 — base-e-abertura | `[██████████]` | 2/2 | Concluído 2026-11-26 |
| 02 — texto-e-icones | `[██████████]` | 4/4 | Concluído 2026-11-26 |
| 03 — imagem | `[██████████]` | 3/3 | Concluído 2026-11-26 |
| 04 — dados-e-fim | `[██████████]` | 3/3 | Concluído 2026-11-26 |
| 05 — deck-html | `[██████████]` | 3/3 | Concluído 2026-11-26 |
| 06 — site-e-versao | `[████████░░]` | 3/4 | Aguardando aval para push e tag |

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

`[██████████]` 100% — 3 de 3 tarefas.

- [x] **Task 1** — Imagem no fill: `cover`, `fit`, vídeo — `9dfd301`, check ok; vídeo testado em deck descartável (loop no .pptx, poster no PDF, sem caixa cinza)
- [x] **Task 2** — Família 4 (4.1–4.8) e aliases — `e86e474`, validate ok, distorcidas 0, check ok, prancha vista; aliases 4.x testados com caixa antiga e nova
- [x] **Task 3** — Degradês da 4.7 · título — `8eae1de`, `gradFill` no `post.py` (layout e slides), visto no PDF; PowerPoint não conferido

Desvios: exemplo 4.4 com imagem (sem mp4 no repo); `fit` e vídeo soltos, placeholder vazio; hook `arranja(dim, n)` para 4.5 e 4.1 recuada; passo `prepara()` antes do replay; helper `img(box)` saiu de todo o exemplo; equipe de 14 em 2 linhas de 7.

## Plano 04 — dados-e-fim

`[██████████]` 100% — 3 de 3 tarefas.

- [x] **Task 1** — Família 5 e bugs de gráfico e tabela — `3a46ef8`, validate ok, distorcidas 0, check ok, prancha vista; HTML: 2 séries, tabela destacada e seta conferidos
- [x] **Task 2** — Família 6 (encerramentos) — `e32992e`, idem; deck descartável com 1, 12 autores e 4 logos; HTML conferido pelo orquestrador
- [x] **Task 3** — Páginas de ícones 7.1 e 7.2 no exemplo (HTML, PDF e .pptx) — `cd489b2`, idem; 63 slides

Desvios: `html.js` lia `labels` embrulhado pelo pptxgenjs (`labels.flat()`); só `5.3` virou FAM; `comp.tabela` com `box`; seta do antes e depois é PNG (`gen/seta-ferro.png`); `6.1` mantém exemplo de 2 logos; N do `6.2` pelo maior entre linhas e chaves `Autores i`; páginas de ícones usam `2.6 Só título`; ícones faltantes não baixados; PowerPoint não conferido.

## Plano 05 — deck-html

`[██████████]` 100% — 3 de 3 tarefas.

- [x] **Task 1** — Notas e idioma — `9d7f27b`, validate ok, distorcidas 0, check ok (lang, `#speaker-notes` 63 = 63 seções); `notesSlide` no .pptx
- [x] **Task 2** — Apresentador e transições — `59ca189`, idem; N com stub de `window.open` (nota, começo da próxima, miniaturas, cronômetro); transições sem `scale(` em texto; orquestrador confirmou `window.open` no navegador
- [x] **Task 3** — Pacote offline — `0f912e5`, idem; zip servido por HTTP com `local()` removido: cinco fontes `loaded`

Desvios: interface do apresentador em português; `prepara()` passa `alt` adiante; `site.yml` copia `fonts.css`, `fonts/`, `apresentador.js` e `transicao.js` da release, e o passo falha até sair release nova (plano 06); `LINA-Fontes.zip` passa a levar STIX; não testados: popup real, `prefers-reduced-motion`, trama no Chrome headless, PowerPoint.

## Plano 06 — site-e-versao

`[████████░░]` 75% — 3 de 4 tarefas.

- [x] **Task 1** — Regressão local CNR e Vision — `f56b38c`, 6 decks geram com a mesma contagem de slides; 3 quebras corrigidas no `build.js`; make ok; registro em [`records/06-regressao.md`](records/06-regressao.md)
- [x] **Task 2** — README do template e CHANGELOG 2.0.0 — `61e5098`
- [x] **Task 3** — Página 8.1 do site e print do apresentador — `63790b2` + ajuste de texto do orquestrador; `sistema.py` 27 links ok; 375 px sem rolagem lateral; print em `capitulos/8-templates/img/apresentador.png`
- [ ] **Task 4** — Revisão e pedido de publicação — revisão manual feita (desktop e 375 px; skills de crítica não rodadas); push e tag aguardam o usuário

Desvios: `1.1 Abertura` continua no template (só a variação "logo" saiu; Review Focus do plano estava errado); `pres` do `DECK` virou Proxy para o `notes()` do Vision; letreiro grande no slide 4 do CNR vem de SVG refeito em `1a4cf6c` (peça do deck, não do gerador); hora do print em formato do Chrome headless.

## Changelog

- 2026-11-26 — conjunto criado; plano 01 escrito.
- 2026-11-26 — plano 01 concluído (`60e3fcb`, `bb4a62e`); plano 02 escrito.
- 2026-11-26 — plano 02 concluído (`941842b`…`5b4c1ec`); plano 03 escrito.
- 2026-11-26 — plano 03 concluído (`9dfd301`, `e86e474`, `8eae1de`); plano 04 escrito.
- 2026-11-26 — plano 04 concluído (`3a46ef8`, `e32992e`, `cd489b2`); plano 05 escrito.
- 2026-11-26 — plano 05 concluído (`9d7f27b`, `59ca189`, `0f912e5`); plano 06 escrito.
- 2026-11-26 — plano 06 tarefas 1–3 concluídas (`f56b38c`, `61e5098`, `63790b2`); publicação aguarda o usuário.
