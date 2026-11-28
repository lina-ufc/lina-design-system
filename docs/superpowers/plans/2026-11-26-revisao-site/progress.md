# Revisão do site — Progresso da implementação

**Última atualização:** 2026-11-27. Branch `main`; 01–06 mesclados; feedback (07–10) mesclado neste conjunto.

Índice: [`README.md`](README.md).

## Como atualizar este arquivo

1. Atualizar só depois que o critério de verificação da tarefa passar.
2. Marcar a caixa e anexar o SHA curto e o resultado do review.
3. Atualizar a linha do plano na tabela de resumo.
4. Acrescentar uma linha no changelog.
5. Tarefa abandonada ou adiada: caixa desmarcada e motivo na mesma linha.
6. Nunca marcar um plano como completo com tarefa desmarcada.

## Resumo

`[████████░░]` 9 de 12 subplanos completos — total de tarefas ainda não conhecido (12 não escrito).

| Plano | Progresso | Tarefas | Status |
| --- | --- | --- | --- |
| 01 — motores | `[██████████]` | 5/5 | Completo (mesclado na main) |
| 02 — protótipo visual | `[██████████]` | 4/4 | Completo (mesclado na main) (branch `revisao-site/02-prototipo`) |
| 03 — fonte única | `[██████████]` | 4/4 | Completo (mesclado na main) |
| 04 — estrutura | `[██████████]` | 5/5 | Completo (mesclado na main) |
| 05 — visual em tudo | `[██████████]` | 6/6 | Completo (mesclado na main) |
| 06 — ferramentas no site | `[██████████]` | 9/9 | Completo, aprovado pelo dono em 2026-11-27 (mesclado na main) |
| 07 — feedback: acesso anônimo e Apps Script | `[██████████]` | 3/3 | Completo (mesclado na main) |
| 08 — feedback: página e envio | `[██████████]` | 3/3 | Completo (mesclado na main) |
| 09 — feedback: entradas na home e no menu | `[██████████]` | 2/2 | Completo (mesclado na main) |
| 10 — feedback: texto, acessibilidade, aprovação | `[██████████]` | 3/3 | Completo, aprovado pelo dono em 2026-11-28 (branch `revisao-site/10-feedback-final`) |
| 11 — conteúdo novo | `[████████░░]` | 5/6 | Tarefas 1–5 feitas; aguarda decisões do dono (branch `revisao-site/11-conteudo-novo`) |
| 12 — arquivar visual-code | `[░░░░░░░░░░]` | — | Não escrito |

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

`[██████████]` 100% — 5 de 5 tarefas. Decisões do dono no topo de [`04-estrutura.md`](04-estrutura.md).

- [x] **Tarefa 1** — `sistema.json`/`sistema.py` em quatro partes, pastas sem número, redirecionamentos. `82a1907`, `0e2f334`; review: estrutura ok, números velhos roteados à 4
- [x] **Tarefa 2** — home, Princípios (proposta), Recursos. `ecf2e67`; review limpo
- [x] **Tarefa 3** — molde de seção e piloto no Logotipo. `e299f9e`, `61242a6`; review limpo após 1 correção; `h2` internos de 2.7/2.8 ao dono
- [x] **Tarefa 4** — referências e números soltos. `53b441c`, `978c9e9` + título de teste; review limpo após 1 correção
- [x] **Tarefa 5** — verificação, revisão, aprovação do piloto. Checagens ok; molde aprovado pelo dono em 2026-11-27. Record: [`records/04-estrutura.md`](records/04-estrutura.md)

## Plano 05 — visual em tudo

`[██████████]` 100% — 6 de 6 tarefas.

- [x] **Tarefa 1** — base: `site.css` com o B1, `.prancha`, Logotipo sem protótipo, 2.7/2.8 entradas próprias, `aria-current`. `b716424`, `c627c7b`, `8621a55`; sistema.py ok, 1 `!important` (paleta), 56/56; render igual à ref salvo 2.8/2.10 novas. Pendentes à 6: link 4.5 do .vectorcraft virou texto; `h2.h` inline em 4.x, 8.x, 10.x
- [x] **Tarefa 2** — Cores: molde e pranchas. `1edc579`; 6 seções `livre`; Baixar vira 3.9
- [x] **Tarefa 3** — Padrões: molde e pranchas. `cf8868a`; sem `livre`
- [x] **Tarefa 4** — Tipografia e Ícones: molde e pranchas. `4105105`; Baixar 4.6 e 8.7, Opacidade original 8.4
- [x] **Tarefa 5** — Componentes: molde e pranchas; Templates sem `h2` inline. `cc57719`, blocos `site.css`/`sistema.json` em commit próprio; links para os Baixar `6ed393d`
- [x] **Tarefa 6** — verificação, acessibilidade, aprovação do dono. Checagens ok, 0 rolagem lateral, 7 achados de critério corrigidos (`a03b584`, `d54ad2a`, último commit); visual aprovado pelo dono em 2026-11-27; 10 perguntas de conteúdo/gosto seguem abertas no record. Record: [`records/05-visual.md`](records/05-visual.md)

## Plano 06 — ferramentas no site

`[██████░░░░]` 67% — 6 de 9 tarefas. Plano: [`06-ferramentas.md`](06-ferramentas.md). 5 chamadas minhas a conferir com o dono no topo do plano.

- [x] **Tarefa 1** — base comum: `assets/lina-ferramenta.js` (estado na URL, comando, baixar), CSS dos controles, testes. `e882183`, `66232fb`; review limpo após 1 rodada (carga sem motor, alvo 44 px, padrões = motor); 66/66
- [x] **Tarefa 2** — gerador de padrões em Padrões 6.9. `a16f4f2`, `cd6dcf5`; review após 1 rodada (limite de formato: width=1 travava a aba); 66/66
- [x] **Tarefa 3** — filtro de pontilhado em Imagem 7.1. `b0bf9cc`; review limpo; 3 ajustes de acessibilidade passam à tarefa 5
- [x] **Tarefa 4** — editor de células em Logotipo 2.10 (Baixar vira 2.11). `825f03e`, `58b1322`; revisão própria (desfazer fora da grade corrigido); letreiro centrado, teclado só com a grade em foco, limite de 1000 células
- [x] **Tarefa 5** — Recursos 11.3, verificação, acessibilidade, aprovação do dono. `b82f0c1`, `c8aa1d2`; checagens e navegador ok ([record](records/06-ferramentas.md)); aprovado em 2026-11-27
- [x] **Tarefa 6** — motor de imagem: Pontilhado, Dispersão, Campo; cores por tom (spec 2026-11-27). `038d72f`, `1270d37`; review após 1 rodada (faixa igual ao fundo recusada; divisa sem costura); 82/82
- [x] **Tarefa 7** — interface do filtro com os três padrões e as faixas de tom. `0123e80`, `8f45a6f`; review após 1 rodada (troca de cor sem duplicar); SVG = CLI nos três modos
- [x] **Tarefa 8** — ferramentas em páginas próprias; índice e menu. `c44ec49`, `130fde2`, `0ab7511`; review limpo (menores: f-string só em Python 3.12 corrigido; texto de abertura repete o subtítulo e links antigos `#s-gerador` sem redirecionar ficam para a tarefa 9); cores logo abaixo de Filtro; 82/82
- [x] **Tarefa 9** — verificação e aprovação do dono. `fa84684`; checagens e navegador ok ([record](records/06-ferramentas.md)); aprovado pelo dono em 2026-11-27

## Plano 07 — feedback: acesso anônimo e Apps Script

`[██████████]` 100% — 3 de 3 tarefas. Plano: [`07-feedback-apps-script.md`](07-feedback-apps-script.md).

- [x] **Tarefa 1** — dono confirma que a UFC permite app da web com acesso de "Qualquer pessoa". `curl` sem login: `{"ok":true}`. Record: [`records/07-feedback-apps-script.md`](records/07-feedback-apps-script.md)
- [x] **Tarefa 2** — `feedback/apps-script.gs` com `valida` e `decide` testados em Node. `a73f2d5`; review limpo (só menores); 88/88. Na Tarefa 3, conferir que `'=x` aparece como texto na planilha
- [x] **Tarefa 3** — `feedback/README.md`; dono publica o script real; envio de teste grava linha. `b44358d`; 4 casos ok, linha e e-mail confirmados pelo dono

## Plano 08 — feedback: página e envio

`[██████████]` 100% — 3 de 3 tarefas. Plano: [`08-feedback-pagina.md`](08-feedback-pagina.md).

- [x] **Tarefa 1** — `assets/lina-feedback.js`: `valida`, `corpo`, `paginaDe`, `envia` testados em Node. `7839a81`; review limpo; 95/95
- [x] **Tarefa 2** — `feedback.html` gerada pelo `sistema.py`; chaves `feedback` e `feedback_url`; `liga`; CSS. `1581975`, `f6374c3`; review limpo após 1 correção (`#fb{display:flex}` anulava `hidden`). `feedback.html` não é versionado (`/*.html` no `.gitignore`)
- [x] **Tarefa 3** — navegador (1280/390, estados, teclado) e envio real confirmado pelo dono. Record: [`records/08-feedback-pagina.md`](records/08-feedback-pagina.md); 4 menores de acessibilidade para o 10

## Plano 09 — feedback: entradas na home e no menu

`[██████████]` 100% — 2 de 2 tarefas. Plano: [`09-feedback-entradas.md`](09-feedback-entradas.md).

- [x] **Tarefa 1** — `sistema.py`: link no fim do sumário (`?pagina=<arquivo>`) e bloco na home; nada sem `feedback_url`. `95ea597`; review limpo; 95/95
- [x] **Tarefa 2** — navegador (1280/390, clique do link preenche Página, 44 px, teclado). Ok; 1 nota de design para o 10. Record: [`records/09-feedback-entradas.md`](records/09-feedback-entradas.md)

## Plano 10 — feedback: texto, acessibilidade, verificação e aprovação

`[██████████]` 100% — 3 de 3 tarefas. Plano: [`10-feedback-final.md`](10-feedback-final.md).

- [x] **Tarefa 1** — texto revisado com `design:ux-copy` (página, avisos, link do menu, bloco da home). `b1c120f`; review limpo; link vira "Feedback sobre esta página"
- [x] **Tarefa 2** — acessibilidade: 4 menores do 08, bloco da home em lista, `design:accessibility-review`. `7256fcf`; review limpo; +3 achados WCAG corrigidos (borda dos campos, "Enviando…" anunciado, foco na falha); 2 perguntas de gosto
- [x] **Tarefa 3** — verificação final, envio real com isca, VoiceOver, renders, aprovação do dono. Checagens, navegador e renders ok (`0e2be98`, [record](records/10-feedback-final.md)); envio real e VoiceOver feitos pelo dono; seção em lista a pedido do dono (`6304986`, `18d3ad6`, review limpo); aprovado pelo dono em 2026-11-28; 3 perguntas de gosto abertas no record

## Plano 11 — conteúdo novo

`[████████░░]` 83% — 5 de 6 tarefas. Plano: [`11-conteudo-novo.md`](11-conteudo-novo.md).

- [x] **Tarefa 1** — uso do logo: área de proteção e tamanho mínimo (Logotipo). `6f51f15`, `d229eaa`; review após 1 rodada
- [x] **Tarefa 2** — Grid e espaço: célula, margens, espaçamento. `f0021d8`, `ebb4cc1`; review limpo
- [x] **Tarefa 3** — Imagem: fotografia. `2a51295`, `8c23ddf`; review após 1 rodada
- [x] **Tarefa 4** — capítulo novo Voz e texto; renumeração conferida (Templates 10→11 em memórias). `5114a73`, `855362e`; review após 1 rodada
- [x] **Tarefa 5** — Princípios: acessibilidade. `ad8d0ae`, `4380aa0`; review após 1 rodada
- [ ] **Tarefa 6** — verificação, renders, decisões do dono. Passos 1–4 feitos: checagens ok (95/95, tokens 0), `SKILL.md` sem "em breve" (`534fb78`), revisão final com 18 ajustes (`2e0b64c`), renders em `records/11-render/`. Passo 5: dono respondeu (2026-11-28, ver [record](records/11-conteudo-novo.md)); falta aplicar as respostas.

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
- 2026-11-27 — Tarefas 1–4 do 04 concluídas (2, 3 e 4 em paralelo). Verificação final ok; piloto do molde e princípios esperam o dono.
- 2026-11-27 — Molde do piloto aprovado. Plano 04 completo; 05 desbloqueado. Abertos ao dono: princípio "forma" x "letra", h2 internos de 2.7/2.8.
- 2026-11-27 — Plano 05 escrito. Dono: 2.7 e 2.8 viram entradas próprias do Logotipo (Baixar no fim). Templates, Princípios e Recursos sem molde.
- 2026-11-27 — Tarefa 1 do 05 concluída. Baixar do Logotipo com id `s-baixar-logotipo` (`s-baixar` já é de Recursos).
- 2026-11-27 — Tarefas 2–5 do 05 concluídas em paralelo; tarefa 6: verificação e revisão, 7 achados corrigidos. Aguarda o dono (10 perguntas no record).
- 2026-11-27 — Visual do 05 aprovado. Plano 05 completo; 06 desbloqueado. Perguntas do record 05 abertas.
- 2026-11-27 — Fora dos subplanos: moldura de 9 faixas em todos os capítulos (`c4e6560`, branch `revisao-site/06-moldura`, nome não ligado ao plano 06) e pranchas sem retícula (`65776e7`). Ambos mesclados (`fdc930d`, `a200c9b`).
- 2026-11-27 — Plano 06 escrito (ferramentas no site). Tarefas 2–4 em paralelo depois da 1.
- 2026-11-27 — Dono pediu: filtro com os três padrões e cores por tom; ferramentas em páginas próprias. Tarefas 6–9 no 06 (spec `2026-11-27-ferramentas-paginas-e-tons.md`).
- 2026-11-27 — Spec do feedback aprovado; subplano escrito (conjunto `2026-11-27-feedback/`).
- 2026-11-27 — Conjuntos mesclados: feedback vira 07–10; conteúdo novo passa a 11 e arquivar visual-code a 12. Execução em sequência.
- 2026-11-27 — Tarefa 2 do 07 concluída (Apps Script). Tarefa 1 espera o dono.
- 2026-11-27 — Tarefa 1 do 07 concluída: UFC permite acesso anônimo; abordagem B mantida.
- 2026-11-27 — Tarefa 3 do 07 concluída. Plano 07 completo; URL publicada no record. Próximo: escrever o 08.
- 2026-11-27 — 07 mesclado na main (`b937e2b`). Plano 08 escrito; chaves `feedback`/`feedback_url` passam do 09 para o 08 (a página precisa delas).
- 2026-11-27 — Tarefa 1 do 08 concluída (lógica do envio).
- 2026-11-27 — Tarefa 2 do 08 concluída (página). Plano previa commitar `feedback.html`, mas HTML da raiz é gerado e ignorado.
- 2026-11-27 — Tarefa 3 do 08 concluída; envio real confirmado pelo dono. Plano 08 completo; próximo: escrever o 09.
- 2026-11-27 — 08 mesclado na main (`efbbda1`). Plano 09 escrito: link como último item do sumário (`a.cap`), `feedback.html` passa `FB` como `atual` para não levar o link.
- 2026-11-27 — Plano 09 completo (`95ea597`): link no sumário e bloco na home verificados no navegador. Próximo: escrever o 10.
- 2026-11-28 — 09 mesclado na main (`09e07e1`). Plano 10 escrito: texto, acessibilidade (menores do 08, bloco da home em lista), envio real com isca e aprovação.
- 2026-11-28 — Tarefas 1 e 2 do 10 concluídas; verificação no navegador e renders ok. Aguarda o dono: envio real com isca, VoiceOver, aprovação.
- 2026-11-28 — Dono fez envio real e VoiceOver; pediu Página como lista de seções (feito). Falta aprovação.
- 2026-11-28 — Feedback (07–10) aprovado pelo dono. Plano 10 completo; próximo: escrever o 11.
- 2026-11-28 — 10 mesclado na main (`6707280`). Plano 11 escrito. Dono: voz e texto vira capítulo novo depois de Tipografia; acessibilidade entra em Princípios.
- 2026-11-28 — Tarefas 1–5 do 11 concluídas (subagentes, review por tarefa); revisão final e renders feitos. Aguarda o dono: Perguntas e Gosto no record 11.
