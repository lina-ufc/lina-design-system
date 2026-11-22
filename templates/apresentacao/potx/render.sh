#!/bin/sh
# Exporta pelo DeckCraft (--control 7980) e monta folha de contato.
cd "$(dirname "$0")"
python3 -I dc.py app.open "{\"path\":\"$PWD/out/LINA-Apresentacao.pptx\"}" >/dev/null
python3 -I dc.py app.export "{\"path\":\"$PWD/out/render.pdf\"}" >/dev/null
cd out && find . -name 's-*.jpg' -delete && pdftoppm -jpeg -r 40 render.pdf s && python3 -c "
from PIL import Image;import glob
f=sorted(glob.glob('s-*.jpg'));ims=[Image.open(x) for x in f];w,h=ims[0].size;n=4
for part in range(0,len(ims),16):
  sub=ims[part:part+16];g=Image.new('RGB',(w*n,h*((len(sub)+n-1)//n)),'white')
  for i,im in enumerate(sub): g.paste(im,((i%n)*w,(i//n)*h))
  g.save(f'sheet{part//16}.jpg',quality=85)
print(len(f))"
