#!/usr/bin/env node
// Uso: node ferramentas/textura.mjs --mode field --seed 7 --width 1080 --height 1350 --cells 36 --colors creme,ferro [--out t.svg]
import { load, flags, fail, listColors, emit } from './_carregar.mjs';

const { LinaPalette, LinaTexture } = load();
const { params, out, list } = flags(process.argv.slice(2), {
  num: ['seed', 'width', 'height', 'cells', 'blank', 'steps', 'quarter', 'clump', 'grain', 'stretch', 'accent'],
  bool: ['pinholes'], str: ['mode', 'edges'],
});
if (list) { listColors(LinaPalette); process.exit(0); }
const p = { mode: 'field', seed: 1, width: 1080, height: 1080, cells: 36, ...params };
let svg;
try { svg = LinaTexture.render(p); } catch (e) { fail(e.message); }
emit(svg, out);
