---
name: moldura-9-faixas
description: Moldura de 9 faixas do site-lina aplicada a todos os capítulos (2026-11-27): decisões do dono
type: projeto
---
Aplicada em `site.css` (bloco "moldura de 9 faixas", só acima de 820 px; celular segue o B1) em 2026-11-27.
Origem: `~/Developer/site-lina`, `docs/design/prototype/Guia de linguagem.md`. Mapa da home vira tabela;
página "em breve" vira uma célula.

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

**How to apply:** peça nova dentro de seção: subdivisão com `--fio-forte` de ponta a ponta, nunca quadro.
Conferir no navegador aberto; `prototipo/render.sh` leva ~50 s por página e trava em `templates.html`.
