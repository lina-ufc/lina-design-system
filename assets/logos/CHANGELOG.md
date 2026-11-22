# Marca LINA — histórico de versões

A primeira linha `## x.y.z` é a versão atual. Release: tag `marca-vX.Y.Z`, gerada por `sh downloads/marca.sh --publicar`.

## 1.0.0 — 2026-11-22

Primeira versão do pacote de marca. Logos institucionais em release própria (`institucionais-v*`).

- `LINA-Marca.vectorcraft`: arquivo editável no VectorCraft, uma prancheta por forma (horizontal, vertical, símbolo, três vazados, selo experimental, assinaturas em bloco e lateral, PT e EN, com texto vivo (Outfit e JetBrains Mono)) e seis pranchetas de construção (célula, medidas, cantos, letras, espaçamento, grade). Paleta principal e auxiliar como amostras globais: editar uma amostra recolore o logo.
- `LINA-Logos.zip`: as 55 variações em SVG, PNG transparente (2000 px) e PDF.
- `LINA-Cores.ase`: paleta para VectorCraft, Affinity, Adobe e outros.
- Margem de meia célula entre a arte e a borda em todas as versões com fundo; nos vazados horizontal e vertical, até a borda da placa. Símbolo vazado e selo experimental ficam de fora.

## Como gerar

1. VectorCraft: novo documento; para cada forma, uma prancheta com o SVG `-ferro` de `assets/logos/sand/` colocado (Place, sem vínculo) e ajustada à arte. Construção: SVGs dos diagramas do capítulo 1, gerados a partir de `assets/lina-draw.js`.
2. Amostras: grupos `LINA principal` e `LINA auxiliar`, globais, com os nomes e valores de `tokens/colors.css`; a arte ligada a elas. Salvar como `downloads/LINA-Marca.vectorcraft` e a biblioteca como `downloads/LINA-Cores.ase`.
3. `sh downloads/marca.sh` e conferir; `--publicar` cria a tag e a release.
