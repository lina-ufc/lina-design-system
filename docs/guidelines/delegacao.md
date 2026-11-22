# Delegação

Como o trabalho é dividido entre a sessão principal e subagentes, e em qual
modelo cada parte roda. CLAUDE.md §8 traz a versão curta. Planos e registros:
[`fluxo-de-planos.md`](fluxo-de-planos.md) e [`formato-progress.md`](formato-progress.md).

A meta é menos tokens com a mesma qualidade. As duas metades importam: um
despacho que volta com resposta errada ou vaga custa mais que fazer o trabalho
direto, porque o trabalho é refeito.

## De onde vem a economia

Duas economias distintas, muitas vezes confundidas:

1. **Contexto.** A saída das ferramentas de um subagente (cada arquivo lido,
   cada grep que errou) nunca entra no contexto da sessão principal. Só o
   relatório final entra. É a maior economia e vale seja qual for o modelo do
   subagente.
2. **Preço.** Um modelo mais barato custa menos por token no mesmo trabalho em
   massa. Isso só acontece se o modelo for de fato definido: subagentes herdam
   o modelo da sessão, a menos que se diga outro.

Definir o modelo explicitamente em todo despacho: o parâmetro `model` da
ferramenta `Agent` (`haiku`, `sonnet`, `opus`, `fable`) sobrepõe o que a
definição do agente diz. Deixar sem isso numa sessão Opus significa pagar a
tarifa do Opus por grep em massa.

Despachar não é de graça. O subagente relê arquivos que a sessão principal
talvez já tenha, e um relatório precisa ser escrito e lido. O limite a partir
do qual a troca compensa está em CLAUDE.md §8 e não é repetido aqui: duas
cópias de um número divergem, e a do contrato é a que o agente já leu.

## Níveis

Começar pelo nível mais barato que dá conta do trabalho. Subir é resposta a
uma tentativa que falhou, nunca jogada de abertura.

| Modelo | Usar para |
| --- | --- |
| `haiku` | Mecânico, verificável, sem julgamento: localizar um símbolo, listar arquivos por padrão, contar ocorrências, extrair um campo conhecido, aplicar uma renomeação já decidida |
| `sonnet` | O padrão para trabalho delegado: mapear uma pasta, leitura em massa de muitos arquivos, rastrear um caminho de chamadas, edições mecânicas em escopo limitado, primeira revisão de diff |
| `opus` | Só depois de um nível mais barato voltar errado, vazio ou claramente acima da capacidade, ou para trabalho que evidentemente exige raciocínio elaborado desde o início: decisões de arquitetura, depuração não óbvia, desenho transversal. Justificar a escolha em uma linha antes de despachar |
| `fable` | **Nunca por iniciativa própria.** Quando o `opus` também falhar, parar, dizer o que travou e oferecer um despacho `fable`. Só despachar se o dono concordar naquele turno. A concordância não vale para o despacho seguinte |

Trabalho em massa (ler, buscar, mapear, editar mecanicamente) vai por padrão
para os níveis baixos. Se uma tarefa parece pedir um modelo caro para fazer
trabalho em massa, quase sempre o `brief` está mal especificado, não o modelo
pequeno demais. Apertar o `brief` e tentar de novo no barato antes de subir.

Preferir os agentes `cavecrew-*` quando couberem: `cavecrew-investigator` para
localizar, `cavecrew-builder` para edição limitada de um ou dois arquivos,
`cavecrew-reviewer` para um diff, porque a saída deles já vem comprimida. Eles
não têm modelo próprio, então ainda assim passar `model` no despacho.

## Delegar

- Leitura ou busca ampla o bastante para passar o limite de CLAUDE.md §8.
- "Onde X é definido", "quem chama Y", "mapear esta pasta".
- Edições mecânicas de forma decidida, em escopo limitado.
- Qualquer primeira passada cuja saída útil é uma lista curta: achados,
  caminhos, uma tabela.
- Trabalhos independentes: despachar em paralelo, numa única mensagem.

## Fazer direto

- Tudo abaixo desse limite, quando já se sabe quais arquivos abrir.
- Trabalho que depende do contexto desta conversa: o subagente começa cego, e
  reconstruir esse contexto custa mais que o trabalho.
- A verificação final de uma afirmação prestes a ser feita ao dono. Nunca
  relatar um resultado como verificado só pela palavra de um subagente: rodar
  as checagens padrão (CLAUDE.md §5) aqui.
- Operações irreversíveis: push, exclusões, publicação, qualquer coisa voltada
  para fora.
- A decisão que o dono pediu a *você*. Delegar a leitura pode; delegar o
  julgamento não.

## O prompt de despacho

Subagentes não herdam nenhuma convenção deste repositório. Todo prompt de
despacho, e todo `SendMessage` de acompanhamento, repete essas convenções:

```
Estilo: caveman ultra, em português. Ponytail ultra: o mínimo que resolve.
Sem narração, sem preâmbulo, sem recapitulação. Relatar o resultado, não o
caminho.

Retorno: <formato exato desejado: tabela caminho:linha, lista de achados,
recibo de diff>. Só caminhos e números de linha, nunca o corpo dos arquivos.
Dizer com clareza se não achou algo, em vez de adivinhar.

Tarefa: <a tarefa>
Escopo: <arquivos ou pastas dentro do limite>
```

O contrato de retorno é a parte que gera a economia. "Resuma esta pasta" volta
como prosa que ninguém pediu; "devolva uma linha por função pública no formato
`caminho:linha — assinatura`" volta utilizável. Dizer também o que está fora do
escopo: um subagente com `brief` vago explora, e explorar é o que se queria
evitar.

## Ler o resultado

Repassar ao dono o que importa; o relatório em si não é mostrado a ele. Tratar
o relatório como afirmação, não como fato: se um subagente diz que um teste
passa ou que um símbolo não existe, e algo depende disso, conferir aqui antes
de repetir.
