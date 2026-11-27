# 08 — Feedback: página e envio: plano de implementação

> **Para agentes:** sub-skill obrigatória: `superpowers:subagent-driven-development` (ou
> `superpowers:executing-plans`). Passos em caixas (`- [ ]`). Ao terminar cada tarefa, atualizar `progress.md`.

**Objetivo:** `feedback.html` existe no site, no estilo do sistema, e um envio feito nela grava uma linha na planilha
pelo Apps Script publicado no 07.

**Arquitetura:** lógica pura em `assets/lina-feedback.js` (`valida`, `corpo`, `paginaDe`, `envia`), no mesmo
padrão de módulo de `assets/lina-ferramenta.js` (`root.LinaFeedback = {…}`), testada em Node. O mesmo arquivo liga o
formulário (`liga`). `sistema.py` gera a página a partir de `paginas/feedback.html` e injeta a URL do script.
Entradas na home e no menu ficam para o 09.

**Tecnologia:** HTML, CSS (`site.css`), JavaScript de navegador sem dependências, Python (`sistema.py`), `node --test`.

**Spec:** [`../../specs/2026-11-27-feedback-design.md`](../../specs/2026-11-27-feedback-design.md), seções
"Desenho" (página e envio), "Decisões do construtor" e "Verificação".

## Restrições globais

- Texto visível em pt-BR. Nomes no código em português, como no repo.
- Tipos, limites e ordem de checagem iguais aos de `feedback/apps-script.gs` (`TIPOS`, `LIMITES`): `Erro`,
  `Falta algo`, `Sugestão`; mensagem 2000, nome 120, e-mail 254, página 200, depois de `trim`.
- Campos enviados, nomes exatos: `tipo`, `pagina`, `mensagem`, `nome`, `email`, `site` (isca).
- Envio: `fetch(url, { method: 'POST', body: URLSearchParams })`, sem cabeçalhos (pedido simples, sem preflight).
- `sistema.json`: chave `feedback_url` (string; vazia = indisponível) e chave `feedback`
  `{ arquivo: "feedback.html", nome, sub, fragmento: "paginas/feedback.html" }`, fora de `ferramentas`.
- URL atual: a registrada em [`records/07-feedback-apps-script.md`](records/07-feedback-apps-script.md).
- Sem `feedback_url`: página gerada mesmo assim, aviso de indisponível no lugar do formulário, nada é enviado.
- Aviso de dados (spec, item 7): e-mail só para a equipe tirar dúvida; nada é publicado; guardado pelo LINA (UFC)
  em planilha interna; para apagar, escrever a `lina.pesquisa@iaud.ufc.br`.
- Estilo: só tokens e classes de `site.css`; alvos de toque ≥ 44 px no celular; foco visível; sem rolagem lateral
  em 390 px. Texto é rascunho: a revisão `design:ux-copy` é do 10.

## Foco da revisão

1. Duplo clique em Enviar manda duas linhas: botão desativado do clique até a resposta (teste na Tarefa 2, navegador).
2. Resposta que não é JSON (página de erro do Google, como no 07) ou rede fora: aviso de falha, texto mantido,
   botão volta (teste de `envia` na Tarefa 1; navegador na Tarefa 3).
3. `?pagina=` com âncora, caminho ou lixo longo: só o nome do arquivo, sem `#…`; acima de 200, vazio (Tarefa 1).
4. Leitor de tela não ouve o resultado: estados em `role="status"`/`aria-live`, foco vai para o agradecimento
   (Tarefa 3, revisão no navegador).
5. Isca visível para quem usa teclado ou leitor de tela: `tabindex="-1"`, `aria-hidden="true"`, fora da tela
   (Tarefa 2, conferir no HTML gerado).

---

### Task 1: Lógica do envio testada em Node

**Files:**
- Create: `assets/lina-feedback.js`
- Test: `ferramentas/test/feedback-site.test.mjs`

**Interfaces:**
- Produces (usado na Tarefa 2):
  - `LinaFeedback.TIPOS`, `LinaFeedback.LIMITES` (mesmos valores do `.gs`).
  - `valida(c: {tipo, pagina, mensagem, nome, email}) -> null | 'tipo'|'mensagem'|'nome'|'email'|'pagina'`:
    mesma ordem e regras de `valida` do `.gs` (e-mail `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
  - `corpo(c, isca: string) -> URLSearchParams` com os seis campos, `trim` em todos.
  - `paginaDe(search: string) -> string`: valor de `pagina`, sem o que vem depois de `#`, sem caminho
    (só o que vem depois da última `/`), `trim`; vazio se faltar ou passar de 200.
  - `envia(url, corpo, buscar = fetch) -> Promise<{ok: true} | {ok: false, erro: string}>`: rede fora, status
    não 2xx ou resposta que não é JSON viram `{ ok: false, erro: 'rede' }`; nunca rejeita.

- [ ] **Step 1: Escrever os testes que falham**

Carregar com `createRequire(import.meta.url)('../../assets/lina-feedback.js')` e ler `globalThis.LinaFeedback`,
como em `ferramenta.test.mjs`. Base válida: `{ tipo: 'Erro', pagina: 'cores.html', mensagem: 'Contraste baixo', nome: 'Ana', email: 'ana@ufc.br' }`.

```js
test('tipos e limites iguais aos do Apps Script', () => {
  const ctx = {}; vm.runInNewContext(readFileSync(raiz + 'feedback/apps-script.gs', 'utf8'), ctx);
  assert.deepEqual([...F.TIPOS], [...ctx.TIPOS]);
  assert.deepEqual({ ...F.LIMITES }, { ...ctx.LIMITES });
});
test('valida aceita base e página vazia', () => {
  assert.equal(F.valida(base), null);
  assert.equal(F.valida({ ...base, pagina: '' }), null);
});
test('valida recusa na ordem do script', () => {
  assert.equal(F.valida({ ...base, tipo: 'Elogio', mensagem: '' }), 'tipo');
  for (const [campo, valor, erro] of [['mensagem', ' \n ', 'mensagem'], ['mensagem', 'x'.repeat(2001), 'mensagem'],
    ['nome', '', 'nome'], ['email', 'ana @ufc.br', 'email'], ['email', 'ana@ufc', 'email'], ['pagina', 'x'.repeat(201), 'pagina']])
    assert.equal(F.valida({ ...base, [campo]: valor }), erro);
  assert.equal(F.valida({ ...base, mensagem: 'x'.repeat(2000) }), null);
});
test('corpo leva os seis campos limpos', () => {
  const b = F.corpo({ ...base, nome: '  Ana  ' }, '');
  assert.deepEqual([...b.keys()], ['tipo', 'pagina', 'mensagem', 'nome', 'email', 'site']);
  assert.equal(b.get('nome'), 'Ana');
  assert.equal(F.corpo(base, 'robo').get('site'), 'robo');
});
test('paginaDe tira âncora e caminho', () => {
  assert.equal(F.paginaDe('?pagina=cores.html'), 'cores.html');
  assert.equal(F.paginaDe('?pagina=cores.html%23s-paleta'), 'cores.html');
  assert.equal(F.paginaDe('?pagina=/a/b/cores.html'), 'cores.html');
  assert.equal(F.paginaDe(''), '');
  assert.equal(F.paginaDe('?pagina=' + 'x'.repeat(201)), '');
});
test('envia devolve a resposta do script ou erro de rede', async () => {
  const resp = (corpo, ok = true) => async () => ({ ok, json: async () => JSON.parse(corpo) });
  assert.deepEqual(await F.envia('u', F.corpo(base, ''), resp('{"ok":true}')), { ok: true });
  assert.deepEqual(await F.envia('u', F.corpo(base, ''), resp('{"ok":false,"erro":"tipo"}')), { ok: false, erro: 'tipo' });
  assert.deepEqual(await F.envia('u', F.corpo(base, ''), resp('<!DOCTYPE html>')), { ok: false, erro: 'rede' });
  assert.deepEqual(await F.envia('u', F.corpo(base, ''), resp('{"ok":true}', false)), { ok: false, erro: 'rede' });
  assert.deepEqual(await F.envia('u', F.corpo(base, ''), async () => { throw new TypeError('offline'); }), { ok: false, erro: 'rede' });
});
test('envia faz POST simples, sem cabeçalhos', async () => {
  let pedido; await F.envia('u', F.corpo(base, ''), async (url, op) => { pedido = op; return { ok: true, json: async () => ({ ok: true }) }; });
  assert.equal(pedido.method, 'POST');
  assert.ok(pedido.body instanceof URLSearchParams);
  assert.equal(pedido.headers, undefined);
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `node --test ferramentas/test/feedback-site.test.mjs`
Expected: FAIL (`assets/lina-feedback.js` não existe).

- [ ] **Step 3: Implementar as quatro funções e as constantes** em `assets/lina-feedback.js`, comentário de topo no
estilo de `lina-ferramenta.js` (o que o módulo faz, o que cada uso exige).

- [ ] **Step 4: Rodar a suíte inteira**

Run: `node --test "ferramentas/test/*.test.mjs"`
Expected: 88 anteriores + os novos, todos passam.

- [ ] **Step 5: Commit**

```bash
git add assets/lina-feedback.js ferramentas/test/feedback-site.test.mjs
git commit -m "feat(feedback): validação e envio do formulário do site"
```

### Task 2: Página `feedback.html` gerada pelo `sistema.py`

**Files:**
- Create: `paginas/feedback.html`
- Modify: `assets/lina-feedback.js` (acrescentar `liga`), `sistema.json`, `sistema.py`, `site.css`
- Generated: `feedback.html`

**Interfaces:**
- Consumes: `LinaFeedback.valida`, `corpo`, `paginaDe`, `envia` (Tarefa 1).
- Produces (usado no 09): `S['feedback']` e `S['feedback_url']` em `sistema.py`; `feedback.html` na raiz; a section
  da página com `data-url="<feedback_url>"`.

- [ ] **Step 1: `sistema.json`**

Acrescentar `"feedback_url"` com a URL do record do 07 e
`"feedback": { "arquivo": "feedback.html", "nome": "Feedback", "sub": "Aponte um erro ou diga o que falta no sistema.", "fragmento": "paginas/feedback.html" }`.
Uma frase sobre as duas chaves no fim de `_leia`.

- [ ] **Step 2: `sistema.py`**

Fragmento de `feedback` entra na lista `faltam`. Depois do laço das ferramentas, gerar `feedback.html` com
`html(f'{nome} · Sistema LINA', None, main)`, `main` igual ao das ferramentas, mas a section como
`<section class="pagina-ferramenta" data-url="{escape(S['feedback_url'])}">`. Nada no menu nem na home (09), nada no
`llms.txt`.

- [ ] **Step 3: `paginas/feedback.html`**

Uma frase de abertura (`p.p`), depois `<form id="fb" novalidate>` com os campos na ordem do spec ("Desenho", itens
1 a 8): tipo como `fieldset` + `legend` com três `input type=radio name=tipo` (valores exatos de `TIPOS`); página
`input type=text name=pagina` com rótulo que diga que é opcional; mensagem `textarea name=mensagem maxlength=2000`
com contador ligado por `aria-describedby`; nome `input name=nome maxlength=120 autocomplete=name`; e-mail
`input type=email name=email maxlength=254 autocomplete=email`; isca
`<div class="isca" aria-hidden="true"><label>Site <input name="site" tabindex="-1" autocomplete="off"></label></div>`;
aviso de dados (Restrições globais); botão `Enviar`; `<p role="status" id="fb-status">`. Depois do form, bloco
`#fb-ok` oculto (`hidden`, `tabindex="-1"`) com agradecimento e botão "Mandar outra", e bloco `#fb-indisponivel`
oculto. Fim: `<script src="assets/lina-feedback.js"></script>`.

- [ ] **Step 4: `liga(form, url)` em `assets/lina-feedback.js`**

Chamado no fim do arquivo quando há `document.getElementById('fb')`, com `url` do `data-url` da section.
- Sem `url`: esconde o form, mostra `#fb-indisponivel`.
- Ao abrir: `pagina` = `paginaDe(location.search)`; contador atualiza a cada `input`.
- Ao enviar: `valida`; erro = `aria-invalid="true"` no campo, mensagem no `#fb-status`, foco no campo. Sem erro:
  botão desativado e texto "Enviando…", `envia(url, corpo(...))`.
- `{ok:true}`: esconde o form, mostra `#fb-ok` e põe o foco nele. "Mandar outra" limpa mensagem e volta.
- `{ok:false}`: mensagem de falha no `#fb-status` (erro de campo vindo do script = mesma mensagem da validação
  local; `rede` e qualquer outro, incluindo `interno` = "Não foi possível enviar agora. Tente de novo em instantes."),
  texto mantido, botão volta.

- [ ] **Step 5: `site.css`**

Regras para `#fb` no bloco das ferramentas: `input[type=text]`, `input[type=email]` e `textarea` com o mesmo visual
de `.ferramenta input[type=number]`; rádios com rótulo inteiro como alvo (como `label:has(>input[type=checkbox])`);
`[aria-invalid=true]` com borda `var(--ferro)` e texto, não só cor; `.isca{position:absolute;left:-9999px}`;
largura de leitura no form. Reusar seletores existentes onde der (acrescentar ao seletor, não duplicar regra).

- [ ] **Step 6: Gerar e conferir**

Run: `python3 sistema.py && grep -c 'data-url="https://script.google.com' feedback.html && grep -c 'feedback.html' index.html`
Expected: `sistema.py` sem erro; `1`; `0` (home ainda sem entrada).
Run: `node --test "ferramentas/test/*.test.mjs"` — Expected: todos passam.
Com `feedback_url` vazia (só local, sem commitar): `python3 sistema.py` e `grep -c 'data-url=""' feedback.html` → `1`;
voltar a URL e regenerar.

- [ ] **Step 7: Commit**

```bash
git add paginas/feedback.html assets/lina-feedback.js sistema.json sistema.py site.css feedback.html
git commit -m "feat(feedback): página de feedback gerada pelo sistema.py"
```

### Task 3: Verificação no navegador e envio real

**Files:**
- Create: `docs/superpowers/plans/2026-11-26-revisao-site/records/08-feedback-pagina.md` (resultados) e
  `records/08-render/` (PNG)

- [ ] **Step 1: Render** de `feedback.html?pagina=cores.html%23s-x` em 1280 px e 390 px; conferir: campo Página
  com `cores.html`; sem rolagem lateral (`document.documentElement.scrollWidth <= innerWidth`); alvos ≥ 44 px no
  celular.
- [ ] **Step 2: Estados sem tocar a planilha** (trocar `fetch` pela página, só para o teste): campo vazio mostra erro
  e foca o campo; resposta HTML mostra falha com texto mantido; enquanto a promessa não resolve, botão desativado
  (dois cliques = um pedido); sem URL, aviso de indisponível.
- [ ] **Step 3: Teclado e leitor de tela**: Tab não para na isca; `#fb-status` anuncia; foco no agradecimento.
- [ ] **Step 4: Envio real** com mensagem `Teste do plano 08`. Dono confirma uma linha nova com a página de origem e
  um e-mail, e apaga a linha.
- [ ] **Step 5: Registrar e commitar**

```bash
git add docs/superpowers/plans/2026-11-26-revisao-site/records/08-feedback-pagina.md docs/superpowers/plans/2026-11-26-revisao-site/records/08-render
git commit -m "docs(feedback): página verificada no navegador e envio real"
```
