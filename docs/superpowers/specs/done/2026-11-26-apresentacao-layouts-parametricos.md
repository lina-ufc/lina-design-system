# Apresentação: layouts paramétricos e peças dos decks CNR e Vision

Data: 2026-11-26. Template: `templates/apresentacao/`. Catálogo visual aprovado em conversa:
[`2026-11-26-miniaturas-apresentacao.html`](2026-11-26-miniaturas-apresentacao.html) (abrir por servidor
local, não por `file://`; config `site-8771` em `.claude/launch.json`).

## Intenção

Dois usos reais do template (CNR, 2026-11-13, um deck; Vision Project Seminar, 2026-11-23, cinco
palestras) mostraram que os layouts de conteúdo não cobrem o que as palestras pedem. No Vision,
32 de 85 slides usaram `2.6 Só título` como tela em branco e 21 usaram `4.1`, com tudo desenhado à
mão por cima; 15 layouts nunca foram usados. O Vision criou uma camada própria (`lib.js`,
`apresentador.js`, `transicao.js`, `build.sh`) que deveria estar no template.

O usuário quer quase tudo isso no template, com uma regra de projeto: **cada layout é pensado para
uma quantidade variável de itens** (sumário com 3 ou com 15 partes, equipe com 6 ou 14 pessoas) e
muda de arranjo quando o conteúdo passa de um limite. O deck HTML é a referência visual; o .pptx,
o .potx e o .pdf saem do mesmo gerador.

## Metas

1. Layouts paramétricos no `potx/build.js`, com as regras de N do catálogo.
2. Deck de exemplo com um slide por miniatura do catálogo (mesma ordem), incluindo os slides de
   componentes e as duas páginas de ícones, igual no site, no .pptx e no .pdf.
3. Peças genéricas do Vision e do CNR promovidas ao template (lista em "Escopo").
4. Bugs do template encontrados nas aplicações corrigidos.
5. Página do template no site (capítulo 8, `capitulos/8-templates/1-apresentacao.html`) explica as
   notas do apresentador, com um print da janela de notas.

## Não metas

- Inverter o fluxo (HTML como fonte convertido para PPTX). Decisão do usuário: **gerador único**.
- Ferramentas do evento: `intake.py`, `publish.sh`/Vercel, landing page, mapas IBGE, recoloração
  de figuras, diagramas matplotlib, filme d3. Ficam no evento.
- Consertar os decks CNR e Vision (medidas fora da grade, três versões de `band`, caminhos
  absolutos, LEIA-ME do CNR apontando para o DS arquivado). São das aplicações.
- Animação do logo LINA se montando como layout. O usuário disse que esse layout não existe.

## Anti-metas

- Distorcer imagem. `aspect.py` continua dando `distorcidas: 0`.
- Cor fora dos tokens no template (cores de legenda que chaveiam uma imagem continuam permitidas no
  deck do usuário, não no template).
- Layout novo redesenhado à mão fora da grade de 12 × 6.

## Restrições

- Grade, tipografia e regras do `README.md` do template valem para todo layout novo.
- O `.potx` é usado no PowerPoint, que não calcula N: cada variação vira um layout fixo (ver
  "Decisões").
- Decks existentes chamam o gerador com `DECK=… node build.js` e nomes de layout atuais
  (`'4.1 Imagem lateral'`, `'2.6 Só título'`…). A renumeração quebra esses nomes.
- Rebuild sobrescreve PPTX aberto no DeckCraft: perguntar antes.
- Checagens: `validate.py`, `aspect.py`, render por `pdftoppm`, deck HTML no Chrome real (headless
  não toca H.264).

## Abordagens consideradas

| | Abordagem | Troca | Escolha |
|---|---|---|---|
| a | **Gerador único.** `build.js` continua a fonte; layouts viram funções de N; `html.js` e o .pptx saem do mesmo registro. | Mantém o fluxo testado; HTML e PPTX não divergem. O HTML só ganha o que o pptxgenjs também consegue desenhar (mais `sl.html` para o que for só HTML). | **Escolhida pelo usuário** |
| b | HTML como fonte, .pptx convertido dele. | HTML livre; reescreve o gerador e depende de conversão HTML → PPTX, que perde placeholders. | Rejeitada |

## Decisões tomadas

### Catálogo final

Lista completa e desenho de cada variação no arquivo de miniaturas. Resumo por família:

**1 Abertura.** 1.1 Abertura (trama) · 1.2 Capa (autores 1–9, até 3 por coluna de 4 módulos; logos
2–4; título com mais de 3 linhas cai de 72 para 56 px) · 1.3 Capa · imagem · 1.4 Sumário (≤ 4
faixas altas com descrição; 5–6 faixas baixas, descrição só até 5; 7–12 título em cima e duas
colunas; 13–18 três colunas) · 1.5 Seção.

**2 Texto.** 2.1 Texto · 2.2 Colunas (N 2–4; marcador nenhum, número, ícone + número) · 2.3 Lista
(marcador tile numerado, ícone em tile damasco ou ponto; com imagem à direita até 5 itens numa
coluna; sem imagem duas colunas acima de 5) · 2.4 Linha do tempo (horizontal: uma linha até 6
marcos, duas acima; vertical na coluna com imagem à direita; marco = célula LINA, passado cheio,
futuro vazado) · 2.5 Equação · 2.6 Só título.

**3 Ícones.** 3.1 Recursos (até 4 numa linha; 6 e 8 em duas, tile menor) · 3.2 Processo (N que não
divide 12 reparte a largura útil por igual; acima de 6 em duas linhas) · 3.3 Ilustrações (N 3–4,
ilustração de 380 px).

**4 Imagem.** 4.1 Imagem lateral (lado direito ou esquerdo; imagem sangrada ou figura recuada com
legenda embaixo; coluna com texto, números ou lista) · 4.2 Texto e grade (2, 4 ou 6 imagens) · 4.3
Imagem e texto (**imagem à direita**; a versão à esquerda sai) · 4.4 Figura larga (aceita vídeo) ·
4.5 Imagens em linha (N 2–4, mesma altura, largura pela proporção, sem recorte) · 4.6 Mosaico (3 ou
5) · 4.7 Imagem cheia (duas variações, abaixo) · 4.8 Equipe (retratos na mesma escala; 1 linha até
6, 2 até 16, 3 acima).

**5 Dados.** 5.1 Gráfico (multi-série) · 5.2 Gráfico e leituras · 5.3 Números-chave (N 2–4; fonte
140, 110 com 4; seta antes → depois opcional) · 5.4 Comparação · 5.5 Tabela (coluna destacada;
variação texto grande + tabela).

**6 Encerramento.** 6.1 Encerramento (logos 2–4 centradas) · 6.2 Encerramento · autores (≤ 3 uma
coluna centrada; 4–8 duas com a calha no centro; 9–12 três).

**7 Ícones (fim do exemplo).** 7.1 Tratamentos (os 11) · 7.2 Biblioteca (amostra de 32, com os
ícones que faltavam; texto aponta para phosphoricons.com e `assets/icons/phosphor`). Passam a
existir no HTML e no PDF, não só no .pptx.

**Componentes** (desenhados dentro de `2.6 Só título` no exemplo): declaração-chave, cartão, tile
numerado, tile de ícone na cor do papel, número com seta, legenda colada à figura, legenda de cores
(quadrados), lista com marcador.

### Fusões (layouts atuais que somem)

1.4 Capa · autores → 1.2 Capa · 1.6 Sumário · lista → 1.4 Sumário · 2.3 Três colunas e 2.5
Conclusões → 2.2 Colunas · 3.3 Ícones · lista e imagem → 2.3 Lista · 4.5 Duas imagens e 4.6 Três
imagens → 4.5 Imagens em linha · 4.9 Vídeo → qualquer espaço de imagem aceita vídeo.

### Decisões visuais do usuário

- **4.7 Imagem cheia**: (1) sem texto sobre a imagem; (2) rótulo e título creme em cima e fonte
  embaixo rente ao rodapé (≈ 24 px acima dele), com **dois degradês verticais**: um de cima para
  baixo que termina logo após o título, outro de baixo para cima que cobre só a fonte. Cor do
  degradê no rascunho: ferro fundo (não discutida).
- **Declaração-chave**: padrão = fio ferro + rótulo mono + frase Medium. Preenchido **fora do
  vermelho**, em três cores, todas disponíveis: turquesa fundo com texto creme; damasco com texto
  umbro; turquesa com texto umbro. Ferro fundo preenchido foi rejeitado.

### .potx

Um layout por variação do catálogo (cerca de 57), com a faixa de N no nome
(`1.4 Sumário · 7–12`). Cada layout traz os placeholders do máximo da faixa; placeholder vazio não
aparece na exibição. (Proposta minha; o usuário não objetou.)

## Escopo: peças promovidas ao template

1. **API paramétrica.** `s('<layout>', {…, itens: […]})` escolhe a variação pelo tamanho da lista.
2. **Funções de imagem.** `cover` (recorte sharp na proporção da caixa), `fit` (inteira, centrada),
   `linha` (N figuras, mesma altura) e vídeo em loop (`sl.video`: poster base64, loop, mudo, sem
   o placeholder vazio que vira caixa cinza no PDF).
3. **Componentes** acima, como funções do gerador (hoje em `lib.js` do Vision e redefinidos por
   palestra).
4. **Notas do apresentador.** `notes([...])` por slide: `addNotes()` no .pptx e `#speaker-notes`
   no HTML (hoje `lib.js` + `build.sh` do Vision).
5. **Janela do apresentador no HTML** (`apresentador.js` do Vision): N abre janela popup com a nota
   atual e o começo da próxima; F alterna tela cheia. Funciona offline.
6. **Transições** (`transicao.js` do Vision): morph entre slides, só HTML, opcional por deck,
   desligadas com movimento reduzido.
7. **Saída `dist/` autônoma**: HTML com `fonts.css`, `assets/` e caminhos relativos, para abrir
   offline ou publicar (receita do `build.sh` do Vision).
8. **Acessibilidade**: `alt` vindo do `altText` do gerador; `<html lang>` e `lang` do rodapé no
   `post.py` pelo idioma do deck (hoje fixo em pt-BR).
9. **Bugs**: `chart()` do `html.js` desenha só a 1ª série; 4.9 com caixa cinza no PDF; `addTable`
   sem placeholder deixa o placeholder vazio.
10. **Compatibilidade**: tabela de nomes antigos → novos (com a variação equivalente) aceita pelo
    `s()`, para os decks CNR e Vision continuarem gerando. Versão maior: `apresentacao-v2.0.0`.
11. **DS**: ícones Phosphor que faltam em `assets/icons/phosphor/regular` (`warning`,
    `arrow-right`, `wave-sine`, `broadcast`, `thermometer`, `code`, `terminal-window`,
    `app-window`, `drone`, e os da biblioteca 7.2); papéis de cor fixos por categoria (foco ferro,
    resultado turquesa fundo, referência umbro) e o par de cores para gráfico de duas séries
    documentados no README do template.
12. **Site**: página `1-apresentacao.html` (capítulo 8) com o deck de exemplo novo, explicação das
    notas do apresentador (como escrever com `notes()`, teclas N e F, onde aparecem no .pptx) e um
    print da janela de notas.

## Decisões da revisão do construtor (minhas, a conferir)

- **API e compatibilidade.** `s('<layout>', fill)` continua preenchendo por nome de placeholder;
  `itens` é um campo a mais do `fill`, e a variação sai do tamanho da lista. Nomes de placeholder
  dos layouts novos ficam estáveis e documentados no README. Nomes antigos passam por uma tabela
  de aliases (ex.: `'4.7 Mosaico'` → `4.6 Mosaico · 3`); nome antigo sem equivalente (4.3 com
  imagem à esquerda) dá **erro explícito** com a sugestão, nunca troca de layout em silêncio.
- **Regressão.** Antes da v2.0.0, gerar localmente os decks CNR
  (`…/APRESENTAÇÕES/[2026-11-13] CNR - Digital transformation for cultural heritage/cnr.js`) e as
  cinco palestras do Vision e conferir que geram sem erro. Não entra na CI.
- **Catálogo = intenção na grade, não alvo de pixel.** Tudo sai de objetos pptxgenjs, que o
  `html.js` projeta (um só renderizador). O que o pptxgenjs não desenha: os degradês do 4.7 viram
  PNG gerado pelo sharp (como a trama); a coluna destacada da tabela usa preenchimento de célula;
  a trama animada continua só no HTML.
- **`dist/` e apresentador.** Entram no `make.sh`. O `dist/` vira o conteúdo do zip HTML do
  `downloads/` (substitui o atual). Miniaturas da janela do apresentador saem do PDF por
  `pdftoppm` (poppler entra na CI). STIX Two Math (OFL) vai junto nas fontes. Artefatos gerados
  ficam fora do git, como hoje.
- **Transições.** Opcionais por deck (`transicoes: true` nas opções do deck). Se a marcação atual
  do `html.js` não servir ao pareamento, o `html.js` emite um atributo estável por objeto; sem
  segundo renderizador.

## Deixado para o construtor

- Organização interna do `build.js` (arquivo único ou módulos), desde que um só comando gere tudo.
- Textos de exemplo dos slides.
- Limites exatos de N onde o catálogo mostra só exemplos (o construtor fixa e documenta no README).
- Ordem dos planos: começar pela base paramétrica e por uma família, renderizar e mostrar antes de
  aplicar o padrão nas demais (regra do `CLAUDE.md`).
