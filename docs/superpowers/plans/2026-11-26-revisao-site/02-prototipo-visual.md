# 02 — Protótipo visual B1 da página Logotipo: plano de implementação

> **Para agentes:** sub-skill obrigatória: `superpowers:subagent-driven-development` (recomendada)
> ou `superpowers:executing-plans`. Passos em caixas (`- [ ]`). Ao terminar cada tarefa,
> atualizar `progress.md` (ver o próprio arquivo).

**Objetivo:** uma versão da página Logotipo no visual B1 (manual de construção), renderizada em
desktop e celular ao lado da página atual, para o dono aprovar antes de o visual ir para o resto
do site (subplanos 04 e 05).

**Arquitetura:** o site real não muda. `sistema.py` continua gerando `1-logotipo.html` como hoje;
um script copia essa página para `prototipo-logotipo.html` e acrescenta uma folha só do protótipo,
`prototipo/b1.css`, carregada depois de `site.css`. Toda a mudança visual mora nessa folha. Um
segundo script tira capturas de página inteira com o Chrome sem janela.

**Stack:** CSS puro, `sh`, Google Chrome (`/Applications/Google Chrome.app`) em modo headless,
Python 3 com Pillow (já instalado) só para aparar a sobra no fim da captura.

**Spec:** [`../../specs/2026-11-26-revisao-site-diagnostico.md`](../../specs/2026-11-26-revisao-site-diagnostico.md),
seções 1 (D1–D6), 3.B (B1) e "Decisões".

## Restrições globais

- Não editar `site.css`, `sistema.py`, `sistema.json` nem os fragmentos em `capitulos/`. O
  protótipo é a folha nova mais a cópia gerada. Se algo só se resolve mudando o fragmento,
  anotar no record para o 05 e contornar na folha.
- `!important` permitido em `prototipo/b1.css` só para vencer estilo inline dos fragmentos;
  cada uso leva comentário `/* inline do fragmento; o 05 move para o fragmento */`.
- Cores: só os tokens de `tokens/colors.css`, mais branco `#fff` como fundo da interface
  (chamada do spec) e transparências de umbro (`rgba(42,26,18,a)`) para fios e texto
  secundário. Nenhuma cor nova.
- Raio: só `0` ou `var(--radius-cell)` (¼ de célula). Nenhuma sombra de cartão.
- Medidas de leiaute em múltiplos de `var(--cell-half)` (22 px) sempre que der: margens,
  espaço entre seções, preenchimento de prancha.
- Fontes: as que já existem (Outfit e JetBrains Mono). Nada de fonte nova.
- O logo continua desenhado por `lina-geometry.js` / `lina-draw.js` e pelos SVG de
  `assets/logos/`; a folha só muda tamanho e moldura, nunca a forma nem a cor do "A".
- Imagens e SVG nunca distorcidos: mudar uma dimensão com a outra em `auto`.

## Critérios do B1 (o que a folha tem de entregar)

Tirados do spec (B1 e D1–D6). A tarefa 3 confere cada um.

1. **Fundo neutro.** `body` e barra lateral brancos. Creme, areia, nata e ferro só aparecem
   como cores de marca dentro de pranchas (exemplos), nunca como superfície da interface.
2. **Ferro é acento.** Ferro só em: rótulos pequenos (`.k`, `h3`), item atual do sumário,
   foco e hover de link, e o próprio logo. `h1`, `h2`, número de seção e links em repouso
   ficam em umbro.
3. **Grade visível.** A retícula de meia célula (22 px) aparece no fundo das pranchas e numa
   faixa da margem da página, em fio fino de baixo contraste. Texto corrido nunca fica sobre a
   retícula.
4. **Sem cartões.** Nenhuma fileira de caixas iguais arredondadas. `.dl` (Baixar) vira lista
   com fios, não cartões. Raio só ¼ de célula ou zero.
5. **Número de seção grande em mono**, à maneira do manual da NASA: pelo menos 3× o corpo,
   umbro, alinhado à grade. O fio sob o título sai (o número já separa as seções).
6. **Corpo legível.** Outfit 400, 17 px, entrelinha ≥ 1,5, linha de texto de no máximo 70ch.
   Exemplos ocupam a largura toda do `main` (a metade vazia à direita some).
7. **Logo em escala grande.** Em 1.7, o horizontal com pelo menos metade da largura do `main`
   no desktop; pranchas de 1.6 e 1.8 maiores que hoje.
8. **Celular (390 px).** Página sem rolagem horizontal; exemplos encolhem por largura, sem
   corte; sumário recolhido como hoje.
9. **Acessibilidade.** Contraste de texto ≥ 4,5:1 sobre o fundo real (inclusive texto
   secundário com transparência); foco visível em todo link; alvos de toque do sumário
   ≥ 44 px de altura no celular.

## Foco de revisão

1. Texto secundário em umbro com transparência sobre branco: medir a razão, não supor.
2. Retícula atrás de texto (falha do critério 3) e retícula desalinhada da célula real dos
   diagramas (a página usa `s=44` nos scripts; a retícula tem de casar com essa célula).
3. Estilo inline de fragmento que vence a folha e deixa um exemplo no tamanho antigo.
4. SVG ou `<img>` esticado ao forçar largura (critério 7 sem `height:auto`).
5. Página atual (`1-logotipo.html`) mudou: comparar o render "antes" do início e do fim.

---

### Tarefa 1: montagem e render

**Arquivos:**
- Criar: `prototipo/montar.sh`, `prototipo/render.sh`, `prototipo/aparar.py`,
  `prototipo/b1.css` (vazio, só o comentário de cabeçalho)
- Modificar: `.gitignore` (acrescentar `/prototipo-*.html` e `prototipo/render/`)

**Interfaces:**
- `sh prototipo/montar.sh`: roda `python3 sistema.py` e escreve `prototipo-logotipo.html` na
  raiz (mesma pasta de `1-logotipo.html`, para os caminhos relativos funcionarem), igual a
  `1-logotipo.html` com duas diferenças: `<link rel="stylesheet" href="prototipo/b1.css">`
  logo depois do `site.css`, e `<title>` com o sufixo ` · protótipo B1`.
- `sh prototipo/render.sh <arquivo.html> <nome>`: escreve
  `prototipo/render/<nome>-desktop.png` (viewport 1440 px) e
  `prototipo/render/<nome>-celular.png` (viewport 390 px), página inteira. Chrome headless
  com `--screenshot`, `--window-size=<largura>,<altura grande>`, `--hide-scrollbars`,
  `--virtual-time-budget=8000` (scripts dos diagramas e fontes); depois
  `python3 prototipo/aparar.py <png>` corta as linhas finais iguais ao fundo.
- `aparar.py`: Pillow; recorta embaixo, nunca redimensiona.

- [ ] **Passo 1:** escrever os quatro arquivos e a linha do `.gitignore`.
- [ ] **Passo 2:** `sh prototipo/montar.sh` e conferir com `diff 1-logotipo.html prototipo-logotipo.html`:
  só as duas linhas mudam.
- [ ] **Passo 3:** `sh prototipo/render.sh 1-logotipo.html antes` e
  `sh prototipo/render.sh prototipo-logotipo.html b1`. Abrir os quatro PNG: diagramas
  desenhados (não vazios), fonte Outfit carregada, nada cortado no fim. Com o `b1.css` vazio,
  `antes-*` e `b1-*` têm de ser iguais.
- [ ] **Passo 4:** commit `feat(prototipo): montagem e render da página Logotipo`.

### Tarefa 2: folha B1

**Arquivos:**
- Modificar: `prototipo/b1.css`

Sub-skill: `frontend-design:frontend-design` para o método. As regras do LINA (`SKILL.md`,
`README.md`, as restrições acima) vencem qualquer gosto da skill.

Ler antes: `site.css` (o que está sendo sobrescrito), `tokens/spacing.css`, `tokens/radius.css`,
`tokens/colors.css`, os fragmentos de `capitulos/1-logotipo/` (estilos inline e tamanhos
fixados nos scripts) e o render `prototipo/render/antes-desktop.png`.

- [ ] **Passo 1:** fundação: superfície branca, cores de texto, corpo (critérios 1, 2, 6),
  raio e cartões (4), barra lateral branca com o sumário, foco visível (9).
- [ ] **Passo 2:** seção e pranchas: número grande em mono (5), retícula em pranchas e na
  margem (3), exemplos na largura toda e logo grande (6, 7), `.dl` em lista.
- [ ] **Passo 3:** celular (8, 9): media query de 820 px já existente como ponto de corte.
- [ ] **Passo 4:** `sh prototipo/montar.sh && sh prototipo/render.sh prototipo-logotipo.html b1`;
  olhar os dois PNG e corrigir até os critérios 1–8 se verem na imagem. No celular, conferir
  a rolagem horizontal pelo navegador:
  `document.scrollingElement.scrollWidth <= innerWidth` em 390 px.
- [ ] **Passo 5:** `git diff --stat` mostra só `prototipo/b1.css`. Commit
  `feat(prototipo): folha B1 da página Logotipo`.

### Tarefa 3: revisão de design e acessibilidade

**Arquivos:**
- Criar: `docs/superpowers/plans/2026-11-26-revisao-site/records/02-revisao.md`
- Modificar: `prototipo/b1.css` (correções)

- [ ] **Passo 1:** revisor sem o contexto da tarefa 2, com `design:design-critique` e
  `design:accessibility-review`, recebe os PNG `antes-*` e `b1-*`, `prototipo/b1.css`, a lista
  de critérios 1–9 e o foco de revisão. Devolve uma linha por achado:
  `critério ou foco | arquivo:linha ou região do PNG | problema | correção`.
- [ ] **Passo 2:** medir contrastes do critério 9 por script (razão WCAG dos pares reais,
  compondo a transparência sobre o branco) e anexar ao record.
- [ ] **Passo 3:** corrigir os achados que ferem critério; os de gosto vão para o record como
  pergunta ao dono, sem aplicar.
- [ ] **Passo 4:** montar e renderizar de novo; `antes-*` regerado igual ao da tarefa 1
  (a página atual não mudou). Commit `fix(prototipo): revisão de design e acessibilidade`.

### Tarefa 4: aprovação do dono

- [ ] **Passo 1:** mostrar ao dono `antes-desktop`, `b1-desktop`, `antes-celular`,
  `b1-celular` e as perguntas de gosto do record. Pedir aprovação, ajuste ou outra direção.
- [ ] **Passo 2:** ajustes pedidos: aplicar, renderizar, mostrar de novo (repetir).
- [ ] **Passo 3:** aprovado: memória `memoria/visual-b1.md` (tipo `regra`) com as decisões
  visuais que valem para o 05 (o que o dono aprovou, recusou ou ajustou), linha no índice
  `memoria/README.md`, `progress.md` atualizado. Commit `docs(memoria): visual B1 aprovado`.

O plano só fica completo com a aprovação. Sem ela, 04 e 05 continuam bloqueados.
