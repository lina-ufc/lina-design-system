# Templates de documentos A4 — progresso

**Última atualização:** 2026-11-22, branch `main`. Nada deste conjunto commitado ainda. Índice: [`README.md`](README.md).

## Como atualizar este arquivo

1. Atualizar só depois que a checagem da tarefa passar.
2. Marcar o checkbox da tarefa e acrescentar o SHA curto do commit.
3. Atualizar a linha do plano na tabela de resumo (barra e contagem).
4. Acrescentar uma linha datada no changelog.
5. Tarefa adiada ou abandonada: checkbox desmarcado e o motivo na mesma linha.
6. Nunca marcar um plano como concluído com tarefa desmarcada.

## Resumo

`[░░░░░░░░░░]` 0% — 0 de 3 tarefas escritas.

| Plano | Progresso | Tarefas | Estado |
| --- | --- | --- | --- |
| 01 — html-deck | `[░░░░░░░░░░]` | 0/3 | Escrito 2026-11-22, a executar |
| 02 — word | `[░░░░░░░░░░]` | — | Não escrito. Escrito quando 01 terminar |
| 03 — latex | `[░░░░░░░░░░]` | — | Não escrito. Escrito quando 02 terminar |
| 04 — conferencia-e-release | `[░░░░░░░░░░]` | — | Não escrito. Escrito quando 03 terminar |
| 05 — site | `[░░░░░░░░░░]` | — | Não escrito. Escrito quando 04 terminar |

## Plano 01 — html-deck

`[░░░░░░░░░░]` 0% — 0 de 3 tarefas.

Branch `main`, base `a1a93a8` (mais a reorganização do site ainda sem commit).

- [ ] **Task 1** — Deck A4
- [ ] **Task 2** — Texto corrido justificado
- [ ] **Task 3** — Deck no site

Checagens que rodaram: nenhuma ainda.

## Estado herdado

- `DocumentoA4.dc.html` com 9 páginas soltas (sem deck), cartão "Como usar" e rótulos entre páginas.
- `sistema.py` já aceita `<!--quadro caminho LxA-->` dentro de fragmento.
- Reorganização do capítulo 8 e remoção das etiquetas de estado feitas, sem commit.

## Pendências do usuário

1. Commitar a reorganização do site (bloqueia só o commit do 01, não a execução).
2. Ok nas folhas de comparação (plano 04) antes da release.
3. Ok explícito para criar a tag `documentos-v1.0.0` e publicar.

## Changelog

- 2026-11-22 — Conjunto criado; spec aprovada; plano 01 escrito.
