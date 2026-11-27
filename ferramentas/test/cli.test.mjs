import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('../../', import.meta.url).pathname;
const run = (script, args) => spawnSync('node', [join(root, script), ...args], { cwd: root, encoding: 'utf8' });
const PNG = 'assets/logos-institutions/funcap/funcap-horizontal-cor.png';

test('textura gera SVG', () => {
  const r = run('ferramentas/textura.mjs', ['--mode', 'scatter', '--seed', '3', '--width', '800',
    '--height', '800', '--cells', '32', '--colors', 'damasco,umbro']);
  assert.equal(r.status, 0); assert.match(r.stdout, /^<svg/);
});
test('combinação proibida sai com 2', () => {
  const r = run('ferramentas/textura.mjs', ['--colors', 'turquesa,ferro']);
  assert.equal(r.status, 2); assert.match(r.stderr, /evitar|vibra|contraste/i);
  assert.equal(r.stdout, ''); assert.doesNotMatch(r.stderr, /\n\s+at /);
});
test('mesmos parâmetros, mesmo SVG', () => {
  const a = ['--seed', '5', '--colors', 'creme,ferro', '--blank', '0.4', '--no-pinholes'];
  const x = run('ferramentas/textura.mjs', a), y = run('ferramentas/textura.mjs', a);
  assert.equal(x.status, 0); assert.equal(x.stdout, y.stdout);
});
test('canvas não proporcional: largura exata', () => {
  const r = run('ferramentas/textura.mjs', ['--width', '1080', '--height', '1350', '--cells', '37', '--colors', 'creme,ferro']);
  assert.equal(r.status, 0); assert.match(r.stdout, /width="1080"/);
});
test('--out grava arquivo e deixa stdout vazio', () => {
  const f = join(mkdtempSync(join(tmpdir(), 'lina-')), 't.svg');
  const r = run('ferramentas/textura.mjs', ['--colors', 'creme,ferro', '--out', f]);
  assert.equal(r.status, 0); assert.equal(r.stdout, ''); assert.match(readFileSync(f, 'utf8'), /^<svg/);
});
test('flag desconhecida e número inválido saem com 2', () => {
  for (const a of [['--foo', '1'], ['--seed', 'abc'], ['--mode', 'glyphs']]) {
    const r = run('ferramentas/textura.mjs', [...a, '--colors', 'creme,ferro']);
    assert.equal(r.status, 2, a.join(' ')); assert.equal(r.stdout, ''); assert.doesNotMatch(r.stderr, /\n\s+at /);
  }
});
test('--list-colors lista por tipo', () => {
  const r = run('ferramentas/textura.mjs', ['--list-colors']);
  assert.equal(r.status, 0); assert.match(r.stdout, /mono/); assert.match(r.stdout, /duo/); assert.match(r.stdout, /trio/);
  assert.match(r.stdout, /^[a-z-]+,[a-z-]+(,[a-z-]+)?$/m);
});
test('imagem a partir de PNG', () => {
  const r = run('ferramentas/imagem.mjs', [PNG, '--colors', 'creme,umbro', '--width', '300']);
  assert.equal(r.status, 0); assert.match(r.stdout, /width="300"/);
});
test('imagem: de outro cwd, trio, foto inexistente, sem caminho', () => {
  const abs = spawnSync('node', [join(root, 'ferramentas/imagem.mjs'), join(root, PNG), '--colors', 'creme,umbro', '--width', '300'],
    { cwd: tmpdir(), encoding: 'utf8' });
  assert.equal(abs.status, 0);
  for (const a of [[PNG, '--colors', 'creme,umbro,ferro'], ['nao-existe.png', '--colors', 'creme,umbro'], ['--colors', 'creme,umbro']]) {
    const r = run('ferramentas/imagem.mjs', a);
    assert.equal(r.status, 2, a.join(' ')); assert.equal(r.stdout, ''); assert.doesNotMatch(r.stderr, /\n\s+at /);
  }
});
test('imagem: JPEG com EXIF orientation 6 sai em retrato', async () => {
  const sharp = createRequire(new URL('../../templates/apresentacao/potx/package.json', import.meta.url))('sharp');
  const f = join(mkdtempSync(join(tmpdir(), 'lina-')), 'f.jpg');
  await sharp({ create: { width: 200, height: 100, channels: 3, background: '#888' } })
    .jpeg().withMetadata({ orientation: 6 }).toFile(f);
  const r = run('ferramentas/imagem.mjs', [f, '--colors', 'creme,umbro', '--width', '300']);
  assert.equal(r.status, 0);
  const m = r.stdout.match(/width="300" height="(\S+)"/);
  assert.ok(Number(m[1]) > 300, `altura ${m[1]} não é retrato`);
});
test('textura e imagem: fração fora de 0–1 sai com 2', () => {
  for (const [s, a] of [['textura', ['--blank', '5']], ['textura', ['--edges', 'x']], ['imagem', ['--detail', '84', PNG]]]) {
    const r = run(`ferramentas/${s}.mjs`, [...a, '--colors', 'creme,umbro']);
    assert.equal(r.status, 2, a.join(' ')); assert.equal(r.stdout, '');
  }
});
