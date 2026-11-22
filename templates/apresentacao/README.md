# Apresentação LINA — template de slides

Versão atual e histórico em `CHANGELOG.md`. Um só gerador produz o template PowerPoint e o deck HTML, que mostram o mesmo conteúdo.

## Arquivos

| Arquivo | O que é |
|---|---|
| `LINA-Apresentacao.potx` | Template PowerPoint 16:9, só master e 32 layouts numerados (sem slides; `post.py` tira os slides e o que só eles usam) em seis famílias (`1.2 Capa`, `4.5 Duas imagens`…; 1 Abertura, 2 Texto, 3 Ícones, 4 Imagem, 5 Dados, 6 Encerramento). É o que se distribui. |
| `LINA-Apresentacao-exemplo.pptx` | Um slide de exemplo por layout, o slide-guia "Como usar" e quatro páginas de ícones Phosphor para copiar e colar (só no .pptx). |
| `LINA-Apresentacao-exemplo.pdf` | Exportação do exemplo pelo LibreOffice. |
| `Apresentacao.dc.html` | Deck HTML gerado. Não edite à mão. |
| `img/` | Imagens usadas pelo deck HTML (logos, tramas, ícones). |
| `potx/` | Gerador: `build.js` (layouts e exemplos), `post.py` (pós-processamento do .pptx), `html.js` (deck HTML), `make.sh`. |

## Grade

Medidas em px na referência de 1920 × 1080 (1 pt = 2 px).

| Elemento | Medida |
|---|---|
| Margens | 72 nas laterais e no topo |
| Faixa do rótulo da seção | 72 a 108 (36 de altura), seguida de calha de 24 |
| Área modular | 132 a 972 |
| Colunas | 12 de 126, calha 24; começam em 72 + 150·i |
| Linhas | 6 de 120, calha 24; começam em 132, 276, 420, 564, 708, 852 |
| Abaixo da grade | calha de 24 até o rodapé |
| Rodapé | faixa de 84 a partir de y = 996 (ícone L, apresentador · título abreviado, número do slide) |

Regras:

- Nada além do rótulo da seção entra na faixa de 72 a 108.
- O título do slide começa na linha 0 (y = 132). O conteúdo começa na linha 1 (y = 276).
- Em texto grande, o alinhamento é pelo desenho das letras (topo das maiúsculas e pé das letras), não pela caixa de texto.
- Apresentação sem divisão em seções: sem slides de abertura de seção e sem rótulo (mini-título) nos slides; deixe o espaço do rótulo vazio.
- Rodapé: só o título abreviado do trabalho.
- Fundo dos slides de conteúdo: branco. Capa, abertura de seção e encerramento usam ferro com a trama.
- Imagens nunca são distorcidas. O `sizing: 'cover'` do pptxgenjs estica a imagem se `w`/`h` não tiverem a proporção dela; recorte antes (sharp) ou passe a proporção real. `make.sh` roda `potx/aspect.py`, que falha se alguma imagem do .pptx estiver deformada.
- Trama: célula de 12 desenhada a 1324 px de largura (a escala do deck HTML visto em tela de notebook), exportada em PNG para o .pptx.
- No deck HTML a trama é animada: `html.js` põe o componente `<lina-dither-field>` (`assets/lina-dither-field.js`, com `lina-geometry.js`) por cima do PNG nas capas, seções e encerramentos, com a mesma receita de `potx/render.html` e `design-width="1324"` para manter a escala. O PNG fica como reserva; com movimento reduzido no sistema, o campo fica parado.

## Tipografia

| Uso | Fonte | Tamanho (px) |
|---|---|---|
| Rótulo da seção | JetBrains Mono, ferro | 25, topo das maiúsculas em 72 |
| Título do slide | Outfit ExtraBold | 60 |
| Subtítulo | Outfit Medium | 32 |
| Texto corrido | Outfit Light | 28, entrelinha 1,3 |
| Legenda e fonte | JetBrains Mono | 18 |
| Equações e símbolos (grego, variáveis) | STIX Two Math, itálico matemático Unicode (𝜃, 𝑡) | 64 na equação; 34 em tabela |

## Slides especiais

**Capa.**
- Logo LINA de 200 px no canto superior, em y = 72.
- Linha 1: evento e data, apoiados no pé da linha.
- Linhas 2–3: título em 72 px, até três linhas.
- Linha 4: apresentador, com os coautores abaixo.
- Logos UFC e IAUD (brancas): o pé da parte visível fica a 72 da borda inferior, e o brasão alinha com a margem esquerda.

**Abertura.** Slide antes da capa, só com a trama. No HTML a trama anima e continua sem salto na capa: os campos com o mesmo `seed` ("trama-capa") sorteiam a mesma semente e desenham o mesmo quadro ao mesmo tempo. Na capa, só os demais elementos entram em cena (imagem desliza da esquerda; logo, evento, título, autores e logos institucionais sobem em sequência, cerca de 1,9 s no total). Sem animação com movimento reduzido e na impressão. No .pptx a abertura é a trama estática.

**Entrada aleatória (deck HTML).** Em qualquer slide, `sl.anim('aleatorio')` no gerador faz as imagens adicionadas aparecerem em fade (0,7 s), uma a uma, em ordem sorteada a cada build (0,06 s entre elas). Usado no slide de equipe. Sem animação com movimento reduzido e na impressão.

**Capa · autores (variação).** Para vários autores com a mesma hierarquia. Igual à capa até o título; na linha 4, duas colunas de 4 módulos com um nome por linha (até três por coluna), todos em Outfit Medium 32, como o apresentador.

**Capa · imagem (variação).** Imagem nas colunas 1–5, de margem a margem na altura, encostada à esquerda. Logo LINA, evento, título (5 módulos), autores e logos institucionais deslocados para a coluna 6. Autores em Outfit Medium 28 (14 pt), entrelinha 1,0, em duas colunas (3 e 4 módulos).

**Sumário · lista (variação).** Para sumários curtos (até 4 partes), como no deck UNIPG: a altura útil (132 a 972) é dividida em 4 faixas de 210, cada uma com fio no topo, número em JetBrains Mono, nome da parte em Outfit Medium 48 e uma linha de descrição em Light 28.

**Abertura de seção.**
- Número em 371 px: o desenho ocupa exatamente as linhas 2 e 3 (420 a 684).
- Linha 4: nome da seção em 82 px, com uma frase de descrição em 32 px.
- Sem rótulo.

**Encerramento.**
- Tudo centrado no eixo vertical.
- Logo LINA de 200 px no topo, em y = 72, como na capa.
- "Obrigado" em 171 px: o O preenche a linha 2.
- Linha 3: apresentador e contato.
- Logos institucionais centradas, na mesma altura da capa.
- Apresentador na fonte do rótulo (JetBrains Mono 25).

**Encerramento · autores (variação).** Nomes em JetBrains Mono 25, em duas colunas de 6 módulos: a calha entre elas cai no centro do slide; a coluna da esquerda alinha à direita e a da direita à esquerda. Uma coluna só também funciona (só a da esquerda).

## Layouts

Abertura · Capa · Capa · autores · Capa · imagem · Sumário · Sumário · lista · Seção · Texto · Duas colunas · Três colunas · Ícones · recursos · Ícones · processo · Ícones · lista e imagem · Imagem lateral · Texto e grade 2×2 · Imagem e texto · Figura larga · Duas imagens · Três imagens · Mosaico · Imagem cheia · Vídeo · Gráfico · Gráfico e leituras · Equação · Números-chave · Comparação · Tabela · Conclusões · Só título · Encerramento · Encerramento · autores.

Removidos nesta etapa: Afirmação, Destaque, Ferramentas.

## Pendências de alinhamento

Revisão de 12/11/2026, ainda não aplicada:
- Colunas, ícones e conclusões: subtítulo e texto ainda usam deslocamentos fixos (+24, +96) em vez de começar nas linhas.
- Números-chave: o número ainda não preenche um módulo.
- Imagens com legenda terminam em 912; o certo é terminar na linha 4 (828) ou ir até 972.
- Sumário: itens a 62 de distância; com 72, os cinco ocupariam as linhas 0–2.
- Os espaços de imagem ainda usam o preenchimento creme com hachura.

## Como alterar

1. Edite `potx/build.js`: as constantes da grade ficam no topo (`M`, `G`, `CW`, `RH`, `BAND`) e os layouts em `defineLayouts()`. Nome de layout novo: siga `família.variação`; o build ordena o master pelo número.
2. Rode `sh potx/make.sh`. Ele instala as dependências (`npm ci`), gera e valida o `.pptx` e o `.potx`, copia para esta pasta o modelo, o exemplo, o PDF (LibreOffice) e o deck HTML com `img/`, e monta os `.zip` em `downloads/`. Tudo isso é gerado e fica fora do git.
3. Para ver o site local: `python3 capitulos/8-templates/_gerar.py` e `python3 sistema.py` na raiz, depois abra `index.html`.
4. Publicar uma versão: escreva a entrada em `CHANGELOG.md`, faça o commit e crie a tag `apresentacao-vX.Y.Z` (`git tag apresentacao-v1.1.0 && git push --tags`). O GitHub Actions gera os arquivos, cria a release e atualiza o site.
5. Ajustes feitos à mão no DeckCraft ou no PowerPoint: transfira as medidas para o `build.js` antes de gerar de novo. Gerar de novo sobrescreve os arquivos.

No HTML, a tecla G ou o botão "Grade" mostram a faixa do rótulo (laranja) e os módulos (azul). Os dois somem na impressão.
