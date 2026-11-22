---
name: ds-capitulos-paginas
description: Documento do sistema em páginas por capítulo (fragmentos em capitulos/), não em cartões com quadro; aprovado em 2026-11-22
type: regra
---
O documento do sistema deixou de ser uma grade de cartões (iframes de 900px). Cada capítulo é uma página (`<n>-<nome>.html`) montada por `sistema.py` a partir de fragmentos em `capitulos/<n>-<nome>/`. Piloto: Tipografia; o usuário aprovou e os demais foram migrados no mesmo dia.

- Conteúdo novo: escrever fragmento (sem `<html>`/`<head>`), registrar em `sistema.json` com `secao`.
- Quadro (`arquivo` + `vista`) só para documento inteiro: decks, A4.
- Fragmentos convertidos dos cartões usam ids prefixados pelo nome da seção e `<script>{…}</script>` em bloco, porque dividem a página.
- Cartões antigos (`guidelines/*.html`, `card.css`) foram para a Lixeira em 2026-11-22; `lina-draw.js` continua em uso, movido para `assets/` em 2026-11-22.
- Home = Preâmbulo (`index.html`) + mapa dos capítulos 1–8 (2026-11-22). Estrutura de wiki: link comum entre seções (`href="2-cores.html#s-paleta-auxiliar"`); `sistema.py` falha em link quebrado e gera "Citado em" no pé da seção alvo.
