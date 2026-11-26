# Registro 06 · Regressão CNR e Vision

2026-11-26. Gerador v2 (`templates/apresentacao/potx/build.js`) contra os decks antigos. Cópias de trabalho no scratchpad da sessão
(`…/scratchpad/regressao/`); as pastas do Drive não foram tocadas. Pranchas lado a lado (PDF antigo × PDF novo, LibreOffice) em
`…/regressao/cnr/novo/sheet-*.png` e `…/regressao/vision/<talk>/novo/sheet-*.png`.

Rodar cada deck: `DECK=<deck.js> FOOT="<rodapé>" node build.js`, depois `apply_theme.js`, `post.py`, `validate.py`, `aspect.py`, `soffice`.
O Vision usa os mesmos passos do `build.sh` dele, sem a cópia para o Drive. Ajustes só na cópia: CNR com o caminho de `assets/logos`
absoluto; Vision com o link `[2026-11-13] CNR…` apontando para a cópia do CNR (o `lab.js` lê `equipe/` de lá).

## Resultado

| Deck | Slides antes → depois | Erro | validate | aspect | Diferenças visuais (não são quebra) |
| --- | --- | --- | --- | --- | --- |
| CNR | 15 → 15 | não (depois das correções) | ok | 0 | título do slide 6 não quebra mais em duas linhas; tabela e figuras com a mesma geometria; slide 4 ver abaixo |
| Vision 01 documenta-ceara | 14 → 14 | não | ok | 0 | título da capa em 56 (mais de 60 caracteres), 2 linhas em vez de 3 |
| Vision 02 parametric-hbim | 18 → 18 | não | ok | 0 | nenhuma visível |
| Vision 03 thermal-point-clouds | 20 → 20 | não | ok | 0 | título da capa menor, 2 linhas em vez de 3 |
| Vision 04 masonry-inspection | 15 → 15 | não | ok | 0 | título da capa menor, 2 linhas em vez de 3 |
| Vision 05 climate-vulnerability | 18 → 18 | não | ok | 0 | nenhuma visível |

## Quebras do gerador (corrigidas em `build.js`)

1. **Imagem distorcida (CNR, slide 2).** O fill `{ img, box }` no formato antigo (imagem já ajustada, centrada na célula) tinha a caixa
   trocada pela do espaço do layout. Agora só a imagem nova (`cover`) ou sem caixa (`ic()` com caixa zerada) toma a caixa do espaço.
2. **`notes()` do `lib.js` do Vision.** Conta e anota `pres.slides`, que fica vazio até depois do deck (`0 slides`). O `pres` entregue ao
   `DECK` agora devolve um registro por `s()` que guarda a nota.
3. **Capa com `Autores 1` e `Autores 2` e poucos nomes (Vision 03 e 04, `1.4 Capa · autores`).** 2 + 1 nomes caíam numa coluna só e
   `Autores 2` virava erro. `conta()` agora pede ao menos uma coluna a mais por chave (`1.2` e `1.3`; `6.2` já fazia isso).

## Não é quebra do gerador

- **CNR slide 4 (abertura com logo e letreiro).** O PNG do PPTX (`recortes/_logo-creme.png`) sai com o letreiro enorme. O `cnr.js` lê
  `assets/logos/sand/lina-assinatura-en-bloco-creme.svg` e supõe 15 unidades por unidade do logo; o SVG foi refeito no commit
  `1a4cf6c` (viewBox 1222 × 763, 63 caminhos) e a conta deixou de valer. O HTML não usa o PNG. Para o deck CNR gerar de novo,
  `cnr.js` precisa da escala nova (fora do escopo; o Drive é só leitura).
- **CNR slide 8 (4.8 com vídeo):** faixas pretas laterais no PPTX são intencionais (comentário do próprio `cnr.js`).
- **Recortes do slide 7 do CNR e tamanho de texto do slide 13:** diferem do PDF antigo, mas o XML tem os mesmos `sz`; vem do
  renderizador (o PDF antigo não saiu do LibreOffice).
- Exemplo do repo (`make.sh`): PDF idêntico, página a página, antes e depois das correções.

## Checagens finais (`sh templates/apresentacao/potx/make.sh`)

`All validations PASSED!` ×2, `distorcidas: 0`, `check ok`.
