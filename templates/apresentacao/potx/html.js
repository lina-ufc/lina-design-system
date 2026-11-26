// Gera o deck HTML a partir dos mesmos layouts e exemplos de build.js, para que .pptx e .html mostrem a mesma coisa.
// Unidades: build.js guarda caixas em polegadas (1 pol = 144 px de referência) e fontes em pt (1 pt = 2 px).
const fs = require('fs');
const path = require('path');

const PX = (inch) => +(inch * 144).toFixed(2);
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const hex = (c) => (c && !c.startsWith('#') ? '#' + c : c);

module.exports = function toHTML({ layouts, slides, out, C, F, W, FOOT_Y, M, R }) {
  const imgDir = path.join(path.dirname(out), 'img');
  fs.mkdirSync(imgDir, { recursive: true });
  const img = (p) => { const n = path.basename(p); fs.copyFileSync(p, path.join(imgDir, n)); return 'img/' + n; };

  const font = (o) => `font-family:'${o.fontFace || F.light}';font-size:${(o.fontSize || 18) * 2}px;color:${hex(o.color || C.umbro)}`;
  const box = (o) => `left:${PX(o.x)}px;top:${PX(o.y)}px;width:${PX(o.w)}px;height:${PX(o.h)}px`;

  // Texto: string (\n separa parágrafos) ou lista de trechos com breakLine.
  const paras = (v) => {
    if (!Array.isArray(v)) return String(v).split('\n').map((t) => [{ text: t, options: {} }]);
    const ps = [[]];
    for (const r of v) { ps[ps.length - 1].push(r); if (r.options && r.options.breakLine) ps.push([]); }
    return ps.filter((p) => p.length);
  };
  const run = (r) => {
    const o = r.options || {}, st = [];
    if (o.fontFace) st.push(`font-family:'${o.fontFace}'`);
    if (o.color) st.push(`color:${hex(o.color)}`);
    if (o.fontSize) st.push(`font-size:${o.fontSize * 2}px`);
    if (o.italic) st.push('font-style:italic');
    const t = st.length ? `<span style="${st.join(';')}">${esc(r.text)}</span>` : esc(r.text);
    return o.hyperlink ? `<a href="${esc(o.hyperlink.url)}" style="color:inherit${o.underline && o.underline.style === 'none' ? ';text-decoration:none' : ''}">${t}</a>` : t;
  };
  const textBox = (o, v) => {
    const lh = (o.lineSpacingMultiple || 1) * 1.2, after = (o.paraSpaceAfter || 0) * 2;
    const jc = { top: 'flex-start', middle: 'center', bottom: 'flex-end' }[o.valign || 'top'];
    const pad = o.margin ? o.margin * 2 : 0;
    const bg = o.fill ? `background:${hex(o.fill.color)};` : '';
    const sh = (o.shape === 'ellipse' ? 'border-radius:50%;' : o.rectRadius ? `border-radius:${PX(o.rectRadius)}px;` : '') + (o.line && o.line.color ? `border:${o.line.width * 2}px solid ${hex(o.line.color)};` : ''); // formas (célula da linha do tempo)
    const ps = paras(v).map((p) => `<p style="margin:0 0 ${after}px">${p.map(run).join('')}</p>`).join('');
    // Entrelinha menor que 1: o DeckCraft sobe a primeira linha mais que o navegador. Calibrado no número da seção
    // (371 px, 0,85): sem isto o HTML desce 21 px. ponytail: fator empírico, refazer se mudar fonte ou renderizador.
    const dy = (o.lineSpacingMultiple || 1) < 1 ? (1 - o.lineSpacingMultiple) * 0.38 * o.fontSize * 2 : 0;
    return `<div style="position:absolute;${box(o)};margin-top:${-dy.toFixed(1)}px;box-sizing:border-box;padding:${pad}px;${bg}${sh}display:flex;flex-direction:column;justify-content:${jc};` +
      `text-align:${o.align || 'left'};${font(o)};line-height:${lh}">${ps}</div>`;
  };
  // Mesma regra de post.py: espaços de imagem que não sangram têm cantos de 22 px.
  const radius = (o) => {
    const [x, y, w, h] = [o.x, o.y, o.w, o.h].map(PX);
    return x <= 0 || y <= 0 || x + w >= W - 1 || Math.min(w, h) <= 120 ? 0 : R;
  };

  const chart = (o, c) => {
    const w = PX(o.w), h = PX(o.h), s = c.series, labels = s[0].labels, n = labels.length;
    const all = s.flatMap((x) => x.values), max = Math.ceil(Math.max(...all) / 2) * 2;
    const top = c.opts.showLegend ? 70 : 40, bot = 50, left = c.type === 'line' ? 60 : 10, ph = h - top - bot, pw = w - left - 10;
    const Y = (v) => top + ph * (1 - v / max), X0 = (i) => left + pw * (i + 0.5) / n;
    const t = (x, y, txt, a = 'middle') => `<text x="${x}" y="${y}" text-anchor="${a}" font-family="${F.light}" font-size="28" fill="#${C.umbro}">${esc(txt)}</text>`;
    let g = '';
    if (c.type === 'line') {
      for (let v = 0; v <= max; v += 2) g += `<line x1="${left}" x2="${w}" y1="${Y(v)}" y2="${Y(v)}" stroke="#${C.fio}" stroke-width="2"/>` + t(left - 14, Y(v) + 9, v, 'end');
      s.forEach((x, k) => { g += `<polyline fill="none" stroke="#${c.opts.chartColors[k]}" stroke-width="6" stroke-linejoin="round" points="${x.values.map((v, i) => `${X0(i)},${Y(v)}`).join(' ')}"/>`; });
      g += s.map((x, k) => `<rect x="${w / 2 - 170 + k * 190}" y="16" width="18" height="18" fill="#${c.opts.chartColors[k]}"/>` + t(w / 2 - 144 + k * 190, 33, x.name, 'start')).join('');
    } else {
      const bw = pw / n * (1 - c.opts.barGapWidthPct / 140);
      s[0].values.forEach((v, i) => { g += `<rect x="${X0(i) - bw / 2}" y="${Y(v)}" width="${bw}" height="${top + ph - Y(v)}" fill="#${c.opts.chartColors[i]}"/>` + t(X0(i), Y(v) - 12, v); });
      g += `<line x1="${left}" x2="${w}" y1="${top + ph}" y2="${top + ph}" stroke="#${C.fioForte}" stroke-width="2"/>`;
    }
    g += labels.map((l, i) => t(X0(i), h - 14, l)).join('');
    return `<svg style="position:absolute;${box(o)}" viewBox="0 0 ${w} ${h}">${g}</svg>`;
  };

  const table = (t) => {
    const o = t.opts, cols = o.colW.map((c) => `<col style="width:${PX(c)}px">`).join('');
    const cell = (c, j) => { const co = c.options, b = co.border[2];
      return `<td style="width:${PX(o.colW[j])}px;height:${PX(o.rowH)}px;padding:0;vertical-align:middle;font-family:'${co.fontFace}';color:${hex(co.color)};border-bottom:${b.pt * 2}px solid ${hex(b.color)}">${Array.isArray(c.text) ? c.text.map(run).join('') : esc(c.text)}</td>`; };
    return `<table style="position:absolute;left:${PX(o.x)}px;top:${PX(o.y)}px;width:${PX(o.w)}px;border-collapse:collapse;table-layout:fixed;font-size:${o.fontSize * 2}px">` +
      `<colgroup>${cols}</colgroup>${t.rows.map((r) => `<tr>${r.map((c, j) => cell(c, j)).join('')}</tr>`).join('')}</table>`;
  };

  const obj = (o) => {
    if (o.rect) return `<div style="position:absolute;${box(o.rect)};background:${hex(o.rect.fill.color)}"></div>`;
    if (o.image) return `<img src="${img(o.image.path)}" alt="" style="position:absolute;${box(o.image)}">`;
    if (o.line) { const l = o.line; return l.w ? `<div style="position:absolute;left:${PX(l.x)}px;top:${PX(l.y) - l.line.width}px;width:${PX(l.w)}px;border-top:${l.line.width * 2}px solid ${hex(l.line.color)}"></div>`
      : `<div style="position:absolute;left:${PX(l.x) - l.line.width}px;top:${PX(l.y)}px;height:${PX(l.h)}px;border-left:${l.line.width * 2}px solid ${hex(l.line.color)}"></div>`; }
    if (o.text) { const t = o.text.options; return `<div style="position:absolute;${box(t)};box-sizing:border-box;border-radius:${t.shape === 'ellipse' ? '50%' : PX(t.rectRadius) + 'px'};background:${hex(t.fill.color)};${t.line && t.line.color ? `border:${t.line.width * 2}px solid ${hex(t.line.color)}` : ''}"></div>`; }
    return '';
  };

  const sections = slides.map((sl, i) => {
    const L = layouts[sl.master], phs = {};
    // loop (full: true = tela cheia, ou caixa {x,y,w,h} só do HTML; bg: cor das sobras), primeiro no slide (rodapé e demais objetos por cima), toca sozinho, mudo, sem controles.
    // O runtime do deck descarta loop/muted/on*: quem toca é o laço em componentDidMount (marca: autoplay).
    let body = sl.media.filter((m) => m.loop).map((m) => `<video src="${img(m.path)}" poster="${img(m.poster)}" autoplay loop muted playsinline style="position:absolute;${m.full === true ? 'inset:0;width:100%;height:100%' : box(m.full || m)};object-fit:contain;background:${m.bg || '#000'}"></video>`).join('');
    for (const o of L.objects) {
      if (o.placeholder) { phs[o.placeholder.options.name] = o.placeholder.options; continue; }
      body += obj(o);
    }
    for (const [k, v] of Object.entries(sl.fill)) {
      const o = phs[k];
      if (v && v.img) body += `<img src="${img(v.img)}" alt="" style="position:absolute;${box(v.box)};object-fit:cover;border-radius:${o ? radius(o) : 0}px">`;
      else if (v && v.media) continue;
      else body += textBox(o, v);
    }
    for (const c of sl.charts) body += chart(phs[c.opts.placeholder], c);
    for (const t of sl.tables) body += table(t);
    for (const [v, o] of sl.texts) body += textBox(o, v);
    // anim 'aleatorio': as imagens entram em fade, uma a uma, em ordem sorteada a cada build.
    const ord = sl.images.map((_, k) => k).sort(() => Math.random() - 0.5), D = {};
    ord.forEach((k, n) => { D[k] = sl.anim === 'aleatorio' ? `;--d:${(0.15 + n * 0.06).toFixed(2)}s` : ''; });
    sl.images.forEach((m, k) => { body += `<img src="${img(m.path)}" alt="" style="position:absolute;${box(m)};object-fit:cover${D[k]}">`; });
    if (sl.html) body += sl.html;
    for (const m of sl.media) if (!m.loop) body += `<video src="${img(m.path)}" poster="${img(m.poster)}" controls style="position:absolute;${box(m)};object-fit:contain;background:#000"></video>`;
    if (L.foot) {
      body += `<div style="position:absolute;left:132px;top:${FOOT_Y + 22}px;height:40px;display:flex;align-items:center;font-family:'${F.medium}';font-size:20px;color:#${C.creme}">${esc(process.env.FOOT || 'Título abreviado do trabalho')}</div>`;
      body += `<div style="position:absolute;left:${W - M - 120}px;top:${FOOT_Y + 22}px;width:120px;height:40px;display:flex;align-items:center;justify-content:flex-end;font-family:'${F.mono}';font-size:20px;color:#${C.creme}">${i + 1}</div>`;
    }
    const bg = L.bg.path ? `background:url(${img(L.bg.path)}) center/cover` : `background:#${L.bg.color}`;
    // Tramas da capa, encerramento e seção: o PNG fica como fundo de reserva; por cima, o mesmo campo animado
    // (receita de render.html: célula 12 num palco de 1324 px, design-width mantém a escala em qualquer tela).
    const TRAMA = { 'trama-capa.png': 'colors="#8A1A0B,#8A1A0B" background="#A81F0D"', 'trama-secao.png': 'colors="#A81F0D,#A81F0D" background="#8A1A0B" outline="1.25"' };
    const tr = L.bg.path && TRAMA[path.basename(L.bg.path)];
    // seed="capa": abertura e capa sorteiam a mesma semente e desenham o mesmo quadro, então a troca não salta.
    if (tr) body = `<lina-dither-field ${tr} seed="${path.basename(L.bg.path, '.png')}" density=".2" cell="12" design-width="1324" aria-hidden="true" style="position:absolute;inset:0;width:${W}px;height:1080px"></lina-dither-field>\n` + body;
    const anim = /^1\.[23] /.test(sl.master) ? ' class="entra"' : sl.anim ? ` class="${sl.anim}"` : '';
    return `<section${anim} data-label="${esc(sl.master)}" data-screen-label="${String(i + 1).padStart(2, '0')} ${esc(sl.master)}" style="position:relative;overflow:hidden;${bg}">\n${body}\n</section>`;
  });

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="./support.js"></script>
<script src="./lina-geometry.js"></script>
<script src="./lina-dither-field.js"></script>
</head>
<body>
<x-dc>
<!-- GERADO por potx/build.js + potx/html.js. Não edite à mão: mude build.js e rode make.sh; o .pptx e este HTML saem juntos. -->
<!-- @template name="Apresentação LINA" description="Mesmos layouts e exemplos do LINA-Apresentacao.potx. Tecla G mostra a grade modular." -->
<helmet><style>
body{margin:0}
section p{margin:0}
/* Grade modular: margem 72 nas laterais e no topo; embaixo, calha 24 até o rodapé de 84. Faixa do rótulo 72–108; módulos de 132 a 972: 12 col de 126 × 6 linhas de 120, calha 24. */
html.grade section::before{content:'';position:absolute;left:72px;right:72px;top:72px;height:36px;pointer-events:none;z-index:99;background:rgba(255,140,0,.28)}
html.grade section::after{content:'';position:absolute;inset:132px 72px 108px;pointer-events:none;z-index:99;background:repeating-linear-gradient(90deg,rgba(0,150,255,.16) 0 126px,transparent 126px 150px),repeating-linear-gradient(180deg,rgba(0,150,255,.16) 0 120px,transparent 120px 144px)}
@media print{html.grade section::after{display:none}}
/* Capa: a trama continua (vem da abertura); os demais elementos entram em cena, em sequência. Sem movimento com redução de movimento e na impressão. */
@keyframes entra{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
@keyframes aparece{from{opacity:0}to{opacity:1}}
@media screen and (prefers-reduced-motion:no-preference){section.aleatorio[data-deck-active]>img[style*="--d"]{animation:aparece .7s ease both;animation-delay:var(--d)}}
@keyframes entra-img{from{opacity:0;transform:translateX(-48px) scale(.97)}to{opacity:1;transform:none}}
@media screen and (prefers-reduced-motion:no-preference){
section.entra[data-deck-active]>:not(lina-dither-field){animation:entra .8s cubic-bezier(.2,.8,.2,1) both}
section.entra[data-deck-active]>img:not([src*="logo-"]){animation:entra-img 1.2s cubic-bezier(.2,.8,.2,1) .1s both}
section.entra[data-deck-active]>img[src*="logo-h"]{animation-delay:.2s}
section.entra[data-deck-active]>div:nth-of-type(1){animation-delay:.45s}
section.entra[data-deck-active]>div:nth-of-type(2){animation-delay:.6s}
section.entra[data-deck-active]>div:nth-of-type(n+3){animation-delay:.85s}
section.entra[data-deck-active]>img[src*="logo-ufc"],section.entra[data-deck-active]>img[src*="logo-iaud"]{animation-delay:1.05s}
}
</style></helmet>
<x-import component-from-global-scope="deck-stage" from="./deck-stage.js" width="1920" height="1080" hint-size="100%,100%">
${sections.join('\n')}
</x-import>
</x-dc>
<script type="text/x-dc" data-dc-script data-props="{&quot;grade&quot;:{&quot;editor&quot;:&quot;boolean&quot;,&quot;default&quot;:false,&quot;tsType&quot;:&quot;boolean&quot;}}">
class Component extends DCLogic {
  apply() { if (this.props.grade) document.documentElement.classList.add('grade'); }
  // Grade: botão no canto ou tecla G (clique no slide antes, para o foco ficar na prévia).
  componentDidMount() {
    const toggle = () => document.documentElement.classList.toggle('grade');
    if (!window.__grade) {
      window.__grade = true;
      window.addEventListener('keydown', (e) => {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        if (e.key === 'g' || e.key === 'G') toggle();
        // F: entra e sai da tela cheia
        if (e.key === 'f' || e.key === 'F') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
        // H: mostra/esconde as miniaturas (atributo no-rail do <deck-stage>)
        if (e.key === 'h' || e.key === 'H') document.querySelector('deck-stage')?.toggleAttribute('no-rail');
      }, true);
      // Tela cheia esconde as miniaturas; ao sair, voltam.
      document.addEventListener('fullscreenchange', () => document.querySelector('deck-stage')?.toggleAttribute('no-rail', !!document.fullscreenElement));
      // Vídeo em loop: mudo (senão o navegador bloqueia), toca só no slide ativo.
      // ponytail: checa a cada 300 ms; trocar por evento slidechange se pesar.
      setInterval(() => document.querySelectorAll('video[autoplay]').forEach((v) => {
        v.muted = true; v.loop = true;
        const on = !!v.closest('[data-deck-active]');
        if (on && v.paused) v.play().catch(() => {}); else if (!on && !v.paused) v.pause();
      }), 300);
    }
    this.apply();
  }
  componentDidUpdate() { this.apply(); }
  renderVals() { return {}; }
}
</script>
</body>
</html>
`;
  fs.writeFileSync(out, html);
  return sections.length;
};
