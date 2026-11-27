# 01 — Motores e linha de comando: plano de implementação

> **Para agentes:** sub-skill obrigatória: `superpowers:subagent-driven-development` (recomendada)
> ou `superpowers:executing-plans`. Passos em caixas (`- [ ]`). Ao terminar cada tarefa,
> atualizar `progress.md` (ver o próprio arquivo).

**Objetivo:** os motores de textura e de imagem vivem em `assets/`, usam só as cores do
sistema, recebem um contrato único de parâmetros e podem ser chamados por linha de comando,
para que um agente gere SVG sem navegador.

**Arquitetura:** módulos no formato já usado em `assets/` (IIFE que publica um global em
`window`/`globalThis`). Um módulo novo, `assets/lina-palette.js`, é a fonte das cores e das
regras de combinação; textura e imagem leem dele. Os scripts em `ferramentas/` carregam os
módulos com `createRequire` e escrevem SVG. Testes com `node --test`, sem dependência nova.

**Stack:** JavaScript puro, Node 26, `sharp` já instalado em
`templates/apresentacao/potx/node_modules` (só para decodificar foto na linha de comando).

**Spec:** [`../../specs/2026-11-26-revisao-site-diagnostico.md`](../../specs/2026-11-26-revisao-site-diagnostico.md),
seção 3.C e "Decisões".

## Restrições globais

- Identificadores de código em inglês; textos para pessoas em português do Brasil.
- Nenhuma dependência nova no repositório. Nenhum `package.json` na raiz.
- Cores: só as 12 do `tokens/colors.css` (5 principais + 7 auxiliares). Nenhuma cor do
  `lina-visual-code` (carmim `#9B0A0E`, vinho `#520000`, branco, preto) entra nos motores.
- Cantos sempre ¼ de célula: `radius` não é parâmetro público, fica `0.25`.
- Modos públicos da textura: `dither` (pontilhado), `scatter` (dispersão), `field` (campo).
  O modo `glyphs` continua no motor, fora do contrato público.
- Saída: SVG. PNG fica fora (o usuário pediu SVG).
- `assets/lina-sample.js` (foto de exemplo, 190 kB) não é trazido.
- As páginas atuais (capítulos 3 e 4, `assets/lina-draw.js`, `assets/lina-dither-field.js`)
  devem renderizar igual depois da mudança.

## Foco de revisão

1. Combinação inválida pedida pela linha de comando (ex. `ferro` sobre `turquesa`): sair com
   código ≠ 0 e mensagem em português dizendo a regra, nunca gerar o SVG.
2. Nome de cor inexistente ou com acento/caixa diferente (`Ferro`, `turquesa-fundo` vs
   `turquesa fundo`): aceitar a grafia do token (`turquesa-fundo`), rejeitar o resto com a
   lista de nomes válidos.
3. Mesmos parâmetros, mesmo SVG, byte a byte (o `uid` global do `toSVG` hoje quebra isso).
4. Canvas não proporcional ao número de células (`width 1080`, `height 1350`, `cells 37`):
   SVG com exatamente `width="1080"` e altura proporcional às linhas inteiras, sem célula
   cortada no meio.
5. Foto em retrato, paisagem, PNG com transparência: a imagem resultante mantém a proporção
   (regra do repositório: nunca distorcer).

---

### Tarefa 1: paleta e regras de combinação

**Arquivos:**
- Criar: `assets/lina-palette.js`
- Teste: `ferramentas/test/palette.test.mjs`

**Interfaces:**
- Produz: global `LinaPalette` com
  - `COLORS`: objeto `{ ferro: '#A81F0D', areia, creme, damasco, turquesa, umbro,
    'ferro-fundo', 'turquesa-fundo', 'turquesa-tinta', nata, fio, 'fio-forte' }` com os hex de
    `tokens/colors.css`.
  - `FAMILIES`: `[['ferro','ferro-fundo'], ['turquesa','turquesa-fundo','turquesa-tinta'],
    ['areia','fio','fio-forte'], ['creme','nata','damasco'], ['umbro']]` (chamada minha,
    tirada dos exemplos de 3.4).
  - `AVOID`: pares não ordenados da seção 2.6: ferro/turquesa, turquesa/creme, areia/creme,
    damasco/areia, ferro/umbro, turquesa-fundo/ferro.
  - `contrast(a, b) -> number` (razão WCAG, nomes ou hex).
  - `check(names: string[]) -> { ok: boolean, kind: 'mono'|'duo'|'trio'|null, reason: string }`.
    `names[0]` é o fundo. Regras: 2 nomes da mesma família = `mono`; 2 nomes de famílias
    diferentes = `duo` se contraste ≥ 3 e o par não está em `AVOID`; 3 nomes = `trio` se
    `[names[0], names[1]]` é `duo` válido e `names[2] !== names[0]`. Qualquer outro caso:
    `ok: false` com `reason` em português.
  - `combos(kind) -> string[][]`: todas as combinações válidas daquele tipo.

- [ ] **Passo 1: teste que falha**

```js
test('pares de 2.5 são duo válidos', () => {
  for (const p of [['creme','umbro'],['creme','ferro'],['ferro','creme'],['damasco','umbro'],
                   ['areia','umbro'],['umbro','areia'],['turquesa','turquesa-tinta']])
    assert.equal(LinaPalette.check(p).ok, true, p.join('/'));
});
test('pares de 2.6 são recusados', () => {
  assert.equal(LinaPalette.check(['turquesa','ferro']).ok, false); // vibra, 3,1
  assert.equal(LinaPalette.check(['umbro','ferro']).ok, false);
});
test('exemplos de 3.4–3.6 passam', () => {
  assert.equal(LinaPalette.check(['ferro-fundo','ferro']).kind, 'mono');
  assert.equal(LinaPalette.check(['nata','damasco']).kind, 'mono');
  assert.equal(LinaPalette.check(['areia','ferro']).kind, 'duo');          // 4,64
  assert.equal(LinaPalette.check(['creme','ferro','turquesa']).kind, 'trio');
  assert.equal(LinaPalette.check(['umbro','areia','ferro']).kind, 'trio');
});
test('contraste confere com 2.4', () => {
  assert.equal(LinaPalette.contrast('umbro','creme').toFixed(1), '15.1');
  assert.equal(LinaPalette.contrast('ferro','creme').toFixed(1), '6.6');
});
test('nome desconhecido explica', () => {
  const r = LinaPalette.check(['Ferro','creme']);
  assert.equal(r.ok, false); assert.match(r.reason, /turquesa-fundo/); // lista os nomes
});
```

- [ ] **Passo 2:** `node --test ferramentas/test/` — falha (módulo não existe).
- [ ] **Passo 3:** implementar `assets/lina-palette.js` no formato IIFE de `lina-geometry.js`.
- [ ] **Passo 4:** `node --test ferramentas/test/` — passa.
- [ ] **Passo 5:** commit `feat(assets): lina-palette com regras de combinação`.

---

### Tarefa 2: textura com o contrato público

**Arquivos:**
- Modificar: `assets/lina-texture.js` (paletas linhas 15–21, `generate` ~523, `toSVG` ~576)
- Teste: `ferramentas/test/texture.test.mjs`

**Interfaces:**
- Consome: `LinaPalette.COLORS`, `LinaPalette.check`.
- Produz, em `LinaTexture`:
  - `PALETTES` passa a ser derivado de `LinaPalette.combos('duo')` no formato antigo
    `{ name, bg, fg, accent }` (para não quebrar consumidores).
  - `fromParams(params) -> { options, colors }`. `params`: `{ mode, seed, width, height,
    cells, colors: string[], blank, steps, quarter, clump, grain, stretch, accent, edges,
    pinholes }`, frações em 0–1 (sem divisões por 100 na interface). `cols = cells`,
    `rows = max(4, round(cells * height / width))`, `scale = width / (cols * 2)`, `radius`
    fixo 0,25. Duas cores: `accent = 0`. Lança `Error(reason)` se `LinaPalette.check(colors)`
    recusar.
  - `toSVG(res, colors, opts)`: aceita `opts.id`; sem ele mantém o contador atual (as páginas
    3.x desenham várias texturas e precisam de ids distintos).
  - `render(params) -> string`: `fromParams` + `generate` + `toSVG` com `id` derivado de
    `mode` e `seed`. É o que a linha de comando e a futura página chamam.
  - `generate` devolve também `bits` (Uint8Array), `bw`, `bh` do bitmap antes do traçado,
    nos modos `scatter` e `field`.
  - `legal(res) -> boolean`: todo pixel cheio pertence a um bloco 2×2 alinhado (regra do
    `CLAUDE.md` do `lina-visual-code`). Vale para `scatter` e `field`; `dither` é exceção.

- [ ] **Passo 1: teste que falha**

```js
const P = { mode:'field', seed:7, width:1080, height:1350, cells:36,
            colors:['creme','ferro'], blank:.5, clump:.6 };
test('determinístico', () => assert.equal(LinaTexture.render(P), LinaTexture.render(P)));
test('largura exata', () => assert.match(LinaTexture.render(P), /width="1080"/));
test('cores do sistema', () => {
  const svg = LinaTexture.render(P);
  assert.match(svg, /#FAF5C6/); assert.match(svg, /#A81F0D/); assert.doesNotMatch(svg, /#9B0A0E/);
});
test('recusa par proibido', () =>
  assert.throws(() => LinaTexture.render({ ...P, colors:['turquesa','ferro'] }), /vibra|contraste|evitar/i));
test('regra da célula em 20 sementes', () => {
  for (const mode of ['scatter','field']) for (let seed = 1; seed <= 20; seed++)
    assert.ok(LinaTexture.legal(LinaTexture.generate(LinaTexture.fromParams({ ...P, mode, seed }).options)));
});
test('trio usa a terceira cor', () =>
  assert.match(LinaTexture.render({ ...P, colors:['creme','ferro','turquesa'], accent:.2 }), /#64B6AC/));
```

- [ ] **Passo 2:** `node --test ferramentas/test/` — falha.
- [ ] **Passo 3:** implementar as mudanças acima em `assets/lina-texture.js`.
- [ ] **Passo 4:** `node --test ferramentas/test/` — passa.
- [ ] **Passo 5:** `python3 sistema.py`, abrir `3-padroes.html` e `4-animacao.html` no navegador
  e comparar com o site publicado: iguais. Sem erro no console.
- [ ] **Passo 6:** commit `feat(assets): contrato público da textura`.

---

### Tarefa 3: motor de imagem

**Arquivos:**
- Criar: `assets/lina-image.js` (cópia de `~/Developer/lina-visual-code/lina-image.js`)
- Teste: `ferramentas/test/image.test.mjs`

**Interfaces:**
- Consome: `LinaPalette`, `LinaGeometry.traceBitmap`.
- Produz, em `LinaImage`:
  - `PALETTES` derivado de `LinaPalette.combos('duo')`, formato `{ name, bg, fg }`.
  - `fromParams(params) -> { options, colors }`. `params`: `{ mode: 'dither'|'bitmap',
    detail, dither, brightness, contrast, midtones, cutoff, smooth, invert, colors: [bg, fg],
    width }`, frações em 0–1. Só `duo` ou `mono`.
  - `render(imageData, params) -> string` SVG, `width` igual a `params.width`, altura pela
    proporção da imagem.

- [ ] **Passo 1: teste que falha**

```js
const grad = (w, h) => ({ width:w, height:h,
  data: Uint8ClampedArray.from({ length:w*h*4 }, (_, i) => i % 4 === 3 ? 255 : Math.floor((i/4 % w) / w * 255)) });
test('retrato mantém proporção', () => {
  const svg = LinaImage.render(grad(60, 90), { mode:'bitmap', colors:['creme','umbro'], width:600 });
  assert.match(svg, /width="600"/); assert.match(svg, /height="900"/);
});
test('determinístico', () => {
  const p = { mode:'dither', colors:['creme','ferro'], width:400 };
  assert.equal(LinaImage.render(grad(80, 40), p), LinaImage.render(grad(80, 40), p));
});
test('recusa trio', () =>
  assert.throws(() => LinaImage.render(grad(10,10), { colors:['creme','ferro','umbro'], width:100 })));
```

- [ ] **Passo 2:** `node --test ferramentas/test/` — falha.
- [ ] **Passo 3:** copiar o motor, trocar `PALETTES`, acrescentar `fromParams` e `render`.
- [ ] **Passo 4:** `node --test ferramentas/test/` — passa.
- [ ] **Passo 5:** commit `feat(assets): motor de imagem com paletas do sistema`.

---

### Tarefa 4: linha de comando

**Arquivos:**
- Criar: `ferramentas/textura.mjs`, `ferramentas/imagem.mjs`, `ferramentas/_carregar.mjs`
- Teste: `ferramentas/test/cli.test.mjs`

**Interfaces:**
- `_carregar.mjs` exporta `load()` que faz `createRequire` de `assets/lina-geometry.js`,
  `lina-palette.js`, `lina-texture.js`, `lina-image.js` nessa ordem e devolve
  `{ LinaPalette, LinaTexture, LinaImage }`.
- Flags = chaves de `params` em kebab-case (`--mode field --seed 7 --width 1080 --height 1350
  --cells 36 --colors creme,ferro --blank 0.5`). `--out arquivo.svg`; sem ele, stdout.
  `--list-colors` imprime as combinações válidas por tipo.
- `imagem.mjs` recebe o caminho da foto como argumento posicional e decodifica com o `sharp`
  de `templates/apresentacao/potx/node_modules` (`.ensureAlpha().raw()`).
- Erro de parâmetro: stderr em português, código de saída 2.

- [ ] **Passo 1: teste que falha** (com `node:child_process.spawnSync`)

```js
test('textura gera SVG', () => {
  const r = run('ferramentas/textura.mjs', ['--mode','scatter','--seed','3','--width','800',
    '--height','800','--cells','32','--colors','damasco,umbro']);
  assert.equal(r.status, 0); assert.match(r.stdout, /^<svg/);
});
test('combinação proibida sai com 2', () => {
  const r = run('ferramentas/textura.mjs', ['--colors','turquesa,ferro']);
  assert.equal(r.status, 2); assert.match(r.stderr, /evitar|vibra|contraste/i);
});
test('imagem a partir de PNG', () => {
  const r = run('ferramentas/imagem.mjs', ['assets/logos-institutions/funcap/funcap-horizontal-cor.png', '--colors','creme,umbro','--width','300']);
  assert.equal(r.status, 0); assert.match(r.stdout, /width="300"/);
});
```

- [ ] **Passo 2:** `node --test ferramentas/test/` — falha.
- [ ] **Passo 3:** implementar os três arquivos (`node:util.parseArgs`).
- [ ] **Passo 4:** `node --test ferramentas/test/` — passa.
- [ ] **Passo 5:** commit `feat(ferramentas): linha de comando de textura e imagem`.

---

### Tarefa 5: documentação para o agente

**Arquivos:**
- Modificar: `SKILL.md`

- [ ] **Passo 1:** acrescentar parágrafo "Gerar padrões e imagens": os dois comandos com um
  exemplo cada, `--list-colors`, a regra de combinação em uma linha e onde estão os motores
  para uso em HTML (`assets/lina-palette.js`, `lina-texture.js`, `lina-image.js`, carregados
  depois de `lina-geometry.js`).
- [ ] **Passo 2:** verificar seguindo só o `SKILL.md`, numa sessão sem este contexto
  (subagente `sonnet`): gerar uma textura trio 4:5 e uma imagem pontilhada de um PNG do repo.
  Passa se os dois SVG saírem sem consultar outro arquivo.
- [ ] **Passo 3:** `node --test ferramentas/test/` e `python3 sistema.py` passam.
- [ ] **Passo 4:** commit `docs(skill): comandos de textura e imagem`.
