---
name: python-313-checagens
description: make.sh falha em validate.py/aspect.py com python3 do sistema (3.9, sem PIL); usar python 3.13 do anaconda
type: projeto
---
`/usr/bin/python3` é 3.9: `validate.py` usa `match` (SyntaxError) e `aspect.py` precisa de PIL. As checagens não rodam e o build segue sem aviso claro.

Contorno (2026-11-13): pôr o python do anaconda à frente no PATH antes de `prever.sh`/`make.sh`:
`mkdir -p $TMPDIR/pybin; ln -sf ~/anaconda3/bin/python3.13 $TMPDIR/pybin/python3; PATH="$TMPDIR/pybin:$PATH" sh prever.sh N`
