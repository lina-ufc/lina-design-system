# 07 — Acesso anônimo e Apps Script: plano de implementação

> **Para agentes:** sub-skill obrigatória: `superpowers:subagent-driven-development` (ou
> `superpowers:executing-plans`). Passos em caixas (`- [ ]`). Ao terminar cada tarefa, atualizar `progress.md`.

**Objetivo:** existe uma URL de app da web, publicada pelo dono na conta da UFC, que recebe um envio anônimo, valida
e grava uma linha na planilha do drive compartilhado.

**Arquitetura:** um arquivo só, `feedback/apps-script.gs`, versionado no repo e colado pelo dono no editor do Apps
Script da planilha. Lógica pura (`valida`, `decide`, `limpa`) separada das chamadas ao Google (`doPost`), para
testar a lógica em Node com `vm`, como os motores em `ferramentas/test/`. `doPost` só cola as peças.

**Tecnologia:** Google Apps Script (JavaScript V8), `node --test`.

**Spec:** [`../../specs/2026-11-27-feedback-design.md`](../../specs/2026-11-27-feedback-design.md), seções
"Desenho", "Decisões do construtor" e "Risco a testar primeiro".

## Restrições globais

- Texto visível em pt-BR. Nomes no código seguem o repo (português, como `desenha`, `carrega`).
- Nenhum e-mail, ID de planilha ou chave escrito no código: planilha = a que contém o script
  (`SpreadsheetApp.getActive()`); aviso vai para `Session.getEffectiveUser().getEmail()`.
- Tipos aceitos, exatos: `Erro`, `Falta algo`, `Sugestão`.
- Limites: mensagem 2000, nome 120, e-mail 254, página 200 caracteres (depois de `trim`).
- Teto do dia: a partir de 20 envios, grava sem e-mail; a partir de 200, descarta e responde `ok`.
- Colunas da planilha, nesta ordem: `Data`, `Tipo`, `Página`, `Mensagem`, `Nome`, `E-mail`, `Situação`. Situação
  inicial: `nova`.
- Campo-isca: parâmetro `site`. Preenchido = descarta e responde `{ ok: true }`.

## Foco da revisão

1. Texto que começa com `=`, `+`, `-` ou `@` vira fórmula na planilha: gravar com `'` na frente (teste na Tarefa 2).
2. Dois envios ao mesmo tempo disputam o contador do dia: `LockService.getScriptLock()` em volta de ler contador,
   gravar e somar (revisão de código na Tarefa 2; não testável em Node).
3. Mensagem só com espaços ou quebras de linha conta como vazia (teste na Tarefa 2).
4. E-mail com espaço no meio ou sem domínio com ponto é recusado (teste na Tarefa 2).
5. `doPost` com parâmetros faltando não pode lançar exceção: sempre responde JSON (revisão na Tarefa 2; envio
   vazio de verdade na Tarefa 3).

---

### Task 1: Dono confirma acesso anônimo

Tarefa do dono; o agente só registra. Nenhum código.

**Files:**
- Create: `docs/superpowers/plans/2026-11-26-revisao-site/records/07-feedback-apps-script.md`

- [ ] **Step 1: Pedir ao dono, com estes passos exatos**

  1. No drive compartilhado, criar a planilha `LINA · Feedback do site`.
  2. Extensões › Apps Script. Apagar o conteúdo e colar:
     `function doPost() { return ContentService.createTextOutput('{"ok":true}').setMimeType(ContentService.MimeType.JSON); }`
  3. Implantar › Nova implantação › tipo App da Web. Executar como: Eu. Quem pode acessar: **Qualquer pessoa**.
  4. Autorizar e copiar a URL `https://script.google.com/macros/s/…/exec`.

- [ ] **Step 2: Conferir de fora, sem login**

Run: `curl -sL -d 'x=1' '<URL>'`
Expected: `{"ok":true}`. Se a opção "Qualquer pessoa" não existir, ou a resposta for página de login do Google: parar,
registrar e avisar o dono que o conjunto troca para a abordagem A.

- [ ] **Step 3: Registrar e commitar**

Record com data, resultado do `curl` e a URL (a URL não é segredo; spec, "Envio").

```bash
git add docs/superpowers/plans/2026-11-26-revisao-site/records/07-feedback-apps-script.md
git commit -m "docs(feedback): acesso anônimo ao Apps Script confirmado"
```

### Task 2: Lógica do script testada em Node

**Files:**
- Create: `feedback/apps-script.gs`
- Test: `ferramentas/test/feedback.test.mjs` (fica no glob que o repo já roda)

**Interfaces:**
- Produces (usado na Tarefa 3 e pelo subplano 08, que monta o envio no site):
  - `TIPOS: string[]`, `LIMITES: { mensagem: 2000, nome: 120, email: 254, pagina: 200 }`,
    `TETO_EMAIL = 20`, `TETO_GRAVA = 200`, `AVISA = true`.
  - `limpa(texto: string) -> string`: `trim`; se começar com `=`, `+`, `-` ou `@`, prefixa `'`.
  - `valida(p: Record<string,string>, agora: Date) -> { ok: true, linha: [Date, string, string, string, string, string, 'nova'] } | { ok: false, erro: 'tipo'|'mensagem'|'nome'|'email'|'pagina' }`.
    Campos lidos: `tipo`, `pagina` (opcional), `mensagem`, `nome`, `email`. Ordem de checagem = ordem do `erro`.
  - `decide(p: Record<string,string>, contagem: number) -> 'descarta'|'grava'|'grava-sem-email'`.
  - `doPost(e) -> TextOutput` JSON `{ ok: true }` ou `{ ok: false, erro }`.

- [ ] **Step 1: Escrever os testes que falham**

Carregar o `.gs` com `vm.runInNewContext(readFileSync('feedback/apps-script.gs','utf8'), ctx)` e ler as funções
de `ctx`. Base válida: `{ tipo: 'Erro', pagina: 'cores.html', mensagem: 'Contraste baixo no 3.2', nome: 'Ana', email: 'ana@ufc.br' }`.

```js
test('valida aceita envio completo e monta a linha', () => {
  const agora = new Date('2026-11-27T10:00:00Z');
  const r = valida(base, agora);
  assert.equal(r.ok, true);
  assert.deepEqual(r.linha, [agora, 'Erro', 'cores.html', 'Contraste baixo no 3.2', 'Ana', 'ana@ufc.br', 'nova']);
});
test('página é opcional', () => assert.equal(valida({ ...base, pagina: '' }, new Date()).ok, true));
test('recusa cada campo', () => {
  for (const [campo, valor, erro] of [
    ['tipo', 'Elogio', 'tipo'], ['mensagem', ' \n ', 'mensagem'], ['mensagem', 'x'.repeat(2001), 'mensagem'],
    ['nome', '', 'nome'], ['nome', 'x'.repeat(121), 'nome'],
    ['email', 'ana@', 'email'], ['email', 'ana @ufc.br', 'email'], ['email', 'ana@ufc', 'email'],
    ['pagina', 'x'.repeat(201), 'pagina']])
    assert.deepEqual(valida({ ...base, [campo]: valor }, new Date()), { ok: false, erro }, `${campo}=${valor.slice(0, 12)}`);
});
test('limpa corta espaços e neutraliza fórmula', () => {
  assert.equal(limpa('  oi  '), 'oi');
  for (const s of ['=SOMA(A1)', '+1', '-1', '@x']) assert.equal(limpa(s), "'" + s);
  assert.equal(valida({ ...base, mensagem: '=HYPERLINK("x")' }, new Date()).linha[3], `'=HYPERLINK("x")`);
});
test('decide pela isca e pelo teto do dia', () => {
  assert.equal(decide({ ...base, site: 'x' }, 0), 'descarta');
  assert.equal(decide(base, 0), 'grava');
  assert.equal(decide(base, 19), 'grava');
  assert.equal(decide(base, 20), 'grava-sem-email');
  assert.equal(decide(base, 200), 'descarta');
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `node --test ferramentas/test/feedback.test.mjs`
Expected: FAIL (arquivo `feedback/apps-script.gs` não existe).

- [ ] **Step 3: Implementar `feedback/apps-script.gs`**

Constantes e as três funções puras conforme Interfaces. E-mail: uma expressão simples, sem espaço, com `@` e ponto
no domínio (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`). Comparar tamanhos depois do `trim`, antes do prefixo `'`.

`doPost(e)`, em `try/catch/finally` que sempre responde JSON e solta o lock no `finally`:
1. `p = (e && e.parameter) || {}`; `lock = LockService.getScriptLock(); lock.waitLock(10000)`.
2. Chave do dia `envios-AAAA-MM-DD` (`Utilities.formatDate(new Date(), 'America/Fortaleza', 'yyyy-MM-dd')`) em
   `PropertiesService.getScriptProperties()`; `contagem` = valor ou 0.
3. `acao = decide(p, contagem)`; `descarta` responde `{ ok: true }` sem gravar.
4. `r = valida(p, new Date())`; erro responde `{ ok: false, erro }`.
5. Primeira gravação: se a aba estiver vazia, `appendRow` do cabeçalho (Restrições globais). Depois
   `appendRow(r.linha)`, contador +1.
6. Se `acao === 'grava'` e `AVISA`: `MailApp.sendEmail(Session.getEffectiveUser().getEmail(), 'Feedback do site · ' + tipo, corpo)`
   com tipo, página e mensagem. Falha do e-mail não desfaz a gravação.

- [ ] **Step 4: Rodar e ver passar, junto com o resto**

Run: `node --test "ferramentas/test/*.test.mjs"`
Expected: todos passam (82 anteriores + os novos).

- [ ] **Step 5: Commit**

```bash
git add feedback/apps-script.gs ferramentas/test/feedback.test.mjs
git commit -m "feat(feedback): Apps Script valida e grava envios do site"
```

### Task 3: Instruções do dono e publicação real

**Files:**
- Create: `feedback/README.md`
- Modify: `docs/superpowers/plans/2026-11-26-revisao-site/records/07-feedback-apps-script.md`

**Interfaces:**
- Consumes: `feedback/apps-script.gs` (Tarefa 2), URL da Tarefa 1.
- Produces: URL publicada e testada, registrada no record; o subplano 08 a põe em `sistema.json` como `feedback_url`.

- [ ] **Step 1: Escrever `feedback/README.md`**

Passos para o dono: abrir a planilha do drive compartilhado › Extensões › Apps Script › colar
`feedback/apps-script.gs` inteiro › Implantar › Gerenciar implantações › editar a existente › Nova versão (mantém a
mesma URL). Como desligar o e-mail (`AVISA = false`) e mudar os tetos. Como marcar a coluna Situação
(`nova`, `feita`, `descartada`). Onde a URL vai (`sistema.json`, `feedback_url`, depois `python3 sistema.py`).

- [ ] **Step 2: Dono publica a nova versão** seguindo o README.

- [ ] **Step 3: Conferir os quatro casos de fora**

```bash
curl -sL --data-urlencode tipo=Erro --data-urlencode pagina=cores.html --data-urlencode 'mensagem=Teste do plano 07' --data-urlencode nome=Teste --data-urlencode email=teste@ufc.br '<URL>'
curl -sL --data-urlencode tipo=Elogio --data-urlencode mensagem=x --data-urlencode nome=T --data-urlencode email=t@ufc.br '<URL>'
curl -sL --data-urlencode tipo=Erro --data-urlencode mensagem=x --data-urlencode nome=T --data-urlencode email=t@ufc.br --data-urlencode site=robo '<URL>'
curl -sL -d '' '<URL>'
```

Expected, nesta ordem: `{"ok":true}`; `{"ok":false,"erro":"tipo"}`; `{"ok":true}`; `{"ok":false,"erro":"tipo"}`.
Dono confirma na planilha: cabeçalho + **uma** linha (`Teste do plano 07`, situação `nova`) e um e-mail recebido.
Depois o dono apaga a linha de teste.

- [ ] **Step 4: Registrar e commitar**

Record: data, as quatro respostas, confirmação do dono.

```bash
git add feedback/README.md docs/superpowers/plans/2026-11-26-revisao-site/records/07-feedback-apps-script.md
git commit -m "docs(feedback): instruções de publicação e teste do script real"
```
