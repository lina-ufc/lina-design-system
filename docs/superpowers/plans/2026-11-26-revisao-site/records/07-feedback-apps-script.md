# 07 — Feedback: acesso anônimo e Apps Script

## Tarefa 1 — acesso anônimo (2026-11-27)

Dono criou a planilha `LINA · Feedback do site` no drive compartilhado da UFC e publicou o app da web com
acesso "Qualquer pessoa". A abordagem B segue.

URL: `https://script.google.com/macros/s/AKfycbwVqwfS9E34MNErfbTD3WlzPNOh_uQsns9n0QmDaeTMOwRWZkwK2Vzy_B8-IOKEV909jg/exec`

`curl -sL -d 'x=1' '<URL>'`, sem login: `{"ok":true}`.

## Tarefa 3 — script real publicado (2026-11-27)

Dono colou `feedback/apps-script.gs` e publicou nova versão (mesma URL). Envios de fora:

| Caso | Resposta |
| --- | --- |
| válido | `{"ok":true}` |
| tipo `Elogio` | `{"ok":false,"erro":"tipo"}` |
| isca `site=robo` | `{"ok":true}` (1ª tentativa: página de erro INTERNAL do Google ao ler o armazenamento; repetido 2×, ok) |
| vazio | `{"ok":false,"erro":"tipo"}` com `curl -sL -d ''` |

`curl -X POST` com `-L` força POST no redirecionamento do Apps Script e cai em "página não encontrada"; o navegador
segue com GET, como `-d ''`. Comando do plano corrigido.

Dono confirmou: cabeçalho + uma linha (`Teste do plano 07`, `nova`) e e-mail recebido. Linha de teste a apagar pelo dono.
