---
name: economia-tokens
description: Revisar slides do CNR com prever.sh (uma chamada, prévia pequena); não ler HTML gerado nem imagens grandes
type: regra
---

Usuário pediu economia de tokens (2026-11-13). Causas do gasto: ler o `Apresentacao-CNR.dc.html` inteiro (~50 KB), imagens de prévia grandes (1200 px), build + cópia + servidor + captura em várias chamadas, saídas longas de `sed`/`grep` em `cnr.js`.
Como fazer: `sh templates/apresentacao/_teste-aplicacao/prever.sh <slide> [ms ...]` faz build, copia HTML para o Drive, captura e monta `$TMPDIR/lina-prev/prev.png` (~320 px por quadro). Olhar só essa imagem. Nunca ler o HTML gerado; usar `grep -c`/`grep -o` curto. Editar `cnr.js` com Edit em trechos pequenos. Respostas: resultado em 2–4 linhas.
