# Documento A4 LInA · histórico de versões

A versão mais recente é o primeiro título `## x.y.z`. Para publicar uma versão nova: escreva a entrada aqui,
faça o commit e crie a tag `documentos-vx.y.z` (o GitHub Actions gera os arquivos e a release).

- **Maior** (2.0.0): estilo ou comando removido ou renomeado. Quem já usa os modelos precisa ajustar documentos existentes.
- **Menor** (1.1.0): modelo, estilo ou comando novo, ajuste visual que não quebra documentos existentes.
- **Correção** (1.0.1): erro em texto, medida ou arquivo.

## 1.0.1 · 2026-11-23

- LaTeX: o `LEIA-ME.txt` do zip usa os nomes atuais dos menus do Overleaf (New project › Existing project, Settings › Compiler) e manda marcar o `.tex` como documento principal.

## 1.0.0 · 2026-11-22

Primeira versão publicada.

- Três modelos A4: Relatório, Artigo e POP.
- Word: modelo `.dotx` e exemplo `.docx` de cada um, com estilos `LINA *`.
- LaTeX: `lina.cls` com as opções `relatorio`, `artigo` e `pop`, pronto para subir no Overleaf (XeLaTeX).
- PDFs de exemplo gerados pelo LaTeX.
- Fontes Outfit e JetBrains Mono (OFL) inclusas no pacote LaTeX.
