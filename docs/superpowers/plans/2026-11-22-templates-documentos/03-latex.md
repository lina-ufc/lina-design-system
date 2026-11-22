# 03 · Modelos LaTeX: `lina.cls` com Relatório, Artigo e POP

> **Para agentes:** usar `superpowers:executing-plans` (ou `subagent-driven-development`). Passos em checkbox. Atualizar `progress.md` ao fim de cada tarefa verificada.

**Goal:** Uma classe `lina.cls` com as opções `relatorio`, `artigo` e `pop` e três `.tex` de exemplo compilam com XeLaTeX nas mesmas três páginas do deck HTML (e do Word), e um `check_latex.py` prova isso.

**Architecture:** `templates/documento-a4/latex/` guarda só o que é escrito à mão: `lina.cls`, `LINA-Relatorio.tex`, `LINA-Artigo.tex`, `LINA-POP.tex` e `latex.sh`. O `latex.sh` monta `latex/out/` como a pasta que vai para o Overleaf (classe, `.tex`, `fontes/` copiadas de `assets/fonts/`, `logos/` com o logo em PDF gerado do SVG) e compila os três com `latexmk -xelatex`. A classe carrega as fontes por arquivo (`fontspec` com `Path=fontes/`), nunca pelo nome do sistema. Zip e PDFs publicados ficam no plano 04.

**Tech Stack:** XeLaTeX (TeX Live 2026 *basic* desta máquina + pacotes listados abaixo), `rsvg-convert` (logo SVG → PDF), Python 3 stdlib + `pdfinfo`/`pdffonts` para a checagem, `pdftoppm` para olhar.

**Spec:** `docs/superpowers/specs/2026-11-22-templates-documentos-design.md` (mapa de estilos no fim). **Medidas:** `records/02-word-handoff.md` (tabela "Medidas finais").

## O que o 02 ensinou

- As medidas finais estão no handoff, já acertadas contra o render: margem superior das internas 134 px (Artigo 106, POP 102, porque o espaço antes do rótulo/seção completa o respiro), inferior 64 px, laterais 76 px, cabeçalho a 64 px do topo, rodapé a 40 px do pé. Partir delas, não do cartão antigo nem da conta cheia (a conta cheia estourou a capa no Word).
- O "A" do logo é sempre umbro (decisão do usuário, 2026-11-22): o SVG de `assets/logos/sand/lina-horizontal-ferro.svg` já vem assim. Só o bloco `<metadata>` C2PA sai antes do `rsvg-convert`, como no `build.js`.
- Mono no texto corrido do POP é 10 pt (`LINA Mono Texto`), não 11,5 pt. Cabeçalho mono 9 pt; rodapé mono 8,5 pt a 70 % do umbro.
- JetBrains Mono não tem ☐ (U+2610): critério de aceitação usa □ (U+25A1).
- Elementos presos ao pé (colofão, histórico do artigo, assinaturas do POP) foram o ponto frágil no Word. No LaTeX: `\vfill` antes de um bloco final na mesma página, sem flutuante.
- Checagem em Python stdlib com linha `ok:` no fim: repetir o formato (`check_latex.py` ao lado de `check_word.py`).

## Global Constraints

- Português em textos e comentários (CLAUDE.md §0).
- **Compila no Overleaf e aqui.** Só pacotes presentes no TeX Live *basic* desta máquina (todos estão no Overleaf): `fontspec`, `polyglossia`, `geometry`, `xcolor`, `graphicx`, `fancyhdr`, `titlesec`, `multicol`, `tabularx`, `array`, `booktabs`, `enumitem`, `caption`, `ragged2e`, `setspace`, `microtype`, `etoolbox`, `xparse`, `tikz`, `eso-pic`, `hyperref`, `url`. **Não usar** `tcolorbox`, `lastpage`, `svg`, `needspace`, `textpos` (não instalados aqui). Total de páginas do POP por rótulo próprio (`\AtEndDocument{\label{lina@ultima}}` + `\pageref`). Não instalar pacote com `tlmgr` para contornar: se faltar algo, perguntar.
- **Fontes por arquivo**, nunca por nome do sistema: `\setmainfont{Outfit}[Path=fontes/, Extension=.ttf, UprightFont=*-Light, BoldFont=*-Medium, ...]`, famílias extras para Regular (400), Medium (500), ExtraBold (800) e `\setmonofont{JetBrainsMono}[Path=fontes/, ...]`. Outfit não tem itálico: `\emph` e `\textit` viram peso (`\destaque`).
- **Conversão de medidas, uma regra só:** 1 px do HTML = 0,75 pt (`\newcommand\px[1]{\dimexpr #1pt*3/4\relax}` ou equivalente). Tamanhos de fonte e entrelinhas iguais aos do Word (handoff): corpo 11,5/17,4 pt, 7,5 pt entre parágrafos, justificado; referência 9 pt com recuo pendente 16 px. Nada de número mágico solto.
- **Cores só da paleta**, definidas uma vez na classe: ferro `A81F0D`, ferro-fundo `6E1408`, umbro `2A1A12`, nata `FDF1CF`, fio-forte `C9B87A`; umbro a 70 % e 75 % sobre branco via `xcolor` (`umbro!70!white`).
- **Hifenização pt-BR:** `polyglossia` com `\setdefaultlanguage[variant=brazilian]{portuguese}`. Texto corrido justificado; títulos, rótulos, legendas, tabelas e cabeçalhos à esquerda (`\RaggedRight` do `ragged2e`), números à direita.
- **Quem escreve só usa comandos da classe.** Os `.tex` de exemplo não têm `\vspace`, `\fontsize`, `\color`, `\hspace` nem `\newpage` soltos; o que o desenho pede vira comando ou ambiente em `lina.cls` com o nome do mapa da spec. Exceção contada pelo check: a quebra entre as páginas de demonstração (`\paginademo`, definido na classe).
- **Logo:** só o SVG de `assets/logos/`, convertido para PDF vetorial por `rsvg-convert -f pdf`; `\includegraphics` só com `width=` (nunca `width` e `height` juntos). Figura marcadora desenhada em TikZ (retângulo nata, cantos 11 px, "[ figura ]" mono), sem imagem.
- Nada de `assets/` duplicado no git: `latex/out/` fica no `.gitignore`.

## Medidas de página (do handoff do 02)

| Item | Valor | LaTeX |
|---|---|---|
| Página | A4 | `geometry`: `a4paper` |
| Margens laterais | 76 px (20,1 mm) | `left`, `right` |
| Margem superior das internas | 134 px; Artigo 106 px; POP 102 px | `top` por opção da classe |
| Margem inferior | 64 px | `bottom` |
| Cabeçalho | linha de base a 64 px do topo; logo 14 mm à esquerda; referência mono 9 pt à direita; fio fio-forte 0,75 pt a 12 px abaixo | `fancyhdr`, `\headrule` redefinido na cor fio-forte |
| Rodapé | a 40 px do pé; mono 8,5 pt, umbro 70 %; sigla à esquerda, número à direita | `fancyhdr` (`\fancyfoot`) |
| Capa do Relatório | topo e pé 72 px; logo 40 mm; fio ferro 2 px acima do rótulo, 28 px de respiro | `\newgeometry` + `\thispagestyle{empty}` |
| Duas colunas | entrecoluna 32 px (8,5 mm) | `multicols` com `\columnsep` |

Tamanhos por modelo (rótulo, título, seção) iguais ao objeto `MODELOS` do `word/build.js`: ler de lá, uma opção da classe por modelo.

## Comandos a criar (complementa o mapa da spec)

Além do mapa: `\paginademo` (quebra entre páginas de demonstração), `\figuramarcadora[altura]` (TikZ), `\colofao{}` (bloco no pé do Relatório), `\historico{}` (Correspondência / Histórico / Licença no pé do Artigo), `\assinaturas{}` (pé do POP, linha umbro acima do rótulo), `\criterios` (lista com □), `\registro{n}` (tabela de n linhas vazias de altura fixa), `\numero{}` (mono à direita em célula). Metadados com os nomes da spec: `\referencia`, `\versao`, `\data`, `\titulocurto`, `\siglarodape`.

## Review Focus

1. **Compila do zero no Overleaf.** Teste: `latex.sh` copia `latex/out/` para uma pasta temporária vazia e compila lá; `check_latex.py` lê o `.log` e falha com pacote não listado acima, `Missing character`, referência indefinida ou `Font ... not found`.
2. **Mesmas páginas do HTML.** Teste: `pdfinfo` dá 3 páginas e A4 (595 × 842 pt) em cada PDF; render ao lado de `DocumentoA4-<modelo>.dc.html#1` a `#3` e do Word: mesmas quebras e mesmos elementos.
3. **Só as duas famílias.** Teste: `pdffonts` lista apenas Outfit e JetBrainsMono, todas embutidas (nenhuma Latin Modern).
4. **Hifenização e justificação.** Teste: `pdftotext` do Artigo tem linhas terminadas em hífen nas colunas; olhar no render a página em duas colunas: sem buracos grandes. Log sem `Overfull \hbox` acima de 1 pt.
5. **Logo sem distorção.** Teste: `check_latex.py` falha se algum `\includegraphics` tiver `width` e `height` juntos; `aspect.py` segue `distorcidas: 0`.
6. **Exemplos limpos.** Teste: `check_latex.py` falha se um `.tex` de exemplo tiver `\vspace`, `\hspace`, `\fontsize`, `\color`, `\newpage` ou `\setlength`.

---

### Task 1: Classe base, `latex.sh`, check e Relatório

**Files:**
- Create: `templates/documento-a4/latex/lina.cls`, `latex/LINA-Relatorio.tex`, `latex/latex.sh`
- Create: `templates/documento-a4/check_latex.py`
- Modify: `.gitignore` (linha `templates/documento-a4/latex/out/`)

**Interfaces:**
- Produces: `sh templates/documento-a4/latex/latex.sh` monta `latex/out/` (classe, `.tex`, `fontes/`, `logos/lina-horizontal-ferro.pdf`) e grava `latex/out/LINA-<Modelo>.pdf` para cada `.tex` presente; `python3 templates/documento-a4/check_latex.py` confere `latex/` e `latex/out/` e imprime `ok: …`.

- [ ] **Step 1: Escrever `check_latex.py`** (stdlib + `subprocess` para `pdfinfo`/`pdffonts`/`pdftotext`), sobre cada `latex/LINA-*.tex`: PDF correspondente existe, 3 páginas, A4; `pdffonts` só Outfit e JetBrainsMono, todas `emb yes`; `.log` sem `Missing character`, `undefined`, `not found`, `Overfull \hbox` > 1 pt; pacotes carregados (`\RequirePackage`/`\usepackage` na classe e nos `.tex`) todos na lista do Global Constraints; `.tex` de exemplo sem os comandos proibidos; nenhum `\includegraphics` com `width` e `height` juntos.
- [ ] **Step 2: Rodar** `python3 templates/documento-a4/check_latex.py` — Expected: FAIL (nada escrito).
- [ ] **Step 3: `latex.sh`.** `set -e`; recria `latex/out/`; copia `lina.cls`, `LINA-*.tex`, os `.ttf` usados e as duas OFL para `out/fontes/`; tira o `<metadata>` do SVG do logo e converte com `rsvg-convert -f pdf -o out/logos/lina-horizontal-ferro.pdf`; copia `out/` para uma pasta em `mktemp -d` e roda `latexmk -xelatex -interaction=nonstopmode` em cada `.tex` lá (simula o Overleaf); traz os `.pdf` e `.log` de volta para `out/`.
- [ ] **Step 4: Base da classe.** Opções `relatorio`, `artigo`, `pop` (`\DeclareOption`); `\px`; cores; fontes por arquivo; `polyglossia` pt-BR; `geometry`; corpo justificado com entrelinha e espaço entre parágrafos do handoff; `titlesec` para `\section`/`\subsection` com tamanhos por modelo; `\rotulo`, `\titulo`, `\subtitulo`, `\destaque`, `\mono`, `\fonte`, `caption` para a legenda; ambiente `referencias`; `\metadados` (tabularx com fio acima / entre dois fios); tabela `tabela` com `\numero`; cabeçalho e rodapé (`fancyhdr`); `\paginademo`; `\figuramarcadora`.
- [ ] **Step 5: Relatório.** Capa (`\newgeometry` 72 px, sem cabeçalho nem rodapé: logo 40 mm, "LINA · UFC / Fortaleza, 2026" em duas colunas de metadados; bloco do título no pé por `\vfill`; fio ferro 2 px acima do rótulo; três colunas de metadados com fio fio-forte acima). Meio (cabeçalho e rodapé; "1 · Apresentação" e dois parágrafos em `multicols`; figura marcadora de largura total 300 px; legenda e fonte; "1.1 · Indicadores do ano"; tabela com números à direita). Finalização (`\paginademo`; "5 · Considerações finais" em duas colunas; Equipe em `\metadados` 3 × 2; `\colofao` no pé: logo 110 px, endereço e contato mono). Textos iguais ao HTML e ao `word/build.js`; numeração 2 e 3 depois da capa, como no Word.
- [ ] **Step 6: Rodar** `latex.sh` e o check — Expected: PASS. `pdftoppm -r 80 -png` e olhar as 3 páginas ao lado de `DocumentoA4-Relatorio.dc.html#1` a `#3` e do render Word (`word/out/`): mesmas quebras, mesmos elementos. Mostrar o PNG ao usuário antes de seguir para o Artigo (CLAUDE.md §2: variante visual é decisão dele).
- [ ] **Step 7: Commit** `Documento A4: classe LaTeX e Relatório` e marcar no `progress.md`.

### Task 2: Artigo

**Files:**
- Create: `templates/documento-a4/latex/LINA-Artigo.tex`
- Modify: `templates/documento-a4/latex/lina.cls`

- [ ] **Step 1:** Escrever `LINA-Artigo.tex` só com comandos do mapa (`resumo`, `\palavraschave`, `\historico` ainda não existem). Rodar `latex.sh` e o check — Expected: FAIL (comando indefinido).
- [ ] **Step 2: Artigo na classe.** Primeira página com cabeçalho próprio ("Cadernos LINA · v. 2 · n. 1 · 2026 · p. 1–18", `fancypagestyle`); demais com "Sobrenome et al. · Título abreviado do artigo"; rodapé com DOI em mono à esquerda e número à direita. Entrada: rótulo, título, autores com `\destaque`, afiliação, `resumo` e `\palavraschave` em metadados de duas colunas entre dois fios, Introdução em duas colunas. Meio: Método em duas colunas, figura de largura total 260 px fora do `multicols`, Resultados em duas colunas, Tabela 1 de largura total com título acima. Finalização: Conclusão em duas colunas, Agradecimentos, Referências em duas colunas (`referencias`, `\destaque` no lugar do itálico), `\historico` no pé.
- [ ] **Step 3: Rodar** `latex.sh` e o check — Expected: PASS, Relatório sem regressão. Render e comparar com `DocumentoA4-Artigo.dc.html#1` a `#3` e com o Word, olhando a justificação nas colunas estreitas (aqui a hifenização pt-BR funciona; no LibreOffice não funcionou).
- [ ] **Step 4: Commit** `Documento A4: Artigo em LaTeX` e marcar no `progress.md`.

### Task 3: POP

**Files:**
- Create: `templates/documento-a4/latex/LINA-POP.tex`
- Modify: `templates/documento-a4/latex/lina.cls`, `templates/documento-a4/check_latex.py`

- [ ] **Step 1:** Estender o check: no PDF do POP, `pdftotext` acha "1 / 3", "2 / 3", "3 / 3" no rodapé. Escrever `LINA-POP.tex`. Rodar — Expected: FAIL.
- [ ] **Step 2: POP na classe.** Cabeçalho "POP-04 · v. 2.1 · vigência 03/2026" em todas as páginas; rodapé "LINA · POP-04" e "n / total" (rótulo `lina@ultima`). Entrada: rótulo, título, Responsável / Aplica-se a / Duração em `\metadados`, Objetivo, Material, Procedimento (`passos` 01–04: número mono negrito ferro, texto justificado), `atencao` (TikZ ou `\colorbox` com fundo nata e cantos de 11 px; cantos retos aceitos se o arredondado quebrar a página, anotar). Meio: Procedimento (continuação) com passos 05–08 (`passos` continua a contagem), Tabela 1 de parâmetros com nota, `\criterios` com □. Finalização: Registro de execução (`\registro{5}`), Histórico de revisões, Documentos relacionados com códigos em `\mono` 10 pt, `\assinaturas` no pé.
- [ ] **Step 3: Rodar** `latex.sh` e o check — Expected: PASS, Relatório e Artigo sem regressão. Render e comparar com `DocumentoA4-POP.dc.html#1` a `#3` e com o Word.
- [ ] **Step 4: Commit** `Documento A4: POP em LaTeX` e marcar no `progress.md`.

### Task 4: Conferência e passagem para o 04

**Files:**
- Create: `docs/superpowers/plans/2026-11-22-templates-documentos/records/03-latex-handoff.md`

- [ ] **Step 1:** Rodar `latex.sh`, `check_latex.py` e `aspect.py`. Num `.tex` de exemplo, acrescentar um parágrafo no corpo e um passo no POP: compila, estilo segue, só a quebra de página muda. Desfazer.
- [ ] **Step 2:** Montar uma folha PNG por modelo com HTML, Word e LaTeX lado a lado (só para olhar; a folha oficial é do 04) e mostrar ao usuário. Ajustes visuais pedidos voltam às Tasks 1–3.
- [ ] **Step 3:** Escrever o handoff: diferenças conhecidas LaTeX × HTML × Word, pacotes usados, o que o `latex.sh` monta (é a base do `LINA-Documentos-LaTeX.zip` do 04), como o workflow deve rodar (TeX Live no runner ou PDFs commitados: deixar a escolha anotada para o 04).
- [ ] **Step 4: Commit** `Documento A4: conferência do LaTeX` e marcar o plano 03 como concluído no `progress.md`.
