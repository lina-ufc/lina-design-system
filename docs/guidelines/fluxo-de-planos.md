# Fluxo de planos

Como um trabalho pesado vai da ideia ao código executado neste repositório. O
documento complementar [`formato-progress.md`](formato-progress.md) define a
forma do `progress.md`; este define quando os arquivos são escritos e onde
ficam.

Só tarefas pesadas passam por aqui. Uma tarefa é pesada se toca 4 ou mais
arquivos, introduz um subsistema ou dependência, tem requisitos ambíguos ou não
termina em uma sentada. Correção de erro de digitação, atualização de
dependência, formatação e edição de documentação que não muda comportamento
ficam de fora: fazer direto.

## Projetar antes de codar

Três artefatos, em ordem. Não pular etapa, e não abrir a etapa seguinte antes
de a anterior estar escrita e combinada com o dono do repositório.

1. **Brainstorm** — `superpowers:brainstorming`. Explorar intenção,
   restrições, alternativas. Nada escrito além de notas.
2. **Spec** — registrar o desenho combinado em
   `docs/superpowers/specs/AAAA-MM-DD-<slug>.md`.
3. **Plano** — `superpowers:writing-plans`. Quebrar a spec em tarefas
   ordenadas e verificáveis de forma independente, no layout abaixo.

Só depois de existir um plano o código muda. Se uma etapa expuser conflito com
o que o repositório já faz, dizer e parar, em vez de improvisar.

## Layout de planos e specs

Specs são sempre um arquivo só: `docs/superpowers/specs/AAAA-MM-DD-<slug>.md`.

Planos têm duas formas.

**Um plano avulso é um arquivo.** `docs/superpowers/plans/AAAA-MM-DD-<slug>.md`,
com uma seção `## Progress` no final.

**Um conjunto de planos é uma pasta datada.** Quando uma spec cobre vários
planos em sequência, eles ficam em `docs/superpowers/plans/AAAA-MM-DD-<slug>/`,
que contém:

- `README.md` — o índice. Ordem de leitura, uma linha de status por plano. É o
  único nome de arquivo em maiúsculas da árvore.
- `progress.md` — **obrigatório, um por pasta de planos.** O estado vivo das
  tarefas de todos os planos do conjunto, atualizado a cada vez que o critério
  de verificação de uma tarefa passa. Sem ele, outra sessão não consegue
  retomar a pasta, porque nada diz o que está feito. Criar junto com o
  conjunto, não depois, no formato definido em
  [`formato-progress.md`](formato-progress.md).
- `NN-<slug>.md` — um arquivo por plano. `NN` com dois dígitos, começando em
  01, slug em minúsculas com hífens. Exemplos: `01-html-deck.md`,
  `02-word.md`.
- `records/` — registros de execução, ver abaixo.

## Um plano de cada vez

**Escrever só o plano 01. Implementar, testar e registrar como feito. Depois
escrever o plano 02.** O `README.md` e o `progress.md` do conjunto listam todos
os planos previstos desde o início, mas um plano não escrito é só uma linha de
tabela:

- Plano não escrito não tem arquivo `NN-<slug>.md` nem seção no `progress.md`.
- Na tabela de resumo aparece como `Não escrito. Escrito quando o 01 terminar`,
  com barra vazia `[░░░░░░░░░░]` e `—` na contagem de tarefas. Uma barra sobre
  um total inventado afirma um progresso que não existe.
- Ao escrever o plano seguinte, vale incorporar o que a execução do anterior
  ensinou. É esse o ponto da sequência: um conjunto escrito de uma vez é um
  conjunto escrito antes de o código discordar dele.

A numeração pode pular um valor, mas a lacuna é explicada no `README.md`.
Renumerar para fechar a lacuna quebra toda referência que já aponta para o
número; explicar é melhor.

## Registros de execução não são planos

O registro de *executar* o plano 02 é outro documento, diferente do plano 02.
Os registros ficam em `<conjunto>/records/`, com nome
`NN-<slug>-<tipo>.md`, onde o tipo é `brief`, `ledger`, `review` ou `handoff`.
O `brief` é escrito antes do plano; os outros três, depois que ele roda:

```
02-word.md                    o plano
records/02-word-ledger.md     o registro da execução
records/02-word-review.md     a revisão desse trabalho
records/02-word-handoff.md    o que a próxima sessão precisa
```

## Executar um plano

Implementar uma tarefa por vez. Terminar e verificar antes de começar a
próxima. As verificações são as checagens padrão do projeto (CLAUDE.md §5).
Atualizar o `progress.md` quando o critério de verificação da tarefa passar:
nunca antes, nunca em lote no fim da sessão. Uma tarefa não está feita até o
`progress.md` dizer que está.

Se uma tarefa conflitar com o que o repositório já faz, dizer e parar, em vez
de improvisar um desenho diferente em silêncio.

## Trabalho concluído vai para `done/`

O que fica direto em `docs/superpowers/plans/` e `docs/superpowers/specs/` é o
que ainda falta fazer. Quando um plano for totalmente executado ou substituído,
movê-lo para `plans/done/`. Quando uma spec não tiver mais nada a implementar,
movê-la para `specs/done/`. Um conjunto cujos planos escritos estão prontos,
mas cujos planos seguintes ainda não foram escritos, mantém `README.md` e
`progress.md` em `plans/` e move só os planos concluídos e seus `records/`.
Corrigir os links que apontavam para eles no mesmo commit.

Regras de delegação e de modelo: [`delegacao.md`](delegacao.md) e CLAUDE.md §8.
Onde planos, specs e progresso se encaixam no projeto: CLAUDE.md §9.

## Caixa e separadores

Minúsculas com hífens em tudo, exceto `README.md`. Sem espaços em nomes de
arquivo, sem `MAIUSCULAS_COM_SUBLINHADO`.
