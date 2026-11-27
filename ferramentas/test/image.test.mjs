import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const req = createRequire(import.meta.url);
req('../../assets/lina-geometry.js');
req('../../assets/lina-palette.js');
req('../../assets/lina-image.js');
const LinaImage = globalThis.LinaImage;

const grad = (w, h, alpha = 255) => ({ width: w, height: h,
  data: Uint8ClampedArray.from({ length: w * h * 4 }, (_, i) => i % 4 === 3 ? alpha : Math.floor((i / 4 % w) / w * 255)) });
const dims = (svg) => svg.match(/viewBox="0 0 (\S+) (\S+)" width="(\S+)" height="(\S+)"/);

test('retrato mantém proporção', () => {
  const svg = LinaImage.render(grad(60, 90), { mode: 'bitmap', colors: ['creme', 'umbro'], width: 600 });
  assert.match(svg, /width="600"/); assert.match(svg, /height="900"/);
});
test('paisagem mantém proporção', () => {
  const m = dims(LinaImage.render(grad(90, 60), { mode: 'bitmap', colors: ['creme', 'umbro'], width: 600 }));
  assert.equal(m[3], '600'); assert.equal(m[4], '400');
});
test('PNG com transparência renderiza com a proporção', () => {
  const m = dims(LinaImage.render(grad(60, 90, 0), { mode: 'dither', colors: ['creme', 'umbro'], width: 600 }));
  assert.equal(m[3], '600'); assert.ok(Math.abs(Number(m[4]) - 900) < 600 / 84);
});
for (const mode of ['dither', 'bitmap']) test('determinístico ' + mode, () => {
  const p = { mode, colors: ['creme', 'ferro'], width: 400 };
  assert.equal(LinaImage.render(grad(80, 40), p), LinaImage.render(grad(80, 40), p));
});
test('recusa trio', () =>
  assert.throws(() => LinaImage.render(grad(10, 10), { colors: ['creme', 'ferro', 'umbro'], width: 100 }), /2 cores/));
test('recusa par proibido e nome inválido', () => {
  assert.throws(() => LinaImage.render(grad(10, 10), { colors: ['turquesa', 'ferro'], width: 100 }), /evitar|contraste/);
  assert.throws(() => LinaImage.render(grad(10, 10), { colors: ['Creme', 'ferro'], width: 100 }), /Nomes válidos/);
});
test('mono é aceito, cores do sistema no SVG', () => {
  const svg = LinaImage.render(grad(40, 40), { mode: 'bitmap', colors: ['ferro', 'ferro-fundo'], width: 200 });
  assert.match(svg, /#A81F0D/); assert.match(svg, /#6E1408/);
});
test('fromParams mapeia frações 0–1 para o motor', () => {
  const { options, colors } = LinaImage.fromParams({ mode: 'bitmap', detail: 0, brightness: 1, contrast: 0.5,
    cutoff: 0.2, smooth: 0.1, invert: true, dither: 'ordered', colors: ['creme', 'ferro'], width: 100 });
  assert.equal(options.mode, 'bitmap'); assert.equal(options.detail, 20);
  assert.equal(options.brightness, 1); assert.equal(options.contrast, 0);
  assert.equal(options.cutoff, 0.2); assert.equal(options.invert, true); assert.equal(options.dither, 'ordered');
  assert.equal(options.radius, 0.25);
  assert.deepEqual(colors, { bg: '#FAF5C6', fg: '#A81F0D' });
});
test('modo desconhecido lança', () =>
  assert.throws(() => LinaImage.fromParams({ mode: 'x', colors: ['creme', 'ferro'], width: 100 }), /Modo desconhecido/));
test('PALETTES derivado dos duos', () => {
  assert.ok(LinaImage.PALETTES.length > 0);
  for (const p of LinaImage.PALETTES) assert.deepEqual(Object.keys(p), ['name', 'bg', 'fg']);
});
test('nenhuma cor do lina-visual-code', () => {
  const src = readFileSync(new URL('../../assets/lina-image.js', import.meta.url), 'utf8');
  assert.doesNotMatch(src, /#9B0A0E|#520000|#FFFFFF|#000000|#F1EDE6/i);
});
test('API antiga exportada', () => {
  for (const k of ['prepare', 'process', 'outline', 'DEFAULTS', 'CELL']) assert.ok(LinaImage[k] !== undefined, k);
});
