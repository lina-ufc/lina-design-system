# 05 · Seção 8.2 no site e memória

> **Para agentes:** usar `superpowers:subagent-driven-development` (ou `executing-plans`). Passos em checkbox. Atualizar `progress.md` ao fim de cada tarefa verificada.

**Goal:** A seção 8.2 Documentos A4 fica completa no padrão do capítulo 8 (Estrutura, Exemplo, Uso, Baixar), com os cinco arquivos da release `documentos-v1.0.0` baixáveis no site publicado.

**Architecture:** O fragmento `capitulos/8-templates/2-documentos-a4.html` continua escrito à mão (Estrutura, desenhos, Exemplo, Uso). Só o bloco Baixar passa a ser gerado: `capitulos/8-templates/_gerar.py` reescreve tudo o que vem depois de `Baixar</h2>` com versão, cards e tamanhos, como já faz na 8.1. No GitHub Actions, `site.yml` baixa a release atual dos documentos antes do `_gerar.py`, e os links apontam para a página da release.

**Tech Stack:** Python 3 stdlib, GitHub Actions (`gh release download`), `sistema.py`, navegador do app.

**Spec:** `docs/superpowers/specs/2026-11-22-templates-documentos-design.md` (Objetivos, último item; "Deixado para quem constrói"). **Handoffs:** `records/02-word-handoff.md` ("Não verificado": numeração do POP), `records/03-latex-handoff.md` (comandos da classe, conteúdo do zip).

## O que o 04 ensinou

- Release `documentos-v1.0.0` publicada com os 5 arquivos; `make.sh` gera os mesmos nomes localmente (zips em `downloads/`, PDFs em `templates/documento-a4/`), todos fora do git.
- A numeração dos passos do POP no Word é texto literal com o estilo de caractere `LINA Passo Número`. Quem acrescenta passo digita o número. O Uso precisa dizer isso.
- Word só foi testado no LibreOffice e no WordCraft. O Uso não promete nada que só o Word real confirmaria.
- O cartão "Como usar" já saiu dos três decks (0 ocorrências): a seção Uso do site é o único lugar dessas instruções.

## Decisões deste plano

- **Só o Baixar é gerado.** Mover o fragmento inteiro para dentro do `_gerar.py`, como na 8.1, levaria 5 kB de HTML e o JS dos desenhos para uma string Python sem ganho: só versão, links e tamanhos mudam com a release.
- **Cinco cards**, um por arquivo da release, na ordem: Word `.zip`, LaTeX `.zip`, e os três PDFs (Relatório, Artigo, POP). Sem card de fontes ou logos: referência cruzada a 5.5 e 1.8 (`memoria/padrao-explicacao-download.md`).
- **Variável própria** `RELEASE_URL_DOCUMENTOS` no `site.yml`; `RELEASE_URL` continua sendo só da apresentação.
- **Desenhos da Estrutura ficam.** Os quatro SVG (capa e interna do relatório, artigo, POP) continuam válidos; só o texto "Quatro páginas-modelo" muda para três modelos.

## Global Constraints

- Português em textos, comentários e commits (CLAUDE.md §0). Textos do site passam por `design:ux-copy` e `humanizer` (`memoria/padrao-explicacao-download.md`).
- Padrão da 8.1: subtítulos `<h2 class="h" style="font-size:18px;margin:26px 0 6px">`, linha `Versão X · histórico de versões · versões anteriores` em `.p.mono`, cards em `<div class="dl">` com `<b>`, descrição `.p` e `nome · tamanho` em `.mono.cap`.
- Nomes de arquivo exatos: `LINA-Documentos-Word.zip`, `LINA-Documentos-LaTeX.zip`, `LINA-Relatorio-exemplo.pdf`, `LINA-Artigo-exemplo.pdf`, `LINA-POP-exemplo.pdf`.
- Versão lida do primeiro `## x.y.z` de `templates/documento-a4/CHANGELOG.md`; tag `documentos-vX.Y.Z`.
- Estilos citados no Uso só se existirem no `.dotx` (nomes `LINA *` do `word/build.js`); comandos LaTeX só se existirem em `lina.cls`.
- `1-apresentacao.html` não muda (diff vazio depois de rodar o `_gerar.py`).
- Push só com ok explícito do usuário no mesmo turno (CLAUDE.md §8).

## Review Focus

1. **Rodar o gerador duas vezes dá o mesmo.** Teste: `_gerar.py` duas vezes; `git diff --stat` igual após a 1ª e a 2ª.
2. **Arquivo da release ausente.** Rodar `_gerar.py` sem ter rodado `make.sh` deve falhar com o nome do arquivo que falta, não publicar card sem tamanho. Teste: mover um PDF para fora, rodar, esperar saída ≠ 0 com o nome; devolver o PDF.
3. **Modo release.** Com `RELEASE_URL_DOCUMENTOS=https://github.com/lina-ufc/lina-design-system/releases/download/documentos-v1.0.0/`, os cinco `href` são essa URL + nome, e "histórico de versões" aponta para `.../releases/tag/documentos-v1.0.0`. Teste: rodar com a variável, `grep -c 'releases/download/documentos-v1.0.0/LINA-' ` dá 5; depois rodar sem a variável para voltar ao fragmento local.
4. **Celular.** Cinco cards e três quadros em 375 px sem rolagem lateral. Teste: navegador do app em 375 px, `document.documentElement.scrollWidth <= 375`.
5. **CHANGELOG à frente da release.** Se alguém escrever `## 1.1.0` sem publicar a tag, o `gh release download` do `site.yml` falha e o site antigo fica no ar (mesmo comportamento da 8.1). Aceito; dito no comentário do passo.

---

### Task 1: Baixar gerado e `site.yml`

**Files:**
- Modify: `capitulos/8-templates/_gerar.py` (bloco novo no fim), `capitulos/8-templates/2-documentos-a4.html` (bloco Baixar, reescrito pelo gerador), `.github/workflows/site.yml` (passo novo depois do da apresentação)

**Interfaces:**
- Consumes: os 5 arquivos gerados por `sh templates/documento-a4/make.sh`; `tam(p)` e o padrão de cards já existentes em `_gerar.py`.
- Produces: `python3 capitulos/8-templates/_gerar.py` reescreve o Baixar da 8.2 e imprime, além de `layouts N`, uma linha `documentos 5`. Variável de ambiente `RELEASE_URL_DOCUMENTOS` (opcional).

- [ ] **Step 1: Preparar.** `sh templates/documento-a4/make.sh` (precisa terminar com `ok: 5 arquivos`) e anotar `git diff --stat` (deve estar vazio).
- [ ] **Step 2: Gerador.** Em `_gerar.py`, depois de gravar `1-apresentacao.html`: `TD = 'templates/documento-a4'`; versão do `CHANGELOG.md` de `TD`; `REL_D = os.environ.get('RELEASE_URL_DOCUMENTOS', '')`; lista `DL_D` com os 5 arquivos (caminho local, título, descrição); conferir que os 5 existem e sair com `sys.exit('falta: <caminho>')` se não; montar cards como na 8.1; ler `2-documentos-a4.html`, trocar tudo depois da primeira ocorrência de `Baixar</h2>\n` pelo bloco novo e gravar. Bloco novo: linha `Versão`, `<div class="dl">` com os cards, e o parágrafo de complementos (fontes 5.5, logos 1.8). Títulos e descrições dos cards:
  - `Word · .zip` — modelos `.dotx` e exemplos `.docx` dos três documentos.
  - `LaTeX · .zip` — classe `lina.cls`, três exemplos, fontes e logo; sobe direto no Overleaf.
  - `Relatório · .pdf`, `Artigo · .pdf`, `POP · .pdf` — exemplo para consultar sem editor.
  Texto final passa pelo `design:ux-copy` na Task 2; aqui só precisa estar correto.
- [ ] **Step 3: Rodar** `python3 capitulos/8-templates/_gerar.py` duas vezes — Expected: `layouts 32` e `documentos 5`; `git diff --stat` mostra só `2-documentos-a4.html` (e `_gerar.py`), igual nas duas rodadas; `1-apresentacao.html` sem diff.
- [ ] **Step 4: Review Focus 2 e 3.** Mover `templates/documento-a4/LINA-POP-exemplo.pdf` para o scratchpad, rodar, esperar erro com `LINA-POP-exemplo.pdf`; devolver. Rodar com `RELEASE_URL_DOCUMENTOS=…/documentos-v1.0.0/`: 5 links da release e histórico na página da tag; rodar de novo sem a variável.
- [ ] **Step 5: `site.yml`.** Passo "Arquivos da release atual dos documentos", depois do da apresentação: versão do `templates/documento-a4/CHANGELOG.md`, `TAG=documentos-v$V`, `gh release download "$TAG" -D downloads -p '*.zip'`, `gh release download "$TAG" -D templates/documento-a4 -p '*.pdf'`, `echo "RELEASE_URL_DOCUMENTOS=https://github.com/$GITHUB_REPOSITORY/releases/download/$TAG/" >> "$GITHUB_ENV"`. Comentário de uma linha: sem release para a versão do CHANGELOG, o passo falha e o site antigo fica. Conferir: `ruby -ryaml -e 'YAML.load_file(".github/workflows/site.yml")'` sem erro; `downloads/empacotar.py` não apaga nem regrava os dois zips dos documentos (`grep -n Documentos downloads/empacotar.py` vazio).
- [ ] **Step 6:** `python3 sistema.py` sem link quebrado. Commit `Site 8.2: Baixar gerado da release dos documentos` e marcar no `progress.md`.

### Task 2: Estrutura e Uso

**Files:**
- Modify: `capitulos/8-templates/2-documentos-a4.html` (parágrafo da Estrutura; seção Uso nova entre Exemplo e Baixar)

**Interfaces:**
- Consumes: estilos `LINA *` de `word/out/LINA-*.dotx`; opções e comandos de `latex/out/lina.cls` (lista no handoff 03); o Baixar da Task 1 (não editar à mão: o gerador reescreve).
- Produces: fragmento com Estrutura, Exemplo, Uso, Baixar, nessa ordem.

- [ ] **Step 1: Estrutura.** Trocar "Quatro páginas-modelo: …" por texto que diga: três modelos (Relatório, Artigo, POP), cada um com três páginas no exemplo; os mesmos nas três versões (HTML, Word, LaTeX); texto corrido justificado com hifenização em português; Outfit sem itálico, ênfase por peso. Legendas dos quatro desenhos ficam.
- [ ] **Step 2: Uso.** `<h2 class="h" …>Uso</h2>` e duas listas `<ol class="passos p">` (`.passos` não está no `site.css`: copiar o `<style>.passos{…}</style>` do topo da 8.1 para o topo do fragmento), precedidas por um parágrafo-título curto cada:
  - **Word:** instalar as fontes (5.5); abrir o `.dotx`, que cria documento novo (LibreOffice: abrir o `.docx` de exemplo); escrever aplicando os estilos `LINA *` do painel de estilos, sem formatação direta (citar `LINA Corpo`, `LINA Seção`, `LINA Legenda`); trocar referência e versão no cabeçalho; passo novo do POP: copiar a linha de um passo, digitar o número e conferir os estilos `LINA Passo` e `LINA Passo Número`; ao salvar, incorporar as fontes.
  - **LaTeX / Overleaf:** no Overleaf, Novo projeto › Enviar projeto com o zip; Menu › Compilador: XeLaTeX; abrir `LINA-Relatorio.tex`, `LINA-Artigo.tex` ou `LINA-POP.tex`; trocar os metadados (`\referencia`, `\versao`, `\data`, `\titulocurto`); escrever com os comandos da classe, sem `\vspace` nem `\fontsize`; local: `latexmk -xelatex` na pasta descompactada.
  Conferir cada nome citado: `unzip -p templates/documento-a4/word/out/LINA-POP.dotx word/styles.xml | grep -o 'w:val="LINA [^"]*"' | sort -u` contém os estilos citados; `grep -n '\\newcommand{\\referencia\|\\DeclareOption{pop}' templates/documento-a4/latex/out/lina.cls` acha cada comando e opção citados. Menus do Overleaf: conferir na documentação do Overleaf (nomes atuais) antes de escrever.
- [ ] **Step 3: Texto.** Passar Estrutura, Uso e as descrições dos cards (no `_gerar.py`) por `design:ux-copy` e `humanizer`. Rodar `_gerar.py` de novo.
- [ ] **Step 4: Mostrar ao usuário.** `python3 sistema.py`; abrir a página 8 no navegador do app, screenshot da 8.2 em desktop e em 375 px (Review Focus 4). Pedir ok no texto e no visual antes do commit (CLAUDE.md §2).
- [ ] **Step 5:** Commit `Site 8.2: Estrutura e Uso dos documentos A4` e marcar no `progress.md`.

### Task 3: Revisão, publicação e memória

**Files:**
- Modify: `memoria/templates-downloads.md`, `memoria/README.md` (se a linha mudar), `progress.md`, `README.md` do conjunto
- Move: `docs/superpowers/plans/2026-11-22-templates-documentos/` e a spec para `done/`

- [ ] **Step 1: Revisão.** `design:design-critique` e `design:accessibility-review` sobre a 8.2 renderizada (desktop e 375 px). Corrigir o que for Important; Minors anotados no changelog do `progress.md`.
- [ ] **Step 2: Pedir ok** para `git push origin main`. Com ok: push; esperar o run do `site.yml` (`gh run watch`); no site publicado, a 8.2 mostra `Versão 1.0.0` e os 5 cards apontam para a release (`curl -sIL <href> | grep -m1 'HTTP/.* 200'` em cada um).
- [ ] **Step 3: Memória.** Em `memoria/templates-downloads.md`: downloads da 8.2 (dois zips e três PDFs da release `documentos-vX.Y.Z`; Baixar gerado pelo `_gerar.py`, resto do fragmento à mão; `site.yml` baixa a release). Atualizar a linha do índice.
- [ ] **Step 4: Fechar.** Marcar o plano 05 e o conjunto como concluídos no `progress.md`; criar `docs/superpowers/plans/done/` e `docs/superpowers/specs/done/` (ainda não existem); `git mv` da pasta do conjunto e da spec para elas; conferir links relativos do `README.md` do conjunto (spec em `../../specs/done/…`). Commit `Progresso: plano 05 concluído`.
