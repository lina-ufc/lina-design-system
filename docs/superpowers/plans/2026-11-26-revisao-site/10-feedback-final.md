# 10 — Feedback: texto, acessibilidade, verificação e aprovação: plano de implementação

> **Para agentes:** sub-skill obrigatória: `superpowers:subagent-driven-development` (ou
> `superpowers:executing-plans`). Passos em caixas (`- [ ]`). Ao terminar cada tarefa, atualizar `progress.md`.

**Objetivo:** o feedback (página, link do menu, bloco da home) tem texto revisado, passa na revisão de
acessibilidade, funciona de ponta a ponta com o script real e o dono aprova.

**Arquitetura:** nada novo. Ajustes em `paginas/feedback.html`, `assets/lina-feedback.js`, `site.css`, `sistema.json`
(`feedback.sub`) e `sistema.py` (link do menu, bloco da home). A Tarefa 3 é só verificação, envio real e aprovação.

**Tecnologia:** HTML gerado por `sistema.py`, JS sem dependências, `node --test`, navegador.

**Spec:** [`../../specs/2026-11-27-feedback-design.md`](../../specs/2026-11-27-feedback-design.md), seções "Fica com o
construtor", "Verificação" e "Antimetas". Pendências herdadas: [`records/08-feedback-pagina.md`](records/08-feedback-pagina.md)
("Revisão final do branch", 4 menores) e [`records/09-feedback-entradas.md`](records/09-feedback-entradas.md) ("Para o 10").

## Restrições globais

- Texto visível em pt-BR.
- Valores dos tipos fixos (planilha e Apps Script): `Erro`, `Falta algo`, `Sugestão`. Os rótulos visíveis dos rádios
  seguem iguais aos valores.
- Limites fixos: mensagem 2000, nome 120, e-mail 254, página 200 (`LIMITES`, testado contra o Apps Script).
- Aviso de dados mantém os quatro fatos: para que serve o e-mail; nada é publicado; quem guarda (LINA/UFC, planilha
  interna); como pedir exclusão, por `lina.pesquisa@iaud.ufc.br`.
- "Página" segue marcada como opcional; os outros campos, obrigatórios.
- `feedback_url` vazia: nem link no menu nem bloco na home (regra do 09 segue valendo com o texto novo).
- `feedback/apps-script.gs` não muda (o dono teria de republicar).
- Só classes e tokens existentes; sem rolagem lateral em 390 px; alvos de 44 px no celular; foco visível.

## Foco da revisão

1. Texto novo do link do menu deixando para trás o antigo em algum lugar (`grep -rn "Apontar erro"` fora de
   `docs/` e dos HTML gerados deve sair vazio se o texto mudou) (Tarefa 1, Passo 4).
2. `required` com `novalidate`: o navegador não pode mostrar a própria bolha de erro; o envio vazio ainda chega
   ao JS e mostra "Escolha o tipo da mensagem." (Tarefa 3, Passo 2).
3. Digitar depois de um erro limpa o aviso; enviar de novo com o mesmo erro anuncia de novo (Tarefa 3, Passo 2).
4. Bloco da home em forma de lista some com `feedback_url` vazia (Tarefa 2, Passo 4).
5. Falha de rede de verdade (`fetch` rejeita, não só resposta ruim) mostra o aviso e mantém o texto (Tarefa 3, Passo 2).

---

### Task 1: Texto (`design:ux-copy`)

**Files:**
- Modify: `paginas/feedback.html`, `assets/lina-feedback.js` (`AVISOS`, `FALHA`, `Enviando…`), `sistema.json`
  (`feedback.sub`), `sistema.py` (texto do link do menu e frase do bloco da home)
- Create: `docs/superpowers/plans/2026-11-26-revisao-site/records/10-feedback-final.md`

**Interfaces:**
- Produces (Tarefas 2 e 3): texto final do link do menu, anotado no record (seção "Texto").

- [ ] **Step 1: Revisar.** Rodar a skill `design:ux-copy` sobre todos os textos visíveis do feedback: introdução,
  legendas e rótulos, contador, aviso de dados, botões (`Enviar`, `Enviando…`, `Mandar outra`), avisos de erro e de
  falha, agradecimento, indisponível, `feedback.sub`, link do menu, bloco da home. Tom: o do site (direto, sem
  exclamação, segunda pessoa "você").
- [ ] **Step 2: Registrar** no record, seção "Texto": tabela `Onde | Atual | Proposta | Motivo`, só as linhas que mudam.
- [ ] **Step 3: Aplicar** as propostas nos arquivos.
- [ ] **Step 4: Conferir**

```bash
python3 sistema.py
node --test "ferramentas/test/*.test.mjs"
grep -rn "<texto antigo do link, se mudou>" --include=*.py --include=*.json --include=*.js --include=*.html . | grep -v "^./docs/" | grep -v "^./[^/]*\.html:"
```

Expected: `sistema.py` sem erro; 95 testes passam; grep vazio.

- [ ] **Step 5: Commit**

```bash
git add paginas/feedback.html assets/lina-feedback.js sistema.json sistema.py docs/superpowers/plans/2026-11-26-revisao-site/records/10-feedback-final.md
git commit -m "docs(feedback): texto revisado"
```

### Task 2: Acessibilidade

**Files:**
- Modify: `paginas/feedback.html`, `assets/lina-feedback.js` (`liga`), `site.css`, `sistema.py` (`ferr_home`)
- Modify: `records/10-feedback-final.md` (seção "Acessibilidade")

- [ ] **Step 1: Corrigir os menores do 08**
  - Aviso de erro: em `liga`, o ouvinte `input` do form também limpa `#fb-status` (`status.textContent = ''`), além
    de `aria-invalid`. Assim o próximo erro entra num `role="status"` vazio e é anunciado.
  - Obrigatórios: `required` nos três rádios, em `#fb-mensagem`, `#fb-nome` e `#fb-email`. O form mantém `novalidate`.
  - Foco do agradecimento: apagar `.feedback-aviso:focus{outline:none}` de `site.css`.
  - `#fb-ok`: sem mudança de código; o foco nele já lê o texto. Conferido com leitor de tela na Tarefa 3.
- [ ] **Step 2: Bloco da home em lista** (nota do 09). Em `ferr_home`, a frase entra no mesmo molde de Ferramentas:
  `<h3>Feedback</h3><ul class="regras"><li>…frase da Tarefa 1 com link para feedback.html…</li></ul>`.
- [ ] **Step 3: Revisão.** Rodar a skill `design:accessibility-review` (WCAG 2.1 AA) em `feedback.html` nos estados
  inicial, erro, enviando, enviado e indisponível, no link do menu e no bloco da home, em 1280 e 390 px. Achado de
  critério WCAG: corrigir nesta tarefa. Achado de gosto: pergunta ao dono no record. Registrar no record, seção
  "Acessibilidade": tabela `Achado | Critério | Correção ou pergunta`.
- [ ] **Step 4: Conferir**

```bash
python3 sistema.py
node --test "ferramentas/test/*.test.mjs"
grep -c 'required' feedback.html
grep -c 'outline:none' site.css
```

Expected: 95 passam; `required` 6 vezes em `feedback.html`; `outline:none` 1 (hoje 2). Depois, só local:
esvaziar `feedback_url` em `sistema.json`, `python3 sistema.py`, `grep -c '<h3>Feedback</h3>' index.html` → `0`;
voltar a URL, regenerar, `git diff sistema.json` vazio.

- [ ] **Step 5: Commit**

```bash
git add paginas/feedback.html assets/lina-feedback.js site.css sistema.py docs/superpowers/plans/2026-11-26-revisao-site/records/10-feedback-final.md
git commit -m "fix(feedback): acessibilidade do formulário e bloco da home em lista"
```

### Task 3: Verificação final e aprovação do dono

**Files:**
- Modify: `records/10-feedback-final.md` (seções "Verificação" e "Aprovação"); create `records/10-render/` (PNG)

Feita pelo controlador, não delegada (`CLAUDE.md` §8). Renders podem ser delegados.

- [ ] **Step 1: Checagens.** `node --test "ferramentas/test/*.test.mjs"` (95), `python3 sistema.py`,
  `node ferramentas/tokens.mjs --check` (saída 0).
- [ ] **Step 2: Navegador** (`python3 -m http.server`, `fetch` trocado na página só onde dito):
  envio vazio mostra o aviso do tipo sem bolha do navegador; digitar limpa o aviso; mesmo erro de novo volta a
  aparecer; `fetch` que rejeita mostra o aviso de falha e mantém o texto; `{ok:true}` mostra o agradecimento com foco
  e contorno visível só ao teclado; "Mandar outra" volta; `data-url=""` mostra indisponível. Em 390 px: `scrollWidth`
  = 390, alvos ≥ 44 px. Tab percorre na ordem com foco visível. Link do menu em `cores.html` preenche Página.
- [ ] **Step 3: Envio real** (com o dono, `fetch` verdadeiro): um envio normal (mensagem `Teste do plano 10`) e um
  com a isca `site` preenchida pelo console (mensagem `Teste isca 10`). Dono confirma: só a primeira linha na
  planilha, um e-mail.
- [ ] **Step 4: Leitor de tela** (dono, VoiceOver): erro, enviando e agradecimento são anunciados. Se o agradecimento
  não for, `#fb-ok` ganha `role="status"` antes da aprovação e o passo se repete.
- [ ] **Step 5: Renders** de `feedback.html` (inicial e enviado) e `index.html` em 1280 e 390 px em `records/10-render/`
  (método do 09: `prototipo/render.sh` com desktop 1280, cópia no scratchpad para estados).
- [ ] **Step 6: Aprovação.** Mostrar renders e perguntas do record ao dono. Dono aprova e apaga as linhas de teste
  (07, 08, 10) da planilha. Registrar no record e no `progress.md`; feedback (07–10) completo.

```bash
git add docs/superpowers/plans/2026-11-26-revisao-site/records/10-feedback-final.md docs/superpowers/plans/2026-11-26-revisao-site/records/10-render
git commit -m "docs(feedback): verificação final e aprovação"
```
