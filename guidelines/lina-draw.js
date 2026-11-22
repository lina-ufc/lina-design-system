/* Desenho dos diagramas dos cartões. Unidade = meia célula (a célula tem 2 × 2 unidades). */
(function () {
  const G = { ink: '#161616', dark: '#3a3a3a', mid: '#767676', soft: '#adadad', line: '#d4d4d4', faint: '#ececec', paper: '#f5f5f5' };
  const geo = () => window.LinaGeometry, ORDER = ['L', 'I', 'n', 'A'];
  const lx = (k) => { let x = 0; for (const l of ORDER) { if (l === k) return x; x += geo().LETTERS[l].w + geo().LETTER_GAP; } };
  const shape = (blocks, s, ox = 0, oy = 0, r = 0.5) => geo().outlinePath(blocks, r, s, ox, oy);
  const letter = (k, s, ox = 0, oy = 0, r = 0.5) => shape(geo().LETTERS[k].blocks, s, ox, oy, r);
  const wordmark = (s, ox = 0, oy = 0, r = 0.5) => ORDER.map((k) => letter(k, s, ox + lx(k) * s, oy, r)).join(' ');
  const vertical = (s, ox = 0, oy = 0) => [letter('L', s, ox, oy), letter('I', s, ox + 4.5 * s, oy), letter('n', s, ox, oy + 6.5 * s), letter('A', s, ox + 5.5 * s, oy + 6.5 * s)].join(' ');
  const blocksOf = (k, s, ox = 0, oy = 0) => geo().LETTERS[k].blocks.map(([x, y, b]) => ({ x: ox + x * s, y: oy + y * s, w: b * s, h: b * s }));
  const allBlocks = (s, ox = 0, oy = 0) => ORDER.flatMap((k) => blocksOf(k, s, ox + lx(k) * s, oy));
  function grid(x, y, w, h, step, stroke, sw = 1, dash = '') {
    let o = '';
    for (let gx = x; gx <= x + w + 0.01; gx += step) o += '<line x1="' + gx + '" y1="' + y + '" x2="' + gx + '" y2="' + (y + h) + '"/>';
    for (let gy = y; gy <= y + h + 0.01; gy += step) o += '<line x1="' + x + '" y1="' + gy + '" x2="' + (x + w) + '" y2="' + gy + '"/>';
    return '<g stroke="' + stroke + '" stroke-width="' + sw + '"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + ' fill="none">' + o + '</g>';
  }
  const rects = (list, stroke, sw = 1, dash = '4 3', fill = 'none') => '<g fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + sw + '"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + '>' + list.map((r) => '<rect x="' + r.x + '" y="' + r.y + '" width="' + r.w + '" height="' + r.h + '"/>').join('') + '</g>';
  const path = (d, fill, extra = '') => '<path d="' + d + '" fill="' + fill + '" fill-rule="evenodd" ' + extra + '/>';
  const outline = (d, stroke, sw = 1, dash = '4 3') => '<path d="' + d + '" fill="none" stroke="' + stroke + '" stroke-width="' + sw + '"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + '/>';
  const text = (x, y, t, o = {}) => '<text x="' + x + '" y="' + y + '" font-family="Outfit, sans-serif" font-size="' + (o.size || 11) + '" font-weight="' + (o.weight || 500) + '" fill="' + (o.fill || G.mid) + '" text-anchor="' + (o.anchor || 'middle') + '">' + t + '</text>';
  function hdim(x1, x2, y, label, c = G.dark, below = false) {
    const t = 4;
    return '<g stroke="' + c + '" stroke-width="1"><line x1="' + x1 + '" y1="' + y + '" x2="' + x2 + '" y2="' + y + '"/><line x1="' + x1 + '" y1="' + (y - t) + '" x2="' + x1 + '" y2="' + (y + t) + '"/><line x1="' + x2 + '" y1="' + (y - t) + '" x2="' + x2 + '" y2="' + (y + t) + '"/></g>' + (label ? text((x1 + x2) / 2, below ? y + 16 : y - 8, label, { fill: c }) : '');
  }
  function vdim(x, y1, y2, label, c = G.dark, left = false) {
    const t = 4;
    return '<g stroke="' + c + '" stroke-width="1"><line x1="' + x + '" y1="' + y1 + '" x2="' + x + '" y2="' + y2 + '"/><line x1="' + (x - t) + '" y1="' + y1 + '" x2="' + (x + t) + '" y2="' + y1 + '"/><line x1="' + (x - t) + '" y1="' + y2 + '" x2="' + (x + t) + '" y2="' + y2 + '"/></g>' + (label ? text(left ? x - 8 : x + 8, (y1 + y2) / 2 + 4, label, { fill: c, anchor: left ? 'end' : 'start' }) : '');
  }
  const svg = (w, h, inner) => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '" style="display:block;max-width:100%;height:auto">' + inner + '</svg>';
  const mount = (id, html) => { document.getElementById(id).innerHTML = html; };
  // Padrão estático pelo motor de texturas: 1 tinta (accent 0) ou 2 tintas (accent > 0).
  function tex(el, o) {
    const T = window.LinaTexture, gen = (seed, blank) => T.generate({ mode: o.mode, seed, cols: o.cols || 30, rows: o.rows || 22, accent: 0, blank });
    let svg;
    if (o.accent2) {
      // Três cores: duas camadas independentes, cada uma com cerca de um quarto da área; onde se encontram, se misturam.
      const a = gen(o.seed || 1, 0.72), b = gen((o.seed || 1) + 101, 0.76), w = a.W * a.scale, h = a.H * a.scale;
      svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '"><rect width="' + w + '" height="' + h + '" fill="' + o.bg + '"/><path fill="' + o.fg + '" fill-rule="evenodd" d="' + a.base + '"/><path fill="' + o.accent2 + '" fill-rule="evenodd" d="' + b.base + '"/></svg>';
    } else {
      svg = T.toSVG(gen(o.seed || 1, 0.5), { bg: o.bg, fg: o.fg, accent: o.fg });
    }
    el.innerHTML = svg;
    const s = el.querySelector('svg');
    s.removeAttribute('width'); s.removeAttribute('height');
    s.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    s.style.cssText = 'display:block;width:100%;height:100%';
  }
  // O pontilhado, com as mesmas regras de assets/lina-dither-field.js, sobre um campo de tom dado.
  const BAY = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]], SOLID = 0.9, BRIDGE = 0.72, LINE = 0.62;
  function ditherCells(tone, nx, ny) {
    const md = (a, n) => ((a % n) + n) % n, solid = new Uint8Array(nx * ny);
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const k = j * nx + i, t = tone[k];
      let s = t >= SOLID;
      if (!s) s = (t - BRIDGE) / (SOLID - BRIDGE) * 16 > BAY[j % 4][i % 4];
      if (!s && t >= LINE) { const run = 2 + Math.floor((t - LINE) / 0.06); s = md(j, 3) === 0 && md(i + 2 * Math.floor(j / 3), 4) < run; }
      solid[k] = s ? 1 : 0;
    }
    return solid;
  }
  function dither(tone, nx, ny, cell, ink, ox = 0, oy = 0) {
    const solid = ditherCells(tone, nx, ny);
    let out = '';
    const dd = geo().traceBitmap(solid, nx, ny, 0.25, { scale: cell, ox, oy });
    if (dd) out += path(dd, ink);
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const k = j * nx + i, t = tone[k];
      if (solid[k] || t * 16 <= BAY[j % 4][i % 4]) continue;
      let near = false;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const a = i + dx, b = j + dy; if (a >= 0 && b >= 0 && a < nx && b < ny && solid[b * nx + a]) near = true; }
      let size = cell * (0.26 + t * 0.65); if (near) size = Math.min(size, cell / 2);
      const ins = (cell - size) / 2, r = Math.min(size / 2, cell / 4);
      out += '<rect x="' + (ox + i * cell + ins) + '" y="' + (oy + j * cell + ins) + '" width="' + size + '" height="' + size + '" rx="' + r + '" fill="' + ink + '"/>';
    }
    return out;
  }
  window.LD = { BAY, SOLID, BRIDGE, LINE, ditherCells, dither, G, ORDER, lx, shape, letter, wordmark, vertical, blocksOf, allBlocks, grid, rects, path, outline, text, hdim, vdim, svg, mount, tex };
})();
