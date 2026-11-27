# 02 — Revisão de design e acessibilidade (tarefa 3)

Data: 2026-11-27. Revisor independente (sonnet, `design:design-critique` +
`design:accessibility-review`), só leitura, sobre `prototipo/b1.css` em `dc1d0c4` e os renders
`prototipo/render/{antes,b1}-{desktop,celular}.png`. Medições no Chrome headless.

## Passa sem achado

- Critérios 1, 5, 8 (sem rolagem lateral em 390 px; sumário com 59 links de 44 px).
- Foco 1 (texto secundário 6,65:1), foco 4 (nenhuma imagem ou SVG distorcido, ≤ 0,6 %),
  foco 5 (página atual idêntica ao pixel).

## Achados de critério (corrigidos nesta tarefa)

| # | Critério | Problema | Correção |
| --- | --- | --- | --- |
| C1 | 4, 9 | Baixar 1.8: `<a>` dentro de `<a>` parte o 2º item | `montar.sh` tira o link interno na cópia; o 05 conserta o fragmento |
| C2 | 3, foco 2 | Faixa da margem nasce no topo do `main`; retícula de cada prancha nasce na prancha; linhas não continuam | Faixa por prancha (`::before` à esquerda, mesma origem) |
| C3 | 3, foco 2 | Grade amarela dos diagramas e retícula cinza com origem/passo diferentes (moiré em 1.6) | SVG dos diagramas sobre fundo branco; retícula só em volta |
| C4 | 7 | Placas "Não recomendáveis" quase do tamanho antigo (148 px) | `#comb-evitar` em 4 colunas no desktop |
| C5 | 6 | 70ch rende ~96 caracteres por linha em Outfit 17 px | `max-width` ≈ 52ch (~70 caracteres) |
| C6 | 6 | Prancha de 1.2 encolheu o SVG (254 → 210 px) | Coluna do diagrama alargada |
| C7 | 9 | Setas `#C9B87A` de 1.1 a 1,98:1 sobre branco | Setas em texto secundário |
| C8 | 2 | Anotações de 1.4 em ferro (não é logo nem rótulo) | Anotações em umbro |
| C9 | 9 | Capítulo atual do sumário marcado só por cor (WCAG 1.4.1) | Peso maior no atual; o 05 põe `aria-current` no gerador |
| C10 | 8 | No celular, rótulos de 1.1, 1.5, 1.6 com ~5 px | Abaixo de 600 px, rolagem dentro da prancha com largura mínima do SVG; o 05 põe `tabindex="0"` |
| C11 | 2 | `.k` em caixa-alta mostra "N" para a letra n em 1.4 (já existia) | `text-transform:none` nesse rótulo |

## Perguntas de gosto ao dono (não aplicadas)

1. **Remendos.** Legendas com fundo branco cortam a retícula em faixas (1.3, 1.4, 1.7, 1.8).
   Alternativa: cada figura vira ladrilho branco e a retícula só aparece nos vãos e na moldura.
2. **Tamanho dos diagramas** de 1.3, 1.4 e das assinaturas de 1.7: continuam do tamanho
   antigo, com muita retícula vazia. Aumentar?
3. **Ritmo.** Folgas de 3 células entre seções deixam a página 47 % mais longa. Reduzir para 2?
4. **Hierarquia.** Numeral de seção (88 px, peso 500) pesa mais que o título (32 px, 800).
   Manter (cara de manual) ou numeral de 66 px?
5. **Ponto do mono.** "1.1" em mono lê "1 . 1". Aceitar?
6. **Peso 300** em `.citado` e `.dado` (12–13 px): subir para 400?
7. **Fio de navegação** "← anterior / próximo →" com 2 px começa fora da coluna de texto.
   Alinhar à coluna e 1 px?
8. **Toque no celular:** "Citado em" e anterior/próximo com 26–27 px de altura. Subir para 44?

## Para o subplano 05 (só o fragmento resolve)

- Baixar de 1.8 com `<a>` aninhado (C1).
- Estilos inline de grade, tamanho e margem nos fragmentos de 1.2, 1.3, 1.6, 1.7, 1.8 (14
  `!important` no protótipo).
- Diagramas 1.1, 1.5, 1.6 com largura fixa em px; no celular, refazer fluidos ou empilhados.
- Diagramas com unidades diferentes (s = 22, 24, 34, 44): só 44 casa com a retícula.
- `aria-current` no sumário; `tabindex="0"` nas pranchas roláveis.

## Contraste (WCAG, transparência composta sobre o fundo real)

| Par | Razão | ≥ 4,5 |
| --- | --- | --- |
| umbro / branco | 16,73 | sim |
| texto secundário (umbro .72) / branco | 6,65 | sim |
| ferro / branco (rótulos, atual, foco) | 7,33 | sim |
| umbro / cruzamento da retícula | 9,41 | sim |
| texto secundário / linha de célula | 4,95 | sim |
| texto secundário / cruzamento | 3,74 | não (protegido pelo fundo branco da legenda) |
| ferro / cruzamento | 4,12 | não (idem) |
| `#796D56` numerais 1.6 / branco | 5,08 | sim |
| `#796D56` / retícula ou `--fio` | 2,86–3,78 | não (resolvido por C3) |
| `#C9B87A` setas 1.1 / branco | 1,98 | não (C7) |
| texto secundário com alfa .62 / branco | 4,75 | sim, margem pequena |

Pares rotulados em 1.8: os 14 batem com os valores impressos (diferenças só de arredondamento).
Não medido: larguras entre 391 e 820 px.
