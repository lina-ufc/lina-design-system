# 05 — Verificação, acessibilidade e perguntas ao dono

Data: 2026-11-27. Branch `revisao-site/05-visual`. Renders em `05-render/` (`ref-logotipo-*` = protótipo aprovado).

## Checagens

- `python3 capitulos/templates/_gerar.py && python3 sistema.py`: 11 capítulos, 57 entradas, 38 links, 8 redirecionamentos, `llms.txt` 62 links. Molde em Logotipo, Cores, Tipografia, Padrões, Ícones, Componentes.
- `node --test "ferramentas/test/*.test.mjs"` 56/56; `node ferramentas/tokens.mjs --check` 0; `!important` em `site.css`: 0.
- Navegador, 375 px: `scrollWidth` = 375 nas 12 páginas (antes da correção: Princípios 422, Ícones 424, Recursos 379).
- Foco por teclado visível (ferro 2 px); `aria-current` no capítulo atual; pranchas roláveis com `tabindex`, `role`, `aria-label`.
- Nenhum `canvas`/`svg`/campo com tamanho zero (achado e corrigido: trama de Templates sem pontilhado, `d54ad2a`).

## Achados de critério da revisão (sonnet, a11y + crítica), corrigidos

| # | Problema | Correção |
| --- | --- | --- |
| 1 | `.ficha dt` a 4,29:1 | `color:var(--t2)` (6,31) |
| 2 | Paleta 3.1, turquesa: `.dado` 3,99 e descrição 4,40 | opacidade 1 (5,79) |
| 3 | Princípios 1.2: `h2` e `p` com inline vencendo o B1 | inline de tipo removido |
| 4 | Mapa da home: células vazias mostravam o fio oliva | fundo creme, fio por célula, sem raio |
| 5 | Mapa no celular: links de 28 px | 44 px |
| 6 | Recursos: links de `.spec` com 14 px | 44 px |
| 7 | Sumário só abria com JS; sem link de salto | `details open` no HTML, JS fecha no celular; `aria-label`; "Pular para o conteúdo" |

Links em frase (home "Por onde começar", texto de Princípios) ficam abaixo de 44 px: isentos (WCAG 2.5.8, link em linha).

## Contraste (medido; transparência composta)

umbro/creme 15,09 · `--t2`/creme 6,31 · ferro/creme 6,61 · `--t2`/cruzamento da retícula 4,61 · ferro/cruzamento 3,75 (só foco, pede 3:1) · `.faca-nao::before` 4,57 · Tipografia `.cap` creme/ferro 6,61, turquesa tinta/turquesa 5,79 · Cores 3.8 areia/ferro 4,64. Matriz 3.4, pares 3.5/3.6 e "Some/Vibra/Afunda" são conteúdo.

## Para o dono decidir (gosto ou conteúdo)

1. **Regras escolhidas pelos agentes** (só frases que já existiam): 2.8 Formas derivadas, 6.7 Campo animado e 6.8 Opções de cor soam pouco normativas. Manter ou `livre`?
2. **Cores 3.5 e 3.6** ficaram `livre`, separadas. Fundir numa seção com Faça e não faça (some `#s-contrastes-a-evitar`; link do Logotipo ajustado)?
3. **Ícones**: Opacidade original virou seção própria (8.4); regra de 8.6 tem duas frases ("Nenhum emoji. Nenhum outro conjunto…"). Manter?
4. **Logotipo 2.9**: pranchas Faça/Não faça coladas e legendas apertadas (já na referência). Separar em duas colunas de ladrilhos?
5. **Componentes no celular**: recortes de slide ilegíveis (~300 px). Aceitar ou rolar dentro da prancha?
6. **"Citado em" no celular**: com 44 px por link, o "·" sobra no fim da linha. Um link por linha?
7. **Padrões 6.2 no celular**: ladrilho que rola sem indício de que há mais. Pôr sombra de borda?
8. **Templates**: "Versão 2.0.1 · histórico" em mono 17 px sublinhado, pesado. Corpo menor?
9. **Cores 3.8**: barras sem raio; rótulo "Dado" em turquesa tinta (ferro sobre turquesa é par a evitar).
10. Baixar do Logotipo cita "(4.6)" como texto (link dentro de link não pode); o número não se atualiza sozinho.
