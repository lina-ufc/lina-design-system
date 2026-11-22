# Logos institucionais — histórico de versões

A primeira linha `## x.y.z` é a versão atual. Release: tag `institucionais-vX.Y.Z`, gerada por `sh downloads/institucionais.sh --publicar`. Separada da marca LINA (`assets/logos/CHANGELOG.md`).

## 1.0.0 — 2026-11-22

Primeira versão do pacote institucional, antes incluído na release `marca-v1.0.0`.

- `Logos-Institucionais.zip`: UFC (brasões 1, 3 e 4), IAUD e PPGAUD em VectorCraft, PNG e SVG brancos.

## Como gerar

1. Abrir cada `.ai` original no VectorCraft e salvar em `downloads/institucionais/`.
2. Versões brancas (PNG/SVG) em `assets/logos-institutions/`.
3. `sh downloads/institucionais.sh` e conferir; `--publicar` cria a tag e a release.
