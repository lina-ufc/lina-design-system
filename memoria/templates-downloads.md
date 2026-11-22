---
name: templates-downloads
description: Capítulo 8 é a página de downloads; layouts numerados em 6 famílias; capítulo 9 Aplicações fora da navegação
type: regra
---

Decisões do usuário em 2026-11-22:

- O capítulo 8 mostra só templates (apresentação PowerPoint e HTML, documento A4) e serve para baixar. Aplicações não aparecem: o capítulo 9 saiu do `sistema.json` (página `9-aplicacoes.html` na Lixeira; os arquivos de exploração `Aplicações*.html` ficaram só na pasta arquivada do Drive).
- Layouts com nome `família.variação` (1 Abertura, 2 Texto, 3 Ícones, 4 Imagem, 5 Dados, 6 Encerramento). `build.js` ordena o master pelo número.
- O .potx tem só master e layouts, sem slides (pedido do usuário); o exemplo .pptx traz os slides. `post.py` gera os dois.
- Downloads da apresentação: .potx, exemplo .pptx e .pdf, deck HTML em .zip editável. Fontes e ícones saíram daqui (2026-11-22): cada um na página do seu capítulo, com referência cruzada (ver [[padrao-explicacao-download]]).
- Grade de miniaturas dos layouts removida (2026-11-22): o exemplo aparece como deck HTML no quadro, sem a coluna de miniaturas (`?_snthumb=1` liga o `no-rail` do deck-stage).
- O exemplo .pptx termina com quatro páginas de ícones aplicados (tratamentos e pares duotone) para copiar e colar, pedido do usuário. PNG com ladrilho embutido: o pptxgenjs não gera o PNG de reserva do SVG no Node, então SVG quebraria no Keynote, Google Slides e Impress.
- JetBrains Mono (Regular, Medium, Bold, TTF estáticos do repositório JetBrains, OFL) entrou em `assets/fonts` em 2026-11-22, com `OFL-JetBrainsMono.txt`; o `OFL.txt` é da Outfit.
- 8.2 Documentos A4 (2026-11-23): downloads são os 5 arquivos da release `documentos-vX.Y.Z` (Word .zip, LaTeX .zip, três PDFs de exemplo do LaTeX). Só o bloco Baixar é gerado pelo `capitulos/8-templates/_gerar.py` (reescreve tudo depois de `Baixar</h2>`); Estrutura, Exemplo e Uso são escritos à mão no fragmento. O `site.yml` baixa a release e passa `RELEASE_URL_DOCUMENTOS`.
