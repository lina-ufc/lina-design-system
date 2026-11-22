---
name: repositorio-github
description: DS saiu do Drive para ~/developer/lina-design-system (git, público); releases por template via tag; site no Pages
type: regra
---

Decisões do usuário em 2026-11-22:

- Fonte do Design System: `~/developer/lina-design-system`, repositório público `lina-ufc/lina-design-system`. A pasta do Drive (`LInA_GESTAO/IDENTIDADE VISUAL/LINA Design System`) deixou de ser fonte e foi arquivada em 2026-11-22 em `IDENTIDADE VISUAL/_obsoletos/LINA Design System [arquivado 2026-11-22]/` (com `ARQUIVADO.md`); no lugar ficou `LINA Design System - LEIA-ME.md` com os links do GitHub. Git dentro do Drive foi descartado (corrompe o `.git`).
- Versão por template: `templates/<nome>/CHANGELOG.md` (primeiro `## x.y.z` é a versão) e tag `<nome>-vX.Y.Z`. Só a apresentação tem release por enquanto.
- Arquivos gerados (.potx, .pptx, .pdf, deck HTML, img/, .zip, páginas do site) ficam fora do git; o GitHub Actions gera a release (`release-apresentacao.yml`) e o site (`site.yml`, que baixa os arquivos da release da versão do CHANGELOG).
- Deck CNR movido em 2026-11-22 para `LInA_DOCUMENTA/DocumentaCE/APRESENTAÇÕES/[2026-11-13] CNR - Digital transformation for cultural heritage/` (com LEIA-ME). Memórias `cnr-*` descrevem o estado antigo.
- Ficaram fora do repositório (só na pasta arquivada): artefatos do Claude Design (`_ds_*`, `.thumbnail`, `thumbnail.html`, `github.md`), explorações `Aplicações*.html` e `HANDOFF.md`.
