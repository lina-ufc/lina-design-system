/*
  Interface do filtro de pontilhado (capítulo Imagem). Liga os controles #fi-… ao
  LinaImage.render e guarda os ajustes no endereço (LinaFerramenta). A foto nunca sai do
  navegador nem vai para o endereço. Só navegador.
*/
(function () {
  'use strict';
  if (typeof document === 'undefined') return;
  const $ = (id) => document.getElementById(id);
  const raiz = $('fi');
  if (!raiz) return;
  const { LinaImage, LinaPalette, LinaFerramenta: F } = window;
  const ESQ = F.ESQUEMAS.imagem;

  const LADO = 1600; // lado maior da foto decodificada
  const LARGURA = [16, 8192]; // saída em px: o motor aceita > 0; fora disso o SVG não serve a ninguém
  const NOMES = Object.keys(LinaPalette.COLORS);
  const sorteia = (l) => l[Math.floor(Math.random() * l.length)];

  const lido = F.lerHash(location.hash, ESQ);
  const p = lido.params;
  let avisos = lido.avisos;
  let svg = '', foto = null, nome = '';

  // Na tela: pct = 0–100 %, sin = −100…100 (0,5 da URL é o zero).
  const CONV = {
    pct: [(v) => Math.round(v * 100), (v) => v / 100],
    sin: [(v) => Math.round((v - 0.5) * 200), (v) => (v + 100) / 200],
  };
  const saidas = {
    detail: () => `${Math.round(20 + p.detail * 140)} células`,
    brightness: (v) => v, contrast: (v) => v, midtones: (v) => v,
    cutoff: (v) => v + '%', smooth: (v) => v + '%',
  };

  for (const s of raiz.querySelectorAll('select')) s.append(...NOMES.map((n) => new Option(n, n)));

  function sincroniza() {
    const marca = (id, atual) => $(id).querySelectorAll('button').forEach((b) =>
      b.setAttribute('aria-pressed', String(b.dataset.v === atual)));
    marca('fi-modo', p.mode);
    marca('fi-dither', p.dither);
    const poe = (el, v) => { if (document.activeElement !== el) el.value = v; }; // não reescreve o campo em edição
    poe($('fi-largura'), p.width);
    $('fi-invert').checked = p.invert;
    raiz.querySelectorAll('[data-k]').forEach((i) => {
      const k = i.dataset.k, v = CONV[i.dataset.c][0](p[k]);
      poe(i, v);
      const o = raiz.querySelector(`[data-out="${k}"]`);
      const t = k === 'detail' ? saidas.detail() : saidas[k](v);
      if (o.value !== t) o.value = t;
    });
    raiz.querySelectorAll('[data-modos]').forEach((f) => { f.disabled = !f.dataset.modos.split(' ').includes(p.mode); });
    raiz.querySelectorAll('[data-cor]').forEach((s) => poe(s, p.colors[+s.dataset.cor]));
  }

  const acoes = ['fi-baixar', 'fi-copiar'].map($);
  function desenha() {
    if (!foto) { // sem foto: só a frase na prévia
      const t = avisos.join(' ');
      if ($('fi-status').textContent !== t) $('fi-status').textContent = t;
      return;
    }
    let info;
    try {
      if (!(p.width >= LARGURA[0] && p.width <= LARGURA[1]))
        throw new Error(`Largura ${p.width} px fora do limite: de ${LARGURA[0]} a ${LARGURA[1]} px.`);
      svg = LinaImage.render(foto, p);
      $('fi-prancha').innerHTML = svg;
      const s = $('fi-prancha').firstElementChild;
      const [, , w, h] = s.getAttribute('viewBox').split(' ');
      s.removeAttribute('width'); s.removeAttribute('height'); // largura 100 %, altura auto: nunca distorce
      s.style.cssText = 'display:block;width:100%;height:auto';
      info = `${w} × ${h} px.`;
      acoes.forEach((b) => { b.disabled = false; });
    } catch (e) { // motor recusou: a prévia anterior fica
      info = e.message;
      acoes.forEach((b) => { b.disabled = true; });
    }
    const texto = [...avisos, info].join(' ');
    if ($('fi-status').textContent !== texto) $('fi-status').textContent = texto;
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

  // Decodifica e reduz a LADO px no lado maior, sem distorcer.
  let leitura = 0;
  async function carrega(arquivo) {
    const eu = ++leitura;
    let bmp;
    try {
      bmp = await createImageBitmap(arquivo);
      const k = Math.min(1, LADO / Math.max(bmp.width, bmp.height));
      const c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(bmp.width * k));
      c.height = Math.max(1, Math.round(bmp.height * k));
      const g = c.getContext('2d', { willReadFrequently: true });
      g.drawImage(bmp, 0, 0, c.width, c.height);
      const dados = g.getImageData(0, 0, c.width, c.height);
      if (eu !== leitura) return;
      foto = dados; nome = arquivo.name || '';
      avisos = [];
      desenha();
    } catch (e) { // arquivo ilegível: a foto anterior fica
      if (eu !== leitura) return;
      avisos = ['Não foi possível ler este arquivo como imagem.'];
      desenha();
    } finally { if (bmp) bmp.close(); }
  }

  const grupo = (id, k) => $(id).addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b) { p[k] = b.dataset.v; muda(); }
  });
  grupo('fi-modo', 'mode');
  grupo('fi-dither', 'dither');
  raiz.querySelectorAll('[data-k]').forEach((i) => i.addEventListener('input', () => {
    p[i.dataset.k] = CONV[i.dataset.c][1](Number(i.value));
    muda();
  }));
  $('fi-invert').addEventListener('change', (e) => { p.invert = e.target.checked; muda(); });
  $('fi-largura').addEventListener('change', (e) => { // só ao confirmar: digitar "1" a caminho de "1080" não renderiza
    const n = Math.round(Number(e.target.value));
    if (n > 0) { p.width = n; muda(); }
  });
  raiz.querySelectorAll('[data-cor]').forEach((s) => s.addEventListener('change', () => {
    p.colors = p.colors.slice();
    p.colors[+s.dataset.cor] = s.value;
    muda();
  }));
  $('fi-sortear').addEventListener('click', () => { p.colors = sorteia(LinaPalette.combos('duo')); muda(); });

  $('fi-arquivo').addEventListener('change', (e) => { if (e.target.files[0]) carrega(e.target.files[0]); });
  const prancha = $('fi-prancha');
  prancha.addEventListener('dragover', (e) => e.preventDefault());
  prancha.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) carrega(e.dataTransfer.files[0]);
  });
  document.addEventListener('paste', (e) => {
    const f = [...(e.clipboardData?.files || [])].find((x) => x.type.startsWith('image/'));
    if (f) carrega(f);
  });

  const st = $('fi-status');
  $('fi-baixar').addEventListener('click', () => F.baixar(`lina-imagem-${p.mode}.svg`, svg));
  $('fi-copiar').addEventListener('click', () => F.copiar(svg, st));
  $('fi-link').addEventListener('click', () =>
    F.copiar(location.href.split('#')[0] + (F.escreverHash(p, ESQ) ? '#' + F.escreverHash(p, ESQ) : ''), st));
  $('fi-cmd').addEventListener('click', () => F.copiar(F.comando('imagem', p, nome || undefined), st));

  sincroniza();
  desenha();
  if (location.hash.includes('=')) raiz.parentElement.scrollIntoView(); // link com ajustes: abre na seção
})();
