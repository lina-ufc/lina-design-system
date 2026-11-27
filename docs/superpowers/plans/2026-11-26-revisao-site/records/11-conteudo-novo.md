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
