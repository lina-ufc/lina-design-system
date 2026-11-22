---
name: deck-fora-do-browser-vscode
description: Não abrir o deck HTML no browser integrado do VS Code; vaza memória e derruba o VS Code
type: projeto
---

Deck HTML aberto no browser integrado do VS Code 1.146 vaza ~50 MB/s de memória compartilhada no processo principal (aba com vídeos/animação), até `RangeError: Array buffer allocation failed` e o VS Code fechar sozinho (~30 min). Confirmado em 2026-11-13: fechar as abas `Apresentacao*.dc.html` parou o vazamento. Mecanismo (2026-11-13, dumps do Crashpad + lsof): os 3 `<video autoplay loop>` (`img/*.mp4`, 21–28 MB) ficam abertos ~900 vezes cada no processo principal; ArrayBuffers chegam a ~8,5 GB e o V8 aborta em `v8::ArrayBuffer::New`. A aba volta restaurada quando o VS Code reabre, e o ciclo se repete.

Abrir o deck no Chrome/Safari, ou deixar o Playwright fazer o render.
