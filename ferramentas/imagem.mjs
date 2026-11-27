#!/usr/bin/env node
// Uso: node ferramentas/imagem.mjs foto.jpg --mode dither|scatter|field --tones ferro,ferro,creme --width 1080 [--out i.svg]
import { load, lerFoto, flags, fail, listColors, emit } from './_carregar.mjs';

const { LinaPalette, LinaImage } = load();
const { params, out, list, args } = flags(process.argv.slice(2), {
  num: ['width', 'detail', 'brightness', 'contrast', 'midtones', 'cutoff', 'smooth'],
  bool: ['invert'], str: ['mode'],
}, { positional: true });
if (list) { listColors(LinaPalette); process.exit(0); }
if (args.length !== 1) fail('informe o caminho da foto: imagem.mjs foto.jpg --tones ferro,ferro,creme');
let svg;
try {
  for (const w of LinaImage.fromParams(params).warnings) process.stderr.write(`Aviso: ${w}\n`);
  const { data, info } = await lerFoto(args[0]);
  svg = LinaImage.render({ width: info.width, height: info.height, data: new Uint8ClampedArray(data) },
    params);
} catch (e) { fail(e.code === 'ENOENT' || /Input file/.test(e.message) ? `foto não encontrada ou ilegível: ${args[0]}` : e.message); }
emit(svg, out);
