// Checagem do núcleo paramétrico (param.js) e da lista de layouts gerada. Uso: node check.js
const assert = require('node:assert/strict');
const fs = require('fs');
const { resolve, contido } = require('./param.js');

const FAM = {
  '9.1 Teste': { faixa: [1, 6], unidade: 'itens', campo: 'Item', numera: true },
  '9.2 Fixo': {},
};
const ALIAS = {
  '9.0 Velho': { para: '9.1 Teste', conv: (f) => ({ itens: f.Itens.split('\n') }) },
  '9.9 Morto': { erro: "'9.9 Morto' saiu; use '9.2 Fixo'" },
};
const R = (m, f) => resolve(m, f, FAM, ALIAS);

let r = R('9.1 Teste', { itens: ['a', 'b'] });
assert.equal(r.name, '9.1 Teste · 2 itens');
assert.deepEqual(r.fill, { 'Item 1': 'a', 'Item 2': 'b', 'Número 1': '01', 'Número 2': '02' });
assert.equal(R('9.1 Teste', { itens: [{ Item: 'a', Descrição: 'd' }] }).fill['Descrição 1'], 'd');
assert.equal(R('9.1 Teste · 3 itens', { 'Item 1': 'x' }).n, 3);
assert.equal(R('9.0 Velho', { Itens: 'a\nb\nc' }).name, '9.1 Teste · 3 itens');
assert.throws(() => R('9.9 Morto', {}), /use '9.2 Fixo'/);
assert.throws(() => R('9.3 Nada', {}), /não existe/);
assert.throws(() => R('9.1 Teste', { itens: Array(7).fill('x') }), /aceita 1–6 itens, recebeu 7/);
assert.equal(R('9.1 Teste', { 'Item 1': 'a', 'Item 2': 'b', 'Item 3': 'c' }).n, 3);
assert.deepEqual(R('9.1 Teste', { itens: ['a'] }).itens, ['a']);
assert.equal(R('9.2 Fixo', { Título: 't' }).name, '9.2 Fixo');

assert.deepEqual(contido([0, 0, 200, 100], 100, 100), [50, 0, 100, 100]);
assert.deepEqual(contido([0, 0, 100, 200], 200, 100), [0, 75, 100, 50]);

// Lista de layouts gerada pelo build (se já existir): família 1 nova, nomes antigos fora, ordem numérica.
const f = require('path').join(__dirname, 'out/layouts.json');
if (fs.existsSync(f)) {
  const nomes = JSON.parse(fs.readFileSync(f)).map((l) => l.name);
  for (const n of ['1.1 Abertura', '1.2 Capa', '1.4 Sumário · 4 itens', '1.5 Seção', '2.2 Colunas · 2 colunas', '2.4 Linha do tempo · 10 marcos', '2.5 Equação', '3.2 Ícones · processo · 8 etapas', '4.5 Imagens em linha · 4 imagens', '4.8 Equipe · 14 pessoas', '5.3 Números-chave · 4 números', '5.5 Tabela · texto', '6.2 Encerramento · autores · 8 autores']) assert(nomes.includes(n), `falta ${n}`);
  for (const n of ['1.4 Capa · autores', '1.6 Sumário · lista', '1.7 Seção', '2.3 Três colunas', '2.5 Conclusões', '2.2 Duas colunas', '2.4 Equação', '3.3 Ícones · lista e imagem', '4.9 Vídeo', '4.6 Três imagens']) assert(!nomes.includes(n), `sobrou ${n}`);
  const chave = (n) => [...n.split(' ')[0].split('.').map(Number), Number((/ · (\d+) /.exec(n) || [0, 0])[1])];
  const ord = [...nomes].sort((a, b) => { const x = chave(a), y = chave(b); return x[0] - y[0] || x[1] - y[1] || x[2] - y[2]; });
  assert.deepEqual(nomes, ord, 'layouts fora de ordem numérica');
}
console.log('check ok');
