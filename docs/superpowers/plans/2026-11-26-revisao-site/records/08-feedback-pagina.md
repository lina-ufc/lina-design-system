# 08 — Feedback: página e envio

## Tarefa 3 — verificação no navegador (2026-11-27)

Página: `feedback.html?pagina=cores.html%23s-x`, servida por `python3 -m http.server` na raiz do repo.
Render: [`08-render/feedback-desktop.png`](08-render/feedback-desktop.png) (1280 px) e
[`08-render/feedback-celular.png`](08-render/feedback-celular.png) (390 px).

| Checagem | Resultado |
| --- | --- |
| Campo Página com `?pagina=cores.html%23s-x` | `cores.html` |
| Rolagem lateral (`scrollWidth` x `innerWidth`) | 1280 = 1280; 390 = 390 |
| Alvos em 390 px | rádios 44, campos 46, Enviar 44 px de altura |
| Enviar vazio | "Escolha o tipo da mensagem.", `aria-invalid` nos rádios, foco no tipo |
| Dois `requestSubmit` e um clique com a resposta pendente | 1 pedido; botão desativado, "Enviando…" |
| Resposta que não é JSON | "Não foi possível enviar agora. Tente de novo em instantes."; texto mantido; botão volta |
| `{ok:true}` | form escondido (`display:none`), `#fb-ok` visível e com foco |
| "Mandar outra" | form volta; mensagem limpa, nome mantido; foco na mensagem |
| `data-url=""` | form escondido; aviso de indisponível com o e-mail do LINA |
| Ordem do Tab | tipo, página, mensagem, nome, e-mail, link do e-mail, Enviar; não para na isca |
| Foco visível | contorno sólido de 2 px em todos |
| Isca | `aria-hidden="true"`, `tabindex="-1"`, fora da tela (x ≈ −9700) |
| `#fb-status` | `role="status"` |

`fetch` trocado na página só para esses estados; nada foi enviado à planilha.

A revisão da Tarefa 2 achou `#fb{display:flex}` anulando `hidden` (form não escondia). Corrigido em `f6374c3`;
os estados acima já são com a correção.

## Envio real (2026-11-27)

De `localhost:8765/feedback.html?pagina=cores.html%23s-x`, `fetch` verdadeiro: tipo `Erro`, mensagem
`Teste do plano 08`, nome `Teste plano 08`, e-mail `lina.pesquisa@iaud.ufc.br`. Resposta `{ok:true}`: form escondido,
agradecimento com foco. Redirecionamento e CORS do Apps Script passam no navegador. Linha na planilha: espera o dono.

## Revisão final do branch (2026-11-27)

Sem Critical nem Important. Menores deixados para o 10 (`design:accessibility-review`):

1. `#fb-status` não limpa ao voltar a digitar; erro repetido pode não ser anunciado de novo. Considerar
   `aria-describedby="fb-status"` nos campos.
2. `#fb-ok` sem `role`/`aria-live`: o anúncio depende do foco. Conferir com leitor de tela real.
3. Campos obrigatórios sem `required` (WCAG 3.3.2): só "Página (opcional)" diz o estado.
4. `.feedback-aviso:focus{outline:none}` tira o indicador do foco programático.
