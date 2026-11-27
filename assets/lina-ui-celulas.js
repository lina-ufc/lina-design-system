/*
  Editor de células (capítulo Logotipo). Células numa grade; o contorno vem de
  LinaGeometry.outlinePath, com raio fixo de ¼ de célula. Ajustes e células ficam só no
  localStorage deste navegador. Só navegador.
  Unidade do editor: 1 = ¼ de célula (célula = 4, meia célula = 2).
*/
(function () {
  'use strict';
  if (typeof document === 'undefined') return;
  const $ = (id) => document.getElementById(id);
  const raiz = $('ec');
  if (!raiz) return;
  const { LinaGeometry: G, LinaPalette: P, LinaFerramenta: F } = window;

  const NS = 'http://www.w3.org/2000/svg';
  const CELL = 4, R = 1; // raio ¼ de célula = 1 unidade
  const COLS = [4, 48], ROWS = [3, 32];
  const MAX = 1000; // illegalBlocks é quadrático: limita antes de renderizar
  const STORE = 'lina-celulas-v1';
  const EXPORT = 50; // 1 unidade = 50 px no SVG: célula = 200 px

  // O letreiro na grade de ¼, com o espaço de ¼ de célula entre as letras do logotipo.
  const LINA = [];
  let x0 = 0;
  for (const k of ['L', 'I', 'n', 'A']) {
    for (const [bx, by, s] of G.LETTERS[k].blocks) LINA.push([x0 + bx * 2, by * 2, s * 2]);
    x0 += (G.LETTERS[k].w + G.LETTER_GAP) * 2;
  }
  const LINA_W = Math.max(...LINA.map(([x, , s]) => x + s));
  const LINA_H = Math.max(...LINA.map(([, y, s]) => y + s));

  const state = { cols: 20, rows: 7, blocks: [], brush: 4, snap: 2, showGrid: true, color: 'ferro' };
  let selected = null, drag = null;
  const history = [], future = [];

  const W = () => state.cols * CELL;
  const H = () => state.rows * CELL;

  // Células que se tocam formam uma forma; dentro dela todas devem ter o mesmo alinhamento
  // de ¼. Devolve as que fogem.
  function illegalBlocks() {
    const b = state.blocks, n = b.length;
    const parent = Array.from({ length: n }, (_, i) => i);
    const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
    const touch = (p, q) => p.x + p.s >= q.x && q.x + q.s >= p.x && p.y + p.s >= q.y && q.y + q.s >= p.y;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (touch(b[i], b[j])) parent[find(i)] = find(j);
    const groups = new Map();
    b.forEach((blk, i) => {
      const g = find(i);
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g).push(blk);
    });
    const bad = [];
    for (const members of groups.values()) {
      const tally = new Map();
      for (const m of members) { const c = (m.x & 1) * 2 + (m.y & 1); tally.set(c, (tally.get(c) || 0) + 1); }
      if (tally.size < 2) continue;
      const major = [...tally.entries()].sort((a, c) => c[1] - a[1])[0][0];
      for (const m of members) if ((m.x & 1) * 2 + (m.y & 1) !== major) bad.push(m);
    }
    return bad;
  }

  /* ---------- desenho ---------- */

  const board = $('ec-board'), forma = $('ec-forma'), grid = $('ec-grid'), marcas = $('ec-marcas'), fantasma = $('ec-fantasma');
  const st = $('ec-status');
  const el = (tag, attrs) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  };
  const NE = 'vector-effect';

  function desenhaGrade() {
    board.setAttribute('viewBox', `-2 -2 ${W() + 4} ${H() + 4}`);
    grid.replaceChildren();
    if (state.showGrid) {
      const cls = (v) => (v % 4 ? (v % 2 ? 'fino' : 'meia') : 'celula');
      for (let x = 1; x < W(); x++) grid.append(el('line', { class: cls(x), x1: x, y1: 0, x2: x, y2: H(), [NE]: 'non-scaling-stroke' }));
      for (let y = 1; y < H(); y++) grid.append(el('line', { class: cls(y), x1: 0, y1: y, x2: W(), y2: y, [NE]: 'non-scaling-stroke' }));
    }
    grid.append(el('rect', { class: 'moldura', x: 0, y: 0, width: W(), height: H(), [NE]: 'non-scaling-stroke' }));
  }

  const acoes = ['ec-desfazer', 'ec-refazer', 'ec-apagar', 'ec-limpar', 'ec-baixar', 'ec-copiar'].map($);
  function render() {
    forma.setAttribute('d', G.outlinePath(state.blocks, R));
    forma.setAttribute('fill', P.COLORS[state.color]);
    marcas.replaceChildren();
    const bad = illegalBlocks();
    const lista = [...(selected ? [['sel', selected]] : []), ...bad.map((b) => ['fora', b])];
    for (const c of ['halo', null]) // contorno claro por baixo de todos: aparece sobre qualquer cor
      for (const [cls, b] of lista)
        marcas.append(el('rect', { class: c || cls, x: b.x, y: b.y, width: b.s, height: b.s, rx: R, [NE]: 'non-scaling-stroke' }));
    const n = state.blocks.length, k = bad.length;
    const texto = n === 0 ? 'Grade vazia. Clique para adicionar uma célula.'
      : k ? `${k} ${k === 1 ? 'célula deslocada' : 'células deslocadas'} ¼ de célula dentro de uma forma.`
        : `${n} ${n === 1 ? 'célula' : 'células'}${n >= MAX ? ' (limite)' : ''}.`;
    if (st.textContent !== texto) st.textContent = texto;
    st.classList.toggle('aviso', k > 0);
    const [desf, ref, apag, limp, baixa, copia] = acoes;
    desf.disabled = !history.length;
    ref.disabled = !future.length;
    apag.disabled = !selected;
    limp.disabled = baixa.disabled = copia.disabled = !n;
    if (document.activeElement && document.activeElement.disabled) board.focus(); // botão que se apagou: foco volta à grade
  }

  function sincroniza() {
    for (const [id, k] of [['ec-brush', 'brush'], ['ec-snap', 'snap']])
      $(id).querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === String(state[k]))));
    const poe = (e, v) => { if (document.activeElement !== e) e.value = v; }; // não reescreve o campo em edição
    $('ec-grade').checked = state.showGrid;
    poe($('ec-cor'), state.color);
    poe($('ec-cols'), state.cols);
    poe($('ec-rows'), state.rows);
  }

  /* ---------- estado e histórico ---------- */

  const snapshot = () => JSON.stringify(state.blocks);
  function save() { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (_) { /* sem armazenamento: segue sem salvar */ } }
  function commit(antes) {
    history.push(antes);
    if (history.length > 300) history.shift();
    future.length = 0;
    save();
  }
  function restaura(json) { state.blocks = JSON.parse(json); selected = null; render(); save(); }
  const desfazer = () => { if (history.length) { future.push(snapshot()); restaura(history.pop()); } };
  const refazer = () => { if (future.length) { history.push(snapshot()); restaura(future.pop()); } };

  // Valida tudo o que veio do localStorage; o que não vale fica no padrão.
  function carrega() {
    let s;
    try { s = JSON.parse(localStorage.getItem(STORE)); } catch (_) { return false; }
    if (!s || !Array.isArray(s.blocks)) return false;
    const inteiro = (v, a, b) => Number.isInteger(v) && v >= a && v <= b;
    if (inteiro(s.cols, ...COLS)) state.cols = s.cols;
    if (inteiro(s.rows, ...ROWS)) state.rows = s.rows;
    if ([2, 4].includes(s.brush)) state.brush = s.brush;
    if ([1, 2, 4].includes(s.snap)) state.snap = s.snap;
    if (typeof s.showGrid === 'boolean') state.showGrid = s.showGrid;
    if (Object.hasOwn(P.COLORS, s.color)) state.color = s.color;
    state.blocks = s.blocks.filter((b) => b && [2, 4].includes(b.s) && inteiro(b.x, 0, W() - b.s) && inteiro(b.y, 0, H() - b.s))
      .slice(0, MAX).map((b) => ({ x: b.x, y: b.y, s: b.s }));
    return true;
  }

  function letreiro() {
    const ox = Math.max(0, Math.floor((W() - LINA_W) / 2)) & ~1;
    const oy = Math.max(0, Math.floor((H() - LINA_H) / 2)) & ~1;
    return LINA.map(([x, y, s]) => ({ x: x + ox, y: y + oy, s }));
  }
  function prende() {
    for (const b of state.blocks) {
      b.x = Math.min(Math.max(0, b.x), W() - b.s);
      b.y = Math.min(Math.max(0, b.y), H() - b.s);
    }
  }
  const dedupe = (keep) => { state.blocks = state.blocks.filter((b) => b === keep || !(b.x === keep.x && b.y === keep.y && b.s === keep.s)); };
  function remove(b) {
    const antes = snapshot();
    state.blocks = state.blocks.filter((x) => x !== b);
    if (selected === b) selected = null;
    commit(antes);
    render();
  }

  /* ---------- ponteiro e teclado ---------- */

  function paraGrade(e) {
    const pt = board.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    return pt.matrixTransform(board.getScreenCTM().inverse());
  }
  const encaixa = (v) => Math.round(v / state.snap) * state.snap;
  const dentro = (p) => p.x >= 0 && p.y >= 0 && p.x < W() && p.y < H();
  function acha(p) {
    for (let i = state.blocks.length - 1; i >= 0; i--) {
      const b = state.blocks[i];
      if (p.x >= b.x && p.x < b.x + b.s && p.y >= b.y && p.y < b.y + b.s) return b;
    }
    return null;
  }
  function posicao(p) {
    const s = state.brush;
    return { x: Math.min(Math.max(0, encaixa(p.x - s / 2)), W() - s), y: Math.min(Math.max(0, encaixa(p.y - s / 2)), H() - s), s };
  }

  board.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    const p = paraGrade(e);
    let b = acha(p);
    const antes = snapshot();
    let criou = false;
    if (!b) {
      if (!dentro(p)) { selected = null; render(); return; }
      if (state.blocks.length >= MAX) return;
      b = posicao(p);
      state.blocks.push(b);
      criou = true;
    } else {
      state.blocks.splice(state.blocks.indexOf(b), 1);
      state.blocks.push(b);
    }
    selected = b;
    drag = { b, dx: p.x - b.x, dy: p.y - b.y, antes, moveu: criou };
    board.setPointerCapture(e.pointerId);
    fantasma.setAttribute('visibility', 'hidden');
    board.style.cursor = 'grabbing';
    render();
  });

  board.addEventListener('pointermove', (e) => {
    const p = paraGrade(e);
    if (drag) {
      const b = drag.b;
      const nx = Math.min(Math.max(0, encaixa(p.x - drag.dx)), W() - b.s);
      const ny = Math.min(Math.max(0, encaixa(p.y - drag.dy)), H() - b.s);
      if (nx !== b.x || ny !== b.y) { b.x = nx; b.y = ny; drag.moveu = true; render(); }
      return;
    }
    const sobre = acha(p);
    if (sobre || !dentro(p)) {
      fantasma.setAttribute('visibility', 'hidden');
      board.style.cursor = sobre ? 'grab' : 'default';
    } else {
      const g = posicao(p);
      for (const [k, v] of Object.entries({ x: g.x, y: g.y, width: g.s, height: g.s })) fantasma.setAttribute(k, v);
      fantasma.setAttribute('visibility', 'visible');
      board.style.cursor = 'crosshair';
    }
  });

  function fimDoArraste() {
    if (!drag) return;
    if (drag.moveu) { dedupe(drag.b); commit(drag.antes); }
    drag = null;
    board.style.cursor = 'grab';
    render();
  }
  board.addEventListener('pointerup', fimDoArraste);
  board.addEventListener('pointercancel', fimDoArraste);
  board.addEventListener('pointerleave', () => { if (!drag) fantasma.setAttribute('visibility', 'hidden'); });

  board.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (e.pointerType === 'touch') return; // toque longo no celular não apaga: há o botão Apagar célula
    const b = acha(paraGrade(e));
    if (b) remove(b);
  });

  board.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'Enter' && !selected) { // sem ponteiro: põe uma célula no centro e seleciona
      e.preventDefault();
      if (state.blocks.length >= MAX) return;
      const antes = snapshot(), b = posicao({ x: W() / 2, y: H() / 2 });
      state.blocks.push(b);
      dedupe(b);
      selected = b;
      commit(antes);
      render();
      return;
    }
    if (!selected) return;
    if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); remove(selected); return; }
    if (e.key === 'Escape') { selected = null; render(); return; }
    const dirs = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    if (!dirs[e.key]) return;
    e.preventDefault();
    const antes = snapshot(), [dx, dy] = dirs[e.key], b = selected;
    const nx = Math.min(Math.max(0, b.x + dx * state.snap), W() - b.s);
    const ny = Math.min(Math.max(0, b.y + dy * state.snap), H() - b.s);
    if (nx !== b.x || ny !== b.y) { b.x = nx; b.y = ny; dedupe(b); commit(antes); render(); }
  });

  window.addEventListener('keydown', (e) => { // desfazer e refazer valem fora dos campos
    if (e.target.matches('input,select,textarea') || !(e.metaKey || e.ctrlKey)) return;
    const k = e.key.toLowerCase();
    if (k === 'z') { e.preventDefault(); if (e.shiftKey) refazer(); else desfazer(); }
    else if (k === 'y') { e.preventDefault(); refazer(); }
  });

  /* ---------- controles ---------- */

  for (const [id, k] of [['ec-brush', 'brush'], ['ec-snap', 'snap']])
    $(id).addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (b) { state[k] = Number(b.dataset.v); sincroniza(); save(); }
    });
  $('ec-grade').addEventListener('change', (e) => { state.showGrid = e.target.checked; desenhaGrade(); save(); });
  $('ec-cor').append(...Object.keys(P.COLORS).map((n) => new Option(n, n)));
  $('ec-cor').addEventListener('change', (e) => { state.color = e.target.value; render(); save(); });

  function redimensiona() {
    const lim = (v, [a, b], padrao) => Math.min(b, Math.max(a, Math.round(Number(v) || padrao)));
    const cols = lim($('ec-cols').value, COLS, state.cols), rows = lim($('ec-rows').value, ROWS, state.rows);
    $('ec-cols').value = cols; $('ec-rows').value = rows; // confirmou: mostra o valor aceito
    if (cols === state.cols && rows === state.rows) return;
    const antes = snapshot();
    state.cols = cols; state.rows = rows;
    prende();
    commit(antes);
    desenhaGrade(); render();
  }
  $('ec-cols').addEventListener('change', redimensiona);
  $('ec-rows').addEventListener('change', redimensiona);

  $('ec-desfazer').addEventListener('click', desfazer);
  $('ec-refazer').addEventListener('click', refazer);
  $('ec-apagar').addEventListener('click', () => selected && remove(selected));
  $('ec-limpar').addEventListener('click', () => {
    if (!state.blocks.length) return;
    const antes = snapshot();
    state.blocks = []; selected = null;
    commit(antes); render();
  });
  $('ec-letreiro').addEventListener('click', () => {
    const antes = snapshot();
    if (W() < LINA_W) { state.cols = Math.ceil(LINA_W / CELL) + 1; sincroniza(); desenhaGrade(); }
    state.blocks = letreiro();
    prende();
    selected = null;
    commit(antes);
    render();
  });

  /* ---------- exportar ---------- */

  function svgFinal() { // recorte ao contorno das células, sem fundo
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const b of state.blocks) {
      x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y);
      x1 = Math.max(x1, b.x + b.s); y1 = Math.max(y1, b.y + b.s);
    }
    const d = G.outlinePath(state.blocks, R, EXPORT, -x0 * EXPORT, -y0 * EXPORT);
    const w = (x1 - x0) * EXPORT, h = (y1 - y0) * EXPORT;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">\n` +
      `  <path fill="${P.COLORS[state.color]}" fill-rule="evenodd" d="${d}"/>\n</svg>\n`;
  }
  $('ec-baixar').addEventListener('click', () => F.baixar('lina-celulas.svg', svgFinal()));
  $('ec-copiar').addEventListener('click', () => F.copiar(svgFinal(), st));

  /* ---------- início ---------- */

  if (!carrega()) state.blocks = letreiro();
  prende();
  sincroniza();
  desenhaGrade();
  render();
})();
