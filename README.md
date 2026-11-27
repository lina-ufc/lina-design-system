# Sistema de design LINA

**LINA — Laboratório de Design da Informação: Arte · Arquitetura · Ambiente.** IAUD, Universidade Federal do Ceará.

Este arquivo resume as regras da marca em seis partes, na ordem em que devem ser lidas. O site (`index.html` e uma página por capítulo, geradas por `sistema.py`) desenha cada uma e traz também o preâmbulo, os componentes e os templates para baixar.

- **Site** (consulta e downloads): https://lina-ufc.github.io/lina-design-system/
- **Templates para baixar**: https://github.com/lina-ufc/lina-design-system/releases

## Fluxo de trabalho

Quem só usa os templates baixa pelo site. Quem contribui clona este repositório e propõe mudanças por pull request.

1. **Editar** neste repositório. A antiga pasta do Google Drive está arquivada; não editar lá.
2. **Conferir localmente**:
   ```bash
   python3 sistema.py                          # gera index.html e as páginas dos capítulos
   sh templates/apresentacao/potx/make.sh      # só se o template de apresentação mudou
   ```
3. **Publicar o site**: commit e push na `main`. O GitHub Actions (`site.yml`) publica em cerca de 1 minuto.
4. **Lançar nova versão de um template**:
   - acrescentar no topo do `templates/apresentacao/CHANGELOG.md` uma seção `## 1.1.0` com o que mudou;
   - commit e push;
   - criar e enviar a tag:
     ```bash
     git tag apresentacao-v1.1.0 && git push origin apresentacao-v1.1.0
     ```
   - o GitHub Actions (`release-apresentacao.yml`) gera `.potx`, exemplo `.pptx` e `.pdf` e o pacote HTML `.zip`, e cria a release. Na próxima publicação do site, a página de downloads aponta para a nova versão.

Arquivos gerados (`.potx`, `.pptx`, `.pdf`, `.zip`, deck HTML) ficam fora do git.

### Skills sugeridas para o Claude Code

O `CLAUDE.md` (§7) indica skills de design para cada tarefa. Elas são instaladas na máquina de cada pessoa, não vêm com o repositório. Fontes:

| Skill | Repositório |
|---|---|
| `design:*` (critique, accessibility-review, design-system, ux-copy) | [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins) (plugin `design`) |
| `frontend-design` | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) |
| `canvas-design` | [anthropics/skills](https://github.com/anthropics/skills) |
| `ui-ux-pro-max` | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) |
| `humanizer` | [blader/humanizer](https://github.com/blader/humanizer) |
| `caveman`, `ponytail` (ativados em `.claude/settings.json`) | [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman), [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) |

`dataviz` já vem com o Claude Code.

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
| Selo experimental | `lina-selo-experimental-*` | células do logotipo recortadas por um círculo | ferro, creme, umbro, turquesa |
| Assinatura em bloco | `lina-assinatura-{pt,en}-bloco-*` | horizontal + nome abaixo em Outfit Black + "ARTE•ARQUITETURA•AMBIENTE" em JetBrains Mono | ferro, creme, umbro, creme-sobre-ferro, creme-sobre-umbro, ferro-sobre-creme |
| Assinatura lateral | `lina-assinatura-{pt,en}-lateral-*` | horizontal + nome ao lado, mesmas fontes | mesmas da assinatura em bloco |

Nome na assinatura: PT "Laboratório de Modelagem da Informação"; EN "Laboratory of Information Modeling". Uma tinta só. Nos SVG o texto está em curvas; no `LINA-Marca.vectorcraft` fica vivo e pede as fontes de `LINA-Fontes.zip`. Vazados, símbolo e selo não têm texto: servem aos dois idiomas.

**Logos institucionais** em `assets/logos-institutions/<instituição>/` (SVG convertido dos originais oficiais; PNG quando não há vetor): UFC, IAUD, PPGAUD, PPGEC, CNPq, FUNCAP, SECULT, Cientista Chefe Cultura, LAREB, Documenta CE e Rede Documenta. Pacote: release `institucionais-vX.Y.Z` (`downloads/institucionais.sh`). Licenças: `LICENSE`.

## 2 · Cores

**Principal** — ferro oxidado, areia, creme, damasco e turquesa. Quatro quentes num arco de 7° a 54°; a turquesa (173°) é o único frio, quase complementar ao ferro e de saturação contida.

Referências: terra vermelha do sertão e telha (ferro); dunas e palha de carnaúba (areia); cal, algodão cru e renda de bilro (creme); caju, manga e luz de fim de tarde (damasco); mar raso, lagoas e portas pintadas (turquesa).

**Auxiliar** — umbro (texto), ferro fundo, turquesa fundo (turquesa como texto), turquesa tinta (texto sobre turquesa), nata (painéis), fio e fio forte. Nenhum cinza.

**Valores e contraste** — os valores estão em `tokens/lina.tokens.json` (gerado de `assets/lina-palette.js`, a fonte única). Os pares a usar e a evitar, com as razões de contraste, estão em 2.4 a 2.6 do site e em `node ferramentas/textura.mjs --list-colors`.

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
Arquivos em `assets/icons/phosphor/<peso>/`; capítulo 8 do documento.

---

## Arquivos

- `styles.css` — a folha que o consumidor liga (apenas `@import`)
- `tokens/` — cores, tipografia, espaçamento, raios, profundidade, movimento, fontes
- `capitulos/` — fragmentos de cada capítulo; `assets/lina-draw.js` desenha os diagramas
- `assets/` — logotipos, padrões, fontes, motores
