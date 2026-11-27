---
name: a-do-logo
description: O "A" do logotipo tem sempre cor ligeiramente diferente das outras letras; em ferro, é umbro
type: regra
---

Decisão do usuário em 2026-11-22: o "A" do LINA tem sempre uma cor ligeiramente diferente das
outras letras. Representa a sobreposição de palavras com A (arte, arquitetura, ambiente).

Logo em ferro: "A" em umbro `#2A1A12` (como já vinha em `assets/logos/sand/lina-horizontal-ferro.svg`).
Antes o HTML dos documentos A4, a seção `templates.html#s-documentos-a4` e o preâmbulo (hoje o capítulo Princípios) usavam ferro-fundo `#6E1408`; trocado
para umbro no mesmo dia. Variantes dos assets que já seguem a regra: creme sobre ferro (A damasco
`#FDD692`), creme sobre umbro (A areia `#E1CE7A`), turquesa (A umbro).

Exceções admitidas pelo usuário (2026-11-22): versões absolutamente monocromáticas (horizontal,
vertical e assinaturas só em creme ou só em umbro) e vazadas. Nelas o A fica da cor do resto.

**Why:** o A diferente carrega o conceito da marca; não é detalhe de cor.

**How to apply:** todo logo novo, desenhado em código (`lina-geometry.js`, `LINA_PATHS`) ou
exportado, pinta o A à parte. Não recolorir o A para ferro-fundo. Assinaturas ajustadas na marca 1.1.0.
