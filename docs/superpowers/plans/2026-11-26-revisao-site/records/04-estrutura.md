# 04 — Verificação final e pendências do dono

Data: 2026-11-27. Branch `revisao-site/04-estrutura`.

## Checagens

- `python3 capitulos/templates/_gerar.py && python3 sistema.py`: 11 capítulos, 51 entradas, 39 links, 8 redirecionamentos, `llms.txt` 56 links.
- `node --test "ferramentas/test/*.test.mjs"`: 56/56. `node ferramentas/tokens.mjs --check`: 0.
- Grep de caminho velho: só `sistema.json` (`antigos`) e a memória que cita os nomes velhos de propósito.
- Navegador (servidor local): `3-padroes.html#s-monocromaticos`, `4-animacao.html#s-o-campo-animado`,
  `index.html#s-das-relacoes-o-grupo`, `1-logotipo.html#s-cantos-e-encontros`, `7-componentes.html#s-tabela`
  chegam na página nova com a seção existente. Home e sumário com as quatro partes; home no celular (375 px) ok.
- Revisão por tarefa (sonnet): 1 e 3 com correção, 2 e 4 limpas após correção. Sem revisão de branch extra:
  as quatro revisões cobrem todos os commits.

## Render do piloto

`04-piloto/logotipo-desktop.png` e `04-piloto/logotipo-celular.png`. Seis seções no molde; `livre` em
2.2 Três medidas (definições lado a lado) e 2.6 Logotipo com a grade (só figura e legenda).

## Para o dono decidir

1. Molde no piloto: aprovar ou ajustar antes do 05 aplicar no resto.
2. Princípios (proposta em `capitulos/principios/1-principios.html`): o 1º diz "Toda forma é uma união de
   células"; a fonte (2.1) diz "Toda letra".
3. `h2` internos escapam do molde: 2.7 "Formas derivadas" e 2.8 "Baixar". Opções: entrada própria para
   cada um, ou mover o Baixar para Recursos no 05.
4. Bug antigo no 2.8 (`<a>` dentro de `<a>` no cartão do .vectorcraft) segue para o 05.
