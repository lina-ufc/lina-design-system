---
name: pptx-videos-fontes
description: post.py embute fontes (EOT em .fntdata) e põe vídeos em autoplay/loop/mudo; não verificado no PowerPoint
type: projeto
---

2026-11-13: usuário quer PPTX o mais próximo possível do HTML. `potx/post.py` agora:
- renumera `cNvPr` por slide (pptxgenjs repetia id com mídia);
- vídeos começam sozinhos, sem som, em loop (`p:timing` com `playFrom` + `cMediaNode repeatCount="indefinite"`);
- embute Outfit Light/Medium/ExtraBold (desde 2026-11-22; antes Neometric) e JetBrains Mono (de `LINA_FONTS` ou `~/Library/Fonts`) como EOT
  em `ppt/fonts/*.fntdata`. Outfit é TTF, OFL, fsType 0: embutir permitido.

Verificado: validate.py passa; LibreOffice (não enxerga ~/Library/Fonts) passou de Linux Libertine para Neometric.
Não verificado no PowerPoint (não instalado nesta máquina): conferir autoplay e fontes ao abrir lá.
