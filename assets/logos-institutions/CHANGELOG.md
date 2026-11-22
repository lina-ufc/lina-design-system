# Logos institucionais — histórico de versões

A primeira linha `## x.y.z` é a versão atual. Release: tag `institucionais-vX.Y.Z`, gerada por `sh downloads/institucionais.sh --publicar`. Separada da marca LINA (`assets/logos/CHANGELOG.md`).

## 2.0.0 — 2026-11-22

Acervo ampliado e padronizado, a partir dos arquivos oficiais de cada instituição.

- Onze instituições, uma pasta cada: UFC, IAUD, PPGAUD, PPGEC, CNPq, FUNCAP, SECULT, Cientista Chefe Cultura, LAREB, Documenta CE e Rede Documenta.
- Cada logo em SVG, PNG (2000 px) e PDF, com nome `<instituição>-<forma>-<cor>`.
- FUNCAP só em PNG: não há vetor oficial publicado. Versões brancas da UFC só em PNG.
- Sai o `.vectorcraft`: os `.ai` originais foram convertidos em SVG.

## 1.0.0 — 2026-11-22

Primeira versão do pacote institucional, antes incluído na release `marca-v1.0.0`.

- `Logos-Institucionais.zip`: UFC (brasões 1, 3 e 4), IAUD e PPGAUD em VectorCraft, PNG e SVG brancos.

## Como gerar

1. Logos em `assets/logos-institutions/<instituição>/`: SVG quando houver vetor, PNG quando só houver raster. Os `.ai`/`.eps`/`.pdf` oficiais se convertem com `pdftocairo -svg` (`.eps` passa antes por `gs -sDEVICE=pdfwrite -dEPSCrop`), recortando o `viewBox` à arte.
2. `sh downloads/institucionais.sh` e conferir; `--publicar` cria a tag e a release.
