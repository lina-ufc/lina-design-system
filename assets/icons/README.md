# Ícones

Sistema: **[Phosphor](https://phosphoricons.com)**, licença MIT (`phosphor/LICENSE`). Em linha, grade de 256
unidades desenhada para 24 px, cantos e pontas redondos. Todos os SVGs usam `fill="currentColor"` e herdam a cor.

| Peso | Pasta | Uso |
| --- | --- | --- |
| thin | `phosphor/thin/` | só grande (64 px ou mais): capas, aberturas |
| light | `phosphor/light/` | grande e médio, ao lado de Outfit Light |
| regular | `phosphor/regular/` | padrão: interface, documento, slide |
| bold | `phosphor/bold/` | pequeno (até 20 px) e sobre fundo de cor |
| fill | `phosphor/fill/` | estado ativo, ladrilho sólido, marcador |
| duotone | `phosphor/duotone/` | destaque: traço numa cor, plano em outra |

Um peso por peça; a exceção é o estado ativo (regular para fill).

**Duotone em cor.** O plano vem com `opacity="0.2"`. No LINA ele recebe uma segunda cor cheia da paleta, com
opacidade 1, seguindo os pares de contraste (`cores.html#s-contrastes-a-usar`) (ferro · damasco sobre creme é o par padrão). Evitar
ferro com turquesa (vibra) e tons vizinhos como damasco com areia (some). Em uma cor só, manter os 20%.

**Ícone novo.** Baixar o mesmo nome nos seis pesos de phosphoricons.com (ou do pacote `@phosphor-icons/core`,
pasta `assets/<peso>/`) para `phosphor/<peso>/<nome>.svg`, sem alterar o desenho. Depois rodar
`capitulos/icones/_gerar.py` se ele entrar no capítulo.

**Tratamentos no slide** (um por slide): sólido (creme sobre ladrilho ferro), claro (ferro sobre ladrilho
damasco), duotone (ferro e damasco sobre creme) e simples (ferro). O ladrilho é um quadrado de cantos de ¼ do
lado, a regra do logotipo. No PowerPoint: Inserir › Imagens › SVG, converter em forma para pintar o plano do duotone.

Nenhum emoji, nenhum outro conjunto de ícones.
