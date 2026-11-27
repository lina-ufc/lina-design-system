/*
  Interface do gerador de padrões (capítulo Padrões). Liga os controles #gp-… ao
  LinaTexture.render e guarda os ajustes no endereço (LinaFerramenta). Só navegador.
*/
(function () {
  'use strict';
  if (typeof document === 'undefined') return;
  const $ = (id) => document.getElementById(id);
  const raiz = $('gp');
  if (!raiz) return;
  const { LinaTexture, LinaPalette, LinaFerramenta: F } = window;
  const ESQ = F.ESQUEMAS.textura;

  const FORMATOS = { '1:1': [1, 1], '4:5': [4, 5], '16:9': [16, 9], '9:16': [9, 16] };
  const MODOS = { // controle que só vale em certos padrões, como no original
    steps: 'scatter field', quarter: 'scatter', clump: 'scatter', grain: 'field dither', stretch: 'field dither',
  };
  const NOMES = Object.keys(LinaPalette.COLORS);
  const sorteia = (l) => l[Math.floor(Math.random() * l.length)];

  const lido = F.lerHash(location.hash, ESQ);
  const p = lido.params;
  let avisos = lido.avisos;
  let svg = '';

  const linhas = () => Math.max(4, Math.round(p.cells * p.height / p.width));
  const pct = (v) => Math.round(v * 100) + '%';
  const saidas = {
    cells: () => `${p.cells} × ${linhas()}`,
    grain: () => String(p.grain).replace('.', ',') + (p.grain === 1 ? ' célula' : ' células'),
  };

  for (const s of raiz.querySelectorAll('select')) {
    s.append(...NOMES.map((n) => new Option(n, n)));
  }

  function sincroniza() {
    const marca = (id, atual) => $(id).querySelectorAll('button').forEach((b) =>
      b.setAttribute('aria-pressed', String(b.dataset.v === String(atual(b.dataset.v)))));
    marca('gp-modo', () => p.mode);
    marca('gp-edges', () => p.edges);
    marca('gp-qtd', () => p.colors.length);
    marca('gp-formato', (v) => { // aperta o formato cuja altura bate com a largura atual
      const [a, b] = FORMATOS[v];
      return Math.abs(p.height - Math.round(p.width * b / a)) <= 1 ? v : '';
    });
    const poe = (el, v) => { if (document.activeElement !== el) el.value = v; }; // não reescreve o campo em edição
    poe($('gp-seed'), p.seed);
    poe($('gp-largura'), p.width);
    poe($('gp-altura'), p.height);
    $('gp-pinholes').checked = p.pinholes;
    raiz.querySelectorAll('[data-k]').forEach((i) => {
      const k = i.dataset.k;
      poe(i, i.dataset.pct !== undefined ? p[k] * 100 : p[k]);
      raiz.querySelector(`[data-out="${k}"]`).value = (saidas[k] || (() => pct(p[k])))();
    });
    raiz.querySelectorAll('[data-modos]').forEach((f) => { f.disabled = !f.dataset.modos.split(' ').includes(p.mode); });
    raiz.querySelector('[data-cores]').disabled = p.colors.length < 3;
    raiz.querySelectorAll('[data-c]').forEach((s) => {
      s.disabled = +s.dataset.c >= p.colors.length;
      if (!s.disabled) poe(s, p.colors[+s.dataset.c]);
    });
  }

  const acoes = ['gp-baixar', 'gp-copiar', 'gp-link', 'gp-cmd'].map($);
  function desenha() {
    let info;
    try {
      const menor = Math.min(p.width, p.height), maior = Math.max(p.width, p.height);
      if (menor < 64 || maior / menor > 8)
        throw new Error(`Tamanho ${p.width} × ${p.height} px fora do limite: lado menor a partir de 64 px e proporção até 8:1.`);
      svg = LinaTexture.render(p);
      $('gp-prancha').innerHTML = svg;
      const s = $('gp-prancha').firstElementChild;
      s.removeAttribute('width'); s.removeAttribute('height'); // largura 100 %, altura auto: nunca distorce
      s.style.cssText = 'display:block;width:100%;height:auto';
      info = `${p.cells} × ${linhas()} células.`;
      acoes.forEach((b) => { b.disabled = false; });
    } catch (e) { // par recusado etc.: a prévia anterior fica
      info = e.message;
      acoes.forEach((b) => { b.disabled = true; });
    }
    const texto = [...avisos, info].join(' ');
    if ($('gp-status').textContent !== texto) $('gp-status').textContent = texto;
  }

  let quadro = 0;
  function muda() {
    avisos = [];
    sincroniza();
    const h = F.escreverHash(p, ESQ);
    history.replaceState(null, '', location.pathname + location.search + (h ? '#' + h : ''));
    cancelAnimationFrame(quadro);
    quadro = requestAnimationFrame(desenha);
  }

  const grupo = (id, k, conv = (v) => v) => $(id).addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b) { p[k] = conv(b.dataset.v); muda(); }
  });
  grupo('gp-modo', 'mode');
  grupo('gp-edges', 'edges');
  $('gp-formato').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    const [a, c] = FORMATOS[b.dataset.v];
    p.height = Math.round(p.width * c / a);
    muda();
  });
  $('gp-qtd').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.v === '2') p.colors = p.colors.slice(0, 2);
    else if (p.colors.length < 3) {
      const [fundo, forma] = p.colors;
      const c = NOMES.find((n) => LinaPalette.check([fundo, forma, n]).ok);
      p.colors = c ? [fundo, forma, c] : sorteia(LinaPalette.combos('trio'));
    }
    muda();
  });
  raiz.querySelectorAll('[data-c]').forEach((s) => s.addEventListener('change', () => {
    p.colors = p.colors.slice();
    p.colors[+s.dataset.c] = s.value;
    muda();
  }));
  $('gp-sortear').addEventListener('click', () => {
    p.colors = sorteia(LinaPalette.combos(p.colors.length === 3 ? 'trio' : 'duo'));
    muda();
  });
  $('gp-nova').addEventListener('click', () => { p.seed = Math.floor(Math.random() * 1e6); muda(); });
  $('gp-seed').addEventListener('input', (e) => {
    const n = Number(e.target.value);
    if (e.target.value !== '' && Number.isInteger(n) && n >= 0) { p.seed = n; muda(); }
  });
  for (const [id, k] of [['gp-largura', 'width'], ['gp-altura', 'height']])
    $(id).addEventListener('change', (e) => { // só ao confirmar: digitar "1" a caminho de "1080" não renderiza
      const n = Math.round(Number(e.target.value));
      if (n > 0) { p[k] = n; muda(); }
    });
  raiz.querySelectorAll('[data-k]').forEach((i) => i.addEventListener('input', () => {
    p[i.dataset.k] = Number(i.value) / (i.dataset.pct !== undefined ? 100 : 1);
    muda();
  }));
  $('gp-pinholes').addEventListener('change', (e) => { p.pinholes = e.target.checked; muda(); });

  const st = $('gp-status');
  $('gp-baixar').addEventListener('click', () => F.baixar(`lina-textura-${p.mode}-${p.seed}.svg`, svg));
  $('gp-copiar').addEventListener('click', () => F.copiar(svg, st));
  $('gp-link').addEventListener('click', () =>
    F.copiar(location.href.split('#')[0] + (F.escreverHash(p, ESQ) ? '#' + F.escreverHash(p, ESQ) : ''), st));
  $('gp-cmd').addEventListener('click', () => F.copiar(F.comando('textura', p), st));

  sincroniza();
  desenha();
})();
