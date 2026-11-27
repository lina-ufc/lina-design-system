import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { sharp } from '../_carregar.mjs';

const req = createRequire(import.meta.url);
for (const m of ['geometry', 'palette', 'texture', 'image', 'ferramenta']) req(`../../assets/lina-${m}.js`);
const { LinaTexture, LinaImage, LinaFerramenta: F } = globalThis;
const raiz = new URL('../../', import.meta.url).pathname;
const FOTO = 'assets/logos-institutions/funcap/funcap-horizontal-cor.png';

// roda a linha de comando de `comando` (sem --out) e devolve o stdout
function rodar(linha) {
  const partes = linha.replace(/ --out \S+$/, '').split(' ');
  assert.equal(partes[0], 'node');
  const r = spawnSync('node', partes.slice(1), { cwd: raiz, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  return r.stdout;
}

test('hash: ida e volta com todas as chaves de textura', () => {
  const p = { mode: 'scatter', seed: 42, width: 800, height: 1350, cells: 37, colors: ['damasco', 'umbro', 'turquesa'],
    blank: 0.4, steps: 0.25, quarter: 0.1, clump: 0.9, grain: 7, stretch: 0.3, accent: 0.2, edges: 'seamless', pinholes: false };
  assert.deepEqual(Object.keys(p).sort(), Object.keys(F.ESQUEMAS.textura).sort());
  const r = F.lerHash(F.escreverHash(p, F.ESQUEMAS.textura), F.ESQUEMAS.textura);
  assert.deepEqual(r.params, p); assert.deepEqual(r.avisos, []);
});

test('hash: padrões não entram na URL; # inicial é aceito', () => {
  const E = F.ESQUEMAS.textura;
  const { params } = F.lerHash('', E);
  assert.equal(F.escreverHash(params, E), '');
  assert.equal(F.lerHash('#seed=7', E).params.seed, 7);
  assert.equal(F.lerHash('seed=7', E).params.seed, 7);
});

test('hash: ida e volta de imagem', () => {
  const E = F.ESQUEMAS.imagem;
  const p = { ...F.lerHash('', E).params, mode: 'bitmap', dither: 'ordered', invert: true, colors: ['creme', 'umbro'], width: 640, detail: 0.7 };
  assert.deepEqual(F.lerHash(F.escreverHash(p, E), E).params, p);
});

test('hash adulterado: padrões e 4 avisos, sem lançar', () => {
  const E = F.ESQUEMAS.textura;
  const r = F.lerHash('#seed=abc&blank=5&mode=glyphs&colors=xyz&foo=1', E);
  const padrao = F.lerHash('', E).params;
  for (const k of ['seed', 'blank', 'mode', 'colors']) assert.deepEqual(r.params[k], padrao[k], k);
  assert.equal(r.avisos.length, 4);
  for (const k of ['seed', 'blank', 'mode', 'colors']) assert.ok(r.avisos.some((a) => a.includes(k)), k);
  assert.ok(!r.avisos.some((a) => a.includes('foo')));
});

test('hash: faixas e tipos', () => {
  const E = F.ESQUEMAS.textura;
  for (const h of ['seed=1.5', 'seed=-1', 'seed=1000000', 'cells=3', 'cells=121', 'width=0', 'width=99999',
    'pinholes=talvez', 'edges=x', 'colors=creme', 'colors=turquesa,ferro', 'grain=', 'accent=2']) {
    assert.equal(F.lerHash(h, E).avisos.length, 1, h);
  }
  assert.equal(F.lerHash('colors=creme,ferro,turquesa', E).avisos.length, 0);
  assert.equal(F.lerHash('colors=creme,ferro,turquesa', F.ESQUEMAS.imagem).avisos.length, 1); // trio não vale na imagem
});

test('comando de textura reproduz o motor', () => {
  const base = { seed: 7, width: 800, height: 1000, cells: 32, blank: 0.4, grain: 6 };
  for (const p of [
    { ...base, mode: 'dither', colors: ['creme', 'ferro'] },
    { ...base, mode: 'scatter', colors: ['damasco', 'umbro'], pinholes: false, edges: 'cut' },
    { ...base, mode: 'field', colors: ['creme', 'ferro', 'turquesa'], accent: 0.2, stretch: 0.3 },
  ]) {
    const linha = F.comando('textura', p);
    assert.match(linha, /^node ferramentas\/textura\.mjs /);
    assert.equal(rodar(linha), LinaTexture.render(p), linha);
  }
});

test('comando de imagem reproduz o motor', async () => {
  const { data, info } = await sharp()(raiz + FOTO).rotate().ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const img = { width: info.width, height: info.height, data: new Uint8ClampedArray(data) };
  for (const p of [
    { mode: 'dither', dither: 'ordered', colors: ['creme', 'umbro'], width: 300, detail: 0.5, invert: true },
    { mode: 'bitmap', colors: ['creme', 'ferro'], width: 400, contrast: 0.6, cutoff: 0.2 },
  ]) {
    const linha = F.comando('imagem', p, FOTO);
    assert.match(linha, /^node ferramentas\/imagem\.mjs assets\/\S+ /);
    assert.equal(rodar(linha), LinaImage.render(img, p), linha);
  }
});
