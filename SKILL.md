---
name: lina-design
description: Use esta habilidade para gerar peças e interfaces do LINA (Laboratório de Design da Informação — Arte · Arquitetura · Ambiente, IAUD/UFC). Contém logotipo, cores, padrões, animação, tipografia, ícones e templates. Use this skill to generate well-branded assets for LINA.
user-invocable: true
---

Leia o README.md desta habilidade e explore os outros arquivos.

O sistema inteiro está catalogado em `sistema.json` (capítulos e entradas, cada uma com seu arquivo)
e visível no site, gerado por `python3 sistema.py`. O que está publicado vale, mesmo que seja revisado depois. Elemento novo: crie o arquivo, acrescente a entrada em
`sistema.json` e gere de novo o `index.html`.

A identidade do LINA é uma regra de construção: toda forma é uma união de células com cantos de ¼ de célula, e
`assets/lina-geometry.js` é o traçador que a executa. Use-o em vez de desenhar formas à mão. Logotipos prontos
(horizontal, vertical, símbolo, vazados, selo, assinatura em bloco PT/EN) em `assets/logos/sand/`, tabela no
README §1; logos institucionais em `assets/logos-institutions/`. Ícones: só Phosphor
(`assets/icons/phosphor/`, seis pesos, duotone com segunda cor da paleta; regras no README de lá). Nenhum emoji.

Para peças visuais, copie os ativos e gere HTML estático. Para código de produção, copie os ativos e siga as
regras do README. Textos públicos em português do Brasil; código e identificadores em inglês.

## Gerar padrões e imagens

Texturas e imagens pontilhadas saem como SVG por linha de comando, só com as cores do sistema. Antes de gerar, rode `--list-colors` para ver as combinações válidas. A primeira cor é o fundo. Duas cores da mesma família formam mono; de famílias diferentes, duo (contraste mínimo 3, fora dos pares a evitar); três cores, trio (as duas primeiras formam um duo válido e a terceira não repete o fundo). A imagem aceita só mono ou duo. Combinação inválida sai com código 2 e a regra em português.

```sh
# textura 4:5 em trio (modos: dither, scatter, field)
node ferramentas/textura.mjs --mode scatter --seed 3 --width 1080 --height 1350 --cells 36 --colors ferro,areia,creme --out textura.svg
# foto pontilhada (modos: dither, bitmap)
node ferramentas/imagem.mjs assets/logos-institutions/funcap/funcap-horizontal-cor.png --mode dither --colors creme,ferro --width 1080 --out imagem.svg
```

Flags da textura: `--mode --seed --width --height --cells --colors --blank --steps --quarter --clump --grain --stretch --accent --pinholes --edges`. Da imagem: `--mode --colors --width --detail --brightness --contrast --midtones --cutoff --smooth --dither --invert`. A mesma entrada gera sempre o mesmo SVG. Em HTML, carregue `assets/lina-geometry.js`, depois `lina-palette.js` e `lina-texture.js` ou `lina-image.js`, e chame `LinaTexture.render(params)` ou `LinaImage.render(imageData, params)`, com `imageData = {width, height, data}` (RGBA). Parâmetros numéricos de ajuste são frações de 0 a 1; a altura da imagem segue a proporção da foto.
