# 11 — Conteúdo novo: plano de implementação

> **Para agentes:** sub-skill obrigatória: `superpowers:subagent-driven-development` (ou
> `superpowers:executing-plans`). Passos em caixas (`- [ ]`). Ao terminar cada tarefa, atualizar `progress.md`.

**Objetivo:** as lacunas de fundamentos ganham rascunho marcado como proposta (uso do logo, grid e espaço,
fotografia, voz e texto, acessibilidade), para o dono decidir os valores.

**Arquitetura:** só conteúdo. Fragmentos novos em `capitulos/`, entradas novas em `sistema.json`, um capítulo novo
(`voz-e-texto`). Nenhum código novo; `sistema.py` já confere molde e links.

**Tecnologia:** HTML de fragmento, `sistema.json`, `python3 sistema.py`, `prototipo/render.sh`.

**Spec:** [`../../specs/2026-11-26-revisao-site-diagnostico.md`](../../specs/2026-11-26-revisao-site-diagnostico.md),
O3 ("Fundamentos que faltam"), decisões ("Conteúdo novo de fundamentos … entra como rascunho marcado como proposta") e
passo 7 ("Lacunas de conteúdo").

Decisões do dono (2026-11-28): voz e texto vira capítulo novo em II Fundamentos, depois de Tipografia (a numeração
na tela de Grid em diante sobe 1); acessibilidade entra como seção em Princípios, também proposta.

## Restrições globais

- Texto em pt-BR, tom do site: direto, sem exclamação, "você". Texto longo passa pela skill `humanizer`.
- Todo conteúdo novo é proposta: `sub` da entrada termina em ` (proposta)` e o fragmento traz, logo depois do
  `<p class="regra">` (ou do `h2`, em capítulo sem molde), `<p class="cap"><b>Proposta, aguarda decisão.</b> …</p>`
  dizendo de onde veio o texto.
- Valor que já existe no sistema é citado com link, nunca repetido com outro número. Valor novo (que ninguém
  decidiu) vai marcado `<b>proposta:</b>` no próprio texto e entra na lista de perguntas do record.
- Seções de capítulo com `"molde": true` seguem `docs/guidelines/molde-de-secao.md` (um `p.regra`; `h3` só
  `Por quê`, `Medidas`, `Faça e não faça`, `Como pedir`, nessa ordem).
- Nome do arquivo `capitulos/<cap>/<n>-<slug>.html`: `<slug>` vira o id (`s-<slug>`); `<n>` é o próximo número livre
  na pasta; a ordem vem do `sistema.json`.
- Só classes existentes (`regra`, `regras`, `spec`, `faca-nao`, `cap`, `prancha`). Sem fotos: a curadoria é do dono
  (memória `fotos-referencia-cores`); não buscar imagens.
- Fontes de valor: `memoria/margem-meia-celula.md` (½ célula), `tokens/spacing.css`, `templates/apresentacao/README.md`,
  seções existentes de Logotipo, Cores e Tipografia.

## Foco da revisão

1. Número que contradiz o existente (ex.: margem diferente de ½ célula para logo com fundo) (Tarefas 1 e 2).
2. Renumeração: referência escrita à mão a "5.x", "6.x"… em fragmento, `SKILL.md` ou `README.md` que não seja
   reescrita pelo `sistema.py` (Tarefa 4, Passo 3).
3. Proposta sem marca: valor novo sem `<b>proposta:</b>` ou fora da lista de perguntas (todas as tarefas; Tarefa 6).
4. "Em breve" que sobra em `SKILL.md`/`llms.txt` para capítulo que passou a ter conteúdo (Tarefa 6, Passo 2).
5. Texto que repete o que outra seção já diz em vez de linkar (Voz x Tipografia "Detalhes") (Tarefa 4).

---

### Task 1: Uso do logo (Logotipo)

**Files:**
- Create: `capitulos/logotipo/12-area-de-protecao.html`, `capitulos/logotipo/13-tamanho-minimo.html`
- Modify: `sistema.json` (duas entradas `logotipo`, depois de "Combinações de cores", antes de "Editor de células")
- Create: `docs/superpowers/plans/2026-11-26-revisao-site/records/11-conteudo-novo.md` (seções "Logotipo" e "Perguntas")

**Interfaces:**
- Produces: ids `s-area-de-protecao`, `s-tamanho-minimo` (Tarefa 5 linka).

- [ ] **Step 1: Área de proteção.** Regra: logo com fundo ou placa tem ½ célula entre arte e borda (decisão de
  2026-11-22, `margem-meia-celula`, exceções símbolo vazado e selo). Logo sem fundo: área livre ao redor,
  `<b>proposta:</b>` em células. `Medidas` em `dl.spec`; `Faça e não faça` com um exemplo de cada (texto, ou SVG
  de `downloads/` já existente). Link para "Três medidas" e "Formas derivadas".
- [ ] **Step 2: Tamanho mínimo.** Regra com o menor tamanho em tela (px) e impresso (mm), `<b>proposta:</b>`,
  justificado pela menor medida legível (¼ de célula, "Três medidas"). Símbolo e horizontal separados se diferirem.
- [ ] **Step 3: Entradas** em `sistema.json`: `sub` terminado em ` (proposta)`.
- [ ] **Step 4: Conferir.** `python3 sistema.py` sem erro (molde e links); `grep -c 'Proposta, aguarda decisão' logotipo.html` → 2.
- [ ] **Step 5: Record**: seção "Logotipo" (o que foi escrito, de onde veio cada valor) e "Perguntas" (cada
  `proposta:` numa linha).
- [ ] **Step 6: Commit** `docs(logotipo): área de proteção e tamanho mínimo (proposta)`.

### Task 2: Grid e espaço

**Files:**
- Create: `capitulos/grid-e-espaco/1-celula.html`, `2-margens.html`, `3-espacamento.html`
- Modify: `sistema.json` (capítulo `grid-e-espaco` ganha `"molde": true` e três entradas), record (seção "Grid e espaço", "Perguntas")

**Interfaces:**
- Produces: ids `s-celula`, `s-margens`, `s-espacamento`.

- [ ] **Step 1: Célula.** A célula como unidade de tudo (link para "A ideia" e "Três medidas"); valor por meio:
  site `--cell: 44px` (`tokens/spacing.css`), apresentação (trama de célula 12 em 1324 px, `templates/apresentacao/README.md`);
  A4 só se o template documentar, senão `<b>proposta:</b>`.
- [ ] **Step 2: Margens.** ½ célula entre arte e borda (link para `#s-area-de-protecao` da Tarefa 1); margem de página
  por meio, citando o que os templates já usam; o que faltar, `<b>proposta:</b>`.
- [ ] **Step 3: Espaçamento.** Os dois sistemas de `tokens/spacing.css` (interface em px sem grade 4/8; deslocamentos
  de forma só em célula, ½ e ¼). Tabela dos `--space-*` em `dl.spec` ou link para `tokens/lina.tokens.json`, não os dois.
- [ ] **Step 4: Conferir.** `python3 sistema.py`; `grep -c '<section id="s-' grid-e-espaco.html` → 3; "em breve" some
  do sumário para Grid.
- [ ] **Step 5: Record** e **commit** `docs(grid): célula, margens e espaçamento (proposta)`.

### Task 3: Fotografia (Imagem)

**Files:**
- Create: `capitulos/imagem/2-fotografia.html`
- Modify: `sistema.json` (capítulo `imagem` ganha `"molde": true`; entrada "Fotografia" antes do "Filtro de pontilhado"), record

- [ ] **Step 1: Fotografia.** Regra de direção de foto, `<b>proposta:</b>` (assunto: pessoas e lugares do laboratório;
  luz natural; sem filtro de cor que brigue com a paleta), `Por quê` ligado a "Das relações, o grupo", `Faça e não
  faça` só em texto (sem fotos), link para o filtro (`#s-filtro-de-pontilhado`) como o tratamento gráfico da marca e
  para "Cores". Nota no record: fotos de exemplo esperam curadoria do dono.
- [ ] **Step 2: Conferir.** `python3 sistema.py` (o filtro já é `livre`, segue passando com `molde`).
- [ ] **Step 3: Record** e **commit** `docs(imagem): fotografia (proposta)`.

### Task 4: Voz e texto (capítulo novo)

**Files:**
- Create: `capitulos/voz-e-texto/1-tom.html`, `2-tratamento.html`, `3-numeros-e-datas.html`, `4-nomes-e-siglas.html`
- Modify: `sistema.json` (capítulo `{"id": "voz-e-texto", "parte": "II", "nome": "Voz e texto", "desc": "Tom, tratamento, números e nomes nos textos do LINA.", "molde": true}` depois de `tipografia`; quatro entradas), record

**Interfaces:**
- Produces: página `voz-e-texto.html`; ids `s-tom`, `s-tratamento`, `s-numeros-e-datas`, `s-nomes-e-siglas`.

- [ ] **Step 1: Escrever** com as skills `design:ux-copy` e `humanizer`. Fonte: o tom que o site já usa (direto, sem
  exclamação, "você"), "Detalhes" de Tipografia (link, não repetir caixa e sinais), nome oficial do laboratório
  (`SKILL.md`, linha `description`). Datas: formato `<b>proposta:</b>`. Cada seção no molde, com `Como pedir` →
  `Agente` (frase que um agente usa para escrever no tom).
- [ ] **Step 2: Conferir.** `python3 sistema.py`; capítulo aparece entre Tipografia e Grid; Grid passa a 6.
- [ ] **Step 3: Renumeração.** `grep -rnE '\b(5|6|7|8|9|10|11)\.[0-9]+\b' capitulos/ SKILL.md README.md llms.txt` e conferir
  cada ocorrência: número dentro de `<a href="…#s-…">` é reescrito pelo `sistema.py`; número solto escrito à mão
  vira link ou é corrigido. Registrar no record o que mudou.
- [ ] **Step 4: Record** e **commit** `docs(voz): capítulo voz e texto (proposta)`.

### Task 5: Acessibilidade (Princípios)

**Files:**
- Create: `capitulos/principios/3-acessibilidade.html`
- Modify: `sistema.json` (entrada depois de "Das relações, o grupo"), record

**Interfaces:**
- Consumes: `s-tamanho-minimo` (Tarefa 1), seções de contraste de Cores e "Hierarquia" de Tipografia.

- [ ] **Step 1: Escrever** no formato de `1-principios.html` (capítulo sem molde): `h2`, `p.cap` de proposta,
  `ul.regras` com regras curtas, cada uma com link para onde o valor mora: contraste (Cores), letra mínima
  (`<b>proposta:</b>` se Tipografia não fixa), texto alternativo em imagem e ícone, cor nunca como único sinal,
  foco visível e alvo de 44 px no site.
- [ ] **Step 2: Conferir** `python3 sistema.py`; **commit** `docs(principios): acessibilidade (proposta)`.

### Task 6: Verificação e decisão do dono

Feita pelo controlador (`CLAUDE.md` §8). Renders podem ser delegados.

- [ ] **Step 1: Checagens.** `python3 sistema.py`, `node --test "ferramentas/test/*.test.mjs"` (95),
  `node ferramentas/tokens.mjs --check` (0).
- [ ] **Step 2: Índices.** `SKILL.md` (linhas 3, 11 e 30: tirar "em breve" de grid e imagem, citar `voz-e-texto.html`)
  e `llms.txt` regenerado sem "(em breve)" para Grid e Imagem.
- [ ] **Step 3: Revisão** com `design:design-critique` e `humanizer` sobre as páginas novas; achado de texto corrigido,
  de gosto vira pergunta no record.
- [ ] **Step 4: Renders** 1280 e 390 px de `logotipo.html`, `grid-e-espaco.html`, `imagem.html`, `voz-e-texto.html`,
  `principios.html` em `records/11-render/` (método do 10).
- [ ] **Step 5: Dono.** Mostrar renders e a lista "Perguntas". Cada resposta: valor aplicado e a marca de proposta
  sai da seção decidida. O que o dono não decidir segue proposta. Registrar no record e no `progress.md`.

```bash
git add docs/superpowers/plans/2026-11-26-revisao-site/records/11-conteudo-novo.md docs/superpowers/plans/2026-11-26-revisao-site/records/11-render SKILL.md
git commit -m "docs(conteudo): verificação e decisões do dono"
```
