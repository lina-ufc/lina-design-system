# 02 · Modelos Word: Relatório, Artigo e POP em `.dotx` e `.docx`

> **Para agentes:** usar `superpowers:executing-plans` (ou `subagent-driven-development`). Passos em checkbox. Atualizar `progress.md` ao fim de cada tarefa verificada.

**Goal:** Um gerador Node produz, para cada modelo (Relatório, Artigo, POP), um `.dotx` e um `.docx` com as mesmas três páginas do deck HTML, montados só com estilos nomeados `LINA *`, e um `check_word.py` prova isso.

**Architecture:** `templates/documento-a4/word/build.js` usa a biblioteca `docx` (npm). Uma função base define página A4, fontes, idioma, hifenização e os estilos comuns; cada modelo sobrepõe tamanhos (título, seção, rótulo) e monta seu conteúdo. Depois da geração, o mesmo script abre o pacote com `jszip` (dependência do `docx`), injeta os estilos de tabela no `styles.xml` e grava a cópia `.dotx` trocando o content type. Saída em `word/out/`, fora do git; cópia para `templates/documento-a4/` e zip ficam no plano 04.

**Tech Stack:** Node, `docx` 9.x, `sharp` (logo e marcador de figura em PNG), Python 3 stdlib para a checagem, LibreOffice + `pdftoppm` para olhar.

**Spec:** `docs/superpowers/specs/2026-11-22-templates-documentos-design.md` (mapa de estilos no fim).

## O que o 01 ensinou

- O HTML é a referência fechada: três decks de 3 páginas (`DocumentoA4-Relatorio.dc.html`, `-Artigo`, `-POP`; divididos depois do 01 para o site mostrar os três lado a lado), texto corrido marcado com `.tc`. Ler as medidas deles, não do cartão antigo.
- A página "meio" do Relatório também corre em **duas colunas** (o mapa da spec não dizia). Artigo usa duas colunas no corpo e nas referências, com figura e tabela de largura total entre elas.
- Os números de página do HTML são ilustrativos (2, 24; 1, 9, 18). No Word a numeração é a real (Relatório 2 e 3 depois da capa; Artigo 1, 2, 3). O POP já mostra `1 / 3`, igual ao real.
- Checagem em Python stdlib com uma linha `ok:` no fim funcionou bem; repetir o formato.

## Global Constraints

- Português em textos e comentários (CLAUDE.md §0).
- **Conversão de medidas, uma regra só:** 1 px do HTML = 15 twips = 0,75 pt = 0,2646 mm. Tamanho de fonte em meio-ponto = px × 1,5, arredondado para cima (15 px = 11,5 pt; 13 px = 10 pt; 11 px = 8,5 pt). Entrelinha exata = px × line-height × 0,75 pt. Uma função `px()` no `build.js`; nada de número mágico solto.
- **Pesos da Outfit viram famílias** (nomes confirmados no `fc-list` desta máquina): 300 `Outfit Light`, 400 `Outfit`, 500 `Outfit Medium`, 700 `Outfit` + negrito, 800 `Outfit ExtraBold`. Mono: `JetBrains Mono` (400) e negrito (700). Outfit não tem itálico: `<i>` das referências vira `LINA Destaque`.
- **Opacidade vira cor:** `opacity:.7` e `.75` sobre branco viram a mistura do umbro (`#2A1A12`) com branco (≈ `#6A5F59` e `#5F534D`); calcular por função, não à mão.
- Cores só da paleta (`tokens/colors.css`): ferro `#A81F0D`, ferro-fundo `#6E1408`, umbro `#2A1A12`, nata `#FDF1CF`, fio-forte `#C9B87A`.
- Corpo do documento sem formatação direta: parágrafo só com `pStyle`, run só com `rStyle`. Exceções contadas pelo `check_word.py`: `sectPr` (colunas, margens), quebra de página entre as páginas de demonstração, imagem inline.
- Nenhuma caixa de texto (`w:txbxContent`). Elementos presos ao pé da página (colofão, histórico do artigo, assinaturas do POP) são **tabela flutuante ancorada na margem inferior**, nunca caixa de texto.
- Logo: arquivo de `assets/logos/` (o mesmo desenho do SVG inline do HTML, ferro com o "A" em ferro-fundo), embutido como SVG com PNG de reserva gerado pelo `sharp`; proporção preservada.
- `.dotx` e `.docx` saem do mesmo conteúdo (o texto do HTML já é instrução de uso). O `.docx` existe para quem abre no LibreOffice, Pages ou Google Docs; o `.dotx` para quem cria documento novo no Word.

## Medidas de página (do HTML)

| Item | HTML | Word |
|---|---|---|
| Página | 794 × 1123 px | A4, 11906 × 16838 twips |
| Margens laterais | 76 px | 1140 twips (20,1 mm) |
| Capa do Relatório, topo e pé | 72 px | 1080 twips (19 mm), seção sem cabeçalho e sem rodapé |
| Cabeçalho | começa a 64 px do topo; logo 54 px (14 mm); texto mono 12 px; fio fio-forte 1 px a 12 px abaixo | distância do cabeçalho 960 twips; estilo `LINA Cabeçalho` com borda inferior e tabulação à direita |
| Início do texto nas internas | ≈ 64 + 26 + 44 px ≈ 134 px | margem superior ≈ 2010 twips; ajustar olhando o render |
| Rodapé | linha mono 11 px a 40 px do pé, opacidade .7 | distância do rodapé 600 twips; `LINA Rodapé` com tabulação à direita |
| Margem inferior | 64 px | 960 twips |
| Duas colunas | 2 × 305 px, entrecoluna 32 px | seção contínua, 2 colunas, espaço 480 twips |

## Estilos a criar (complementa o mapa da spec)

Além do mapa da spec: `LINA Cabeçalho`, `LINA Rodapé`, `LINA Número` (mono 10 pt à direita, células numéricas), `LINA Lista` (critérios de aceitação, marcador ☐ em JetBrains Mono; conferir o glifo), `LINA Figura` (parágrafo da imagem marcadora, centrado). Tamanhos por modelo:

| Estilo | Relatório | Artigo | POP |
|---|---|---|---|
| `LINA Rótulo` | 12 pt Medium ferro, caixa alta, espaçamento .08em, fio ferro 1,5 pt acima e 21 pt de respiro | 10 pt, sem fio | 10 pt, sem fio |
| `LINA Título` | 42 pt ExtraBold, entrelinha 1,02 | 24 pt Bold, 1,12 | 24 pt Bold, 1,12 |
| `LINA Seção` | 19,5 pt Bold | 11,5 pt Bold | 13,5 pt Bold |
| `LINA Corpo` | 11,5 pt Light, exata 17,4 pt, justificado, 7,5 pt depois | igual | igual |

Estilos de tabela (`LINA Tabela`, `LINA Passos`, `LINA Atenção`, `LINA Metadados`) não têm API no `docx`: o `build.js` insere os `<w:style w:type="table">` no `word/styles.xml` depois de gerar, e as tabelas só referenciam o estilo. `LINA Atenção` tem cantos retos (Word não arredonda célula): diferença conhecida, anotar no handoff.

## Review Focus

1. **Digitar não quebra o modelo.** Teste: `check_word.py` falha se algum parágrafo do corpo tiver propriedade além de `pStyle` ou algum run além de `rStyle` (fora das exceções listadas), ou se existir `w:txbxContent`.
2. **Hifenização e idioma.** Teste: `settings.xml` com `w:autoHyphenation`; `LINA Corpo` com `w:jc w:val="both"` e `w:lang w:val="pt-BR"`. Olhar no render a página do Artigo em duas colunas: sem buracos grandes.
3. **Tabela flutuante no pé da página.** Colofão, histórico e assinaturas ficam no pé no LibreOffice. Teste: render da página 3 de cada modelo; tabela com `w:tblpPr` ancorada na margem.
4. **Logo e figura sem distorção.** Teste: `check_word.py` compara `wp:extent` com a proporção do PNG (mesma regra do `aspect.py`, tolerância 1 %) e imprime `distorcidas: 0`.
5. **`.dotx` é template de verdade.** Teste: `[Content_Types].xml` do `.dotx` com `wordprocessingml.template.main+xml`; `validate.py` passa nos seis arquivos.
6. **Fontes embutidas.** Teste: `word/fonts/` com Outfit e JetBrains Mono no pacote, se a API do `docx` permitir (ver Task 1, Step 1). Se não permitir, anotar e seguir: a seção Uso do site manda instalar as fontes.

---

### Task 1: Base e Relatório

**Files:**
- Create: `templates/documento-a4/word/package.json`, `package-lock.json`, `build.js`
- Create: `templates/documento-a4/check_word.py`
- Modify: `.gitignore` (linha `templates/documento-a4/word/out/`)

**Interfaces:**
- Produces: `node build.js` grava `word/out/LINA-Relatorio.dotx` e `LINA-Relatorio-exemplo.docx` (Tasks 2 e 3 acrescentam Artigo e POP); `python3 templates/documento-a4/check_word.py` confere todos os arquivos de `word/out/` e imprime `ok: …` e `distorcidas: 0`.

- [ ] **Step 1: Conferir a API.** `npm i docx@9 sharp` na pasta `word/`. Em `node_modules/docx/build/index.d.ts` (ou equivalente), confirmar: fontes embutidas (`fonts` no `Document`), hifenização (`hyphenation`/`autoHyphenation`), imagem SVG com `fallback`, tabela flutuante (`float`), `PageNumber.TOTAL_PAGES`, `language` em estilo. O que faltar entra pelo mesmo passo de pós-processamento com `jszip`. Anotar o resultado no `progress.md` (uma linha).
- [ ] **Step 2: Escrever `check_word.py`** (stdlib, `zipfile` + `re`), sobre cada `.docx`/`.dotx` de `word/out/`: estilos `LINA Corpo`, `LINA Título`, `LINA Seção`, `LINA Cabeçalho`, `LINA Rodapé` presentes; `LINA Corpo` justificado e pt-BR; `w:autoHyphenation` no `settings.xml`; página A4; sem `w:txbxContent`; parágrafos e runs do `document.xml` só com `pStyle`/`rStyle` (exceções do Global Constraints); `.dotx` com content type de template e `.docx` sem; imagens sem distorção (`distorcidas: N`); fontes em `word/fonts/` (aviso, não erro, se o Step 1 disse que não dá).
- [ ] **Step 3: Rodar** `python3 templates/documento-a4/check_word.py` — Expected: FAIL (nada gerado).
- [ ] **Step 4: Base no `build.js`.** `px()`, `mix()`, A4 e margens, fontes, idioma, hifenização, estilos de parágrafo e caractere do mapa, estilos de tabela injetados, cabeçalho (logo 14 mm + referência mono à direita, fio inferior) e rodapé (sigla à esquerda, número à direita), gravação do `.docx` e do `.dotx`.
- [ ] **Step 5: Relatório.** Capa (seção própria, sem cabeçalho e rodapé: logo 40 mm e "LINA · UFC / Fortaleza, 2026" em `LINA Metadados` de 2 colunas; bloco do título empurrado para baixo por espaçamento antes do `LINA Rótulo`; três colunas de metadados com fio fio-forte acima). Meio (seção com cabeçalho; "1 · Apresentação" e dois parágrafos em 2 colunas; figura marcadora de largura total em PNG nata com cantos de 11 px e "[ figura ]"; legenda e fonte; "1.1 · Indicadores do ano" em `LINA Subseção`; tabela `LINA Tabela` com números em `LINA Número`). Finalização (quebra de página; "5 · Considerações finais" em 2 colunas; Equipe em `LINA Metadados` 3 × 2; colofão em tabela flutuante no pé com logo 110 px, endereço e contato mono). Textos copiados do HTML.
- [ ] **Step 6: Rodar** `node build.js` e o check — Expected: PASS. Converter (`soffice --headless --convert-to pdf --outdir word/out word/out/LINA-Relatorio-exemplo.docx`), `pdftoppm -r 80 -png`, olhar as 3 páginas ao lado de `DocumentoA4-Relatorio.dc.html#1` a `#3`: 3 páginas, mesmas quebras, mesmos elementos. `validate.py` nos dois arquivos.
- [ ] **Step 7: Commit** `Documento A4: gerador Word e Relatório` e marcar no `progress.md`.

### Task 2: Artigo

**Files:**
- Modify: `templates/documento-a4/word/build.js`, `templates/documento-a4/check_word.py` (se precisar de estilo novo na lista)

- [ ] **Step 1:** Estender o check: `LINA Resumo`, `LINA Legenda`, `LINA Fonte`, `LINA Referência` (recuo pendente) presentes nos arquivos do Artigo. Rodar — Expected: FAIL.
- [ ] **Step 2: Artigo no `build.js`.** Primeira página com cabeçalho próprio ("Cadernos LINA · v. 2 · n. 1 · 2026 · p. 1–18"); demais com "Sobrenome et al. · Título abreviado do artigo"; rodapé com DOI à esquerda e número à direita. Entrada: rótulo, título, autores com `LINA Destaque`, afiliação, Resumo e Palavras-chave em `LINA Metadados` de 2 colunas entre dois fios, Introdução em 2 colunas. Meio: Método em 2 colunas, figura de largura total, Resultados em 2 colunas, Tabela 1 de largura total (título acima). Finalização: Conclusão em 2 colunas, Agradecimentos, Referências em 2 colunas, Correspondência / Histórico / Licença em tabela flutuante no pé.
- [ ] **Step 3: Rodar** build e check — Expected: PASS. Render e comparar com `DocumentoA4-Artigo.dc.html#1` a `#3`, olhando em especial a justificação nas colunas estreitas.
- [ ] **Step 4: Commit** `Documento A4: Artigo em Word` e marcar no `progress.md`.

### Task 3: POP

**Files:**
- Modify: `templates/documento-a4/word/build.js`, `templates/documento-a4/check_word.py`

- [ ] **Step 1:** Estender o check: tabelas com estilo `LINA Passos` e `LINA Atenção` existem no POP; rodapé com campo `NUMPAGES`. Rodar — Expected: FAIL.
- [ ] **Step 2: POP no `build.js`.** Cabeçalho "POP-04 · v. 2.1 · vigência 03/2026" em todas as páginas; rodapé "LINA · POP-04" e "n / total". Entrada: rótulo, título, Responsável / Aplica-se a / Duração em `LINA Metadados`, Objetivo, Material, Procedimento (passos 01–04 em `LINA Passos`: número mono negrito ferro, texto justificado), caixa `LINA Atenção`. Meio: Procedimento (continuação) com passos 05–08, Tabela 1 de parâmetros com nota, Critérios de aceitação em `LINA Lista`. Finalização: Registro de execução (tabela com 5 linhas vazias de altura exata), Histórico de revisões, Documentos relacionados com códigos em `LINA Mono`, assinaturas em tabela flutuante no pé (linha umbro acima do rótulo).
- [ ] **Step 3: Rodar** build e check — Expected: PASS. Render e comparar com `DocumentoA4-POP.dc.html#1` a `#3`.
- [ ] **Step 4: Commit** `Documento A4: POP em Word` e marcar no `progress.md`.

### Task 4: Conferência e passagem para o 03

**Files:**
- Create: `docs/superpowers/plans/2026-11-22-templates-documentos/records/02-word-handoff.md`

- [ ] **Step 1:** Rodar build, `check_word.py` e `validate.py` nos seis arquivos. Abrir um `.docx` no LibreOffice (ou Word, se houver), digitar um parágrafo novo no corpo e um passo novo no POP: o estilo segue e nada se desloca.
- [ ] **Step 2:** Montar uma folha PNG por modelo com HTML e Word lado a lado (só para olhar; a folha oficial é do plano 04) e mostrar ao usuário. Ajustes visuais pedidos voltam às Tasks 1–3.
- [ ] **Step 3:** Escrever o handoff: diferenças conhecidas (cantos retos, quebras de linha, o que o LibreOffice faz diferente do Word), o que a API do `docx` não cobriu, medidas finais de margem e cabeçalho que o LaTeX deve repetir.
- [ ] **Step 4: Commit** `Documento A4: conferência do Word` e marcar o plano 02 como concluído no `progress.md`.
