# Apresentação LINA — template de slides

Versão atual e histórico em `CHANGELOG.md`. Um só gerador produz o template PowerPoint e o deck HTML, que mostram o mesmo conteúdo.

## Arquivos

| Arquivo | O que é |
|---|---|
| `LINA-Apresentacao.potx` | Template PowerPoint 16:9, só master e 57 layouts numerados (sem slides; `post.py` tira os slides e o que só eles usam) em seis famílias (`1.2 Capa`, `4.5 Imagens em linha · 2 imagens`…; 1 Abertura, 2 Texto, 3 Ícones, 4 Imagem, 5 Dados, 6 Encerramento). É o que se distribui. |
| `LINA-Apresentacao-exemplo.pptx` | Um slide de exemplo por layout, componentes, notas do apresentador, o slide-guia "Como usar" e duas páginas de ícones Phosphor (tratamentos e biblioteca) para copiar e colar. |
| `LINA-Apresentacao-exemplo.pdf` | Exportação do exemplo pelo LibreOffice. |
| `Apresentacao.dc.html` | Deck HTML gerado. Não edite à mão. |
| `img/` | Imagens usadas pelo deck HTML (logos, tramas, ícones, miniaturas do apresentador). |
| `fonts.css`, `fonts/` | Fontes do deck HTML (Outfit, JetBrains Mono, STIX Two Math, com as licenças OFL), para abrir sem elas instaladas. |
| `apresentador.js`, `transicao.js` | Janela do apresentador e transições do deck HTML. |
| `potx/` | Gerador: `build.js` (layouts e exemplos), `param.js` (layouts por N e nomes antigos), `post.py` (pós-processamento do .pptx), `html.js` (deck HTML), `check.js`, `make.sh`. |

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

**Capa com vários autores.** `1.2 Capa` com 2 a 9 autores, todos com a mesma hierarquia: igual à capa até o título; na linha 4, colunas de 4 módulos com até três nomes cada, em Outfit Medium 32, como o apresentador. Título com mais de 60 caracteres cai de 72 para 56.

**Capa · imagem (variação).** Imagem nas colunas 1–5, de margem a margem na altura, encostada à esquerda. Logo LINA, evento, título (5 módulos), autores e logos institucionais deslocados para a coluna 6. Autores em Outfit Medium 28 (14 pt), entrelinha 1,0, em duas colunas (3 e 4 módulos).

**Sumário.** `1.4 Sumário` com até 4 partes: faixas altas que dividem a altura útil (132 a 972), cada uma com fio no topo, número em JetBrains Mono, nome em Outfit Medium 48 e descrição em Light 28. Com 5 e 6 partes as faixas ficam baixas e a descrição vai até 5; de 7 a 12, título em cima e duas colunas; de 13 a 18, três.

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

**Encerramento · autores.** Nomes em JetBrains Mono 25. Até 3 autores: uma coluna centrada. De 4 a 8: duas colunas de 6 módulos, com a calha no centro do slide (a da esquerda alinha à direita, a da direita à esquerda). De 9 a 12: três colunas de 4 módulos.

## Layouts

Cada layout muda de arranjo com o número de itens (N). No `.potx`, que não calcula N, cada variação é um layout fixo, com o N no nome: `'<base> · <n> <unidade>'`, por exemplo `1.4 Sumário · 12 itens` ou `4.8 Equipe · 14 pessoas`. O gerador escolhe o nome pelo tamanho da lista (`itens`) ou pelas chaves do preenchimento; o N padrão da família fica sem sufixo. N fora da faixa dá erro. Cada layout do `.potx` traz os espaços do máximo da faixa; espaço vazio não aparece na apresentação.

| Família | Layouts (faixa de N) | O que muda com N |
|---|---|---|
| 1 Abertura | 1.1 Abertura · 1.2 Capa (1 a 9 autores) · 1.3 Capa · imagem (1 a 6 autores) · 1.4 Sumário (1 a 18 itens) · 1.5 Seção | Autores em colunas de até 3; sumário em faixas, duas ou três colunas. |
| 2 Texto | 2.1 Texto · 2.2 Colunas (2 a 4; também numeradas e com ícones) · 2.3 Lista (1 a 10; marcador, ícone, com imagem até 5) · 2.4 Linha do tempo (2 a 12; vertical até 6) · 2.5 Equação · 2.6 Só título | Colunas dividem a largura; lista e linha do tempo passam a duas linhas ou colunas. |
| 3 Ícones | 3.1 Recursos (2 a 8) · 3.2 Processo (2 a 12) · 3.3 Ilustrações (2 a 4) | Acima de 4 itens, duas linhas e tile menor. |
| 4 Imagem | 4.1 Imagem lateral (também recuada, com 1 a 3 números, e à esquerda, com 1 a 5 itens) · 4.2 Texto e grade (2 a 6 imagens) · 4.3 Imagem e texto (imagem à direita) · 4.4 Figura larga · 4.5 Imagens em linha (2 a 4) · 4.6 Mosaico (3 a 5) · 4.7 Imagem cheia (também com título e degradês) · 4.8 Equipe (1 a 24 pessoas) | Imagens na mesma altura, sem recorte; equipe em 1, 2 ou 3 linhas. |
| 5 Dados | 5.1 Gráfico · 5.2 Gráfico e leituras · 5.3 Números-chave (2 a 4; também antes e depois) · 5.4 Comparação · 5.5 Tabela (também com texto grande) | Número de 140 px, 110 com 4. |
| 6 Encerramento | 6.1 Encerramento (2 a 4 logos) · 6.2 Encerramento · autores (1 a 12) | Logos centradas; autores em 1, 2 ou 3 colunas. |

Vídeo vale em qualquer espaço de imagem (ver "Gerador").

**Nomes antigos (v1).** O gerador aceita estes nomes e traduz para a variação equivalente, para os decks antigos continuarem gerando:

| Nome antigo | Vira |
|---|---|
| `1.4 Capa · autores` | `1.2 Capa` |
| `1.5 Sumário`, `1.6 Sumário · lista` | `1.4 Sumário` |
| `1.7 Seção` | `1.5 Seção` |
| `2.2 Duas colunas`, `2.3 Três colunas` | `2.2 Colunas` |
| `2.4 Equação` | `2.5 Equação` |
| `2.5 Conclusões` | `2.2 Colunas · ícones` |
| `3.3 Ícones · lista e imagem` | `2.3 Lista · ícones e imagem` |
| `4.2 Texto e grade 2×2` | `4.2 Texto e grade · 4 imagens` |
| `4.5 Duas imagens`, `4.6 Três imagens` | `4.5 Imagens em linha · 2` e `· 3 imagens` |
| `4.7 Mosaico` | `4.6 Mosaico · 3 imagens` |
| `4.8 Imagem cheia` | `4.7 Imagem cheia` |
| `4.9 Vídeo` | `4.4 Figura larga` (com vídeo) |

Nome antigo sem equivalente (`1.1 Abertura · logo`, `4.3` com imagem à esquerda) dá erro `layout '…' não existe`; o gerador nunca troca de layout em silêncio.

## Gerador

Um deck próprio usa o gerador assim: `DECK=meu-deck.js FOOT="Título abreviado" node build.js`; o módulo recebe `{ pres, s, comp, opcoes, … }` e monta os slides.

- `s('<layout>', fill, extra)`: `fill` preenche por nome de espaço; `itens: [...]` dá os N itens (texto ou objeto com os campos, por exemplo `{ Nome, Cargo }`) e escolhe a variação; `notas: '…'` guarda as notas do apresentador (`\n` separa parágrafos); `extra(sl)` desenha por cima (`sl.addText`, `sl.addImage`, `sl.html` para marcação só do HTML, `pptOnly: true` para imagem só do .pptx). Chave de `fill` que não é espaço do layout dá erro.
- Imagem no `fill`: `{ img, modo?: 'cover' | 'fit', posicao?, alt? }`. `cover` recorta na proporção da caixa e preenche; `fit` mostra a imagem inteira, centrada, sem recorte. `alt` vira o texto alternativo. O formato antigo `{ img, box }` segue valendo.
- Vídeo no `fill`: `{ video, poster }`: em loop, mudo, na proporção do poster; o PDF mostra o poster.
- `opcoes = { lang, transicoes }`: `lang` é o idioma do deck (`pt-BR` por padrão; vai para o HTML e para o .pptx); `transicoes: true` liga as transições do deck HTML.
- `comp.*` desenha componentes (só com `addText` e `addImage`, iguais no .pptx e no HTML): `declaracao` (fio ferro, ou painel em três cores: A turquesa fundo, B damasco, C turquesa), `cartao`, `tileNumero`, `tileIcone`, `numeroSeta`, `legenda`, `legendaCores`, `tabela` (coluna destacada), `marcador`.
- `sl.html` e `pptOnly` quebram a igualdade entre HTML e .pptx de propósito; use só para o que um dos dois não desenha (trama animada, vídeo).

## Gráficos e cores

- Gráfico de duas séries: ferro e turquesa fundo (`C.ferro` e `C.turquesaFundo` no `build.js`; ver o slide 5.1 do exemplo).
- Cores que codificam categoria, sempre na mesma ordem: foco (o caso, o problema) em ferro, resultado (recuperação, proposta) em turquesa fundo, referência (base, entrada, contexto) em umbro. A legenda de cores usa `comp.legendaCores`, com quadrados de 24 px.

## Deck HTML

- Teclas: F alterna tela cheia, G mostra a grade, N abre a janela do apresentador (nota atual, slide atual grande, próximo em miniatura menor com o começo da próxima nota, cronômetro e hora). As miniaturas são estáticas: vídeos e animações aparecem parados. A janela é um pop-up: o navegador precisa permitir pop-up. Nela, P inicia ou pausa o cronômetro e R zera.
- Notas: `notas` no `s()` vai para o campo de notas do .pptx e para o HTML. Sem notas, a janela não existe.
- Transições (opcionais, `opcoes.transicoes`): elementos iguais ficam parados, os que mudam de lugar deslizam, o resto entra em sequência. Sem movimento com `prefers-reduced-motion`.
- Pacote offline: o zip do deck HTML leva `fonts.css` e `fonts/` ao lado do HTML; a fonte instalada tem prioridade e o arquivo cobre o computador sem ela.

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
3. Para ver o site local: `python3 capitulos/templates/_gerar.py` e `python3 sistema.py` na raiz, depois abra `index.html`.
4. Publicar uma versão: escreva a entrada em `CHANGELOG.md`, faça o commit e crie a tag `apresentacao-vX.Y.Z` (`git tag apresentacao-v1.1.0 && git push --tags`). O GitHub Actions gera os arquivos, cria a release e atualiza o site.
5. Ajustes feitos à mão no DeckCraft ou no PowerPoint: transfira as medidas para o `build.js` antes de gerar de novo. Gerar de novo sobrescreve os arquivos.

No HTML, a tecla G ou o botão "Grade" mostram a faixa do rótulo (laranja) e os módulos (azul). Os dois somem na impressão.
