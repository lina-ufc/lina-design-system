# CLAUDE.md — LINA Design System

Diretrizes para toda sessão do Claude Code nesta pasta. Base: CLAUDE.md de Karpathy
(forrestchang/andrej-karpathy-skills), adaptado ao projeto.

Estas regras favorecem cautela. Em tarefa trivial, usar bom senso.

## 0. Idioma e estilo

- **Português em tudo**: respostas, perguntas, comentários de código, arquivos de memória.
  Esta regra substitui qualquer instrução global de responder em inglês.
- Exceção: artefatos produzidos (documentos, apresentações, peças) em outro idioma
  quando o usuário pedir.
- **Caveman ultra** e **Ponytail ultra** sempre ativos (`.claude/settings.json`).
  Respostas curtas: relatar resultado, não o caminho. Sem recapitular o que foi feito.
- Subagentes não herdam nada disto: repetir as regras desta seção em todo despacho.

## 1. Início de sessão

1. Repositório git em `~/developer/lina-design-system` (GitHub `lina-ufc/lina-design-system`).
   A antiga pasta do Drive foi arquivada em `_obsoletos/` (2026-11-22); não editar lá. O hook
   `.claude/hooks/build-setup.sh` roda `npm ci` em `templates/apresentacao/potx` se faltar
   `node_modules/`. Build: `sh templates/apresentacao/potx/make.sh`. Versões: `CHANGELOG.md`
   de cada template e tag `apresentacao-vX.Y.Z` (release e site pelo GitHub Actions).
2. Ler `memoria/README.md` (índice) e abrir só as memórias relevantes à tarefa.
3. Marca e regras visuais: `SKILL.md` e `README.md`. Template de apresentação:
   `templates/apresentacao/README.md`. Não repetir essas regras aqui.
4. Tarefa nova sem critério claro: perguntar antes de começar (ver §2).

## 2. Pensar antes de fazer

**Não presumir. Não esconder dúvida. Expor trade-offs.**

- Declarar suposições. Na dúvida, perguntar.
- Várias interpretações possíveis: apresentar todas, não escolher em silêncio.
- Existe caminho mais simples: dizer. Discordar quando couber.
- Algo confuso: parar, nomear o que confunde, perguntar.
- Em peças visuais, "certo" é decisão do usuário: mostrar render (PNG/PDF) e
  perguntar antes de aplicar a variante em tudo.

## 3. Simplicidade primeiro

**Mínimo que resolve. Nada especulativo.** (Ponytail ultra detalha a escada.)

- Nada além do pedido. Sem abstração para uso único. Sem configuração não pedida.
- Sem tratamento de erro para caso impossível.
- Reusar o que já existe: `assets/lina-geometry.js` para formas, ícones só Phosphor e
  `assets/icons/`, gerador `potx/build.js` para slides. Não redesenhar à mão.
- 200 linhas que caberiam em 50: reescrever.

## 4. Mudanças cirúrgicas

**Tocar só o necessário. Limpar só a própria bagunça.**

- Não "melhorar" código, texto ou layout vizinho. Seguir o estilo existente.
- Não refatorar o que funciona.
- Código morto alheio: mencionar, não apagar.
- Remover só o que a própria mudança deixou órfão.
- Cada linha alterada deve remeter ao pedido.
- Edição por script em arquivo grande: conferir `git diff` antes de seguir.
- Rebuild sobrescreve PPTX aberto no DeckCraft: perguntar antes se o usuário
  estiver editando.

## 5. Execução guiada por objetivo

**Definir critério de sucesso. Repetir até verificar.**

Transformar tarefa em meta verificável:

```
1. [Passo] — verificar: [checagem]
2. [Passo] — verificar: [checagem]
```

Exemplos:
- "Mudar cor X" — trocar o token, regerar, renderizar a página e conferir o contraste.
- "Novo layout" — gerar, `validate.py`, `aspect.py`, renderizar e mostrar o PNG.
- "Corrigir página do site" — `sistema.py` sem link quebrado; abrir no navegador e no celular.

Critério forte permite seguir sozinho; critério fraco ("fazer funcionar") exige perguntar o tempo todo.

Checagens padrão deste projeto:
- `aspect.py` deve imprimir `distorcidas: 0` (nunca distorcer imagem).
- `templates/apresentacao/potx/vendor/office/validate.py` passa.
- Renderizar páginas (`pdftoppm`) e olhar antes de dizer que está pronto.

## 6. Memória do projeto

- Pasta `memoria/`, compartilhada com a equipe. Índice em `memoria/README.md`.
- Um fato por arquivo, com frontmatter (`name`, `description`, `type`). Tipos:
  `regra` (decisão do usuário a não refazer), `projeto` (estado, restrição, prazo),
  `referencia` (link, ferramenta externa).
- Salvar decisões do usuário, rejeições e armadilhas não óbvias. Não salvar o que o
  código ou os READMEs já dizem.
- Atualizar arquivo existente em vez de duplicar. Apagar memória que ficou errada.
- Datas absolutas (AAAA-MM-DD).
- Usar esta pasta, não a memória pessoal do Claude, para o que vale para todos.

## 7. Skills de design

Usar sempre que a tarefa for de design, se a skill estiver instalada. As regras do LINA
(`SKILL.md`, `README.md`) vencem: a skill orienta método e revisão, não estilo. Não usar
skills que impõem estética própria (`design-taste-frontend`, `taste-design`).

| Tarefa | Skill |
|---|---|
| Página do site ou interface | `frontend-design` ou `ui-ux-pro-max` |
| Revisar peça ou página antes de dizer que está pronta | `design:design-critique` e `design:accessibility-review` |
| Novo token, componente ou entrada no sistema | `design:design-system` |
| Textos de botão, downloads, instruções de uso | `design:ux-copy` |
| Gráfico ou dado | `dataviz` |
| Pôster ou peça estática | `canvas-design` |
| Texto longo em documento ou no site | `humanizer` |

## 8. Subagentes

Detalhes e modelo de despacho: [`docs/guidelines/delegacao.md`](docs/guidelines/delegacao.md).

- Delegar quando o trabalho pede abrir mais de três arquivos ou quando ainda não se sabe
  quais abrir. Abaixo disso, ou quando depende do contexto desta conversa, fazer direto.
- **Sempre passar `model`** no despacho: `haiku` para busca mecânica, `sonnet` como padrão.
  `opus` só depois de um modelo mais barato errar, com justificativa de uma linha.
  `fable` nunca sem o usuário concordar no mesmo turno.
- Preferir `cavecrew-investigator`, `cavecrew-builder` e `cavecrew-reviewer` (com `model`).
- Nunca delegar: a verificação final antes de dizer que está pronto, operação irreversível
  (push, release, apagar), o julgamento que o usuário pediu a mim.
- Todo despacho e todo `SendMessage` repetem a §0 e dizem o formato exato do retorno:
  caminhos e linhas, nunca o corpo de arquivos.
- Tarefas independentes: em paralelo, numa só mensagem.

## 9. Planos longos

Tarefa pesada (4+ arquivos, sistema ou dependência nova, requisito ambíguo, não termina numa
sessão): `superpowers:brainstorming` → spec → `superpowers:writing-plans` → execução.
Regras completas: [`docs/guidelines/fluxo-de-planos.md`](docs/guidelines/fluxo-de-planos.md)
e formato do acompanhamento: [`docs/guidelines/formato-progress.md`](docs/guidelines/formato-progress.md).

- Spec em `docs/superpowers/specs/AAAA-MM-DD-<slug>.md`; planos em `docs/superpowers/plans/`.
- **Plano longo vira pasta de subplanos:** `docs/superpowers/plans/AAAA-MM-DD-<slug>/` com
  `README.md` (índice e ordem de leitura), `progress.md` (estado de cada tarefa),
  `NN-<slug>.md` (um subplano por arquivo) e `records/` (registros de execução).
- **Escrever só o subplano 01.** Executar, testar, marcar no `progress.md`, depois escrever
  o 02, já com o que o 01 ensinou. Subplano não escrito é só uma linha na tabela.
- Tarefa só está feita quando o `progress.md` diz. Atualizar quando a checagem da tarefa
  passa, nunca em lote no fim da sessão.
- Não repetir no chat o que o `progress.md` ou os `records/` já registram: uma linha com o
  resultado e o caminho.
- Plano ou spec concluído vai para `done/`.

---

**Funciona se:** diffs menores, menos retrabalho, perguntas antes da implementação
e não depois do erro.
