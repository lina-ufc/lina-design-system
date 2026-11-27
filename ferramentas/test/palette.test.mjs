import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
createRequire(import.meta.url)('../../assets/lina-palette.js');
const LinaPalette = globalThis.LinaPalette;

test('pares de 2.5 são duo válidos', () => {
  for (const p of [['creme','umbro'],['creme','ferro'],['ferro','creme'],['damasco','umbro'],
                   ['areia','umbro'],['umbro','areia'],['turquesa','turquesa-tinta']])
    assert.equal(LinaPalette.check(p).ok, true, p.join('/'));
});
test('pares de 2.6 são recusados', () => {
  assert.equal(LinaPalette.check(['turquesa','ferro']).ok, false);
  assert.equal(LinaPalette.check(['umbro','ferro']).ok, false);
  assert.match(LinaPalette.check(['turquesa','ferro']).reason, /evitar/i);
});
test('contraste baixo é recusado', () => {
  const r = LinaPalette.check(['creme','nata','damasco'].slice(0, 1).concat('areia'));
  assert.equal(r.ok, false);
});
test('exemplos de 3.4–3.6 passam', () => {
  assert.equal(LinaPalette.check(['ferro-fundo','ferro']).kind, 'mono');
  assert.equal(LinaPalette.check(['nata','damasco']).kind, 'mono');
  assert.equal(LinaPalette.check(['areia','ferro']).kind, 'duo');
  assert.equal(LinaPalette.check(['creme','ferro','turquesa']).kind, 'trio');
  assert.equal(LinaPalette.check(['umbro','areia','ferro']).kind, 'trio');
});
test('contraste confere com 2.4', () => {
  assert.equal(LinaPalette.contrast('umbro','creme').toFixed(1), '15.1');
  assert.equal(LinaPalette.contrast('ferro','creme').toFixed(1), '6.6');
});
test('nome desconhecido explica', () => {
  const r = LinaPalette.check(['Ferro','creme']);
  assert.equal(r.ok, false); assert.match(r.reason, /turquesa-fundo/);
});
test('combos devolve só válidas', () => {
  for (const k of ['mono', 'duo', 'trio']) {
    const c = LinaPalette.combos(k);
    assert.ok(c.length > 0, k);
    for (const n of c) assert.equal(LinaPalette.check(n).kind, k, n.join('/'));
  }
});
