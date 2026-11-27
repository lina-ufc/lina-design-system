/*
  LINA image filter: turns a photo into LINA geometry.

  Units: 1 unit = ¼ cell. The photo becomes a darkness map. Dither is the landing
  banner's pattern toned by the photo, the one filter outside the rule: its dots vary
  in size. Scatter and field are the texture generators with the photo's tone in the
  noise's place, so they keep to the rule. Ink is split in two tone bands (dark, mid),
  each with its own colour; light is the paper.
*/
(function (root) {
  'use strict';

  const Geo = root.LinaGeometry;

  const Pal = root.LinaPalette;

  // Duos of the palette module in the old shape.
  const PALETTES = Pal.combos('duo').map(([bg, fg]) => (
    { name: `${fg} sobre ${bg}`, bg: Pal.COLORS[bg], fg: Pal.COLORS[fg] }));

  const DEFAULTS = {
    mode: 'dither', detail: 84,
    brightness: 0, contrast: 0, midtones: 0.35, cutoff: 0.08, smooth: 0.3, invert: false, radius: 0.25,
  };

  const CELL = 4;
  const DARK = 0.5; // ink at or above this tone is `escuros`, below it `médios`
  const TONES = ['ferro', 'ferro', 'creme'];
  const inBand = (band, t) => !band || (t >= DARK) === (band === 'dark');
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  /* ---------- source ---------- */

  // Luminance as a summed-area table, so any box average costs four lookups.
  // Transparent pixels count as white paper.
  function prepare(imageData) {
    const { width: w, height: h, data } = imageData;
    const W = w + 1;
    const sat = new Float64Array(W * (h + 1));
    for (let y = 0; y < h; y++) {
      let row = 0;
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const a = data[i + 3] / 255;
        row += ((0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255) * a + (1 - a);
        sat[(y + 1) * W + x + 1] = sat[y * W + x + 1] + row;
      }
    }
    return { w, h, sat };
  }

  function boxMean(src, x0, y0, x1, y1) {
    const ax = clamp(Math.floor(x0), 0, src.w - 1), ay = clamp(Math.floor(y0), 0, src.h - 1);
    const bx = clamp(Math.ceil(x1), ax + 1, src.w), by = clamp(Math.ceil(y1), ay + 1, src.h);
    const W = src.w + 1, s = src.sat;
    return (s[by * W + bx] - s[ay * W + bx] - s[by * W + ax] + s[ay * W + ax]) / ((bx - ax) * (by - ay));
  }

  // Darkness of a box in output units: 0 is paper, 1 is full ink.
  function sampler(src, U, V, p) {
    // Uniform scale: never stretch; a strip under one row at the bottom is cropped.
    const sx = src.w / U, sy = sx;
    const blur = p.smooth * CELL;
    const k = Math.exp(p.contrast * 1.6);
    // Lifting the midtones opens up faces and skin without greying the blacks.
    const gamma = Math.pow(2, p.midtones * 1.2);
    return (x, y, w, h) => {
      let L = boxMean(src, (x - blur) * sx, (y - blur) * sy, (x + w + blur) * sx, (y + h + blur) * sy);
      if (p.invert) L = 1 - L;
      const d = Math.pow(clamp((0.5 - L) * k + 0.5 - p.brightness * 0.5, 0, 1), gamma);
      return d <= p.cutoff ? 0 : (d - p.cutoff) / (1 - p.cutoff);
    };
  }

  /* ---------- filters ---------- */

  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

  // The landing banner's pattern, toned by the photo, one tile per cell. Dark tiles become solid
  // cells whose union is traced by the rule; below that the rim is Bayer-dithered into cells
  // meeting at corners, and a band of mid-dark tones draws one-cell lines along the image's
  // contours. Other tiles hold a dot sized by the tone, the banner's declared exception; next to
  // a solid a dot stays at half a cell, so the gap to the solid stays ¼ cell.
  function dither(src, p) {
    const SOLID = 0.9, BRIDGE = 0.72, LINE = 0.62;
    const nx = Math.max(4, Math.round(p.detail));
    const ny = rows(nx, src, 1);
    const U = nx * CELL, V = ny * CELL, N = nx * ny;
    const sample = sampler(src, U, V, p);
    const tone = new Float32Array(N);
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) tone[j * nx + i] = sample(i * CELL, j * CELL, CELL, CELL);
    const at = (i, j) => tone[clamp(j, 0, ny - 1) * nx + clamp(i, 0, nx - 1)];
    const mod = (a, n) => ((a % n) + n) % n;
    const solid = new Uint8Array(N);
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const k = j * nx + i, t = tone[k];
      let s = t >= SOLID || (t - BRIDGE) / (SOLID - BRIDGE) > BAYER[(j & 3) * 4 + (i & 3)];
      if (!s && t >= LINE) {
        // Lines run along the contour, across the tone gradient.
        const gx = at(i + 1, j) - at(i - 1, j), gy = at(i, j + 1) - at(i, j - 1);
        const [a, b] = Math.abs(gx) > 2 * Math.abs(gy) ? [j, i] : Math.abs(gy) > 2 * Math.abs(gx) ? [i, j] : gx * gy > 0 ? [i, i + j] : [i, i - j];
        s = mod(b, 3) === 0 && mod(a + 2 * Math.floor(b / 3), 4) < 2 + Math.floor((t - LINE) / 0.06);
      }
      solid[k] = s ? 1 : 0;
    }
    const size = new Float32Array(N);
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const k = j * nx + i, t = tone[k];
      if (solid[k] || t <= BAYER[(j & 3) * 4 + (i & 3)]) continue;
      let s = 0.26 + t * 0.65;
      for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
        const ii = i + di, jj = j + dj;
        if (ii >= 0 && jj >= 0 && ii < nx && jj < ny && solid[jj * nx + ii]) s = Math.min(s, 0.5);
      }
      size[k] = s;
    }
    const f = (v) => Math.round(v * 1000) / 1000;
    const draw = (radius, scale, band) => {
      const C = CELL * scale;
      const part = band ? solid.map((v, k) => (v && inBand(band, tone[k]) ? 1 : 0)) : solid;
      let d = Geo.traceBitmap(part, nx, ny, radius, { scale: C });
      for (let k = 0; k < N; k++) {
        if (!size[k] || !inBand(band, tone[k])) continue;
        const i = k % nx, j = (k - i) / nx, s = size[k] * C, r = f(Math.min(s / 2, radius * C));
        const x = i * C + (C - s) / 2, y = j * C + (C - s) / 2;
        d += `M${f(x + r)} ${f(y)}H${f(x + s - r)}A${r} ${r} 0 0 1 ${f(x + s)} ${f(y + r)}` +
          `V${f(y + s - r)}A${r} ${r} 0 0 1 ${f(x + s - r)} ${f(y + s)}H${f(x + r)}` +
          `A${r} ${r} 0 0 1 ${f(x)} ${f(y + s - r)}V${f(y + r)}A${r} ${r} 0 0 1 ${f(x + r)} ${f(y)}Z`;
      }
      return d;
    };
    return { U, V, draw, label: `${nx} × ${ny} células` };
  }

  // Scatter and field: the texture generators, the photo's tone in place of blank and noise.
  // The grid is the photo's cells, cut at the frame; `steps` 1 lets half-cell blocks follow the edge.
  const texture = (kind) => (src, p) => {
    const T = root.LinaTexture && root.LinaTexture.engine;
    if (!T) throw new Error('Dispersão e campo precisam do lina-texture.js.');
    const nx = Math.max(4, Math.round(p.detail));
    const ny = rows(nx, src, 1);
    const U = nx * CELL, V = ny * CELL;
    const F = T.makeField(U, V, 'cut');
    const tone = sampler(src, U, V, p);
    if (kind === 'scatter') T.scatter(F, { clump: 0.6, steps: 0.5, quarter: 0 }, 1, tone);
    else T.fieldMode(F, { steps: 1 }, 1, tone);
    T.fillPinholes(F);
    const draw = (radius, scale, band) => {
      const ink = new Uint8Array(U * V);
      for (let k = 0; k < ink.length; k++) ink[k] = F.bits[k] && inBand(band, F.tone[k]) ? 1 : 0;
      return Geo.traceBitmap(ink, U, V, radius * CELL, { scale });
    };
    return { U, V, draw, label: `${nx} × ${ny} células` };
  };

  // Whole rows that fit the image at `cols` across; too flat for `min` rows would mean stretching.
  function rows(cols, src, min) {
    const n = Math.floor((cols * src.h) / src.w + 1e-9);
    if (n < min) throw new Error('Imagem baixa demais para este detalhe: aumente detail ou use imagem mais alta.');
    return n;
  }

  const FILTERS = { dither, scatter: texture('scatter'), field: texture('field') };

  function process(src, options) {
    const p = Object.assign({}, DEFAULTS, options);
    return (FILTERS[p.mode] || dither)(src, p);
  }

  // A result's outline in output units times `scale`, corners rounded by `radius` cells;
  // `band` ('dark' | 'mid') keeps only the ink of that tone band.
  function outline(res, radius, scale = 1, band) {
    return res.draw(radius, scale, band);
  }

  /* ---------- public contract ---------- */

  const MODES = ['dither', 'scatter', 'field'];
  const f2 = (v) => Math.round(v * 100) / 100;

  // params: { mode, detail, brightness, contrast, midtones, cutoff, smooth, invert, tones, width },
  // fractions in 0–1. tones = [escuros, médios, claros], each a colour name or 'none' (transparent);
  // light is the paper behind the ink. The old `colors: [bg, fg]` still works, becomes
  // [fg, fg, bg] and adds a warning. Mapping to the engine's options:
  //   detail 0–1 -> cells across 20–160; brightness, contrast, midtones 0–1 -> -1..1 (0.5 is neutral);
  //   cutoff, smooth 0–1 -> as is; invert boolean. Radius stays 0.25 cell.
  function fromParams(params) {
    const warnings = [];
    let tones = params.tones ?? (params.colors === undefined ? TONES : null);
    if (!tones) {
      const r = Pal.check(params.colors);
      if (!r.ok) throw new Error(r.reason);
      if (r.kind === 'trio') throw new Error('Imagem usa 2 cores (fundo e tinta); um trio não se aplica.');
      tones = [params.colors[1], params.colors[1], params.colors[0]];
      warnings.push(`colors ficou obsoleto: use tones=${tones.join(',')}.`);
    }
    const t = Pal.checkTones(tones);
    if (!t.ok) throw new Error(t.reason);
    const mode = params.mode || DEFAULTS.mode;
    if (!MODES.includes(mode)) throw new Error(`Modo desconhecido: "${mode}". Modos válidos: ${MODES.join(', ')}.`);
    const options = { mode, radius: 0.25 };
    for (const k of ['detail', 'brightness', 'contrast', 'midtones', 'cutoff', 'smooth']) {
      const v = params[k];
      if (v !== undefined && !(v >= 0 && v <= 1)) throw new Error(`${k} é fração de 0 a 1, veio ${v}.`);
    }
    const signed = (v) => (v - 0.5) * 2;
    if (params.detail !== undefined) options.detail = Math.round(20 + params.detail * 140);
    for (const k of ['brightness', 'contrast', 'midtones'])
      if (params[k] !== undefined) options[k] = signed(params[k]);
    for (const k of ['cutoff', 'smooth', 'invert']) if (params[k] !== undefined) options[k] = params[k];
    return { options, tones: tones.map((n) => (n === 'none' ? null : Pal.COLORS[n])), warnings };
  }

  // SVG with exactly `params.width`; the height is whole rows of cells, set by the image's ratio.
  // A `none` band draws no fill; equal dark and mid colours are one path; different ones draw all the
  // ink in the mid colour and the dark ink over it, so no seam shows where the bands meet.
  function render(imageData, params) {
    const { options, tones: [dark, mid, light] } = fromParams(params);
    const width = params.width ?? 1080;
    if (!(width > 0) || !Number.isFinite(width)) throw new Error(`width precisa de número maior que 0, veio ${width}.`);
    const res = process(prepare(imageData), options);
    const scale = width / res.U;
    const w = f2(width), h = f2(res.V * scale);
    const path = (fill, band) => (fill ? `  <path fill="${fill}" fill-rule="evenodd" d="${outline(res, options.radius, scale, band)}"/>\n` : '');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">\n` +
      (light ? `  <rect width="${w}" height="${h}" fill="${light}"/>\n` : '') +
      (dark === mid ? path(dark) : path(mid, dark ? undefined : 'mid') + path(dark, 'dark')) + '</svg>\n';
  }

  root.LinaImage = { PALETTES, DEFAULTS, prepare, process, outline, CELL, fromParams, render };
})(typeof window !== 'undefined' ? window : globalThis);
