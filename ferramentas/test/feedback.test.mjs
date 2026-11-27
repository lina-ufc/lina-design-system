import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const root = new URL('../../', import.meta.url).pathname;
const ctx = {};
vm.runInNewContext(readFileSync(root + 'feedback/apps-script.gs', 'utf8'), ctx);
const { limpa, decide } = ctx;
// objetos do vm têm outro Object.prototype; copia para o realm do teste (deepStrictEqual)
const valida = (p, a) => { const r = ctx.valida(p, a); return r.ok ? { ok: true, linha: [...r.linha] } : { ...r }; };
const base = { tipo: 'Erro', pagina: 'cores.html', mensagem: 'Contraste baixo no 3.2', nome: 'Ana', email: 'ana@ufc.br' };

test('valida aceita envio completo e monta a linha', () => {
  const agora = new Date('2026-11-27T10:00:00Z');
  const r = valida(base, agora);
  assert.equal(r.ok, true);
  assert.deepEqual(r.linha, [agora, 'Erro', 'cores.html', 'Contraste baixo no 3.2', 'Ana', 'ana@ufc.br', 'nova']);
});
test('página é opcional', () => assert.equal(valida({ ...base, pagina: '' }, new Date()).ok, true));
test('recusa cada campo', () => {
  for (const [campo, valor, erro] of [
    ['tipo', 'Elogio', 'tipo'], ['mensagem', ' \n ', 'mensagem'], ['mensagem', 'x'.repeat(2001), 'mensagem'],
    ['nome', '', 'nome'], ['nome', 'x'.repeat(121), 'nome'],
    ['email', 'ana@', 'email'], ['email', 'ana @ufc.br', 'email'], ['email', 'ana@ufc', 'email'],
    ['pagina', 'x'.repeat(201), 'pagina']])
    assert.deepEqual(valida({ ...base, [campo]: valor }, new Date()), { ok: false, erro }, `${campo}=${valor.slice(0, 12)}`);
});
test('limpa corta espaços e neutraliza fórmula', () => {
  assert.equal(limpa('  oi  '), 'oi');
  for (const s of ['=SOMA(A1)', '+1', '-1', '@x']) assert.equal(limpa(s), "'" + s);
  assert.equal(valida({ ...base, mensagem: '=HYPERLINK("x")' }, new Date()).linha[3], `'=HYPERLINK("x")`);
});
test('decide pela isca e pelo teto do dia', () => {
  assert.equal(decide({ ...base, site: 'x' }, 0), 'descarta');
  assert.equal(decide(base, 0), 'grava');
  assert.equal(decide(base, 19), 'grava');
  assert.equal(decide(base, 20), 'grava-sem-email');
  assert.equal(decide(base, 200), 'descarta');
});
test('doPost sem parâmetros não lança', () => {
  // ponytail: só o ramo de erro de validação roda em Node (sem LockService real); stubs mínimos
  const saida = [];
  const c = {
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => null, setProperty() {} }) },
    Utilities: { formatDate: () => '2026-11-27' },
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: (t) => ({ t, setMimeType() { return this; } }) },
  };
  vm.runInNewContext(readFileSync(root + 'feedback/apps-script.gs', 'utf8'), c);
  for (const e of [undefined, {}, { parameter: {} }]) saida.push(JSON.parse(c.doPost(e).t));
  assert.deepEqual(saida, Array(3).fill({ ok: false, erro: 'tipo' }));
});
