# Apresentação LInA · histórico de versões

A versão mais recente é o primeiro título `## x.y.z`. Para publicar uma versão nova: escreva a entrada aqui,
faça o commit e crie a tag `apresentacao-vx.y.z` (o GitHub Actions gera os arquivos e a release).

- **Maior** (2.0.0): layout removido ou renomeado, grade alterada. Quem já usa o modelo precisa refazer slides.
- **Menor** (1.1.0): layout novo, página de ícones nova, ajuste visual que não quebra slides existentes.
- **Correção** (1.0.1): erro em texto, alinhamento, arquivo corrompido.

## 2.0.2 · 2026-11-27

Sobreposições no deck HTML, sem mudança de layout.
- Título longo da capa reduz a fonte até caber, em vez de cobrir o apresentador. No .potx e no .pptx, o título
  da capa ganha o ajuste automático do PowerPoint.
- Logo de parceiro no encerramento ocupa o espaço do layout, à direita do IAUD, em vez de cair sobre ele.

## 2.0.1 · 2026-11-26

Acessibilidade (WCAG 2.1 AA), sem mudança de layout.
- Deck HTML com `<title>` (título da capa) e títulos dos slides anunciados como cabeçalho.
- Texto alternativo nos logos (LINA, UFC, IAUD, parceiro) e nas imagens provisórias do exemplo; no .pptx e no
  .potx, imagem decorativa fica sem descrição em vez de levar o caminho do arquivo.
- Gráfico de duas séries: a segunda passa a turquesa, distinguível da ferro também em tons de cinza.
- Janela do apresentador com idioma e título; controles do deck em português.

## 2.0.0 · 2026-11-26

Layouts por quantidade de itens, notas do apresentador e pacote HTML offline. Maior porque alguns layouts foram
removidos e outros renomeados; os nomes antigos continuam valendo no gerador, mas o `.potx` é outro.

- 57 layouts (eram 32): cada família muda de arranjo com N (autores, sumário, colunas, lista, linha do tempo,
  recursos, etapas, imagens, equipe, números, logos). O N entra no nome: `1.4 Sumário · 12 itens`.
- Nomes antigos (`1.4 Capa · autores`, `4.5 Duas imagens`, `4.9 Vídeo`…) traduzidos para a variação equivalente
  (tabela no README). Nome sem equivalente dá erro, não troca de layout.
- Removidos: `1.1 Abertura · logo`, `4.3` com imagem à esquerda e `4.9 Vídeo` (vídeo vale em qualquer espaço de imagem).
- Novos: `4.7 Imagem cheia · título` (título e degradês), `5.3 Números-chave · antes e depois`, `5.5 Tabela · texto`,
  `4.8 Equipe` e encerramentos (`6.1`, `6.2`) com N.
- Imagem no preenchimento: `cover`, `fit` e `alt`; vídeo com poster.
- Componentes do gerador: declaração-chave, cartão, tile numerado, tile de ícone, número com seta, legenda,
  legenda de cores, tabela com coluna destacada, marcador.
- Notas do apresentador no .pptx e no HTML; janela do apresentador (tecla N) com nota, slide atual grande, próximo em miniatura menor
  com o começo da próxima nota, aviso de miniaturas estáticas e cronômetro.
- Transições opcionais no deck HTML, desligadas com movimento reduzido.
- Idioma do deck (`lang`) no HTML e no .pptx; texto alternativo nas imagens.
- Pacote HTML offline: `fonts.css` e `fonts/` com Outfit, JetBrains Mono e STIX Two Math (OFL).
- Exemplo com duas páginas de ícones (tratamentos e biblioteca), também no HTML e no PDF.
- Corrigido: gráfico com mais de uma série e tabela sem espaço no HTML; vídeo sem caixa cinza no PDF.

## 1.0.0 · 2026-11-22

Primeira versão publicada.

- 32 layouts em seis famílias numeradas: 1 Abertura, 2 Texto, 3 Ícones, 4 Imagem, 5 Dados, 6 Encerramento.
- Modelo `.potx` só com master e layouts; exemplo `.pptx` com um slide por layout, guia de uso e quatro páginas
  de ícones Phosphor para copiar e colar.
- `4.8 Imagem cheia` sem título: imagem ou vídeo até o rodapé.
- Deck HTML com os mesmos layouts, para abrir no navegador sem internet.
- Fontes Outfit e JetBrains Mono (OFL); ícones Phosphor (MIT).
