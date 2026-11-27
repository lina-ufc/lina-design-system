# Record 06 — ferramentas no site

Data: 2026-11-27. Branch `revisao-site/06-ferramentas`.

## Checagens

- `python3 sistema.py`: ok, 61 entradas, 41 links entre seções, sem link quebrado.
- `node --test "ferramentas/test/*.test.mjs"`: 66/66.
- `node ferramentas/tokens.mjs --check`: saída 0.
- Navegador (preview na porta 8771, desktop e 375 px), nas três ferramentas: sem rolagem horizontal; console sem erro.

### Gerador de padrões (6.9)

- O hash reproduz a prévia ao abrir o link em outra aba: o SVG tem o mesmo SHA-256.
- O SVG baixado é idêntico, byte a byte, ao gerado pelo comando copiado (`node ferramentas/textura.mjs --mode scatter --cells 70 …`).
- Par recusado (ferro com turquesa): o motivo aparece no `.status`, as ações ficam desativadas e a prévia anterior fica.
- Largura de 1 px travava a aba (2 a 28 s). Corrigido com limite: lado menor ≥ 64 px e proporção até 8:1 (`cd6dcf5`).

### Filtro de pontilhado (7.1)

- Foto de até 1600 px no lado maior: o SVG baixado é idêntico ao gerado pelo comando.
- **Achado em aberto:** acima de 1600 px os dois diferem. O navegador reduz a foto a 1600 px antes do filtro e `ferramentas/imagem.mjs` não reduz. Opções: o CLI reduzir da mesma forma (resultado parecido, não idêntico, porque o redimensionamento do canvas e o da vips não são iguais) ou registrar no site que o comando vale para a foto já reduzida.
- O tamanho mostrado no `.status` agora é arredondado (`c8aa1d2`).

### Editor de células (2.10)

- Adicionar (Enter), mover (setas), apagar, desfazer e exportar funcionam. O SVG sai recortado ao contorno, com o hex do token.
- Corrigido: desfazer depois de diminuir a grade deixava células fora dela (`58b1322`).
- Fica pendente: desfazer não volta o tamanho da grade, só as células.

## Acessibilidade (WCAG 2.1 AA, varredura no navegador)

- Todo controle tem nome acessível. `.status` usa `role="status"`.
- Contraste do texto ≥ 4,5:1 em todos os elementos medidos. Borda dos campos: 15:1.
- Foco visível em ferro (`:focus-visible`) nos controles e na grade do editor.
- Corrigido em `c8aa1d2`:
  - prévias com `role="img"` e nome;
  - `<output>` com `aria-live="off"`, para o leitor de tela não repetir o valor a cada passo do controle deslizante;
  - Largura do filtro limitada a 16–8192 px.
- Toque: checkbox e campo de arquivo têm menos de 24 px, mas o rótulo inteiro é clicável.
- Não testado: leitor de tela real (VoiceOver) e toque real no editor.

## Desvios aceitos na implementação

- Editor:
  - o letreiro abre centrado (no original, `LINA_W = 70` o deixava à esquerda);
  - os atalhos valem só com a grade em foco;
  - Enter põe uma célula no centro;
  - limite de 1000 células;
  - toque longo não apaga (usar o botão Apagar célula).
- Gerador: no celular a prévia fica depois dos controles, para a ordem visual seguir a ordem do Tab.

## Chamadas a conferir com o dono

| # | Chamada | Resposta do dono |
|---|---|---|
| 1 | Só SVG, sem PNG nem fundo transparente | Aprovada (2026-11-27) |
| 2 | Sem modo `glyphs`, raio fixo em ¼ | Aprovada (2026-11-27) |
| 3 | Filtro sem foto de exemplo | Recusada (2026-11-27): usar foto de exemplo. Filtro abre com o retrato `capitulos/imagem/img/exemplo.jpg` (do `lina-sample.js`) e tem botão "Usar exemplo"; SVG idêntico ao do comando |
| 4 | Editor: cor entre os 12 tokens; estado só no `localStorage` | Aprovada (2026-11-27) |
| 5 | Posições 6.9, 7.1, 2.10 (Baixar em 2.11) e 11.3 | Substituída (2026-11-27): ferramentas em páginas próprias, no menu e na página inicial; 6.9, 7.1 e 2.10 viram chamada curta |
| 6 | Foto com mais de 1600 px | 2026-11-27: comando reduz a 1600 px no lado maior, como o site (`lerFoto` em `ferramentas/_carregar.mjs`) |
| 7 | Botão de envio do navegador em inglês | 2026-11-27: botão próprio "Escolher foto" |

## Tarefa 9 — verificação final (2026-11-27)

- `node --test "ferramentas/test/*.test.mjs"`: 82/82. `python3 sistema.py`: 69 links, sem link quebrado.
- Três páginas próprias: um h1, SVG na prancha, sem rolagem lateral em 390 px e 1024 px, console sem erro.
- Corrigido no celular: margem lateral dupla (botões do filtro passavam 2 px da tela) e vão de 3 células sob o cabeçalho.
- Foto de 3200 × 2000 px pelo comando sai reduzida a 1600 px.
- Fora do escopo: `index.html` não tem h1 (já era assim antes do plano 06).
- Não testado: VoiceOver e toque real no editor.

**Plano 06 aprovado pelo dono em 2026-11-27.**
