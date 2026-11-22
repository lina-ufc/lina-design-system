---
name: runtime-descarta-atributos-video
description: Runtime do deck HTML (DeckCraft) descarta loop, muted, controls e on* do <video> e larguras de <col>
type: projeto
---

2026-11-13: no `.dc.html`, o runtime recria os slides e o `<video>` fica só com `src`, `poster`, `autoplay`,
`playsinline`, `style`. Sem `muted`, o Chrome bloqueia o autoplay; handler inline (`oncanplay`) também some.
Solução em `potx/html.js`: laço no `componentDidMount` que pega `video[autoplay]`, mete `muted`/`loop` e dá play
só no slide ativo. Por isso o vídeo do slide 7 (com `controls`) aparece sem controles no HTML.
Testar com Chrome real (`executablePath` do Google Chrome): o headless shell do Playwright não toca H.264.

2026-11-13: também descarta `<colgroup>/<col>` de tabela (colunas ficavam iguais). `html.js` põe `width` em cada `<td>`.
