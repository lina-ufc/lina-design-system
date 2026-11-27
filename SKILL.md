---
name: lina-design
description: Use esta habilidade para gerar peças e interfaces do LINA (Laboratório de Design da Informação — Arte · Arquitetura · Ambiente, IAUD/UFC). Índice do sistema: logotipo, cores e tokens, padrões e imagens pontilhadas, animação, tipografia, ícones, componentes (declaração, tabela, nota, cartão…), templates de apresentação e documento A4, e as ferramentas de linha de comando que os geram. Use this skill to generate well-branded assets for LINA.
user-invocable: true
---

Este arquivo é um índice: diz onde está cada regra, não a repete. Os valores moram nos arquivos citados. Visão geral e fluxo de trabalho: `README.md`. Textos públicos em português do Brasil; código e identificadores em inglês. Nenhum emoji.

## Fonte da verdade

- Paleta (12 cores, famílias, pares a evitar): `assets/lina-palette.js`. Única fonte dos valores de cor.
- Tokens: `tokens/*.css` (cores semânticas em `colors.css`; tipografia, espaço, raio, elevação, movimento, fontes). `tokens/lina.tokens.json` é o espelho das cores em formato DTCG, gerado por `node ferramentas/tokens.mjs`; não editar à mão.
- Catálogo do sistema: `sistema.json` (capítulos agrupados em quatro partes, e entradas). Site gerado por `python3 sistema.py`: uma página por capítulo (`<id>.html`, ex. `logotipo.html`; `index.html` é a porta de entrada) e o índice para agentes `llms.txt`, publicados em https://lina-ufc.github.io/lina-design-system/ (índice: https://lina-ufc.github.io/lina-design-system/llms.txt). O que está publicado vale, mesmo que seja revisado depois.
- Elemento novo: crie o arquivo, acrescente a entrada em `sistema.json` e gere o site de novo.

## Logotipo e geometria

Toda forma do LINA é uma união de células com cantos de ¼ de célula; `assets/lina-geometry.js` é o traçador que executa a regra. Use-o em vez de desenhar formas à mão. Regra e construção: capítulo 2 do site (`logotipo.html`). Arquivos prontos (horizontal, vertical, símbolo, vazados, selo, assinaturas PT/EN): `assets/logos/sand/`, tabela no `README.md` §1. Logos institucionais: `assets/logos-institutions/`. Pacotes para baixar: `downloads/` (`marca.sh`, `institucionais.sh`).

## Cores e combinações

Capítulo 3 do site (`cores.html`): paleta, estudo de contraste (3.4), pares a usar (3.5) e a evitar (3.6), auxiliares (3.7). Resumo em `README.md` §2. Antes de combinar cores em peça nova, rode `node ferramentas/textura.mjs --list-colors`.

## Padrões, imagens e animação

Capítulo 6 (`padroes.html`): regra do pontilhado, mono, duo e trio. Motores: `assets/lina-texture.js` e `assets/lina-image.js`. Animação (6.7, em `padroes.html`): `assets/lina-dither-field.js`. Comandos na seção "Gerar padrões e imagens", abaixo.

## Tipografia

Capítulo 4 (`tipografia.html`) e `tokens/typography.css`. Fontes em `assets/fonts/` (Outfit e JetBrains Mono, ambas OFL). `tokens/fonts.css` declara a Outfit; na web a JetBrains Mono vem do Google Fonts (`README.md` §5). Símbolos matemáticos usam STIX Two Math (`assets/fonts/STIXTwoMath.otf`; motivo em `memoria/simbolos-matematicos.md`). A Outfit substituiu a Neometric: `memoria/fonte-outfit.md`. Pacote: `downloads/LINA-Fontes.zip`.

## Ícones

Só Phosphor, seis pesos, em `assets/icons/phosphor/<peso>/`. Regras de peso, tamanho e duotone: `assets/icons/README.md` e capítulo 8 (`icones.html`).

## Componentes

Capítulo 9 (`componentes.html`); fragmentos em `capitulos/componentes/`, um por componente (declaração, tabela, legenda e fonte, número em destaque, passos, nota, cabeçalho e rodapé, cartão, tile de ícone). Cada um segue o molde Regra / Não fazer / Como pedir: leia o fragmento do componente antes de usá-lo.

## Templates

Capítulo 10 (`templates.html`).
- Apresentação: `templates/apresentacao/README.md` (layouts, regras, como gerar). Gerar: `sh templates/apresentacao/potx/make.sh`. Versões em `templates/apresentacao/CHANGELOG.md`.
- Documento A4 (relatório, artigo, POP; Word, LaTeX e HTML): gerar com `sh templates/documento-a4/make.sh`. Versões em `templates/documento-a4/CHANGELOG.md`.
- Gerados (`.potx`, `.pptx`, `.pdf`, `.zip`) ficam fora do git; versões saem por tag no GitHub Actions (`.github/workflows/`).

## Gerar padrões e imagens

Texturas e imagens pontilhadas saem como SVG por linha de comando, só com as cores do sistema. Antes de gerar, rode `--list-colors` para ver as combinações válidas. A primeira cor é o fundo. Duas cores da mesma família formam mono; de famílias diferentes, duo (contraste mínimo 3, fora dos pares a evitar); três cores, trio (as duas primeiras formam um duo válido e a terceira não repete o fundo). A imagem aceita só mono ou duo. Combinação inválida sai com código 2 e a regra em português.

```sh
# textura 4:5 em trio (modos: dither, scatter, field)
node ferramentas/textura.mjs --mode scatter --seed 3 --width 1080 --height 1350 --cells 36 --colors ferro,areia,creme --out textura.svg
# foto pontilhada (modos: dither, bitmap)
node ferramentas/imagem.mjs assets/logos-institutions/funcap/funcap-horizontal-cor.png --mode dither --colors creme,ferro --width 1080 --out imagem.svg
```

Flags da textura: `--mode --seed --width --height --cells --colors --blank --steps --quarter --clump --grain --stretch --accent --pinholes --edges`. Da imagem: `--mode --colors --width --detail --brightness --contrast --midtones --cutoff --smooth --dither --invert`. A mesma entrada gera sempre o mesmo SVG. Em HTML, carregue `assets/lina-geometry.js`, depois `lina-palette.js` e `lina-texture.js` ou `lina-image.js`, e chame `LinaTexture.render(params)` ou `LinaImage.render(imageData, params)`, com `imageData = {width, height, data}` (RGBA). Parâmetros numéricos de ajuste são frações de 0 a 1; a altura da imagem segue a proporção da foto.
