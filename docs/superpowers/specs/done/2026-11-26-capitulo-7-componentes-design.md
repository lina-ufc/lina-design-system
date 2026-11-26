# Capítulo 7 · Componentes — desenho

Data: 2026-11-26. Estado: para aprovação.

## Intenção

O capítulo 7 do site documenta as peças de conteúdo que a equipe e o agente repetem ao montar slides e
documentos A4. Hoje essas peças existem só no código: em `comp` no gerador da apresentação
(`templates/apresentacao/potx/build.js:105`) e nos estilos do Word e comandos do LaTeX do documento A4
(`templates/documento-a4/word/build.js`, `templates/documento-a4/latex/lina.cls`). Quem monta uma peça
não tem onde ler a regra; o agente só a encontra lendo o gerador.

O capítulo trata cada peça como **geral**: uma regra só, que vale em qualquer formato. Slide e A4 são
lugares onde ela aparece, com medidas próprias. Decisão do usuário (2026-11-26).

Público: a equipe montando slides e documentos, e o agente fazendo o mesmo (o site também é a skill;
ver `memoria/ds-documento-skill.md`).

## Metas

- Uma seção por peça, com: para que serve, a regra comum, o que não fazer, e como pedir em cada formato.
- Imagens tiradas dos geradores reais (slides do `-exemplo.pdf`, páginas dos PDFs de exemplo do A4),
  nunca redesenhadas à mão.
- Mesmo nome para a mesma peça nos dois formatos; quando o código usa nomes diferentes, o capítulo diz
  os dois.

## Não metas

- Não implementar no A4 as peças que hoje só existem no slide (nem o inverso). O capítulo registra
  "ainda não existe no A4"; implementar é outro trabalho.
- Não mudar os geradores, os estilos ou o visual de nenhuma peça.
- Não repetir tokens (cores, fontes, medidas): o capítulo aponta para os capítulos 2 e 5.
- Não cobrir layouts de slide inteiros (isso é 8.1) nem os elementos já documentados em outros
  capítulos (logotipo, pontilhado, ícones, ladrilho de ¼).

## Anti-metas

- Virar uma lista de tokens ou uma referência de API sem imagem.
- Dar uma regra no capítulo que o gerador contradiz.

## Restrições

- Regras da marca em `SKILL.md` e `README.md` vencem. Texto sem frases de oposição e sem travessões
  (revisão com `humanizer`, como no resto do site).
- Seções como fragmentos em `capitulos/7-componentes/N-<slug>.html`, registradas em `sistema.json`;
  site gerado por `python3 sistema.py`.
- Desenhos de forma com `assets/lina-draw.js` e `lina-geometry.js` quando um diagrama for necessário.
- Celular: sem corte horizontal (mesmas checagens feitas no restante do site em 2026-11-26).

## Abordagens consideradas

1. **Uma seção por peça, slide e A4 lado a lado.** Escolhida. A equipe procura pela peça, não pelo
   formato; o agente acha regra e comando no mesmo lugar. Custo: alinhar nomes entre formatos.
2. Duas seções, 7.1 Slide e 7.2 Documento, espelhando o código. Rápida, mas repete regras e esconde que
   a tabela do relatório segue a mesma regra da tabela do slide.
3. Como a 1, gerada do código por `make.sh` (render e medidas automáticas). Nunca desatualiza, mas pede
   um build novo só para o site. Fica para quando as medidas começarem a divergir.

## As peças (proposta minha, a confirmar na leitura)

Inventário do código, agrupado por peça geral:

| Seção | Slide (`comp` / layout) | A4 Word | A4 LaTeX |
|---|---|---|---|
| 7.1 Declaração | `declaracao` (fio ou painel A, B, C) | `LINA Atenção`, `Atenção Rótulo`, `Atenção Texto` | `\rotuloatencao` |
| 7.2 Tabela | `tabela` | `LINA Tabela`, `Título de Tabela`, `Mono Célula`, `Tabela Registro` | `\titulotabela`, `\chamadatabela`, `\registro` |
| 7.3 Legenda e fonte | `legenda`, `legendaCores` | `LINA Legenda`, `LINA Fonte` | `\legenda`, `\fonte` |
| 7.4 Número em destaque | `numeroSeta`, faixa de números | ainda não existe | ainda não existe |
| 7.5 Passos | `tileNumero` | `LINA Passos`, `Passo`, `Passo Número` | (verificar) |
| 7.6 Nota | (verificar) | `LINA Nota` | `\nota` |
| 7.7 Cabeçalho e rodapé | rodapé dos layouts | `LINA Cabeçalho`, `LINA Rodapé` | `\cabecalhoprimeira`, `\siglarodape` |
| 7.8 Cartão | `cartao` | ainda não existe | ainda não existe |
| 7.9 Tile de ícone | `tileIcone` | ainda não existe | ainda não existe |

Fora: metadados, autores, afiliação, colofão, assinaturas (peças de capa do A4, documentadas em 8.2).

## Decisões minhas na revisão (2026-11-26)

- Todas as peças entram, mesmo as de um formato só; a linha "como pedir" diz "ainda não existe" onde faltar.
- O `desc` novo do capítulo 7 substitui o antigo; logo, pontilhado, ladrilho e layouts ficam só nos seus
  capítulos, sem link no 7.
- Nome oficial = título da seção na tabela acima; os nomes do código aparecem em "como pedir".
- `LINA Número` e `\numero` são número mono no corpo do texto (tipografia, capítulo 5), não a peça 7.4.
- Imagem do A4: PDF do Word. LaTeX e HTML aparecem só na linha "como pedir".
- Peça sem exemplo pronto: slide ou página de demonstração num arquivo à parte que chama o gerador,
  sem mudar `build.js`.
- Declaração e Atenção são a mesma peça (decisão do usuário, 2026-11-26): uma regra, dois usos (frase a guardar
  no slide; aviso no POP). A seção 7.1 mostra os dois usos.
- Execução em subplanos (CLAUDE.md §9): subplano 01 = molde + 7.1, mostrado ao usuário antes das demais.

## Molde de cada seção

```
N.M  Nome da peça
[imagem slide]  [imagem A4]          (uma só, se a peça existe num formato)
Para quê: uma ou duas frases.
Regra: 3 a 6 itens (cor, peso, fio, cantos, proporção, quantidade por página).
Não fazer: 1 a 3 itens.
Como pedir: Slide · Word · LaTeX, com o nome exato no código.
```

Medidas: ditas em relação ao corpo ou à célula quando a regra é comum; em px (slide) e pt (A4) quando
só um formato tem a peça.

## Imagens

Recortes PNG dos PDFs de exemplo já publicados (`pdftoppm` + corte), em `capitulos/7-componentes/img/`.
Escolha do recorte e tamanho: decisão do construtor, uma imagem por formato, largura máxima de coluna.
Peça sem exemplo no PDF: gerar um slide ou página de demonstração com o próprio gerador, nunca à mão.

## Deixado ao construtor

- Texto de cada regra, lido do código (valores exatos), revisado com `humanizer`.
- Ordem final das seções e slugs.
- Linha do capítulo 7 em `sistema.json` (`desc`) atualizada para a lista nova.

## Verificação

- `python3 sistema.py` sem link quebrado; capítulo 7 sem "em breve".
- Cada "como pedir" conferido contra o código (nome existe).
- Página no desktop e a 375 px, sem corte; render mostrado ao usuário antes de concluir.
