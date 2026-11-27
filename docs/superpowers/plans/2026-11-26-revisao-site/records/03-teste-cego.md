# 03 — Teste às cegas e checagens

Data: 2026-11-27. Branch `revisao-site/03-fonte-unica`.

## Teste às cegas (sonnet, só com o caminho do `SKILL.md`)

Veredito: **passa, 6/6 certas.**

| Pergunta | Resposta do agente | Arquivos abertos |
| --- | --- | --- |
| (a) hex do turquesa fundo | `#2F6A62`, em `assets/lina-palette.js` | `SKILL.md`, `lina-palette.js` |
| (b) areia sobre creme para texto | Não: par a evitar (2.6), contraste 1,42 | `SKILL.md`, `lina-palette.js`, fragmento 2.6 |
| (c) textura 1:1, ferro sobre creme | `textura.mjs --mode dither --width 1080 --height 1080 --cells 36 --colors creme,ferro`, código 0 | `SKILL.md`, `--list-colors` |
| (d) regra da tabela | `capitulos/7-componentes/2-tabela.html` | `SKILL.md`, listagem da pasta |
| (e) gerar apresentação | `sh templates/apresentacao/potx/make.sh` | `SKILL.md`, README do template |
| (f) índice externo | `https://lina-ufc.github.io/lina-design-system/llms.txt` | `SKILL.md`, `llms.txt` |

Ponteiros fracos apontados pelo agente:
1. URL completa do `llms.txt` não estava escrita. Corrigido no `SKILL.md`.
2. Nomes dos fragmentos de componente e de 2.x não estão no `SKILL.md` (precisou listar a pasta). Mantido: o índice aponta pasta e página; o 04 muda os nomes.
3. Padrões de `--mode` e `--cells` não documentados. Mantido: o exemplo basta.
4. README do template usa `sh potx/make.sh` (de dentro da pasta); `SKILL.md` usa o caminho da raiz. Ambos certos.

## Checagem de links do `llms.txt`

53/53 ok. Script (fora do repositório):

```python
import re, urllib.parse as u
B='https://lina-ufc.github.io/lina-design-system/'; R='./'; bad=[]; n=0
for l in open(R+'llms.txt'):
    m=re.search(r'\]\((\S+)\)', l)
    if m:
        n+=1; p,_,a=u.unquote(m[1].replace(B,'')).partition('#')
        try: a and f'id="{a}"' not in open(R+p).read() and bad.append(m[1]); a or open(R+p)
        except OSError: bad.append(m[1])
print(n, bad)
```

## Revisão (cavecrew-reviewer, sonnet)

- `SKILL.md`: dizia que `tokens/fonts.css` declara Outfit e JetBrains Mono; só declara a Outfit (a JetBrains vem do Google Fonts na web). Corrigido.
- `tokens.mjs`: alias circular passaria. Não ocorre; ignorado.
- Critérios 1–4 sem outros achados: 42 tokens (12 cores, `text-muted` com alpha 0.62, 29 aliases que resolvem); 53 links absolutos; nenhum hex em `README.md`/`SKILL.md`.
