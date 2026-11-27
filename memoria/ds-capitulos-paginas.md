---
name: ds-capitulos-paginas
description: Documento do sistema em páginas por capítulo (fragmentos em capitulos/), não em cartões com quadro; aprovado em 2026-11-22
type: regra
---
O documento do sistema deixou de ser uma grade de cartões (iframes de 900px). Cada capítulo é uma página (`<id>.html`, sem número) montada por `sistema.py` a partir de fragmentos em `capitulos/<id>/`; o número vem da ordem em `sistema.json`. Piloto: Tipografia; o usuário aprovou e os demais foram migrados no mesmo dia.

- Conteúdo novo: escrever fragmento (sem `<html>`/`<head>`), registrar em `sistema.json` com `secao`.
- Quadro (`arquivo` + `vista`) só para documento inteiro: decks, A4.
- Fragmentos convertidos dos cartões usam ids prefixados pelo nome da seção e `<script>{…}</script>` em bloco, porque dividem a página.
- Cartões antigos (`guidelines/*.html`, `card.css`) foram para a Lixeira em 2026-11-22; `lina-draw.js` continua em uso, movido para `assets/` em 2026-11-22.
- Home = porta de entrada (`capitulos/inicio.html`) + mapa por parte; quatro partes, 11 capítulos (2026-11-27). Páginas velhas (`1-logotipo.html` etc.) redirecionam via `antigos` em `sistema.json`. Estrutura de wiki: link comum entre seções (`href="cores.html#s-paleta-auxiliar"`); `sistema.py` falha em link quebrado e gera "Citado em" no pé da seção alvo.
