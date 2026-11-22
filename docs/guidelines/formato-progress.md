# Formato do progress

Todo conjunto de planos tem um `progress.md`. É o arquivo que uma sessão sem
memória deste trabalho lê primeiro, e o único lugar que responde **o que está
feito**. O `records/` responde o que aconteceu; os arquivos de plano respondem
o que se pretendia.

Este documento define o formato. A obrigação de mantê-lo atualizado está em
[`fluxo-de-planos.md`](fluxo-de-planos.md), seção "Layout de planos e specs".

## A regra em uma linha

**Uma tarefa não está feita até o `progress.md` dizer que está.** Atualizar
depois que o critério de verificação da tarefa passar: nunca antes, nunca em
lote no fim da sessão.

## Onde fica

- Um **conjunto** de planos (`docs/superpowers/plans/AAAA-MM-DD-<slug>/`)
  mantém o `progress.md` ao lado do `README.md`. Criar junto com o conjunto,
  não depois.
- Um **plano avulso** (`docs/superpowers/plans/AAAA-MM-DD-<slug>.md`) mantém o
  progresso numa seção `## Progress` no final do arquivo do plano, com o mesmo
  formato de seção descrito abaixo. Um arquivo separado para um plano só é
  excesso.

## A barra de progresso

Dez células, `█` para feito e `░` para não feito, entre colchetes, dentro de
crases para que fontes proporcionais não distorçam:

```
`[███░░░░░░░]` 33% — 2 de 6 tarefas.
```

Arredondar as células cheias para baixo: a barra é um piso, nunca um
arredondamento que favorece. Um plano ainda não escrito não tem total honesto,
então leva barra vazia `[░░░░░░░░░░]` e `—` na contagem de tarefas. Uma barra
sobre um total inventado parece progresso que não existe.

## Seções obrigatórias

### 1. Cabeçalho

`# <Nome do conjunto> — Progresso da implementação`, depois uma linha
**Última atualização** com a data, o branch, o que está commitado e o que ainda
não foi mesclado. Depois, um link para o `README.md`.

### 2. Como atualizar este arquivo

Repetir o contrato no próprio arquivo, para que uma sessão que abra só ele
saiba as regras. Seis pontos numerados: atualizar depois do critério de
verificação; marcar a caixa e anexar o SHA; atualizar a linha do plano na
tabela; acrescentar uma linha no changelog; dizer explicitamente quando uma
tarefa for abandonada ou adiada; nunca marcar um plano como completo com tarefa
desmarcada.

### 3. Resumo

A barra geral, depois uma linha de tabela por plano:

```markdown
| Plano | Era | Progresso | Tarefas | Status |
| --- | --- | --- | --- | --- |
| 01 — html-deck | 06 | `[███░░░░░░░]` | 2/6 | **Em execução desde 2026-09-08** em `plan/01-html-deck` |
| 02 — word | 03 | `[░░░░░░░░░░]` | — | Não escrito. Escrito quando o 01 terminar |
```

A coluna `Era` só existe num conjunto que renumerou um conjunto substituído; sem
isso, remover. Nesta tabela a barra vem sozinha: sem porcentagem, sem palavras.
As colunas `Tarefas` e `Status` carregam isso.

### 4. Uma seção por plano

Todo plano **escrito** do conjunto ganha sua seção. Um plano não escrito não
tem seção: vive só como linha da tabela de resumo até ser escrito:

```markdown
## Plano 01 — html-deck

`[███░░░░░░░]` 33% — 2 de 6 tarefas.

Branch `plan/01-html-deck`, base `de2d451`.

- [x] **Tarefa 1** — gerador de layouts — `7592e73`, review limpo
- [x] **Tarefa 2** — tokens de cor no deck — `d20353d`, review aprovado
- [ ] **Tarefa 3** — validação do deck
```

Uma caixa por tarefa, na ordem do plano; cada tarefa feita leva o SHA curto e o
resultado do review. Uma tarefa adiada ou abandonada mantém a caixa
desmarcada e ganha o motivo na mesma linha: uma tarefa pulada em silêncio
parece uma tarefa não iniciada.

Abaixo da lista, dizer com clareza qual verificação realmente rodou. A
execução por tarefa não é o conjunto completo de checagens: se as checagens
padrão (CLAUDE.md §5) não rodaram contra o branch, dizer, e não apoiar nenhuma
afirmação de conclusão nelas.

### 5. Estado herdado

Aquilo de que o conjunto parte, para nenhum plano precisar re-derivar: o commit
base, o que já está publicado, o que se sabe estar quebrado.

### 6. Ações pendentes do dono

Tudo que espera uma pessoa, numerado, cada item dizendo o que bloqueia e o que
não bloqueia.

### 7. Changelog

Mais recente primeiro, datado, uma entrada por mudança relevante no conjunto:
plano escrito, execução aberta, tarefa concluída, decisão tomada. Só datas
absolutas; "ontem" não significa nada para a próxima sessão.

## O que nunca entra

- Logs narrativos da execução de uma tarefa. Esses vão para
  `records/NN-<slug>-ledger.md`.
- Saída gerada de qualquer tipo.
- Afirmação de conclusão cuja verificação não rodou e não foi lida.
