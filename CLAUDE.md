# CLAUDE.md — LINA Design System

Diretrizes para toda sessão do Claude Code nesta pasta. Base: CLAUDE.md de Karpathy
(forrestchang/andrej-karpathy-skills), adaptado ao projeto.

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
3. Marca e regras visuais: `SKILL.md` e `readme.md`. Template de apresentação:
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
- Reusar o que já existe: `assets/lina-geometry.js` para formas, ícones só Phosphor e
  `assets/icons/`, gerador `potx/build.js` para slides. Não redesenhar à mão.
- 200 linhas que caberiam em 50: reescrever.

## 4. Mudanças cirúrgicas

**Tocar só o necessário. Limpar só a própria bagunça.**

- Não "melhorar" código, texto ou layout vizinho. Seguir o estilo existente.
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

Checagens padrão deste projeto:
- `aspect.py` deve imprimir `distorcidas: 0` (nunca distorcer imagem).
- `validate.py` passa.
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

---

**Funciona se:** diffs menores, menos retrabalho, perguntas antes da implementação
e não depois do erro.
