# Feedback do site · design

Data: 2026-11-27. Aprovação do dono: pendente.

## Intenção

Qualquer visitante do site do LINA Design System pode apontar um erro ou dizer que falta algo. O dono junta essas
mensagens numa lista e usa a lista, mais tarde, como fila de melhorias. Não é canal de conversa nem suporte: não há
resposta obrigatória nem prazo.

## Metas

- Visitante manda mensagem sem sair do site e sem criar conta.
- Visitante se identifica com nome e e-mail (obrigatórios).
- Cada mensagem chega numa planilha do Google na conta do dono, uma linha por mensagem, com a página de onde veio.
- Entrada visível na página inicial e, em toda página, um link que já traz o endereço da página.
- Página no estilo do sistema (tokens e componentes do site), em pt-BR.

## Fora do escopo

- Responder ao visitante pelo site, painel de gestão, votos, lista pública de pedidos.
- Anexo de imagem ou captura de tela.
- Contas, login, captcha de terceiros.

## Antimetas (falhou mesmo funcionando, se...)

- Expor chave, token ou e-mail do dono no código do site.
- Publicar nome ou e-mail de quem enviou.
- Formulário com cara de Google ou de outro serviço, fora do sistema.
- Visitante sem saber se a mensagem chegou.

## Restrições

- Site estático no GitHub Pages (`.github/workflows/site.yml`), gerado por `sistema.py` a partir de `sistema.json`.
  Sem servidor próprio.
- Páginas próprias seguem o padrão das ferramentas: fragmento em `paginas/`, entrada em `sistema.json`, página
  gerada na raiz.
- LGPD: dizer para que serve o e-mail e que não é publicado.
- Cotas do Apps Script (conta Google comum: 100 e-mails por dia; Workspace: 1500). Volume esperado: poucas mensagens
  por semana.

## Abordagens

| | Como | Troca |
|---|---|---|
| A | Link para Google Forms, respostas em planilha | Quase sem código; visitante sai do site, formulário com cara de Google |
| **B (escolhida)** | Formulário próprio no site envia para um Apps Script na conta do dono, que grava na planilha | Página no estilo LINA e página de origem automática; ~30 linhas de script que o dono publica uma vez |
| C | Formulário próprio enviando a Formspree/Web3Forms | Plano grátis limitado, dados fora da UFC, lista no e-mail |

Issues do GitHub descartadas: sem servidor, a chave ficaria exposta no site. O dono escolheu B em 2026-11-27,
porque um sistema de design com formulário de outra marca destoa. A fica como reserva se o script der problema.

## Decisões do dono

- Abordagem B.
- Qualquer visitante pode enviar; nome e e-mail obrigatórios.
- Entrada apontada na página inicial; página própria.
- Conta: Google Workspace da UFC. A planilha (com o script ligado a ela) fica num drive compartilhado, aberta só a
  quem precisa. Cota de e-mail: 1500 por dia.
- Contato público no aviso de dados: `lina.pesquisa@iaud.ufc.br` (pedir exclusão de nome e e-mail).

## Desenho (propostas do construtor, corrigíveis)

**Página `feedback.html`** (gerada por `sistema.py`, fragmento `paginas/feedback.html`, título "Feedback" ou o que a
revisão de texto definir). Campos, nesta ordem:

1. Tipo: três opções exclusivas — Erro · Falta algo · Sugestão (obrigatório).
2. Página: endereço da página de origem, preenchido pelo parâmetro `?pagina=` e editável; vazio se o visitante
   veio direto.
3. Mensagem: texto livre, obrigatório, até 2000 caracteres, com contador.
4. Nome: obrigatório, até 120 caracteres.
5. E-mail: obrigatório, `type="email"`.
6. Campo-isca invisível (`name="site"`, fora da tela, `tabindex="-1"`, `autocomplete="off"`): se vier preenchido,
   o script descarta.
7. Aviso curto: o e-mail serve só para a equipe tirar dúvida sobre a mensagem; nada é publicado; dados guardados
   pelo LINA (UFC) numa planilha interna; para apagar, escrever a `lina.pesquisa@iaud.ufc.br`. Responsável pelos
   dados: LINA/UFC (chamada do construtor).
8. Botão Enviar. Estados: enviando (botão desativado), enviado (mensagem de agradecimento no lugar do formulário,
   com link "Mandar outra"), falha (aviso em `aria-live`, texto mantido, botão volta).

**Envio.** `fetch(URL, { method: 'POST', body: new URLSearchParams(dados) })`: pedido simples, sem preflight.
O Apps Script responde JSON `{ ok: true }` ou `{ ok: false, erro }`. URL do script em `sistema.json`
(`feedback_url`), injetada na página pelo `sistema.py`. A URL não é segredo: quem a tiver só consegue gravar linhas.

**Apps Script** (`feedback/apps-script.gs`, versionado no repo, publicado pelo dono como app da web, "qualquer
pessoa" pode acessar, executa como o dono):

- `doPost(e)`: lê `e.parameter`; descarta se a isca veio preenchida (responde `ok` para não ensinar o robô);
  valida obrigatórios e tamanhos; grava linha: data e hora, tipo, página, mensagem, nome, e-mail, situação
  (`nova`). Coluna situação é para o dono marcar depois (nova · feita · descartada).
- Avisa o dono por e-mail a cada mensagem (`MailApp.sendEmail`), com tipo, página e mensagem. Constante no topo
  para desligar.
- Planilha: a que contém o script (script ligado à planilha), sem ID no código.

**Pontos de entrada.**

- Página inicial: bloco curto depois de Ferramentas, com uma frase e link para `feedback.html`.
- Toda página gerada: link "Apontar erro nesta página" no fim do menu lateral, para `feedback.html?pagina=<arquivo>`.
  A própria `feedback.html` não leva o link.

**Instruções ao dono** (`feedback/README.md`): criar a planilha, abrir Extensões › Apps Script, colar o arquivo,
publicar como app da web, copiar a URL para `sistema.json`, rodar `python3 sistema.py`. Inclui como republicar
depois de mudar o script.

## Decisões do construtor (revisão de 2026-11-27, corrigíveis)

- **Sem URL, sem entrada.** Enquanto `feedback_url` estiver vazia, `sistema.py` não põe o bloco na página inicial nem
  o link no menu; `feedback.html` é gerada mesmo assim e mostra aviso de indisponível. Assim o código pode ir ao ar
  antes de o dono publicar o script.
- **Chave própria.** `feedback` vira chave nova em `sistema.json` (arquivo, nome, fragmento), fora de `ferramentas`:
  não aparece no grupo Ferramentas do menu.
- **Teto contra robôs.** Além da isca, o script conta envios do dia (`PropertiesService`): acima de 20, para de mandar
  e-mail ao dono; acima de 200, para de gravar e responde `ok`. Números em constantes no topo.
- **`?pagina=`** leva só o nome do arquivo (`cores.html`), sem âncora.

## Risco a testar primeiro

O administrador do Workspace da UFC pode proibir app da web com acesso de "Qualquer pessoa". Primeira tarefa do
plano: o dono publica um script vazio na planilha do drive compartilhado e confere se a opção aparece e se uma
chamada anônima responde. Se não, o plano troca para a abordagem A antes de qualquer código.

## Fica com o construtor

- Texto final da página e do aviso (passar por `design:ux-copy`).
- Layout da página dentro do padrão `section.pagina-ferramenta`.
- Onde o bloco entra exatamente na página inicial.
- Teste do JS que monta e valida os dados (Node, como em `ferramentas/test/`).
- Comportamento sem `feedback_url` configurada: página mostra aviso de indisponível e não envia.

## Verificação

- Teste em Node da validação e da montagem do envio.
- No navegador, com o script publicado pelo dono: envio real chega à planilha; isca preenchida não grava; falha de
  rede mostra aviso; leitores de tela anunciam estados; sem rolagem lateral em 390 px.
- `design:accessibility-review` na página antes de dizer pronto.
