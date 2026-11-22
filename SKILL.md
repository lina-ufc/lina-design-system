---
name: lina-design
description: Use esta habilidade para gerar peças e interfaces do LINA (Laboratório de Design da Informação — Arte · Arquitetura · Ambiente, IAUD/UFC). Contém logotipo, cores, padrões, animação, tipografia, ícones e templates. Use this skill to generate well-branded assets for LINA.
user-invocable: true
---

Leia o README.md desta habilidade e explore os outros arquivos.

O sistema inteiro está catalogado em `sistema.json` (capítulos e entradas, cada uma com arquivo e estado:
aprovado, rascunho, revisar) e visível num só documento, `index.html`, gerado por `python3 sistema.py`. Use só o
que está aprovado; rascunho e revisar ainda podem mudar. Elemento novo: crie o arquivo, acrescente a entrada em
`sistema.json` e gere de novo o `index.html`.

A identidade do LINA é uma regra de construção: toda forma é uma união de células com cantos de ¼ de célula, e
`assets/lina-geometry.js` é o traçador que a executa. Use-o em vez de desenhar formas à mão. Logotipos prontos
(horizontal, vertical, símbolo, vazados, selo, assinatura em bloco PT/EN) em `assets/logos/sand/`, tabela no
README §1; logos institucionais em `assets/logos-institutions/`. Ícones: só Phosphor
(`assets/icons/phosphor/`, seis pesos, duotone com segunda cor da paleta; regras no README de lá). Nenhum emoji.

Para peças visuais, copie os ativos e gere HTML estático. Para código de produção, copie os ativos e siga as
regras do README. Textos públicos em português do Brasil; código e identificadores em inglês.
