# Revisão do site — Progresso da implementação

**Última atualização:** 2026-11-27. Branch `main`.

Índice: [`README.md`](README.md).

## Como atualizar este arquivo

1. Atualizar só depois que o critério de verificação da tarefa passar.
2. Marcar a caixa e anexar o SHA curto e o resultado do review.
3. Atualizar a linha do plano na tabela de resumo.
4. Acrescentar uma linha no changelog.
5. Tarefa abandonada ou adiada: caixa desmarcada e motivo na mesma linha.
6. Nunca marcar um plano como completo com tarefa desmarcada.

## Resumo

`[░░░░░░░░░░]` 0% — total ainda não conhecido (só o 01 escrito).

| Plano | Progresso | Tarefas | Status |
| --- | --- | --- | --- |
| 01 — motores | `[██████████]` | 5/5 | Completo (branch `revisao-site/01-motores`, não mesclada) |
| 02 — protótipo visual | `[██████████]` | 4/4 | Completo (mesclado na main) (branch `revisao-site/02-prototipo`) |
| 03 — fonte única | `[██████████]` | 4/4 | Completo (mesclado na main) |
| 04 — estrutura | `[░░░░░░░░░░]` | 0/5 | Em execução (branch `revisao-site/04-estrutura`) |
| 05 — visual em tudo | `[░░░░░░░░░░]` | — | Não escrito |
| 06 — ferramentas no site | `[░░░░░░░░░░]` | — | Não escrito |
| 07 — conteúdo novo | `[░░░░░░░░░░]` | — | Não escrito |
| 08 — arquivar visual-code | `[░░░░░░░░░░]` | — | Não escrito |

## Plano 01 — motores

`[██████████]` 100% — 5 de 5 tarefas. Revisão final (opus) + correção única `2a30531` (EXIF, faixa 0–1 das frações, defaults no motor, trio sem cor repetida).

- [x] **Tarefa 1** — `assets/lina-palette.js`: cores, famílias, contraste, combinações válidas. `9de2d08`, `2b47cc1`; review limpo após 1 correção (chaves do protótipo)
- [x] **Tarefa 2** — textura: paletas do sistema, `fromParams`, bitmap exposto, SVG determinístico. `ee8b36a`; review limpo; 3-padroes com SVG idêntico à base
- [x] **Tarefa 3** — imagem: motor trazido do `lina-visual-code`, paletas do sistema, `fromParams`. `e94184f`, `fae9534`, `5dc43f2`; review limpo após 2 correções (distorção vertical; imagem baixa demais agora recusa)
- [x] **Tarefa 4** — linha de comando `ferramentas/textura.mjs` e `ferramentas/imagem.mjs`. `60b9c9c`; review limpo; 44/44 testes
- [x] **Tarefa 5** — `SKILL.md` documenta os comandos; páginas 3.x continuam iguais. `a61416b`; review limpo; sessão sem contexto gerou os dois SVG só com o `SKILL.md`

Verificação: `node --test "ferramentas/test/*.test.mjs"` 51/51 (o diretório sozinho falha no Node 26.5); `python3 sistema.py` ok; `3-padroes.html` com os 19 SVG idênticos à base `a76283c`.

## Plano 02 — protótipo visual

`[██████████]` 100% — 4 de 4 tarefas. Aprovado pelo dono.

- [x] **Tarefa 1** — montagem (`prototipo/montar.sh`) e render (`prototipo/render.sh`). `9e4c7a5`; antes = b1 com folha vazia
- [x] **Tarefa 2** — folha `prototipo/b1.css`. `dc1d0c4`; 14 `!important` contra inline de fragmento; render do celular corrigido (iframe de 390 px)
- [x] **Tarefa 3** — revisão de design e acessibilidade. `335b97f`; 11 achados de critério corrigidos, 8 perguntas de gosto ao dono; página atual idêntica ao pixel. Record: [`records/02-revisao.md`](records/02-revisao.md)
- [x] **Tarefa 4** — aprovação do dono. Rodada 2 (`b3cd16c`), creme (`4a59347`), 1.3 a 1,5× em 3 colunas; memória `visual-b1`

## Plano 03 — fonte única

`[██████████]` 100% — 4 de 4 tarefas.

Verificação: `python3 sistema.py` ok (53 links no `llms.txt`); `node --test "ferramentas/test/*.test.mjs"` 56/56; `node ferramentas/tokens.mjs --check` 0.

- [x] **Tarefa 1** — `ferramentas/tokens.mjs` gera `tokens/lina.tokens.json` (DTCG) e confere `colors.css` contra a paleta. `a2e19fd`; 56/56 testes; `--check` 0; CSS adulterado sai 2
- [x] **Tarefa 2** — `sistema.py` gera `llms.txt`. `317d75f`; 53/53 links ok
- [x] **Tarefa 3** — `README.md` sem hex; `SKILL.md` como índice. `270cb44`; 0 hex; 45 caminhos conferidos
- [x] **Tarefa 4** — teste às cegas e revisão. 6/6; 1 achado corrigido (fontes); URL do `llms.txt` escrita no `SKILL.md`. Record: [`records/03-teste-cego.md`](records/03-teste-cego.md)

Herança para o 05: hex das 12 cores seguem em `capitulos/` (2.x, 3.x, 4.x, 8.2), `assets/lina-draw.js`, `assets/lina-dither-field.js` e `templates/` (fora do escopo pelo spec).

## Plano 04 — estrutura

`[░░░░░░░░░░]` 0% — 0 de 5 tarefas. Decisões do dono no topo de [`04-estrutura.md`](04-estrutura.md).

- [ ] **Tarefa 1** — `sistema.json`/`sistema.py` em quatro partes, pastas sem número, redirecionamentos
- [ ] **Tarefa 2** — home, Princípios (proposta), Recursos
- [ ] **Tarefa 3** — molde de seção e piloto no Logotipo
- [ ] **Tarefa 4** — referências e números soltos
- [ ] **Tarefa 5** — verificação, revisão, aprovação do piloto

## Estado herdado

- Base: `a76283c` (Capítulo 7 concluído).
- `assets/lina-geometry.js` idêntico ao do `lina-visual-code`.
- `assets/lina-texture.js` já portado, difere do `lina-visual-code` só nas paletas.
- `lina-image.js` e o editor de células (`grid.html`) só existem no `lina-visual-code`.
- `sharp` já instalado em `templates/apresentacao/potx/node_modules` (hook `build-setup.sh`).
- Node 26 (`node --test` disponível, sem dependências novas).

## Ações pendentes do dono

1. Conferir as chamadas minhas listadas no spec (fundo branco do site, famílias de matiz,
   regra de contraste dos padrões). Não bloqueiam o 01.
2. ~~Aprovar o protótipo do 02.~~ Aprovado em 2026-11-27 (creme, não branco).

## Changelog

- 2026-11-26 — Spec com decisões escrito; conjunto criado; plano 01 escrito.
- 2026-11-27 — Tarefa 1 concluída (paleta).
- 2026-11-27 — Tarefa 2 concluída (textura). `legal()` checa o bloco 2×2 na grade da própria forma (o `quarter` desloca formas separadas em ¼).
- 2026-11-27 — Tarefa 3 concluída (imagem). Escala uniforme: a altura pode ficar até uma linha menor que a razão exata; nunca estica.
- 2026-11-27 — Tarefa 4 concluída (linha de comando).
- 2026-11-27 — Tarefa 5 e revisão final concluídas. Plano 01 completo; branch aguarda merge. Próximo: escrever o 03 (depende do 01).
- 2026-11-27 — Plano 02 escrito (protótipo B1 da página Logotipo).
- 2026-11-27 — Tarefa 1 do 02 concluída. Achado para o 05: em 1.8 o Baixar tem `<a>` dentro de `<a>` (link para 5.5 no cartão do .vectorcraft), o navegador parte o cartão.
- 2026-11-27 — Tarefa 2 do 02 concluída. Chrome sem janela não abre com menos de 500 px: `render.sh` põe o celular num iframe de 390 px.
- 2026-11-27 — Tarefa 3 do 02 concluída. Protótipo pronto para o dono.
- 2026-11-27 — Rodada 2 do 02: número de seção com metade do título, acima dele, margem única; ladrilhos; folga de 2 células. Dono escolheu creme em tudo (página, barra, pranchas), contra o branco do spec. Pendente: 1.3 em 2× quebra em 3+2.
- 2026-11-27 — 1.3 a 1,5× em três colunas iguais. Plano 02 completo; 04 e 05 desbloqueados.
- 2026-11-27 — Plano 03 escrito (fonte única, `SKILL.md` índice, `llms.txt`).
- 2026-11-27 — Tarefas 1 e 2 do 03 concluídas (tokens DTCG, `llms.txt`), em paralelo.
- 2026-11-27 — Tarefas 3 e 4 do 03 concluídas. Plano 03 completo; branch aguarda merge.
- 2026-11-27 — Plano 04 escrito. Dono: numeração contínua sem número no arquivo, molde com piloto no Logotipo, home porta de entrada, Recursos agora.
