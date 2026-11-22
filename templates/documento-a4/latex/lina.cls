% lina.cls — Documento A4 do LINA Design System (Relatório, Artigo, POP).
% Opções: relatorio | artigo | pop. Fontes por arquivo (pasta fontes/), logo em logos/.
% Compila com XeLaTeX (latexmk -xelatex), aqui e no Overleaf.
\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{lina}[2026/11/22 LINA Documento A4]

% ---------- medidas: 1 px do HTML = 0,75 pt ----------
\newcommand\px[1]{\dimexpr #1pt*3/4\relax}

% ---------- modelos: tamanhos iguais aos de MODELOS em word/build.js ----------
% Fontes em pt (como no Word), entrelinhas em px do HTML, "antes"/"depois" em px.
% Cada opção define tudo o que a classe usa (nada vaza do relatorio, o padrão de \ExecuteOptions).
% \lina@fio@rotulo: só no relatorio, fio ferro de 2 px com 28 px de respiro acima do rótulo.
\DeclareOption{relatorio}{%
  \def\lina@top{134}%
  \def\lina@rotpt{12}\def\lina@rotantes{0}%
  \def\lina@fontetitulo{Outfit-ExtraBold}\def\lina@titpt{42}\def\lina@titlh{57.12}\def\lina@titls{-2}\def\lina@titantes{14}%
  \def\lina@secpt{19.5}\def\lina@seclh{29.9}\def\lina@secls{-1}\def\lina@secantes{0}\def\lina@secdepois{18}%
  \def\lina@fio@rotulo{{\color{ferro}\hrule height\px{2}}\vskip\px{28}}%
  \def\lina@cabecalho{\lina@referencia\ · \lina@titulocurto}}
% Margem superior: o plano previa 106 px (Artigo) e 102 px (POP), contando o "antes" da 1ª seção/rótulo. No LaTeX um espaço
% no topo da página é descartado, então a margem já é a distância final até o texto: Artigo 134 px (seção) e rótulo
% 8 px mais baixo (\lina@rotantes, 44 px no HTML contra 36 da seção); POP 141 px (HTML: 44 px sob o cabeçalho + 7 px medidos).
\DeclareOption{artigo}{%
  \def\lina@top{134}%
  \def\lina@rotpt{10}\def\lina@rotantes{8}%   % o resto dos 44 px do HTML vem da margem superior
  \def\lina@titpt{24}\def\lina@titlh{35.84}\def\lina@titls{-1.2}\def\lina@titantes{2.4}%
  \def\lina@secpt{11.5}\def\lina@seclh{23.25}\def\lina@secls{0}\def\lina@secantes{28}\def\lina@secdepois{8}%
  \def\lina@fontetitulo{Outfit-Bold}\def\lina@fio@rotulo{}%
  \def\lina@cabecalho{\lina@titulocurto}}
\DeclareOption{pop}{%
  \def\lina@top{141}%
  \def\lina@rotpt{10}\def\lina@rotantes{0}%
  \def\lina@titpt{24}\def\lina@titlh{35.84}\def\lina@titls{-1.2}\def\lina@titantes{-4.5}%
  \def\lina@secpt{13.5}\def\lina@seclh{21.6}\def\lina@secls{0}\def\lina@secantes{18}\def\lina@secdepois{-2}%   % 28 e 8 px menos o \parskip de 10 px que o \section solto leva%
  \def\lina@fontetitulo{Outfit-Bold}\def\lina@fio@rotulo{}%
  \def\lina@cabecalho{\lina@titulocurto}%
  \AtEndOfClass{\renewcommand\lina@tcs{10}\renewcommand\lina@metafio{}\renewcommand\lina@metaantes{6.4}\renewcommand\lina@metapad{0}}%   % metadados do POP: sem fio, gap 20 px
  \def\lina@total{\ /\ \pageref{lina@ultima}}\AtEndDocument{\label{lina@ultima}}}  % "n / total" no rodapé
\def\lina@total{}
\ExecuteOptions{relatorio}
\ProcessOptions\relax
\LoadClass[a4paper]{article}

% ---------- pacotes (só os da lista do plano) ----------
\RequirePackage{fontspec}
\RequirePackage{polyglossia}
\RequirePackage{xcolor}
\RequirePackage{graphicx}
\RequirePackage{array}
\RequirePackage{tabularx}
\RequirePackage{multicol}
\RequirePackage{ragged2e}
\RequirePackage{caption}
\RequirePackage{titlesec}
\RequirePackage{fancyhdr}
\RequirePackage{tikz}
\RequirePackage{microtype}
\RequirePackage[left=\px{76},right=\px{76},top=\px{\lina@top},bottom=\px{64},
  headheight=\px{39},headsep=\dimexpr\px{\lina@top}-\px{64}-\px{39}\relax,footskip=\px{24}]{geometry}

\setdefaultlanguage[variant=brazilian]{portuguese}

% ---------- cores (paleta) ----------
\definecolor{ferro}{HTML}{A81F0D}
\definecolor{ferro-fundo}{HTML}{6E1408}
\definecolor{umbro}{HTML}{2A1A12}
\definecolor{nata}{HTML}{FDF1CF}
\definecolor{fio-forte}{HTML}{C9B87A}

% ---------- fontes por arquivo ----------
\defaultfontfeatures{Path=fontes/, Extension=.ttf, Ligatures=TeX}
\setmainfont{Outfit-Light}[BoldFont=Outfit-Medium, ItalicFont=Outfit-Medium, BoldItalicFont=Outfit-Medium]
\setmonofont{JetBrainsMono-Regular}[BoldFont=JetBrainsMono-Bold, ItalicFont=JetBrainsMono-Regular, BoldItalicFont=JetBrainsMono-Bold]
\newfontfamily\lina@f@rotulo{Outfit-Medium}[LetterSpace=8]
\newfontfamily\lina@f@titulo{\lina@fontetitulo}[LetterSpace=\lina@titls]
\newfontfamily\lina@f@secao{Outfit-Bold}[LetterSpace=\lina@secls]
\newfontfamily\lina@f@bold{Outfit-Bold}
\newfontfamily\lina@f@regular{Outfit-Regular}   % peso 400: caixa Atenção (POP)

% tamanho em pt, entrelinha em px
\newcommand\linatam[2]{\fontsize{#1pt}{\px{#2}}\selectfont}

% ---------- corpo ----------
\setlength\parindent{0pt}
\setlength\JustifyingParindent{0pt}
\setlength\parskip{\px{10}}
\raggedbottom
\emergencystretch=3em
\renewcommand\normalsize{\normalfont\linatam{11.5}{23.2}}   % 17,4 pt
\AtBeginDocument{\normalsize\color{umbro}}
\setcounter{secnumdepth}{0}   % o número vai no texto do título: \section{1 · Apresentação}

% ---------- metadados (mesmos nomes do Word) ----------
\def\lina@referencia{}\def\lina@versao{}\def\lina@data{}\def\lina@titulocurto{}\def\lina@siglarodape{LINA · UFC}
\newcommand\referencia[1]{\def\lina@referencia{#1}}
\newcommand\versao[1]{\def\lina@versao{#1}}
\newcommand\data[1]{\def\lina@data{#1}}
\newcommand\titulocurto[1]{\def\lina@titulocurto{#1}}
\newcommand\siglarodape[1]{\def\lina@siglarodape{#1}}
\def\lina@cabprimeira{}
\newcommand\cabecalhoprimeira[1]{\def\lina@cabprimeira{#1}}   % cabeçalho próprio da 1ª página (Artigo)
\newcommand\mostrar[1]{\csname lina@#1\endcsname}

% ---------- estilos de caractere ----------
\newcommand\destaque[1]{\textbf{#1}}
\newcommand\mono[1]{{\ttfamily\fontsize{10pt}{\f@baselineskip}\selectfont #1}}   % LINA Mono Texto: 13 px = 10 pt
\newcommand\fonte[1]{{\ttfamily\fontsize{8.5pt}{\f@baselineskip}\selectfont\color{umbro!75!white}#1}}
\newcommand\rotulometa[1]{{\color{umbro!70!white}#1}}
\newcommand\doi[1]{{\ttfamily\fontsize{8.25pt}{\f@baselineskip}\selectfont #1}}
\newcommand\numero[1]{{\ttfamily\fontsize{10pt}{\f@baselineskip}\selectfont #1}}

% ---------- título, rótulo, subtítulo ----------
\newcommand\rotulo[1]{\par\lina@fio@rotulo
  {\noindent\lina@f@rotulo\linatam{\lina@rotpt}{20}\color{ferro}\RaggedRight\raisebox{-\px{\lina@rotantes}}[\height][\depth]{\MakeUppercase{#1}}\par}}
% \lina@rotantes: desce o texto do rótulo sem mexer na caixa (um \vskip no topo da página seria descartado)
\newcommand\titulo[1]{\par\vskip\px{\lina@titantes}%
  {\noindent\lina@f@titulo\linatam{\lina@titpt}{\lina@titlh}\RaggedRight\rightskip=0pt plus 1fil\hyphenpenalty=10000 #1\par}}
\newcommand\subtitulo[1]{\par\vskip\px{22}%
  {\noindent\begin{minipage}{\px{497}}\linatam{13.5}{23}\RaggedRight #1\par\end{minipage}\par}\vskip\px{64}}

% espaço de n px acima de um parágrafo solto (desconta o \parskip que o parágrafo traz)
\newcommand\lina@antes[1]{\par\vskip\dimexpr\px{#1}-\parskip\relax}
% Artigo: autores e afiliação
\newcommand\autores[1]{\lina@antes{18}{\noindent\linatam{11.25}{\lina@autlh}\RaggedRight #1\par}}
\newcommand\afiliacao[1]{\lina@antes{4}{\noindent\linatam{9}{\lina@autlh}\RaggedRight\color{umbro!75!white}#1\par}}
\def\lina@autlh{18.9}
% texto em 14 px justificado (resumo, agradecimentos)
\newcommand\textomenor[1]{\lina@antes{8}{\linatam{10.5}{21.7}#1\par}\vskip-\px{6.4}}  % -6,4: acerto contra o HTML

% ---------- seções ----------
\newlength\lina@sa \newlength\lina@sd \newlength\lina@ssa \newlength\lina@ssd
\setlength\lina@sa{\px{\lina@secantes}}\setlength\lina@sd{\px{\lina@secdepois}}
\setlength\lina@ssa{\px{36}}\setlength\lina@ssd{\px{12}}
\titleformat{\section}{\lina@f@secao\linatam{\lina@secpt}{\lina@seclh}\RaggedRight}{}{0pt}{}
\titlespacing*{\section}{0pt}{\lina@sa}{\lina@sd}
\titleformat{\subsection}{\lina@f@bold\linatam{13.5}{22.5}\RaggedRight}{}{0pt}{}
\titlespacing*{\subsection}{0pt}{\lina@ssa}{\lina@ssd}

% seção fora das colunas (Agradecimentos, Referências): entrelinha normal da Outfit (1,26); o espaço abaixo vem de quem segue
\newcommand\secaosolta[1]{\lina@antes{35}{\noindent\lina@f@secao\linatam{\lina@secpt}{18.9}\RaggedRight #1\par}\nobreak}  % 35 = 28 + 7: acerto contra o HTML

% ---------- duas colunas ----------
\setlength\columnsep{\px{32}}
\setlength\multicolsep{0pt}
% \begin{colunas}: duas colunas com 28 px acima (descartados se começar a página)
\newenvironment{colunas}{\par\vskip\dimexpr\px{28}-\parskip\relax\addtolength\lina@sd{-\parskip}\begin{multicols}{2}}
  {\end{multicols}\addtolength\lina@sd{\parskip}\vskip-\px{5.3}}  % o fim do multicols deixa ~4 pt a mais que o HTML

% ---------- legenda e figura marcadora ----------
\DeclareCaptionFont{lina}{\linatam{9}{17.4}}
\captionsetup{font=lina,labelfont=bf,labelsep=period,justification=raggedright,singlelinecheck=false,
  aboveskip=\px{10},belowskip=0pt}
\newcommand\legenda[1]{\par\noindent\parbox{\linewidth}{\captionof{figure}{#1}}\par}
\newlength\lina@alt
\newcommand\figuramarcadora[1][300]{\par\vskip\px{28}\setlength\lina@alt{\px{#1}}%
  \noindent\begin{tikzpicture}
    \fill[nata,rounded corners=\px{11}] (0,0) rectangle (\linewidth,\lina@alt);
    \node[font=\ttfamily\fontsize{9pt}{9pt}\selectfont,text=umbro!60!nata] at (current bounding box.center) {[ figura ]};
  \end{tikzpicture}\par}

% ---------- fios, metadados, tabela ----------
\newcommand\lina@fio[1]{\noalign{{\color{#1}\hrule height\px{1}}}}
\newcolumntype{Y}{>{\lina@cab\RaggedRight\arraybackslash}X}
\newcolumntype{R}{>{\RaggedLeft\arraybackslash\ttfamily\fontsize{9pt}{\px{18}}\selectfont}X}
\newcolumntype{W}[1]{>{\lina@cab\RaggedRight\arraybackslash}p{\px{#1}}}   % coluna de largura fixa em px, texto à esquerda
\newcolumntype{N}{>{\lina@cab\RaggedLeft\arraybackslash}p{\px{90}}}
% \begin{metadados}[respiro em px]{colunas}: fio fio-forte acima; linhas separadas por 14 px.
% \begin{metadados*}[respiro em px]{colunas}: fio fio-forte acima e abaixo; linhas separadas por 18 px.
% Dentro da célula, quebra de linha é \newline; \\ termina a linha da tabela (a última fica sem \\).
\newcommand\lina@tcs{12}
\newcommand\lina@metafio{\lina@fio{fio-forte}}
\newcommand\lina@metaantes{0}
\newcommand\lina@metanl{\tabularnewline[\px{\lina@metagap}]}
\newcommand\lina@metabegin[2]{\par\vskip\dimexpr\px{\lina@metaantes}-\parskip\relax\begingroup\linatam{10}{19.5}\def\lina@pad{#1}%
  \setlength\tabcolsep{\px{\lina@tcs}}\def\arraybackslash{\let\\\lina@metanl}%
  \tabularx{\linewidth}{@{}#2@{}}\lina@metafio\noalign{\vskip\px{#1}}}
\newcommand\lina@metapad{12}
\newenvironment{metadados}[2][\lina@metapad]{\def\lina@metagap{14}\lina@metabegin{#1}{#2}}{\endtabularx\endgroup\par}
\newenvironment{metadados*}[2][20]{\def\lina@metagap{18}\lina@metabegin{#1}{#2}}%
  {\endtabularx\par\vskip\px{\lina@pad}{\color{fio-forte}\hrule height\px{1}}\endgroup\par}
% resumo do Artigo: metadados* de duas colunas (rótulo de 110 px, texto justificado), 28 px abaixo da afiliação.
% \begin{resumo} texto \palavraschave{termos} \end{resumo}
% (a célula de várias linhas engole o espaço do \\[..]: aqui o espaço entre linhas vai em \noalign)
\newenvironment{resumo}{\par\vskip\px{28}\def\lina@tcs{9}\renewcommand\lina@metanl{\tabularnewline\noalign{\vskip\px{18}}}%
  \lina@metabegin{20}{>{\linatam{10.5}{21.7}\bfseries\RaggedRight\arraybackslash}p{\px{110}}>{\linatam{10.5}{21.7}\justifying\arraybackslash}X}\destaque{Resumo} &}%
  {\endtabularx\par\vskip\px{\lina@pad}{\color{fio-forte}\hrule height\px{1}}\endgroup\par\vskip\px{15}}  % 15: acerto contra o HTML (colunas desconta um \parskip que aqui não há)
\newcommand\palavraschave[1]{\\ \destaque{Palavras-chave} & #1}
% \begin{tabela}{colunas}: fio umbro acima, fio fio-forte sob cada linha (terminar toda linha com \\);
% a 1ª linha (cabeçalho) sai em Medium
\newcount\lina@linha \lina@linha=1
\newcommand\lina@cab{\ifnum\lina@linha=0 \bfseries\fi}
\newcommand\lina@tabnl{\global\advance\lina@linha by 1 \tabularnewline[\px{11.1}]\lina@fio{fio-forte}}
\newenvironment{tabela}[1]{\par\vskip-\parskip\begingroup\linatam{10.5}{16}%
  \setlength\extrarowheight{\px{9}}\setlength\tabcolsep{0pt}\def\arraybackslash{\let\\\lina@tabnl}%
  \tabularx{\linewidth}{@{}#1@{}}\lina@fio{umbro}\noalign{\global\lina@linha=0 }}%
  {\endtabularx\endgroup\par}

% título da tabela acima dela, em Medium 9 pt: \titulotabela{Título.} dá "Tabela n. Título."
\newcommand\titulotabela[1]{\par\vskip\dimexpr\px{22}-\parskip\relax
  {\captionsetup{font={lina,bf},aboveskip=0pt,belowskip=\px{8}}\noindent\parbox{\linewidth}{\captionof{table}{#1}}\par}\nobreak\vskip\px{8}}
% \registro{n}: n linhas vazias (31 px) em tabela de 4 colunas
\ExplSyntaxOn
\NewDocumentCommand\registro{m}{\prg_replicate:nn{#1}{\rule{0pt}{0pt}&&&\tabularnewline[\px{5}]\lina@fio{fio-forte}}}
\ExplSyntaxOff

% ---------- cabeçalho e rodapé ----------
\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\includegraphics[width=14mm]{logos/lina-horizontal-ferro.pdf}}
\fancyhead[R]{\raisebox{3pt}{\ttfamily\fontsize{9pt}{9pt}\selectfont\lina@cabecalho}}
\fancyfoot[L]{\ttfamily\fontsize{8.5pt}{10pt}\selectfont\color{umbro!70!white}\lina@siglarodape}
\fancyfoot[R]{\ttfamily\fontsize{8.5pt}{10pt}\selectfont\color{umbro!70!white}\thepage\lina@total}
\renewcommand\headrulewidth{0pt}
\renewcommand\headrule{\vskip\px{12}{\color{fio-forte}\hrule width\headwidth height\px{1}}}
\renewcommand\footrulewidth{0pt}
% 1ª página com cabeçalho próprio (\cabecalhoprimeira): estilo de página à parte, não depende da numeração
\fancypagestyle{lina@primeira}{\fancyhf{}%
  \fancyhead[L]{\includegraphics[width=14mm]{logos/lina-horizontal-ferro.pdf}}%
  \fancyhead[R]{\raisebox{3pt}{\ttfamily\fontsize{9pt}{9pt}\selectfont\lina@cabprimeira}}%
  \fancyfoot[L]{\ttfamily\fontsize{8.5pt}{10pt}\selectfont\color{umbro!70!white}\lina@siglarodape}%
  \fancyfoot[R]{\ttfamily\fontsize{8.5pt}{10pt}\selectfont\color{umbro!70!white}\thepage\lina@total}}
\AtBeginDocument{\ifx\lina@cabprimeira\@empty\else\thispagestyle{lina@primeira}\fi}

% ---------- páginas ----------
\newcommand\paginademo{\clearpage}   % quebra entre as páginas de demonstração
% capa do Relatório: margens de 72 px, sem cabeçalho nem rodapé, bloco do título empurrado ao pé
\newenvironment{capa}[1]{%
  \newgeometry{left=\px{76},right=\px{76},top=\px{72},bottom=\px{72}}\thispagestyle{empty}\noindent
  \begin{minipage}[t]{.5\linewidth}\vspace{0pt}\includegraphics[width=40mm]{logos/lina-horizontal-ferro.pdf}\end{minipage}%
  \begin{minipage}[t]{.5\linewidth}\vspace{0pt}\RaggedLeft\ttfamily\fontsize{9pt}{\px{19.2}}\selectfont #1\par\end{minipage}\par
  \vfill}{\restoregeometry
  \global\@colht\textheight\global\@colroom\textheight\global\vsize\@colht}  % geometry deixa o vsize da capa na página 2
% colofão no pé da página: \vfill antes, na mesma página
\newcommand\colofao[2]{\par\begingroup\linatam{9}{18.6}\setlength\tabcolsep{\px{16}}\setlength\extrarowheight{0pt}%
  \begin{tabularx}{\linewidth}{@{}l>{\RaggedRight\arraybackslash}X>{\RaggedRight\arraybackslash\ttfamily\fontsize{8.5pt}{\px{18.6}}\selectfont}X@{}}%
  \lina@fio{fio-forte}\noalign{\vskip\px{24}}%
  \raisebox{\dimexpr\px{13}-\height\relax}{\includegraphics[width=\px{110}]{logos/lina-horizontal-ferro.pdf}} & #1\rule[-\px{24}]{0pt}{0pt} &
  #2\newline\mbox{}\newline \lina@referencia\ · v. \lina@versao\ · \lina@data\rule[-\px{24}]{0pt}{0pt}\\
  \end{tabularx}\endgroup\par}

% ---------- referências (Artigo): duas colunas sob um fio fio-forte; \destaque no lugar do itálico ----------
\newenvironment{referencias}{\par\vskip\px{12}{\color{fio-forte}\hrule height\px{1}}\vskip\px{12}%
  \begin{multicols}{2}\linatam{9}{18}\setlength\leftskip{\px{16}}\setlength\parindent{-\px{16}}\setlength\parskip{\px{8}}\vskip-\parskip}%
  {\end{multicols}}

% ---------- pé do Artigo: correspondência, histórico e licença (\vfill antes, na mesma página) ----------
\newcommand\historico[3]{\par\begingroup\linatam{9}{18}\setlength\tabcolsep{\px{12}}%
  \begin{tabularx}{\linewidth}{@{}>{\RaggedRight\arraybackslash}X>{\RaggedRight\arraybackslash}X>{\RaggedRight\arraybackslash}X@{}}%
  \lina@fio{fio-forte}\noalign{\vskip\px{16}}%
  #1\rule[-\px{39.7}]{0pt}{0pt} & #2\rule[-\px{39.7}]{0pt}{0pt} & #3\rule[-\px{39.7}]{0pt}{0pt}\\
  \end{tabularx}\endgroup\par}

% ---------- POP ----------
% seções: \section (28 px acima, 8 abaixo) e variantes (nomes dos estilos do Word). \lina@sec{antes}{depois}{texto}, em px
\newcommand\lina@sec[3]{\lina@antes{#1}{\noindent\lina@f@secao\linatam{\lina@secpt}{\lina@seclh}\RaggedRight #3\par}\nobreak\vskip\dimexpr\px{#2}-\parskip\relax}
% seguida de passos, lista ou tabela: 12 px até a grade (28,4 − \parskip da tabela; \lina@listabegin tira os 6,4 px que a lista não precisa)
\newcommand\secaotabela[1]{\lina@sec{28}{28.4}{#1}}
\newcommand\secaoafastada[1]{\lina@sec{36}{8}{#1}}             % mais abaixo na página (36 px)
\newcommand\secaoafastadatabela[1]{\lina@sec{36}{28.4}{#1}}
\newcommand\secaofio[1]{\par\vskip\px{34}{\color{fio-forte}\hrule height\px{1}}\vskip\px{16}\lina@sec{0}{8}{#1}}   % fio fio-forte acima (Objetivo)
\newcommand\continuacao[1]{{\normalfont\color{umbro!70!white}#1}}   % Light a 70 % dentro do título da seção
% texto curto antes de tabela (14 px, justificado) com 12 px até a grade
\newcommand\chamadatabela[1]{\lina@antes{8}{\linatam{10.5}{21.7}#1\par}\vskip\px{12.7}}
% passos (01, 02…, a contagem continua entre os ambientes) e critérios (□): \item sem argumento
\newcount\lina@np \newcounter{lina@passo}
\newcommand\lina@listabegin[2]{\par\vskip-\px{6.4}\begingroup\setlength\parskip{0pt}\setlength\leftskip{\px{#2}}\linatam{11.5}{22.5}%
  \lina@np=0 \def\item{\par\ifnum\lina@np>0 \vskip\px{#1}\fi\global\advance\lina@np by 1 \lina@step
    \noindent\llap{\hbox to\px{#2}{\lina@rot\hfil}}\ignorespaces}}
\newenvironment{passos}{\def\lina@step{\stepcounter{lina@passo}}%
  \def\lina@rot{{\ttfamily\bfseries\fontsize{10.5pt}{10.5pt}\selectfont\color{ferro}\two@digits{\value{lina@passo}}}}\lina@listabegin{14}{40}}{\par\endgroup}
\newenvironment{criterios}{\def\lina@step{}\def\lina@rot{{\ttfamily\fontsize{11.5pt}{11.5pt}\selectfont □}}\lina@listabegin{8}{24}}{\par\endgroup}
% caixa Atenção: nata, cantos de 11 px, texto em Outfit Regular; 28 px acima
\newsavebox\lina@bx
\newenvironment{atencao}{\par\vskip\px{28}\begin{lrbox}{\lina@bx}\begin{minipage}{\dimexpr\linewidth-\px{40}\relax}%
  \setlength\parskip{0pt}\lina@f@regular\linatam{11.5}{22.5}}{\end{minipage}\end{lrbox}%
  \noindent\begin{tikzpicture}\node[fill=nata,rounded corners=\px{11},inner xsep=\px{20},inner ysep=\px{16},anchor=south west] at (0,0) {\usebox\lina@bx};\end{tikzpicture}\par}
\newcommand\rotuloatencao[1]{{\lina@f@bold\color{ferro}#1}}
% nota sob a tabela, 9 pt a 75 %
\newcommand\nota[1]{\lina@antes{8}{\noindent\linatam{9}{\lina@autlh}\RaggedRight\color{umbro!75!white}#1\par}}
% pé do POP: três assinaturas (linha umbro de 44 px acima do rótulo); \vfill antes
\newcommand\assinaturas[3]{\par\begingroup\linatam{9}{\lina@autlh}\setlength\tabcolsep{\px{12}}%
  \begin{tabularx}{\linewidth}{@{}>{\RaggedRight\arraybackslash}X>{\RaggedRight\arraybackslash}X>{\RaggedRight\arraybackslash}X@{}}%
  \lina@asn{#1}&\lina@asn{#2}&\lina@asn{#3}\\\end{tabularx}\endgroup\par}
\newcommand\lina@asn[1]{\rule{0pt}{\px{44}}\par\hrule height\px{1}\vskip\px{8}\rotulometa{#1}\newline Nome · data\rule[-\px{29.7}]{0pt}{0pt}}
