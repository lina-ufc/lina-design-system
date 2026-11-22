/*
  <lina-dither-field> — o campo pontilhado animado do LINA, como componente.

  Tom vindo de ruído de Perlin (Ken Perlin, improved noise, 2002). Os pontos crescem com o tom;
  nos tons escuros tornam-se células inteiras cuja união é traçada pela regra do logotipo
  (lina-geometry.js). A borda de uma união é pontilhada em células que se encontram pelos cantos —
  o pescoço do L. Nos tons médios, linhas curtas de uma célula juntam os pontos.

  As cores se misturam: sólidos de cores distintas se encostam e se sobrepõem, e a fronteira entre
  regiões cromáticas é onde a mistura acontece. Permanecem a célula como unidade, o raio fixo de ¼
  do passo, o encolhimento do ponto vizinho de um sólido e o respeito a prefers-reduced-motion.

  Atributos
    colors     lista de cores separadas por vírgula (2 a 5). Padrão: ferro, umbro, turquesa.
    background cor de fundo. Padrão: transparente (o fundo da página aparece).
    cell       passo da retícula em px. Padrão: 11 (9 abaixo de 600px de largura).
    speed      multiplicador de velocidade. Padrão: 1.
    still      se presente, desenha um único quadro, sem animação.
    outline    se presente, desenha só os contornos (sem preenchimento); valor = espessura em px.
    design-width  largura de referência em px. Se presente, o campo é desenhado como se tivesse essa
               largura e depois escalado ao tamanho real: cell e o ruído acompanham a escala (útil em
               palcos com transform: scale, como o deck HTML, para manter o desenho da trama estática).
    seed       semente do ruído. Número: fixa o desenho. Outro texto (ex.: "capa"): todos os campos da página com
               o mesmo texto sorteiam a mesma semente e, com os mesmos atributos, mostram o mesmo quadro ao mesmo
               tempo (troca de slide sem salto). Padrão: sorteio próprio.
    density    0 a 0,4. Equilíbrio automático: fração de células sólidas; tom e cores
               redistribuídos para que cada recorte tenha sólido, linha, ponto e todas as tintas. Padrão: 0.
*/
(() => {
  const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
  const NB = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
  const mod = (n, m) => ((n % m) + m) % m;
  const mulberry32 = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (t, a, b) => a + t * (b - a);
  const grad = (h, x, y, z) => {
    const g = h & 15, u = g < 8 ? x : y, v = g < 4 ? y : (g === 12 || g === 14 ? x : z);
    return ((g & 1) ? -u : u) + ((g & 2) ? -v : v);
  };

  function makeNoise(seed) {
    const rnd = mulberry32(seed);
    const perm = new Uint8Array(512);
    const p = Array.from({ length: 256 }, (_, i) => i);
    for (let i = 255; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
    for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
    return function noise(x, y, z) {
      const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
      x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
      const u = fade(x), v = fade(y), w = fade(z);
      const A = perm[X] + Y, AA = perm[A] + Z, AB = perm[A + 1] + Z;
      const B = perm[X + 1] + Y, BA = perm[B] + Z, BB = perm[B + 1] + Z;
      return lerp(w,
        lerp(v, lerp(u, grad(perm[AA], x, y, z), grad(perm[BA], x - 1, y, z)),
                lerp(u, grad(perm[AB], x, y - 1, z), grad(perm[BB], x - 1, y - 1, z))),
        lerp(v, lerp(u, grad(perm[AA + 1], x, y, z - 1), grad(perm[BA + 1], x - 1, y, z - 1)),
                lerp(u, grad(perm[AB + 1], x, y - 1, z - 1), grad(perm[BB + 1], x - 1, y - 1, z - 1))));
    };
  }

  class LinaDitherField extends HTMLElement {
    connectedCallback() {
      // Com o atributo fill, o campo se cola ao pai posicionado (banner de altura total);
      // sem ele, ocupa o espaço que o seu próprio style definir.
      this.style.display = this.style.display || 'block';
      if (this.hasAttribute('fill')) {
        Object.assign(this.style, { position: 'absolute', left: '0', top: '0', width: '100%', height: '100%' });
      } else if (!this.style.position) {
        this.style.position = 'relative';
      }
      this.style.overflow = 'hidden';
      if (!this.canvas) {
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('aria-hidden', 'true');
        Object.assign(this.canvas.style, { display: 'block', position: 'absolute', inset: '0', width: '100%', height: '100%' });
        this.appendChild(this.canvas);
      }
      if (!this.noise) {
        const sa = this.getAttribute('seed'), rnd = () => Math.floor(Math.random() * 4294967296);
        const seeds = (window.__ldfSeeds = window.__ldfSeeds || {});
        this.noise = makeNoise(sa == null ? rnd() : isNaN(+sa) ? (seeds[sa] = seeds[sa] ?? rnd()) : +sa);
      }
      this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.visible = true;
      // O tamanho do elemento só se resolve depois desta batida (o pai posicionado pode ainda
      // não ter altura), então o desenho é rearmado a cada medida nova, não apenas aqui.
      if (!this.observer) {
        this.observer = new ResizeObserver(() => { this.draw(this.lastTime || 0); this.run(); });
      }
      this.observer.observe(this);
      if ('IntersectionObserver' in window) {
        if (!this.io) {
          this.io = new IntersectionObserver(([e]) => { this.visible = e.isIntersecting; if (this.visible) this.run(); }, { threshold: 0 });
        }
        this.io.observe(this);
      }
      this.draw(0);
      requestAnimationFrame(() => { this.draw(0); this.run(); });
      this.run();
    }

    disconnectedCallback() {
      if (this.frame) cancelAnimationFrame(this.frame);
      this.frame = 0;
      this.running = false;
      this.observer && this.observer.unobserve(this);
      this.io && this.io.unobserve(this);
    }

    get palette() {
      const raw = (this.getAttribute('colors') || '#A81F0D,#2A1A12,#64B6AC').split(',').map((s) => s.trim()).filter(Boolean);
      return raw.length ? raw : ['#A81F0D'];
    }

    // O laço é guardado por um booleano marcado DENTRO do passo executado. Guardar pelo id do
     // requestAnimationFrame não serve: o id é verdadeiro mesmo quando a primeira chamada nunca
     // acontece, e aí o laço fica preso sem nunca se reagendar.
    run() {
      if (this.running || !this.visible || this.reduced || this.hasAttribute('still')) return;
      let last = 0;
      const step = (time) => {
        this.running = true;
        const q = time - (time % 40); // quadros em múltiplos de 40 ms: campos irmãos desenham o mesmo instante
        if (q !== last) { this.draw(q); last = q; }
        this.frame = requestAnimationFrame(step);
      };
      this.frame = requestAnimationFrame(step);
    }

    draw(time = 0) {
      this.lastTime = time;
      const box = this.getBoundingClientRect();
      if (!box.width || !box.height) return;
      const ratio = Math.min(devicePixelRatio || 1, 2);
      const dw = parseFloat(this.getAttribute('design-width'));
      const w = dw > 0 ? dw : Math.max(240, Math.round(box.width));
      const h = dw > 0 ? Math.round(dw * box.height / box.width) : Math.max(180, Math.round(box.height));
      const k = dw > 0 ? box.width / dw : 1;
      const canvas = this.canvas;
      canvas.width = Math.round(w * k * ratio); canvas.height = Math.round(h * k * ratio);
      const ctx = canvas.getContext('2d');
      ctx.scale(ratio * k, ratio * k);

      const bg = this.getAttribute('background');
      if (bg) { ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h); }

      const colors = this.palette, K = colors.length;
      // outline: só contornos, sem preenchimento; o valor é a espessura do traço em px (padrão 1,25)
      const outline = this.hasAttribute('outline');
      if (outline) { ctx.lineWidth = parseFloat(this.getAttribute('outline')) || 1.25; ctx.lineJoin = 'round'; }
      const attrCell = parseFloat(this.getAttribute('cell'));
      const cell = attrCell > 0 ? attrCell : (w < 600 ? 9 : 11);
      const speed = parseFloat(this.getAttribute('speed')) || 1;
      const t = time * 0.00015 * speed, S = 420;
      const SOLID = 0.9, BRIDGE = 0.72, LINE = 0.62;
      const noise = this.noise;
      const fbm = (x, y, z) => (noise(x, y, z) + noise(x * 2, y * 2, z * 2) * 0.5 + noise(x * 4, y * 4, z * 4) * 0.25) / 1.75;

      // density (0 a 0,4): equilíbrio automático. O tom e a cor são redistribuídos por posição
      // (percentil), de modo que a fração 'density' das células fica sólida, o resto se espalha
      // por ponte, linha e ponto, e cada tinta ocupa uma parte igual — em qualquer recorte e semente.
      const density = Math.max(0, Math.min(0.4, parseFloat(this.getAttribute('density')) || 0));
      const SN = density ? Math.min(S, Math.max(w, h) * 0.55) : S;
      // parado: cores em escala do recorte, todas presentes; em movimento: escala ampla, as cores entram e saem
      const still = this.hasAttribute('still') || this.reduced;
      const CS = density && still ? Math.min(S * 1.7, Math.max(w, h) * 0.6) : S * 1.7;
      const nx = Math.ceil((w + cell) / cell), ny = Math.ceil((h + cell) / cell), N = nx * ny;
      const tone = new Float32Array(N), side = new Uint8Array(N), solid = new Uint8Array(N), hue = new Float32Array(N);
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
        const k = j * nx + i, x = i * cell, y = j * cell;
        tone[k] = fbm(x / SN, y / SN, t);
        hue[k] = noise(x / CS + 31.7, y / CS - 17.3, t * (still ? 0.7 : 1.6));
      }
      const rank = (arr) => { const idx = Array.from(arr.keys()).sort((p, q) => arr[p] - arr[q]); const r = new Float32Array(arr.length); idx.forEach((v, n) => { r[v] = n / (arr.length - 1); }); return r; };
      if (density) {
        const pr = rank(tone), cut = 1 - density;
        for (let k = 0; k < N; k++) { const p = pr[k]; tone[k] = p < cut ? 0.12 + 0.76 * Math.pow(p / cut, 0.85) : 0.9 + 0.1 * (p - cut) / density; }
        // a cor é repartida em partes iguais dentro dos sólidos e dentro do resto, separadamente
        if (!still) for (let k = 0; k < N; k++) side[k] = Math.min(K - 1, Math.floor(Math.min(0.999, Math.max(0, (hue[k] * 1.5 + 1) / 2)) * K));
        else for (const solidGroup of [true, false]) {
          const ids = []; for (let k = 0; k < N; k++) if ((tone[k] >= SOLID) === solidGroup) ids.push(k);
          ids.sort((p, q) => hue[p] - hue[q]);
          ids.forEach((k, n) => { side[k] = Math.min(K - 1, Math.floor(n / Math.max(1, ids.length) * K)); });
        }
      } else {
        for (let k = 0; k < N; k++) { tone[k] = Math.min(1, Math.max(0.06, 0.45 + tone[k] * 1.6)); side[k] = Math.min(K - 1, Math.floor((hue[k] + 1) / 2 * K)); }
      }
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
        const k = j * nx + i, x = i * cell, y = j * cell;
        let s = tone[k] >= SOLID;
        if (!s) s = (tone[k] - BRIDGE) / (SOLID - BRIDGE) * 16 > BAYER[j % 4][i % 4];
        if (!s && tone[k] >= LINE) {
          const o = noise(x / SN + 71.1, y / SN + 13.9, t * 0.5);
          const [a, b] = o < -0.12 ? [i, j] : o > 0.12 ? [j, i] : [i, i - j];
          const run = 2 + Math.floor((tone[k] - LINE) / 0.06);
          s = mod(b, 3) === 0 && mod(a + 2 * Math.floor(b / 3), 4) < run;
        }
        solid[k] = s ? 1 : 0;
      }

      // As cores PODEM se misturar: nada é apagado por encostar numa cor diferente.
      const near = new Uint8Array(nx * ny);
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
        const k = j * nx + i;
        if (solid[k]) continue;
        for (const [dx, dy] of NB) {
          const ii = i + dx, jj = j + dy;
          if (ii < 0 || ii >= nx || jj < 0 || jj >= ny) continue;
          if (solid[jj * nx + ii]) { near[k] = 1; break; }
        }
      }

      for (let c = 0; c < K; c++) {
        const mask = new Uint8Array(nx * ny);
        for (let k = 0; k < mask.length; k++) mask[k] = solid[k] && side[k] === c ? 1 : 0;
        const d = window.LinaGeometry.traceBitmap(mask, nx, ny, 0.25, { scale: cell });
        if (d) { ctx.fillStyle = ctx.strokeStyle = colors[c]; outline ? ctx.stroke(new Path2D(d)) : ctx.fill(new Path2D(d)); }
      }

      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
        const k = j * nx + i;
        if (solid[k]) continue;
        if (tone[k] * 16 <= BAYER[j % 4][i % 4]) continue;
        ctx.fillStyle = ctx.strokeStyle = colors[side[k]];
        let size = cell * (0.26 + tone[k] * 0.65);
        if (near[k]) size = Math.min(size, cell / 2);
        const inset = (cell - size) / 2, x = i * cell, y = j * cell;
        ctx.beginPath();
        ctx.roundRect(x + inset, y + inset, size, size, Math.min(size / 2, cell / 4));
        outline ? ctx.stroke() : ctx.fill();
      }
    }
  }

  if (!customElements.get('lina-dither-field')) customElements.define('lina-dither-field', LinaDitherField);
})();
