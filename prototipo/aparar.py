"""Corta embaixo as linhas iguais à última linha da imagem (fundo da barra lateral
e do conteúdo, que têm cores diferentes). Nunca redimensiona. Uso: aparar.py arquivo.png"""
import sys
from PIL import Image, ImageChops

caminho = sys.argv[1]
img = Image.open(caminho).convert("RGB")
ultima = img.crop((0, img.height - 1, img.width, img.height))
fundo = ultima.resize(img.size, Image.NEAREST)
caixa = ImageChops.difference(img, fundo).getbbox()
altura = caixa[3] if caixa else img.height
img.crop((0, 0, img.width, altura)).save(caminho)
print(caminho, img.width, altura)
