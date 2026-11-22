# 04 · Pacotes, workflow e release `documentos-v1.0.0`

> **Para agentes:** usar `superpowers:subagent-driven-development` (ou `executing-plans`). Passos em checkbox. Atualizar `progress.md` ao fim de cada tarefa verificada.

**Goal:** Um `make.sh` gera de uma vez os modelos Word, os PDFs LaTeX e os dois zips de download; um workflow publica tudo como release `documentos-vX.Y.Z`; a `1.0.0` sai depois do ok do usuário.

**Architecture:** `templates/documento-a4/make.sh` chama o que já existe (`word/build.js` + `check_word.py` + `validate.py`, `latex/latex.sh` + `check_latex.py`) e empacota: `downloads/LINA-Documentos-Word.zip`, `downloads/LINA-Documentos-LaTeX.zip` e os três PDFs de exemplo em `templates/documento-a4/`. `check_pacotes.py` confere o conteúdo dos zips. `.github/workflows/release-documentos.yml` copia o `release-apresentacao.yml`: tag confere com o `CHANGELOG.md`, roda `make.sh`, publica. `downloads/empacotar.py` e `site.yml` não mudam (links do site são do plano 05).

**Tech Stack:** sh, Node 20 (`docx`), Python 3 stdlib (`zipfile`) + `lxml`/`defusedxml` para `validate.py`, TeX Live do Ubuntu (`texlive-xetex` e afins) + `latexmk` + `librsvg2-bin` no runner, `gh`.

**Spec:** `docs/superpowers/specs/2026-11-22-templates-documentos-design.md` ("Pacotes", "Deixado para quem constrói"). **Handoffs:** `records/02-word-handoff.md`, `records/03-latex-handoff.md` (o que `latex.sh` monta; opções de CI).

## O que o 03 ensinou

- `latex.sh` apaga e recria `latex/out/`: nada que precise sobreviver pode morar lá (folhas de conferência se perderam assim).
- O zip do Overleaf é `latex/out/` sem `*.pdf`, `*.log` e `*.latexmk.txt`, mais um `LEIA-ME.txt` (compilar com XeLaTeX).
- Folhas HTML × Word × LaTeX já foram aprovadas pelo usuário em 2026-11-22: a conferência visual do 04 é só de regressão.
- Word medido só no LibreOffice. O WordCraft (MCP `wordcraft-app`, clone do Word) serve de segundo render e de teste de digitação.

## Decisões deste plano

- **PDFs de exemplo da release vêm do LaTeX** (`LINA-{Relatorio,Artigo,POP}-exemplo.pdf`): hifenização pt-BR e fontes embutidas; o PDF do Word sai do LibreOffice sem hifenização. Assim o workflow não instala LibreOffice.
- **TeX Live no runner**, não PDFs commitados: a spec manda "nada duplicado no git" e o `.gitignore` já deixa todo gerado fora. Pacotes do Ubuntu (`apt`), nunca `tlmgr`.
- **Ensaio antes da tag:** o workflow aceita `workflow_dispatch`, que gera tudo e sobe como artifact sem publicar. A tag só depois do ensaio verde e do ok do usuário.

## Global Constraints

- Português em textos, comentários, commits, CHANGELOG e LEIA-ME (CLAUDE.md §0).
- Nada gerado no git: `templates/documento-a4/*.pdf` entra no `.gitignore`; zips já estão (`downloads/*.zip`).
- Nomes dos arquivos da release, exatos: `LINA-Documentos-Word.zip` (pasta `LINA-Documentos-Word/` com `LINA-{Relatorio,Artigo,POP}.dotx` e `LINA-{Relatorio,Artigo,POP}-exemplo.docx`), `LINA-Documentos-LaTeX.zip` (pasta `LINA-Documentos-LaTeX/` com `lina.cls`, `LINA-{Relatorio,Artigo,POP}.tex`, `fontes/` (7 `.ttf` + 2 OFL), `logos/lina-horizontal-ferro.pdf`, `LEIA-ME.txt`), `LINA-Relatorio-exemplo.pdf`, `LINA-Artigo-exemplo.pdf`, `LINA-POP-exemplo.pdf`.
- Tag `documentos-vX.Y.Z`; `CHANGELOG.md` em `templates/documento-a4/` no formato do `templates/apresentacao/CHANGELOG.md` (primeiro `## x.y.z · AAAA-MM-DD` é a versão; regras maior/menor/correção adaptadas a modelos de documento).
- `make.sh` falha (`set -e`) se qualquer checagem falhar: `check_word.py`, `validate.py` nos 6 arquivos Word, `check_latex.py`, `check_pacotes.py`.
- Push, tag e release só com ok explícito do usuário no mesmo turno (CLAUDE.md §8: operação irreversível não se delega).

## Review Focus

1. **Zip do Overleaf compila sozinho.** Teste: `check_pacotes.py` descompacta o zip LaTeX em `mktemp -d` e roda `latexmk -xelatex` num `.tex`; PDF com 3 páginas.
2. **Zip sem lixo.** Teste: `check_pacotes.py` compara a lista de membros com a lista exata do Global Constraints (nada de `.log`, `.pdf` no zip LaTeX, `.DS_Store`, `out/`).
3. **Tag errada não publica.** Teste: o passo "Tag confere com o CHANGELOG", rodado à mão com `GITHUB_REF_NAME=documentos-v9.9.9`, sai com erro.
4. **Ensaio não publica.** Teste: no YAML, o passo de publicar tem `if: startsWith(github.ref, 'refs/tags/')`.
5. **Rodar duas vezes dá o mesmo.** Teste: `make.sh` duas vezes seguidas passa, `git status` limpo.

---

### Task 1: `make.sh`, pacotes e `check_pacotes.py`

**Files:**
- Create: `templates/documento-a4/make.sh`, `templates/documento-a4/check_pacotes.py`
- Modify: `.gitignore` (linha `templates/documento-a4/*.pdf`)

**Interfaces:**
- Consumes: `word/build.js` (grava `word/out/`), `check_word.py`, `templates/apresentacao/potx/vendor/office/validate.py`, `latex/latex.sh` (grava `latex/out/`), `check_latex.py`.
- Produces: `sh templates/documento-a4/make.sh` grava os 5 arquivos da release (2 zips em `downloads/`, 3 PDFs em `templates/documento-a4/`) e termina com a linha `ok:` do `check_pacotes.py`.

- [ ] **Step 1: `check_pacotes.py`** (stdlib + `subprocess`): os 5 arquivos existem; membros dos dois zips iguais às listas exatas do Global Constraints (comparar conjuntos, imprimir o que sobra e o que falta); zip LaTeX descompactado em `tempfile.mkdtemp()` compila `LINA-POP.tex` com `latexmk -xelatex -interaction=nonstopmode -halt-on-error` e `pdfinfo` dá 3 páginas; cada PDF de exemplo tem 3 páginas A4. Última linha `ok: 5 arquivos`.
- [ ] **Step 2: Rodar** `python3 templates/documento-a4/check_pacotes.py` — Expected: FAIL (arquivos não existem).
- [ ] **Step 3: `make.sh`.** `set -e`; `cd` na própria pasta; `npm ci` em `word/` se faltar `node_modules`; `node word/build.js`; `check_word.py`; `validate.py` nos 6 arquivos de `word/out/`; `sh latex/latex.sh`; `check_latex.py`; copia `latex/out/LINA-<M>.pdf` para `LINA-<M>-exemplo.pdf`; monta os dois zips com `python3 -m zipfile -c` a partir de pastas em `mktemp -d` com o nome de topo certo; `LEIA-ME.txt` escrito pelo próprio `make.sh` (heredoc, 5 linhas: subir o zip no Overleaf, compilador XeLaTeX, escolher a opção da classe, fontes inclusas sob OFL, site do LINA); por fim `check_pacotes.py`.
- [ ] **Step 4: Rodar** `sh templates/documento-a4/make.sh` duas vezes — Expected: `ok: 5 arquivos` nas duas; `git status` só mostra `make.sh`, `check_pacotes.py` e `.gitignore`.
- [ ] **Step 5: Commit** `Documento A4: make.sh e pacotes de download` e marcar no `progress.md`.

### Task 2: CHANGELOG e workflow

**Files:**
- Create: `templates/documento-a4/CHANGELOG.md`, `.github/workflows/release-documentos.yml`

**Interfaces:**
- Consumes: `sh templates/documento-a4/make.sh` (Task 1) e os 5 nomes de arquivo.
- Produces: tag `documentos-v*` publica a release "Documentos A4 X.Y.Z" com os 5 arquivos; `workflow_dispatch` gera e sobe artifact `documentos-ensaio` sem publicar.

- [ ] **Step 1: `CHANGELOG.md`** com o cabeçalho de como publicar, regras de versão (maior: estilo ou comando removido/renomeado; menor: modelo, estilo ou comando novo, ajuste visual compatível; correção: texto, medida, arquivo) e `## 1.0.0 · 2026-11-22`: três modelos (Relatório, Artigo, POP), Word `.dotx` + `.docx` de exemplo com estilos `LINA *`, LaTeX `lina.cls` com opções `relatorio`/`artigo`/`pop` pronto para o Overleaf, PDFs de exemplo do LaTeX, fontes OFL.
- [ ] **Step 2: Workflow.** Partir do `release-apresentacao.yml`: gatilhos `push: tags: ['documentos-v*']` e `workflow_dispatch`; Node 20 com cache de `templates/documento-a4/word/package-lock.json`; Python 3.13 + `pip install lxml defusedxml`; `apt-get install --no-install-recommends texlive-xetex texlive-latex-extra texlive-lang-portuguese texlive-pictures latexmk librsvg2-bin poppler-utils` (acrescentar o pacote Debian que faltar se o ensaio acusar); passo da tag só `if: startsWith(github.ref, 'refs/tags/')`; `sh templates/documento-a4/make.sh`; publicar (`gh release create` com título "Documentos A4 ${GITHUB_REF_NAME#documentos-}" e notas da primeira entrada do CHANGELOG) só em tag; no ensaio, `actions/upload-artifact@v4` com os 5 arquivos. Sem `gh workflow run site.yml` (o site passa a usar esta release no 05).
- [ ] **Step 3: Conferir localmente:** `ruby -ryaml -e 'YAML.load_file(".github/workflows/release-documentos.yml")'` sem erro; o trecho da tag rodado com `GITHUB_REF_NAME=documentos-v1.0.0` passa e com `documentos-v9.9.9` falha.
- [ ] **Step 4: Commit** `Documento A4: CHANGELOG e workflow de release` e marcar no `progress.md`.

### Task 3: Teste de digitação no WordCraft

**Files:**
- Modify: `docs/superpowers/plans/2026-11-22-templates-documentos/records/02-word-handoff.md` (seção "Não verificado")

- [ ] **Step 1:** Abrir `word/out/LINA-Relatorio.dotx` no WordCraft (`open_document`); no corpo da página 2, digitar um parágrafo novo e aplicar `LINA Corpo`, um título com `LINA Seção`, e uma linha nova na tabela de indicadores. `inspect_document`: os parágrafos novos usam os estilos, sem formatação direta. `render_page` das páginas 1–3: o estilo segue, só a quebra muda. Repetir com um passo novo no `LINA-POP.dotx` (numeração continua?).
- [ ] **Step 2:** Comparar o `render_page` do `LINA-<M>-exemplo.docx` sem edição com o PDF do LibreOffice (`word/out/`): cabeçalho, capa, registro do POP. Diferença maior que 3 pt fica anotada com a causa provável; não corrigir nesta tarefa.
- [ ] **Step 3:** Atualizar "Não verificado" do handoff 02: o que o WordCraft confirmou, o que segue sem Word real. Commit `Documento A4: teste de digitação no WordCraft` e marcar no `progress.md`.

### Task 4: Ensaio e release `documentos-v1.0.0`

**Files:** nenhum (só git, GitHub e `progress.md`)

- [ ] **Step 1: Pedir ok ao usuário** para `git push origin main` e rodar o ensaio (`gh workflow run release-documentos.yml --ref main`). Sem ok, parar aqui.
- [ ] **Step 2: Ensaio.** Esperar o run; se falhar por pacote TeX, acrescentar o pacote Debian no YAML (commit, push, novo ensaio). Baixar o artifact (`gh run download`) e rodar `check_pacotes.py` sobre ele (mesmos 5 arquivos, LaTeX do runner compila). Abrir um PDF do runner e comparar com o local (`pdftoppm`): mesmas quebras.
- [ ] **Step 3: Pedir ok explícito** para criar e enviar a tag `documentos-v1.0.0` (pendência 2 do `progress.md`). Com ok: `git tag documentos-v1.0.0 && git push origin documentos-v1.0.0`; conferir `gh release view documentos-v1.0.0` com os 5 arquivos.
- [ ] **Step 4:** Marcar o plano 04 como concluído no `progress.md`, riscar a pendência 2, commit `Progresso: plano 04 concluído`.
