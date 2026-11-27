---
name: moldura-9-faixas
description: Teste da moldura de 9 faixas do site-lina nos capítulos (2026-11-27): decisões do dono; ainda não aplicada
type: projeto
---
Teste em `prototipo/moldura.css`, carregado só em páginas `_teste-<capitulo>.html` (cópia do capítulo com
um `<link>` a mais; ignoradas pelo git). Origem: `~/Developer/site-lina`, `docs/design/prototype/Guia de linguagem.md`.
Ainda não aplicado aos capítulos (2026-11-27).

Decisões do dono:
- Estética de tabela: seções coladas, fio `--fio-forte` em volta; tudo dentro da célula é subdivisão dela
  (ex.: lista de downloads com linhas de ponta a ponta, sem o fio grosso umbro duplicado).
- **Nenhum quadro com borda dentro de uma célula** (prancha sem borda).
- Menu lateral integrado: a borda dele é a vertical esquerda da moldura; fio sob logo + "Sistema de design".
  Recusado alinhar esse fio com o do cabeçalho do capítulo (altura fixa de 5 células).
- Faixa 1 **só para números**; rótulos ("Por quê") e subtítulos ficam na coluna de conteúdo.
- Número = metade do tamanho do título, JetBrains Mono 800, alinhado pelo topo (altura das maiúsculas)
  com o título (`text-box: trim-start cap alphabetic`).
- Fio grosso da navegação "← anterior / próximo →" fica.

**Why:** pedidos do dono ao revisar renders do teste em Logotipo e Cores.

**How to apply:** ao levar a moldura para `site.css`, seguir estas regras; renderizar com
`prototipo/render.sh` e mostrar antes de aplicar em tudo.
