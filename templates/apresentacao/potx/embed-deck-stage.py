# Deixa o deck HTML abrir direto por file:// (sem servidor, sem internet), como o deck reveal.js da UNIPG.
# O navegador bloqueia fetch em file://, e support.js busca ./deck-stage.js por fetch. Este script embute o
# deck-stage.js como Blob em window.__resourceBlobs; support.js usa o Blob antes de tentar o fetch.
# React: support.js baixa do unpkg; window.__resources aponta para a cópia em ./vendor/ (mesmo arquivo, SRI conferido).
# Com __resources definido, support.js também deixa de reler o próprio HTML por fetch.
# Uso: python3 embed-deck-stage.py <deck.dc.html> <deck-stage.js>   (idempotente: troca o bloco se já existir)
import sys, json, re
h, d = sys.argv[1], open(sys.argv[2]).read()
s = re.sub(r'<script>window\.__resource(Blobs|s)=.*?</script>\n', '', open(h).read(), flags=re.S)
tag = ('<script>window.__resourceBlobs=Object.assign(window.__resourceBlobs||{},{"./deck-stage.js":new Blob(['
       + json.dumps(d).replace('</', '<\\/') + '],{type:"text/javascript"})});</script>\n'
       '<script>window.__resources=Object.assign(window.__resources||{},{'
       '"https://unpkg.com/react@18.3.1/umd/react.production.min.js":"./vendor/react.production.min.js",'
       '"https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js":"./vendor/react-dom.production.min.js"});</script>\n')
s = s.replace('<script src="./support.js"></script>', tag + '<script src="./support.js"></script>', 1)
open(h, 'w').write(s)
