import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const req = createRequire(import.meta.url);
req('../../assets/lina-geometry.js');
req('../../assets/lina-palette.js');
req('../../assets/lina-texture.js');
const LinaTexture = globalThis.LinaTexture;

const P = { mode:'field', seed:7, width:1080, height:1350, cells:36,
            colors:['creme','ferro'], blank:.5, clump:.6 };
test('determinístico', () => assert.equal(LinaTexture.render(P), LinaTexture.render(P)));
test('largura exata', () => assert.match(LinaTexture.render(P), /width="1080"/));
test('cores do sistema', () => {
  const svg = LinaTexture.render(P);
  assert.match(svg, /#FAF5C6/); assert.match(svg, /#A81F0D/); assert.doesNotMatch(svg, /#9B0A0E/);
});
test('recusa par proibido', () =>
  assert.throws(() => LinaTexture.render({ ...P, colors:['turquesa','ferro'] }), /vibra|contraste|evitar/i));
test('regra da célula em 20 sementes', () => {
  for (const mode of ['scatter','field']) for (let seed = 1; seed <= 20; seed++)
    assert.ok(LinaTexture.legal(LinaTexture.generate(LinaTexture.fromParams({ ...P, mode, seed }).options)), mode + ' ' + seed);
});
test('trio usa a terceira cor', () =>
  assert.match(LinaTexture.render({ ...P, seed:8, colors:['creme','ferro','turquesa'], accent:.2 }), /#64B6AC/));
test('canvas não proporcional: largura exata, altura de linhas inteiras', () => {
  const svg = LinaTexture.render({ ...P, cells:37 });
  const m = svg.match(/viewBox="0 0 (\S+) (\S+)" width="(\S+)" height="(\S+)"/);
  assert.equal(m[3], '1080'); assert.equal(m[1], '1080');
  assert.equal(m[2], m[4]);
  const rows = Math.round(37 * 1350 / 1080), scale = 1080 / 74;
  assert.ok(Math.abs(Number(m[4]) - rows * 2 * scale) < 0.01);
  assert.doesNotMatch(m[4], /\.\d{3,}/);
});
test('PALETTES derivado dos duos', () => {
  assert.ok(LinaTexture.PALETTES.length > 0);
  for (const p of LinaTexture.PALETTES) assert.deepEqual(Object.keys(p), ['name','bg','fg','accent']);
});
test('toSVG sem id mantém ids distintos', () => {
  const res = LinaTexture.generate(LinaTexture.fromParams(P).options);
  const c = { bg:'#FAF5C6', fg:'#A81F0D', accent:'#A81F0D' };
  assert.notEqual(LinaTexture.toSVG(res, c), LinaTexture.toSVG(res, c));
});
test('defaults do motor: sem cells/width/height', () => {
  const svg = LinaTexture.render({ colors: ['creme', 'ferro'] });
  assert.match(svg, /width="1080" height="1080"/); assert.doesNotMatch(svg, /NaN/);
});
test('recusa cells, width, height, fração e edges inválidos', () => {
  const c = ['creme', 'ferro'];
  for (const [o, re] of [[{ cells: 0 }, /cells/], [{ cells: 3.5 }, /cells/], [{ cells: 3 }, /cells/],
    [{ width: 0 }, /width/], [{ height: -1 }, /height/], [{ blank: 5 }, /blank é fração de 0 a 1/],
    [{ accent: 2 }, /accent/], [{ edges: 'x' }, /bleed, seamless/]])
    assert.throws(() => LinaTexture.render({ colors: c, ...o }), re, JSON.stringify(o));
});
