% lina.cls — Documento A4 do LINA Design System (Relatório, Artigo, POP).
% Opções: relatorio | artigo | pop. Fontes por arquivo (pasta fontes/), logo em logos/.
% Compila com XeLaTeX (latexmk -xelatex), aqui e no Overleaf.
\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{lina}[2026/11/22 LINA Documento A4]

% ---------- medidas: 1 px do HTML = 0,75 pt ----------
\newcommand\px[1]{\dimexpr #1pt*3/4\relax}

% ---------- modelos: tamanhos iguais aos de MODELOS em word/build.js ----------
% Fontes em pt (como no Word), entrelinhas em px do HTML, "antes"/"depois" em px.
\newcommand\lina@fontetitulo{Outfit-Bold}
\newcommand\lina@fio@rotulo{}   % relatorio: fio ferro de 2 px, 28 px de respiro, acima do rótulo
\DeclareOption{relatorio}{%
  \def\lina@top{134}%
  \def\lina@rotpt{12}\def\lina@rotantes{0}%
  \def\lina@fontetitulo{Outfit-ExtraBold}\def\lina@titpt{42}\def\lina@titlh{57.12}\def\lina@titls{-2}\def\lina@titantes{14}%
  \def\lina@secpt{19.5}\def\lina@seclh{29.9}\def\lina@secls{-1}\def\lina@secantes{0}\def\lina@secdepois{18}%
  \def\lina@fio@rotulo{{\color{ferro}\hrule height\px{2}}\vskip\px{28}}%
  \def\lina@cabecalho{\lina@referencia\ · \lina@titulocurto}}
\DeclareOption{artigo}{%
  \def\lina@top{106}%
  \def\lina@rotpt{10}\def\lina@rotantes{36}%
  \def\lina@titpt{24}\def\lina@titlh{35.84}\def\lina@titls{-1.2}\def\lina@titantes{10}%
  \def\lina@secpt{11.5}\def\lina@seclh{23.25}\def\lina@secls{0}\def\lina@secantes{28}\def\lina@secdepois{8}%
  \def\lina@cabecalho{\lina@titulocurto}}
\DeclareOption{pop}{%
  \def\lina@top{102}%
  \def\lina@rotpt{10}\def\lina@rotantes{38}%
  \def\lina@titpt{24}\def\lina@titlh{35.84}\def\lina@titls{-1.2}\def\lina@titantes{10}%
  \def\lina@secpt{13.5}\def\lina@seclh{21.6}\def\lina@secls{0}\def\lina@secantes{32}\def\lina@secdepois{8}%
  \def\lina@cabecalho{\lina@titulocurto}}
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

% tamanho em pt, entrelinha em px
\newcommand\linatam[2]{\fontsize{#1pt}{\px{#2}}\selectfont}

% ---------- corpo ----------
\setlength\parindent{0pt}
\setlength\parskip{\px{10}}
\raggedbottom
\emergencystretch=3em
\renewcommand\normalsize{\normalfont\linatam{11.5}{23.25}}
\AtBeginDocument{\normalsize\color{umbro}}
\setcounter{secnumdepth}{0}   % o número vai no texto do título: \section{1 · Apresentação}

% ---------- metadados (mesmos nomes do Word) ----------
\def\lina@referencia{}\def\lina@versao{}\def\lina@data{}\def\lina@titulocurto{}\def\lina@siglarodape{LINA · UFC}
\newcommand\referencia[1]{\def\lina@referencia{#1}}
\newcommand\versao[1]{\def\lina@versao{#1}}
\newcommand\data[1]{\def\lina@data{#1}}
\newcommand\titulocurto[1]{\def\lina@titulocurto{#1}}
\newcommand\siglarodape[1]{\def\lina@siglarodape{#1}}
\newcommand\mostrar[1]{\csname lina@#1\endcsname}

% ---------- estilos de caractere ----------
\newcommand\destaque[1]{\textbf{#1}}
\newcommand\mono[1]{{\ttfamily #1}}
\newcommand\fonte[1]{{\ttfamily\fontsize{8.5pt}{\f@baselineskip}\selectfont\color{umbro!75!white}#1}}
\newcommand\rotulometa[1]{{\color{umbro!70!white}#1}}
\newcommand\numero[1]{{\ttfamily\fontsize{10pt}{\f@baselineskip}\selectfont #1}}

% ---------- título, rótulo, subtítulo ----------
\newcommand\rotulo[1]{\par\vskip\px{\lina@rotantes}\lina@fio@rotulo
  {\noindent\lina@f@rotulo\linatam{\lina@rotpt}{20}\color{ferro}\RaggedRight\MakeUppercase{#1}\par}}
\newcommand\titulo[1]{\par\vskip\px{\lina@titantes}%
  {\noindent\lina@f@titulo\linatam{\lina@titpt}{\lina@titlh}\RaggedRight\rightskip=0pt plus 1fil\hyphenpenalty=10000 #1\par}}
\newcommand\subtitulo[1]{\par\vskip\px{22}%
  {\noindent\begin{minipage}{\px{497}}\linatam{13.5}{23}\RaggedRight #1\par\end{minipage}\par}\vskip\px{64}}

% ---------- seções ----------
\newlength\lina@sa \newlength\lina@sd \newlength\lina@ssa \newlength\lina@ssd
\setlength\lina@sa{\px{\lina@secantes}}\setlength\lina@sd{\px{\lina@secdepois}}
\setlength\lina@ssa{\px{36}}\setlength\lina@ssd{\px{12}}
\titleformat{\section}{\lina@f@secao\linatam{\lina@secpt}{\lina@seclh}\RaggedRight}{}{0pt}{}
\titlespacing*{\section}{0pt}{\lina@sa}{\lina@sd}
\titleformat{\subsection}{\lina@f@bold\linatam{13.5}{22.5}\RaggedRight}{}{0pt}{}
\titlespacing*{\subsection}{0pt}{\lina@ssa}{\lina@ssd}

% ---------- duas colunas ----------
\setlength\columnsep{\px{32}}
\setlength\multicolsep{0pt}

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
\newcolumntype{Y}{>{\RaggedRight\arraybackslash}X}
\newcolumntype{R}{>{\RaggedLeft\arraybackslash\ttfamily\fontsize{9pt}{\px{18}}\selectfont}X}
\newcolumntype{N}{>{\RaggedLeft\arraybackslash}p{\px{90}}}
% \begin{metadados}[respiro em px]{colunas}: fio fio-forte acima; linhas separadas por 14 px.
% Dentro da célula, quebra de linha é \newline; \\ termina a linha da tabela (a última fica sem \\).
\newenvironment{metadados}[2][12]{\par\vskip-\parskip\begingroup\linatam{10}{19.5}%
  \setlength\tabcolsep{\px{12}}\def\arraybackslash{\let\\\lina@metanl}%
  \tabularx{\linewidth}{@{}#2@{}}\lina@fio{fio-forte}\noalign{\vskip\px{#1}}}%
  {\endtabularx\endgroup\par}
\newcommand\lina@metanl{\tabularnewline[\px{14}]}
\newcommand\lina@tabnl{\tabularnewline[\px{9}]\lina@fio{fio-forte}}
% \begin{tabela}{colunas}: fio umbro acima, fio fio-forte sob cada linha (terminar toda linha com \\)
\newenvironment{tabela}[1]{\par\vskip-\parskip\begingroup\linatam{10.5}{16}%
  \setlength\extrarowheight{\px{9}}\setlength\tabcolsep{0pt}\def\arraybackslash{\let\\\lina@tabnl}%
  \tabularx{\linewidth}{@{}#1@{}}\lina@fio{umbro}}%
  {\endtabularx\endgroup\par}

% ---------- cabeçalho e rodapé ----------
\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\includegraphics[width=14mm]{logos/lina-horizontal-ferro.pdf}}
\fancyhead[R]{\raisebox{3pt}{\ttfamily\fontsize{9pt}{9pt}\selectfont\lina@cabecalho}}
\fancyfoot[L]{\ttfamily\fontsize{8.5pt}{10pt}\selectfont\color{umbro!70!white}\lina@siglarodape}
\fancyfoot[R]{\ttfamily\fontsize{8.5pt}{10pt}\selectfont\color{umbro!70!white}\thepage}
\renewcommand\headrulewidth{0pt}
\renewcommand\headrule{\vskip\px{12}{\color{fio-forte}\hrule width\headwidth height\px{1}}}
\renewcommand\footrulewidth{0pt}

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

% ---------- referências (Artigo) ----------
\newenvironment{referencias}{\par\linatam{9}{18}\setlength\leftskip{\px{16}}\setlength\parindent{-\px{16}}%
  \setlength\parskip{\px{8}}\RaggedRight}{\par}
