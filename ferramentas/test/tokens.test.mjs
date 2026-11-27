import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('../../', import.meta.url).pathname;
const run = (args) => spawnSync('node', [join(root, 'ferramentas/tokens.mjs'), ...args], { cwd: root, encoding: 'utf8' });
createRequire(import.meta.url)(join(root, 'assets/lina-palette.js'));
const { COLORS } = globalThis.LinaPalette;
const json = () => JSON.parse(readFileSync(join(root, 'tokens/lina.tokens.json'), 'utf8')).color;

test('JSON versionado confere com a geração', () => {
  const r = run(['--check']);
  assert.equal(r.status, 0, r.stderr);
});
test('12 primitivos: hex da paleta e componentes voltam ao hex', () => {
  const c = json();
  for (const [nome, hex] of Object.entries(COLORS)) {
    const v = c[nome].$value;
    assert.equal(v.colorSpace, 'srgb');
    assert.equal(v.hex.toLowerCase(), hex.toLowerCase());
    const volta = '#' + v.components.map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
    assert.equal(volta, hex.toLowerCase(), nome);
    assert.equal(v.alpha, undefined, nome);
  }
});
test('text-muted tem alpha 0.62', () => {
  assert.equal(json()['text-muted'].$value.alpha, 0.62);
});
test('todo alias aponta para token existente', () => {
  const c = json();
  for (const [nome, t] of Object.entries(c)) {
    if (nome.startsWith('$') || typeof t.$value !== 'string') continue;
    const m = t.$value.match(/^\{color\.([\w-]+)\}$/);
    assert.ok(m, `${nome}: alias malformado ${t.$value}`);
    assert.ok(c[m[1]], `${nome}: alias para ${m[1]} inexistente`);
  }
});
test('CSS adulterado sai com 2', () => {
  const css = readFileSync(join(root, 'tokens/colors.css'), 'utf8').replace('#A81F0D', '#A81F0E');
  const f = join(mkdtempSync(join(tmpdir(), 'lina-')), 'colors.css');
  writeFileSync(f, css);
  const r = run(['--check', '--css', f]);
  assert.equal(r.status, 2); assert.match(r.stderr, /ferro/); assert.doesNotMatch(r.stderr, /\n\s+at /);
});
