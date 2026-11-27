# 03 — Fonte única de tokens, `SKILL.md` índice, `llms.txt`: plano de implementação

> **Para agentes:** sub-skill obrigatória: `superpowers:subagent-driven-development`.
> Passos em caixas (`- [ ]`). Ao terminar cada tarefa, atualizar `progress.md`.

**Objetivo:** um agente acha qualquer parte do sistema a partir do `SKILL.md` ou do `llms.txt`,
e cada valor de cor existe num só lugar (`assets/lina-palette.js`); o resto é gerado ou
conferido contra ele.

**Arquitetura:** `assets/lina-palette.js` (do 01) é a fonte das 12 cores e das regras.
`ferramentas/tokens.mjs` gera `tokens/lina.tokens.json` (W3C DTCG 2025.10) a partir dele e de
`tokens/colors.css` (aliases semânticos), e confere que o CSS bate com a paleta. `sistema.py`
passa a gerar `llms.txt` a partir de `sistema.json`. `README.md` deixa de repetir hex;
`SKILL.md` vira índice.

**Spec:** [`../../specs/2026-11-26-revisao-site-diagnostico.md`](../../specs/2026-11-26-revisao-site-diagnostico.md),
D1 e O4.

## Restrições globais

- Nenhuma dependência nova. Node 26 e Python 3.13.
- `tokens/colors.css` continua escrito à mão (comentários e semântica). O gerador só confere
  os hex dele contra a paleta; não reescreve o CSS.
- JSON só de cor. Espaço, raio, tipo, movimento e elevação ficam no CSS (DTCG pede tipos e
  unidades próprios para cada um; ninguém usa ainda). `ponytail:` anotar no gerador.
- Fora do escopo, por decisão do spec ("templates não mudam") ou por serem reescritos depois:
  hex dentro de `templates/` (potx, LaTeX, Word), dos fragmentos `capitulos/` (o 05 refaz as
  páginas com o molde novo), de `assets/lina-draw.js` e `lina-dither-field.js` (as páginas 3.x
  e 4.x têm de renderizar igual). Registrar a lista no `progress.md` como herança para o 05.
- Textos para pessoas em português do Brasil; identificadores em inglês.

## Foco de revisão

1. `tokens/lina.tokens.json` válido em DTCG 2025.10: cor como objeto
   `{colorSpace: "srgb", components: [r, g, b], hex}` (componentes 0–1), `alpha` só quando ≠ 1,
   alias como `"{color.umbro}"`, todo alias aponta para token existente.
2. Teste falha se alguém mudar um hex no CSS e não na paleta (ou o contrário), ou se o JSON
   ficar velho.
3. `llms.txt` segue o formato (H1, citação de resumo, seções `##` com listas de links
   absolutos) e não tem link quebrado para página ou âncora.
4. Nenhum hex das 12 cores em `README.md` e `SKILL.md`.

---

## Tarefa 1 — tokens DTCG gerados da paleta

Arquivos: criar `ferramentas/tokens.mjs`, `ferramentas/test/tokens.test.mjs`,
`tokens/lina.tokens.json` (gerado, versionado).

- [ ] `tokens.mjs` carrega a paleta com `load()` de `ferramentas/_carregar.mjs` e lê
  `tokens/colors.css`. Para cada `--nome: valor;` dentro de `:root`:
  - `#RRGGBB`: tem de ser igual (sem caixa) a `LinaPalette.COLORS[nome]`; senão erro.
  - `var(--outro)`: alias `"{color.outro}"`.
  - `rgba(r, g, b, a)`: cor com `alpha`.
  - Outro formato: erro.
  - Cor da paleta ausente no CSS: erro.
- [ ] Saída: grupo `color` com `$type: "color"` no grupo, um token por variável (caminho =
  nome sem `--`), e `$extensions["br.ufc.lina"] = { families: FAMILIES, avoid: AVOID,
  source: "assets/lina-palette.js" }`. `$description` do grupo dizendo que o arquivo é gerado
  e o comando que o gera. JSON com 2 espaços e `\n` final.
- [ ] Uso: `node ferramentas/tokens.mjs` escreve `tokens/lina.tokens.json`;
  `--check` não escreve e sai com código 1 se o arquivo diferir do que seria gerado. Erro de
  conferência: código 2 com a mensagem em português (`fail` de `_carregar.mjs`).
- [ ] Testes (`node:test`): JSON versionado = saída nova; 12 primitivos com hex da paleta e
  componentes que voltam ao mesmo hex; `text-muted` com `alpha` 0.62; todo alias resolve;
  CSS adulterado (copiar para pasta temporária com um hex trocado, passar o caminho por
  argumento `--css`) falha com código 2.

Verificar: `node --test "ferramentas/test/*.test.mjs"` todos passam;
`node ferramentas/tokens.mjs --check` sai 0.

## Tarefa 2 — `llms.txt` gerado por `sistema.py`

Arquivos: `sistema.py`, `.gitignore`.

- [ ] No fim de `sistema.py`, gerar `llms.txt` na raiz:
  - `# Sistema de design LINA`, linha em branco, `> ` + resumo de uma frase (o que é o LINA
    e para que serve o site).
  - Uma seção `## <id> · <nome>` por capítulo, com `desc` e uma lista
    `- [<nome da entrada>](<BASE><href>): <sub>` (sem `: ` quando não houver `sub`).
  - `## Para agentes`: `SKILL.md`, `tokens/lina.tokens.json`, `assets/lina-palette.js`,
    `sistema.json`, `README.md`, cada um com uma frase.
  - `BASE = 'https://lina-ufc.github.io/lina-design-system/'`.
- [ ] `.gitignore`: `/llms.txt` junto dos outros gerados pelo site (o Actions roda
  `sistema.py` e publica a raiz).
- [ ] `sistema.py` imprime também `llms.txt: N links`.

Verificar: `python3 sistema.py` sem erro; todo link de `llms.txt`, trocado `BASE` por
arquivo local, aponta para arquivo existente e, se tiver `#âncora`, para um `id=` dessa
página (script de uma linha no record, não no repositório).

## Tarefa 3 — `README.md` sem hex e `SKILL.md` como índice

Depende de 1 e 2. Arquivos: `README.md`, `SKILL.md`.

- [ ] `README.md` §2: tirar hex e números de contraste; manter nomes, papéis e referências
  (sertão, dunas...). Uma linha: valores em `tokens/lina.tokens.json` (gerado de
  `assets/lina-palette.js`), pares e contrastes em 2.4–2.6 do site e em
  `node ferramentas/textura.mjs --list-colors`.
- [ ] `SKILL.md`: frontmatter com descrição que cite também componentes, templates e
  ferramentas. Corpo em índice por assunto, um parágrafo curto ou lista cada, sempre
  apontando arquivo e página, nunca repetindo valor: fonte da verdade (paleta, tokens CSS,
  JSON, `sistema.json`, `llms.txt`); logotipo e geometria; cores e regras de combinação;
  padrões e imagens (manter os comandos do 01 como estão); tipografia; ícones; componentes
  (cap. 7, molde Regra / Não fazer / Como pedir); templates (cap. 8, READMEs de
  `templates/`, comandos de build); site (`sistema.py`). Limite: 90 linhas.
- [ ] Conferir que todo caminho citado existe.

Verificar: `grep -iE "A81F0D|E1CE7A|FAF5C6|FDD692|64B6AC|2A1A12|6E1408|2F6A62|14322E|FDF1CF|E6DFA2|C9B87A" README.md SKILL.md`
vazio; caminhos citados existem.

## Tarefa 4 — teste às cegas e revisão

- [ ] Agente novo (sonnet), só com o caminho do `SKILL.md`, responde: (a) hex do
  turquesa fundo e onde ele é definido; (b) areia sobre creme serve para texto?; (c) comando
  de textura 1:1 em duo, ferro sobre creme; (d) onde está a regra do componente tabela;
  (e) como gerar o template de apresentação; (f) onde um agente externo acha o índice do site.
  Passa se as seis estão certas. Resposta e veredito em `records/03-teste-cego.md`.
- [ ] Revisão do diff do 03 (cavecrew-reviewer, sonnet) contra o "Foco de revisão".
- [ ] `python3 sistema.py`, `node --test "ferramentas/test/*.test.mjs"`,
  `node ferramentas/tokens.mjs --check`.

Verificar: as três checagens passam; record escrito; achados corrigidos ou registrados.
