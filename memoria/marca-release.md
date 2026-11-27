---
name: marca-release
description: Release de marca (tag marca-vX.Y.Z) gerada na máquina local por downloads/marca.sh; .vectorcraft e .ase fora do git
type: projeto
---

Pacote de marca vai como release versionada (tag `marca-vX.Y.Z`), separada da apresentação.
Decisão do usuário (2026-11-22): um arquivo por forma no repositório era ruim; tudo em release.

- Conteúdo: `LINA-Marca.vectorcraft` (pranchetas por forma + construção, cores como amostras
  globais ligadas), `LINA-Cores.ase`, `LINA-Logos.zip` (SVG, PNG 2000 px, PDF).
- Logos institucionais em release própria (decisão 2026-11-22): tag `institucionais-vX.Y.Z`,
  `downloads/institucionais.sh`, CHANGELOG em `assets/logos-institutions/`. Desde 2.0.0:
  SVG por instituição em `assets/logos-institutions/<inst>/` (no git), convertidos dos .ai/.eps
  oficiais com pdftocairo; sem .vectorcraft. FUNCAP só PNG (sem vetor oficial online).
  LED e Inovação Patrimônio ficaram de fora por decisão do usuário.
- `sh downloads/marca.sh` gera os zips; `--publicar` cria tag e release. Roda local: o
  GitHub Actions não tem o VectorCraft. Versão lida de `assets/logos/CHANGELOG.md`.
- `.vectorcraft`, `.ase` e `downloads/institucionais/` ficam fora do git (só na release).
- Armadilha: importar `.af` (Affinity) no VectorCraft perde cantos arredondados; partir dos SVG.
- Links de download em `capitulos/logotipo/8-combinacoes-de-cores.html` e
  `capitulos/cores/8-principal-com-auxiliar.html` apontam para a tag; ao publicar versão nova,
  atualizar os links no mesmo commit.
