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
  // Cores escolhidas → faixas [escuros, médios, claros]: 1 → [a,-,-]; 2 → [a,a,b]; 3 → [a,b,c].
  const paraTons = (c) => (c.length === 1 ? [c[0], 'none', 'none'] : c.length === 2 ? [c[0], c[0], c[1]] : c);
  const produto = (n) => (n === 1 ? NOMES.map((a) => [a]) : produto(n - 1).flatMap((l) => NOMES.map((a) => [...l, a])));

  const lido = F.lerHash(location.hash, ESQ);
  const p = lido.params;
  let avisos = lido.avisos;
  const antigo = new URLSearchParams(location.hash.replace(/^#/, '')); // link velho com colors=fundo,tinta
  if (antigo.has('colors') && !antigo.has('tones')) {
    const c = antigo.get('colors').split(',');
    if (c.length === 2 && LinaPalette.check(c).ok) {
      p.tones = [c[1], c[1], c[0]];
      avisos.push(`colors ficou obsoleto: use tones=${p.tones.join(',')}.`);
    } else avisos.push('colors: não vale; ficou o padrão.');
  }
  let cores = [...new Set(p.tones.filter((t) => t !== 'none'))].slice(0, 3); // cores escolhidas, na ordem das faixas
  const ILEGIVEL = 'Não foi possível ler este arquivo como imagem.';
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

  for (const s of raiz.querySelectorAll('[data-cor]')) s.append(...NOMES.map((n) => new Option(n, n)));

  function sincroniza() {
    const marca = (id, atual) => $(id).querySelectorAll('button').forEach((b) =>
      b.setAttribute('aria-pressed', String(b.dataset.v === String(atual))));
    marca('fi-modo', p.mode);
    marca('fi-qtd', cores.length);
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
    raiz.querySelectorAll('[data-cor]').forEach((s) => {
      s.disabled = +s.dataset.cor >= cores.length;
      if (!s.disabled) poe(s, cores[+s.dataset.cor]);
    });
    const ops = ['none', ...cores].join();
    raiz.querySelectorAll('[data-tom]').forEach((s) => {
      if (s.dataset.ops !== ops) { // só refaz a lista se mudou
        s.replaceChildren(...[...cores, 'none'].map((n) => new Option(n === 'none' ? 'Transparente' : n, n)));
        s.dataset.ops = ops;
      }
      poe(s, p.tones[+s.dataset.tom]);
    });
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
      info = `${Math.round(w)} × ${Math.round(h)} px.`;
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
      avisos = avisos.filter((a) => a !== ILEGIVEL); // os avisos do endereço ficam
      desenha();
    } catch (e) { // arquivo ilegível: a foto anterior fica
      if (eu !== leitura) return;
      avisos = [ILEGIVEL];
      desenha();
    } finally { if (bmp) bmp.close(); }
  }

  const grupo = (id, k) => $(id).addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b) { p[k] = b.dataset.v; muda(); }
  });
  grupo('fi-modo', 'mode');
  raiz.querySelectorAll('[data-k]').forEach((i) => i.addEventListener('input', () => {
    p[i.dataset.k] = CONV[i.dataset.c][1](Number(i.value));
    muda();
  }));
  $('fi-invert').addEventListener('change', (e) => { p.invert = e.target.checked; muda(); });
  $('fi-largura').addEventListener('change', (e) => { // só ao confirmar: digitar "1" a caminho de "1080" não renderiza
    const n = Math.round(Number(e.target.value));
    if (n > 0) { p.width = n; muda(); }
  });
  const poeCores = (c) => { cores = c; p.tones = paraTons(c); muda(); };
  $('fi-qtd').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    const n = +b.dataset.v;
    if (n <= cores.length) return poeCores(cores.slice(0, n));
    const novo = cores.slice();
    while (novo.length < n) { // acrescenta a primeira cor que o conjunto aceita
      const c = NOMES.find((x) => LinaPalette.checkTones(paraTons([...novo, x])).ok);
      novo.push(c || sorteia(NOMES));
    }
    poeCores(novo);
  });
  raiz.querySelectorAll('[data-cor]').forEach((s) => s.addEventListener('change', () => {
    const velha = cores[+s.dataset.cor];
    cores = cores.slice();
    cores[+s.dataset.cor] = s.value;
    p.tones = p.tones.map((t) => (t === velha ? s.value : t)); // as faixas que usavam a cor seguem a nova
    muda();
  }));
  raiz.querySelectorAll('[data-tom]').forEach((s) => s.addEventListener('change', () => {
    p.tones = p.tones.slice();
    p.tones[+s.dataset.tom] = s.value;
    muda();
  }));
  $('fi-sortear').addEventListener('click', () => {
    const ok = produto(cores.length).filter((c) => new Set(c).size === c.length && LinaPalette.checkTones(paraTons(c)).ok);
    poeCores(sorteia(ok));
  });

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

  // Foto de exemplo: abre com ela; o caminho vai no comando para o terminal reproduzir.
  const EXEMPLO = 'capitulos/imagem/img/exemplo.jpg';
  async function exemplo() {
    try { carrega(new File([await (await fetch(EXEMPLO)).blob()], EXEMPLO)); } catch (_) { /* aberto do disco: fica a prévia vazia */ }
  }
  $('fi-exemplo').addEventListener('click', exemplo);

  sincroniza();
  desenha();
  exemplo();
  if (location.hash.includes('=')) raiz.parentElement.scrollIntoView(); // link com ajustes: abre na seção
})();
