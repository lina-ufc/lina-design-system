# 09 — Feedback: entradas na home e no menu: plano de implementação

> **Para agentes:** sub-skill obrigatória: `superpowers:subagent-driven-development` (ou
> `superpowers:executing-plans`). Passos em caixas (`- [ ]`). Ao terminar cada tarefa, atualizar `progress.md`.

**Objetivo:** quem está em qualquer página do site chega ao `feedback.html` com um clique, já com a página de
origem preenchida; a home aponta para o feedback.

**Arquitetura:** só `sistema.py` muda. `nav()` ganha, no fim do sumário, o link "Apontar erro nesta página" para
`feedback.html?pagina=<arquivo da página>`; a home ganha um bloco curto depois de Ferramentas. Os dois só existem com
`feedback_url` preenchida. Link estático, gerado no servidor: funciona sem JS.

**Tecnologia:** Python (`sistema.py`), HTML gerado, `site.css` só se a classe reusada não bastar.

**Spec:** [`../../specs/2026-11-27-feedback-design.md`](../../specs/2026-11-27-feedback-design.md), seções
"Pontos de entrada" e "Decisões do construtor" (sem URL, sem entrada; `?pagina=` só com o nome do arquivo).

## Restrições globais

- Texto visível em pt-BR. Texto é rascunho: a revisão `design:ux-copy` é do 10.
- Link do menu: texto exato `Apontar erro nesta página`; `href="feedback.html?pagina=<arquivo>"`, onde `<arquivo>`
  é o nome do arquivo gerado da própria página (`cores.html`, `gerador-de-padroes.html`, `index.html`), sem âncora nem caminho.
- O link é o último item do `<ol>` do sumário (depois do grupo Ferramentas), como `<li>` com `<a class="cap">`
  (mesmo alvo de 44 px no celular que os capítulos). Sem `aria-current`.
- `feedback.html` não leva o link. Ela passa `FB` como `atual` para `html()`.
- Home: bloco depois da lista de Ferramentas em `ferr_home`, no mesmo molde (`<h3>` + frase com link para
  `feedback.html`, sem `?pagina=`).
- `feedback_url` vazia: nem link no menu nem bloco na home, em nenhuma página. `feedback.html` segue gerada.
- `llms.txt` não muda.
- Estilo: só classes e tokens existentes; sem rolagem lateral em 390 px; foco visível.

## Foco da revisão

1. Página sem link ou com o arquivo errado no `?pagina=`: conferir capítulo, ferramenta e home no HTML gerado
   (Tarefa 1, Passo 3).
2. `feedback.html` com o link apontando para si mesma (Tarefa 1, Passo 3).
3. URL vazia deixando o link ou o bloco para trás em alguma página (Tarefa 1, Passo 4).
4. No celular, o link some dentro do sumário recolhido ou fica menor que 44 px (Tarefa 2).
5. O link do menu, clicado, não preenche o campo Página (Tarefa 2).

---

### Task 1: Link no menu e bloco na home

**Files:**
- Modify: `sistema.py` (`nav`, chamada de `html` do feedback, `ferr_home`)
- Generated (não versionado, `/*.html` no `.gitignore`): todas as páginas da raiz

**Interfaces:**
- Consumes (do 08): `S['feedback']` (`FB`) com `arquivo`; `S['feedback_url']`; `pagina_de(c)`; `FERR`.
- Produces (usado no 10): o link `a.cap[href^="feedback.html?pagina="]` no sumário e o bloco na home.

- [ ] **Step 1: `nav(atual)`**

Arquivo da página atual: `index.html` se `atual is None`; `f['arquivo']` se `atual` é uma das `FERR`;
`pagina_de(atual)` se é capítulo; nenhum se `atual is FB`. Com arquivo e `S['feedback_url']` não vazia, acrescentar
ao fim de `itens`:
`<li><a class="cap" href="feedback.html?pagina={escape(arquivo)}"><span></span>Apontar erro nesta página</a></li>`.

- [ ] **Step 2: chamada do feedback e home**

`html(..., FB, main)` no lugar de `None` na geração de `feedback.html`. Em `ferr_home`, com `S['feedback_url']`,
acrescentar depois do `</ul>`:
`<h3>Feedback</h3><p>Viu um erro ou sentiu falta de algo? <a href="feedback.html">Conte para a equipe</a>.</p>`.

- [ ] **Step 3: Gerar e conferir com a URL**

```bash
python3 sistema.py
grep -o 'href="feedback.html?pagina=[^"]*"' cores.html index.html gerador-de-padroes.html feedback.html
grep -c '<h3>Feedback</h3>' index.html
```

Expected: `cores.html:…pagina=cores.html"`, `index.html:…pagina=index.html"`, `gerador-de-padroes.html:…pagina=gerador-de-padroes.html"`,
nenhuma linha de `feedback.html`; `1`.

- [ ] **Step 4: Conferir sem a URL** (só local, sem commitar)

Esvaziar `feedback_url` em `sistema.json`, `python3 sistema.py`, então
`grep -l 'Apontar erro' *.html; grep -c '<h3>Feedback</h3>' index.html` → nenhum arquivo; `0`.
Voltar a URL, regenerar, `git diff sistema.json` vazio.

- [ ] **Step 5: Testes e commit**

Run: `node --test "ferramentas/test/*.test.mjs"` — Expected: 95 passam.

```bash
git add sistema.py
git commit -m "feat(feedback): link no menu e bloco na página inicial"
```

### Task 2: Verificação no navegador

**Files:**
- Create: `docs/superpowers/plans/2026-11-26-revisao-site/records/09-feedback-entradas.md` e `records/09-render/` (PNG)

- [ ] **Step 1: Render** de `index.html` e `cores.html` em 1280 e 390 px (`prototipo/render.sh`, desktop trocado
  para 1280 como no 08); no celular, também com o sumário aberto. Conferir: link no fim do sumário, bloco na home
  depois de Ferramentas, sem rolagem lateral.
- [ ] **Step 2: Clique** no link do menu em `cores.html`, numa ferramenta e na home: `feedback.html` abre com o
  campo Página igual ao arquivo de origem. Em 390 px, altura do link ≥ 44 px; Tab chega ao link com foco visível.
- [ ] **Step 3: Registrar e commitar**

```bash
git add docs/superpowers/plans/2026-11-26-revisao-site/records/09-feedback-entradas.md docs/superpowers/plans/2026-11-26-revisao-site/records/09-render
git commit -m "docs(feedback): entradas verificadas no navegador"
```
