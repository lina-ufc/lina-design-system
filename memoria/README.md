# Memória do projeto

Índice. Uma linha por memória. Regras de escrita em `CLAUDE.md` §6.

- [nunca-distorcer-imagens](nunca-distorcer-imagens.md) — Recortar, nunca esticar; bug do cover no pptxgenjs; rodar aspect.py
- [enquadramento-equipe](enquadramento-equipe.md) — Equipe: cabeça inteira, mesma escala, olhos numa linha; slide único via headGrid
- [simbolos-matematicos](simbolos-matematicos.md) — Símbolos matemáticos em STIX Two Math; Neometric e Outfit não têm grego
- [cnr-sem-secoes](cnr-sem-secoes.md) — Deck CNR não tem seções: sem slide de seção, rodapé só com título
- [cnr-nomes-encerramento](cnr-nomes-encerramento.md) — Encerramento CNR: nomes em coluna única; empilhado com Prof. rejeitado
- [rebuild-sobrescreve-deckcraft](rebuild-sobrescreve-deckcraft.md) — Rebuild sobrescreve PPTX aberto no DeckCraft; perguntar antes
- [backup-antes-de-script](backup-antes-de-script.md) — Copiar cnr.js antes de edição por script; já perdeu bloco
- [variantes-no-html-cnr](variantes-no-html-cnr.md) — Variante pedida vai direto para Apresentacao-CNR.dc.html no Drive
- [economia-tokens](economia-tokens.md) — Revisar slides com prever.sh; não ler HTML gerado nem imagens grandes
- [cnr-estado](cnr-estado.md) — Estado do deck CNR; PPTX/PDF desatualizados, pendências
- [logos-pendencias](logos-pendencias.md) — Logos novos (vazados, avatar, selo, assinaturas) aguardam aprovação; decisões abertas
- [runtime-descarta-atributos-video](runtime-descarta-atributos-video.md) — HTML do deck perde loop/muted/controls do vídeo; laço em html.js toca
- [python-313-checagens](python-313-checagens.md) — validate/aspect quebram no python3 3.9; usar 3.13 do anaconda no PATH
- [deck-fora-do-browser-vscode](deck-fora-do-browser-vscode.md) — Deck no browser integrado do VS Code vaza memória e derruba o VS Code; usar Chrome
- [pptx-videos-fontes](pptx-videos-fontes.md) — post.py embute fontes (EOT) e põe vídeos em autoplay/loop/mudo; falta testar no PowerPoint
- [ds-fonte-local](ds-fonte-local.md) — Sem sync com Claude Design; desenvolver nesta pasta; artefatos _ds_* deixam de ser fonte
- [ds-documento-skill](ds-documento-skill.md) — Visão: documento único incremental (marca + aplicações) que é também a skill
- [fonte-outfit](fonte-outfit.md) — Outfit (OFL) substituiu a Neometric (licença só webfont) em 2026-11-22; CNR ainda em Neometric
- [ds-capitulos-paginas](ds-capitulos-paginas.md) — Documento em páginas por capítulo (fragmentos em capitulos/); home é o Preâmbulo; links entre seções com "Citado em"
- [fotos-referencia-cores](fotos-referencia-cores.md) — Ideia futura: fotos por cor na 2.2; curadoria do usuário, não buscar
- [icones-phosphor](icones-phosphor.md) — Phosphor adotado (2026-11-22); pixel rejeitado; duotone com 2ª cor; template migrado, CNR não rebuildado
- [templates-downloads](templates-downloads.md) — Cap. 8 = downloads; layouts numerados em 6 famílias; páginas de ícones no exemplo; cap. 9 fora
- [repositorio-github](repositorio-github.md) — Fonte em ~/developer/lina-design-system (GitHub público); releases por tag de template; site no Pages; CNR movido
