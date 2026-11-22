---
name: builder-sem-terminal
description: cavecrew-builder não roda código; gerador novo vai para agente com Bash
type: regra
---

Erro em 2026-11-22 (plano 02, gerador Word): o `build.js` foi dado ao `cavecrew-builder`, que não
tem terminal. Ele leu os tipos inteiros do `docx` para conferir a API e escreveu 450 linhas sem
rodar: 12 minutos, cerca de 190 mil tokens, e cada erro precisou voltar pelo controlador. O usuário
achou o tempo absurdo para um template de documento.

**Why:** sem Bash não há ciclo escrever, rodar e corrigir; leitura de `.d.ts` grande é cara e inútil.

**How to apply:** código que precisa rodar para ser verificado vai para `general-purpose` com
`model: sonnet` (tem Bash). `cavecrew-builder` só para edição pequena que o controlador confere
com um comando. Dar ao agente os nomes de API ou mandar `grep` no símbolo, nunca ler o `.d.ts`
inteiro. Regra completa em `docs/guidelines/delegacao.md`.
