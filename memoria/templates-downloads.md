---
name: templates-downloads
description: Capítulo 8 é a página de downloads; layouts numerados em 6 famílias; capítulo 9 Aplicações fora da navegação
type: regra
---

Decisões do usuário em 2026-11-22:

- O capítulo 8 mostra só templates (apresentação PowerPoint e HTML, documento A4) e serve para baixar. Aplicações não aparecem: o capítulo 9 saiu do `sistema.json` (página `9-aplicacoes.html` na Lixeira; os arquivos de exploração `Aplicações*.html` ficaram só na pasta arquivada do Drive).
- Layouts com nome `família.variação` (1 Abertura, 2 Texto, 3 Ícones, 4 Imagem, 5 Dados, 6 Encerramento). `build.js` ordena o master pelo número.
- O .potx tem só master e layouts, sem slides (pedido do usuário); o exemplo .pptx traz os slides. `post.py` gera os dois.
- Downloads: .potx, exemplo .pptx e .pdf, deck HTML em .zip editável e .zip de fontes e ícones (`downloads/empacotar.py`).
- O exemplo .pptx termina com quatro páginas de ícones aplicados (tratamentos e pares duotone) para copiar e colar, pedido do usuário. PNG com ladrilho embutido: o pptxgenjs não gera o PNG de reserva do SVG no Node, então SVG quebraria no Keynote, Google Slides e Impress.
- JetBrains Mono (Regular, Medium, Bold, TTF estáticos do repositório JetBrains, OFL) entrou em `assets/fonts` em 2026-11-22, com `OFL-JetBrainsMono.txt`; o `OFL.txt` é da Outfit.
