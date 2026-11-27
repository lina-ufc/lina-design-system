#!/usr/bin/env node
// Uso: node ferramentas/tokens.mjs [--check] [--css tokens/colors.css]
// Gera tokens/lina.tokens.json (W3C DTCG 2025.10) da paleta e confere tokens/colors.css contra ela.
// ponytail: JSON só de cor. Espaço, raio, tipo, movimento e elevação ficam no CSS; entram aqui quando alguém precisar.
import { parseArgs } from 'node:util';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { load, fail } from './_carregar.mjs';

const raiz = new URL('../', import.meta.url);
const alvo = fileURLToPath(new URL('tokens/lina.tokens.json', raiz));
const { LinaPalette: P } = load();

let opts;
try {
  opts = parseArgs({ args: process.argv.slice(2), options: { check: { type: 'boolean' }, css: { type: 'string' } } }).values;
} catch { fail('argumentos inválidos. Uso: tokens.mjs [--check] [--css caminho].'); }
const cssPath = opts.css ?? fileURLToPath(new URL('tokens/colors.css', raiz));
if (!existsSync(cssPath)) fail(`CSS não encontrado: ${cssPath}.`);

const css = readFileSync(cssPath, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const root = css.match(/:root\s*\{([\s\S]*?)\}/)?.[1];
if (!root) fail('bloco :root não encontrado no CSS.');

const n4 = (v) => Math.round((v / 255) * 1e4) / 1e4;
const rgb = (r, g, b) => [r, g, b].map(n4);
const vars = [...root.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)].map(([, nome, v]) => [nome, v.trim()]);
const nomes = new Set(vars.map(([nome]) => nome));

const color = {
  $type: 'color',
  $description: 'Gerado de assets/lina-palette.js e tokens/colors.css. Não editar; rodar: node ferramentas/tokens.mjs',
  $extensions: { 'br.ufc.lina': { families: P.FAMILIES, avoid: P.AVOID, source: 'assets/lina-palette.js' } },
};
for (const [nome, v] of vars) {
  let m;
  if ((m = v.match(/^#([0-9a-f]{6})$/i))) {
    const esperado = P.COLORS[nome];
    if (!esperado) fail(`--${nome}: ${v} não existe em assets/lina-palette.js.`);
    if (esperado.toLowerCase() !== v.toLowerCase())
      fail(`--${nome}: CSS tem ${v}, paleta tem ${esperado}.`);
    const h = m[1];
    color[nome] = { $value: { colorSpace: 'srgb', components: rgb(...[0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))), hex: v.toLowerCase() } };
  } else if ((m = v.match(/^var\(--([\w-]+)\)$/))) {
    if (!nomes.has(m[1])) fail(`--${nome}: alias para --${m[1]}, que não existe.`);
    color[nome] = { $value: `{color.${m[1]}}` };
  } else if ((m = v.match(/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)$/))) {
    const [r, g, b] = m.slice(1, 4).map(Number);
    const hex = '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
    const value = { colorSpace: 'srgb', components: rgb(r, g, b), hex };
    const alpha = Number(m[4]);
    if (alpha !== 1) value.alpha = alpha;
    color[nome] = { $value: value };
  } else fail(`--${nome}: formato não suportado "${v}".`);
}
for (const nome of Object.keys(P.COLORS))
  if (!nomes.has(nome)) fail(`cor "${nome}" da paleta ausente em ${cssPath}.`);

const saida = JSON.stringify({ color }, null, 2) + '\n';
if (opts.check) {
  if (!existsSync(alvo) || readFileSync(alvo, 'utf8') !== saida) {
    process.stderr.write('tokens/lina.tokens.json desatualizado. Rodar: node ferramentas/tokens.mjs\n');
    process.exit(1);
  }
} else writeFileSync(alvo, saida);
