# 04 — Estrutura em quatro partes, molde único de seção, redirecionamentos: plano de implementação

> **Para agentes:** sub-skill obrigatória: `superpowers:subagent-driven-development`.
> Passos em caixas (`- [ ]`). Ao terminar cada tarefa, atualizar `progress.md`.

**Objetivo:** o site passa a ter quatro partes (I Princípios, II Fundamentos, III Aplicações,
IV Ferramentas e recursos), capítulos numerados pela ordem, arquivos sem número, home como
porta de entrada, links antigos redirecionados, e um molde único de seção definido e
aplicado no capítulo Logotipo.

**Arquitetura:** `sistema.json` ganha `partes`, capítulos com `id` em slug (o id é o nome do
arquivo) e `parte`, entradas sem número no nome. `sistema.py` calcula os números pela
ordem, agrupa o sumário e o mapa por parte, gera as páginas de redirecionamento a partir de
`antigos`, reescreve o texto de link que for só número de seção e confere o molde nos
capítulos marcados. Fragmentos continuam em `capitulos/`, em pastas sem número.

**Spec:** [`../../specs/2026-11-26-revisao-site-diagnostico.md`](../../specs/2026-11-26-revisao-site-diagnostico.md),
A1, O2, O5, D7 e "Renumeração".

**Decisões do dono (2026-11-27):** numeração contínua com arquivo sem número; molde definido
mais piloto só no Logotipo (resto no 05); home = porta de entrada e Preâmbulo vira o
capítulo Princípios com 3–4 princípios em rascunho de proposta; parte IV com página-índice
Recursos agora (ferramentas interativas no 06).

## Restrições globais

- Nenhuma dependência nova. Python 3.13, Node 26.
- Visual não muda (o 05 aplica o B1). Só o CSS mínimo do molde em `site.css`.
- Nenhuma regra nova inventada: o piloto reorganiza texto existente. Princípios entram
  marcados como proposta.
- Ids de seção (`s-<nome>`) não mudam: o redirecionamento preserva `#âncora`.
- `docs/superpowers/plans/done/` e `.superpowers/` são histórico: não atualizar caminhos lá.
- Textos para pessoas em português do Brasil; identificadores em inglês ou português como já estão.

## Estrutura nova

| N | `id` (arquivo `<id>.html`) | Parte | Nome | Fragmentos |
| --- | --- | --- | --- | --- |
| 1 | `principios` | I Princípios | Princípios | `1-principios.html` (novo), `2-das-relacoes-o-grupo.html` (do 0) |
| 2 | `logotipo` | II Fundamentos | Logotipo | os 8 do 1 |
| 3 | `cores` | II | Cores | os 8 do 2 |
| 4 | `tipografia` | II | Tipografia | os 5 do 5 |
| 5 | `grid-e-espaco` | II | Grid e espaço | nenhum ("em breve", conteúdo no 07) |
| 6 | `padroes` | II | Padrões | os 6 do 3 + `7-o-campo-animado.html`, `8-opcoes-de-cor.html` (do 4) |
| 7 | `imagem` | II | Imagem | nenhum ("em breve", conteúdo no 07) |
| 8 | `icones` | II | Ícones | os 5 do 6 |
| 9 | `componentes` | III Aplicações | Componentes | os 9 do 7 |
| 10 | `templates` | III | Templates | os do 8 |
| 11 | `recursos` | IV Ferramentas e recursos | Recursos | `1-baixar.html`, `2-para-agentes.html` (novos) |

Home (`index.html`): fragmento `capitulos/inicio.html` + mapa por parte.
Redirecionamentos: `1-logotipo.html`→`logotipo.html`, `2-cores.html`→`cores.html`,
`3-padroes.html` e `4-animacao.html`→`padroes.html`, `5-tipografia.html`→`tipografia.html`,
`6-icones.html`→`icones.html`, `7-componentes.html`→`componentes.html`,
`8-templates.html`→`templates.html`. `index.html#s-…` sem alvo na home vai para
`principios.html#s-…`.

## Molde de seção

Vale para capítulo com `"molde": true` em `sistema.json`; entrada com `"livre": true` fica fora.

```html
<h2>Título</h2>
<p class="regra">Uma frase normativa.</p>          <!-- obrigatória, uma só -->
<h3>Por quê</h3> …                                  <!-- os h3 abaixo são opcionais, nesta ordem -->
<h3>Medidas</h3> …                                  <!-- dl.spec ou ul.regras -->
<h3>Faça e não faça</h3>
<div class="faca-nao"><div class="faca">…</div><div class="nao">…</div></div>
<h3>Como pedir</h3> <dl class="spec"><dt>Agente</dt><dd>…</dd><dt>Slide</dt>…<dt>Word</dt>…<dt>LaTeX</dt>…</dl>
```

Figuras de exemplo podem vir entre a regra e o primeiro `h3`.

## Foco de revisão

1. Link antigo com âncora (`3-padroes.html#s-monocromaticos`, `4-animacao.html#s-o-campo-animado`,
   `index.html#s-das-relacoes-o-grupo`) chega na seção certa, com e sem JavaScript (sem JS a
   âncora pode se perder; a página certa basta).
2. Texto de link que era número (`<a href="…#s-composicoes">5.5</a>`) mostra o número novo;
   número de seção escrito sem link em fragmento ou `SKILL.md` não fica velho.
3. Nenhum caminho `capitulos/<n>-…` ou `<n>-<nome>.html` vivo fora do histórico
   (`img src`, `_gerar.py`, `_recortes.sh`, workflow, `prototipo/montar.sh`, `SKILL.md`, memórias).
4. Capítulo vazio aparece como "em breve" no sumário, no mapa e no `llms.txt` sem quebrar.
5. Checagem do molde falha com mensagem útil (arquivo e motivo) e não pega capítulo sem `molde`.

---

## Tarefa 1 — reestruturar `sistema.json`, `sistema.py` e pastas

Arquivos: `sistema.json`, `sistema.py`, `.gitignore`, `capitulos/*` (git mv), `site.css`
(só sumário por parte), `.github/workflows/site.yml`, `capitulos/*/_gerar.py`,
`capitulos/componentes/_recortes.sh`, `prototipo/montar.sh`, fragmentos com `img src` ou
`href` velhos.

- [ ] Branch `revisao-site/04-estrutura` a partir da `main`.
- [ ] `git mv` das pastas: `0-preambulo`→`principios` (fragmento vira `2-das-relacoes-o-grupo.html`),
  `1-logotipo`→`logotipo`, `2-cores`→`cores`, `3-padroes`→`padroes`, `4-animacao/*` para
  `padroes/7-…` e `padroes/8-…` (mesmo nome após o número), `5-tipografia`→`tipografia`,
  `6-icones`→`icones`, `7-componentes`→`componentes`, `8-templates`→`templates`.
- [ ] Stubs (um `<h2>` + `<p>` "Em escrita."): `capitulos/inicio.html`,
  `capitulos/principios/1-principios.html`, `capitulos/recursos/1-baixar.html`,
  `capitulos/recursos/2-para-agentes.html`. A tarefa 2 preenche.
- [ ] `sistema.json`: `partes: [{id:"I",nome:"Princípios"},{id:"II",nome:"Fundamentos"},
  {id:"III",nome:"Aplicações"},{id:"IV",nome:"Ferramentas e recursos"}]`; capítulos da
  tabela com `id`, `parte`, `nome`, `desc` (descs atuais; Princípios "O conceito da marca e
  os princípios que guiam as decisões."; Padrões "Pontilhado, dispersão e campo, parados e em
  movimento."; Grid e espaço "Célula, margens e espaçamento."; Imagem "Fotografia e o filtro
  de pontilhado."; Recursos "Downloads, arquivos para agentes e linha de comando num só
  lugar."); `"molde": true` só em `logotipo`; `inicio: "capitulos/inicio.html"`;
  `antigos: {"1-logotipo.html": "logotipo.html", …}` (tabela acima); entradas com
  `cap` = id do capítulo e `nome` sem o número; `_leia` atualizado.
- [ ] `sistema.py`:
  - página do capítulo = `<id>.html`; número do capítulo = posição (1-based); número da
    seção = `<cap>.<posição no capítulo>`, mostrado no `p.num`, no sumário, no mapa e no
    `llms.txt` (`## <n> · <nome>`).
  - sumário e mapa agrupados por parte (rótulo `I · Princípios` antes dos capítulos dela);
    vizinhos ←/→ seguem a ordem dos capítulos.
  - `index.html` = `inicio` + mapa; título "Sistema LINA"; script: se `location.hash` não
    tem alvo na página, `location.replace('principios.html' + location.hash)`.
  - link entre seções: aceitar `href="<id>.html#s-…"`; texto do `<a>` que for só número
    (`^\d+\.\d+$`) vira o número da seção alvo.
  - para cada par de `antigos`: escrever a página velha com `<meta http-equiv="refresh"
    content="0;url=<novo>">`, `<link rel="canonical">`, script
    `location.replace('<novo>' + location.hash)` e um link visível. Imprimir
    `N redirecionamentos`.
  - `AGENTES`/resumo do `llms.txt` iguais.
- [ ] Trocar todo `capitulos/<n>-<nome>/` e `<n>-<nome>.html` vivo pelos novos (lista do
  foco 3). `prototipo/montar.sh` passa a ler `logotipo.html`; o `sed` do link `5.5` vira o da
  composição com o número novo.
- [ ] `.gitignore`: `/*.html` no lugar de `/index.html` e `/[0-9]-*.html` e `/prototipo-*.html`;
  `capitulos/templates/1-apresentacao.html` no lugar do caminho velho.
- [ ] `site.css`: rótulo de parte no sumário e no mapa (mono pequeno, sem cor nova).

Verificar: `python3 capitulos/templates/_gerar.py && python3 sistema.py` sem erro e com
`8 redirecionamentos`; `grep -rnE 'capitulos/[0-9]-|[0-9]-(logotipo|cores|padroes|animacao|tipografia|icones|componentes|templates)\.html' --exclude-dir={node_modules,_obsoletos,.git,.superpowers} --exclude-dir=done . | grep -v '^./docs/superpowers/'`
só mostra `sistema.json` (`antigos`) e as páginas de redirecionamento; todo `src="capitulos/…"`
dos fragmentos existe (one-liner no relatório); `node --test "ferramentas/test/*.test.mjs"` passa.

## Tarefa 2 — conteúdo novo: home, Princípios, Recursos

Depende de 1. Arquivos: `capitulos/inicio.html`, `capitulos/principios/1-principios.html`,
`capitulos/recursos/1-baixar.html`, `capitulos/recursos/2-para-agentes.html`. Não editar
`sistema.json`.

- [ ] `inicio.html`: uma frase do que é o LINA e o site; "Por onde começar" com 4 a 6 links
  diretos para seções que já existem (baixar o logo, fazer apresentação, documento A4,
  cores, gerar padrão, para agentes). Nada de cartões em fileira: lista.
- [ ] `1-principios.html`: aviso "Proposta, aguarda decisão" no topo; 3 ou 4 princípios de
  uma frase cada, tirados do Preâmbulo e do Logotipo (ex.: "toda forma é união de
  células"), cada um com link para a seção de onde vem. Nenhum valor novo.
- [ ] `1-baixar.html`: um item por "Baixar" que existe hoje no site, com link para a seção
  dele (não copiar os botões nem a versão da release).
- [ ] `2-para-agentes.html`: `SKILL.md`, `llms.txt`, `tokens/lina.tokens.json`,
  `assets/lina-palette.js`, `sistema.json` e os comandos de `ferramentas/` (copiar do
  `SKILL.md`, sem inventar opção).

Verificar: `python3 sistema.py` sem link quebrado; cada link novo abre a seção certa.

## Tarefa 3 — molde de seção e piloto no Logotipo

Depende de 1. Paralela à 2. Arquivos: `sistema.py` (só a checagem), `site.css` (só o
molde), `capitulos/logotipo/*.html`, `docs/guidelines/molde-de-secao.md`.

- [ ] `sistema.py`: para capítulo com `molde`, cada entrada sem `livre` tem exatamente um
  `<p class="regra">` e seus `<h3>` estão em `["Por quê", "Medidas", "Faça e não faça",
  "Como pedir"]`, nessa ordem. Falha: `molde: <arquivo>: <motivo>`, saída 1.
  Conferir que falha: copiar um fragmento sem `p.regra`, rodar, ver a mensagem, desfazer.
- [ ] `site.css`: `p.regra` (corpo maior, peso 500), `.faca-nao` em duas colunas (uma no
  celular) com rótulos "Faça" / "Não faça" por CSS, sem cor nova.
- [ ] Converter as 8 seções do Logotipo ao molde, só reorganizando o texto que existe.
  Seção conceitual sem regra possível: `"livre": true` na entrada (registrar o motivo no
  relatório). "Como pedir → Agente" aponta `assets/lina-geometry.js` e os comandos do
  `SKILL.md`. Diagramas e scripts dos fragmentos ficam intactos.
- [ ] `docs/guidelines/molde-de-secao.md`: o bloco do molde acima, quando usar `livre`,
  sinônimos proibidos ("Não fazer", "Não recomendáveis", "a evitar" viram "Faça e não faça").

Verificar: `python3 sistema.py` passa; `diff` do texto visível antes/depois do Logotipo
(sem tags) mostra só movimento, nenhuma frase nova além de rótulos; render desktop e
celular com `prototipo/render.sh` (ou `pdftoppm` de print) em `records/04-piloto/`.

## Tarefa 4 — referências e números soltos

Depende de 1. Paralela a 2 e 3. Arquivos: `SKILL.md`, `README.md`, `memoria/*.md`,
`templates/apresentacao/README.md`, fragmentos fora de `capitulos/logotipo/`.

- [ ] `SKILL.md`: páginas novas, partes, Recursos; trocar "capítulo N" e "(2.4)" por nome de
  página + âncora (número muda, âncora não). Limite de 90 linhas mantido.
- [ ] Número de seção escrito sem link em fragmento (ex.: "ver 2.5"): virar
  `<a href="cores.html#s-…">2.5</a>` (o `sistema.py` corrige o número).
- [ ] Memórias e READMEs com caminho velho: atualizar (`ds-capitulos-paginas` descreve a
  estrutura nova em quatro partes, home porta de entrada).

Verificar: grep do foco 3 limpo; `python3 sistema.py` passa; caminhos citados no
`SKILL.md` existem.

## Tarefa 5 — verificação, revisão e aprovação do piloto

- [ ] `python3 capitulos/templates/_gerar.py && python3 sistema.py`,
  `node --test "ferramentas/test/*.test.mjs"`, `node ferramentas/tokens.mjs --check`.
- [ ] Servidor local; abrir cada link do foco 1 e conferir a seção; home, sumário por parte,
  capítulos vazios, celular (390 px).
- [ ] Revisão do diff (cavecrew-reviewer, sonnet) contra o foco de revisão.
- [ ] Mostrar ao dono o render do piloto e a proposta de princípios; registrar decisão.
  Record: `records/04-estrutura.md`.

Verificar: checagens passam; achados corrigidos ou registrados; molde aprovado (ou
ajustes anotados para o 05).
