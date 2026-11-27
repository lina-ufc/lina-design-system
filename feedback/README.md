# Feedback do site: script da planilha

O formulário de feedback do site envia cada mensagem para um script do Google (Apps Script) que mora na planilha de feedback, no drive compartilhado. O script confere os campos, grava uma linha na planilha e avisa você por e-mail.

URL atual do script (publicada; não é segredo):

```
https://script.google.com/macros/s/AKfycbwVqwfS9E34MNErfbTD3WlzPNOh_uQsns9n0QmDaeTMOwRWZkwK2Vzy_B8-IOKEV909jg/exec
```

O código está em `feedback/apps-script.gs`.

## Atualizar o script

Faça isto sempre que `feedback/apps-script.gs` mudar.

1. Abra a planilha de feedback no drive compartilhado.
2. Menu **Extensões › Apps Script**.
3. Apague o código que está no editor e cole o conteúdo inteiro de `feedback/apps-script.gs`. Salve (Ctrl/Cmd+S).
4. Clique em **Implantar › Gerenciar implantações**.
5. Na implantação existente, clique no lápis (editar).
6. Em **Versão**, escolha **Nova versão**. Confira que "Executar como" é você e "Quem pode acessar" é **Qualquer pessoa**.
7. Clique em **Implantar**.

A URL não muda. Não use "Nova implantação": isso cria outra URL e o site deixa de funcionar até você trocá-la.

## Desligar o e-mail ou mudar os tetos

No topo de `apps-script.gs` há três valores. Depois de mudar, siga "Atualizar o script".

- `AVISA = true`: troque por `false` para parar de receber e-mail. As linhas continuam sendo gravadas.
- `TETO_EMAIL = 20`: depois de tantos envios no mesmo dia, o script grava mas não manda mais e-mail.
- `TETO_GRAVA = 200`: depois de tantos envios no mesmo dia, o script descarta o que chegar. O dia conta pelo horário de Fortaleza.

## Acompanhar os envios

Cada envio vira uma linha na primeira aba da planilha. Colunas: Data, Tipo, Página, Mensagem, Nome, E-mail, Situação.

A coluna **Situação** começa sempre como `nova`. Quando tratar o pedido, troque na própria célula por:

- `feita`: já resolvido;
- `descartada`: não vai ser feito.

O script não lê essa coluna depois; ela serve só para você se organizar.

## Onde a URL vai no site

1. Abra `sistema.json` e ponha a URL na chave `feedback_url`.
2. Rode `python3 sistema.py` para regenerar as páginas.

Como a URL não muda ao atualizar o script, isso só é preciso uma vez (ou se alguém criar uma implantação nova).
