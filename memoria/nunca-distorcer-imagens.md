---
name: nunca-distorcer-imagens
description: Recortar, nunca esticar; bug do cover no pptxgenjs; rodar aspect.py
type: regra
---

Nunca distorcer imagens. `sizing: cover` do pptxgenjs estica: recortar com sharp na proporção exata da caixa. `aspect.py` deve imprimir `distorcidas: 0` em todo build.
