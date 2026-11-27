# 05 — Visual B1 em todas as páginas e molde nos capítulos: plano de implementação

> **Para agentes:** sub-skill obrigatória: `superpowers:subagent-driven-development`.
> Passos em caixas (`- [ ]`). Ao terminar cada tarefa, atualizar `progress.md`.

**Objetivo:** o visual B1 aprovado no protótipo (`prototipo/b1.css`) passa a ser o do site
inteiro, sem folha de protótipo nem `!important` contra inline; os capítulos de conteúdo
seguem o molde de seção; acessibilidade revisada em todas as páginas.

**Arquitetura:** as regras genéricas de `b1.css` entram em `site.css` no lugar das antigas.
O que o protótipo pegava por id (`div[id$="-d"]`, `#comb-usar`…) vira a classe `.prancha`
(moldura com retícula) e `.fig` (ladrilho). Estilo inline que briga com o B1 ou quebra o
celular sai do fragmento e vira classe; o resto do inline fica. Regra própria de um capítulo
vai no bloco dele em `site.css`. `sistema.py` marca o capítulo atual com `aria-current`.

**Spec:** [`../../specs/2026-11-26-revisao-site-diagnostico.md`](../../specs/2026-11-26-revisao-site-diagnostico.md),
B1 e "Plano", item 5. Decisões visuais: `memoria/visual-b1.md`. Achados herdados:
[`records/02-revisao.md`](records/02-revisao.md) ("Para o subplano 05") e
[`records/04-estrutura.md`](records/04-estrutura.md).

**Decisões do dono:** visual B1 com creme em tudo (2026-11-27, `visual-b1`); molde no resto
dos capítulos no 05 (decisão do 04); 2.7 "Formas derivadas" e 2.8 "Baixar" viram entradas
próprias do Logotipo, Baixar no fim (2026-11-27).

## Restrições globais

- Nenhuma dependência nova. Python 3.13, Node 26, Chrome headless.
- Nenhuma cor, fonte, raio ou sombra fora do que `b1.css` já usa (tokens, `--t2`, `--fio-b1`,
  `--reticula`). Medidas de leiaute em múltiplos de `--cell-half` quando der.
- Molde: só reorganizar texto existente (`docs/guidelines/molde-de-secao.md`). Nenhuma regra
  nova inventada; seção sem frase normativa vira `"livre": true` com motivo no relatório.
- Diagramas, scripts e `lina-geometry.js` intactos; só tamanho e moldura mudam. Imagem e SVG
  nunca distorcidos (uma dimensão com a outra em `auto`).
- Ids de seção (`s-<nome>`) não mudam; entrada nova ganha id novo.
- Capítulos sem molde: Princípios (conceito/proposta), Templates (um template por seção,
  explicação e Baixar, `memoria/padrao-explicacao-download.md`), Recursos (índice). Ganham
  só o visual.
- Em tarefa paralela: não fazer commit (o controlador commita); não editar fora dos arquivos
  da tarefa; `python3 sistema.py` que falhe em arquivo de outro capítulo: esperar e repetir,
  não mexer.

## Foco de revisão

1. Página no celular (390 px) sem rolagem horizontal; diagrama largo rola dentro da prancha
   (`tabindex="0"`, `role="region"`, `aria-label`), não a página.
2. Retícula atrás de texto corrido ou de legenda; retícula fora do passo da célula do diagrama.
3. Estilo inline que ainda vence o B1 (exemplo no tamanho antigo, cartão arredondado,
   cor de interface fora do creme).
4. Contraste ≥ 4,5:1 em texto da interface sobre o fundo real (creme e retícula), medido.
   Amostras de cor dos capítulos (Cores, Padrões) são conteúdo, não interface.
5. Texto visível antes e depois do molde: só movimento e rótulos, nenhuma frase nova.

---

## Tarefa 1 — base: `site.css`, `.prancha`, Logotipo sem protótipo

Sequencial (as outras dependem dela). Arquivos: `site.css`, `sistema.py` (só `aria-current`),
`sistema.json` (só entradas do Logotipo), `capitulos/logotipo/*`, `prototipo/*`,
`.gitignore`, `memoria/visual-b1.md` (só "How to apply").

- [ ] Branch `revisao-site/05-visual` a partir da `main`.
- [ ] Antes de mexer: `sh prototipo/montar.sh && sh prototipo/render.sh prototipo-logotipo.html ref`
  e copiar os dois PNG para `records/05-render/ref-logotipo-{desktop,celular}.png`
  (referência aprovada).
- [ ] `site.css`: regras genéricas do `b1.css` substituem as antigas equivalentes (fundação,
  barra lateral, cabeçalho, seção, `.citado`, `.vizinhos`, `.dl` em lista, celular). Seletor
  por id do Logotipo vira `.prancha` / `.prancha>.fig`. Variável `--branco` sai (é `--creme`).
  Um bloco vazio comentado por capítulo no fim (`/* ---- cores ---- */`, `padroes`,
  `tipografia`, `icones`, `componentes`) para as tarefas paralelas.
- [ ] Fragmentos do Logotipo: `class="prancha"` nos contêineres de exemplo; cada inline
  vencido por `!important` no `b1.css` sai e vira classe ou regra do bloco do Logotipo;
  regras por id que só valem para um diagrama (escala 1,5×/2× de 1.3 e 1.4) ficam no bloco.
  Prancha que rola no celular: `class="prancha rola"`, `tabindex="0"`, `role="region"`,
  `aria-label` com o título da figura.
- [ ] 2.7 "Formas derivadas" e 2.8 "Baixar" viram entradas próprias (fragmentos novos, ids
  novos `s-formas-derivadas`, `s-baixar-logotipo` ou o que já existir no `h2`), Baixar por
  último com `"livre": true`. Molde passa. Tirar o `<a>` aninhado do cartão do `.vectorcraft`.
- [ ] `sistema.py`: `aria-current="page"` no link do capítulo atual do sumário.
- [ ] `prototipo/render.sh`: moldura do celular com nome por render (`_celular-$2.html`), para
  rodar em paralelo. Apagar `prototipo/b1.css` e `prototipo/montar.sh`; `.gitignore` sem
  `/prototipo-*.html`. `visual-b1` "How to apply": B1 mora em `site.css`, classe `.prancha`.

Verificar: `python3 capitulos/templates/_gerar.py && python3 sistema.py` sem erro;
`grep -c '!important' site.css` só os que já existiam antes (paleta); `sh prototipo/render.sh
logotipo.html logotipo` e comparar com `ref-*` lado a lado (mesma página, diferenças só onde
2.7/2.8 viraram seções); render das outras páginas sem quebra grosseira. PNG em
`records/05-render/`.

## Tarefas 2 a 5 — capítulos (paralelas, depois da 1)

Cada uma, só nos seus arquivos: fragmentos do capítulo, as entradas dele em `sistema.json`,
o bloco dele em `site.css`.

- [ ] Ler `docs/guidelines/molde-de-secao.md`, o bloco base de `site.css`, os fragmentos do
  Logotipo já convertidos (exemplo de `.prancha`, `.fig`, `rola`, molde).
- [ ] Converter cada seção ao molde (reorganizar texto; `h2` interno com assunto próprio vira
  entrada própria; "Não fazer"/"a evitar" viram Faça e não faça). `"molde": true` no capítulo
  só no fim.
- [ ] Exemplos em `.prancha` com ladrilhos `.fig`; inline que briga com o B1 ou abre rolagem
  lateral no celular sai; o resto fica.
- [ ] `sh prototipo/render.sh <id>.html <id>` e copiar os PNG para `records/05-render/`; olhar
  os dois e corrigir até passar o foco 1–3.

Verificar: `python3 sistema.py` passa com `molde` no capítulo; diff do texto visível da
página gerada (sem tags) antes/depois mostra só movimento e rótulos; PNG desktop e celular.
Relatório: entradas `livre` com motivo, `h2` que viraram entradas, inline que ficou de
propósito.

| Tarefa | Capítulo(s) | Notas |
| --- | --- | --- |
| 2 | Cores | 170 inline; `.paleta` já tem regra de celular; tabelas de contraste são conteúdo |
| 3 | Padrões | inclui o campo animado e as opções de cor (vindos da Animação) |
| 4 | Tipografia e Ícones | `.pesos`, `.alfabeto`, `.spec` já em `site.css` |
| 5 | Componentes | `.caixa`, `.numeros`, `.comp-dupla` são exemplos: dentro de prancha |

## Tarefa 6 — verificação, acessibilidade e aprovação

Depois de 2 a 5.

- [ ] `python3 capitulos/templates/_gerar.py && python3 sistema.py`,
  `node --test "ferramentas/test/*.test.mjs"`, `node ferramentas/tokens.mjs --check`.
- [ ] Navegador (servidor local), cada página em 375 px:
  `document.scrollingElement.scrollWidth <= innerWidth`; tab pelo sumário e pelas pranchas
  roláveis com foco visível.
- [ ] Revisão independente (sonnet, `design:accessibility-review` + `design:design-critique`)
  com os PNG de `records/05-render/` e o diff; contrastes medidos por script (pares reais,
  transparência composta sobre creme e sobre o cruzamento da retícula).
- [ ] Corrigir achados de critério; perguntas de gosto ao dono. Mostrar renders. Record:
  `records/05-visual.md`.

Verificar: checagens passam; 0 página com rolagem lateral; achados corrigidos ou registrados.
