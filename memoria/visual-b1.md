---
name: visual-b1
description: Visual B1 do site aprovado no protótipo da página Logotipo (2026-11-27): fundo creme em tudo, número de seção pequeno acima do título
type: regra
---
Protótipo `prototipo/b1.css` (página Logotipo) aprovado pelo dono em 2026-11-27. Vale para o
subplano 05 (aplicar a todas as páginas).

- **Fundo creme em tudo**: página, barra lateral, pranchas e ladrilhos. O dono recusou o branco
  proposto no spec ("gostava mais quando tudo era creme").
- **Número de seção**: metade do tamanho do título, em mono, logo acima dele. Recusados os
  números enormes à esquerda (estilo NASA). Capítulo idem: metade do `h1`, acima.
- Uma só margem esquerda para título, texto, pranchas e navegação; texto até 52ch.
- Exemplos em pranchas de largura total com a retícula de meia célula; cada figura é um ladrilho
  liso, a retícula só nos vãos e na moldura; legenda nunca sobre a retícula. Raio 0 ou ¼ de célula.
- Diagramas ampliados só em escala que caia na grade (1,5× = 3 meias células, 2× = 2 células).
- Ferro só em rótulo pequeno, item atual, foco/hover e no logo; títulos e links em umbro.
- Folga entre seções de 2 células; peso 400 nos textos pequenos; alvos de 44 px no celular.

**Why:** decisão do dono sobre o protótipo; achados e medidas em
`docs/superpowers/plans/2026-11-26-revisao-site/records/02-revisao.md`.

**How to apply:** o 05 parte de `prototipo/b1.css`, movendo os `!important` para os fragmentos.
