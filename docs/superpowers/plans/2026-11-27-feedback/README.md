# Feedback do site

Spec: [`../../specs/2026-11-27-feedback-design.md`](../../specs/2026-11-27-feedback-design.md)
(abordagem B: formulário próprio no site envia para um Apps Script na planilha do drive compartilhado da UFC;
aprovado pelo dono em 2026-11-27).

Estado vivo: [`progress.md`](progress.md). Um subplano escrito por vez (`CLAUDE.md` §9).

## Ordem

| # | Subplano | Depende de | Status |
| --- | --- | --- | --- |
| 01 | [Acesso anônimo e Apps Script](01-apps-script.md) | — | Escrito |
| 02 | Página `feedback.html` e envio (`assets/lina-feedback.js`) | 01 (URL publicada) | Não escrito |
| 03 | Entradas: bloco na página inicial, link "Apontar erro nesta página" no menu, chave `feedback` em `sistema.json` | 02 | Não escrito |
| 04 | Verificação final, texto (`design:ux-copy`), acessibilidade, aprovação do dono | 03 | Não escrito |

01 começa com um teste que só o dono faz: se o Workspace da UFC não permitir acesso de "Qualquer pessoa", o
conjunto troca para a abordagem A (Google Forms) antes de qualquer código.
