# Templates de documentos A4 em Word e LaTeX

Data: 2026-11-22. Estado: aprovado em 2026-11-22.

## Intenção

Alunos e coordenação do LINA escrevem relatórios, artigos e procedimentos (POP). Hoje o sistema só
mostra esses documentos como desenho em HTML (`templates/documento-a4/DocumentoA4.dc.html`), sem
arquivo para editar. Este trabalho entrega os três modelos em Word e em LaTeX, com a mesma aparência
do desenho, e troca o quadro longo do site por uma janela que passa uma página por vez, como o deck
da apresentação.

## Objetivos

- Três modelos, os mesmos do exemplo: Relatório institucional, Artigo acadêmico e POP. Cada um com as
  páginas de entrada, meio e finalização que o HTML já mostra.
- Word: um `.dotx` por modelo, com estilos nomeados (o usuário escreve aplicando estilos, não
  formatação direta), mais um `.docx` de exemplo preenchido por modelo.
- LaTeX: uma classe `lina.cls` com as três variantes (opção da classe), três `.tex` de exemplo e
  um zip pronto para subir no Overleaf, com fontes e logos dentro.
- PDF de exemplo de cada modelo para quem só quer consultar.
- Texto corrido justificado, com hifenização em português, em todo lugar onde hoje está alinhado à
  esquerda (parágrafos, colunas, resumo, passos do POP). Títulos, rótulos, legendas curtas, tabelas e
  cabeçalhos continuam alinhados à esquerda; números e datas alinhados à direita continuam à direita.
  Vale para o HTML, o Word e o LaTeX.
- Site, seção 8.2 Documentos A4, no padrão do capítulo: Estrutura, Exemplo (a janela paginada), Uso
  (passo a passo para Word e para LaTeX/Overleaf) e Baixar (cards + complementos: fontes 5.5, logos 1.8).

## Fora do escopo

- Google Docs, ofício, carta, pôster e outros modelos.
- Modelos de revista específica (ABNT completo, IEEE etc.): o artigo é o formato do laboratório.

## O que tornaria isto um fracasso

- Modelo Word que quebra quando a pessoa digita: formatação direta no lugar de estilos, caixas de
  texto flutuantes para o corpo, quebras manuais segurando o layout.
- Classe LaTeX que não compila no Overleaf (pacote fora do TeX Live, fonte do sistema).
- Logo distorcido ou rasterizado em baixa resolução (`aspect.py` deve dar `distorcidas: 0`).
- Word e LaTeX visivelmente diferentes do desenho aprovado sem que isso seja dito.

## Restrições

- Fontes: Outfit e JetBrains Mono (OFL), em `assets/fonts/`. LaTeX usa `fontspec` com os arquivos
  dentro do zip (compila com XeLaTeX ou LuaLaTeX). Word: fontes embutidas no `.dotx`/`.docx` quando a
  biblioteca permitir; em todo caso, a seção Uso manda instalar as fontes (5.5) antes de abrir.
- Logos: só os de `assets/logos/`. Nada redesenhado à mão (CLAUDE.md §3).
- Medidas do desenho (cartão "Como usar" do HTML): A4, margens laterais 20 mm, superior e inferior
  17 mm, capa com 19 mm no topo; logotipo de 40 mm na capa e 14 mm no cabeçalho corrido; um fio ferro
  na entrada do título.
- Cores: as variáveis que o HTML já usa (`--ferro`, `--umbro`, `--nata`, `--creme`, `--fio-forte`), com os valores da paleta do sistema.

## Abordagens consideradas

- **A. HTML como referência; Word e LaTeX feitos para bater com ele (escolhida).** A janela do site
  mostra o HTML, nítido e com texto selecionável. Word e LaTeX são gerados por código e conferidos
  página a página contra o HTML. Pode haver pequenas diferenças de quebra de linha e espaçamento; a
  comparação as mostra.
- B. A janela mostra os PDFs gerados. Prévia idêntica ao download, mas vira imagem, perde texto
  selecionável e exige duas prévias (Word e LaTeX).
- C. Fonte única em Markdown convertida pelo pandoc. Não segura capa, cabeçalho com logo nem as
  caixas do POP. Descartada.

O usuário escolheu A, com o texto corrido justificado.

## Como (decidido)

- Janela do site: `DocumentoA4.dc.html` passa a usar `<deck-stage width="794" height="1123">`, uma
  `<section>` por página A4 (9 páginas). No site entra por `<!--quadro templates/documento-a4/DocumentoA4.dc.html 794x1123-->`
  (Mudou em 2026-11-22, a pedido do usuário: três decks de 3 páginas, `DocumentoA4-Relatorio`, `-Artigo` e
  `-POP.dc.html`, lado a lado no site, um quadro cada.)
  dentro do fragmento da 8.2, sem coluna de miniaturas (`_snthumb`), igual à apresentação.
- Word gerado em Node com a biblioteca `docx` (npm), na pasta do template, na mesma pilha do
  `potx/build.js`. `.dotx` = `.docx` com o content type de template.
- LaTeX escrito à mão: uma classe e três exemplos.

## Deixado para quem constrói (decisões minhas, a conferir)

- Onde fica o código: `templates/documento-a4/word/` (gerador Node) e `templates/documento-a4/latex/`
  (classe e exemplos), saída em `templates/documento-a4/` e pacotes em `downloads/`.
- O cartão "Como usar" do HTML sai do deck e vira a seção Uso do site.
- Publicação: tag `documentos-vX.Y.Z` com workflow igual ao `release-apresentacao.yml` (fontes vêm de
  `assets/fonts/`), `CHANGELOG.md` em `templates/documento-a4/`; o site pega os links da release.
- Conferência: Word para PDF pelo LibreOffice (`soffice --headless`), LaTeX por `latexmk -xelatex`,
  PDF para PNG por `pdftoppm`, lado a lado com o HTML renderizado. Mostrar ao usuário antes de publicar.

## Respostas à leitura do revisor (decisões minhas)

- **Mapeamento.** Cada bloco do HTML vira estilo de parágrafo, estilo de caractere ou tabela do
  Word, nunca caixa de texto flutuante; no LaTeX, comando ou ambiente da classe. A capa do relatório
  é uma seção própria do Word (sem cabeçalho), com o bloco de título ancorado por espaçamento de
  parágrafo. Caixas do POP (atenção, passos) e metadados (assinaturas, histórico, datas do artigo)
  são tabelas com estilo de tabela. O plano traz a tabela HTML → estilo Word → comando LaTeX.
- **Cabeçalho, rodapé e numeração.** Como no HTML: capa do relatório sem cabeçalho nem número;
  páginas seguintes com logotipo de 14 mm e referência no cabeçalho, sigla e número no rodapé
  (relatório e artigo em arábico simples; POP em "n / total"). Sem sumário automático: o HTML não
  tem, e campo TOC sai vazio no PDF gerado pelo LibreOffice.
- **Fontes.** `assets/fonts/` tem Outfit estática em nove pesos e JetBrains Mono Regular, Medium e
  Bold. Outfit não tem itálico: ênfase em peso, não em itálico. O Word embute as fontes se a
  biblioteca `docx` permitir; senão, fica a instrução de instalar (5.5).
- **Hifenização.** HTML com `lang="pt-BR"` e `hyphens:auto` no texto justificado; Word com idioma
  pt-BR nos estilos e hifenização automática ligada no documento; LaTeX com `polyglossia`
  (`brazilian`).
- **Pronto quando.** Cada modelo, em Word e em LaTeX, tem as mesmas páginas do HTML (entrada, meio,
  finalização), com as mesmas quebras de página e os mesmos elementos. Diferença de quebra de linha
  dentro do parágrafo é aceita. A conferência usa LibreOffice para o Word; diferenças conhecidas
  entre LibreOffice e Word ficam anotadas, não perseguidas.
- **Pacotes.** Release `documentos-vX.Y.Z` com `LINA-Documentos-Word.zip` (três `.dotx` e três
  `.docx` de exemplo), `LINA-Documentos-LaTeX.zip` (classe, três `.tex`, fontes e logos, pronto para o
  Overleaf) e três PDFs de exemplo. O workflow copia fontes e logos de `assets/` na hora; nada
  duplicado no git. `_gerar`/`sistema.py` só mudam para os links da 8.2.

## Mapa de estilos (comum a Word e LaTeX)

| Elemento no HTML | Estilo Word (nome visível) | LaTeX |
|---|---|---|
| rótulo ferro em caixa alta (`Relatório institucional`, `Artigo`) | `LINA Rótulo` | `\rotulo{}` |
| h1 | `Title` → nome `LINA Título` | `\titulo{}` + `\maketitle` |
| subtítulo leve | `Subtitle` → `LINA Subtítulo` | `\subtitulo{}` |
| h2 26 px / 15 px (artigo) / 18 px (POP) | `Heading 1` → `LINA Seção` (tamanho por modelo) | `\section` (titlesec) |
| h2 18 px (relatório) | `Heading 2` → `LINA Subseção` | `\subsection` |
| parágrafo | `Normal` → `LINA Corpo` (justificado) | texto (justificado) |
| resumo, palavras-chave | `LINA Resumo` | `resumo` (ambiente), `\palavraschave{}` |
| legenda "Figura n." | `Caption` → `LINA Legenda` | `\caption` (caption pkg) |
| "Fonte: …" mono | `LINA Fonte` | `\fonte{}` |
| referência bibliográfica | `LINA Referência` (recuo pendente) | `referencias` (ambiente) |
| passo do POP (01, 02…) | tabela `LINA Passos` (2 colunas: número mono ferro, texto justificado) | `passos` (ambiente `enumerate` com rótulo `\texttt{01}`) |
| caixa "Atenção." | tabela `LINA Atenção` (1 célula, fundo nata) | `atencao` (ambiente) |
| metadados (responsável, histórico, assinaturas, equipe) | tabela `LINA Metadados` | `\metadados{}` com `tabularx` |
| tabela de dados | tabela `LINA Tabela` (números mono à direita) | `tabela` via `tabularx` |
| texto mono inline (códigos, DOI) | estilo de caractere `LINA Mono` | `\mono{}` |
| peso 500 inline | estilo de caractere `LINA Destaque` | `\destaque{}` |

Metadados do documento, mesmos nomes nos dois formatos: `referencia` (REL-2026-01, POP-04, DOI), `versao`, `data`, `titulocurto`, `siglarodape` (`LINA · UFC`, `LINA · POP-04`).
