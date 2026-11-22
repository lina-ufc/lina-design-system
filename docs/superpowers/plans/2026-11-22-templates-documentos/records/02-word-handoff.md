# 02 · Word — handoff para o 03 (LaTeX) e o 04 (conferência)

Data: 2026-11-22. Commits do plano 02: `786a546` (base e Relatório), `b230c54` (Artigo), `87d4d7f` (POP).

## Estado

- Gerador: `templates/documento-a4/word/build.js` (Node, `docx` 9.16, `sharp`, `fflate`). `node build.js` grava em `word/out/` seis arquivos: `LINA-{Relatorio,Artigo,POP}.dotx` e `-exemplo.docx` (mesmo conteúdo; o `.dotx` só troca o content type).
- Checagem: `python3 templates/documento-a4/check_word.py` (estilos obrigatórios por modelo, estilos usados existem, toda tabela com estilo, sem formatação direta nem caixa de texto, A4, hifenização, content type, distorção, fontes embutidas). Hoje: `ok: 6 arquivos`, `distorcidas: 0`. `validate.py` passa nos seis.
- Render pelo LibreOffice: 3 páginas por modelo, mesmas quebras e elementos do HTML (folhas HTML × Word conferidas e mostradas ao usuário).
- Modelo novo = objeto em `MODELOS` (tamanhos, cabeçalho, rodapé, seção do cabeçalho) + função de conteúdo.

## Medidas finais (o LaTeX deve repetir)

1 px do HTML = 15 twips = 0,75 pt. Valores no `build.js`:

| Item | Valor |
|---|---|
| Margens laterais | 76 px (20,1 mm) |
| Margem superior das internas | 134 px (35,5 mm); Artigo 106 px e POP 102 px, porque o "antes" do rótulo e da seção completa o respiro |
| Margem inferior | 64 px (16,9 mm) |
| Cabeçalho | a 64 px do topo; logo 54 px de largura (14 mm); referência mono 9 pt à direita; fio fio-forte 0,75 pt a 12 px abaixo |
| Rodapé | a 40 px do pé; mono 8,5 pt, cor umbro a 70 % sobre branco |
| Capa do Relatório | margens topo e pé 72 px (19 mm); logo 150 px (40 mm); fio ferro 2 px acima do rótulo, 28 px de respiro |
| Duas colunas | entrecoluna 32 px (8,5 mm) |
| Corpo | Outfit Light 11,5 pt, entrelinha exata 17,4 pt, justificado, 7,5 pt entre parágrafos |
| Referência | 9 pt, entrelinha 1,5, recuo pendente 16 px, 6 pt depois |

## Diferenças conhecidas (Word × HTML)

- **Cantos retos** na caixa "Atenção" e na figura marcadora não, ela é PNG com cantos de 11 px. Word não arredonda célula de tabela.
- **Hifenização:** ligada no `settings.xml` e com idioma pt-BR nos estilos, mas o LibreOffice desta máquina não tem dicionário pt-BR (só en, fr, es). No render as colunas estreitas ficam com espaços largos; no Word deve hifenizar. Conferir no Word (plano 04).
- **Fundo nata do "Atenção"** só aparece no LibreOffice via `tblStylePr firstRow` com `tblLook firstRow`; `wholeTable` não renderiza lá. Word não testado.
- **Borda de parágrafo com `sectPr`:** o LibreOffice descarta; por isso `LINA Fio` vem seguido de `LINA Quebra` (parágrafo mínimo). Word não testado.
- **Marcador dos critérios** do POP é □ (U+25A1): JetBrains Mono não tem ☐ (U+2610).
- **Mono parece mais pesado** no render do LibreOffice que no HTML (esta máquina tem também a JetBrains Mono variável instalada). Conferir no Word.
- **Números de página** reais (Relatório 2 e 3; Artigo 1, 2, 3); o HTML mostra números ilustrativos (24; 9, 18).
- **Logo:** o asset `assets/logos/sand/lina-horizontal-ferro.svg` tem o "A" em umbro; o `build.js` recolore o "A" para ferro-fundo, como no HTML. Decisão a confirmar com o usuário.
- **Mono no texto do POP** usa `LINA Mono Texto` (10 pt), não `LINA Mono` (11,5 pt) como dizia o plano: o HTML usa 13 px. O cabeçalho usa `LINA Mono` e herda 12 px de `LINA Cabeçalho`.
- **`tblLook` explícito:** `LINA Metadados Fios` (respiro no fim, lastRow) e `LINA Atenção` (fundo, firstRow) dependem dele. Tabela nova criada no Word pelo estilo usa o `tblLook` padrão 04A0, sem lastRow, e perde o respiro de 20 px no fim.
- **Pequenas diferenças de espaçamento no POP:** espaço antes de seção fixo em 32 px (HTML varia de 28 a 36); registro de execução em 10,5 pt (HTML 13 px); metadados com 18 px antes (HTML 22).

## Não verificado

- Abrir e digitar no Microsoft Word (não há Word nesta máquina). O teste de que digitar não quebra o modelo ficou coberto pela checagem estrutural (só estilos, sem caixa de texto nem formatação direta); o teste manual vai para o plano 04.
- Fonte do texto "[ figura ]" no PNG da figura depende de a JetBrains Mono estar instalada na máquina do build.

## Para o 03 (LaTeX)

- Usar a tabela de medidas acima e o mapa de estilos da spec; os nomes extras criados no Word: `LINA Cabeçalho`, `LINA Rodapé`, `LINA Número`, `LINA Lista`, `LINA Figura`, `LINA Mono Texto` (mono 10 pt no texto), `LINA Metadados Fio`/`Fios` (grade com fio acima / entre dois fios), `LINA Fio`, `LINA Quebra`.
- Figura marcadora: o PNG pode ser gerado pelo mesmo `build.js` ou desenhado com `tcolorbox`/TikZ; manter cantos de 11 px e fundo nata.
