# 06 — Ferramentas no site: plano de implementação

> **Para agentes:** sub-skill obrigatória: `superpowers:subagent-driven-development`.
> Passos em caixas (`- [ ]`). Ao terminar cada tarefa, atualizar `progress.md`.

**Objetivo:** as três interfaces do `lina-visual-code` passam a viver dentro do fundamento que
servem (C1): gerador de padrões em Padrões, filtro de pontilhado em Imagem, editor de células
em Logotipo. Recursos lista as três. Visual B1, fonte Outfit, cores só da paleta.

**Arquitetura:** cada ferramenta é uma seção comum (fragmento inline, sem iframe) que carrega
um script próprio em `assets/`. O que as três dividem (estado na URL, comando equivalente,
baixar e copiar SVG) fica em `assets/lina-ferramenta.js`, testado em Node. As ferramentas de
padrão e imagem chamam só `fromParams`/`render` dos motores; a URL guarda os parâmetros com os
mesmos nomes e unidades do `fromParams` e das linhas de comando (contrato do spec). O editor
de células usa `LinaGeometry.outlinePath`, como no original. Controles ganham um bloco
`/* ferramentas */` no fim de `site.css`.

**Spec:** [`../../specs/2026-11-26-revisao-site-diagnostico.md`](../../specs/2026-11-26-revisao-site-diagnostico.md),
"Decisões" (C1, gerador de logo) e seção C. Origem das interfaces:
`~/Developer/lina-visual-code/{texture,image,grid}.html` (ler antes de portar; não copiar
`lina.css`, Neometric nem as cores antigas).

**Decisões do dono:** C1 (2026-11-26). Parâmetros pedidos: cores só da paleta, tamanho do
canvas, quantidade de cores, variação de distribuição (modo, semente, vazio, aglomeração
etc.), salvar em SVG. Gerador de logo = editor de células, abre com o letreiro LINA, células
móveis, regra aplicada pelo traçador e não bloqueada.

**Chamadas minhas, a conferir com o dono** (não bloqueiam; registrar a resposta no record):
1. Só SVG. Sem PNG e sem fundo transparente: o spec pede SVG e `render` não tem esses modos.
2. Sem o modo `glyphs` e sem raio livre: `fromParams` recusa `glyphs` e fixa o raio em ¼.
3. Imagem sem "Usar exemplo": o `lina-sample.js` (190 kB) não veio. Só enviar, soltar ou colar.
4. Editor de células: cor escolhida entre os 12 tokens, padrão `ferro`; estado só no
   `localStorage`, como no original (o editor não tem motor nem linha de comando).
5. Posições: Padrões 6.9 "Gerador", Imagem 7.1 "Filtro de pontilhado", Logotipo 2.10 "Editor
   de células" (Baixar passa a 2.11), Recursos 11.3 "Ferramentas".

## Restrições globais

- Nenhuma dependência nova. Node 26, Python 3.13, Chrome. Sem framework, sem build de JS.
- Scripts no padrão dos motores: IIFE com global `window.LinaX`, carregável em Node por
  `require`. Fragmentos rodam no escopo da página: código em bloco `{ … }`, ids com prefixo
  da ferramenta (`gp-`, `fi-`, `ec-`).
- Cores só por nome de token (`LinaPalette.COLORS`). Nenhum hex no fragmento nem no script.
- Interface: Outfit e tokens que `site.css` já usa (`--t2`, `--fio-b1`, `--ferro`, `--creme`,
  `--cell-half`). Ferro só em rótulo pequeno, estado atual e foco (`memoria/visual-b1.md`).
  Alvos de 44 px no celular. Prévia em `.prancha` lisa, sem retícula.
- Imagem e SVG nunca distorcidos: uma dimensão fixa, a outra `auto`.
- A foto do filtro não sai do navegador nem vai para o `localStorage`.
- Seções novas em capítulo com molde: `"livre": true`, motivo "ferramenta; nenhuma regra
  nova". Texto: uma frase de explicação antes da ferramenta, nenhuma regra inventada
  (`docs/guidelines/molde-de-secao.md`, `memoria/padrao-explicacao-download.md`).
- Rótulos dos controles: os do original em português, sem etiqueta de estado.
- Em tarefa paralela: não commitar (o controlador commita); não editar fora dos arquivos da
  tarefa; `sistema.json` e `site.css` só no próprio bloco.

## Foco de revisão

1. URL adulterada (`#seed=abc&blank=5&mode=glyphs&colors=xyz`): a página abre com os padrões
   e um aviso, sem exceção no console. Teste na tarefa 1.
2. Par de cores recusado por `LinaPalette.check` (ex.: um par de "a evitar"): aviso com o
   motivo, Baixar e Copiar desativados, prévia mantém o último válido. Teste na tarefa 2.
3. Foto grande (6000×4000), vertical ou arquivo que não é imagem: reduz a 1600 px no lado
   maior antes de `prepare`, sem travar e sem distorcer; arquivo inválido vira aviso. Tarefa 3.
4. Toque no celular (390 px): arrastar célula no editor funciona e não rola a página;
   fora da prévia a página rola normal (`touch-action: none` só no SVG do editor). Tarefa 4.
5. Só teclado: todo controle alcançável, botões de escolha com `aria-pressed`, foco visível,
   avisos em `role="status"`. Tarefa 5.

---

## Tarefa 1 — base comum: `lina-ferramenta.js` e estilo dos controles

Sequencial (as outras dependem dela).

**Arquivos:**
- Criar: `assets/lina-ferramenta.js`, `ferramentas/test/ferramenta.test.mjs`
- Modificar: `site.css` (bloco `/* ferramentas */` no fim)

**Interfaces (produz):** global `LinaFerramenta` com:
- `ESQUEMAS: { textura, imagem }`: por chave do `fromParams`, `{ tipo: 'num'|'int'|'bool'|'str'|'cores', min?, max?, valores?, padrao }`.
  Chaves de `textura`: `mode seed width height cells colors blank steps quarter clump grain
  stretch accent edges pinholes`. De `imagem`: `mode detail dither brightness contrast
  midtones cutoff smooth invert colors width`. Faixas e padrões copiados do `fromParams` e de
  `DEFAULTS` de cada motor; `colors` padrão `['creme','ferro']`.
- `lerHash(hash: string, esquema) -> { params, avisos: string[] }`: valor fora do tipo, da
  faixa ou de `valores` é descartado (fica o padrão) e gera um aviso com o nome da chave;
  chave desconhecida é ignorada sem aviso.
- `escreverHash(params, esquema) -> string`: `URLSearchParams`, `colors` unidas por vírgula,
  só chaves diferentes do padrão.
- `comando(qual: 'textura'|'imagem', params, foto = 'foto.jpg') -> string`: linha
  equivalente, ex. `node ferramentas/textura.mjs --mode field --seed 7 --colors creme,ferro
  --out textura.svg`; para imagem, `foto` como primeiro argumento. Booleana falsa vira `--no-x`.
- `baixar(nome: string, svg: string)`, `copiar(texto: string, status: Element)`: só navegador.

- [ ] **Passo 1: testes que falham** em `ferramenta.test.mjs` (`node:test`, carrega os motores
  por `createRequire` como `texture.test.mjs`):
  - `lerHash(escreverHash(p))` devolve `p` para um `p` com todas as chaves de `textura`.
  - `lerHash('#seed=abc&blank=5&mode=glyphs&colors=xyz&foo=1', ESQUEMAS.textura)`: params sem
    `seed`, `blank`, `mode` e `colors`; `avisos.length === 4`; não lança.
  - Para 3 conjuntos de params (um por modo, um com trio), rodar `comando('textura', p)` com
    `spawnSync` (sem `--out`) e comparar o stdout com `LinaTexture.render(p)`: idênticos.
  - Para 2 conjuntos (um por modo), `comando('imagem', p, <foto de cli.test.mjs>)` sem
    `--out` dá o mesmo stdout que `LinaImage.render` sobre a foto decodificada por
    `sharp()` de `_carregar.mjs` (mesma cadeia `rotate().ensureAlpha().raw()`).
- [ ] **Passo 2:** `node --test "ferramentas/test/*.test.mjs"`. Esperado: só os novos falham.
- [ ] **Passo 3:** implementar `assets/lina-ferramenta.js` e o bloco de CSS: `.ferramenta`
  (duas colunas no desktop, controles à esquerda e prévia à direita; uma coluna abaixo de
  820 px), `label`, `input[type=range|number]`, `select`, `button` e `button[aria-pressed]`,
  `.status`. Copiar a anatomia de `.seg`, `.range-row` e `.btn` do `lina-visual-code/lina.css`,
  trocando fonte e cores pelos tokens.
- [ ] **Passo 4:** testes passam; `python3 sistema.py` ok.
- [ ] **Passo 5:** commit `feat(ferramentas): base comum das ferramentas do site`.

## Tarefas 2, 3 e 4 — em paralelo, depois da 1

Cada uma: fragmento novo, script novo, entrada em `sistema.json`, um render de conferência
(`sh prototipo/render.sh <pagina>.html 06-<cap>`) e o relatório com o que ficou de fora do
original. O controlador confere no navegador (tarefa 5).

### Tarefa 2 — gerador de padrões (Padrões 6.9)

**Arquivos:** criar `capitulos/padroes/9-gerador.html`, `assets/lina-ui-textura.js`;
`sistema.json` (entrada `livre`).

**Consome:** `LinaFerramenta` (tarefa 1), `LinaTexture.render`, `LinaPalette.{COLORS,check,combos}`.

- Controles (nomes do `ESQUEMAS.textura`): Padrão `dither|scatter|field`; Semente + "Nova
  semente"; Formato `1:1 4:5 16:9 9:16` que preenche Largura e Altura (px, editáveis);
  Células na largura 4–120; Espaço vazio, Meios passos, Vãos de ¼, Aglomeração, Alongamento
  em 0–100 % na tela e fração na URL; Grão; Bordas `bleed|seamless|cut`; Preencher furinhos;
  Quantidade de cores 2|3, um `select` de token por cor (fundo, forma, destaque), "Sortear"
  tira de `combos('duo'|'trio')`; Formas de destaque só com 3 cores. Controle que não vale
  para o modo fica desativado, como no original.
- Prévia: `render(params)` em `.prancha`, largura 100 %, altura `auto`. Cada mudança grava
  `location.hash` (`replaceState`). Ao abrir, `lerHash` e avisos no `.status`.
- Ações: "Baixar SVG" (`lina-textura-<mode>-<seed>.svg`), "Copiar SVG", "Copiar link",
  "Copiar comando" (`comando('textura', params)`).
- Erro de `render` (par recusado): `.status` com a mensagem do motor; ações desativadas;
  prévia anterior fica. Verificar à mão com `colors` de um par de `LinaPalette.AVOID`.

### Tarefa 3 — filtro de pontilhado (Imagem 7.1)

**Arquivos:** criar `capitulos/imagem/1-filtro-de-pontilhado.html`, `assets/lina-ui-imagem.js`;
`sistema.json` (primeira entrada do capítulo `imagem`, que sai de "em breve").

**Consome:** `LinaFerramenta`, `LinaImage.render(imageData, params)`, `LinaPalette`.

- Entrada: "Enviar imagem" (`input type=file accept="image/*"`), soltar na prévia, colar.
  Decodificar por `createImageBitmap`, reduzir a 1600 px no lado maior num canvas
  proporcional, `getImageData`. Arquivo ilegível: aviso no `.status`. Sem foto: prévia com
  a frase "Envie, solte ou cole uma foto." e ações desativadas.
- Controles (`ESQUEMAS.imagem`): Filtro `dither|bitmap`; Detalhe; Pontilhamento
  `none|ordered|diffusion` (só bitmap); Brilho, Contraste, Meios-tons como −100…100 na tela
  e fração com 0,5 neutro na URL; Limpar claros; Suavizar; Inverter; Largura (px); cores:
  dois `select` de token + "Sortear" de `combos('duo')`. "Original ao lado" fica de fora.
- Prévia: `render(imageData, params)` em `.prancha`, `width:100%; height:auto`. Atualização
  com `requestAnimationFrame`, uma por quadro.
- Ações: "Baixar SVG" (`lina-imagem-<mode>.svg`), "Copiar SVG", "Copiar link" (só
  configurações), "Copiar comando".
- Uma frase antes da ferramenta: a foto não sai do navegador.

### Tarefa 4 — editor de células (Logotipo 2.10)

**Arquivos:** criar `capitulos/logotipo/10-editor-de-celulas.html`, `assets/lina-ui-celulas.js`;
renomear `capitulos/logotipo/10-baixar-logotipo.html` para `11-baixar-logotipo.html`
(`git mv`; id `s-baixar-logotipo` não muda); `sistema.json` (entrada `livre` antes do Baixar).

**Consome:** `LinaGeometry.{outlinePath,LETTERS,LETTER_GAP}`, `LinaPalette.COLORS`.

- Portar `grid.html` inteiro: modelo `{cols, rows, blocks:[{x,y,s}], brush, snap, showGrid,
  color}`, abre com o letreiro LINA centrado (`presetBlocks`), clicar adiciona, arrastar move
  com encaixe, botão direito e `Delete` apagam, setas movem, `Esc`, desfazer/refazer (300),
  marca de células fora do alinhamento de ¼ (`illegalBlocks`), "Carregar logotipo LINA",
  colunas 4–48 e linhas 3–32. Raio fixo em ¼ (tirar o controle).
- `color` vira nome de token (`select` dos 12, padrão `ferro`); hex só na hora de desenhar,
  via `COLORS`. `localStorage` com chave nova `lina-celulas-v1`, leitura em `try/catch`.
- Pointer events com `touch-action:none` só no SVG. No celular, apagar também por botão
  "Apagar célula" (não há botão direito).
- Ações: "Baixar SVG" (`lina-celulas.svg`, recorte ao contorno dos blocos, sem fundo),
  "Copiar SVG".

## Tarefa 5 — Recursos, verificação, acessibilidade, aprovação do dono

Sequencial, controlador.

- [ ] `capitulos/recursos/3-ferramentas.html` (11.3): as três com link para a seção e uma
  linha cada; em 11.2, nada muda. Entrada em `sistema.json`.
- [ ] `python3 sistema.py` ok; `node --test "ferramentas/test/*.test.mjs"` todos passam;
  `node ferramentas/tokens.mjs --check` 0.
- [ ] Navegador (preview `site`, porta 8765), desktop e 390 px, nas três ferramentas:
  mexer em cada controle; baixar SVG e abrir; "Copiar link" em aba nova reproduz a prévia;
  "Copiar comando" no terminal gera SVG idêntico ao baixado; console sem erro; sem rolagem
  horizontal. Os 5 itens do Foco de revisão, um por um.
- [ ] `design:design-critique` e `design:accessibility-review` nas três seções; achados de
  critério corrigidos, de gosto vão para o dono.
- [ ] Record `records/06-ferramentas.md`: resultado das checagens, achados, as 5 chamadas
  acima com a resposta do dono. Renders em PNG mostrados ao dono antes de marcar completo.

Verificação final: tudo acima e aprovação do dono registrada no `progress.md`.
