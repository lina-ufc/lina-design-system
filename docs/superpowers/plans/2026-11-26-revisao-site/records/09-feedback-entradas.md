# 09 — Feedback: entradas na home e no menu

## Tarefa 2 — verificação no navegador (2026-11-27)

Páginas servidas por `python3 -m http.server 8765` na raiz do repo, geradas de `95ea597`.
Render em [`09-render/`](09-render/): `index` e `cores` em 1280 px (`-desktop`) e 390 px (`-celular`);
`cores-celular-sumario.png` com o sumário aberto (o script da página fecha `details.sum` abaixo de 821 px; o render
usou uma cópia com `open = true`).

| Checagem | Resultado |
| --- | --- |
| Link no fim do sumário | último `<li>` do `<ol>`, depois do grupo Ferramentas, em 1280 e 390 px |
| Clique em `cores.html` | `feedback.html?pagina=cores.html`, campo Página `cores.html` |
| Clique em `gerador-de-padroes.html` | campo Página `gerador-de-padroes.html` |
| Clique na home | campo Página `index.html` |
| `feedback.html` | sem o link |
| Bloco na home | `Feedback` logo depois de Ferramentas; link para `feedback.html` sem `?pagina=` |
| Rolagem lateral em 390 px | `scrollWidth` 390 = `innerWidth` em `index` e `cores` |
| Alvo em 390 px | link com 44 px de altura, 358 px de largura |
| Teclado | Tab sai de "Editor de células" e chega ao link; `:focus-visible`, contorno sólido de 2 px |

## Para o 10

A frase do bloco Feedback da home sai no corpo de texto da introdução, maior que os itens da lista de Ferramentas
logo acima (`ul.regras`). Segue o HTML do plano; decidir na revisão de design se fica assim ou vira item de lista.
