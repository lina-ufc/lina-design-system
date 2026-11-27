// Código comum das linhas de comando: carrega os motores, lê flags, escreve o SVG.
import { createRequire } from 'node:module';
import { parseArgs } from 'node:util';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const raiz = new URL('../', import.meta.url);
const req = createRequire(import.meta.url);

export function load() {
  for (const m of ['lina-geometry', 'lina-palette', 'lina-texture', 'lina-image'])
    req(fileURLToPath(new URL(`assets/${m}.js`, raiz)));
  const { LinaPalette, LinaTexture, LinaImage } = globalThis;
  return { LinaPalette, LinaTexture, LinaImage };
}

export function sharp() {
  return createRequire(new URL('templates/apresentacao/potx/package.json', raiz))('sharp');
}

// Lê a foto em RGBA e reduz a 1600 px no lado maior, como o site (lina-ui-imagem.js, LADO).
export async function lerFoto(caminho) {
  const s = sharp();
  let { data, info } = await s(caminho).rotate().ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const k = Math.min(1, 1600 / Math.max(info.width, info.height));
  if (k < 1) ({ data, info } = await s(data, { raw: info })
    .resize(Math.max(1, Math.round(info.width * k)), Math.max(1, Math.round(info.height * k)), { fit: 'fill' })
    .raw().toBuffer({ resolveWithObject: true }));
  return { data, info };
}

export const fail = (msg) => { process.stderr.write(`Erro: ${msg}\n`); process.exit(2); };

// spec: { num: [...], bool: [...], str: [...] } → params; `colors` e `tones` viram lista; `--no-x` desliga booleana.
export function flags(argv, spec, { positional = false } = {}) {
  const options = { out: { type: 'string' }, colors: { type: 'string' }, tones: { type: 'string' }, 'list-colors': { type: 'boolean' } };
  for (const k of [...spec.num, ...spec.str]) options[k] = { type: 'string' };
  for (const k of spec.bool) options[k] = { type: 'boolean' };
  let r;
  try { r = parseArgs({ args: argv, options, allowPositionals: positional, allowNegative: true }); }
  catch (e) {
    fail(e.code === 'ERR_PARSE_ARGS_UNKNOWN_OPTION' ? `flag desconhecida: ${e.message.match(/'(-[^']*)'/)?.[1] ?? ''}.`
      : e.code === 'ERR_PARSE_ARGS_INVALID_OPTION_VALUE' ? 'flag sem valor ou com valor inesperado.' : 'argumentos inválidos.');
  }
  const params = {};
  for (const [k, v] of Object.entries(r.values)) {
    if (['out', 'list-colors'].includes(k)) continue;
    if (k === 'colors' || k === 'tones') params[k] = v.split(',').map((s) => s.trim());
    else if (spec.num.includes(k)) {
      const n = Number(v);
      if (v.trim() === '' || !Number.isFinite(n)) fail(`--${k} precisa de número, veio "${v}".`);
      params[k] = n;
    } else params[k] = v;
  }
  return { params, out: r.values.out, list: r.values['list-colors'], args: r.positionals };
}

export function listColors(LinaPalette) {
  for (const kind of ['mono', 'duo', 'trio'])
    process.stdout.write(`# ${kind}\n${LinaPalette.combos(kind).map((c) => c.join(',')).join('\n')}\n`);
}

export function emit(svg, out) {
  if (out) writeFileSync(out, svg); else process.stdout.write(svg);
}
