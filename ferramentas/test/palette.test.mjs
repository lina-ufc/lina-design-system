import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
createRequire(import.meta.url)('../../assets/lina-palette.js');
const LinaPalette = globalThis.LinaPalette;

test('pares a usar (#s-contrastes-a-usar) são duo válidos', () => {
  for (const p of [['creme','umbro'],['creme','ferro'],['ferro','creme'],['damasco','umbro'],
                   ['areia','umbro'],['umbro','areia'],['turquesa','turquesa-tinta']])
    assert.equal(LinaPalette.check(p).ok, true, p.join('/'));
});
test('pares a evitar (#s-contrastes-a-evitar) são recusados', () => {
  assert.equal(LinaPalette.check(['turquesa','ferro']).ok, false);
  assert.equal(LinaPalette.check(['umbro','ferro']).ok, false);
  assert.match(LinaPalette.check(['turquesa','ferro']).reason, /evitar/i);
});
test('contraste baixo é recusado', () => {
  const r = LinaPalette.check(['areia','turquesa']);
  assert.equal(r.ok, false); assert.match(r.reason, /contraste/);
});
test('exemplos de #s-estudo-de-contraste, #s-contrastes-a-usar e #s-contrastes-a-evitar passam', () => {
  assert.equal(LinaPalette.check(['ferro-fundo','ferro']).kind, 'mono');
  assert.equal(LinaPalette.check(['nata','damasco']).kind, 'mono');
  assert.equal(LinaPalette.check(['areia','ferro']).kind, 'duo');
  assert.equal(LinaPalette.check(['creme','ferro','turquesa']).kind, 'trio');
  assert.equal(LinaPalette.check(['umbro','areia','ferro']).kind, 'trio');
});
test('contraste confere com #s-estudo-de-contraste', () => {
  assert.equal(LinaPalette.contrast('umbro','creme').toFixed(1), '15.1');
  assert.equal(LinaPalette.contrast('ferro','creme').toFixed(1), '6.6');
});
test('chaves do protótipo são recusadas', () => {
  assert.equal(LinaPalette.check(['constructor','creme']).ok, false);
  assert.equal(LinaPalette.check(['constructor','toString']).ok, false);
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
test('trio com terceira cor repetida é recusado', () => {
  for (const t of [['ferro','areia','areia'], ['ferro','areia','ferro']]) {
    const r = LinaPalette.check(t);
    assert.equal(r.ok, false, t.join('/')); assert.match(r.reason, /terceira/);
  }
  assert.ok(LinaPalette.combos('trio').every(([a, b, c]) => c !== a && c !== b));
});
