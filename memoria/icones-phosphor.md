---
name: icones-phosphor
description: Phosphor escolhido como sistema de ícones (2026-11-22); pixel/do zero rejeitados; duotone com 2ª cor da paleta
type: regra
---

2026-11-22: o usuário escolheu o **Phosphor** (MIT) como sistema de ícones, entre Lucide, Tabler e Phosphor.
Motivo: as seis variações de peso, em especial o duotone.

Rejeitado ("ficaram terríveis"): Lucide convertido para pixel com cantos do logo, redesenho pixel e família
desenhada do zero em blocos. Não repropor ícone pixelado.

Duotone LINA: a camada `opacity="0.2"` recebe uma segunda cor cheia da paleta, seguindo os pares de contraste.
Capítulo 6 gerado por `capitulos/6-icones/_gerar.py` (SVG embutido); depois rodar `sistema.py`.

Docs atualizados (README §6, SKILL.md, CLAUDE.md, assets/icons/README.md). Template de slides migrado (2026-11-22):
`build.js` mantém os nomes Lucide como chave e mapeia para Phosphor regular (`PH_NOME`); o hook copia
`assets/icons/phosphor/regular` para o build. PNGs de ícone em `templates/apresentacao/img/` trocados (afeta o deck
HTML do CNR, mesmos nomes). Cópias Lucide antigas na Lixeira (`template-lucide-2026-11-22`).
Pastas legadas `lucide/`, `lina-24/`, `pictogramas-48/` apagadas em 2026-11-22. O deck CNR (fora deste repo) não foi rebuildado.
