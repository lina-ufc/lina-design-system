# 11 — Conteúdo novo

Todo conteúdo novo é proposta: a entrada no `sistema.json` termina em ` (proposta)` e o fragmento traz o aviso
`Proposta, aguarda decisão.` depois da regra. Valor sem decisão do dono vai marcado `proposta:` no texto.

## Logotipo

Duas seções novas em `logotipo`, depois de "Combinações de cores": `s-area-de-protecao` (`12-area-de-protecao.html`)
e `s-tamanho-minimo` (`13-tamanho-minimo.html`). Sem figura nem foto; "Faça e não faça" em texto.

| Valor | Origem |
| --- | --- |
| ½ célula entre arte e borda, versões com fundo ou placa; exceções símbolo vazado e selo | decisão de 2026-11-22 (`memoria/margem-meia-celula.md`); texto cita, sem número novo |
| Célula como medida; horizontal e símbolo com 3 células de altura | "Três medidas" e viewBox dos SVG (`17.5 × 6` e `4 × 6` unidades de ½ célula); link para a seção |
| 1 célula livre ao redor do logo sem fundo | proposta nova (o dobro da margem da placa) |
| Tela: célula de 8 px (¼ = 2 px); horizontal 70 × 24, vertical 42 × 50, símbolo 16 × 24 px | proposta nova; dimensões = viewBox (`17.5 × 6`, `10.5 × 12.5`, `4 × 6`) × 4 px |
| Impresso: célula de 2 mm (¼ = 0,5 mm); horizontal 17,5 × 6, vertical 10,5 × 12,5, símbolo 4 × 6 mm | proposta nova; mesmas dimensões × 1 mm |

Justificativa do mínimo: o ¼ de célula é a menor medida do desenho (raio e folga entre letras), "Três medidas".

## Grid e espaço

Capítulo `grid-e-espaco` ganhou `"molde": true` e três seções: `s-celula` (`1-celula.html`), `s-margens`
(`2-margens.html`) e `s-espacamento` (`3-espacamento.html`). Sem figura nem foto; Espaçamento traz "Faça e não faça" em texto.

| Valor | Origem |
| --- | --- |
| Célula: site 44 px (meia 22, quarto 11) | `tokens/spacing.css` (`--cell`, `--cell-half`, `--cell-quarter`); citado |
| Célula: apresentação, trama de 12 px a 1324 px de largura | `templates/apresentacao/README.md`, seção Trama; citado |
| Célula: A4 | nenhum valor documentado no template (`lina.cls` e `word/build.js` medem em px, sem célula); marcado `proposta:` sem número |
| Margem arte e borda: ½ célula | decisão de 2026-11-22 (`memoria/margem-meia-celula.md`); link para `logotipo.html#s-area-de-protecao` |
| Margem de página: apresentação 72 px (laterais e topo, referência 1920 × 1080) | README da apresentação, tabela Grade; citado |
| Margem de página: A4 76 px laterais, 64 px embaixo, topo 134 a 141 px (72 px na capa) | `templates/documento-a4/latex/lina.cls` (`geometry`, `\lina@top`) e `word/build.js` (`MX`, `PG`, capa); citado |
| Margem de página: site `--gutter-page`, 20 a 66 px | `tokens/spacing.css`; citado |
| Margens em células | `proposta:` sem número; depende da célula do A4 |
| `--space-1` a `--space-16` (3 a 42 px) e a regra dos dois sistemas | `tokens/spacing.css` (valores e comentário); sem valor novo. Tabela em `dl.spec`, sem link para `lina.tokens.json` (que só tem cores) |

## Imagem

Capítulo `imagem` ganhou `"molde": true` e a seção `s-fotografia` (`2-fotografia.html`), antes do "Filtro de pontilhado"
(que segue `livre`). Sem foto: "Faça e não faça" em texto. Fotos de exemplo esperam a curadoria do dono
(memória `fotos-referencia-cores`); nenhuma imagem foi buscada.

| Valor | Origem |
| --- | --- |
| Assunto: pessoas e lugares do laboratório | proposta nova; liga ao texto de "Das relações, o grupo" |
| Luz natural | proposta nova |
| Sem filtro de cor; tratamento gráfico é o filtro de pontilhado | proposta nova; links para `cores.html#s-paleta-principal` e `imagem.html#s-filtro-de-pontilhado` |

## Voz e texto

Capítulo novo `voz-e-texto` (parte II, entre Tipografia e Grid, número 5; Grid passou a 6), com `"molde": true` e quatro
seções: `s-tom` (`1-tom.html`), `s-tratamento` (`2-tratamento.html`), `s-numeros-e-datas` (`3-numeros-e-datas.html`) e
`s-nomes-e-siglas` (`4-nomes-e-siglas.html`). Cada uma com `Faça e não faça` e `Como pedir` só com `Agente` (não há peça
de slide, Word ou LaTeX para texto). Pontuação, caixa e escolha de fonte para número ficam em Tipografia, `Detalhes`, com link.

| Valor | Origem |
| --- | --- |
| Tom direto, sem exclamação, "você", frases curtas | tom que o próprio site já usa; regra posta por escrito. Sem número novo |
| Pontuação de título, rótulo e botão; vírgula decimal | `tipografia.html#s-detalhes`; citado |
| "O LINA" em terceira pessoa, no masculino | uso da página inicial e do restante do site; o resto da regra (sem "nós") é proposta |
| Voz impessoal em documento formal; termo neutro em vez de flexão dupla | proposta nova |
| Ponto de milhar a partir de 5 algarismos; datas "22 de novembro de 2026" em texto e "22/11/2026" em dado; ano-mês-dia em nome de arquivo; espaço antes da unidade | proposta nova (`<b>proposta:</b>` no texto) |
| Nome oficial: Laboratório de Modelagem da Informação: Arte · Arquitetura · Ambiente | `README.md` (linha de abertura); `SKILL.md` escreve o mesmo nome com travessão em vez de dois-pontos |
| Nome por extenso na primeira menção; sigla comum dispensa; plural da sigla sem "s" | proposta nova |

### Renumeração (Passo 3)

Com o capítulo novo, Tipografia ficou em 4, Voz e texto em 5, Grid em 6, Padrões em 7, Imagem em 8, Ícones em 9,
Componentes em 10 e Templates em 11. Conferido com o grep do passo 3 e checagem do `*.html` gerado: nenhuma referência
de seção ficou com número velho (`stale 0`). Número escrito à mão dentro de `<a href="…#s-…">` (ex.: `5.5`, `8.1`, `9.5` em
Tipografia, Componentes e Templates) é reescrito pelo `sistema.py`. As demais ocorrências do grep não são seções do site:
nomes de layout de slide ("5.3 Números-chave", "1.1"), `doi`, números dentro de código SVG. `SKILL.md`, `README.md`: nenhuma
ocorrência. `llms.txt` é regenerado. Corrigido à mão, por apontar para o número antigo de Templates (10 para 11):
`memoria/README.md`, `memoria/padrao-explicacao-download.md`, `memoria/templates-downloads.md` e os comentários de
`capitulos/templates/_gerar.py` (linhas 1 e 87).

## Acessibilidade

Seção nova `s-acessibilidade` (`capitulos/principios/3-acessibilidade.html`), no capítulo Princípios, depois de "Das relações, o grupo". Sem molde, no formato de `1-principios.html`: `h2`, `p.cap` de proposta e `ul.regras`, cada regra com link para onde o valor mora.

| Valor | Origem |
| --- | --- |
| Contraste 4,5 para texto e 3 para título grande | `cores.html#s-estudo-de-contraste` (legenda do estudo); citado com link |
| Pares de texto permitidos e proibidos | `cores.html#s-contrastes-a-usar` e `#s-contrastes-a-evitar`; citado |
| Cor nunca é o único sinal | proposta nova (`<b>proposta:</b>`), apoiada em "Contrastes a evitar" (mesmo valor, matizes opostos) |
| Letra de texto de pelo menos 11 px | proposta nova (`<b>proposta:</b>`): Tipografia, Hierarquia, não fixa mínimo; 11 px é a etiqueta, o menor tamanho usado |
| Texto alternativo em imagem; ícone decorativo oculto, ícone sozinho com nome | proposta nova (`<b>proposta:</b>`): o site já faz assim (`alt` nas imagens de Componentes, `aria-hidden` nos SVG de Phosphor), mas a regra é posta por escrito |
| Logo não desce do tamanho mínimo | `logotipo.html#s-tamanho-minimo` (Tarefa 1); citado |
| Foco visível, contorno ferro de 2 px | proposta nova (`<b>proposta:</b>`); valor lido em `site.css` (`:focus-visible`), não documentado no sistema |
| Alvo de 44 px no site | proposta nova (`<b>proposta:</b>`); coincide com `--cell: 44px` em `tokens/spacing.css`, link para `grid-e-espaco.html#s-celula` |

## Perguntas

- Logotipo, Área de proteção: a área livre do logo sem fundo é 1 célula em cada lado? A memória `margem-meia-celula` diz que versões sem fundo "não têm margem"; o texto trata a área livre como espaço fora do logo, não como margem. (proposta)
- Logotipo, Tamanho mínimo, tela: célula mínima de 8 px (horizontal 70 × 24 px, símbolo 16 × 24 px)? (proposta)
- Logotipo, Tamanho mínimo, impresso: célula mínima de 2 mm (horizontal 17,5 × 6 mm, símbolo 4 × 6 mm)? (proposta)
- Logotipo, Tamanho mínimo: vale também para vazados, selo e assinaturas, e vale para a arte dentro da placa e para o logo sem fundo? O texto cobre só horizontal, vertical e símbolo. (proposta)
- Grid e espaço, Célula: qual a célula do documento A4? O template mede em px (1 px = 0,75 pt) e não define célula. (proposta)
- Grid e espaço, Margens: escrever as margens de página (72 px na apresentação; 76, 64 e 134 a 141 px no A4) em células ou meias células? Na mesma escala, hoje não são múltiplos de nenhuma célula (72 = 6 × 12, mas a trama é de 1324 px e a margem de 1920). (proposta)
- Grid e espaço, Célula: a trama de 12 px da apresentação conta como a célula da apresentação, ou a apresentação só tem colunas e linhas? O texto trata a trama como a única célula e deixa o alinhamento dos slides fora. (proposta)
- Imagem, Fotografia: o assunto é só pessoas e lugares do laboratório, ou entram também objetos, eventos e a cidade? (proposta)
- Imagem, Fotografia: luz natural é regra para toda foto, ou há exceção (palco, evento, ambiente fechado)? (proposta)
- Imagem, Fotografia: "filtro de cor que brigue com a paleta" proíbe também correção de cor e conversão para preto e branco? O texto não diz; o critério é brigar ou não com a paleta. (proposta)
- Imagem, Fotografia: quais fotos servem de exemplo? Espera a curadoria do dono; a seção não traz imagem.
- Voz e texto, Tratamento: documento formal (relatório, ofício, artigo) usa voz impessoal, sem "você"? Hoje o template A4 não fixa isso. (proposta)
- Voz e texto, Tratamento: preferir termo neutro ("a equipe", "quem lê") à flexão dupla ("pesquisador/a")? (proposta)
- Voz e texto, Tratamento: o laboratório nunca fala em "nós" em peça institucional, ou só no site e nos documentos? (proposta)
- Voz e texto, Números e datas: data em texto por extenso ("22 de novembro de 2026") e em dado como "22/11/2026"; nome de arquivo e registro em ano-mês-dia. Serve? (proposta)
- Voz e texto, Números e datas: ponto de milhar só a partir de cinco algarismos ("1250", "12.500")? (proposta)
- Voz e texto, Números e datas: espaço antes da unidade e do "%" ("44 px", "50 %")? O site hoje escreve "20%" em alguns lugares, e Tipografia, Detalhes, escreve "11px" e "0,12em" sem espaço: a regra proposta diverge dele. (proposta)
- Voz e texto, Nomes e siglas: o nome oficial leva dois-pontos (README) ou travessão (SKILL.md)? O texto usa dois-pontos. (proposta)
- Voz e texto, Nomes e siglas: nome por extenso na primeira menção em todo texto, ou só em documento que chega a quem não conhece o LINA? (proposta)
- Voz e texto, Nomes e siglas: siglas de uso geral (PDF, IFC, A4) dispensam o nome por extenso, e o plural da sigla não leva "s"? (proposta)
- Acessibilidade: letra de texto não desce de 11 px? Tipografia não fixa mínimo; 11 px é a etiqueta em caixa alta. (proposta)
- Acessibilidade: foco visível é contorno ferro de 2 px em todo elemento interativo, o que o `site.css` já faz em links e campos? Vale também para peças fora do site? (proposta)
- Acessibilidade: alvo de clique e toque de 44 px no site, igual à célula? Vale para botões pequenos de ferramentas e para links em linha de texto? (proposta)
- Acessibilidade: alt informativo em toda imagem que informa e alt vazio na decorativa; ícone oculto ao lado de texto e com nome acessível quando sozinho. São regras novas (o site já faz assim em Componentes e Phosphor, mas nada decide). Valem também para documento A4 e slide? (proposta)
- Acessibilidade: a cor nunca é o único sinal. Vale para gráficos e para impresso? (proposta)
- Acessibilidade, Cores: o estudo de contraste aceita par de 3 ou mais para título grande, e "Contrastes a evitar" diz que o par de 3,1 (ferro sobre turquesa) "como texto, nunca". Prevalece qual? O texto de Acessibilidade diz só que os pares a evitar não servem para texto. (proposta)
