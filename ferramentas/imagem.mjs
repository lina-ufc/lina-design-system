#!/usr/bin/env node
// Uso: node ferramentas/imagem.mjs foto.jpg --mode dither --colors creme,umbro --width 1080 [--out i.svg]
import { load, sharp, flags, fail, listColors, emit } from './_carregar.mjs';

const { LinaPalette, LinaImage } = load();
const { params, out, list, args } = flags(process.argv.slice(2), {
  num: ['width', 'detail', 'brightness', 'contrast', 'midtones', 'cutoff', 'smooth'],
  bool: ['invert'], str: ['mode', 'dither'],
}, { positional: true });
if (list) { listColors(LinaPalette); process.exit(0); }
if (args.length !== 1) fail('informe o caminho da foto: imagem.mjs foto.jpg --colors creme,umbro');
if (params.dither !== undefined && params.dither.trim() !== '' && Number.isFinite(Number(params.dither))) params.dither = Number(params.dither);
let svg;
try {
  const { data, info } = await sharp()(args[0]).rotate().ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  svg = LinaImage.render({ width: info.width, height: info.height, data: new Uint8ClampedArray(data) },
    params);
} catch (e) { fail(e.code === 'ENOENT' || /Input file/.test(e.message) ? `foto não encontrada ou ilegível: ${args[0]}` : e.message); }
emit(svg, out);
