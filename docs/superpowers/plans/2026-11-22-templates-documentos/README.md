# Templates de documentos A4 — conjunto de planos

Spec: [`../../specs/2026-11-22-templates-documentos-design.md`](../../specs/2026-11-22-templates-documentos-design.md)
(inclui o mapa de estilos comum a Word e LaTeX). Estado de cada tarefa: [`progress.md`](progress.md).

Ordem de leitura e execução. 01 a 04 estão escritos; cada seguinte é escrito quando o anterior
termina, já com o que ele ensinou.

| Plano | Entrega |
|---|---|
| [01 — html-deck](01-html-deck.md) | HTML de referência como deck A4, texto justificado, deck no site |
| [02 — word](02-word.md) | Gerador Node (`docx`): base + Relatório, Artigo e POP em `.dotx` e `.docx` de exemplo, com `check_word.py` |
| [03 — latex](03-latex.md) | `lina.cls` com opções `relatorio`, `artigo`, `pop`, três `.tex` de exemplo, `latex.sh` |
| [04 — conferencia-e-release](04-conferencia-e-release.md) | `make.sh` e pacotes, CHANGELOG, workflow `documentos-v*` com ensaio, teste no WordCraft, release 1.0.0 |
| 05 — site | Seção 8.2 completa (Estrutura, Exemplo, Uso, Baixar) e memória |

Registros de execução em [`records/`](records/).
