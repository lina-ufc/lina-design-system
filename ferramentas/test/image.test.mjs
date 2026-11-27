import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { sharp } from '../_carregar.mjs';
const req = createRequire(import.meta.url);
req('../../assets/lina-geometry.js');
req('../../assets/lina-palette.js');
req('../../assets/lina-texture.js');
req('../../assets/lina-image.js');
const LinaImage = globalThis.LinaImage;

const grad = (w, h, alpha = 255) => ({ width: w, height: h,
  data: Uint8ClampedArray.from({ length: w * h * 4 }, (_, i) => i % 4 === 3 ? alpha : Math.floor((i / 4 % w) / w * 255)) });
const dims = (svg) => svg.match(/viewBox="0 0 (\S+) (\S+)" width="(\S+)" height="(\S+)"/);

test('retrato mantém proporção', () => {
  const svg = LinaImage.render(grad(60, 90), { mode: 'field', colors: ['creme', 'umbro'], width: 600 });
  assert.match(svg, /width="600"/); assert.match(svg, /height="900"/);
});
test('paisagem mantém proporção', () => {
  const m = dims(LinaImage.render(grad(90, 60), { mode: 'field', colors: ['creme', 'umbro'], width: 600 }));
  assert.equal(m[3], '600'); assert.equal(m[4], '400');
});
for (const [w, h] of [[100, 13], [100, 77]]) for (const mode of ['dither', 'scatter', 'field'])
  test(`sem distorção vertical ${w}x${h} ${mode}`, () => {
    const m = dims(LinaImage.render(grad(w, h), { mode, detail: 0, colors: ['creme', 'umbro'], width: 400 }));
    const rows = Number(m[4]) / Number(m[3]) * 20;           // detail 0 = 20 células de largura
    const sampled = rows * w / 20;                           // altura amostrada, na mesma escala da largura
    assert.ok(sampled <= h + 1e-6 && sampled > h - w / 20, `amostrou ${sampled} de ${h}`);
  });
test('imagem baixa demais recusa em vez de esticar', () => {
  for (const mode of ['dither', 'scatter', 'field'])
    assert.throws(() => LinaImage.render(grad(100, 1), { mode, detail: 0, colors: ['creme', 'umbro'], width: 400 }), /baixa demais/);
});
test('PNG com transparência renderiza com a proporção', () => {
  const m = dims(LinaImage.render(grad(60, 90, 0), { mode: 'dither', colors: ['creme', 'umbro'], width: 600 }));
  assert.equal(m[3], '600'); assert.ok(Math.abs(Number(m[4]) - 900) < 600 / 84);
});
for (const mode of ['dither', 'scatter', 'field']) test('determinístico ' + mode, () => {
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
  const svg = LinaImage.render(grad(40, 40), { mode: 'field', colors: ['ferro', 'ferro-fundo'], width: 200 });
  assert.match(svg, /#A81F0D/); assert.match(svg, /#6E1408/);
});
const tem = (svg, hex) => svg.includes(`fill="${hex}"`);
for (const mode of ['dither', 'scatter', 'field']) test('três faixas rendem em ' + mode, () => {
  const svg = LinaImage.render(grad(80, 40), { mode, tones: ['ferro-fundo', 'ferro', 'creme'], width: 400, midtones: 0.5, cutoff: 0 });
  assert.match(svg, /<path/);
});
test('dois tons de tinta: um path por faixa, claros é o fundo', () => {
  const svg = LinaImage.render(grad(80, 40), { mode: 'scatter', tones: ['ferro-fundo', 'ferro', 'creme'], width: 400, midtones: 0.5, cutoff: 0 });
  assert.equal(svg.match(/<path/g).length, 2);
  assert.ok(tem(svg, '#6E1408') && tem(svg, '#A81F0D') && svg.includes('<rect') && tem(svg, '#FAF5C6'));
});
test('escuros = médios: um path só', () => {
  const svg = LinaImage.render(grad(80, 40), { tones: ['ferro', 'ferro', 'creme'], width: 400 });
  assert.equal(svg.match(/<path/g).length, 1);
});
test('none não gera fill: sem fundo e sem a faixa', () => {
  for (const mode of ['dither', 'scatter', 'field']) {
    const svg = LinaImage.render(grad(80, 40), { mode, tones: ['ferro', 'none', 'none'], width: 400 });
    assert.doesNotMatch(svg, /<rect/); assert.doesNotMatch(svg, /none/);
    assert.equal(svg.match(/fill="/g).length, 1);
  }
  const sem = LinaImage.render(grad(80, 40), { tones: ['none', 'none', 'creme'], width: 400 });
  assert.doesNotMatch(sem, /<path/);
});
test('faixa escura só tem tinta escura, a média o resto', () => {
  const p = { mode: 'field', width: 400, midtones: 0.5, cutoff: 0 };
  const so = (tones) => LinaImage.render(grad(80, 40), { ...p, tones });
  const dark = so(['ferro', 'none', 'none']), mid = so(['none', 'ferro', 'none']);
  assert.notEqual(dark, mid);
  for (const svg of [dark, mid]) assert.match(svg, / d="M/);
});
test('só escuros e médios repetem cor; claros igual à tinta e tudo none recusam', () => {
  for (const tones of [['creme', 'ferro', 'creme'], ['ferro', 'none', 'ferro'], ['ferro', 'ferro', 'ferro'], ['none', 'none', 'none']])
    assert.throws(() => LinaImage.fromParams({ tones }), /mesma cor|ao menos uma faixa/, tones.join());
  assert.ok(LinaImage.fromParams({ tones: ['ferro', 'ferro', 'creme'] }));
});
test('cores diferentes: média é a união por baixo, escura por cima; faixas disjuntas', async () => {
  const d = (svg) => [...svg.matchAll(/ d="([^"]*)"/g)].map((m) => m[1]);
  for (const mode of ['dither', 'scatter', 'field']) {
    const p = { mode, width: 800, midtones: 0.5, cutoff: 0, detail: 0.3 };
    const img = grad(80, 40);
    const [un] = d(LinaImage.render(img, { ...p, tones: ['ferro', 'ferro', 'creme'] }));
    const duo = d(LinaImage.render(img, { ...p, tones: ['ferro-fundo', 'ferro', 'creme'] }));
    assert.equal(duo.length, 2, mode); assert.equal(duo[0], un, mode + ': união');
    const alfa = async (tones) => {
      const { data } = await sharp()(Buffer.from(LinaImage.render(img, { ...p, tones }))).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      return data.filter((_, i) => i % 4 === 3);
    };
    const [a, b] = [await alfa(['ferro', 'none', 'none']), await alfa(['none', 'ferro', 'none'])];
    assert.ok(a.some((v) => v > 200) && b.some((v) => v > 200), mode + ': faixas vazias');
    assert.equal(a.filter((v, i) => v > 200 && b[i] > 200).length, 0, mode + ': disjuntas');
  }
});
test('par vizinho recusado lança com o motivo', () => {
  assert.throws(() => LinaImage.render(grad(10, 10), { tones: ['ferro', 'ferro', 'turquesa'], width: 100 }), /evitar/);
  assert.throws(() => LinaImage.render(grad(10, 10), { tones: ['ferro', 'umbro', 'creme'], width: 100 }), /evitar/);
  assert.throws(() => LinaImage.render(grad(10, 10), { tones: ['ferro', 'ferro'], width: 100 }), /3 itens/);
  assert.throws(() => LinaImage.render(grad(10, 10), { tones: ['ferro', 'x', 'creme'], width: 100 }), /Cor desconhecida/);
});
test('colors antigo converte [bg, fg] em [fg, fg, bg] com aviso, SVG igual', () => {
  const a = LinaImage.fromParams({ colors: ['creme', 'umbro'] });
  assert.deepEqual(a.tones, ['#2A1A12', '#2A1A12', '#FAF5C6']); assert.equal(a.warnings.length, 1);
  assert.equal(LinaImage.fromParams({ tones: ['umbro', 'umbro', 'creme'] }).warnings.length, 0);
  const p = { mode: 'scatter', width: 300 };
  assert.equal(LinaImage.render(grad(60, 40), { ...p, colors: ['creme', 'umbro'] }),
    LinaImage.render(grad(60, 40), { ...p, tones: ['umbro', 'umbro', 'creme'] }));
});
test('modo bitmap saiu', () =>
  assert.throws(() => LinaImage.fromParams({ mode: 'bitmap', tones: ['ferro', 'ferro', 'creme'] }), /Modo desconhecido/));
test('fromParams mapeia frações 0–1 para o motor', () => {
  const { options, tones } = LinaImage.fromParams({ mode: 'field', detail: 0, brightness: 1, contrast: 0.5,
    cutoff: 0.2, smooth: 0.1, invert: true, tones: ['ferro', 'ferro', 'creme'], width: 100 });
  assert.equal(options.mode, 'field'); assert.equal(options.detail, 20);
  assert.equal(options.brightness, 1); assert.equal(options.contrast, 0);
  assert.equal(options.cutoff, 0.2); assert.equal(options.invert, true);
  assert.equal(options.radius, 0.25);
  assert.deepEqual(tones, ['#A81F0D', '#A81F0D', '#FAF5C6']);
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
test('fração fora de 0–1 recusa com o nome', () => {
  for (const k of ['detail', 'brightness', 'contrast', 'midtones', 'cutoff', 'smooth'])
    assert.throws(() => LinaImage.fromParams({ colors: ['creme', 'ferro'], [k]: 84 }), new RegExp(`${k} é fração de 0 a 1`));
  assert.throws(() => LinaImage.fromParams({ colors: ['creme', 'ferro'], detail: -0.1 }), /detail/);
});
test('width padrão 1080 e width 0 recusa', () => {
  assert.match(LinaImage.render(grad(40, 40), { mode: 'field', colors: ['creme', 'ferro'] }), /width="1080"/);
  assert.throws(() => LinaImage.render(grad(40, 40), { colors: ['creme', 'ferro'], width: 0 }), /width/);
});
