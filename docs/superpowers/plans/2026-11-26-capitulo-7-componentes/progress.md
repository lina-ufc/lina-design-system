# Capítulo 7 · Componentes — progresso

**Última atualização:** 2026-11-26, branch `main`. Índice: [`README.md`](README.md).

## Como atualizar este arquivo

1. Atualizar só depois que a checagem da tarefa passar.
2. Marcar o checkbox da tarefa e acrescentar o SHA curto do commit (ou "sem commit" se o usuário ainda não pediu).
3. Atualizar a linha do plano na tabela de resumo (barra e contagem).
4. Acrescentar uma linha datada no changelog.
5. Tarefa adiada ou abandonada: checkbox desmarcado e o motivo na mesma linha.
6. Nunca marcar um plano como concluído com tarefa desmarcada.

## Resumo

`[███████░░░]` plano 01 concluído (`8eb2a05`); plano 02 concluído (sem commit).

| Plano | Progresso | Tarefas | Estado |
| --- | --- | --- | --- |
| 01 — molde-e-declaracao | `[██████████]` | 3/3 | Concluído (`8eb2a05`) |
| 02 — pecas-gerais | `[██████████]` | 6/6 | Concluído (sem commit) |
| 03 — pecas-do-slide | `[░░░░░░░░░░]` | — | Não escrito. Escrito quando o 02 terminar |

## Plano 01 — molde-e-declaracao

`[██████████]` 100% — 3 de 3 tarefas.

- [x] Tarefa 1 — script de recortes e imagens da 7.1 (`8eb2a05`)
- [x] Tarefa 2 — fragmento 7.1 e registro no `sistema.json` (`8eb2a05`)
- [x] Tarefa 3 — verificação e aprovação do molde pelo usuário (`8eb2a05`; molde aprovado 2026-11-26)

## Plano 02 — pecas-gerais

`[██████████]` 100% — 6 de 6 tarefas.

- [x] Tarefa 1 — 7.2 Tabela (sem commit)
- [x] Tarefa 2 — 7.3 Legenda e fonte (sem commit)
- [x] Tarefa 3 — 7.5 Passos (sem commit)
- [x] Tarefa 4 — 7.6 Nota (sem commit)
- [x] Tarefa 5 — 7.7 Cabeçalho e rodapé (sem commit)
- [x] Tarefa 6 — verificação e aprovação do usuário (aprovado 2026-11-26)

## Changelog

- 2026-11-26 — conjunto criado; spec aprovada; plano 01 escrito.
- 2026-11-26 — tarefas 1 e 2 feitas; nomes conferidos no código; desktop e 375 px sem corte. Figuras empilhadas em vez de `.comp-dupla` (A4 ficava ilegível). Decisões em `.superpowers/sdd/01-molde-e-declaracao/progress.md`.
- 2026-11-26 — molde aprovado pelo usuário. Regra de quantidade (uma por slide/página) removida da 7.1: frase do exemplo POP não é regra (`memoria/texto-de-exemplo-nao-e-regra.md`). Plano 01 concluído.
- 2026-11-26 — plano 01 commitado (`8eb2a05`). Plano 02 escrito: cinco seções, páginas de recorte conferidas com `pdftotext`. PDFs do A4 publicados são do LaTeX; não há PDF do Word.
- 2026-11-26 — tarefas 1 a 4 feitas e revisadas. Slide da 7.3 na p. 26 (só ela usa `comp.legenda`); sub da 7.5 trocado ("uma ação por passo" era texto de exemplo); `rule()` do slide mede em pt; PNG do script agora determinístico. Decisões em `.superpowers/sdd/02-pecas-gerais/progress.md`.
- 2026-11-26 — tarefa 5 feita. Verificação: nomes conferidos no código, script regenera sem mudar PNG (agora sem chunk de data), 1440 e 375 px sem corte. Capturas em `records/02-*.jpg`. Aguarda aprovação.
- 2026-11-26 — cinco seções aprovadas pelo usuário. Plano 02 concluído; falta commit.
