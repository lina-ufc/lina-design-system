# 10 — Feedback: revisão final

## Texto

Revisão com `design:ux-copy`. Tom do site (direto, sem exclamação, "você"). Só linhas que mudam; o resto (introdução,
legendas, contador, avisos de validação, `Enviando…`, agradecimento, `feedback.sub`) ficou como está.

| Onde | Atual | Proposta | Motivo |
| --- | --- | --- | --- |
| Aviso de dados (`paginas/feedback.html`) | tirar dúvida sobre | tirar dúvidas sobre | plural natural |
| Aviso de dados e "indisponível" | escreva a lina.pesquisa@… | escreva para lina.pesquisa@… | regência mais comum, leitura direta |
| Botão após envio | Mandar outra | Enviar outra mensagem | mesmo verbo do botão `Enviar`; diz o que envia |
| Falha de envio (`FALHA`) | Não foi possível enviar agora. Tente de novo em instantes. | Não foi possível enviar agora. Sua mensagem continua no formulário; tente de novo em instantes. | tranquiliza: texto não se perdeu |
| Link do menu (`sistema.py`) | Apontar erro nesta página | Feedback sobre esta página | o formulário aceita 3 tipos, não só erro; casa com o nome da página |
| Frase da home (`sistema.py`) | Viu um erro ou sentiu falta de algo? Conte para a equipe. | Viu um erro, sentiu falta de algo ou tem uma sugestão? Conte para a equipe. | cobre os 3 tipos, igual à introdução |

Texto final do link do menu: Feedback sobre esta página
Frase da home: Viu um erro, sentiu falta de algo ou tem uma sugestão? [Conte para a equipe].

## Acessibilidade

Revisão WCAG 2.1 AA (`design:accessibility-review`) pelo código e por render headless (1280/390 px de `feedback.html` e `index.html`). Estados erro, enviando, enviado e indisponível julgados pelo código; conferência no navegador na Tarefa 3.

| Achado | Critério | Correção ou pergunta |
| --- | --- | --- |
| `#fb-status` não esvaziava ao voltar a digitar; erro repetido não era anunciado | 4.1.3 | Corrigido: `input` do form zera `#fb-status` (`liga`) |
| Campos sem `required` (só "Página (opcional)" marcava estado) | 3.3.2, 1.3.5 | Corrigido: `required` nos 3 rádios, mensagem, nome, e-mail; `novalidate` mantido; "(opcional)" marca o resto como obrigatório |
| `.feedback-aviso:focus{outline:none}` escondia o foco do agradecimento | 2.4.7 | Corrigido: regra apagada |
| Bordas de input/textarea com `--fio-b1` (1,4:1) | 1.4.11 (3:1) | Corrigido: `#fb :is(input,textarea):not([type=radio]){border-color:var(--t2)}` (6,3:1); erro segue com borda 2px ferro |
| "Enviando…" só no texto do botão desabilitado; nada anunciado | 4.1.3 | Corrigido: `#fb-status` recebe "Enviando…" antes do envio |
| Falha de envio: botão desabilitado tinha o foco, que se perdia | 2.4.3 | Corrigido: `botao.focus()` no ramo `FALHA` (nos ramos de campo o foco vai ao campo) |
| Bloco Feedback da home em `<p>` maior que a lista de Ferramentas | 1.3.1 (consistência), pergunta do 09 | Corrigido: `<ul class="regras"><li>` (mesmo molde de Ferramentas) |
| Contraste: ferro/creme 6,6:1 (status, foco); `--t2` 6,3:1 (contador, aviso) | 1.4.3 | Passa |
| Alvos 44 px no celular: rádios (rótulo inteiro), campos, botões (`--cell`) | 2.5.5 | Passa |
| Rádios, rótulos `for`, `fieldset/legend`, `autocomplete` (nome, e-mail), `aria-invalid` + texto no erro; isca `aria-hidden` com `tabindex=-1` | 1.3.1, 3.3.1, 4.1.2 | Passa |
| `#fb-ok` sem `role`/`aria-live`: anúncio depende do foco programático | 4.1.3 | Sem mudança; leitor de tela na Tarefa 3 |
| Pergunta: anel do foco no `#fb-ok` (container) é o do navegador, não o ferro do site (`.feedback-aviso :focus-visible` só pega filhos) | 2.4.7 passa | Gosto: estender o anel ferro ao container? |
| Pergunta: borda do botão `Enviar` (`--fio-b1`) quase some no creme; rótulo identifica, então passa | 1.4.11 passa | Gosto: reforçar a borda dos botões do site? Vale para `.ferramenta` também |

## Verificação

2026-11-28, `localhost:8765`, `fetch` trocado na página só onde indicado.

- `node --test "ferramentas/test/*.test.mjs"` 95/95; `python3 sistema.py` ok; `node ferramentas/tokens.mjs --check` 0.
- Envio vazio: "Escolha o tipo da mensagem.", foco no tipo, nenhum evento `invalid` (sem bolha do navegador).
- Digitar limpa `#fb-status`; o mesmo erro volta a ser escrito no envio seguinte.
- Enviando: `#fb-status` e botão com "Enviando…", botão desabilitado.
- `fetch` que rejeita: aviso de falha, mensagem mantida, foco no botão reabilitado.
- `{ok:true}`: agradecimento visível, form oculto, foco em `#fb-ok`; `:focus-visible` falso após clique, verdadeiro após Enter pelo teclado (anel do navegador; ver pergunta em Acessibilidade).
- "Enviar outra mensagem": form volta vazio, status limpo, foco na mensagem.
- `data-url` vazia: aviso de indisponível, form oculto.
- Teclado: ordem tipo, página, mensagem, nome, e-mail, link do e-mail no aviso de dados, Enviar; isca `site` com `tabindex=-1`.
- 390 px: `scrollWidth` 390 em `feedback.html` e `index.html`; rádios com rótulo de 346×44; demais alvos ≥ 44 px (link da home é inline no texto, isento pelo 2.5.8).
- Link "Feedback sobre esta página" em `cores.html` abre `feedback.html?pagina=cores.html` e preenche Página.
- Home: bloco em `<ul class="regras">`.

Renders em [`10-render/`](10-render/): `feedback` (inicial e `-enviado`) e `index`, 1280 px (`-desktop`) e 390 px (`-celular`).

Pergunta do texto (revisão da Tarefa 1): `feedback.sub` ("Aponte um erro ou diga o que falta no sistema.") cita 2 dos 3 tipos; a introdução e a home citam os 3. Manter ou incluir sugestão?
