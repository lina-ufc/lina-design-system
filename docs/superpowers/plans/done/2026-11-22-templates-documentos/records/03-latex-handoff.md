# 03 · LaTeX — handoff para o 04 (conferência e publicação)

Data: 2026-11-22. Commits do plano 03: `b472cb5` (classe e Relatório, + correção 1), `3973f4e` (Artigo), `bde6b1d` (POP), `cbeacd8` (correção 1 de Artigo e POP).

## Estado

- Classe: `templates/documento-a4/latex/lina.cls`, opções `relatorio`, `artigo`, `pop`. Modelos: `LINA-{Relatorio,Artigo,POP}.tex` (só comandos da classe; nada de `\vspace`, `\fontsize`, `\color`, `\hspace`, `\newpage`, `\setcounter`).
- `sh templates/documento-a4/latex/latex.sh` monta `latex/out/` e compila com XeLaTeX (`latexmk`) numa pasta temporária só com o conteúdo de `out/`, como no Overleaf.
- Checagem: `python3 templates/documento-a4/check_latex.py` -> `ok: 3 modelos` (3 páginas A4 por PDF, fontes embutidas e só Outfit/JetBrains Mono, texto de cada página nas mesmas quebras do HTML, sem distorção de imagem). `grep -c Overfull` nos três `.log`: 0.
- `aspect.py` só lê `.pptx`; não se aplica ao LaTeX. O `check_latex.py` falha se um `\includegraphics` tiver `width` e `height` juntos.
- Robustez (2026-11-22): parágrafos extras no corpo do Artigo e um passo extra no POP compilam; estilo igual, 3 páginas, nada sobreposto, rodapé no pé. Só a quebra muda, e o check acusa isso (esperado). Desfeito; `ok: 3 modelos`.

## O que o `latex.sh` monta em `latex/out/`

Base do `LINA-Documentos-LaTeX.zip` do 04 (a pasta que vai para o Overleaf):

- `lina.cls`, `LINA-Relatorio.tex`, `LINA-Artigo.tex`, `LINA-POP.tex`
- `fontes/`: Outfit Light, Regular, Medium, Bold, ExtraBold; JetBrains Mono Regular e Bold; `OFL.txt` e `OFL-JetBrainsMono.txt`
- `logos/lina-horizontal-ferro.pdf` (do SVG, sem metadados C2PA, via `rsvg-convert`; o "A" já vem em umbro)
- Saídas da compilação (não entram no zip): `LINA-*.pdf` e `LINA-*.log`
- `out/` está no `.gitignore`; `latex.sh` apaga e recria a pasta.

Para o zip: copiar de `out/` só `lina.cls`, `*.tex`, `fontes/`, `logos/` (mais um LEIA-ME curto: compilar com XeLaTeX, não pdfLaTeX). Dependências de máquina: `latexmk`, `xelatex`, `rsvg-convert`, `perl`.

## Pacotes usados

fontspec, polyglossia (pt-BR), xcolor, graphicx, array, tabularx, multicol, ragged2e, caption, titlesec, fancyhdr, tikz, microtype, geometry (a classe base é `article`, `a4paper`). Fios por `\noalign{\hrule}`, sem `colortbl`/`booktabs`. Registro do POP em expl3.

## Comandos da classe (nomes)

- Metadados e cabeçalho: `\referencia`, `\versao`, `\data`, `\titulocurto`, `\siglarodape`, `\cabecalhoprimeira`, `\mostrar{referencia|versao|data}`.
- Texto: `\rotulo`, `\titulo`, `\subtitulo`, `\autores`, `\afiliacao`, `\destaque`, `\mono`, `\numero`, `\fonte`, `\nota`, `\textomenor`, `\doi`, `\continuacao`, `\paginademo`.
- Seções: `\section` (numeração manual no texto, `secnumdepth=0`), `\secaotabela`, `\secaoafastada`, `\secaoafastadatabela`, `\secaosolta`, `\secaofio`.
- Ambientes: `capa`, `metadados`, `metadados*`, `tabela` (`\titulotabela`), `colunas` (`\columnbreak`), `resumo` (`\palavraschave`), `referencias`, `passos`, `criterios`, `atencao` (`\rotuloatencao`), `\registro{n}`, `\historico`, `\assinaturas`, `\chamadatabela`, `\colofao`.
- Figuras: `\figuramarcadora[px]`, `\legenda{}` (sem flutuante).
- Colunas de tabela: `Y`, `N`, `W{px}`.
- Medidas: 1 px do HTML = 0,75 pt (`\px{}`); `\linatam{pt}{px}` fixa corpo e entrelinha.

## Medidas

Iguais às do handoff do Word (laterais 76 px, inferior 64 px, cabeçalho a 64 px, corpo Outfit Light 11,5 pt com entrelinha 17,4 pt, entrecoluna 32 px, capa 72 px). Exceção: margem superior do Artigo 134 px (rótulo desce 8 px por `\raisebox`) e do POP 141 px, contra 106/102 do plano, porque um `\vskip` no topo da página é descartado pelo TeX.

## Diferenças conhecidas (LaTeX × HTML × Word)

- **Hifenização pt-BR:** o LaTeX hifeniza (polyglossia); Word e LibreOffice daqui não (sem dicionário). No Artigo o resumo quebra em 2 linhas (HTML 3) e Palavras-chave e Introdução sobem 16–19 pt. É o único Δ acima de 4 pt contra o HTML; no POP e no Relatório todos <= 4 pt (cabeçalho/rodapé +2,4/+2,8 pt; Relatório mantém -7 pt da Task 1).
- **Títulos sem `text-wrap:balance`:** o HTML equilibra as linhas; Word e LaTeX não. O título do Relatório quebra como o HTML por `\rightskip` e sem hifenização.
- **Numeração de página do Artigo:** 1, 2, 3 (HTML 1, 9, 18), como o Word. O cabeçalho da 1ª página diz "p. 1–18" (texto fixo do exemplo).
- **Figura do Artigo:** o exemplo mostra "Figura 1." (HTML e Word "Figura 2."), porque o `\setcounter` foi proibido.
- **Referências:** `\destaque` (peso Medium/Bold) no lugar do itálico; Outfit não tem itálico. Vale para todo itálico e negrito: viram Medium/Bold.
- **Caixa Atenção:** cantos de 11 px (TikZ) no LaTeX; Word reto; HTML arredondado.
- **Mono:** JetBrains Mono Regular, mais leve que no render do Word (aquele pega a variável instalada na máquina). Mono no texto em 10 pt.
- **Marcador dos critérios:** □ (U+25A1) como no Word.
- **Word alinhado ao HTML** em `b6f1aa2` e `2225370` (espaçamentos); medido no LibreOffice, não no Word real.

## Armadilhas

- Dentro de `metadados`/`tabela`, quebra de linha é `\newline`; `\\` fecha a linha; a última linha fica sem `\\`. Célula de várias linhas engole `\\[..]`: o `resumo` usa `\noalign{\vskip}`.
- `\restoregeometry` deixava o `\vsize` da capa na 2ª página (rodapé sumia); a classe reajusta `\@colht`, `\@colroom`, `\vsize` no fim de `capa`.
- Fechar a linha no código de fim de ambiente quebra o `tabularx`: o fio de baixo de `metadados*` vem depois de `\endtabularx`.
- `\@whilenum` quebra dentro de tabular; por isso `\registro` é expl3 (`\prg_replicate:nn`).
- Constantes de acerto contra o HTML, comentadas na classe: -5,3 px no fim de `colunas`, 35 em `\secaosolta`, -6,4 em `\textomenor`, 15 no fim de `resumo`, 39,7/29,7 de profundidade em `\historico`/`\assinaturas`, `\chamadatabela`, `\lina@titantes` por opção. Texto de exemplo diferente pode pedir outro acerto.
- Quebras de página do exemplo são conferidas pelo texto (`QUEBRAS` em `check_latex.py`); ao mudar o conteúdo dos `.tex`, atualizar a tabela.
- Avisos que ficam no `.log` e não falham o check: `OML/cmm`, `OMS/cmsy`, `OT1/cmr` indisponíveis (fontes de matemática, não vão ao PDF), `microtype` sobre `\c T`, `Underfull \hbox` em colunas estreitas.

## Não verificado

- Overleaf real (simulado por compilação em pasta vazia, XeLaTeX local).
- Sem Word real nesta máquina (vale também para o Word, ver handoff 02).

## Para o 04: TeX Live no workflow ou PDFs commitados

Escolha anotada, não decidida.

- **TeX Live no runner** (`latex.sh` no Actions): prós: PDFs sempre regerados do `.tex`/`.cls`, sem arquivo binário no git. Contras: instalar TeX Live (pacote `texlive-xetex` + `texlive-lang-portuguese` + `latexmk`, e `tlmgr install` do que faltar no scheme basic: polyglossia, fontspec, microtype, titlesec, ragged2e, tabularx, multicol, caption, tikz/pgf, fancyhdr, xcolor) é lento (minutos), sensível a versão de pacote, e exige `librsvg2-bin` e `perl`.
- **PDFs commitados** (`latex/out/*.pdf` fora do `.gitignore` ou cópia em pasta versionada): prós: workflow rápido e sem TeX; o site só publica o que já está no repositório. Contras: PDF binário no git, pode ficar defasado em relação ao `.tex`/`.cls` (precisa de checagem de que foram regerados), PDFs variam por versão do TeX Live da máquina de quem compilou.
