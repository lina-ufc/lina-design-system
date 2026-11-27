# Revisão do site do sistema

Spec: [`../../specs/2026-11-26-revisao-site-diagnostico.md`](../../specs/2026-11-26-revisao-site-diagnostico.md)
(diagnóstico, opções e decisões de 2026-11-26: A1 quatro partes, B1 manual de construção,
C1 ferramenta dentro do fundamento, D1 fonte única para agentes).

Estado vivo: [`progress.md`](progress.md). Um subplano escrito por vez (`CLAUDE.md` §9).

## Ordem

| # | Subplano | Depende de | Status |
| --- | --- | --- | --- |
| 01 | [Motores e linha de comando](01-motores.md) | — | Completo (branch `revisao-site/01-motores`) |
| 02 | [Protótipo visual B1 da página Logotipo](02-prototipo-visual.md) | — | Completo (mesclado na main) |
| 03 | [Fonte única de tokens, `SKILL.md` índice, `llms.txt`](03-fonte-unica.md) | 01 | Completo (mesclado na main) |
| 04 | [Estrutura em quatro partes, molde único de seção, redirecionamentos](04-estrutura.md) | 02 aprovado | Em execução |
| 05 | Aplicar o visual aprovado a todas as páginas; revisão de acessibilidade | 02, 04 | Não escrito |
| 06 | Ferramentas no site: padrões (Padrões), filtro (Imagem), editor de células (Logotipo) | 01, 05 | Não escrito |
| 07 | Conteúdo novo: uso do logo, grid e espaço, imagem, voz (rascunhos para o dono decidir) | 04 | Não escrito |
| 08 | Arquivar `lina-ufc/lina-visual-code` com link para cá | 06 | Não escrito |

01 e 02 podem andar em paralelo.
