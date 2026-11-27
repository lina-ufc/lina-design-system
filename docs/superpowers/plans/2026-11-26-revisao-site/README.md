# Revisão do site do sistema

Spec: [`../../specs/2026-11-26-revisao-site-diagnostico.md`](../../specs/2026-11-26-revisao-site-diagnostico.md)
(diagnóstico, opções e decisões de 2026-11-26: A1 quatro partes, B1 manual de construção,
C1 ferramenta dentro do fundamento, D1 fonte única para agentes).
Feedback (07–10): [`../../specs/2026-11-27-feedback-design.md`](../../specs/2026-11-27-feedback-design.md)
(abordagem B: formulário próprio no site envia para um Apps Script na planilha do drive compartilhado da UFC;
aprovado pelo dono em 2026-11-27). Mesclado neste conjunto em 2026-11-27 (era `2026-11-27-feedback/`).

Estado vivo: [`progress.md`](progress.md). Um subplano escrito por vez (`CLAUDE.md` §9).

## Ordem

| # | Subplano | Depende de | Status |
| --- | --- | --- | --- |
| 01 | [Motores e linha de comando](01-motores.md) | — | Completo (mesclado na main) |
| 02 | [Protótipo visual B1 da página Logotipo](02-prototipo-visual.md) | — | Completo (mesclado na main) |
| 03 | [Fonte única de tokens, `SKILL.md` índice, `llms.txt`](03-fonte-unica.md) | 01 | Completo (mesclado na main) |
| 04 | [Estrutura em quatro partes, molde único de seção, redirecionamentos](04-estrutura.md) | 02 aprovado | Completo (mesclado na main) |
| 05 | [Visual B1 em todas as páginas, molde nos capítulos, acessibilidade](05-visual.md) | 02, 04 | Completo (mesclado na main) |
| 06 | [Ferramentas no site: padrões (Padrões), filtro (Imagem), editor de células (Logotipo)](06-ferramentas.md) | 01, 05 | Completo (mesclado na main) |
| 07 | [Feedback: acesso anônimo e Apps Script](07-feedback-apps-script.md) | — | Completo (mesclado na main) |
| 08 | [Feedback: página `feedback.html` e envio (`assets/lina-feedback.js`), chaves `feedback` e `feedback_url` em `sistema.json`](08-feedback-pagina.md) | 07 (URL publicada) | Completo (mesclado na main) |
| 09 | [Feedback: bloco na página inicial, link "Apontar erro nesta página" no menu](09-feedback-entradas.md) | 08 | Completo (mesclado na main) |
| 10 | [Feedback: texto (`design:ux-copy`), acessibilidade, verificação final, aprovação do dono](10-feedback-final.md) | 09 | Escrito |
| 11 | Conteúdo novo: uso do logo, grid e espaço, imagem, voz (rascunhos para o dono decidir) | 04 | Não escrito |
| 12 | Arquivar `lina-ufc/lina-visual-code` com link para cá | 06 | Não escrito |

Executar em sequência, 07 a 12. 07 começa com um teste que só o dono faz: se o Workspace da UFC não
permitir acesso de "Qualquer pessoa", o feedback troca para a abordagem A (Google Forms) antes de qualquer código.
