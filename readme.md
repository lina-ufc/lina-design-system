# Sistema de design LINA

**LINA — Laboratório de Design da Informação: Arte · Arquitetura · Ambiente.** IAUD, Universidade Federal do Ceará.

O sistema está organizado em cinco partes, na ordem em que devem ser lidas. O documento do sistema (`index.html` e uma página por capítulo, geradas por `sistema.py`) desenha cada uma.

---

## 1 · Logotipo

O logotipo é **construído por uma regra**, não desenhado à mão.

- **Célula** — o bloco. Toda forma é uma união de quadrados deste tamanho; nenhum sólido é mais fino que uma célula.
- **½ célula** — a grade. Blocos ligados ficam a um número inteiro de meias células entre si; dentro de uma forma, o vão mínimo é ½.
- **¼ de célula** — o raio e a folga. Todo canto recebe um arco de ¼: cantos livres arredondam para fora, encontros para dentro. Formas distintas (as letras) ficam a ¼ uma da outra.
- **Contato pelo canto conta como ligação** e forma o pescoço — o pé do L, o ombro do n, o topo do A.

As letras: **L** (duas células em coluna + uma pelo canto), **I** (três células), **n** (ombro ligado pelo canto, vão de ½ em semicírculo), **A** (topo ligado pelo canto, contravão em cápsula ½ × 1, travessa de meia célula — a única peça desse tamanho). O n começa ½ célula abaixo: é a altura de x. O conjunto mede **8¾ × 3 células**.

Arranjos: **horizontal** (principal), **vertical** (LI sobre nA, a ¼) e **símbolo** (o L). Sempre em uma tinta. Arquivos em `assets/logos/sand/`; o traçador é `assets/lina-geometry.js`.

**Arquivos** (`assets/logos/sand/`, SVG, texto em contorno). Nome: `lina-<forma>-<cor>.svg`; `-sobre-` indica fundo incluído.

| Forma | Arquivo | O que é | Cores |
|---|---|---|---|
| Horizontal | `lina-horizontal-*` | logotipo principal | ferro, creme, umbro, turquesa, creme-sobre-ferro, creme-sobre-umbro, ferro-sobre-creme |
| Vertical | `lina-vertical-*` | LI sobre nA | ferro, creme, creme-sobre-ferro |
| Símbolo | `lina-marca-*` | o L | ferro, creme, umbro, turquesa, creme-sobre-ferro |
| Horizontal vazado | `lina-horizontal-vazado-*` | logotipo recortado de um retângulo de cantos arredondados | ferro, creme, umbro, turquesa |
| Vertical vazado | `lina-vertical-vazado-*` | vertical recortado de um quadrado de cantos arredondados | ferro, creme, umbro, turquesa |
| Símbolo vazado | `lina-marca-vazada-*` | o L recortado de um quadrado de cantos arredondados | ferro, creme, umbro, turquesa |
| Avatar | `lina-avatar-*` | o L sobre quadrado de cantos vivos, para perfil (WhatsApp, redes) | creme-sobre-ferro, creme-sobre-umbro, creme-sobre-turquesa, ferro-sobre-creme |
| Selo experimental | `lina-selo-experimental-*` | células do logotipo recortadas por um círculo | ferro, creme, umbro, turquesa |
| Assinatura | `lina-assinatura-{pt,en}-*` | horizontal + nome em duas linhas + "Arte·Arquitetura·Ambiente" | ferro, creme, umbro, creme-sobre-ferro, creme-sobre-umbro, ferro-sobre-creme |
| Assinatura em bloco | `lina-assinatura-{pt,en}-bloco-*` | horizontal + nome em bloco justificado entre o pé do L e a borda do A + "ARTE·ARQUITETURA·AMBIENTE" em versais | mesmas da assinatura |

Nome na assinatura: PT "Laboratório de Modelagem da Informação"; EN "Laboratory of Information Modeling". Ferro e turquesa levam o A em umbro; creme-sobre-ferro, em damasco; creme-sobre-umbro, em areia. Assinatura sem turquesa (contraste do texto). Vazados, símbolo, avatar e selo não têm texto: servem aos dois idiomas. Formas novas (vazados, avatar, selo, assinaturas) vêm do conjunto Affinity `set-completo_rev01`, recoloridas nos tokens.

**Logos institucionais** em `assets/logos-institutions/` (originais `.ai` e versões brancas PNG/SVG): brasão UFC (`brasao1`/`brasao3` horizontal, `brasao4` vertical), IAUD (`iaud-horizontal-branco`, fonte `logotipos iaud.ai`) e PPGAUD (`ppgaud-branco`, fonte `PPGAUD.ai`).

## 2 · Cores

**Principal** — ferro oxidado `#A81F0D`, areia `#E1CE7A`, creme `#FAF5C6`, damasco `#FDD692`, turquesa `#64B6AC`. Quatro quentes num arco de 7° a 54°; a turquesa (173°) é o único frio, quase complementar ao ferro e de saturação contida.

Referências: terra vermelha do sertão e telha (ferro); dunas e palha de carnaúba (areia); cal, algodão cru e renda de bilro (creme); caju, manga e luz de fim de tarde (damasco); mar raso, lagoas e portas pintadas (turquesa).

**Auxiliar** — umbro `#2A1A12` (texto), ferro fundo `#6E1408`, turquesa fundo `#2F6A62` (turquesa como texto), turquesa tinta `#14322E` (texto sobre turquesa), nata `#FDF1CF` (painéis), fio `#E6DFA2`, fio forte `#C9B87A`. Nenhum cinza.

**Contraste** — usar: umbro/creme 15,1 · ferro/creme 6,6 · umbro/damasco 12,1 · umbro/areia 10,6 · turquesa tinta/turquesa 5,8 · turquesa fundo/creme 5,6. Evitar para texto: ferro/turquesa (vibra), turquesa/creme, areia/creme, damasco/areia, ferro/umbro, turquesa fundo/ferro.

Tokens em `tokens/colors.css`.

## 3 · Padrões

O **pontilhado** é o padrão principal: o único que se move e o que carrega a identidade em capas, banners e peças grandes. **Dispersão** e **campo** são secundários, sempre ao lado do pontilhado, nunca no lugar dele.

**Regra do pontilhado.** Uma célula por posição, cada uma com um tom de 0 a 1 vindo de ruído. Abaixo de 0,62: ponto, de lado 0,26 + 0,65 × tom, raio limitado a ¼ (círculo pequeno, quadrado de cantos de ¼ grande), presente quando 16 × tom supera a matriz de Bayer 4 × 4. De 0,62 a 0,72: linhas de uma célula. De 0,72 a 0,90: pontes de células que se tocam pelo canto. Acima de 0,90: sólido. As células sólidas são unidas e traçadas pela regra do logotipo (cantos de ¼, pescoços); o ponto vizinho de um sólido encolhe para ½ célula.

Combinações monocromáticas (tom sobre tom: cor principal + par auxiliar), de duas cores (tinta e fundo distantes na escada de valor) e de três (fundo, tinta, acento em regiões que se misturam). Motor: `assets/lina-texture.js`.

## 4 · Animação

O pontilhado em movimento contínuo: `<lina-dither-field colors="…" background="…" cell="11" speed="1">` em `assets/lina-dither-field.js`. Redesenha a cada 40 ms a partir de ruído; as cores se misturam na fronteira; com `prefers-reduced-motion` ou o atributo `still`, um quadro estável.

## 5 · Tipografia

**Outfit** (OFL, livre), auto-hospedada em `assets/fonts/`, em três pesos: Light 300 (texto), Medium 500 (rótulos, títulos de página), Extra Bold 800 (títulos de seção, voz da marca). Nenhum itálico. Hierarquia: capa, título de página, título de seção, destaque, texto, legenda, etiqueta. Português do Brasil: vírgula decimal, frações como glifos (¼ ½), × com espaços, ponto médio como separador, caixa alta só em etiquetas de 11px.

**JetBrains Mono** (OFL, via Google Fonts, `--font-mono`) é a fonte auxiliar: dado, coordenada, escala, nome de arquivo, código. Pesos em par com a Outfit: Light 300, Medium 500, ExtraBold 800. Ligaduras de código desligadas em texto. Nunca em parágrafo.

Tokens em `tokens/typography.css`. As duas fontes são OFL: podem ser instaladas, embutidas e distribuídas livremente. A Outfit substituiu a Neometric em 2026-11-22 (a licença da Neometric era só de webfont).

## 6 · Ícones

**Phosphor** (MIT) é o sistema de ícones: em linha, grade 256 (traço 1,5 px a 24 px), cantos e pontas redondos, seis
pesos (thin, light, regular, bold, fill, duotone). Um peso por peça; o regular é o padrão, o bold serve para
tamanho pequeno, o fill para estado ativo. No **duotone** o plano de 20% recebe uma segunda cor cheia da paleta,
seguindo os pares de contraste (ex.: ferro sobre damasco). Tratamentos de slide: sólido (creme sobre ladrilho
ferro), claro (ferro sobre ladrilho damasco), duotone e simples; o ladrilho tem cantos de ¼. Nenhum emoji.
Arquivos em `assets/icons/phosphor/<peso>/`; capítulo 6 do documento.

---

## Arquivos

- `styles.css` — a folha que o consumidor liga (apenas `@import`)
- `tokens/` — cores, tipografia, espaçamento, raios, profundidade, movimento, fontes
- `capitulos/` — fragmentos de cada capítulo; `guidelines/lina-draw.js` desenha os diagramas
- `assets/` — logotipos, padrões, fontes, motores
