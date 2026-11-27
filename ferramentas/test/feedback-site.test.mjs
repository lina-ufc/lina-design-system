import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const raiz = new URL('../../', import.meta.url).pathname;
createRequire(import.meta.url)('../../assets/lina-feedback.js');
const F = globalThis.LinaFeedback;
const base = { tipo: 'Erro', pagina: 'cores.html', mensagem: 'Contraste baixo', nome: 'Ana', email: 'ana@ufc.br' };

test('tipos e limites iguais aos do Apps Script', () => {
  const ctx = {}; vm.runInNewContext(readFileSync(raiz + 'feedback/apps-script.gs', 'utf8'), ctx);
  assert.deepEqual([...F.TIPOS], [...ctx.TIPOS]);
  assert.deepEqual({ ...F.LIMITES }, { ...ctx.LIMITES });
});
test('valida aceita base e página vazia', () => {
  assert.equal(F.valida(base), null);
  assert.equal(F.valida({ ...base, pagina: '' }), null);
});
test('valida recusa na ordem do script', () => {
  assert.equal(F.valida({ ...base, tipo: 'Elogio', mensagem: '' }), 'tipo');
  for (const [campo, valor, erro] of [['mensagem', ' \n ', 'mensagem'], ['mensagem', 'x'.repeat(2001), 'mensagem'],
    ['nome', '', 'nome'], ['email', 'ana @ufc.br', 'email'], ['email', 'ana@ufc', 'email'], ['pagina', 'x'.repeat(201), 'pagina']])
    assert.equal(F.valida({ ...base, [campo]: valor }), erro);
  assert.equal(F.valida({ ...base, mensagem: 'x'.repeat(2000) }), null);
});
test('corpo leva os seis campos limpos', () => {
  const b = F.corpo({ ...base, nome: '  Ana  ' }, '');
  assert.deepEqual([...b.keys()], ['tipo', 'pagina', 'mensagem', 'nome', 'email', 'site']);
  assert.equal(b.get('nome'), 'Ana');
  assert.equal(F.corpo(base, 'robo').get('site'), 'robo');
});
test('paginaDe tira âncora e caminho', () => {
  assert.equal(F.paginaDe('?pagina=cores.html'), 'cores.html');
  assert.equal(F.paginaDe('?pagina=cores.html%23s-paleta'), 'cores.html');
  assert.equal(F.paginaDe('?pagina=/a/b/cores.html'), 'cores.html');
  assert.equal(F.paginaDe(''), '');
  assert.equal(F.paginaDe('?pagina=' + 'x'.repeat(201)), '');
});
test('envia devolve a resposta do script ou erro de rede', async () => {
  const resp = (corpo, ok = true) => async () => ({ ok, json: async () => JSON.parse(corpo) });
  assert.deepEqual(await F.envia('u', F.corpo(base, ''), resp('{"ok":true}')), { ok: true });
  assert.deepEqual(await F.envia('u', F.corpo(base, ''), resp('{"ok":false,"erro":"tipo"}')), { ok: false, erro: 'tipo' });
  assert.deepEqual(await F.envia('u', F.corpo(base, ''), resp('<!DOCTYPE html>')), { ok: false, erro: 'rede' });
  assert.deepEqual(await F.envia('u', F.corpo(base, ''), resp('{"ok":true}', false)), { ok: false, erro: 'rede' });
  assert.deepEqual(await F.envia('u', F.corpo(base, ''), async () => { throw new TypeError('offline'); }), { ok: false, erro: 'rede' });
});
test('envia faz POST simples, sem cabeçalhos', async () => {
  let pedido; await F.envia('u', F.corpo(base, ''), async (url, op) => { pedido = op; return { ok: true, json: async () => ({ ok: true }) }; });
  assert.equal(pedido.method, 'POST');
  assert.ok(pedido.body instanceof URLSearchParams);
  assert.equal(pedido.headers, undefined);
});
